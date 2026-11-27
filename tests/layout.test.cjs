'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const source = fs.readFileSync(
  path.join(__dirname, '..', 'script.user.js'),
  'utf8'
);

// Run the actual userscript functions without starting its browser runtime.
function extractFunction(name) {
  const start = source.indexOf(`  function ${name}(`);
  assert.ok(start >= 0, `Missing userscript function: ${name}`);
  const end = source.indexOf('\n  }\n', start);
  assert.ok(end > start, `Cannot extract function: ${name}`);
  return source.slice(start, end + 5);
}

function createStyle(initialValue = '', priority = '') {
  let value = initialValue;
  let currentPriority = priority;
  let writes = 0;

  return {
    get writes() { return writes; },
    getPropertyValue() { return value; },
    getPropertyPriority() { return currentPriority; },
    setProperty(_name, nextValue, nextPriority = '') {
      writes += 1;
      value = nextValue;
      currentPriority = nextPriority;
    },
    removeProperty() {
      writes += 1;
      value = '';
      currentPriority = '';
    }
  };
}

function createHarness() {
  const runtime = {
    sizedPane: null,
    sizedPaneOriginalValue: '',
    sizedPaneOriginalPriority: '',
    sizedPaneAppliedValue: '',
    observedPane: null,
    marked: new Map()
  };
  const settings = { enabled: true, wide: true, widenComposer: true };
  let activePane = null;
  const context = {
    runtime,
    settings,
    ATTR: { turn: 'turn', composer: 'composer' },
    CONFIG: { widthTolerancePx: 16, widthToleranceRatio: 0.02 },
    window: { innerHeight: 900 },
    markMutationIntent() {},
    resolveActivePane() { return activePane; },
    getVisibleRect(element) { return element?.rect || null; },
    getExpectedContentWidthPx(width) { return Math.max(0, width - 32); },
    isWideActive() { return settings.enabled && settings.wide; },
    findVisibleManagedElement(attribute) {
      return Array.from(runtime.marked.get(attribute) || [])[0] || null;
    }
  };

  vm.createContext(context);
  for (const name of [
    'restoreSizedPane',
    'syncSizedPane',
    'isCanonicalComposer',
    'getPaneOverflow',
    'inspectConversationPosition',
    'verifyAppliedWidths'
  ]) {
    vm.runInContext(extractFunction(name), context, { filename: 'script.user.js' });
  }

  return {
    context,
    runtime,
    settings,
    setPane(pane) { activePane = pane; }
  };
}

test('pane width follows the measured pane and restores existing inline CSS', () => {
  const h = createHarness();
  const pane = {
    style: createStyle('710px', 'important'),
    rect: { width: 1280, height: 700, left: 0, right: 1280 }
  };
  h.setPane(pane);
  assert.equal(h.context.syncSizedPane(), true);
  assert.equal(pane.style.getPropertyValue('--uwc-content-width'), '1248px');
  const writes = pane.style.writes;
  h.context.syncSizedPane();
  assert.equal(pane.style.writes, writes, 'unchanged geometry is idempotent');
  h.settings.wide = false;
  assert.equal(h.context.syncSizedPane(), false);
  assert.equal(pane.style.getPropertyValue('--uwc-content-width'), '710px');
  assert.equal(pane.style.getPropertyPriority('--uwc-content-width'), 'important');
});

test('pane remount restores the old pane and assigns width to the new pane', () => {
  const h = createHarness();
  const oldPane = {
    style: createStyle('640px'),
    rect: { width: 1300, height: 700, left: 0, right: 1300 }
  };
  const newPane = {
    style: createStyle(),
    rect: { width: 900, height: 700, left: 0, right: 900 }
  };
  h.setPane(oldPane);
  h.context.syncSizedPane();
  h.setPane(newPane);
  h.context.syncSizedPane();
  assert.equal(oldPane.style.getPropertyValue('--uwc-content-width'), '640px');
  assert.equal(newPane.style.getPropertyValue('--uwc-content-width'), '868px');
  h.context.restoreSizedPane();
  assert.equal(newPane.style.getPropertyValue('--uwc-content-width'), '');
});

test('cleanup preserves a later third-party override', () => {
  const h = createHarness();
  const pane = {
    style: createStyle('640px'),
    rect: { width: 1200, height: 700, left: 0, right: 1200 }
  };
  h.setPane(pane);
  h.context.syncSizedPane();
  pane.style.setProperty('--uwc-content-width', '777px');
  h.context.restoreSizedPane();
  assert.equal(pane.style.getPropertyValue('--uwc-content-width'), '777px');
});

test('bounded geometry inspection identifies pane-relative clipping', () => {
  const h = createHarness();
  const element = {
    rect: { left: 90, right: 1020, top: 50, bottom: 200, width: 930, height: 150 }
  };
  h.runtime.marked.set('turn', new Set([element]));
  const result = h.context.inspectConversationPosition({
    left: 100, right: 1000, width: 900, height: 600
  });
  assert.equal(result.checked, true);
  assert.equal(result.ok, false);
  assert.equal(result.leftPx, 10);
  assert.equal(result.rightPx, 20);
  assert.equal(result.sampled, 1);
});

