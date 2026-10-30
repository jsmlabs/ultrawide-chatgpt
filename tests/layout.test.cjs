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