test('independent composers are exempt from transcript-width equality', () => {
  const h = createHarness();
  const pane = { rect: { width: 1200, height: 900, left: 0, right: 1200 } };
  const turn = { rect: { width: 1168, height: 120, left: 16, right: 1184, top: 50, bottom: 170 } };
  const composer = {
    rect: { width: 460, height: 90, left: 100, right: 560, top: 700, bottom: 790 },
    closest() { return null; }
  };
  h.setPane(pane);
  h.runtime.marked.set('turn', new Set([turn]));
  h.runtime.marked.set('composer', new Set([composer]));
  const independent = h.context.verifyAppliedWidths();
  assert.equal(independent.composerMode, 'independent');
  assert.equal(independent.checks.composer, true);
  assert.equal(independent.ok, true);

  composer.closest = () => ({ id: 'thread-bottom-container' });
  const canonical = h.context.verifyAppliedWidths();
  assert.equal(canonical.composerMode, 'canonical');
  assert.equal(canonical.checks.composer, false);
  assert.equal(canonical.ok, false);
});

test('active pane discovery prefers a visible chat anchor over an unrelated main', () => {
  const unrelated = { closest: () => null, querySelectorAll: () => [] };
  const pane = { closest: () => null };
  const dialog = {};
  const overlayInput = { closest: () => dialog };
  const prompt = { closest: selector => selector === 'main,[role="main"]' ? pane : null };
  const context = vm.createContext({
    SELECTOR: { excludedComposerAncestor: '[role="dialog"]' },
    PRIMARY_COMPOSER_INPUT: 'primary',
    document: {
      querySelectorAll(selector) {
        if (selector === 'primary') return [overlayInput, prompt];
        if (selector === 'main,[role="main"]') return [unrelated];
        return [];
      }
    },
    isVisibleElement: element => Boolean(element)
  });
  vm.runInContext(extractFunction('resolveActivePane'), context);
  assert.equal(context.resolveActivePane(), pane);
  context.document.querySelectorAll = selector => selector === 'main,[role="main"]' ? [unrelated] : [];
  assert.equal(context.resolveActivePane(), null);
});

test('turn discovery falls back within the active pane when preferred matches are in an overlay', () => {
  const dialogTurn = { closest: () => ({}) };
  const article = {};
  const message = { closest: selector => selector === 'article' ? article : null };
  const pane = {
    contains: node => node === article,
    querySelectorAll: selector => selector === 'preferred' ? [dialogTurn] : [message]
  };
  const context = vm.createContext({
    SELECTOR: { preferredTurns: 'preferred', fallbackMessages: 'fallback', excludedComposerAncestor: 'overlays' },
    runtime: {},
    isConnectedElement: element => Boolean(element)
  });
  vm.runInContext(extractFunction('queryConversationTurns'), context);
  assert.deepEqual(Array.from(context.queryConversationTurns(pane)), [article]);
});

test('a focused side form does not displace the active pane composer', () => {
  const prompt = {
    id: 'prompt-textarea',
    matches: () => true,
    closest: () => null,
    getBoundingClientRect: () => ({ bottom: 700 })
  };
  const sideInput = {
    matches: () => false,
    closest: () => null,
    getBoundingClientRect: () => ({ bottom: 850 })
  };
  const pane = { querySelectorAll: selector => selector === 'primary' ? [prompt] : [prompt, sideInput] };
  const context = vm.createContext({
    PRIMARY_COMPOSER_INPUT: 'primary',
    COMPOSER_INPUT_TEST_IDS: 'test-ids',
    SELECTOR: { composerInput: 'input', excludedComposerAncestor: 'overlays', preferredTurns: 'turn', fallbackMessages: 'message' },
    CONFIG: { maxComposerCandidates: 24 },
    document: { activeElement: sideInput },
    isConnectedElement: () => true,
    isVisibleElement: () => true,
    window: { innerHeight: 900 }
  });
  vm.runInContext(extractFunction('findComposerInput'), context);
  assert.equal(context.findComposerInput(pane), prompt);
  prompt.closest = selector => selector === 'overlays,turn,message' ? {} : null;
  assert.equal(context.findComposerInput(pane), sideInput);
});

test('only a visible editor outside dialogs and conversation turns triggers split-view mode', () => {
  const inlineEditor = { closest: () => ({}) };
  const panel = { closest: () => null };
  const editors = [inlineEditor];
  const context = vm.createContext({
    SELECTOR: { splitViewIndicators: 'editor', preferredTurns: 'turn', fallbackMessages: 'message' },
    runtime: {},
    document: { querySelectorAll: () => editors },
    isVisibleElement: () => true
  });
  vm.runInContext(extractFunction('detectCanvas'), context);
  assert.equal(context.detectCanvas(), false);
  editors.push(panel);
  assert.equal(context.detectCanvas(), true);
});

test('pane resize ignores stale observers and measures the current pane consistently', () => {
  const activePane = { rect: { width: 1216, height: 720 } };
  const resized = [];
  const runtime = { observedPane: activePane, paneResizeCount: 0, started: false };
  const context = vm.createContext({
    runtime,
    getVisibleRect: pane => pane.rect,
    syncSizedPane: (_pane, width) => resized.push(width),
    scheduleClipAlignment() {}
  });
  vm.runInContext(extractFunction('onPaneResize'), context);
  context.onPaneResize([{ target: {}, contentRect: { width: 500, height: 700 } }]);
  assert.equal(runtime.paneResizeCount, 0);
  context.onPaneResize([{ target: activePane, contentRect: { width: 1200, height: 700 } }]);
  assert.deepEqual(resized, [1216]);
  assert.equal(runtime.effectivePaneHeight, 720);
});

test('a partial scan rebuilds layout markers when the active pane changes', () => {
  const oldPane = {};
  const newPane = {};
  const runtime = { marked: new Map([['pane', new Set([oldPane])]]) };
  const scans = [];
  const DIRTY = { root: 'root', split: 'split', conversation: 'conversation', composer: 'composer', notice: 'notice' };
  const noop = () => {};
  const context = vm.createContext({
    runtime, DIRTY, ATTR: { pane: 'pane' }, settings: { enabled: true },
    ALL_DIRTY_REGIONS: Object.values(DIRTY),
    shouldPauseWork: () => false,
    nowMs: () => 0,
    resolveActivePane: () => newPane,
    attachPaneResizeObserver: pane => assert.equal(pane, newPane),
    createDesiredMarkers: () => new Map(),
    seedDesiredMarkers: noop,
    addDesiredMarker: (desired, attr, pane) => desired.set(attr, new Set([pane])),
    detectCanvas: () => scans.push('split'),
    markConversation: (_desired, pane) => { assert.equal(pane, newPane); scans.push('conversation'); },
    markComposer: (_desired, pane) => { assert.equal(pane, newPane); scans.push('composer'); },
    markPlanNotice: (_desired, pane) => { assert.equal(pane, newPane); scans.push('notice'); },
    applyMarkerDiff: desired => { runtime.marked = desired; },
    detectDomCapabilities: noop,
    evaluateCompatibility: noop,
    setRootState: noop,
    pushDebugEvent: noop,
    updateDomFingerprint: noop,
    scheduleClipAlignment: noop,
    scheduleComposerScrollGuardAudit: noop,
    verifyAppliedWidths: noop,
    evaluateLayoutInvariants: () => ({ ok: true }),
    processInvariantResult: noop,
    syncDebugOverlay: noop,
    recordPerformanceSample: noop
  });
  vm.runInContext(extractFunction('performScan'), context);
  context.performScan([DIRTY.root]);
  assert.equal(runtime.lastError, null);
  assert.deepEqual(scans, ['split', 'conversation', 'composer', 'notice']);
  assert.deepEqual(Array.from(runtime.marked.get('pane')), [newPane]);
  scans.length = 0;
  context.performScan([DIRTY.root]);
  assert.deepEqual(scans, []);
});


test('Safe Media preserves native user attachment dimensions', () => {
  const context = vm.createContext({
    settings: { cap: 'none', safeMedia: true, widenComposer: true, gutterMin: 12, gutterVw: 1, gutterMax: 32 },
    ATTR: new Proxy({}, { get: (_target, key) => 'data-test-' + String(key) }),
    VERSION: '2026.11.27.1'
  });
  vm.runInContext(extractFunction('buildMainCss'), context);
  const css = context.buildMainCss();
  const assistant = ':is([data-markdown-text-style="assistant-message"],[data-message-author-role="assistant"])';
  const turn = '[data-test-turn="1"]';
  const assistantTurn = ':is(' + turn + assistant + ',' + turn + ' ' + assistant + ')';
  for (const tag of ['img', 'video', 'iframe', 'figure']) {
    assert.ok(css.includes(assistantTurn + ' ' + tag));
    assert.ok(!css.includes(turn + ' ' + tag), 'unscoped media override: ' + tag);
  }
  const heightRule = css.split('}').find(rule => rule.includes('height:auto!important;') && rule.includes(' img'));
  assert.ok(heightRule);
  assert.ok(heightRule.includes(assistantTurn + ' img'));
  assert.ok(heightRule.includes(assistantTurn + ' video'));
  assert.ok(css.includes('[data-user-message-bubble="true"]'));
  context.settings.safeMedia = false;
  const disabledCss = context.buildMainCss();
  for (const tag of ['img', 'video', 'iframe', 'figure']) {
    assert.ok(!disabledCss.includes(assistantTurn + ' ' + tag));
  }
  assert.ok(disabledCss.includes('[data-user-message-bubble="true"]'));
});
