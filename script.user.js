// ==UserScript==
// @name         UltraWide ChatGPT
// @namespace    https://www.instagram.com/jsm.ig/
// @version      2026.10.06.22
// @author       jsmdev
// @description  UltraWide ChatGPT provides a robust ultra-wide layout for current ChatGPT Chat and Work with adaptive width, split-view safety, diagnostics, settings, SPA support, and complete cleanup.
// @license      MIT
// @match        https://chatgpt.com/*
// @match        https://www.chatgpt.com/*
// @icon         https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/openai.svg
// @run-at       document-start
// @noframes
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/557270/Wide%20ChatGPT.user.js
// @updateURL https://update.greasyfork.org/scripts/557270/Wide%20ChatGPT.meta.js
// ==/UserScript==

/*
  UltraWide ChatGPT
  Version: 2026.10.06.22

  Improvements
  - Updated for the current ChatGPT Chat + Work web surface
  - Safer SPA navigation hooks that do not overwrite hooks installed after UltraWide
  - Better composer selection to avoid widening unrelated editors and dialog inputs
  - Expanded split-view/artifact detection while preserving legacy Canvas compatibility
  - Atomic marker updates without clearing/scanning the entire page
  - Cleans conflicting styles and attributes from older script versions
  - Avoids body.innerText and broad generated-class selectors
  - Avoids nested composer-width shrinking
  - Uses verified conversation turns as structural anchors
  - Lightweight, bounded MutationObserver processing
  - SPA route handling without aggressive polling
  - Chat/Work split-view-safe pane-relative sizing
  - Complete timer, observer, listener, style, and marker cleanup
  - Settings validation and migration from earlier versions
  - Fixed CSS cache recursion and hardened cache generation
  - Hot-reload-safe single-instance lifecycle
  - Storage failure reporting and copyable diagnostics
  - Live settings status synchronization
  - Native Navigation API support when available, with safe history fallback
  - Same-version reinjection now cleanly stops the previous runtime
  - Attribute-aware DOM observation catches structural selector changes earlier
  - Split-view detection ignores hidden editor/artifact remnants
  - Repair verifies style contents, not only style element presence
  - Extended scan diagnostics with measured average/max duration and route/mutation timestamps
  - Clear ON/OFF state pills for every settings toggle, with redundant text + color cues
  - Free-plan/upgrade notices now participate in UltraWide width handling when detected outside conversation turns
  - October 2026 architecture refresh based on the live virtualized transcript DOM
  - Primary width control now overrides ChatGPT thread CSS variables instead of relying on individual turn wrappers
  - Supports data-thread-user-message-navigation-content transcript roots and data-thread-find-target conversation roots
  - Supports virtualized data-turn-key/data-content-search-turn-key turns and current assistant/user message markers
  - Composer width now follows the same thread variable chain through #thread-bottom-container and #prompt-textarea
  - Core width remains stable across React virtualization, remounts, scrolling, and SPA navigation
  - Accepts presence-only data-thread-user-message-navigation-content roots instead of requiring the literal value "true"
  - Promotes data-content-search-turn-key to a primary virtualized-turn selector
  - Adds a semantic main-level thread-variable fallback so width survives wrapper/class churn
  - Deduplicates nested virtualized turn markers so one logical turn is never counted or widened twice
  - Prioritizes the live #prompt-textarea/#thread-bottom-container composer path during candidate scoring
  - Makes free-plan notice detection choose the smallest relevant visible container instead of broad ancestors
  - Reduces avoidable notice scanning by preferring semantic status/note containers before generic div fallbacks
  - Adds structural-root mutation triggers so transcript/composer remounts are repaired earlier
  - Adds runtime integrity verification to diagnostics and the public console API
  - Removes duplicate mutation observer attributes and centralizes reusable scan selectors
  - Settings modal reloads the page on close when saved settings changed
  - Adaptive mode now uses the effective live chat-pane width instead of only the browser viewport
  - Adds a lifecycle-safe ResizeObserver for sidebar, split-view, and pane-size changes
  - Adds explicit DOM capability detection with strategy classification and compatibility health
  - Diagnostics now report pane geometry, selector health, compatibility issues, and observer state
  - Pane observation automatically follows React/SPA remounts and falls back safely when unavailable
  - Redesigns the userscript-manager menu with compact, consistent status labels and clearer runtime details
  - Adds continuous self-healing enforcement with bounded automatic retry instead of passive failure detection
  - Adds a root lifecycle observer so root-state loss and head/body replacement are repaired immediately
  - Head integrity monitoring now observes subtree/style text mutations, not only direct head children
  - Adds a lightweight enforcement watchdog that verifies styles, observers, root state, markers, and layout invariants
  - Makes the disabled state strict: no layout CSS, managed markers, or root-state residue may be reintroduced by background repair paths
  - Hardens style mounting against wrong-node, wrong-parent, and duplicate-ID corruption
  - Recoverable invariant failures trigger automatic re-application before any safety fallback is considered
  - Safe fallback is now reserved for persistent geometry-safety failures and can automatically recover after the layout becomes healthy
  - Redesigns the settings UI around a compact runtime dashboard and clearer information hierarchy
  - Adds live health, DOM strategy, confidence, pane-width, turn-count, and watchdog metrics to settings
  - Moves technical runtime tuning, shortcuts, and downloads into a focused Advanced section
  - Adds one-click Repair now and Run self-test actions with immediate UI feedback
  - Improves responsive behavior, keyboard focus visibility, status semantics, spacing, and visual density
  - Fixes reconciliation convergence so it is based on post-repair state instead of stale pre-repair differences
  - Marks animation-frame/full-scan repairs as pending until a later verification pass can observe the result
  - Fixes Repair now feedback so successful repairs are not reported as unresolved
  - Restores the settings UI after the lifecycle torture test intentionally stops and restarts the runtime
  - Hardens settings actions with bounded error handling and explicit failure feedback
  - Adds a selector-health registry with hit counts, visibility, last-seen timestamps, failure streaks, and grouped health scoring
  - Adds repair-effectiveness metrics for execution, success, coalescing, escalation, duration, and idempotency
  - Adds explicit performance budgets for watchdog, reconciliation, full scans, and self-tests with violation accounting
  - Serializes self-healing through a reconciliation lock and coalesces concurrent requests into one queued follow-up pass
  - Adds runtime epochs and stale-callback guards across scheduled scans, observers, route checks, watchdogs, and interval work
  - Expands health reporting into Runtime, Styles, DOM, Width, Reconciliation, and Performance component scores
  - Adds a deterministic built-in regression test API for core normalization, strategy, repair, epoch, health, and metrics contracts
  - Standardizes the extension's canonical display name as UltraWide ChatGPT across metadata, UI, diagnostics, and bug reports
  - Centralizes the product display name in PRODUCT_NAME to prevent future branding drift
  - Adds pending-reconciliation gating so full-scan repairs cannot spawn overlapping reconciliation passes before verification
  - Clears queued reconciliation state when pending asynchronous repair work is superseded by a runtime stop or restart
  - Extends regression coverage for canonical branding and pending-reconciliation contracts

  Shortcuts
  - Alt+O  Enable/disable script
  - Alt+U  Enable/disable UltraWide
  - Alt+L  Enable/disable left alignment
  - Alt+M  Cycle maximum width
  - Alt+A  Enable/disable adaptive mode
  - Alt+C  Enable/disable split-view safe mode
  - Alt+S  Open settings
  - Alt+R  Reset settings

  Console API
  - window.__mlUltraWide.state()
  - window.__mlUltraWide.diagnostics()
  - window.__mlUltraWide.capabilities()
  - window.__mlUltraWide.verify()
  - window.__mlUltraWide.selfTest()
  - window.__mlUltraWide.regressionTest()
  - window.__mlUltraWide.health()
  - window.__mlUltraWide.healthBreakdown()
  - window.__mlUltraWide.selectorHealth()
  - window.__mlUltraWide.repairEffectiveness()
  - window.__mlUltraWide.performanceBudget()
  - window.__mlUltraWide.reconcile()
  - window.__mlUltraWide.fingerprint()
  - window.__mlUltraWide.repairHistory()
  - window.__mlUltraWide.strategy()
  - window.__mlUltraWide.repairPlan()
  - window.__mlUltraWide.lifecycleTortureSelfTest()
  - window.__mlUltraWide.failureCodes()
  - window.__mlUltraWide.convergence()
  - window.__mlUltraWide.enforce()
  - window.__mlUltraWide.copyDiagnostics()
  - window.__mlUltraWide.downloadDiagnostics()
  - window.__mlUltraWide.downloadBugReport()
  - window.__mlUltraWide.apply()
  - window.__mlUltraWide.scan()
  - window.__mlUltraWide.restart()
  - window.__mlUltraWide.stop()
  - window.__mlUltraWide.openSettings()
  - window.__mlUltraWide.set({ cap: "2400", auto: false })
  - window.__mlUltraWide.reset()
*/

(() => {
  'use strict';

  const VERSION = '2026.10.06.22';
  const PRODUCT_NAME = 'UltraWide ChatGPT';
  const STORAGE_KEY = 'uwc.settings.v14';

  const ID = Object.freeze({
    style: 'uwc-style-v11',
    uiStyle: 'uwc-ui-style-v11',
    toast: 'uwc-toast-v11',
    modal: 'uwc-settings-v11',
    debugOverlay: 'uwc-debug-overlay-v11'
  });

  const LEGACY_STYLE_IDS = Object.freeze([
    'uwc-style',
    'uwc-ui-style',
    'uwc-style-v8',
    'uwc-ui-style-v8',
    'uwc-style-v9',
    'uwc-ui-style-v9',
    'uwc-style-v10',
    'uwc-ui-style-v10'
  ]);

  const LEGACY_ELEMENT_IDS = Object.freeze([
    'uwc-toast',
    'uwc-settings-modal',
    'uwc-toast-v8',
    'uwc-settings-v8',
    'uwc-toast-v9',
    'uwc-settings-v9',
    'uwc-toast-v10',
    'uwc-settings-v10'
  ]);

  const LEGACY_STORAGE_KEYS = Object.freeze([
    'uwc.settings.v13',
    'uwc.settings.v12',
    'uwc.settings.v11',
    'uwc.settings.v10',
    'uwc.settings.v9',
    'uwc.settings.v8',
    'uwc.settings.v7',
    'uwc.settings.v6',
    'uwc.settings.v5',
    'uwc.settings.v4',
    'uwc.settings.v3',
    'uwc.settings.v2',
    'uwc.settings.v1'
  ]);

  const ATTR = Object.freeze({
    enabled: 'data-uwc-enabled',
    wide: 'data-uwc-wide',
    left: 'data-uwc-left',
    canvas: 'data-uwc-canvas',
    cap: 'data-uwc-cap',
    version: 'data-uwc-version',

    conversationRoot: 'data-uwc-conversation-root',
    conversationPath: 'data-uwc-conversation-path',
    turn: 'data-uwc-turn',
    turnPath: 'data-uwc-turn-path',

    composer: 'data-uwc-composer',
    composerPath: 'data-uwc-composer-path',

    planNotice: 'data-uwc-plan-notice',
    planNoticePath: 'data-uwc-plan-notice-path'
  });

  const MANAGED_MARKERS = Object.freeze([
    ATTR.conversationRoot,
    ATTR.conversationPath,
    ATTR.turn,
    ATTR.turnPath,
    ATTR.composer,
    ATTR.composerPath,
    ATTR.planNotice,
    ATTR.planNoticePath
  ]);

  const CAPS = Object.freeze([
    'none',
    '1200',
    '1400',
    '1600',
    '1800',
    '2000',
    '2200',
    '2400',
    '2800',
    '3200',
    '3600',
    '4200'
  ]);

  const DEFAULTS = Object.freeze({
    enabled: true,
    wide: true,
    left: true,

    cap: 'none',
    auto: true,
    autoMinWidth: 1100,
    disableOnTouch: false,
    disableBelowHeight: 560,

    gutterMin: 16,
    gutterVw: 2,
    gutterMax: 36,

    widenComposer: true,
    safeMedia: true,
    canvasSafeMode: true,

    toast: true,
    toastMs: 1500,

    scanDebounceMs: 240,
    repairIntervalMs: 10000,
    routePollMs: 10000,

    pauseWhenHidden: true,
    performanceTelemetry: true,
    debugOverlay: false,

    closeSettingsOnBackdrop: true
  });

  const LIMITS = Object.freeze({
    autoMinWidth: [640, 10000],
    disableBelowHeight: [0, 4000],

    gutterMin: [0, 100],
    gutterVw: [0, 15],
    gutterMax: [0, 200],

    toastMs: [300, 10000],
    scanDebounceMs: [80, 3000],
    repairIntervalMs: [2500, 60000],
    routePollMs: [1000, 30000]
  });

  const CONFIG = Object.freeze({
    maxMutationRecords: 24,
    maxMutationNodes: 10,
    maxComposerCandidates: 24,
    maxPlanNoticeCandidates: 900,
    maxConversationPathDepth: 12,
    maxTurnPathDepth: 6,
    maxComposerPathDepth: 7,
    maxPlanNoticePathDepth: 7,
    routeDelayMs: 100,
    idleTimeoutMs: 700,
    debugEventLimit: 50,
    invariantFailureThreshold: 3,
    enforcementStableIntervalMs: 10000,
    enforcementNormalIntervalMs: 5000,
    enforcementActiveIntervalMs: 1500,
    enforcementUnstableIntervalMs: 750,
    enforcementRetryLimit: 5,
    enforcementRetryCooldownMs: 5000,
    fingerprintChangeCooldownMs: 300,
    widthTolerancePx: 12,
    widthToleranceRatio: 0.06,
    repairHistoryLimit: 80,
    strategyMinConfidence: 60,
    mutationIntentTtlMs: 300,
    convergenceStallLimit: 3,
    convergenceHardLimit: 6,
    lifecycleTortureCycles: 3,
    selectorHealthStaleMs: 5000,
    selectorHealthMissingThreshold: 3,
    reloadLoopWindowMs: 10000,
    reloadLoopMaxCount: 2,
    mutationAttributeFilter: Object.freeze([
      'data-testid',
      'data-turn-key',
      'data-content-search-turn-key',
      'data-thread-user-message-navigation-content',
      'data-message-author-role',
      'role',
      'contenteditable',
      'aria-modal',
      'aria-hidden',
      'hidden'
    ])
  });

  const SELECTOR = Object.freeze({
    preferredTurns: [
      '[data-turn-key]',
      '[data-content-search-turn-key]',
      '[data-testid="conversation-turn"]',
      '[data-testid^="conversation-turn-"]',
      'article[data-testid="conversation-turn"]',
      'article[data-testid^="conversation-turn-"]'
    ].join(','),

    fallbackMessages: [
      '[data-message-author-role]',
      '[data-message-id][data-message-author-role]',
      '[data-markdown-text-style="assistant-message"]',
      '[data-user-message-bubble="true"]',
      '[data-conversation-role="assistant"]'
    ].join(','),

    main: [
      'main',
      '[role="main"]',
      '[data-thread-user-message-navigation-content]',
      '[data-thread-find-target="conversation"]',
      '[data-testid="main-app"]',
      '[data-testid="chat-layout"]',
      '[data-testid="conversation"]',
      '[data-testid="thread"]'
    ].join(','),

    composerInput: [
      '#prompt-textarea',
      '[data-testid="prompt-textarea"]',
      '[data-testid="composer-input"]',
      '[data-testid="composer:input"]',
      'form[data-type="unified-composer"] textarea',
      'form[data-type="unified-composer"] [contenteditable="true"]',
      'form[data-type="unified-composer"] [role="textbox"]',
      'main form textarea',
      'main form [contenteditable="true"][role="textbox"]'
    ].join(','),

    composerShell: [
      '#thread-bottom-container',
      '#thread-bottom',
      '[data-testid="composer"]',
      '[data-testid="composer-shell"]',
      '[data-testid="composer-container"]',
      'form[data-type="unified-composer"]'
    ].join(','),

    excludedComposerAncestor: [
      '#uwc-settings-v11',
      '#uwc-settings-v10',
      '[role="dialog"]',
      '[aria-modal="true"]',
      '[data-testid="artifact"]',
      '[data-testid^="artifact-"]',
      '[data-testid="code-editor"]',
      '[data-testid^="code-editor-"]',
      '.monaco-editor',
      '.cm-editor',
      '.CodeMirror'
    ].join(','),

    splitViewIndicators: [
      '[data-testid="canvas"]',
      '[data-testid^="canvas-"]',
      '[data-testid="artifact"]',
      '[data-testid^="artifact-"]',
      '[data-testid="code-editor"]',
      '[data-testid^="code-editor-"]',
      '[data-testid="document-editor"]',
      '[data-testid^="document-editor-"]',
      '[data-testid="spreadsheet-editor"]',
      '[data-testid^="spreadsheet-editor-"]',
      '[data-testid*="artifact-panel"]',
      '[data-testid*="work-panel"]',
      '.monaco-editor',
      '.cm-editor',
      '.CodeMirror'
    ].join(','),

    structuralRoots: [
      '[data-thread-user-message-navigation-content]',
      '[data-thread-find-target="conversation"]',
      '#thread-bottom-container',
      '#prompt-textarea'
    ].join(','),

    turnContent: [
      '[data-markdown-text-style="assistant-message"]',
      '[data-user-message-bubble="true"]',
      '.markdown',
      '[class*="prose"]',
      '[data-message-author-role]'
    ].join(',')
  });

  const SELECTOR_HEALTH_TARGETS = Object.freeze([
    Object.freeze({
      id: 'main',
      selector: SELECTOR.main,
      label: 'Main surface',
      group: 'main'
    }),
    Object.freeze({
      id: 'transcript-root',
      selector: '[data-thread-user-message-navigation-content]',
      label: 'Transcript root',
      group: 'conversation'
    }),
    Object.freeze({
      id: 'conversation-target',
      selector: '[data-thread-find-target="conversation"]',
      label: 'Conversation target',
      group: 'conversation'
    }),
    Object.freeze({
      id: 'virtualized-turns',
      selector: '[data-turn-key],[data-content-search-turn-key]',
      label: 'Virtualized turns',
      group: 'turns'
    }),
    Object.freeze({
      id: 'fallback-turns',
      selector: SELECTOR.fallbackMessages,
      label: 'Fallback turns',
      group: 'turns'
    }),
    Object.freeze({
      id: 'composer-input',
      selector: SELECTOR.composerInput,
      label: 'Composer input',
      group: 'composer'
    }),
    Object.freeze({
      id: 'composer-shell',
      selector: SELECTOR.composerShell,
      label: 'Composer shell',
      group: 'composer'
    }),
    Object.freeze({
      id: 'structural-roots',
      selector: SELECTOR.structuralRoots,
      label: 'Structural roots',
      group: 'structural'
    })
  ]);

  const PERFORMANCE_BUDGET = Object.freeze({
    watchdog: 1,
    reconcile: 2,
    fullScan: 8,
    selfTest: 20
  });

  const MANAGED_LAYOUT_SELECTOR = MANAGED_MARKERS
    .map((attribute) => `[${attribute}]`)
    .join(',');

  const SCAN_TRIGGER_SELECTOR = [
    SELECTOR.preferredTurns,
    SELECTOR.fallbackMessages,
    SELECTOR.composerInput,
    SELECTOR.splitViewIndicators,
    SELECTOR.structuralRoots
  ].join(',');

  const DIRTY = Object.freeze({
    conversation: 'conversation',
    composer: 'composer',
    notice: 'notice',
    split: 'split',
    root: 'root'
  });

  const ALL_DIRTY_REGIONS = Object.freeze([
    DIRTY.conversation,
    DIRTY.composer,
    DIRTY.notice,
    DIRTY.split,
    DIRTY.root
  ]);

  const FAILURE_CODE = Object.freeze({
    RUNTIME_NOT_STARTED: 'RUNTIME_NOT_STARTED',
    MAIN_STYLE_MISSING: 'MAIN_STYLE_MISSING',
    MAIN_STYLE_INTEGRITY: 'MAIN_STYLE_INTEGRITY',
    MAIN_STYLE_UNWANTED: 'MAIN_STYLE_UNWANTED',
    UI_STYLE_INTEGRITY: 'UI_STYLE_INTEGRITY',
    ROOT_ENABLED_STATE: 'ROOT_ENABLED_STATE',
    ROOT_STATE_INTEGRITY: 'ROOT_STATE_INTEGRITY',
    OBSERVER_INTEGRITY: 'OBSERVER_INTEGRITY',
    DISCONNECTED_MARKERS: 'DISCONNECTED_MARKERS',
    TURN_MARKERS_MISSING: 'TURN_MARKERS_MISSING',
    COMPOSER_MARKER_MISSING: 'COMPOSER_MARKER_MISSING',
    WIDTH_VERIFICATION_FAILED: 'WIDTH_VERIFICATION_FAILED',
    WIDTH_EXCEEDS_PANE: 'WIDTH_EXCEEDS_PANE',
    WIDTH_UNDER_APPLIED: 'WIDTH_UNDER_APPLIED',
    DOM_FINGERPRINT_CHANGED: 'DOM_FINGERPRINT_CHANGED',
    STRATEGY_LOW_CONFIDENCE: 'STRATEGY_LOW_CONFIDENCE',
    RECONCILIATION_STALLED: 'RECONCILIATION_STALLED',
    RECONCILIATION_DID_NOT_CONVERGE: 'RECONCILIATION_DID_NOT_CONVERGE'
  });

  const LEGACY_FAILURE_CODE_MAP = Object.freeze({
    'runtime-not-started': FAILURE_CODE.RUNTIME_NOT_STARTED,
    'main-style-missing': FAILURE_CODE.MAIN_STYLE_MISSING,
    'main-style-integrity': FAILURE_CODE.MAIN_STYLE_INTEGRITY,
    'main-style-unwanted': FAILURE_CODE.MAIN_STYLE_UNWANTED,
    'ui-style-integrity': FAILURE_CODE.UI_STYLE_INTEGRITY,
    'root-enabled-state': FAILURE_CODE.ROOT_ENABLED_STATE,
    'root-state-integrity': FAILURE_CODE.ROOT_STATE_INTEGRITY,
    'observer-integrity': FAILURE_CODE.OBSERVER_INTEGRITY,
    'disconnected-markers': FAILURE_CODE.DISCONNECTED_MARKERS,
    'turn-markers-missing': FAILURE_CODE.TURN_MARKERS_MISSING,
    'composer-marker-missing': FAILURE_CODE.COMPOSER_MARKER_MISSING,
    'post-apply-width-verification': FAILURE_CODE.WIDTH_VERIFICATION_FAILED,
    'managed-width-exceeds-pane': FAILURE_CODE.WIDTH_EXCEEDS_PANE,
    'managed-width-under-applied': FAILURE_CODE.WIDTH_UNDER_APPLIED,
    'dom-fingerprint-changed': FAILURE_CODE.DOM_FINGERPRINT_CHANGED
  });

  const STRATEGY_REGISTRY = Object.freeze([
    Object.freeze({
      id: 'virtualized-thread',
      minimumConfidence: 70,
      score(capabilities) {
        let score = 0;
        if (capabilities.transcriptRoot) score += 42;
        if (capabilities.virtualizedTurns) score += 34;
        if (capabilities.conversationTarget) score += 8;
        if (capabilities.threadBottomContainer) score += 8;
        if (capabilities.promptTextarea) score += 8;
        return Math.min(100, score);
      }
    }),
    Object.freeze({
      id: 'conversation-target',
      minimumConfidence: 65,
      score(capabilities) {
        let score = 0;
        if (capabilities.conversationTarget) score += 42;
        if (capabilities.virtualizedTurns) score += 22;
        if (capabilities.fallbackTurns) score += 18;
        if (capabilities.threadBottomContainer) score += 9;
        if (capabilities.promptTextarea) score += 9;
        return Math.min(100, score);
      }
    }),
    Object.freeze({
      id: 'turn-markers',
      minimumConfidence: 60,
      score(capabilities) {
        let score = 0;
        if (capabilities.virtualizedTurns) score += 38;
        if (capabilities.fallbackTurns) score += 28;
        if (capabilities.mainPresent) score += 14;
        if (capabilities.threadBottomContainer || capabilities.promptTextarea) score += 12;
        if (capabilities.transcriptRoot || capabilities.conversationTarget) score += 8;
        return Math.min(100, score);
      }
    }),
    Object.freeze({
      id: 'semantic-fallback',
      minimumConfidence: 55,
      score(capabilities) {
        let score = 0;
        if (capabilities.mainPresent) score += 30;
        if (capabilities.fallbackTurns) score += 25;
        if (capabilities.promptTextarea) score += 20;
        if (capabilities.threadBottomContainer) score += 15;
        if (capabilities.threadVariableWrappers) score += 10;
        return Math.min(100, score);
      }
    })
  ]);

  function normalizeFailureCode(value) {
    const text = String(value || '');
    return LEGACY_FAILURE_CODE_MAP[text] || text;
  }

  function normalizeFailureCodes(values = []) {
    return [...new Set((values || []).map(normalizeFailureCode).filter(Boolean))];
  }

  function selectDomStrategy(capabilities) {
    const candidates = STRATEGY_REGISTRY
      .map((strategy) => ({
        id: strategy.id,
        score: strategy.score(capabilities),
        minimumConfidence: strategy.minimumConfidence
      }))
      .sort((a, b) => b.score - a.score || a.id.localeCompare(b.id));

    const winner = candidates[0] || {
      id: 'unknown',
      score: 0,
      minimumConfidence: CONFIG.strategyMinConfidence
    };

    const threshold = Math.max(
      CONFIG.strategyMinConfidence,
      winner.minimumConfidence || 0
    );

    const selection = {
      id: winner.score >= threshold ? winner.id : 'unknown',
      candidateId: winner.id,
      confidence: winner.score,
      threshold,
      lowConfidence: winner.score < threshold,
      candidates
    };

    runtime.strategySelection = selection;
    return selection;
  }

  const RELOAD_GUARD_KEY = 'uwc.reload.guard.v1';

  const settings = {
    ...DEFAULTS
  };

  const runtime = {
    started: false,
    href: '',

    bodyObserver: null,
    headObserver: null,
    rootObserver: null,
    bootstrapObserver: null,
    paneResizeObserver: null,

    observedBody: null,
    observedHead: null,
    observedRoot: null,
    observedPane: null,

    eventController: null,

    scanTimer: 0,
    repairTimer: 0,
    routeTimer: 0,
    routeDelayTimer: 0,
    enforcementTimer: 0,
    toastTimer: 0,
    animationFrame: 0,
    idleCallback: 0,

    originalPushState: null,
    originalReplaceState: null,
    wrappedPushState: null,
    wrappedReplaceState: null,

    menusRegistered: false,
    menuCommandIds: new Map(),
    modalSyncing: false,
    modalReturnFocus: null,
    modalSettingsSnapshot: '',

    canvasDetected: false,
    effectivePaneWidth: 0,
    effectivePaneHeight: 0,
    lastPaneResizeAt: 0,
    paneResizeCount: 0,
    lastCapabilities: null,
    lastCompatibility: null,
    lastTurnCount: 0,
    lastRawTurnCount: 0,
    lastPlanNoticeCandidateCount: 0,
    lastScanAt: 0,
    lastScanDurationMs: 0,
    totalScanDurationMs: 0,
    maxScanDurationMs: 0,
    measuredScanCount: 0,
    scanCount: 0,
    mutationBatchCount: 0,
    lastMutationAt: 0,
    lastRouteChangeAt: 0,
    deferredScan: false,
    pendingRepairReasons: new Set(),
    pendingDirtyRegions: new Set(),
    repairRequestCount: 0,
    repairPassCount: 0,
    coalescedRepairCount: 0,
    lastRepairAt: 0,
    lastRepairReasons: [],
    invariantFailureStreak: 0,
    lastInvariants: null,
    enforcementCheckCount: 0,
    enforcementRepairCount: 0,
    enforcementRetryCount: 0,
    enforcementLevel: 0,
    lastEnforcementAt: 0,
    lastEnforcementRepairAt: 0,
    lastEnforcementFailures: [],
    watchdogIntervalMs: 0,
    stableWatchdogPasses: 0,
    lastDomFingerprint: '',
    lastDomFingerprintAt: 0,
    domFingerprintChanges: 0,
    lastWidthVerification: null,
    lastDesiredState: null,
    lastActualState: null,
    lastStateDiff: null,
    healthScore: 0,
    healthStatus: 'unknown',
    healthBreakdown: null,
    selectorHealth: new Map(),
    lastSelectorHealthAt: 0,
    repairHistory: [],
    strategySelection: null,
    performanceBudgetState: new Map(),
    reconcileInProgress: false,
    reconcilePendingVerification: false,
    reconcilePendingSince: 0,
    queuedReconciliationReasons: new Set(),
    queuedReconciliationFrame: 0,
    queuedReconciliationRequestCount: 0,
    queuedReconciliationRunCount: 0,
    reconcileLockContentionCount: 0,
    epoch: 0,
    staleCallbackCount: 0,
    mutationIntentMap: new WeakMap(),
    lastMutationAttribution: null,
    internalMutationBatchCount: 0,
    externalMutationBatchCount: 0,
    mixedMutationBatchCount: 0,
    repairPlanCounter: 0,
    lastRepairPlan: null,
    lastRepairPlanResult: null,
    convergenceSignature: '',
    convergencePreviousFailureCount: 0,
    convergenceStallCount: 0,
    convergenceFailureCount: 0,
    convergencePassCount: 0,
    idempotentPassCount: 0,
    lastConvergence: null,
    lastDomFingerprintChangeAt: 0,
    lifecycleTestRunning: false,
    lifecycleTestCount: 0,
    lastLifecycleTest: null,
    safeFallbackActive: false,
    safeFallbackReason: '',
    debugEvents: [],
    cssCacheKey: '',
    mainCssCache: '',
    uiCssCache: '',
    lastError: null,
    lastSavedAt: 0,
    storageAvailable: true,
    instanceStartedAt: 0,

    marked: new Map(
      MANAGED_MARKERS.map((attribute) => [
        attribute,
        new Set()
      ])
    )
  };

  function getRoot() {
    return document.documentElement || null;
  }

  function getHead() {
    return (
      document.head ||
      document.getElementsByTagName('head')[0] ||
      null
    );
  }

  function getBody() {
    return document.body || null;
  }

  function isElement(value) {
    return value instanceof Element;
  }

  function isConnectedElement(value) {
    return isElement(value) && value.isConnected;
  }

  function isVisibleElement(element) {
    if (!isConnectedElement(element)) {
      return false;
    }

    try {
      const rect = element.getBoundingClientRect();
      const style = getComputedStyle(element);

      return (
        rect.width > 0 &&
        rect.height > 0 &&
        style.display !== 'none' &&
        style.visibility !== 'hidden'
      );
    } catch (_) {
      return true;
    }
  }

  function currentRuntimeEpoch() {
    return runtime.epoch;
  }

  function isCurrentRuntimeEpoch(epoch) {
    return Boolean(
      runtime.started &&
      Number(epoch) === runtime.epoch
    );
  }

  function rejectStaleCallback(epoch, source = 'callback') {
    if (isCurrentRuntimeEpoch(epoch)) {
      return false;
    }

    runtime.staleCallbackCount += 1;

    pushDebugEvent('stale-callback-blocked', {
      source,
      callbackEpoch: Number(epoch),
      runtimeEpoch: runtime.epoch
    });

    return true;
  }

  function guardRuntimeEpoch(
    callback,
    source = 'callback',
    epoch = currentRuntimeEpoch()
  ) {
    return (...args) => {
      if (rejectStaleCallback(epoch, source)) {
        return undefined;
      }

      return callback(...args);
    };
  }

  function updateSelectorHealth() {
    const now = Date.now();
    const snapshot = {};

    for (const target of SELECTOR_HEALTH_TARGETS) {
      let nodes = [];

      try {
        nodes = Array.from(
          document.querySelectorAll(
            target.selector
          )
        );
      } catch (_) {}

      const visibleCount =
        nodes.slice(0, 200)
          .filter(isVisibleElement)
          .length;

      const previous =
        runtime.selectorHealth.get(
          target.id
        );

      const hitCount = nodes.length;
      const present = hitCount > 0;

      const item = {
        id: target.id,
        label: target.label,
        group: target.group,
        selector: target.selector,
        hitCount,
        visibleCount,
        lastSeenAt:
          present
            ? now
            : previous?.lastSeenAt || 0,
        failureStreak:
          present
            ? 0
            : (previous?.failureStreak || 0) + 1,
        status:
          present
            ? 'healthy'
            : (previous?.failureStreak || 0) + 1 >=
                CONFIG.selectorHealthMissingThreshold
              ? 'missing'
              : 'degraded'
      };

      runtime.selectorHealth.set(
        target.id,
        item
      );

      snapshot[target.id] = {
        ...item
      };
    }

    runtime.lastSelectorHealthAt = now;
    return snapshot;
  }

  function getSelectorHealthSummary(
    refresh = false
  ) {
    if (
      refresh ||
      !runtime.lastSelectorHealthAt ||
      Date.now() - runtime.lastSelectorHealthAt >
        CONFIG.selectorHealthStaleMs
    ) {
      updateSelectorHealth();
    }

    const get = (id) =>
      runtime.selectorHealth.get(id) || {
        hitCount: 0,
        visibleCount: 0,
        failureStreak: 0,
        status: 'unknown',
        lastSeenAt: 0
      };

    const mainHealthy =
      get('main').hitCount > 0;

    const conversationEvidence =
      get('transcript-root').hitCount > 0 ||
      get('conversation-target').hitCount > 0;

    const turnEvidence =
      get('virtualized-turns').hitCount > 0 ||
      get('fallback-turns').hitCount > 0;

    const conversationExpected =
      conversationEvidence ||
      turnEvidence ||
      runtime.lastTurnCount > 0;

    const conversationHealthy =
      !conversationExpected ||
      conversationEvidence;

    const turnsHealthy =
      !conversationExpected ||
      turnEvidence;

    const composerHealthy =
      !settings.widenComposer ||
      get('composer-input').hitCount > 0 ||
      get('composer-shell').hitCount > 0;

    const structuralHealthy =
      get('structural-roots').hitCount > 0 ||
      (
        !conversationExpected &&
        composerHealthy
      );

    const score = Math.round(
      (mainHealthy ? 20 : 0) +
      (conversationHealthy ? 25 : 0) +
      (turnsHealthy ? 30 : 0) +
      (composerHealthy ? 20 : 0) +
      (structuralHealthy ? 5 : 0)
    );

    return {
      score,
      status:
        score >= 90
          ? 'healthy'
          : score >= 60
            ? 'degraded'
            : 'unhealthy',
      groups: {
        main: mainHealthy,
        conversation: conversationHealthy,
        turns: turnsHealthy,
        composer: composerHealthy,
        structural: structuralHealthy
      },
      targets: Object.fromEntries(
        [...runtime.selectorHealth.entries()]
          .map(([id, value]) => [
            id,
            { ...value }
          ])
      ),
      lastUpdatedAt:
        runtime.lastSelectorHealthAt
    };
  }

  function recordPerformanceSample(
    name,
    durationMs
  ) {
    const budget =
      PERFORMANCE_BUDGET[name];

    if (
      !Number.isFinite(budget) ||
      !Number.isFinite(durationMs)
    ) {
      return null;
    }

    const previous =
      runtime.performanceBudgetState.get(
        name
      ) || {
        name,
        budgetMs: budget,
        samples: 0,
        violations: 0,
        totalMs: 0,
        maxMs: 0,
        lastMs: 0,
        lastAt: 0
      };

    const next = {
      ...previous,
      budgetMs: budget,
      samples: previous.samples + 1,
      violations:
        previous.violations +
        (durationMs > budget ? 1 : 0),
      totalMs:
        previous.totalMs + durationMs,
      maxMs:
        Math.max(
          previous.maxMs,
          durationMs
        ),
      lastMs: durationMs,
      lastAt: Date.now()
    };

    runtime.performanceBudgetState.set(
      name,
      next
    );

    return {
      ...next,
      averageMs:
        next.samples > 0
          ? next.totalMs / next.samples
          : 0,
      violationRate:
        next.samples > 0
          ? next.violations / next.samples
          : 0
    };
  }

  function getPerformanceBudgetReport() {
    const operations = {};

    for (
      const [name, budgetMs] of
      Object.entries(PERFORMANCE_BUDGET)
    ) {
      const state =
        runtime.performanceBudgetState.get(
          name
        ) || {
          name,
          budgetMs,
          samples: 0,
          violations: 0,
          totalMs: 0,
          maxMs: 0,
          lastMs: 0,
          lastAt: 0
        };

      operations[name] = {
        ...state,
        averageMs:
          state.samples > 0
            ? state.totalMs /
              state.samples
            : 0,
        violationRate:
          state.samples > 0
            ? state.violations /
              state.samples
            : 0
      };
    }

    const sampled =
      Object.values(operations)
        .filter((item) =>
          item.samples > 0
        );

    const totalSamples =
      sampled.reduce(
        (sum, item) =>
          sum + item.samples,
        0
      );

    const totalViolations =
      sampled.reduce(
        (sum, item) =>
          sum + item.violations,
        0
      );

    const score =
      totalSamples > 0
        ? Math.max(
            0,
            Math.round(
              100 *
              (1 -
                totalViolations /
                  totalSamples)
            )
          )
        : 100;

    return {
      score,
      status:
        score >= 90
          ? 'healthy'
          : score >= 70
            ? 'degraded'
            : 'unhealthy',
      totalSamples,
      totalViolations,
      operations
    };
  }

  function mutationIntentKey(type, attributeName = '') {
    return `${String(type || 'unknown')}:${String(attributeName || '')}`;
  }

  function markMutationIntent(node, type, attributeName = '') {
    if (!node || (typeof node !== 'object' && typeof node !== 'function')) {
      return;
    }

    let intents = runtime.mutationIntentMap.get(node);
    if (!intents) {
      intents = new Map();
      runtime.mutationIntentMap.set(node, intents);
    }

    intents.set(
      mutationIntentKey(type, attributeName),
      Date.now() + CONFIG.mutationIntentTtlMs
    );
  }

  function hasMutationIntent(record) {
    const intents = runtime.mutationIntentMap.get(record?.target);
    if (!intents) {
      return false;
    }

    const now = Date.now();
    const key = mutationIntentKey(
      record.type,
      record.type === 'attributes' ? record.attributeName : ''
    );
    const expiresAt = Number(intents.get(key) || 0);

    if (expiresAt < now) {
      intents.delete(key);
      return false;
    }

    return true;
  }

  function attributeMutations(records = []) {
    const externalRecords = [];
    let internal = 0;
    let external = 0;

    for (const record of records || []) {
      if (hasMutationIntent(record)) {
        internal += 1;
      } else {
        external += 1;
        externalRecords.push(record);
      }
    }

    const source = internal > 0 && external > 0
      ? 'mixed'
      : internal > 0
        ? 'ultrawide'
        : 'external';

    const result = {
      source,
      internal,
      external,
      total: internal + external,
      externalRecords
    };

    runtime.lastMutationAttribution = result;
    if (source === 'ultrawide') runtime.internalMutationBatchCount += 1;
    else if (source === 'mixed') runtime.mixedMutationBatchCount += 1;
    else runtime.externalMutationBatchCount += 1;

    return result;
  }

  function setAttributeValue(element, name, value) {
    if (!element || element.getAttribute(name) === value) {
      return false;
    }

    markMutationIntent(element, 'attributes', name);
    element.setAttribute(name, value);
    return true;
  }

  function setBooleanAttribute(element, name, enabled) {
    if (!element) {
      return false;
    }

    if (enabled) {
      return setAttributeValue(element, name, '1');
    }

    if (element.hasAttribute(name)) {
      markMutationIntent(element, 'attributes', name);
      element.removeAttribute(name);
      return true;
    }

    return false;
  }

  function shouldPauseWork() {
    return Boolean(
      settings.pauseWhenHidden &&
      document.hidden
    );
  }

  function nowMs() {
    return (
      typeof performance !== 'undefined' &&
      typeof performance.now === 'function'
    )
      ? performance.now()
      : Date.now();
  }

  function requestNextFrame(callback) {
    if (typeof requestAnimationFrame === 'function') {
      return requestAnimationFrame(callback);
    }

    return window.setTimeout(callback, 16);
  }

  function cancelNextFrame(id) {
    if (!id) {
      return;
    }

    if (typeof cancelAnimationFrame === 'function') {
      cancelAnimationFrame(id);
      return;
    }

    clearTimeout(id);
  }

  function getStyleText(id) {
    return document.getElementById(id)?.textContent || '';
  }

  function parseStoredSettings(value) {
    if (
      value &&
      typeof value === 'object' &&
      !Array.isArray(value)
    ) {
      return value;
    }

    if (typeof value !== 'string') {
      return null;
    }

    try {
      const parsed = JSON.parse(value);
      return (
        parsed &&
        typeof parsed === 'object' &&
        !Array.isArray(parsed)
      )
        ? parsed
        : null;
    } catch (_) {
      return null;
    }
  }

  function hasConnectedMarker(attribute) {
    const elements = runtime.marked.get(attribute);

    if (!elements || elements.size === 0) {
      return false;
    }

    for (const element of elements) {
      if (element?.isConnected) {
        return true;
      }
    }

    return false;
  }

  function hasDisconnectedMarkers() {
    for (const elements of runtime.marked.values()) {
      for (const element of elements) {
        if (!element?.isConnected) {
          return true;
        }
      }
    }

    return false;
  }

  function hasGmStorage() {
    return (
      typeof GM_getValue === 'function' &&
      typeof GM_setValue === 'function'
    );
  }

  function readStorage(key) {
    try {
      if (hasGmStorage()) {
        return parseStoredSettings(
          GM_getValue(key, null)
        );
      }
    } catch (_) {}

    try {
      const raw = localStorage.getItem(key);
      return parseStoredSettings(raw);
    } catch (_) {
      return null;
    }
  }

  function writeStorage(key, value) {
    try {
      if (hasGmStorage()) {
        GM_setValue(key, value);
        runtime.storageAvailable = true;
        runtime.lastSavedAt = Date.now();
        return true;
      }
    } catch (_) {}

    try {
      localStorage.setItem(key, JSON.stringify(value));
      runtime.storageAvailable = true;
      runtime.lastSavedAt = Date.now();
      return true;
    } catch (error) {
      runtime.storageAvailable = false;
      runtime.lastError = `Settings storage failed: ${
        error?.message || error
      }`;
      return false;
    }
  }

  function clampNumber(value, min, max, fallback) {
    const number = Number(value);

    if (!Number.isFinite(number)) {
      return fallback;
    }

    return Math.min(max, Math.max(min, number));
  }

  function clampInteger(value, min, max, fallback) {
    return Math.round(
      clampNumber(value, min, max, fallback)
    );
  }

  function normalizeBoolean(value, fallback) {
    return typeof value === 'boolean'
      ? value
      : fallback;
  }

  function normalizeSettings(input) {
    const output = {
      ...DEFAULTS
    };

    if (
      !input ||
      typeof input !== 'object' ||
      Array.isArray(input)
    ) {
      return output;
    }

    output.enabled = normalizeBoolean(
      input.enabled,
      output.enabled
    );

    output.wide = normalizeBoolean(
      input.wide,
      output.wide
    );

    output.left = normalizeBoolean(
      input.left,
      output.left
    );

    output.cap = CAPS.includes(String(input.cap))
      ? String(input.cap)
      : output.cap;

    output.auto = normalizeBoolean(
      input.auto,
      output.auto
    );

    output.autoMinWidth = clampInteger(
      input.autoMinWidth,
      ...LIMITS.autoMinWidth,
      output.autoMinWidth
    );

    output.disableOnTouch = normalizeBoolean(
      input.disableOnTouch,
      output.disableOnTouch
    );

    output.disableBelowHeight = clampInteger(
      input.disableBelowHeight,
      ...LIMITS.disableBelowHeight,
      output.disableBelowHeight
    );

    output.gutterMin = clampInteger(
      input.gutterMin,
      ...LIMITS.gutterMin,
      output.gutterMin
    );

    output.gutterVw = clampNumber(
      input.gutterVw,
      ...LIMITS.gutterVw,
      output.gutterVw
    );

    output.gutterMax = clampInteger(
      input.gutterMax,
      ...LIMITS.gutterMax,
      output.gutterMax
    );

    output.widenComposer = normalizeBoolean(
      input.widenComposer ?? input.composerWide,
      output.widenComposer
    );

    output.safeMedia = normalizeBoolean(
      input.safeMedia ?? input.mediaSafe,
      output.safeMedia
    );

    output.canvasSafeMode = normalizeBoolean(
      input.canvasSafeMode ?? input.canvasTuning,
      output.canvasSafeMode
    );

    output.toast = normalizeBoolean(
      input.toast ?? input.showToast,
      output.toast
    );

    output.toastMs = clampInteger(
      input.toastMs,
      ...LIMITS.toastMs,
      output.toastMs
    );

    output.scanDebounceMs = clampInteger(
      input.scanDebounceMs ?? input.mutationDebounceMs,
      ...LIMITS.scanDebounceMs,
      output.scanDebounceMs
    );

    output.repairIntervalMs = clampInteger(
      input.repairIntervalMs,
      ...LIMITS.repairIntervalMs,
      output.repairIntervalMs
    );

    output.routePollMs = clampInteger(
      input.routePollMs,
      ...LIMITS.routePollMs,
      output.routePollMs
    );

    output.pauseWhenHidden = normalizeBoolean(
      input.pauseWhenHidden,
      output.pauseWhenHidden
    );

    output.performanceTelemetry = normalizeBoolean(
      input.performanceTelemetry,
      output.performanceTelemetry
    );

    output.debugOverlay = normalizeBoolean(
      input.debugOverlay,
      output.debugOverlay
    );

    output.closeSettingsOnBackdrop = normalizeBoolean(
      input.closeSettingsOnBackdrop ??
        input.optionsCloseOnBackdrop,
      output.closeSettingsOnBackdrop
    );

    if (output.gutterMax < output.gutterMin) {
      output.gutterMax = output.gutterMin;
    }

    return output;
  }

  function loadSettings() {
    const current = readStorage(STORAGE_KEY);

    if (current) {
      Object.assign(
        settings,
        normalizeSettings(current)
      );

      return;
    }

    for (const key of LEGACY_STORAGE_KEYS) {
      const legacy = readStorage(key);

      if (!legacy) {
        continue;
      }

      Object.assign(
        settings,
        normalizeSettings(legacy)
      );

      saveSettings();
      return;
    }
  }

  function saveSettings() {
    return writeStorage(
      STORAGE_KEY,
      { ...settings }
    );
  }

  function removeById(id) {
    const element = document.getElementById(id);
    if (!element) {
      return false;
    }

    if (element.parentNode) {
      markMutationIntent(element.parentNode, 'childList');
    }
    element.remove();
    return true;
  }

  function cleanupLegacyArtifacts() {
    for (const id of LEGACY_STYLE_IDS) {
      removeById(id);
    }

    for (const id of LEGACY_ELEMENT_IDS) {
      removeById(id);
    }

    const root = getRoot();

    if (root) {
      const oldRootAttributes = [
        'data-uwc-on',
        'data-uwc-mounted'
      ];

      for (const attribute of oldRootAttributes) {
        root.removeAttribute(attribute);
      }
    }

    const oldManagedAttributes = [
      'data-uwc-conversation-root',
      'data-uwc-conversation-path',
      'data-uwc-turn',
      'data-uwc-turn-path',
      'data-uwc-composer',
      'data-uwc-composer-path',
      'data-uwc-plan-notice',
      'data-uwc-plan-notice-path'
    ];

    for (const attribute of oldManagedAttributes) {
      try {
        document
          .querySelectorAll(`[${attribute}]`)
          .forEach((element) => {
            setBooleanAttribute(element, attribute, false);
          });
      } catch (_) {}
    }
  }

  function isTouchLike() {
    try {
      const coarse =
        typeof matchMedia === 'function' &&
        matchMedia('(pointer: coarse)').matches;

      const touchPoints =
        Number(navigator.maxTouchPoints || 0) > 0;

      return coarse || touchPoints;
    } catch (_) {
      return false;
    }
  }

  function getVisibleRect(element) {
    if (!isConnectedElement(element)) {
      return null;
    }

    try {
      const rect = element.getBoundingClientRect();

      if (
        rect.width <= 0 ||
        rect.height <= 0
      ) {
        return null;
      }

      return rect;
    } catch (_) {
      return null;
    }
  }

  function resolveActivePane() {
    const selectors = [
      '[data-thread-user-message-navigation-content]',
      '[data-thread-find-target="conversation"]',
      '#thread-bottom-container',
      '#prompt-textarea'
    ];

    for (const selector of selectors) {
      let anchor = null;

      try {
        anchor = Array.from(
          document.querySelectorAll(selector)
        ).find(isVisibleElement) || null;
      } catch (_) {}

      if (!anchor) {
        continue;
      }

      const main =
        nearestMain(anchor) ||
        anchor.closest?.('main,[role="main"]') ||
        null;

      if (getVisibleRect(main)) {
        return main;
      }

      let current = anchor;

      for (let depth = 0; current && depth < 8; depth += 1) {
        const rect = getVisibleRect(current);

        if (
          rect &&
          rect.width >= 320 &&
          rect.height >= 200
        ) {
          return current;
        }

        current = current.parentElement;
      }
    }

    try {
      return Array.from(
        document.querySelectorAll(
          'main,[role="main"]'
        )
      ).find(isVisibleElement) || null;
    } catch (_) {
      return null;
    }
  }

  function measureEffectivePane() {
    const pane =
      runtime.observedPane?.isConnected
        ? runtime.observedPane
        : resolveActivePane();

    const rect = getVisibleRect(pane);

    const width = rect
      ? Math.round(rect.width)
      : Math.max(0, Math.round(window.innerWidth || 0));

    const height = rect
      ? Math.round(rect.height)
      : Math.max(0, Math.round(window.innerHeight || 0));

    runtime.effectivePaneWidth = width;
    runtime.effectivePaneHeight = height;

    return {
      element: pane || null,
      width,
      height,
      source: rect ? 'pane' : 'viewport'
    };
  }

  function getAdaptiveWidth() {
    const measured =
      runtime.effectivePaneWidth > 0
        ? runtime.effectivePaneWidth
        : measureEffectivePane().width;

    return measured > 0
      ? measured
      : (window.innerWidth || 0);
  }

  function getExpectedContentWidthPx(
    paneWidth = getAdaptiveWidth()
  ) {
    const width =
      Math.max(0, Number(paneWidth || 0));

    const viewportWidth =
      Math.max(
        0,
        Number(window.innerWidth || width)
      );

    const gutter = Math.min(
      settings.gutterMax,
      Math.max(
        settings.gutterMin,
        viewportWidth *
          (settings.gutterVw / 100)
      )
    );

    const available =
      Math.max(
        0,
        width - (gutter * 2)
      );

    if (settings.cap === 'none') {
      return available;
    }

    const cap =
      Number(settings.cap);

    return Number.isFinite(cap)
      ? Math.min(available, cap)
      : available;
  }

  function isWideActive() {
    if (!settings.enabled || !settings.wide) {
      return false;
    }

    if (!settings.auto) {
      return true;
    }

    if (
      settings.disableOnTouch &&
      isTouchLike()
    ) {
      return false;
    }

    if (
      settings.disableBelowHeight > 0 &&
      window.innerHeight > 0 &&
      window.innerHeight <
        settings.disableBelowHeight
    ) {
      return false;
    }

    return (
      getAdaptiveWidth() >=
      settings.autoMinWidth
    );
  }

  function detectDomCapabilities() {
    const queryOne = (selector) => {
      try {
        return Boolean(document.querySelector(selector));
      } catch (_) {
        return false;
      }
    };

    const queryCount = (selector) => {
      try {
        return document.querySelectorAll(selector).length;
      } catch (_) {
        return 0;
      }
    };

    const virtualizedTurnCount = queryCount(
      '[data-turn-key],[data-content-search-turn-key]'
    );
    const fallbackTurnCount = queryCount(SELECTOR.fallbackMessages);

    const capabilities = {
      mainPresent: queryOne(SELECTOR.main),
      transcriptRoot: queryOne(
        '[data-thread-user-message-navigation-content]'
      ),
      conversationTarget: queryOne(
        '[data-thread-find-target="conversation"]'
      ),
      threadBottomContainer: queryOne('#thread-bottom-container'),
      promptTextarea: queryOne(
        '#prompt-textarea,[data-testid="prompt-textarea"]'
      ),
      virtualizedTurns: virtualizedTurnCount > 0,
      virtualizedTurnCount,
      fallbackTurns: fallbackTurnCount > 0,
      fallbackTurnCount,
      threadVariableWrappers: queryOne(
        '[class*="thread-content-max-width"],[class*="thread-body-max-width"]'
      ),
      splitView: runtime.canvasDetected,
      resizeObserver: typeof ResizeObserver === 'function'
    };

    const selection = selectDomStrategy(capabilities);
    capabilities.strategy = selection.id;
    capabilities.strategyCandidate = selection.candidateId;
    capabilities.strategyConfidence = selection.confidence;
    capabilities.strategyThreshold = selection.threshold;
    capabilities.strategyLowConfidence = selection.lowConfidence;
    capabilities.strategyCandidates = selection.candidates;

    runtime.lastCapabilities = capabilities;

    if (
      !runtime.lastSelectorHealthAt ||
      Date.now() - runtime.lastSelectorHealthAt >
        CONFIG.selectorHealthStaleMs
    ) {
      updateSelectorHealth();
    }

    return capabilities;
  }

  function evaluateCompatibility(
    capabilities = detectDomCapabilities()
  ) {
    const issues = [];
    let score = 100;

    if (
      !capabilities.transcriptRoot &&
      !capabilities.conversationTarget
    ) {
      score -= 35;
      issues.push(
        'No current transcript/conversation root detected'
      );
    }

    if (
      !capabilities.virtualizedTurns &&
      !capabilities.fallbackTurns
    ) {
      score -= 35;
      issues.push('No conversation turns detected');
    }

    if (
      settings.widenComposer &&
      !capabilities.promptTextarea &&
      !capabilities.threadBottomContainer
    ) {
      score -= 20;
      issues.push('Composer root/input not detected');
    }

    if (capabilities.strategyLowConfidence) {
      score -= 15;
      issues.push(
        `DOM strategy confidence ${capabilities.strategyConfidence || 0}% is below ${capabilities.strategyThreshold || CONFIG.strategyMinConfidence}%`
      );
    }

    if (
      capabilities.strategy === 'unknown'
    ) {
      score -= 10;
      issues.push('No supported layout strategy resolved');
    }

    score = Math.max(0, score);

    const status =
      score >= 90
        ? 'healthy'
        : score >= 60
          ? 'degraded'
          : 'unsupported';

    const result = {
      status,
      score,
      strategy: capabilities.strategy,
      issues
    };

    runtime.lastCompatibility = result;
    return result;
  }

  function onPaneResize(entries) {
    const entry = entries?.[0];

    if (!entry) {
      return;
    }

    const rect =
      entry.contentRect ||
      getVisibleRect(runtime.observedPane);

    if (!rect) {
      return;
    }

    const width =
      Math.max(0, Math.round(rect.width));

    const height =
      Math.max(0, Math.round(rect.height));

    const changed =
      width !== runtime.effectivePaneWidth ||
      height !== runtime.effectivePaneHeight;

    runtime.effectivePaneWidth = width;
    runtime.effectivePaneHeight = height;
    runtime.lastPaneResizeAt = Date.now();
    runtime.paneResizeCount += 1;

    if (!changed || !runtime.started) {
      return;
    }

    if (!settings.enabled) {
      clearRootState();
      syncSettingsModal();
      return;
    }

    setRootState();
    syncSettingsModal();
    requestRepair(
      'pane-resize',
      [DIRTY.split, DIRTY.root]
    );
  }

  function attachPaneResizeObserver() {
    const pane = resolveActivePane();

    if (
      pane === runtime.observedPane &&
      runtime.paneResizeObserver
    ) {
      measureEffectivePane();
      return true;
    }

    runtime.paneResizeObserver?.disconnect();
    runtime.paneResizeObserver = null;
    runtime.observedPane = null;

    if (!pane) {
      measureEffectivePane();
      return false;
    }

    runtime.observedPane = pane;
    measureEffectivePane();

    if (typeof ResizeObserver !== 'function') {
      return false;
    }

    try {
      const epoch =
        currentRuntimeEpoch();

      runtime.paneResizeObserver =
        new ResizeObserver(
          guardRuntimeEpoch(
            onPaneResize,
            'pane-resize-observer',
            epoch
          )
        );

      runtime.paneResizeObserver.observe(pane);
      return true;
    } catch (_) {
      runtime.paneResizeObserver = null;
      return false;
    }
  }

  function disconnectPaneResizeObserver() {
    runtime.paneResizeObserver?.disconnect();
    runtime.paneResizeObserver = null;
    runtime.observedPane = null;
    runtime.effectivePaneWidth = 0;
    runtime.effectivePaneHeight = 0;
  }

  function detectCanvas() {
    try {
      runtime.canvasDetected = Array.from(
        document.querySelectorAll(
          SELECTOR.splitViewIndicators
        )
      ).some(isVisibleElement);
    } catch (_) {
      runtime.canvasDetected = false;
    }

    return runtime.canvasDetected;
  }

  function buildMainCss() {
    const cap =
      settings.cap === 'none'
        ? 'none'
        : `${settings.cap}px`;

    const safeMediaCss = settings.safeMedia
      ? `
:root[${ATTR.enabled}="1"][${ATTR.wide}="1"]
[${ATTR.turn}="1"] img,
:root[${ATTR.enabled}="1"][${ATTR.wide}="1"]
[${ATTR.turn}="1"] video,
:root[${ATTR.enabled}="1"][${ATTR.wide}="1"]
[${ATTR.turn}="1"] iframe,
:root[${ATTR.enabled}="1"][${ATTR.wide}="1"]
[${ATTR.turn}="1"] figure{
  max-width:100%!important;
  box-sizing:border-box!important;
}

:root[${ATTR.enabled}="1"][${ATTR.wide}="1"]
[${ATTR.turn}="1"] img,
:root[${ATTR.enabled}="1"][${ATTR.wide}="1"]
[${ATTR.turn}="1"] video{
  height:auto!important;
}

:root[${ATTR.enabled}="1"][${ATTR.wide}="1"]
[${ATTR.turn}="1"] pre{
  max-width:100%!important;
  overflow-x:auto!important;
}

:root[${ATTR.enabled}="1"][${ATTR.wide}="1"]
[${ATTR.turn}="1"] table{
  display:block!important;
  width:100%!important;
  max-width:100%!important;
  overflow-x:auto!important;
}`
      : '';

    return `
:root[${ATTR.version}="${VERSION}"]{
  --uwc-gutter:clamp(
    ${settings.gutterMin}px,
    ${settings.gutterVw}vw,
    ${settings.gutterMax}px
  );
  --uwc-cap:${cap};
  --uwc-available-width:calc(
    100% - (var(--uwc-gutter) * 2)
  );
  --uwc-content-width:var(--uwc-available-width);
}

:root[${ATTR.version}="${VERSION}"]:not([${ATTR.cap}="none"]){
  --uwc-content-width:min(
    var(--uwc-available-width),
    var(--uwc-cap)
  );
}

:root[${ATTR.enabled}="1"][${ATTR.wide}="1"] body{
  overflow-x:clip!important;
}

@supports not (overflow-x:clip){
  :root[${ATTR.enabled}="1"][${ATTR.wide}="1"] body{
    overflow-x:hidden!important;
  }
}

/*
 * Current ChatGPT (October 2026) owns the effective reading width at the
 * virtualized transcript root. The stable variable chain is:
 *
 *   --thread-content-responsive-max-width
 *     -> --thread-content-max-width
 *     -> --thread-body-max-width
 *     -> max-w-(--thread-body-max-width)
 *
 * Override that chain directly. This is the primary UltraWide mechanism;
 * per-turn markers below are now supplemental for alignment/media handling.
 */

/* Semantic fallback: current ChatGPT width utilities inherit these variables.
   Applying them at main keeps sizing pane-relative and resilient when React
   changes intermediate wrappers or utility-class names. */
:root[${ATTR.enabled}="1"][${ATTR.wide}="1"] main{
  --thread-content-responsive-max-width:var(--uwc-content-width)!important;
  --thread-content-max-width:var(--uwc-content-width)!important;
  --thread-body-max-width:calc(
    var(--thread-content-max-width) +
    (var(--thread-body-inline-padding,0px) * 2)
  )!important;
}

:root[${ATTR.enabled}="1"][${ATTR.wide}="1"]
[data-thread-user-message-navigation-content]{
  --thread-content-responsive-max-width:var(--uwc-content-width)!important;
  --thread-content-max-width:var(--uwc-content-width)!important;
  --thread-body-max-width:calc(
    var(--thread-content-max-width) +
    (var(--thread-body-inline-padding,0px) * 2)
  )!important;
  width:100%!important;
  max-width:var(--thread-body-max-width)!important;
  min-width:0!important;
  margin-inline:auto!important;
  box-sizing:border-box!important;
}

/* Conversation content inherits the transcript variables even when React
   virtualizes and remounts individual turns. */
:root[${ATTR.enabled}="1"][${ATTR.wide}="1"]
[data-thread-find-target="conversation"]{
  --thread-content-responsive-max-width:var(--uwc-content-width)!important;
  --thread-content-max-width:var(--uwc-content-width)!important;
  --thread-body-max-width:calc(
    var(--thread-content-max-width) +
    (var(--thread-body-inline-padding,0px) * 2)
  )!important;
  width:100%!important;
  max-width:none!important;
  min-width:0!important;
}

/* Any current width wrapper that redefines the same variables is normalized
   back to the UltraWide width. Variable names are stable semantic anchors and
   avoid dependency on generated hash classes. */
:root[${ATTR.enabled}="1"][${ATTR.wide}="1"]
[data-thread-user-message-navigation-content] [class*="thread-content-max-width"],
:root[${ATTR.enabled}="1"][${ATTR.wide}="1"]
[data-thread-user-message-navigation-content] [class*="thread-body-max-width"]{
  --thread-content-responsive-max-width:var(--uwc-content-width)!important;
  --thread-content-max-width:var(--uwc-content-width)!important;
  --thread-body-max-width:calc(
    var(--thread-content-max-width) +
    (var(--thread-body-inline-padding,0px) * 2)
  )!important;
}

/* Current composer uses the same thread-variable system. Keep the bottom
   container structurally full width and let its inner responsive wrapper use
   the configured UltraWide width. */
:root[${ATTR.enabled}="1"][${ATTR.wide}="1"]
#thread-bottom-container{
  --thread-content-responsive-max-width:var(--uwc-content-width)!important;
  --thread-content-max-width:var(--uwc-content-width)!important;
  --thread-body-max-width:calc(
    var(--thread-content-max-width) +
    (var(--thread-body-inline-padding,0px) * 2)
  )!important;
  width:100%!important;
  max-width:none!important;
  min-width:0!important;
}

:root[${ATTR.enabled}="1"][${ATTR.wide}="1"]
#thread-bottom-container [class*="thread-content-max-width"],
:root[${ATTR.enabled}="1"][${ATTR.wide}="1"]
#thread-bottom-container [class*="thread-body-max-width"]{
  --thread-content-responsive-max-width:var(--uwc-content-width)!important;
  --thread-content-max-width:var(--uwc-content-width)!important;
  --thread-body-max-width:calc(
    var(--thread-content-max-width) +
    (var(--thread-body-inline-padding,0px) * 2)
  )!important;
  width:var(--uwc-content-width)!important;
  max-width:var(--thread-body-max-width)!important;
  min-width:0!important;
  margin-inline:auto!important;
}

:root[${ATTR.enabled}="1"][${ATTR.wide}="1"]
[${ATTR.conversationRoot}="1"],
:root[${ATTR.enabled}="1"][${ATTR.wide}="1"]
[${ATTR.conversationPath}="1"]{
  width:100%!important;
  max-width:none!important;
  min-width:0!important;
  box-sizing:border-box!important;
}

:root[${ATTR.enabled}="1"][${ATTR.wide}="1"]
[${ATTR.turn}="1"]{
  width:var(--uwc-content-width)!important;
  max-width:var(--uwc-content-width)!important;
  min-width:0!important;
  margin-inline:auto!important;
  box-sizing:border-box!important;
}

:root[${ATTR.enabled}="1"][${ATTR.wide}="1"]
[${ATTR.turnPath}="1"]{
  width:100%!important;
  max-width:none!important;
  min-width:0!important;
  box-sizing:border-box!important;
}

:root[${ATTR.enabled}="1"][${ATTR.wide}="1"]
[${ATTR.composerPath}="1"]{
  width:100%!important;
  max-width:none!important;
  min-width:0!important;
  margin-inline:0!important;
  box-sizing:border-box!important;
}

:root[${ATTR.enabled}="1"][${ATTR.wide}="1"]
[${ATTR.composer}="1"]{
  width:var(--uwc-content-width)!important;
  max-width:var(--uwc-content-width)!important;
  min-width:0!important;
  margin-inline:auto!important;
  box-sizing:border-box!important;
}

:root[${ATTR.enabled}="1"][${ATTR.wide}="1"]
[${ATTR.planNoticePath}="1"]{
  width:100%!important;
  max-width:none!important;
  min-width:0!important;
  box-sizing:border-box!important;
}

:root[${ATTR.enabled}="1"][${ATTR.wide}="1"]
[${ATTR.planNotice}="1"]{
  width:var(--uwc-content-width)!important;
  max-width:var(--uwc-content-width)!important;
  min-width:0!important;
  margin-inline:auto!important;
  box-sizing:border-box!important;
}

:root[${ATTR.enabled}="1"][${ATTR.wide}="1"][${ATTR.canvas}="1"]
[${ATTR.turn}="1"],
:root[${ATTR.enabled}="1"][${ATTR.wide}="1"][${ATTR.canvas}="1"]
[${ATTR.composer}="1"]{
  width:calc(
    100% - (var(--uwc-gutter) * 2)
  )!important;
  max-width:calc(
    100% - (var(--uwc-gutter) * 2)
  )!important;
}

:root[${ATTR.enabled}="1"][${ATTR.left}="1"]
[${ATTR.turn}="1"]{
  text-align:left!important;
}

:root[${ATTR.enabled}="1"][${ATTR.left}="1"]
[${ATTR.composer}="1"] textarea,
:root[${ATTR.enabled}="1"][${ATTR.left}="1"]
[${ATTR.composer}="1"] [contenteditable="true"]{
  text-align:left!important;
}

/* When the current virtualized transcript root is present, it owns the
   configured width. Turn markers inside it must stay full-width so nested
   percentages cannot compound and shrink the conversation. */
:root[${ATTR.enabled}="1"][${ATTR.wide}="1"]
[data-thread-user-message-navigation-content] [${ATTR.turn}="1"]{
  width:100%!important;
  max-width:none!important;
  min-width:0!important;
  margin-inline:0!important;
}

/* The current composer root is structural. Keep it full-width and let the
   inner thread-variable wrapper carry the configured UltraWide width. */
:root[${ATTR.enabled}="1"][${ATTR.wide}="1"]
#thread-bottom-container[${ATTR.composer}="1"]{
  width:100%!important;
  max-width:none!important;
  min-width:0!important;
  margin-inline:0!important;
}

/* Current virtualized assistant/user message markers. */
:root[${ATTR.enabled}="1"][${ATTR.wide}="1"]
[data-markdown-text-style="assistant-message"]{
  width:100%!important;
  max-width:none!important;
  min-width:0!important;
  box-sizing:border-box!important;
}

:root[${ATTR.enabled}="1"][${ATTR.left}="1"]
[data-markdown-text-style="assistant-message"]{
  text-align:left!important;
}

:root[${ATTR.enabled}="1"][${ATTR.wide}="1"]
[data-user-message-bubble="true"]{
  max-width:min(var(--user-chat-width,80%),var(--uwc-content-width))!important;
}

${safeMediaCss}

@media (max-width:1099px), (max-height:559px){
  :root[${ATTR.version}="${VERSION}"]{
    --uwc-gutter:12px;
  }
}

@media print{
  :root[${ATTR.enabled}="1"]
  [${ATTR.turn}="1"]{
    width:100%!important;
    max-width:none!important;
  }
}`.trim();
  }

  function buildUiCss() {
    return `
#${ID.toast}{
  --uwc-ui-bg:var(--main-surface-primary,Canvas);
  --uwc-ui-text:var(--text-primary,CanvasText);
  position:fixed!important;
  right:18px!important;
  bottom:18px!important;
  z-index:2147483647!important;
  max-width:min(440px,calc(100vw - 36px))!important;
  padding:11px 14px!important;
  border:1px solid var(--border-light,color-mix(in srgb,var(--uwc-ui-text) 12%,transparent))!important;
  border-radius:13px!important;
  background:color-mix(in srgb,var(--uwc-ui-bg) 96%,transparent)!important;
  color:var(--uwc-ui-text)!important;
  box-shadow:0 14px 40px rgba(0,0,0,.24)!important;
  font:13px/1.4 ui-sans-serif,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif!important;
  pointer-events:none!important;
  backdrop-filter:blur(18px) saturate(1.15)!important;
}

#${ID.debugOverlay}{
  --uwc-debug-bg:rgba(12,18,22,.9);
  --uwc-debug-text:#d8fff4;
  --uwc-debug-border:rgba(16,163,127,.46);
  position:fixed!important;
  left:16px!important;
  bottom:16px!important;
  z-index:2147483645!important;
  display:grid!important;
  gap:4px!important;
  max-width:min(440px,calc(100vw - 32px))!important;
  padding:10px 12px!important;
  border:1px solid var(--uwc-debug-border)!important;
  border-radius:12px!important;
  background:var(--uwc-debug-bg)!important;
  color:var(--uwc-debug-text)!important;
  box-shadow:0 14px 36px rgba(0,0,0,.28)!important;
  font:11px/1.35 ui-monospace,SFMono-Regular,Consolas,monospace!important;
  pointer-events:none!important;
  backdrop-filter:blur(14px)!important;
}

#${ID.debugOverlay} strong{
  font-weight:700!important;
  color:#fff!important;
}

#${ID.modal}{
  --uwc-accent:#10a37f;
  --uwc-accent-strong:#0d8f70;
  --uwc-danger:#ef4444;
  --uwc-warning:#d97706;
  --uwc-ui-bg:var(--main-surface-primary,Canvas);
  --uwc-ui-bg-secondary:var(--main-surface-secondary,color-mix(in srgb,CanvasText 4%,Canvas));
  --uwc-ui-bg-tertiary:var(--main-surface-tertiary,color-mix(in srgb,CanvasText 7%,Canvas));
  --uwc-ui-text:var(--text-primary,CanvasText);
  --uwc-ui-muted:var(--text-secondary,color-mix(in srgb,CanvasText 62%,transparent));
  --uwc-ui-border:var(--border-light,color-mix(in srgb,CanvasText 11%,transparent));
  --uwc-ui-border-strong:var(--border-medium,color-mix(in srgb,CanvasText 19%,transparent));
  position:fixed!important;
  inset:0!important;
  z-index:2147483646!important;
  display:flex!important;
  align-items:center!important;
  justify-content:center!important;
  padding:22px!important;
  background:rgba(0,0,0,.58)!important;
  color:var(--uwc-ui-text)!important;
  font:14px/1.45 ui-sans-serif,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif!important;
  backdrop-filter:blur(7px)!important;
}

#${ID.modal} *{
  box-sizing:border-box!important;
}

#${ID.modal} .uwc-panel{
  width:min(920px,100%)!important;
  max-height:min(92vh,960px)!important;
  overflow:auto!important;
  overscroll-behavior:contain!important;
  scrollbar-gutter:stable!important;
  border:1px solid var(--uwc-ui-border)!important;
  border-radius:20px!important;
  background:var(--uwc-ui-bg)!important;
  color:var(--uwc-ui-text)!important;
  box-shadow:
    0 32px 100px rgba(0,0,0,.42),
    0 4px 18px rgba(0,0,0,.16)!important;
}

#${ID.modal} .uwc-header{
  position:sticky!important;
  top:0!important;
  z-index:4!important;
  display:flex!important;
  align-items:center!important;
  justify-content:space-between!important;
  gap:18px!important;
  padding:17px 20px!important;
  border-bottom:1px solid var(--uwc-ui-border)!important;
  background:color-mix(in srgb,var(--uwc-ui-bg) 95%,transparent)!important;
  backdrop-filter:blur(20px) saturate(1.1)!important;
}

#${ID.modal} .uwc-header-copy{
  min-width:0!important;
}

#${ID.modal} .uwc-title-row{
  display:flex!important;
  align-items:center!important;
  flex-wrap:wrap!important;
  gap:9px!important;
}

#${ID.modal} .uwc-title{
  margin:0!important;
  font-size:19px!important;
  line-height:1.2!important;
  font-weight:680!important;
  letter-spacing:-.018em!important;
}

#${ID.modal} .uwc-version{
  display:inline-flex!important;
  align-items:center!important;
  min-height:22px!important;
  padding:2px 8px!important;
  border:1px solid var(--uwc-ui-border)!important;
  border-radius:999px!important;
  background:var(--uwc-ui-bg-secondary)!important;
  color:var(--uwc-ui-muted)!important;
  font:600 11px/1 ui-monospace,SFMono-Regular,Consolas,monospace!important;
}

#${ID.modal} .uwc-subtitle{
  margin:4px 0 0!important;
  color:var(--uwc-ui-muted)!important;
  font-size:12px!important;
}

#${ID.modal} .uwc-close{
  display:grid!important;
  place-items:center!important;
  width:36px!important;
  min-width:36px!important;
  height:36px!important;
  padding:0!important;
  border:1px solid transparent!important;
  border-radius:10px!important;
  background:transparent!important;
  color:var(--uwc-ui-muted)!important;
  font-size:20px!important;
  font-weight:400!important;
}

#${ID.modal} .uwc-close:hover{
  border-color:var(--uwc-ui-border)!important;
  background:var(--uwc-ui-bg-secondary)!important;
  color:var(--uwc-ui-text)!important;
}

#${ID.modal} .uwc-body{
  padding:18px 20px 0!important;
}

#${ID.modal} .uwc-status{
  display:flex!important;
  align-items:center!important;
  justify-content:space-between!important;
  gap:14px!important;
  margin:0 0 12px!important;
  padding:14px 15px!important;
  border:1px solid color-mix(in srgb,var(--uwc-accent) 25%,var(--uwc-ui-border))!important;
  border-radius:15px!important;
  background:
    linear-gradient(135deg,
      color-mix(in srgb,var(--uwc-accent) 8%,var(--uwc-ui-bg)),
      var(--uwc-ui-bg-secondary))!important;
}

#${ID.modal} .uwc-status[data-state="inactive"]{
  border-color:var(--uwc-ui-border)!important;
  background:var(--uwc-ui-bg-secondary)!important;
}

#${ID.modal} .uwc-status-main{
  display:grid!important;
  grid-template-columns:auto minmax(0,1fr)!important;
  gap:2px 10px!important;
  min-width:0!important;
}

#${ID.modal} .uwc-status-main::before{
  content:""!important;
  grid-row:1 / span 2!important;
  align-self:start!important;
  width:9px!important;
  height:9px!important;
  margin-top:5px!important;
  border-radius:999px!important;
  background:var(--uwc-accent)!important;
  box-shadow:0 0 0 4px color-mix(in srgb,var(--uwc-accent) 14%,transparent)!important;
}

#${ID.modal} .uwc-status[data-state="inactive"] .uwc-status-main::before{
  background:var(--uwc-ui-muted)!important;
  box-shadow:none!important;
}

#${ID.modal} .uwc-status strong{
  color:var(--uwc-ui-text)!important;
  font-weight:650!important;
}

#${ID.modal} .uwc-status-detail{
  color:var(--uwc-ui-muted)!important;
  font-size:11px!important;
  white-space:normal!important;
}

#${ID.modal} .uwc-health-pill{
  display:inline-flex!important;
  align-items:center!important;
  justify-content:center!important;
  min-width:74px!important;
  min-height:30px!important;
  padding:5px 9px!important;
  border:1px solid color-mix(in srgb,var(--uwc-accent) 32%,var(--uwc-ui-border))!important;
  border-radius:999px!important;
  background:color-mix(in srgb,var(--uwc-accent) 8%,var(--uwc-ui-bg))!important;
  color:var(--uwc-ui-text)!important;
  font:650 11px/1 ui-monospace,SFMono-Regular,Consolas,monospace!important;
  white-space:nowrap!important;
}

#${ID.modal} .uwc-overview{
  display:grid!important;
  grid-template-columns:repeat(6,minmax(0,1fr))!important;
  gap:8px!important;
  margin:0 0 14px!important;
}

#${ID.modal} .uwc-metric{
  min-width:0!important;
  padding:10px!important;
  border:1px solid var(--uwc-ui-border)!important;
  border-radius:12px!important;
  background:var(--uwc-ui-bg-secondary)!important;
}

#${ID.modal} .uwc-metric-label{
  display:block!important;
  margin-bottom:4px!important;
  color:var(--uwc-ui-muted)!important;
  font-size:9px!important;
  font-weight:650!important;
  text-transform:uppercase!important;
  letter-spacing:.07em!important;
}

#${ID.modal} .uwc-metric-value{
  display:block!important;
  overflow:hidden!important;
  color:var(--uwc-ui-text)!important;
  font:650 12px/1.25 ui-monospace,SFMono-Regular,Consolas,monospace!important;
  text-overflow:ellipsis!important;
  white-space:nowrap!important;
}

#${ID.modal} .uwc-section{
  margin:0 0 12px!important;
  padding:14px!important;
  border:1px solid var(--uwc-ui-border)!important;
  border-radius:14px!important;
  background:var(--uwc-ui-bg-secondary)!important;
}

#${ID.modal} .uwc-section h3{
  margin:0 0 11px!important;
  color:var(--uwc-ui-muted)!important;
  font-size:10px!important;
  line-height:1.2!important;
  font-weight:700!important;
  text-transform:uppercase!important;
  letter-spacing:.08em!important;
}

#${ID.modal} .uwc-grid{
  display:grid!important;
  grid-template-columns:repeat(2,minmax(0,1fr))!important;
  gap:8px!important;
}

#${ID.modal} .uwc-field{
  display:flex!important;
  flex-direction:column!important;
  justify-content:center!important;
  gap:6px!important;
  min-height:58px!important;
  padding:9px 10px!important;
  border:1px solid transparent!important;
  border-radius:11px!important;
  background:var(--uwc-ui-bg)!important;
}

#${ID.modal} .uwc-field:focus-within{
  border-color:color-mix(in srgb,var(--uwc-accent) 48%,var(--uwc-ui-border))!important;
}

#${ID.modal} .uwc-check{
  display:grid!important;
  grid-template-columns:minmax(0,1fr) auto!important;
  grid-template-areas:"copy toggle"!important;
  align-items:center!important;
  gap:12px!important;
  min-height:58px!important;
  padding:9px 10px!important;
  border:1px solid transparent!important;
  border-radius:11px!important;
  background:var(--uwc-ui-bg)!important;
  cursor:pointer!important;
  transition:
    background-color .14s ease,
    border-color .14s ease,
    box-shadow .14s ease!important;
}

#${ID.modal} .uwc-check:hover{
  border-color:var(--uwc-ui-border)!important;
  background:var(--uwc-ui-bg-tertiary)!important;
}

#${ID.modal} .uwc-check:has(input:focus-visible){
  border-color:color-mix(in srgb,var(--uwc-accent) 65%,var(--uwc-ui-border))!important;
  box-shadow:0 0 0 3px color-mix(in srgb,var(--uwc-accent) 14%,transparent)!important;
}

#${ID.modal} .uwc-check input[type="checkbox"]{
  position:absolute!important;
  width:1px!important;
  min-width:1px!important;
  height:1px!important;
  min-height:1px!important;
  margin:0!important;
  padding:0!important;
  opacity:0!important;
  pointer-events:none!important;
}

#${ID.modal} .uwc-check-copy{
  grid-area:copy!important;
  min-width:0!important;
  color:var(--uwc-ui-text)!important;
  font-weight:520!important;
}

#${ID.modal} .uwc-toggle-state{
  grid-area:toggle!important;
  position:relative!important;
  display:inline-flex!important;
  width:40px!important;
  min-width:40px!important;
  height:23px!important;
  padding:0!important;
  overflow:hidden!important;
  border:1px solid var(--uwc-ui-border-strong)!important;
  border-radius:999px!important;
  background:var(--uwc-ui-bg-tertiary)!important;
  color:transparent!important;
  font-size:0!important;
  transition:
    background-color .16s ease,
    border-color .16s ease!important;
}

#${ID.modal} .uwc-toggle-state::after{
  content:""!important;
  position:absolute!important;
  left:3px!important;
  top:3px!important;
  width:15px!important;
  height:15px!important;
  border-radius:999px!important;
  background:var(--uwc-ui-muted)!important;
  transition:
    transform .16s ease,
    background-color .16s ease!important;
}

#${ID.modal} .uwc-check input:checked ~ .uwc-toggle-state{
  border-color:var(--uwc-accent)!important;
  background:var(--uwc-accent)!important;
}

#${ID.modal} .uwc-check input:checked ~ .uwc-toggle-state::after{
  transform:translateX(17px)!important;
  background:#fff!important;
}

#${ID.modal} label{
  font-weight:520!important;
}

#${ID.modal} .uwc-hint{
  display:block!important;
  margin-top:2px!important;
  color:var(--uwc-ui-muted)!important;
  font-size:10.5px!important;
  line-height:1.35!important;
  font-weight:400!important;
}

#${ID.modal} input,
#${ID.modal} select,
#${ID.modal} textarea,
#${ID.modal} button{
  color:var(--uwc-ui-text)!important;
  font:13px/1.4 ui-sans-serif,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif!important;
}

#${ID.modal} input:not([type="checkbox"]),
#${ID.modal} select,
#${ID.modal} textarea{
  width:100%!important;
  min-height:36px!important;
  padding:7px 10px!important;
  border:1px solid var(--uwc-ui-border-strong)!important;
  border-radius:9px!important;
  outline:none!important;
  background:var(--uwc-ui-bg)!important;
}

#${ID.modal} select{
  cursor:pointer!important;
}

#${ID.modal} input:not([type="checkbox"]):hover,
#${ID.modal} select:hover,
#${ID.modal} textarea:hover{
  border-color:color-mix(in srgb,var(--uwc-ui-text) 25%,var(--uwc-ui-border))!important;
}

#${ID.modal} input:not([type="checkbox"]):focus,
#${ID.modal} select:focus,
#${ID.modal} textarea:focus{
  border-color:var(--uwc-accent)!important;
  box-shadow:0 0 0 3px color-mix(in srgb,var(--uwc-accent) 13%,transparent)!important;
}

#${ID.modal} button{
  min-height:36px!important;
  padding:7px 12px!important;
  border:1px solid var(--uwc-ui-border)!important;
  border-radius:9px!important;
  background:var(--uwc-ui-bg)!important;
  cursor:pointer!important;
  font-weight:560!important;
  transition:
    background-color .14s ease,
    border-color .14s ease,
    transform .08s ease!important;
}

#${ID.modal} button:hover{
  background:var(--uwc-ui-bg-tertiary)!important;
  border-color:var(--uwc-ui-border-strong)!important;
}

#${ID.modal} button:active{
  transform:scale(.985)!important;
}

#${ID.modal} button:focus-visible,
#${ID.modal} input:focus-visible,
#${ID.modal} select:focus-visible,
#${ID.modal} summary:focus-visible{
  outline:2px solid color-mix(in srgb,var(--uwc-accent) 72%,transparent)!important;
  outline-offset:2px!important;
}

#${ID.modal} .uwc-primary{
  border-color:var(--uwc-accent)!important;
  background:var(--uwc-accent)!important;
  color:#fff!important;
}

#${ID.modal} .uwc-primary:hover{
  border-color:var(--uwc-accent-strong)!important;
  background:var(--uwc-accent-strong)!important;
}

#${ID.modal} .uwc-danger{
  color:var(--uwc-danger)!important;
}

#${ID.modal} .uwc-danger:hover{
  border-color:color-mix(in srgb,var(--uwc-danger) 34%,var(--uwc-ui-border))!important;
  background:color-mix(in srgb,var(--uwc-danger) 7%,var(--uwc-ui-bg))!important;
}

#${ID.modal} .uwc-health-breakdown{
  display:grid!important;
  grid-template-columns:repeat(6,minmax(0,1fr))!important;
  gap:7px!important;
  margin:0 0 12px!important;
}

#${ID.modal} .uwc-health-item{
  display:flex!important;
  align-items:center!important;
  justify-content:space-between!important;
  gap:8px!important;
  min-width:0!important;
  padding:8px 9px!important;
  border:1px solid var(--uwc-ui-border)!important;
  border-radius:10px!important;
  background:var(--uwc-ui-bg)!important;
}

#${ID.modal} .uwc-health-label{
  overflow:hidden!important;
  color:var(--uwc-ui-muted)!important;
  font-size:9px!important;
  font-weight:650!important;
  text-overflow:ellipsis!important;
  text-transform:uppercase!important;
  letter-spacing:.05em!important;
  white-space:nowrap!important;
}

#${ID.modal} .uwc-health-value{
  color:var(--uwc-ui-text)!important;
  font:700 11px/1 ui-monospace,SFMono-Regular,Consolas,monospace!important;
}

#${ID.modal} .uwc-advanced{
  margin:0 0 12px!important;
  overflow:hidden!important;
  border:1px solid var(--uwc-ui-border)!important;
  border-radius:14px!important;
  background:var(--uwc-ui-bg-secondary)!important;
}

#${ID.modal} .uwc-advanced > summary{
  display:flex!important;
  align-items:center!important;
  justify-content:space-between!important;
  gap:12px!important;
  min-height:46px!important;
  padding:12px 14px!important;
  cursor:pointer!important;
  color:var(--uwc-ui-text)!important;
  font-weight:620!important;
  list-style:none!important;
}

#${ID.modal} .uwc-advanced > summary::-webkit-details-marker{
  display:none!important;
}

#${ID.modal} .uwc-advanced > summary::after{
  content:"+"!important;
  color:var(--uwc-ui-muted)!important;
  font:600 17px/1 ui-monospace,SFMono-Regular,Consolas,monospace!important;
}

#${ID.modal} .uwc-advanced[open] > summary::after{
  content:"−"!important;
}

#${ID.modal} .uwc-advanced-body{
  padding:0 12px 12px!important;
}

#${ID.modal} .uwc-advanced-body .uwc-section{
  margin-bottom:8px!important;
}

#${ID.modal} .uwc-shortcuts{
  display:grid!important;
  grid-template-columns:repeat(4,minmax(0,1fr))!important;
  gap:7px!important;
}

#${ID.modal} .uwc-shortcuts span{
  display:flex!important;
  align-items:center!important;
  min-height:33px!important;
  padding:7px 9px!important;
  border:1px solid var(--uwc-ui-border)!important;
  border-radius:9px!important;
  background:var(--uwc-ui-bg)!important;
  color:var(--uwc-ui-muted)!important;
  font:11px/1.3 ui-monospace,SFMono-Regular,Consolas,monospace!important;
}

#${ID.modal} .uwc-inline-actions{
  display:flex!important;
  flex-wrap:wrap!important;
  gap:8px!important;
  padding:4px 0 0!important;
}

#${ID.modal} .uwc-actions{
  position:sticky!important;
  bottom:0!important;
  z-index:4!important;
  display:flex!important;
  flex-wrap:wrap!important;
  align-items:center!important;
  justify-content:flex-end!important;
  gap:8px!important;
  margin:16px -20px 0!important;
  padding:13px 20px!important;
  border-top:1px solid var(--uwc-ui-border)!important;
  background:color-mix(in srgb,var(--uwc-ui-bg) 95%,transparent)!important;
  backdrop-filter:blur(20px) saturate(1.1)!important;
}

#${ID.modal} .uwc-actions::before{
  content:"Settings save automatically. Closing applies persisted changes."!important;
  margin-right:auto!important;
  color:var(--uwc-ui-muted)!important;
  font-size:10.5px!important;
  line-height:1.35!important;
}

@media (max-width:900px){
  #${ID.modal} .uwc-overview,
  #${ID.modal} .uwc-health-breakdown{
    grid-template-columns:repeat(3,minmax(0,1fr))!important;
  }
}

@media (max-width:700px){
  #${ID.modal}{
    align-items:stretch!important;
    padding:8px!important;
  }

  #${ID.modal} .uwc-panel{
    max-height:100%!important;
    border-radius:14px!important;
  }

  #${ID.modal} .uwc-header{
    padding:14px 15px!important;
  }

  #${ID.modal} .uwc-body{
    padding:13px 15px 0!important;
  }

  #${ID.modal} .uwc-status{
    align-items:flex-start!important;
  }

  #${ID.modal} .uwc-grid{
    grid-template-columns:1fr!important;
  }

  #${ID.modal} .uwc-shortcuts{
    grid-template-columns:repeat(2,minmax(0,1fr))!important;
  }

  #${ID.modal} .uwc-actions{
    margin:14px -15px 0!important;
    padding:12px 15px!important;
  }

  #${ID.modal} .uwc-actions::before{
    flex-basis:100%!important;
  }
}

@media (max-width:520px){
  #${ID.modal} .uwc-overview,
  #${ID.modal} .uwc-health-breakdown{
    grid-template-columns:repeat(2,minmax(0,1fr))!important;
  }

  #${ID.modal} .uwc-status{
    flex-direction:column!important;
  }

  #${ID.modal} .uwc-health-pill{
    align-self:flex-start!important;
  }

  #${ID.modal} .uwc-shortcuts{
    grid-template-columns:1fr!important;
  }

  #${ID.modal} .uwc-actions button{
    flex:1 1 calc(50% - 4px)!important;
  }
}

@media (prefers-reduced-motion:reduce){
  #${ID.toast},
  #${ID.modal},
  #${ID.modal} *{
    scroll-behavior:auto!important;
    transition:none!important;
    animation:none!important;
  }
}`.trim();
  }

  function getCssCacheKey() {
    return [
      VERSION,
      settings.cap,
      settings.gutterMin,
      settings.gutterVw,
      settings.gutterMax,
      settings.safeMedia
    ].join('|');
  }

  function getMainCss() {
    const key = getCssCacheKey();

    if (
      runtime.cssCacheKey !== key ||
      !runtime.mainCssCache
    ) {
      runtime.cssCacheKey = key;
      runtime.mainCssCache = buildMainCss();
    }

    return runtime.mainCssCache;
  }

  function getUiCss() {
    if (!runtime.uiCssCache) {
      runtime.uiCssCache = buildUiCss();
    }

    return runtime.uiCssCache;
  }

  function invalidateCssCache() {
    runtime.cssCacheKey = '';
    runtime.mainCssCache = '';
  }

  function ensureStyle(id, content) {
    const head = getHead();

    if (!head) {
      return false;
    }

    let changed = false;
    let style = document.getElementById(id);

    if (
      style &&
      (
        style.tagName !== 'STYLE' ||
        style.parentNode !== head
      )
    ) {
      if (style.parentNode) markMutationIntent(style.parentNode, 'childList');
      style.remove();
      style = null;
      changed = true;
    }

    try {
      const duplicates = Array.from(
        document.querySelectorAll(`[id="${id}"]`)
      );

      for (const duplicate of duplicates) {
        if (duplicate !== style) {
          if (duplicate.parentNode) markMutationIntent(duplicate.parentNode, 'childList');
          duplicate.remove();
          changed = true;
        }
      }
    } catch (_) {}

    if (!style) {
      style = document.createElement('style');
      style.id = id;
      style.type = 'text/css';
      markMutationIntent(head, 'childList');
      head.appendChild(style);
      changed = true;
    }

    if (
      style.getAttribute('data-version') !== VERSION
    ) {
      markMutationIntent(style, 'attributes', 'data-version');
      style.setAttribute('data-version', VERSION);
      changed = true;
    }

    if (style.textContent !== content) {
      markMutationIntent(style, 'childList');
      style.textContent = content;
      changed = true;
    }

    return changed;
  }

  function removeMainStyle() {
    return removeById(ID.style);
  }

  function removeUiStyle() {
    return removeById(ID.uiStyle);
  }

  function setRootState() {
    const root = getRoot();

    if (!root) {
      return;
    }

    setAttributeValue(
      root,
      ATTR.version,
      VERSION
    );

    setAttributeValue(
      root,
      ATTR.cap,
      settings.cap
    );

    setBooleanAttribute(
      root,
      ATTR.enabled,
      settings.enabled
    );

    setBooleanAttribute(
      root,
      ATTR.wide,
      isWideActive() &&
        !runtime.safeFallbackActive
    );

    setBooleanAttribute(
      root,
      ATTR.left,
      settings.enabled &&
        settings.left
    );

    setBooleanAttribute(
      root,
      ATTR.canvas,
      settings.enabled &&
        settings.canvasSafeMode &&
        runtime.canvasDetected
    );
  }

  function rootStateMatches() {
    const root = getRoot();

    if (!root) {
      return false;
    }

    if (!settings.enabled) {
      return ![
        ATTR.version,
        ATTR.cap,
        ATTR.enabled,
        ATTR.wide,
        ATTR.left,
        ATTR.canvas
      ].some((attribute) => root.hasAttribute(attribute));
    }

    const expectedBoolean = (enabled) =>
      enabled ? '1' : null;

    return (
      root.getAttribute(ATTR.version) === VERSION &&
      root.getAttribute(ATTR.cap) === settings.cap &&
      root.getAttribute(ATTR.enabled) ===
        expectedBoolean(settings.enabled) &&
      root.getAttribute(ATTR.wide) ===
        expectedBoolean(
          settings.enabled &&
          isWideActive() &&
          !runtime.safeFallbackActive
        ) &&
      root.getAttribute(ATTR.left) ===
        expectedBoolean(
          settings.enabled &&
          settings.left
        ) &&
      root.getAttribute(ATTR.canvas) ===
        expectedBoolean(
          settings.enabled &&
          settings.canvasSafeMode &&
          runtime.canvasDetected
        )
    );
  }

  function clearRootState() {
    const root = getRoot();
    if (!root) {
      return false;
    }

    let changed = false;
    for (const attribute of [
      ATTR.enabled,
      ATTR.wide,
      ATTR.left,
      ATTR.canvas,
      ATTR.cap,
      ATTR.version
    ]) {
      changed = setBooleanAttribute(root, attribute, false) || changed;
    }
    return changed;
  }

  function createDesiredMarkers() {
    return new Map(
      MANAGED_MARKERS.map((attribute) => [
        attribute,
        new Set()
      ])
    );
  }

  function addDesiredMarker(
    desired,
    attribute,
    element
  ) {
    if (!isConnectedElement(element)) {
      return;
    }

    desired.get(attribute)?.add(element);
  }

  function applyMarkerDiff(desired) {
    for (const attribute of MANAGED_MARKERS) {
      const previous =
        runtime.marked.get(attribute) ||
        new Set();

      const next =
        desired.get(attribute) ||
        new Set();

      for (const element of previous) {
        if (
          !element.isConnected ||
          !next.has(element)
        ) {
          setBooleanAttribute(element, attribute, false);
        }
      }

      for (const element of next) {
        if (!previous.has(element)) {
          setBooleanAttribute(element, attribute, true);
        }
      }

      runtime.marked.set(
        attribute,
        next
      );
    }
  }

  function clearManagedMarkers() {
    for (const attribute of MANAGED_MARKERS) {
      const elements =
        runtime.marked.get(attribute) ||
        new Set();

      for (const element of elements) {
        if (element?.removeAttribute) {
          setBooleanAttribute(element, attribute, false);
        }
      }

      runtime.marked.set(
        attribute,
        new Set()
      );
    }
  }

  function nearestMain(element) {
    if (!isConnectedElement(element)) {
      return null;
    }

    try {
      return element.closest(
        SELECTOR.main
      );
    } catch (_) {
      return null;
    }
  }

  function commonAncestor(
    elements,
    boundary
  ) {
    const valid =
      elements.filter(
        isConnectedElement
      );

    if (valid.length === 0) {
      return null;
    }

    let candidate = valid[0];

    while (
      candidate &&
      candidate !== boundary &&
      !valid.every((element) =>
        candidate.contains(element)
      )
    ) {
      candidate =
        candidate.parentElement;
    }

    if (
      candidate &&
      valid.every((element) =>
        candidate.contains(element)
      )
    ) {
      return candidate;
    }

    return boundary || null;
  }

  function addPath(
    desired,
    start,
    stopExclusive,
    attribute,
    maxDepth
  ) {
    let current = start;
    let depth = 0;

    while (
      current &&
      current !== stopExclusive &&
      depth < maxDepth
    ) {
      addDesiredMarker(
        desired,
        attribute,
        current
      );

      current =
        current.parentElement;

      depth += 1;
    }
  }

  function compactOutermostElements(elements, selector) {
    const unique = Array.from(
      new Set(
        elements.filter(isConnectedElement)
      )
    );

    return unique.filter((element) => {
      try {
        return !element.parentElement?.closest(selector);
      } catch (_) {
        return true;
      }
    });
  }

  function queryConversationTurns() {
    let preferred = [];

    try {
      preferred = Array.from(
        document.querySelectorAll(
          SELECTOR.preferredTurns
        )
      ).filter(isConnectedElement);
    } catch (_) {}

    runtime.lastRawTurnCount =
      preferred.length;

    if (preferred.length > 0) {
      return compactOutermostElements(
        preferred,
        SELECTOR.preferredTurns
      );
    }

    let fallbackMessages = [];

    try {
      fallbackMessages = Array.from(
        document.querySelectorAll(
          SELECTOR.fallbackMessages
        )
      ).filter(isConnectedElement);
    } catch (_) {}

    runtime.lastRawTurnCount =
      fallbackMessages.length;

    const fallbackTurns =
      fallbackMessages
        .map((message) => {
          return (
            message.closest('article') ||
            message.parentElement
          );
        })
        .filter(isConnectedElement);

    return Array.from(
      new Set(fallbackTurns)
    );
  }

  function findTurnContentAnchor(turn) {
    if (!isConnectedElement(turn)) {
      return null;
    }

    try {
      return (
        turn.querySelector(
          SELECTOR.turnContent
        ) ||
        turn.firstElementChild ||
        turn
      );
    } catch (_) {
      return (
        turn.firstElementChild ||
        turn
      );
    }
  }

  function markConversation(desired) {
    const turns =
      queryConversationTurns();

    runtime.lastTurnCount =
      turns.length;

    if (turns.length === 0) {
      return;
    }

    const mainCounts =
      new Map();

    for (const turn of turns) {
      const main =
        nearestMain(turn);

      if (!main) {
        continue;
      }

      mainCounts.set(
        main,
        (mainCounts.get(main) || 0) + 1
      );
    }

    const main =
      Array.from(
        mainCounts.entries()
      ).sort(
        (a, b) => b[1] - a[1]
      )[0]?.[0];

    if (!main) {
      return;
    }

    const mainTurns =
      turns.filter((turn) =>
        main.contains(turn)
      );

    if (mainTurns.length === 0) {
      return;
    }

    let conversationRoot =
      commonAncestor(
        mainTurns,
        main
      ) || main;

    if (
      mainTurns.length === 1 &&
      conversationRoot === mainTurns[0]
    ) {
      let current =
        conversationRoot.parentElement;

      let hops = 0;

      while (
        current &&
        current !== main &&
        hops < 4
      ) {
        conversationRoot = current;

        if (
          current.children.length > 1
        ) {
          break;
        }

        current =
          current.parentElement;

        hops += 1;
      }
    }

    addDesiredMarker(
      desired,
      ATTR.conversationRoot,
      conversationRoot
    );

    for (const turn of mainTurns) {
      addDesiredMarker(
        desired,
        ATTR.turn,
        turn
      );

      addPath(
        desired,
        turn.parentElement,
        conversationRoot,
        ATTR.conversationPath,
        CONFIG.maxConversationPathDepth
      );

      const anchor =
        findTurnContentAnchor(turn);

      if (
        anchor &&
        anchor !== turn
      ) {
        addPath(
          desired,
          anchor,
          turn,
          ATTR.turnPath,
          CONFIG.maxTurnPathDepth
        );
      }

      let direct =
        turn.firstElementChild;

      let directDepth = 0;

      while (
        direct &&
        directDepth < 3 &&
        direct.children.length === 1
      ) {
        addDesiredMarker(
          desired,
          ATTR.turnPath,
          direct
        );

        direct =
          direct.firstElementChild;

        directDepth += 1;
      }
    }
  }

  function findComposerInput() {
    let candidates = [];

    try {
      candidates = Array.from(
        document.querySelectorAll(
          SELECTOR.composerInput
        )
      )
        .filter(isConnectedElement)
        .slice(-CONFIG.maxComposerCandidates);
    } catch (_) {}

    if (candidates.length === 0) {
      return null;
    }

    const isExcluded = (element) => {
      try {
        return Boolean(
          element.closest(
            SELECTOR.excludedComposerAncestor
          )
        );
      } catch (_) {
        return false;
      }
    };

    const focused =
      document.activeElement;

    if (
      isElement(focused) &&
      candidates.includes(focused) &&
      !isExcluded(focused) &&
      isVisibleElement(focused)
    ) {
      return focused;
    }

    const scored = candidates
      .filter((element) =>
        !isExcluded(element) &&
        isVisibleElement(element)
      )
      .map((element, index) => {
        let score = index;

        try {
          if (element.id === 'prompt-textarea') {
            score += 1600;
          }

          if (
            element.matches(
              '[data-testid="prompt-textarea"],[data-testid="composer-input"],[data-testid="composer:input"]'
            )
          ) {
            score += 1200;
          }

          if (
            element.closest(
              '#thread-bottom-container'
            )
          ) {
            score += 800;
          }

          if (
            element.closest(
              'form[data-type="unified-composer"]'
            )
          ) {
            score += 500;
          }

          const rect =
            element.getBoundingClientRect();

          score += Math.max(
            0,
            Math.min(
              window.innerHeight || 0,
              rect.bottom
            )
          ) / 10;
        } catch (_) {}

        return {
          element,
          score
        };
      })
      .sort((a, b) =>
        b.score - a.score
      );

    return scored[0]?.element || null;
  }

  function markComposer(desired) {
    if (!settings.widenComposer) {
      return;
    }

    const input =
      findComposerInput();

    if (!input) {
      return;
    }

    const main =
      nearestMain(input);

    if (!main) {
      return;
    }

    let shell = null;

    try {
      shell = input.closest(
        SELECTOR.composerShell
      );
    } catch (_) {}

    if (!shell) {
      shell =
        input.closest('form') ||
        input.parentElement;
    }

    if (
      !shell ||
      !main.contains(shell)
    ) {
      return;
    }

    addDesiredMarker(
      desired,
      ATTR.composer,
      shell
    );

    let current =
      shell.parentElement;

    let depth = 0;

    while (
      current &&
      current !== main &&
      depth <
        CONFIG.maxComposerPathDepth
    ) {
      addDesiredMarker(
        desired,
        ATTR.composerPath,
        current
      );

      if (
        depth >= 1 &&
        current.parentElement &&
        current.parentElement
          .children.length > 2
      ) {
        break;
      }

      current =
        current.parentElement;

      depth += 1;
    }
  }

  function hasFreePlanNoticeText(element) {
    if (!isConnectedElement(element)) {
      return false;
    }

    try {
      const text = String(
        element.textContent || ''
      )
        .replace(/\s+/g, ' ')
        .trim()
        .toLowerCase();

      if (
        text.length < 8 ||
        text.length > 360
      ) {
        return false;
      }

      return (
        text.includes("you're on the free plan") ||
        text.includes('you’re on the free plan') ||
        text.includes('you are on the free plan') ||
        text.includes("you're on free") ||
        text.includes('you’re on free')
      );
    } catch (_) {
      return false;
    }
  }

  function findPlanNoticeCandidate(main) {
    const excludedSelector =
      `${SELECTOR.preferredTurns},${SELECTOR.fallbackMessages},${SELECTOR.excludedComposerAncestor}`;

    const chooseBest = (candidates) => {
      const matches = candidates.filter((element) => {
        if (
          !isVisibleElement(element) ||
          !hasFreePlanNoticeText(element)
        ) {
          return false;
        }

        try {
          return !element.closest(excludedSelector);
        } catch (_) {
          return true;
        }
      });

      matches.sort((a, b) => {
        if (a !== b) {
          if (a.contains(b)) {
            return 1;
          }

          if (b.contains(a)) {
            return -1;
          }
        }

        const aLength = String(a.textContent || '').length;
        const bLength = String(b.textContent || '').length;
        return aLength - bLength;
      });

      return matches[0] || null;
    };

    try {
      const semantic = Array.from(
        main.querySelectorAll(
          'aside,[role="status"],[role="note"],[aria-live],section'
        )
      );

      runtime.lastPlanNoticeCandidateCount =
        semantic.length;

      const semanticMatch =
        chooseBest(semantic);

      if (semanticMatch) {
        return semanticMatch;
      }

      const generic = Array.from(
        main.querySelectorAll('div')
      ).slice(-CONFIG.maxPlanNoticeCandidates);

      runtime.lastPlanNoticeCandidateCount +=
        generic.length;

      return chooseBest(generic);
    } catch (_) {
      runtime.lastPlanNoticeCandidateCount = 0;
      return null;
    }
  }

  function markPlanNotice(desired) {
    if (!isWideActive()) {
      runtime.lastPlanNoticeCandidateCount = 0;
      return;
    }

    const main = (() => {
      try {
        return Array.from(
          document.querySelectorAll(
            SELECTOR.main
          )
        ).find(isVisibleElement) || null;
      } catch (_) {
        return null;
      }
    })();

    if (!main) {
      runtime.lastPlanNoticeCandidateCount = 0;
      return;
    }

    const notice =
      findPlanNoticeCandidate(main);

    if (!notice) {
      return;
    }

    addDesiredMarker(
      desired,
      ATTR.planNotice,
      notice
    );

    addPath(
      desired,
      notice.parentElement,
      main,
      ATTR.planNoticePath,
      CONFIG.maxPlanNoticePathDepth
    );
  }

  function pushDebugEvent(type, details = null) {
    const event = {
      at: Date.now(),
      type: String(type || 'event')
    };

    if (details !== null && details !== undefined) {
      event.details = details;
    }

    runtime.debugEvents.push(event);

    if (runtime.debugEvents.length > CONFIG.debugEventLimit) {
      runtime.debugEvents.splice(
        0,
        runtime.debugEvents.length - CONFIG.debugEventLimit
      );
    }
  }

  function seedDesiredMarkers(desired, dirtyRegions) {
    const dirty = new Set(dirtyRegions);
    const groups = [
      [DIRTY.conversation, [
        ATTR.conversationRoot,
        ATTR.conversationPath,
        ATTR.turn,
        ATTR.turnPath
      ]],
      [DIRTY.composer, [
        ATTR.composer,
        ATTR.composerPath
      ]],
      [DIRTY.notice, [
        ATTR.planNotice,
        ATTR.planNoticePath
      ]]
    ];

    for (const [region, attributes] of groups) {
      if (dirty.has(region)) {
        continue;
      }

      for (const attribute of attributes) {
        const target = desired.get(attribute);
        const previous = runtime.marked.get(attribute);

        if (!target || !previous) {
          continue;
        }

        for (const element of previous) {
          if (isConnectedElement(element)) {
            target.add(element);
          }
        }
      }
    }
  }

  function recordRepairHistory(entry = {}) {
    const item = {
      at: Date.now(),
      reason: String(entry.reason || 'repair'),
      level: Number.isFinite(entry.level) ? entry.level : 0,
      result: String(entry.result || 'scheduled'),
      failures: Array.isArray(entry.failures) ? [...entry.failures] : [],
      durationMs: Number.isFinite(entry.durationMs) ? entry.durationMs : 0,
      planId: entry.planId || null,
      actions: Array.isArray(entry.actions) ? [...entry.actions] : [],
      conservative: Boolean(entry.conservative),
      convergence: entry.convergence || null
    };

    runtime.repairHistory.push(item);

    if (runtime.repairHistory.length > CONFIG.repairHistoryLimit) {
      runtime.repairHistory.splice(
        0,
        runtime.repairHistory.length - CONFIG.repairHistoryLimit
      );
    }

    return item;
  }

  function getRepairEffectivenessMetrics() {
    const history =
      runtime.repairHistory;

    const executed = history.length;
    const applied =
      history.filter(
        (item) =>
          item.result === 'applied'
      ).length;
    const idempotent =
      history.filter(
        (item) =>
          item.result === 'idempotent'
      ).length;
    const failed =
      history.filter(
        (item) =>
          item.result === 'error'
      ).length;
    const escalated =
      history.filter(
        (item) =>
          Number(item.level || 0) >= 4
      ).length;

    const successful =
      applied + idempotent;

    const totalDurationMs =
      history.reduce(
        (sum, item) =>
          sum +
          Number(item.durationMs || 0),
        0
      );

    return {
      requested:
        runtime.repairRequestCount,
      executed,
      applied,
      idempotent,
      successful,
      failed,
      escalated,
      coalesced:
        runtime.coalescedRepairCount,
      successRate:
        executed > 0
          ? successful / executed
          : 1,
      coalescingRate:
        runtime.repairRequestCount > 0
          ? runtime.coalescedRepairCount /
            runtime.repairRequestCount
          : 0,
      averageDurationMs:
        executed > 0
          ? totalDurationMs / executed
          : 0,
      maxDurationMs:
        history.reduce(
          (max, item) =>
            Math.max(
              max,
              Number(
                item.durationMs || 0
              )
            ),
          0
        ),
      convergencePasses:
        runtime.convergencePassCount,
      idempotentPasses:
        runtime.idempotentPassCount,
      lockContentions:
        runtime.reconcileLockContentionCount,
      queuedRequests:
        runtime.queuedReconciliationRequestCount,
      queuedRuns:
        runtime.queuedReconciliationRunCount
    };
  }

  function computeDomFingerprint() {
    const capabilities = detectDomCapabilities();
    const parts = [
      capabilities.strategy || 'unknown',
      `sc${capabilities.strategyConfidence || 0}`,
      capabilities.transcriptRoot ? 'tr1' : 'tr0',
      capabilities.conversationTarget ? 'ct1' : 'ct0',
      capabilities.threadBottomContainer ? 'tb1' : 'tb0',
      capabilities.promptTextarea ? 'pt1' : 'pt0',
      `vt${capabilities.virtualizedTurnCount || 0}`,
      `ft${capabilities.fallbackTurnCount || 0}`,
      runtime.canvasDetected ? 'sv1' : 'sv0'
    ];

    return parts.join('|');
  }

  function updateDomFingerprint(reason = 'scan') {
    const next = computeDomFingerprint();
    const previous = runtime.lastDomFingerprint;
    const changed = Boolean(previous && previous !== next);

    runtime.lastDomFingerprint = next;
    runtime.lastDomFingerprintAt = Date.now();

    if (changed) {
      runtime.lastDomFingerprintChangeAt = Date.now();
      runtime.domFingerprintChanges += 1;
      pushDebugEvent('dom-fingerprint-change', {
        reason,
        previous,
        next
      });
    }

    return { changed, previous, current: next };
  }

  function findVisibleManagedElement(attribute) {
    return Array.from(runtime.marked.get(attribute) || [])
      .find(isVisibleElement) || null;
  }

  function verifyAppliedWidths() {
    const pane = resolveActivePane();
    const paneRect = getVisibleRect(pane);
    const paneWidth = Number(paneRect?.width || 0);
    const expected = getExpectedContentWidthPx(paneWidth);
    const tolerance = Math.max(
      CONFIG.widthTolerancePx,
      expected * CONFIG.widthToleranceRatio
    );

    const turn = findVisibleManagedElement(ATTR.turn);
    const composer = findVisibleManagedElement(ATTR.composer);
    const turnWidth = Number(getVisibleRect(turn)?.width || 0);
    const composerWidth = Number(getVisibleRect(composer)?.width || 0);

    const shouldVerify = Boolean(
      settings.enabled &&
      isWideActive() &&
      !runtime.safeFallbackActive &&
      expected >= 320
    );

    const checks = {
      turn: !shouldVerify || !turn ||
        Math.abs(turnWidth - expected) <= tolerance ||
        turnWidth >= expected * 0.90,
      composer: !shouldVerify || !settings.widenComposer || !composer ||
        Math.abs(composerWidth - expected) <= tolerance ||
        composerWidth >= expected * 0.90,
      paneBound: !shouldVerify ||
        (!turnWidth || turnWidth <= paneWidth + 4) &&
        (!composerWidth || composerWidth <= paneWidth + 4)
    };

    const result = {
      ok: Object.values(checks).every(Boolean),
      checkedAt: Date.now(),
      paneWidth,
      expectedWidth: expected,
      tolerance,
      turnWidth,
      composerWidth,
      checks
    };

    runtime.lastWidthVerification = result;
    return result;
  }

  function deriveDesiredState() {
    const desired = {
      enabled: Boolean(settings.enabled),
      wide: Boolean(
        settings.enabled &&
        isWideActive() &&
        !runtime.safeFallbackActive
      ),
      left: Boolean(settings.enabled && settings.left),
      canvas: Boolean(
        settings.enabled &&
        settings.canvasSafeMode &&
        runtime.canvasDetected
      ),
      cap: settings.enabled ? settings.cap : null,
      mainStyle: Boolean(settings.enabled),
      uiStyle: true,
      observers: Boolean(runtime.started),
      paneObserver: Boolean(
        runtime.started &&
        typeof ResizeObserver === 'function' &&
        resolveActivePane()
      ),
      markers: Boolean(settings.enabled),
      fingerprint: computeDomFingerprint()
    };

    runtime.lastDesiredState = desired;
    return desired;
  }

  function inspectActualState() {
    const root = getRoot();
    const actual = {
      enabled: root?.getAttribute(ATTR.enabled) === '1',
      wide: root?.getAttribute(ATTR.wide) === '1',
      left: root?.getAttribute(ATTR.left) === '1',
      canvas: root?.getAttribute(ATTR.canvas) === '1',
      cap: root?.getAttribute(ATTR.cap),
      version: root?.getAttribute(ATTR.version),
      mainStyle: getStyleText(ID.style) === getMainCss(),
      uiStyle: getStyleText(ID.uiStyle) === getUiCss(),
      rootObserver: Boolean(runtime.rootObserver && runtime.observedRoot?.isConnected),
      bodyObserver: Boolean(runtime.bodyObserver && runtime.observedBody?.isConnected),
      headObserver: Boolean(runtime.headObserver && runtime.observedHead?.isConnected),
      paneObserver: Boolean(runtime.paneResizeObserver && runtime.observedPane?.isConnected),
      disconnectedMarkers: hasDisconnectedMarkers(),
      turnMarker: hasConnectedMarker(ATTR.turn),
      composerMarker: hasConnectedMarker(ATTR.composer),
      fingerprint: computeDomFingerprint(),
      width: verifyAppliedWidths()
    };

    runtime.lastActualState = actual;
    return actual;
  }

  function compareDesiredState(desired, actual) {
    const failures = [];
    const actions = new Set();
    const strategy = runtime.strategySelection || selectDomStrategy(
      runtime.lastCapabilities || detectDomCapabilities()
    );

    if (desired.uiStyle !== actual.uiStyle) {
      failures.push(FAILURE_CODE.UI_STYLE_INTEGRITY);
      actions.add('styles');
    }

    if (desired.mainStyle !== actual.mainStyle) {
      failures.push(
        desired.mainStyle
          ? FAILURE_CODE.MAIN_STYLE_INTEGRITY
          : FAILURE_CODE.MAIN_STYLE_UNWANTED
      );
      actions.add('styles');
    }

    if (
      desired.enabled !== actual.enabled ||
      desired.wide !== actual.wide ||
      desired.left !== actual.left ||
      desired.canvas !== actual.canvas ||
      desired.cap !== actual.cap ||
      (desired.enabled && actual.version !== VERSION)
    ) {
      failures.push(FAILURE_CODE.ROOT_STATE_INTEGRITY);
      actions.add('root');
    }

    if (
      desired.observers &&
      (!actual.rootObserver || !actual.bodyObserver || !actual.headObserver)
    ) {
      failures.push(FAILURE_CODE.OBSERVER_INTEGRITY);
      actions.add('observers');
    }

    if (actual.disconnectedMarkers) {
      failures.push(FAILURE_CODE.DISCONNECTED_MARKERS);
      actions.add('markers');
    }

    if (
      desired.markers &&
      runtime.lastTurnCount > 0 &&
      !actual.turnMarker
    ) {
      failures.push(FAILURE_CODE.TURN_MARKERS_MISSING);
      actions.add('markers');
    }

    if (
      desired.markers &&
      settings.widenComposer &&
      document.querySelector(SELECTOR.composerInput) &&
      !actual.composerMarker
    ) {
      failures.push(FAILURE_CODE.COMPOSER_MARKER_MISSING);
      actions.add('markers');
    }

    if (!actual.width.ok) {
      failures.push(FAILURE_CODE.WIDTH_VERIFICATION_FAILED);
      actions.add('markers');
      actions.add('root');
    }

    if (
      runtime.lastDomFingerprintChangeAt > 0 &&
      Date.now() - runtime.lastDomFingerprintChangeAt <= CONFIG.fingerprintChangeCooldownMs
    ) {
      failures.push(FAILURE_CODE.DOM_FINGERPRINT_CHANGED);
      actions.add('full-scan');
    }

    if (desired.enabled && strategy.lowConfidence) {
      failures.push(FAILURE_CODE.STRATEGY_LOW_CONFIDENCE);
      actions.add('root');
      actions.add('styles');
    }

    const result = {
      ok: failures.length === 0,
      failures: normalizeFailureCodes(failures),
      actions: [...actions],
      strategy: {
        id: strategy.id,
        candidateId: strategy.candidateId,
        confidence: strategy.confidence,
        threshold: strategy.threshold,
        lowConfidence: strategy.lowConfidence
      }
    };

    runtime.lastStateDiff = result;
    return result;
  }

  function getRepairLevelForFailures(failures = []) {
    const set = new Set(normalizeFailureCodes(failures));

    if (
      set.has(FAILURE_CODE.OBSERVER_INTEGRITY) ||
      set.has(FAILURE_CODE.DOM_FINGERPRINT_CHANGED)
    ) return 4;
    if (
      set.has(FAILURE_CODE.WIDTH_VERIFICATION_FAILED) ||
      set.has(FAILURE_CODE.WIDTH_EXCEEDS_PANE) ||
      set.has(FAILURE_CODE.WIDTH_UNDER_APPLIED) ||
      set.has(FAILURE_CODE.TURN_MARKERS_MISSING) ||
      set.has(FAILURE_CODE.COMPOSER_MARKER_MISSING) ||
      set.has(FAILURE_CODE.DISCONNECTED_MARKERS)
    ) return 3;
    if (
      set.has(FAILURE_CODE.MAIN_STYLE_INTEGRITY) ||
      set.has(FAILURE_CODE.MAIN_STYLE_MISSING) ||
      set.has(FAILURE_CODE.UI_STYLE_INTEGRITY)
    ) return 2;
    if (set.has(FAILURE_CODE.ROOT_STATE_INTEGRITY)) return 1;
    if (set.has(FAILURE_CODE.RECONCILIATION_DID_NOT_CONVERGE)) return 5;
    return Math.min(5, Math.max(1, runtime.enforcementRetryCount + 1));
  }

  function buildRepairPlan(diff, reason = 'repair', persist = true) {
    const failures = normalizeFailureCodes(diff?.failures || []);
    const requestedActions = new Set(diff?.actions || []);
    const lowConfidence = failures.includes(FAILURE_CODE.STRATEGY_LOW_CONFIDENCE);
    let level = getRepairLevelForFailures(failures);

    if (runtime.convergenceStallCount >= CONFIG.convergenceStallLimit) {
      failures.push(FAILURE_CODE.RECONCILIATION_STALLED);
      level = Math.max(level, 4);
    }

    if (runtime.convergenceStallCount >= CONFIG.convergenceHardLimit) {
      failures.push(FAILURE_CODE.RECONCILIATION_DID_NOT_CONVERGE);
      level = 5;
    }

    const conservative = Boolean(lowConfidence);
    if (conservative) {
      requestedActions.delete('markers');
      requestedActions.delete('full-scan');
      requestedActions.add('styles');
      requestedActions.add('root');
      level = Math.min(level, 2);
    }

    if (level >= 2) requestedActions.add('styles');
    if (level >= 1) requestedActions.add('root');
    if (level >= 4) requestedActions.add('observers');
    if (level >= 3 && !conservative) requestedActions.add('full-scan');

    const plan = {
      id: ++runtime.repairPlanCounter,
      createdAt: Date.now(),
      reason: String(reason || 'repair'),
      level: Math.max(1, Math.min(5, level)),
      failures: normalizeFailureCodes(failures),
      actions: [...requestedActions],
      conservative
    };

    if (persist) {
      runtime.lastRepairPlan = plan;
    }
    return plan;
  }

  function executeRepairPlan(plan) {
    if (!plan || !Array.isArray(plan.actions)) {
      return { ok: false, changed: false, reason: 'invalid-plan' };
    }

    const startedAt = nowMs();
    const actions = new Set(plan.actions);
    let changed = false;

    runtime.enforcementLevel = Math.max(
      runtime.enforcementLevel,
      Number(plan.level || 1)
    );

    try {
      if (actions.has('styles')) {
        changed = ensureStyle(ID.uiStyle, getUiCss()) || changed;
        if (settings.enabled) {
          changed = ensureStyle(ID.style, getMainCss()) || changed;
        } else {
          changed = removeMainStyle() || changed;
        }
      }

      if (actions.has('root')) {
        const before = rootStateMatches();
        settings.enabled ? setRootState() : clearRootState();
        changed = !before || changed;
      }

      if (actions.has('observers')) {
        const before = Boolean(
          runtime.rootObserver && runtime.bodyObserver && runtime.headObserver
        );
        attachObservers();
        attachPaneResizeObserver();
        const after = Boolean(
          runtime.rootObserver && runtime.bodyObserver && runtime.headObserver
        );
        changed = before !== after || changed;
      }

      if (actions.has('markers') || actions.has('full-scan')) {
        requestRepair(
          `${plan.reason}-plan-${plan.id}`,
          ALL_DIRTY_REGIONS,
          true
        );
        changed = true;
      }

      const result = {
        ok: true,
        changed,
        pending:
          actions.has('markers') ||
          actions.has('full-scan'),
        planId: plan.id,
        durationMs: Math.max(0, nowMs() - startedAt)
      };
      runtime.lastRepairPlanResult = result;
      recordRepairHistory({
        reason: plan.reason,
        level: plan.level,
        result: changed ? 'applied' : 'idempotent',
        failures: plan.failures,
        durationMs: result.durationMs,
        planId: plan.id,
        actions: plan.actions,
        conservative: plan.conservative,
        convergence: runtime.lastConvergence
      });
      return result;
    } catch (error) {
      runtime.lastError = String(error?.message || error);
      const result = {
        ok: false,
        changed,
        pending: false,
        planId: plan.id,
        error: runtime.lastError,
        durationMs: Math.max(0, nowMs() - startedAt)
      };
      runtime.lastRepairPlanResult = result;
      recordRepairHistory({
        reason: plan.reason,
        level: plan.level,
        result: 'error',
        failures: plan.failures,
        durationMs: result.durationMs,
        planId: plan.id,
        actions: plan.actions,
        conservative: plan.conservative,
        convergence: runtime.lastConvergence
      });
      return result;
    }
  }

  function getDiffSignature(diff) {
    return JSON.stringify({
      failures: normalizeFailureCodes(diff?.failures || []).sort(),
      actions: [...(diff?.actions || [])].sort()
    });
  }

  function trackConvergence(diff, changed = false) {
    const failures = normalizeFailureCodes(diff?.failures || []);
    const signature = getDiffSignature(diff);
    const previousSignature = runtime.convergenceSignature;
    const previousCount = runtime.convergencePreviousFailureCount;
    let status = 'progress';

    if (diff?.ok) {
      runtime.convergenceStallCount = 0;
      runtime.convergencePassCount += 1;
      if (!changed) runtime.idempotentPassCount += 1;
      status = changed ? 'converged' : 'idempotent';
    } else if (previousSignature && signature === previousSignature) {
      runtime.convergenceStallCount += 1;
      status = 'stalled';
    } else if (previousCount > 0 && failures.length < previousCount) {
      runtime.convergenceStallCount = 0;
      status = 'progress';
    } else {
      runtime.convergenceStallCount = 0;
      status = 'changed';
    }

    if (runtime.convergenceStallCount >= CONFIG.convergenceHardLimit) {
      runtime.convergenceFailureCount += 1;
      status = 'failed';
    }

    runtime.convergenceSignature = signature;
    runtime.convergencePreviousFailureCount = failures.length;
    runtime.lastConvergence = {
      at: Date.now(),
      status,
      stalledPasses: runtime.convergenceStallCount,
      failures,
      signature
    };

    return runtime.lastConvergence;
  }

  function applyReconciliation(diff, reason = 'reconcile') {
    if (!diff || diff.ok) {
      trackConvergence(diff || { ok: true, failures: [], actions: [] }, false);
      return false;
    }

    const plan = buildRepairPlan(diff, reason);
    return executeRepairPlan(plan).changed;
  }

  function performReconciliation(reason = 'reconcile') {
    const desired = deriveDesiredState();
    const initialActual = inspectActualState();
    const initialDiff =
      compareDesiredState(
        desired,
        initialActual
      );

    if (initialDiff.ok) {
      runtime.reconcilePendingVerification = false;
      runtime.reconcilePendingSince = 0;

      const convergence =
        trackConvergence(
          initialDiff,
          false
        );

      return {
        ok: true,
        pending: false,
        desired,
        initialActual,
        actual: initialActual,
        initialDiff,
        diff: initialDiff,
        plan: null,
        execution: null,
        convergence,
        changed: false,
        idempotent: true
      };
    }

    const plan =
      buildRepairPlan(
        initialDiff,
        reason
      );

    const execution =
      executeRepairPlan(plan);

    if (!execution.ok) {
      return {
        ok: false,
        pending: false,
        desired,
        initialActual,
        actual: initialActual,
        initialDiff,
        diff: initialDiff,
        plan,
        execution,
        convergence:
          runtime.lastConvergence,
        changed:
          Boolean(execution.changed),
        idempotent: false
      };
    }

    if (execution.pending) {
      runtime.reconcilePendingVerification = true;
      runtime.reconcilePendingSince = Date.now();

      const convergence = {
        at: Date.now(),
        status: 'pending',
        stalledPasses:
          runtime.convergenceStallCount,
        failures:
          normalizeFailureCodes(
            initialDiff.failures
          ),
        signature:
          getDiffSignature(initialDiff)
      };

      runtime.lastConvergence =
        convergence;

      return {
        ok: false,
        pending: true,
        desired,
        initialActual,
        actual: initialActual,
        initialDiff,
        diff: initialDiff,
        plan,
        execution,
        convergence,
        changed:
          Boolean(execution.changed),
        idempotent: false
      };
    }

    runtime.reconcilePendingVerification = false;
    runtime.reconcilePendingSince = 0;

    const actual =
      inspectActualState();

    const diff =
      compareDesiredState(
        desired,
        actual
      );

    const convergence =
      trackConvergence(
        diff,
        execution.changed
      );

    return {
      ok: diff.ok,
      pending: false,
      desired,
      initialActual,
      actual,
      initialDiff,
      diff,
      plan,
      execution,
      convergence,
      changed:
        Boolean(execution.changed),
      idempotent:
        diff.ok &&
        !execution.changed
    };
  }

  function scheduleQueuedReconciliation() {
    if (
      !runtime.started ||
      runtime.queuedReconciliationFrame ||
      runtime.queuedReconciliationReasons.size === 0
    ) {
      return false;
    }

    const epoch =
      currentRuntimeEpoch();

    runtime.queuedReconciliationFrame =
      requestNextFrame(() => {
        runtime.queuedReconciliationFrame = 0;

        if (
          rejectStaleCallback(
            epoch,
            'queued-reconciliation'
          )
        ) {
          return;
        }

        const reasons = [
          ...runtime.queuedReconciliationReasons
        ];

        runtime.queuedReconciliationReasons.clear();
        runtime.queuedReconciliationRunCount += 1;

        reconcileDesiredState(
          `queued:${reasons.join(',')}`
        );
      });

    return true;
  }

  function reconcileDesiredState(reason = 'reconcile') {
    if (
      runtime.reconcileInProgress ||
      runtime.reconcilePendingVerification
    ) {
      runtime.reconcileLockContentionCount += 1;
      runtime.queuedReconciliationRequestCount += 1;
      runtime.queuedReconciliationReasons.add(
        String(reason || 'reconcile')
      );

      return {
        ok: false,
        pending: true,
        queued: true,
        changed: false,
        idempotent: false,
        reason:
          String(reason || 'reconcile'),
        diff: {
          ok: false,
          failures: [],
          actions: []
        },
        convergence:
          runtime.lastConvergence
      };
    }

    const startedAt = nowMs();
    runtime.reconcileInProgress = true;

    try {
      const result =
        performReconciliation(reason);

      return {
        ...result,
        queued: false
      };
    } finally {
      runtime.reconcileInProgress = false;

      recordPerformanceSample(
        'reconcile',
        Math.max(
          0,
          nowMs() - startedAt
        )
      );

      scheduleQueuedReconciliation();
    }
  }

  function executeRepairLevel(level, reason, failures = []) {
    const normalized = normalizeFailureCodes(failures);
    const diff = {
      ok: false,
      failures: normalized,
      actions: []
    };
    const plan = buildRepairPlan(diff, reason);
    plan.level = Math.max(1, Math.min(5, Number(level) || 1));
    if (plan.level >= 1) plan.actions = [...new Set([...plan.actions, 'root'])];
    if (plan.level >= 2) plan.actions = [...new Set([...plan.actions, 'styles'])];
    if (plan.level >= 3 && !plan.conservative) plan.actions = [...new Set([...plan.actions, 'full-scan'])];
    if (plan.level >= 4) plan.actions = [...new Set([...plan.actions, 'observers'])];
    return executeRepairPlan(plan).ok;
  }

  function getHealthBreakdown() {
    const verification =
      verifyRuntime();

    const width =
      runtime.lastWidthVerification ||
      verifyAppliedWidths();

    const compatibility =
      runtime.lastCompatibility ||
      evaluateCompatibility();

    const selectors =
      getSelectorHealthSummary();

    const performance =
      getPerformanceBudgetReport();

    const runtimeChecks = [
      verification.checks.started,
      verification.checks.rootObserver,
      verification.checks.bodyObserver,
      verification.checks.headObserver,
      verification.checks.enforcementTimer,
      verification.checks.schedulerState
    ];

    const runtimeScore = Math.round(
      100 *
      runtimeChecks.filter(Boolean).length /
      runtimeChecks.length
    );

    const styleChecks = [
      verification.checks.mainStyle,
      verification.checks.uiStyle,
      verification.checks.rootState,
      verification.checks.rootEnabledState
    ];

    const stylesScore = Math.round(
      100 *
      styleChecks.filter(Boolean).length /
      styleChecks.length
    );

    const domScore = Math.round(
      Math.max(
        0,
        Math.min(
          100,
          (
            Number(
              compatibility.score || 0
            ) +
            selectors.score
          ) / 2
        )
      )
    );

    const widthScore =
      width.ok
        ? 100
        : Math.max(
            0,
            Math.round(
              100 -
              Math.min(
                100,
                Number(
                  width.maxDeviationPx ||
                  width.deviationPx ||
                  50
                ) * 2
              )
            )
          );

    let reconciliationScore = 100;

    reconciliationScore -=
      Math.min(
        45,
        runtime.convergenceStallCount *
          12
      );

    if (runtime.safeFallbackActive) {
      reconciliationScore -= 25;
    }

    if (
      runtime.strategySelection?.lowConfidence
    ) {
      reconciliationScore -= 15;
    }

    if (runtime.reconcileInProgress) {
      reconciliationScore -= 3;
    }

    reconciliationScore =
      Math.max(
        0,
        reconciliationScore
      );

    const performanceScore =
      performance.score;

    const breakdown = {
      runtime: runtimeScore,
      styles: stylesScore,
      dom: domScore,
      width: widthScore,
      reconciliation:
        reconciliationScore,
      performance:
        performanceScore
    };

    const score = Math.round(
      runtimeScore * 0.20 +
      stylesScore * 0.15 +
      domScore * 0.20 +
      widthScore * 0.20 +
      reconciliationScore * 0.15 +
      performanceScore * 0.10
    );

    return {
      score:
        Math.max(
          0,
          Math.min(100, score)
        ),
      status:
        score >= 90
          ? 'healthy'
          : score >= 70
            ? 'degraded'
            : 'unhealthy',
      breakdown,
      selectors,
      performance
    };
  }

  function calculateHealthScore() {
    const result =
      getHealthBreakdown();

    runtime.healthScore =
      result.score;
    runtime.healthStatus =
      result.status;
    runtime.healthBreakdown =
      result.breakdown;

    return result;
  }

  function inspectLifecycleState(expectedRunning) {
    const root = getRoot();
    const styleCount = document.querySelectorAll(`#${ID.style}`).length;
    const uiStyleCount = document.querySelectorAll(`#${ID.uiStyle}`).length;
    const rootAttributesPresent = [
      ATTR.version,
      ATTR.cap,
      ATTR.enabled,
      ATTR.wide,
      ATTR.left,
      ATTR.canvas
    ].some((attribute) => root?.hasAttribute(attribute));

    const checks = expectedRunning
      ? {
          started: runtime.started,
          singleMainStyle: !settings.enabled || styleCount === 1,
          singleUiStyle: uiStyleCount === 1,
          observers: Boolean(
            runtime.rootObserver && runtime.bodyObserver && runtime.headObserver
          ),
          repairTimer: Boolean(runtime.repairTimer),
          routeTimer: Boolean(runtime.routeTimer),
          enforcementTimer: Boolean(runtime.enforcementTimer)
        }
      : {
          stopped: !runtime.started,
          noMainStyle: styleCount === 0,
          noUiStyle: uiStyleCount === 0,
          noObservers: !runtime.rootObserver && !runtime.bodyObserver && !runtime.headObserver && !runtime.paneResizeObserver,
          noTimers: !runtime.repairTimer && !runtime.routeTimer && !runtime.enforcementTimer && !runtime.scanTimer && !runtime.routeDelayTimer,
          rootClean: !rootAttributesPresent,
          markersClean: !MANAGED_MARKERS.some(hasConnectedMarker)
        };

    return {
      ok: Object.values(checks).every(Boolean),
      checks
    };
  }

  function lifecycleTick() {
    return new Promise((resolve) => window.setTimeout(resolve, 0));
  }

  async function lifecycleTortureSelfTest(options = {}) {
    if (runtime.lifecycleTestRunning) {
      return {
        ok: false,
        running: true,
        error: 'Lifecycle torture self-test already running'
      };
    }

    runtime.lifecycleTestRunning = true;
    runtime.lifecycleTestCount += 1;
    const startedAt = nowMs();
    const originalStarted = runtime.started;
    const originalRepairHistory = [...runtime.repairHistory];
    const originalRepairPlan = runtime.lastRepairPlan;
    const originalRepairPlanResult = runtime.lastRepairPlanResult;
    const originalRepairPlanCounter = runtime.repairPlanCounter;
    const originalConvergence = {
      signature: runtime.convergenceSignature,
      previousFailureCount: runtime.convergencePreviousFailureCount,
      stallCount: runtime.convergenceStallCount,
      failureCount: runtime.convergenceFailureCount,
      passCount: runtime.convergencePassCount,
      idempotentPassCount: runtime.idempotentPassCount,
      last: runtime.lastConvergence
    };
    const cycles = Math.max(
      1,
      Math.min(5, Number(options.cycles || CONFIG.lifecycleTortureCycles) || CONFIG.lifecycleTortureCycles)
    );
    const results = [];

    try {
      for (let cycle = 1; cycle <= cycles; cycle += 1) {
        if (runtime.started) stop();
        await lifecycleTick();
        const stopped = inspectLifecycleState(false);

        start();
        await lifecycleTick();
        const running = inspectLifecycleState(true);

        results.push({
          cycle,
          stopped,
          running,
          ok: stopped.ok && running.ok
        });
      }

      if (!originalStarted && runtime.started) {
        stop();
        await lifecycleTick();
      }

      const result = {
        ok: results.every((item) => item.ok),
        cycles,
        durationMs: Math.max(0, nowMs() - startedAt),
        results,
        restoredStartedState: runtime.started === originalStarted
      };
      result.ok = result.ok && result.restoredStartedState;
      runtime.lastLifecycleTest = result;
      return result;
    } catch (error) {
      runtime.lastError = String(error?.message || error);
      const result = {
        ok: false,
        cycles,
        durationMs: Math.max(0, nowMs() - startedAt),
        results,
        error: runtime.lastError
      };
      runtime.lastLifecycleTest = result;
      return result;
    } finally {
      if (originalStarted && !runtime.started) {
        start();
      } else if (!originalStarted && runtime.started) {
        stop();
      }

      runtime.repairHistory = originalRepairHistory;
      runtime.lastRepairPlan = originalRepairPlan;
      runtime.lastRepairPlanResult = originalRepairPlanResult;
      runtime.repairPlanCounter = originalRepairPlanCounter;
      runtime.convergenceSignature = originalConvergence.signature;
      runtime.convergencePreviousFailureCount = originalConvergence.previousFailureCount;
      runtime.convergenceStallCount = originalConvergence.stallCount;
      runtime.convergenceFailureCount = originalConvergence.failureCount;
      runtime.convergencePassCount = originalConvergence.passCount;
      runtime.idempotentPassCount = originalConvergence.idempotentPassCount;
      runtime.lastConvergence = originalConvergence.last;
      runtime.lifecycleTestRunning = false;
    }
  }

  function selfTest() {
    const startedAt = nowMs();
    const fingerprint =
      updateDomFingerprint(
        'self-test'
      );
    const desired =
      deriveDesiredState();
    const actual =
      inspectActualState();
    const diff =
      compareDesiredState(
        desired,
        actual
      );
    const invariants =
      evaluateLayoutInvariants();
    const verification =
      verifyRuntime();
    const width =
      verifyAppliedWidths();
    const health =
      calculateHealthScore();
    const strategy =
      runtime.strategySelection ||
      selectDomStrategy(
        runtime.lastCapabilities ||
        detectDomCapabilities()
      );

    const durationMs =
      Math.max(
        0,
        nowMs() - startedAt
      );

    recordPerformanceSample(
      'selfTest',
      durationMs
    );

    return {
      ok:
        verification.ok &&
        invariants.ok &&
        width.ok &&
        diff.ok &&
        !strategy.lowConfidence,
      durationMs,
      version: VERSION,
      health,
      strategy,
      fingerprint,
      desired,
      actual,
      diff,
      repairPlan:
        diff.ok
          ? null
          : buildRepairPlan(
              diff,
              'self-test-preview',
              false
            ),
      convergence:
        runtime.lastConvergence,
      mutationAttribution:
        runtime.lastMutationAttribution,
      selectorHealth:
        getSelectorHealthSummary(),
      repairEffectiveness:
        getRepairEffectivenessMetrics(),
      performanceBudget:
        getPerformanceBudgetReport(),
      runtimeEpoch:
        runtime.epoch,
      staleCallbacksBlocked:
        runtime.staleCallbackCount,
      lifecycleTortureAvailable: true,
      regressionTestAvailable: true,
      invariants,
      verification,
      width
    };
  }

  function regressionTest() {
    const startedAt = nowMs();
    const results = [];

    const test = (name, run) => {
      try {
        const detail = run();

        const ok =
          detail === true ||
          Boolean(
            detail &&
            detail.ok !== false
          );

        results.push({
          name,
          ok,
          detail:
            detail === true
              ? null
              : detail
        });
      } catch (error) {
        results.push({
          name,
          ok: false,
          error:
            String(
              error?.message ||
              error
            )
        });
      }
    };

    test(
      'settings-normalization',
      () => {
        const normalized =
          normalizeSettings({
            gutterMin: -100,
            gutterMax: 9999,
            autoMinWidth: 1
          });

        return {
          ok:
            normalized.gutterMin ===
              LIMITS.gutterMin[0] &&
            normalized.gutterMax ===
              LIMITS.gutterMax[1] &&
            normalized.autoMinWidth ===
              LIMITS.autoMinWidth[0]
        };
      }
    );

    test(
      'failure-code-normalization',
      () => ({
        ok:
          normalizeFailureCode(
            'main-style-missing'
          ) ===
          FAILURE_CODE.MAIN_STYLE_MISSING
      })
    );

    test(
      'strategy-scoring',
      () => {
        const strategy =
          STRATEGY_REGISTRY.find(
            (item) =>
              item.id ===
              'virtualized-thread'
          );

        const score =
          strategy.score({
            transcriptRoot: true,
            virtualizedTurns: true,
            conversationTarget: true,
            threadBottomContainer: true,
            promptTextarea: true
          });

        return {
          ok: score === 100,
          score
        };
      }
    );

    test(
      'repair-level-selection',
      () => ({
        ok:
          getRepairLevelForFailures([
            FAILURE_CODE.MAIN_STYLE_MISSING
          ]) === 2 &&
          getRepairLevelForFailures([
            FAILURE_CODE.OBSERVER_INTEGRITY
          ]) === 4
      })
    );

    test(
      'selector-registry-contract',
      () => ({
        ok:
          SELECTOR_HEALTH_TARGETS.length >= 8 &&
          SELECTOR_HEALTH_TARGETS.every(
            (item) =>
              item.id &&
              item.selector &&
              item.group
          )
      })
    );

    test(
      'performance-budget-contract',
      () => ({
        ok:
          Object.keys(
            PERFORMANCE_BUDGET
          ).sort().join('|') ===
          [
            'fullScan',
            'reconcile',
            'selfTest',
            'watchdog'
          ].sort().join('|')
      })
    );

    test(
      'epoch-contract',
      () => ({
        ok:
          Number.isInteger(
            runtime.epoch
          ) &&
          runtime.epoch >= 0 &&
          (
            !runtime.started ||
            isCurrentRuntimeEpoch(
              runtime.epoch
            )
          )
      })
    );

    test(
      'reconciliation-lock-contract',
      () => ({
        ok:
          runtime.queuedReconciliationReasons
            instanceof Set &&
          typeof runtime.reconcileInProgress ===
            'boolean'
      })
    );

    test(
      'health-breakdown-contract',
      () => {
        const health =
          getHealthBreakdown();

        return {
          ok:
            health.score >= 0 &&
            health.score <= 100 &&
            [
              'runtime',
              'styles',
              'dom',
              'width',
              'reconciliation',
              'performance'
            ].every(
              (key) =>
                Number.isFinite(
                  health.breakdown[key]
                )
            ),
          score: health.score
        };
      }
    );

    test(
      'canonical-product-name',
      () => ({
        ok:
          PRODUCT_NAME ===
          'UltraWide ChatGPT'
      })
    );

    test(
      'pending-reconciliation-contract',
      () => ({
        ok:
          typeof runtime.reconcilePendingVerification ===
            'boolean' &&
          Number.isFinite(
            runtime.reconcilePendingSince
          )
      })
    );

    test(
      'repair-metrics-contract',
      () => {
        const metrics =
          getRepairEffectivenessMetrics();

        return {
          ok:
            Number.isFinite(
              metrics.successRate
            ) &&
            Number.isFinite(
              metrics.averageDurationMs
            )
        };
      }
    );

    const durationMs =
      Math.max(
        0,
        nowMs() - startedAt
      );

    return {
      ok:
        results.every(
          (item) => item.ok
        ),
      version: VERSION,
      durationMs,
      passed:
        results.filter(
          (item) => item.ok
        ).length,
      failed:
        results.filter(
          (item) => !item.ok
        ).length,
      results
    };
  }

  function evaluateLayoutInvariants() {
    const root = getRoot();
    const pane = resolveActivePane();
    const failures = [];

    if (!runtime.started) {
      failures.push(FAILURE_CODE.RUNTIME_NOT_STARTED);
    }

    if (settings.enabled) {
      const mainStyle =
        document.getElementById(ID.style);

      if (!mainStyle) {
        failures.push(FAILURE_CODE.MAIN_STYLE_MISSING);
      } else if (
        mainStyle.textContent !== getMainCss()
      ) {
        failures.push(FAILURE_CODE.MAIN_STYLE_INTEGRITY);
      }

      if (root?.getAttribute(ATTR.enabled) !== '1') {
        failures.push(FAILURE_CODE.ROOT_ENABLED_STATE);
      }

      if (!rootStateMatches()) {
        failures.push(FAILURE_CODE.ROOT_STATE_INTEGRITY);
      }
    }

    if (hasDisconnectedMarkers()) {
      failures.push(FAILURE_CODE.DISCONNECTED_MARKERS);
    }

    if (
      runtime.lastTurnCount > 0 &&
      !hasConnectedMarker(ATTR.turn)
    ) {
      failures.push(FAILURE_CODE.TURN_MARKERS_MISSING);
    }

    if (
      settings.enabled &&
      settings.widenComposer &&
      document.querySelector(SELECTOR.composerInput) &&
      !hasConnectedMarker(ATTR.composer)
    ) {
      failures.push(FAILURE_CODE.COMPOSER_MARKER_MISSING);
    }

    if (
      settings.enabled &&
      isWideActive() &&
      !runtime.safeFallbackActive &&
      pane &&
      isVisibleElement(pane)
    ) {
      const paneRect = getVisibleRect(pane);
      const maxAllowedWidth =
        Math.max(0, Number(paneRect?.width || 0)) + 4;

      const representatives = [
        runtime.marked.get(ATTR.turn),
        runtime.marked.get(ATTR.composer)
      ];

      for (const elements of representatives) {
        const element = Array.from(elements || [])
          .find(isVisibleElement);

        if (!element || maxAllowedWidth <= 4) {
          continue;
        }

        const rect = getVisibleRect(element);

        if (
          rect &&
          rect.width > maxAllowedWidth
        ) {
          failures.push(FAILURE_CODE.WIDTH_EXCEEDS_PANE);
          break;
        }
      }

      const expectedContentWidth =
        getExpectedContentWidthPx(
          paneRect?.width || 0
        );

      let widthAnchor = null;

      try {
        widthAnchor =
          Array.from(
            document.querySelectorAll(
              [
                '[data-thread-user-message-navigation-content]',
                '[data-thread-find-target="conversation"]'
              ].join(',')
            )
          ).find(isVisibleElement) || null;
      } catch (_) {}

      const anchorRect =
        getVisibleRect(widthAnchor);

      if (
        expectedContentWidth >= 640 &&
        anchorRect &&
        anchorRect.width <
          expectedContentWidth * 0.72
      ) {
        failures.push(
          FAILURE_CODE.WIDTH_UNDER_APPLIED
        );
      }
    }

    const result = {
      ok: failures.length === 0,
      failures,
      checkedAt: Date.now()
    };

    runtime.lastInvariants = result;
    return result;
  }

  function activateSafeFallback(reason) {
    if (runtime.safeFallbackActive) {
      return false;
    }

    runtime.safeFallbackActive = true;
    runtime.safeFallbackReason = String(
      reason || 'layout-invariant-failure'
    );

    setRootState();
    pushDebugEvent('safe-fallback', {
      reason: runtime.safeFallbackReason
    });

    console.warn(
      '[UltraWide] Safe fallback activated:',
      runtime.safeFallbackReason
    );

    return true;
  }

  function clearSafeFallback(reason = 'manual-reset') {
    const wasActive = runtime.safeFallbackActive;

    runtime.safeFallbackActive = false;
    runtime.safeFallbackReason = '';
    runtime.invariantFailureStreak = 0;
    setRootState();

    if (wasActive) {
      pushDebugEvent('safe-fallback-cleared', {
        reason
      });
    }

    return wasActive;
  }

  function processInvariantResult(result) {
    if (result.ok) {
      runtime.invariantFailureStreak = 0;
      runtime.enforcementRetryCount = 0;
      runtime.enforcementLevel = 0;
      runtime.lastEnforcementFailures = [];
      return;
    }

    runtime.invariantFailureStreak += 1;
    runtime.lastEnforcementFailures = normalizeFailureCodes(result.failures);

    pushDebugEvent('invariant-failure', {
      streak: runtime.invariantFailureStreak,
      failures: result.failures
    });

    const canRetry =
      runtime.started &&
      settings.enabled &&
      !shouldPauseWork() &&
      runtime.enforcementRetryCount < CONFIG.enforcementRetryLimit;

    if (canRetry) {
      runtime.enforcementRetryCount += 1;
      runtime.enforcementRepairCount += 1;
      runtime.lastEnforcementRepairAt = Date.now();

      const baseLevel = getRepairLevelForFailures(result.failures);
      const level = Math.min(
        5,
        Math.max(baseLevel, runtime.enforcementRetryCount)
      );

      pushDebugEvent('invariant-auto-repair', {
        attempt: runtime.enforcementRetryCount,
        level,
        failures: result.failures
      });

      executeRepairLevel(
        level,
        'invariant-auto-repair',
        result.failures
      );
      return;
    }

    const geometryUnsafe = normalizeFailureCodes(result.failures).includes(FAILURE_CODE.WIDTH_EXCEEDS_PANE);

    if (
      geometryUnsafe &&
      runtime.invariantFailureStreak >= CONFIG.invariantFailureThreshold
    ) {
      activateSafeFallback(result.failures.join(','));
    }
  }

  function enforceRuntimeIntegrity(reason = 'watchdog') {
    if (!runtime.started || shouldPauseWork()) {
      return false;
    }

    runtime.enforcementCheckCount += 1;
    runtime.lastEnforcementAt = Date.now();

    attachObservers();
    attachPaneResizeObserver();
    detectCanvas();
    updateDomFingerprint(reason);

    if (!settings.enabled) {
      let repaired = false;
      if (document.getElementById(ID.style)) {
        repaired = removeMainStyle() || repaired;
      }
      if (MANAGED_MARKERS.some(hasConnectedMarker)) {
        clearManagedMarkers();
        repaired = true;
      }
      repaired = clearRootState() || repaired;
      runtime.invariantFailureStreak = 0;
      runtime.enforcementRetryCount = 0;
      runtime.enforcementLevel = 0;
      runtime.lastEnforcementFailures = [];
      trackConvergence({ ok: true, failures: [], actions: [] }, repaired);
      calculateHealthScore();
      return repaired;
    }

    const reconciliation = reconcileDesiredState(reason);

    if (!reconciliation.diff.ok) {
      runtime.enforcementRepairCount += reconciliation.changed ? 1 : 0;
      if (reconciliation.changed) {
        runtime.lastEnforcementRepairAt = Date.now();
      }
      runtime.lastEnforcementFailures = normalizeFailureCodes(
        reconciliation.diff.failures
      );
      calculateHealthScore();
      return Boolean(reconciliation.changed);
    }

    const invariants = evaluateLayoutInvariants();

    if (
      !invariants.ok &&
      runtime.enforcementRetryCount >= CONFIG.enforcementRetryLimit &&
      Date.now() - runtime.lastEnforcementRepairAt >= CONFIG.enforcementRetryCooldownMs
    ) {
      runtime.enforcementRetryCount = 0;
    }

    if (!invariants.ok) {
      processInvariantResult(invariants);
      calculateHealthScore();
      return true;
    }

    if (
      runtime.safeFallbackActive &&
      Date.now() - runtime.lastEnforcementRepairAt >= CONFIG.enforcementRetryCooldownMs
    ) {
      clearSafeFallback('automatic-recovery-attempt');
      runtime.enforcementRetryCount = 0;
      const recoveryDiff = {
        ok: false,
        failures: [FAILURE_CODE.WIDTH_VERIFICATION_FAILED],
        actions: ['root', 'full-scan']
      };
      const recoveryPlan = buildRepairPlan(
        recoveryDiff,
        'safe-fallback-recovery'
      );
      executeRepairPlan(recoveryPlan);
      runtime.enforcementRepairCount += 1;
      runtime.lastEnforcementRepairAt = Date.now();
      calculateHealthScore();
      return true;
    }

    runtime.enforcementRetryCount = 0;
    runtime.enforcementLevel = 0;
    runtime.lastEnforcementFailures = [];
    calculateHealthScore();
    return false;
  }

  function performScan(
    dirtyRegions = ALL_DIRTY_REGIONS,
    reasons = ['scan']
  ) {
    if (shouldPauseWork()) {
      runtime.deferredScan = true;
      return;
    }

    if (!settings.enabled) {
      clearManagedMarkers();
      clearRootState();
      removeMainStyle();
      runtime.deferredScan = false;
      return;
    }

    const dirty = new Set(
      dirtyRegions?.length
        ? dirtyRegions
        : ALL_DIRTY_REGIONS
    );

    const startedAt = nowMs();

    runtime.lastScanAt = Date.now();
    runtime.lastRepairAt = runtime.lastScanAt;
    runtime.lastRepairReasons = [...reasons];
    runtime.lastError = null;
    runtime.deferredScan = false;
    runtime.repairPassCount += 1;

    pushDebugEvent('repair-pass', {
      reasons: [...reasons],
      dirty: [...dirty]
    });

    try {
      const desired = createDesiredMarkers();
      seedDesiredMarkers(desired, dirty);

      if (dirty.has(DIRTY.split)) {
        detectCanvas();
      }

      if (dirty.has(DIRTY.conversation)) {
        markConversation(desired);
      }

      if (dirty.has(DIRTY.composer)) {
        markComposer(desired);
      }

      if (dirty.has(DIRTY.notice)) {
        markPlanNotice(desired);
      }

      applyMarkerDiff(desired);
      attachPaneResizeObserver();
      detectDomCapabilities();
      evaluateCompatibility(
        runtime.lastCapabilities
      );
      setRootState();
      updateDomFingerprint('scan');
      verifyAppliedWidths();
      runtime.scanCount += 1;

      const scanInvariants =
        evaluateLayoutInvariants();

      if (runtime.reconcilePendingVerification) {
        runtime.reconcilePendingVerification = false;
        runtime.reconcilePendingSince = 0;
        runtime.queuedReconciliationReasons.add(
          'post-scan-verification'
        );
        scheduleQueuedReconciliation();
      } else {
        processInvariantResult(
          scanInvariants
        );
      }

      syncDebugOverlay();
    } catch (error) {
      runtime.lastError = String(
        error?.message || error
      );

      pushDebugEvent('repair-error', {
        message: runtime.lastError
      });

      console.error(
        '[UltraWide] Layout scan failed:',
        error
      );
    } finally {
      const duration = Math.max(
        0,
        nowMs() - startedAt
      );

      recordPerformanceSample(
        'fullScan',
        duration
      );

      if (settings.performanceTelemetry) {
        runtime.lastScanDurationMs = duration;
        runtime.totalScanDurationMs += duration;
        runtime.maxScanDurationMs = Math.max(
          runtime.maxScanDurationMs,
          duration
        );
        runtime.measuredScanCount += 1;
      }
    }
  }

  function cancelScheduledScan() {
    if (runtime.scanTimer) {
      clearTimeout(runtime.scanTimer);
      runtime.scanTimer = 0;
    }

    if (
      runtime.idleCallback &&
      typeof cancelIdleCallback === 'function'
    ) {
      cancelIdleCallback(runtime.idleCallback);
      runtime.idleCallback = 0;
    }

    if (runtime.animationFrame) {
      cancelNextFrame(runtime.animationFrame);
      runtime.animationFrame = 0;
    }
  }

  function requestRepair(
    reason = 'repair',
    dirtyRegions = ALL_DIRTY_REGIONS,
    force = false
  ) {
    if (!runtime.started && !force) {
      return false;
    }

    const requestEpoch =
      currentRuntimeEpoch();

    runtime.repairRequestCount += 1;
    runtime.pendingRepairReasons.add(
      String(reason || 'repair')
    );

    for (const region of dirtyRegions || []) {
      if (ALL_DIRTY_REGIONS.includes(region)) {
        runtime.pendingDirtyRegions.add(region);
      }
    }

    if (runtime.pendingDirtyRegions.size === 0) {
      ALL_DIRTY_REGIONS.forEach((region) =>
        runtime.pendingDirtyRegions.add(region)
      );
    }

    if (shouldPauseWork()) {
      runtime.deferredScan = true;
      pushDebugEvent('repair-deferred', {
        reason
      });
      return false;
    }

    const alreadyScheduled = Boolean(
      runtime.scanTimer ||
      runtime.idleCallback ||
      runtime.animationFrame
    );

    if (alreadyScheduled && !force) {
      runtime.coalescedRepairCount += 1;
      return true;
    }

    if (force) {
      cancelScheduledScan();
    }

    const run = () => {
      runtime.scanTimer = 0;
      runtime.idleCallback = 0;
      runtime.animationFrame = 0;

      if (
        rejectStaleCallback(
          requestEpoch,
          'repair-scan'
        )
      ) {
        return;
      }

      const reasons = [
        ...runtime.pendingRepairReasons
      ];

      const dirty = [
        ...runtime.pendingDirtyRegions
      ];

      runtime.pendingRepairReasons.clear();
      runtime.pendingDirtyRegions.clear();

      if (runtime.started || force) {
        performScan(dirty, reasons);
      }
    };

    if (force) {
      runtime.animationFrame =
        requestNextFrame(run);
      return true;
    }

    runtime.scanTimer = window.setTimeout(() => {
      runtime.scanTimer = 0;

      if (
        typeof requestIdleCallback === 'function'
      ) {
        runtime.idleCallback =
          requestIdleCallback(run, {
            timeout: CONFIG.idleTimeoutMs
          });
      } else {
        run();
      }
    }, settings.scanDebounceMs);

    return true;
  }

  function scheduleScan(force = false) {
    return requestRepair(
      force ? 'forced-scan' : 'scan',
      ALL_DIRTY_REGIONS,
      force
    );
  }

  function applyStyles() {
    ensureStyle(
      ID.uiStyle,
      getUiCss()
    );

    if (!settings.enabled) {
      removeMainStyle();
      clearRootState();
      clearManagedMarkers();
      removeById(ID.debugOverlay);
      return;
    }

    ensureStyle(
      ID.style,
      getMainCss()
    );

    attachPaneResizeObserver();
    setRootState();
    syncDebugOverlay();
    requestRepair(
      'apply-styles',
      ALL_DIRTY_REGIONS,
      true
    );
  }

  function showToast(message) {
    if (!settings.toast) {
      return;
    }

    ensureStyle(
      ID.uiStyle,
      getUiCss()
    );

    const parent =
      getBody() ||
      getRoot();

    if (!parent) {
      return;
    }

    let toast =
      document.getElementById(
        ID.toast
      );

    if (!toast) {
      toast =
        document.createElement('div');

      toast.id = ID.toast;

      toast.setAttribute(
        'role',
        'status'
      );

      toast.setAttribute(
        'aria-live',
        'polite'
      );

      parent.appendChild(toast);
    }

    toast.textContent =
      String(
        message ||
        'UltraWide updated'
      );

    if (runtime.toastTimer) {
      clearTimeout(
        runtime.toastTimer
      );
    }

    runtime.toastTimer =
      window.setTimeout(() => {
        runtime.toastTimer = 0;
      removeById(ID.toast);
    }, settings.toastMs);
  }

  function syncDebugOverlay() {
    if (!settings.debugOverlay || !runtime.started) {
      removeById(ID.debugOverlay);
      return;
    }

    ensureStyle(
      ID.uiStyle,
      getUiCss()
    );

    const parent =
      getBody() ||
      getRoot();

    if (!parent) {
      return;
    }

    let overlay =
      document.getElementById(
        ID.debugOverlay
      );

    if (!overlay) {
      overlay =
        document.createElement('div');

      overlay.id = ID.debugOverlay;

      overlay.setAttribute(
        'aria-hidden',
        'true'
      );

      parent.appendChild(overlay);
    }

    const compatibility =
      runtime.lastCompatibility ||
      evaluateCompatibility();

    const rows = [
      `<strong>UltraWide ${VERSION}</strong>`,
      `wide=${isWideActive() ? 'active' : 'inactive'} cap=${settings.cap}`,
      `pane=${getAdaptiveWidth()}x${runtime.effectivePaneHeight || 0}`,
      `turns=${runtime.lastTurnCount}/${runtime.lastRawTurnCount}`,
      `composer=${hasConnectedMarker(ATTR.composer) ? 'yes' : 'no'} split=${runtime.canvasDetected ? 'yes' : 'no'}`,
      `compat=${compatibility.status} strategy=${compatibility.strategy}`,
      `safe=${runtime.safeFallbackActive ? runtime.safeFallbackReason || 'active' : 'off'}`
    ];

    overlay.innerHTML =
      rows.join('<br>');
  }

  function downloadTextFile(filename, content, mimeType = 'text/plain') {
    try {
      const blob =
        new Blob(
          [String(content || '')],
          { type: `${mimeType};charset=utf-8` }
        );

      const url =
        URL.createObjectURL(blob);

      const anchor =
        document.createElement('a');

      anchor.href = url;
      anchor.download = filename;
      anchor.style.display = 'none';

      (getBody() || getRoot())?.appendChild(anchor);
      anchor.click();
      anchor.remove();

      window.setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 0);

      return true;
    } catch (error) {
      runtime.lastError = String(
        error?.message || error
      );
      return false;
    }
  }

  function getStatusText() {
    return [
      `UltraWide ${
        settings.enabled
          ? 'on'
          : 'off'
      }`,
      `wide ${
        isWideActive()
          ? 'active'
          : 'inactive'
      }`,
      `turns ${
        runtime.lastTurnCount
      }`,
      `split ${
        runtime.canvasDetected
          ? 'yes'
          : 'no'
      }`,
      `pane ${
        getAdaptiveWidth()
      }px`,
      `compat ${
        (
          runtime.lastCompatibility ||
          evaluateCompatibility()
        ).status
      }`,
      `cap ${settings.cap}`
    ].join(' | ');
  }

  function getAdaptiveWatchdogInterval() {
    if (shouldPauseWork()) {
      return CONFIG.enforcementStableIntervalMs;
    }

    const now = Date.now();
    const recentActivity = Math.max(
      runtime.lastMutationAt || 0,
      runtime.lastRouteChangeAt || 0,
      runtime.lastPaneResizeAt || 0,
      runtime.lastEnforcementRepairAt || 0
    );

    if (
      runtime.invariantFailureStreak > 0 ||
      runtime.enforcementRetryCount > 0 ||
      runtime.safeFallbackActive
    ) {
      return CONFIG.enforcementUnstableIntervalMs;
    }

    if (now - recentActivity < 5000) {
      return CONFIG.enforcementActiveIntervalMs;
    }

    if (runtime.stableWatchdogPasses >= 8) {
      return CONFIG.enforcementStableIntervalMs;
    }

    return CONFIG.enforcementNormalIntervalMs;
  }

  function scheduleEnforcementWatchdog(delay = null) {
    if (runtime.enforcementTimer) {
      clearTimeout(runtime.enforcementTimer);
      runtime.enforcementTimer = 0;
    }

    if (!runtime.started) {
      return;
    }

    const interval = Number.isFinite(delay)
      ? delay
      : getAdaptiveWatchdogInterval();

    const epoch =
      currentRuntimeEpoch();

    runtime.watchdogIntervalMs = interval;
    runtime.enforcementTimer = window.setTimeout(() => {
      runtime.enforcementTimer = 0;

      if (
        rejectStaleCallback(
          epoch,
          'enforcement-watchdog'
        )
      ) {
        return;
      }

      const startedAt = nowMs();

      try {
        const repaired =
          enforceRuntimeIntegrity(
            'watchdog'
          );

        runtime.stableWatchdogPasses =
          repaired
            ? 0
            : runtime.stableWatchdogPasses + 1;
      } catch (error) {
        runtime.stableWatchdogPasses = 0;
        runtime.lastError =
          String(
            error?.message ||
            error
          );
        pushDebugEvent(
          'integrity-watchdog-error',
          {
            message:
              runtime.lastError
          }
        );
        console.error(
          '[UltraWide] Integrity watchdog failed:',
          error
        );
      } finally {
        recordPerformanceSample(
          'watchdog',
          Math.max(
            0,
            nowMs() - startedAt
          )
        );

        if (
          isCurrentRuntimeEpoch(
            epoch
          )
        ) {
          scheduleEnforcementWatchdog();
        }
      }
    }, Math.max(250, interval));
  }

  function restartTimers() {
    if (!runtime.started) {
      return;
    }

    if (runtime.repairTimer) {
      clearInterval(
        runtime.repairTimer
      );
    }

    if (runtime.routeTimer) {
      clearInterval(
        runtime.routeTimer
      );
    }

    if (runtime.enforcementTimer) {
      clearTimeout(
        runtime.enforcementTimer
      );
    }

    const epoch =
      currentRuntimeEpoch();

    runtime.repairTimer =
      window.setInterval(() => {
        if (
          rejectStaleCallback(
            epoch,
            'repair-interval'
          )
        ) {
          return;
        }

        if (shouldPauseWork()) {
          return;
        }

        try {
          repair();
        } catch (error) {
          runtime.lastError =
            String(
              error?.message ||
              error
            );

          console.error(
            '[UltraWide] Repair failed:',
            error
          );
        }
      }, settings.repairIntervalMs);

    runtime.routeTimer =
      window.setInterval(() => {
        if (
          rejectStaleCallback(
            epoch,
            'route-interval'
          )
        ) {
          return;
        }

        if (!shouldPauseWork()) {
          checkRoute();
        }
      }, settings.routePollMs);

    scheduleEnforcementWatchdog(CONFIG.enforcementActiveIntervalMs);
  }

  function commit(
    message,
    restartRuntimeTimers = false
  ) {
    const saved = saveSettings();
    invalidateCssCache();
    applyStyles();
    syncSettingsModal();

    if (restartRuntimeTimers) {
      restartTimers();
    }

    if (runtime.started) {
      refreshMenus();
    }

    showToast(
      saved
        ? (message || getStatusText())
        : 'UltraWide updated, but settings could not be saved'
    );
  }

  function setOptions(patch) {
    if (
      !patch ||
      typeof patch !== 'object' ||
      Array.isArray(patch)
    ) {
      return false;
    }

    if (
      Object.prototype
        .hasOwnProperty.call(
          patch,
          'cap'
        ) &&
      !CAPS.includes(
        String(patch.cap)
      )
    ) {
      throw new Error(
        `Invalid cap: ${String(patch.cap)}`
      );
    }

    const previousRepair =
      settings.repairIntervalMs;

    const previousRoute =
      settings.routePollMs;

    Object.assign(
      settings,
      normalizeSettings({
        ...settings,
        ...patch
      })
    );

    const timersChanged =
      previousRepair !==
        settings.repairIntervalMs ||
      previousRoute !==
        settings.routePollMs;

    commit(
      getStatusText(),
      timersChanged
    );

    return true;
  }

  function resetSettings() {
    Object.assign(
      settings,
      DEFAULTS
    );

    commit(
      'UltraWide settings reset',
      true
    );
  }

  function cycleCap() {
    const index =
      CAPS.indexOf(settings.cap);

    settings.cap =
      CAPS[
        (index + 1) % CAPS.length
      ] || 'none';

    commit(
      `UltraWide cap: ${settings.cap}`
    );
  }

  function checkRoute() {
    if (
      runtime.href ===
      location.href
    ) {
      return false;
    }

    runtime.href =
      location.href;
    runtime.lastRouteChangeAt = Date.now();
    clearSafeFallback('route-change');
    pushDebugEvent('route-change', {
      href: runtime.href
    });

    requestRepair(
      'route-change',
      ALL_DIRTY_REGIONS,
      true
    );
    return true;
  }

  function scheduleRouteCheck() {
    if (runtime.routeDelayTimer) {
      clearTimeout(
        runtime.routeDelayTimer
      );
    }

    const epoch =
      currentRuntimeEpoch();

    runtime.routeDelayTimer =
      window.setTimeout(() => {
        runtime.routeDelayTimer = 0;

        if (
          rejectStaleCallback(
            epoch,
            'route-check'
          )
        ) {
          return;
        }

        checkRoute();
      }, CONFIG.routeDelayMs);
  }

  function wrapHistoryMethod(original) {
    return function wrappedHistoryMethod(
      ...args
    ) {
      const result =
        original.apply(
          this,
          args
        );

      scheduleRouteCheck();
      return result;
    };
  }

  function installHistoryHooks() {
    try {
      runtime.originalPushState ||=
        history.pushState;

      runtime.originalReplaceState ||=
        history.replaceState;

      if (
        history.pushState ===
        runtime.originalPushState
      ) {
        runtime.wrappedPushState =
          wrapHistoryMethod(
            runtime.originalPushState
          );

        history.pushState =
          runtime.wrappedPushState;
      }

      if (
        history.replaceState ===
        runtime.originalReplaceState
      ) {
        runtime.wrappedReplaceState =
          wrapHistoryMethod(
            runtime.originalReplaceState
          );

        history.replaceState =
          runtime.wrappedReplaceState;
      }
    } catch (_) {}
  }

  function restoreHistoryHooks() {
    try {
      if (
        runtime.originalPushState &&
        runtime.wrappedPushState &&
        history.pushState ===
          runtime.wrappedPushState
      ) {
        history.pushState =
          runtime.originalPushState;
      }

      if (
        runtime.originalReplaceState &&
        runtime.wrappedReplaceState &&
        history.replaceState ===
          runtime.wrappedReplaceState
      ) {
        history.replaceState =
          runtime.originalReplaceState;
      }
    } catch (_) {}

    runtime.wrappedPushState = null;
    runtime.wrappedReplaceState = null;
  }

  function nodeMayRequireScan(node) {
    if (!isElement(node)) {
      return false;
    }

    if (
      node.id === ID.style ||
      node.id === ID.uiStyle ||
      node.id === ID.modal ||
      node.id === ID.toast
    ) {
      return false;
    }

    try {
      if (node.matches(SCAN_TRIGGER_SELECTOR)) {
        return true;
      }

      return Boolean(
        node.querySelector(
          SCAN_TRIGGER_SELECTOR
        )
      );
    } catch (_) {
      return false;
    }
  }

  function isWithinManagedLayout(element) {
    if (!isElement(element)) {
      return false;
    }

    try {
      return Boolean(
        element.closest(
          MANAGED_LAYOUT_SELECTOR
        )
      );
    } catch (_) {
      return false;
    }
  }

  function mutationNeedsScan(records) {
    if (!records || records.length === 0) {
      return false;
    }

    const recordLimit = Math.min(
      records.length,
      CONFIG.maxMutationRecords
    );

    for (let recordIndex = 0; recordIndex < recordLimit; recordIndex += 1) {
      const record = records[recordIndex];

      if (
        record.type === 'attributes' &&
        (
          nodeMayRequireScan(record.target) ||
          isWithinManagedLayout(record.target)
        )
      ) {
        return true;
      }

      const added = record.addedNodes;
      const removed = record.removedNodes;
      const addedLimit = Math.min(
        added?.length || 0,
        CONFIG.maxMutationNodes
      );
      const removedLimit = Math.min(
        removed?.length || 0,
        CONFIG.maxMutationNodes
      );

      for (let index = 0; index < addedLimit; index += 1) {
        if (nodeMayRequireScan(added[index])) {
          return true;
        }
      }

      for (let index = 0; index < removedLimit; index += 1) {
        if (nodeMayRequireScan(removed[index])) {
          return true;
        }
      }

      if (
        (added?.length || 0) > CONFIG.maxMutationNodes ||
        (removed?.length || 0) > CONFIG.maxMutationNodes
      ) {
        return true;
      }
    }

    return records.length > CONFIG.maxMutationRecords;
  }

  function classifyMutationDirtyRegions(records) {
    const dirty = new Set();

    if (!records || records.length === 0) {
      return dirty;
    }

    const inspectNode = (node) => {
      if (!isElement(node)) {
        return;
      }

      try {
        if (
          node.matches(SELECTOR.preferredTurns) ||
          node.matches(SELECTOR.fallbackMessages) ||
          node.querySelector(SELECTOR.preferredTurns) ||
          node.querySelector(SELECTOR.fallbackMessages)
        ) {
          dirty.add(DIRTY.conversation);
        }

        if (
          node.matches(SELECTOR.composerInput) ||
          node.matches(SELECTOR.composerShell) ||
          node.querySelector(SELECTOR.composerInput) ||
          node.querySelector(SELECTOR.composerShell)
        ) {
          dirty.add(DIRTY.composer);
        }

        if (
          node.matches(SELECTOR.splitViewIndicators) ||
          node.querySelector(SELECTOR.splitViewIndicators)
        ) {
          dirty.add(DIRTY.split);
        }

        if (
          node.matches(SELECTOR.structuralRoots) ||
          node.querySelector(SELECTOR.structuralRoots)
        ) {
          dirty.add(DIRTY.root);
          dirty.add(DIRTY.conversation);
          dirty.add(DIRTY.composer);
        }
      } catch (_) {}
    };

    const limit = Math.min(
      records.length,
      CONFIG.maxMutationRecords
    );

    for (let index = 0; index < limit; index += 1) {
      const record = records[index];
      inspectNode(record.target);

      if (
        record.type === 'childList' &&
        isElement(record.target)
      ) {
        try {
          if (record.target.closest(SELECTOR.main)) {
            dirty.add(DIRTY.notice);
          }
        } catch (_) {}
      }

      const added = Array.from(record.addedNodes || [])
        .slice(0, CONFIG.maxMutationNodes);
      const removed = Array.from(record.removedNodes || [])
        .slice(0, CONFIG.maxMutationNodes);

      added.forEach(inspectNode);
      removed.forEach(inspectNode);

      if (
        (record.addedNodes?.length || 0) > CONFIG.maxMutationNodes ||
        (record.removedNodes?.length || 0) > CONFIG.maxMutationNodes
      ) {
        ALL_DIRTY_REGIONS.forEach((region) =>
          dirty.add(region)
        );
      }
    }

    if (
      records.length > CONFIG.maxMutationRecords
    ) {
      ALL_DIRTY_REGIONS.forEach((region) =>
        dirty.add(region)
      );
    }

    if (
      dirty.size === 0 &&
      mutationNeedsScan(records)
    ) {
      dirty.add(DIRTY.conversation);
      dirty.add(DIRTY.composer);
      dirty.add(DIRTY.notice);
    }

    return dirty;
  }

  function onBodyMutations(records) {
    runtime.mutationBatchCount += 1;
    runtime.lastMutationAt = Date.now();

    if (!settings.enabled) {
      return;
    }

    const attribution = attributeMutations(records || []);
    if (attribution.source === 'ultrawide') {
      pushDebugEvent('mutation-attributed', {
        source: attribution.source,
        internal: attribution.internal,
        external: attribution.external
      });
      return;
    }

    const relevantRecords = attribution.externalRecords.length > 0
      ? attribution.externalRecords
      : records;
    const dirty = classifyMutationDirtyRegions(relevantRecords);

    if (dirty.size > 0) {
      requestRepair(
        attribution.source === 'mixed' ? 'mutation-mixed' : 'mutation-external',
        [...dirty]
      );
    }
  }

  function onRootMutations(records = []) {
    const attribution = attributeMutations(records || []);
    if (attribution.source === 'ultrawide') {
      return;
    }

    if (!runtime.started) {
      return;
    }

    if (!settings.enabled) {
      removeMainStyle();
      clearManagedMarkers();
      clearRootState();
      return;
    }

    const currentRoot = getRoot();

    if (
      currentRoot !== runtime.observedRoot
    ) {
      attachObservers();
    }

    if (!rootStateMatches()) {
      setRootState();

      requestRepair(
        'root-state-repair',
        [DIRTY.root],
        true
      );
    }

    if (
      getHead() !== runtime.observedHead ||
      getBody() !== runtime.observedBody
    ) {
      attachObservers();

      requestRepair(
        'document-lifecycle-repair',
        ALL_DIRTY_REGIONS,
        true
      );
    }
  }

  function onHeadMutations(records = []) {
    const attribution = attributeMutations(records || []);
    if (attribution.source === 'ultrawide') {
      return;
    }

    if (
      getStyleText(ID.uiStyle) !== getUiCss()
    ) {
      ensureStyle(
        ID.uiStyle,
        getUiCss()
      );
    }

    if (
      settings.enabled &&
      getStyleText(ID.style) !== getMainCss()
    ) {
      ensureStyle(
        ID.style,
        getMainCss()
      );

      requestRepair(
        'head-style-repair',
        [DIRTY.root],
        true
      );
    }
  }

  function attachObservers() {
    const root = getRoot();
    const head = getHead();
    const body = getBody();

    if (
      root &&
      root !== runtime.observedRoot
    ) {
      runtime.rootObserver
        ?.disconnect();

      const rootEpoch =
        currentRuntimeEpoch();

      runtime.rootObserver =
        new MutationObserver(
          guardRuntimeEpoch(
            onRootMutations,
            'root-observer',
            rootEpoch
          )
        );

      runtime.rootObserver.observe(
        root,
        {
          childList: true,
          attributes: true,
          attributeFilter: [
            ATTR.version,
            ATTR.cap,
            ATTR.enabled,
            ATTR.wide,
            ATTR.left,
            ATTR.canvas
          ]
        }
      );

      runtime.observedRoot = root;
    }

    if (
      head &&
      head !== runtime.observedHead
    ) {
      runtime.headObserver
        ?.disconnect();

      const headEpoch =
        currentRuntimeEpoch();

      runtime.headObserver =
        new MutationObserver(
          guardRuntimeEpoch(
            onHeadMutations,
            'head-observer',
            headEpoch
          )
        );

      runtime.headObserver.observe(
        head,
        {
          childList: true,
          subtree: true,
          characterData: true,
          attributes: true,
          attributeFilter: ['data-version']
        }
      );

      runtime.observedHead = head;
    }

    if (
      body &&
      body !== runtime.observedBody
    ) {
      runtime.bodyObserver
        ?.disconnect();

      const bodyEpoch =
        currentRuntimeEpoch();

      runtime.bodyObserver =
        new MutationObserver(
          guardRuntimeEpoch(
            onBodyMutations,
            'body-observer',
            bodyEpoch
          )
        );

      runtime.bodyObserver.observe(
        body,
        {
          childList: true,
          subtree: true,
          attributes: true,
          attributeFilter:
            CONFIG.mutationAttributeFilter
        }
      );

      runtime.observedBody = body;
    }

    return Boolean(
      runtime.observedRoot &&
      runtime.observedHead &&
      runtime.observedBody
    );
  }

  function installObservers() {
    if (attachObservers()) {
      return;
    }

    const root = getRoot();

    if (!root) {
      return;
    }

    runtime.bootstrapObserver
      ?.disconnect();

    const bootstrapEpoch =
      currentRuntimeEpoch();

    runtime.bootstrapObserver =
      new MutationObserver(
        guardRuntimeEpoch(
          () => {
            if (!attachObservers()) {
              return;
            }

            runtime.bootstrapObserver
              ?.disconnect();

            runtime.bootstrapObserver =
              null;

            requestRepair(
              'observer-bootstrap',
              ALL_DIRTY_REGIONS,
              true
            );
          },
          'bootstrap-observer',
          bootstrapEpoch
        )
      );

    runtime.bootstrapObserver.observe(
      root,
      {
        childList: true,
        subtree: true
      }
    );
  }

  function disconnectObservers() {
    runtime.bodyObserver
      ?.disconnect();

    runtime.headObserver
      ?.disconnect();

    runtime.rootObserver
      ?.disconnect();

    runtime.bootstrapObserver
      ?.disconnect();

    runtime.bodyObserver = null;
    runtime.headObserver = null;
    runtime.rootObserver = null;
    runtime.bootstrapObserver = null;

    runtime.observedBody = null;
    runtime.observedHead = null;
    runtime.observedRoot = null;

    disconnectPaneResizeObserver();
  }

  function repair() {
    if (!runtime.started) {
      return;
    }

    attachObservers();
    attachPaneResizeObserver();

    if (!settings.enabled) {
      removeMainStyle();
      clearRootState();
      clearManagedMarkers();
      return;
    }

    ensureStyle(
      ID.style,
      getMainCss()
    );

    ensureStyle(
      ID.uiStyle,
      getUiCss()
    );

    checkRoute();

    if (shouldPauseWork()) {
      runtime.deferredScan = true;
      return;
    }

    const conversationMissing =
      runtime.lastTurnCount > 0 &&
      !hasConnectedMarker(ATTR.turn);

    const composerMissing =
      settings.widenComposer &&
      !hasConnectedMarker(ATTR.composer);

    const dirty = [];

    if (hasDisconnectedMarkers()) {
      dirty.push(
        DIRTY.conversation,
        DIRTY.composer,
        DIRTY.notice
      );
    }

    if (conversationMissing) {
      dirty.push(DIRTY.conversation);
    }

    if (composerMissing) {
      dirty.push(DIRTY.composer);
    }

    if (dirty.length > 0) {
      requestRepair(
        'periodic-repair',
        [...new Set(dirty)]
      );
    }

    processInvariantResult(
      evaluateLayoutInvariants()
    );
    setRootState();
    syncDebugOverlay();
  }

  function isTypingTarget(target) {
    if (!target) {
      return false;
    }

    const element =
      target instanceof Element
        ? target
        : target.parentElement;

    return Boolean(
      element?.closest(
        [
          'input',
          'textarea',
          'select',
          '[contenteditable="true"]',
          '[role="textbox"]'
        ].join(',')
      )
    );
  }

  function exactShortcut(
    event,
    key
  ) {
    return (
      event.altKey &&
      !event.ctrlKey &&
      !event.metaKey &&
      !event.shiftKey &&
      String(
        event.key || ''
      ).toLowerCase() === key
    );
  }

  function onKeydown(event) {
    if (
      !event ||
      event.defaultPrevented ||
      isTypingTarget(event.target)
    ) {
      return;
    }

    if (exactShortcut(event, 'o')) {
      event.preventDefault();

      settings.enabled =
        !settings.enabled;

      commit(
        `UltraWide script: ${
          settings.enabled
            ? 'on'
            : 'off'
        }`
      );

      return;
    }

    if (exactShortcut(event, 'u')) {
      event.preventDefault();

      settings.wide =
        !settings.wide;

      commit(
        `UltraWide mode: ${
          settings.wide
            ? 'on'
            : 'off'
        }`
      );

      return;
    }

    if (exactShortcut(event, 'l')) {
      event.preventDefault();

      settings.left =
        !settings.left;

      commit(
        `Left alignment: ${
          settings.left
            ? 'on'
            : 'off'
        }`
      );

      return;
    }

    if (exactShortcut(event, 'm')) {
      event.preventDefault();
      cycleCap();
      return;
    }

    if (exactShortcut(event, 'a')) {
      event.preventDefault();

      settings.auto =
        !settings.auto;

      commit(
        `Adaptive mode: ${
          settings.auto
            ? 'on'
            : 'off'
        }`
      );

      return;
    }

    if (exactShortcut(event, 'c')) {
      event.preventDefault();

      settings.canvasSafeMode =
        !settings.canvasSafeMode;

      commit(
        `Split-view safe mode: ${
          settings.canvasSafeMode
            ? 'on'
            : 'off'
        }`
      );

      return;
    }

    if (exactShortcut(event, 's')) {
      event.preventDefault();
      openSettings();
      return;
    }

    if (exactShortcut(event, 'r')) {
      event.preventDefault();
      resetSettings();
    }
  }

  function onEnvironmentChange() {
    attachPaneResizeObserver();
    measureEffectivePane();
    setRootState();
    syncSettingsModal();
    requestRepair(
      'environment-change',
      [DIRTY.split, DIRTY.root]
    );
  }

  function bindEvents() {
    runtime.eventController
      ?.abort();

    runtime.eventController =
      new AbortController();

    const signal =
      runtime.eventController.signal;

    window.addEventListener(
      'keydown',
      onKeydown,
      {
        capture: true,
        signal
      }
    );

    window.addEventListener(
      'resize',
      onEnvironmentChange,
      {
        passive: true,
        signal
      }
    );

    window.addEventListener(
      'orientationchange',
      onEnvironmentChange,
      {
        passive: true,
        signal
      }
    );

    window.addEventListener(
      'pageshow',
      onEnvironmentChange,
      {
        passive: true,
        signal
      }
    );

    window.addEventListener(
      'focus',
      onEnvironmentChange,
      {
        passive: true,
        signal
      }
    );

    window.addEventListener(
      'popstate',
      scheduleRouteCheck,
      {
        passive: true,
        signal
      }
    );

    window.addEventListener(
      'hashchange',
      scheduleRouteCheck,
      {
        passive: true,
        signal
      }
    );

    try {
      if (
        window.navigation &&
        typeof window.navigation.addEventListener ===
          'function'
      ) {
        window.navigation.addEventListener(
          'navigate',
          scheduleRouteCheck,
          {
            signal
          }
        );
      }
    } catch (_) {}

    document.addEventListener(
      'visibilitychange',
      () => {
        if (!document.hidden) {
          if (runtime.deferredScan) {
            scheduleScan(true);
          } else {
            onEnvironmentChange();
          }
        }
      },
      {
        passive: true,
        signal
      }
    );
  }

  function unbindEvents() {
    runtime.eventController
      ?.abort();

    runtime.eventController =
      null;
  }

  function unregisterMenus() {
    for (const commandId of runtime.menuCommandIds.values()) {
      try {
        if (
          commandId !== undefined &&
          commandId !== null &&
          typeof GM_unregisterMenuCommand ===
            'function'
        ) {
          GM_unregisterMenuCommand(commandId);
        }
      } catch (_) {}
    }

    runtime.menuCommandIds.clear();
    runtime.menusRegistered = false;
  }

  function registerMenu(
    key,
    label,
    callback,
    accessKey
  ) {
    try {
      if (
        typeof GM_registerMenuCommand !==
        'function'
      ) {
        return null;
      }

      const commandId =
        GM_registerMenuCommand(
          label,
          callback,
          accessKey
        );

      runtime.menuCommandIds.set(
        key,
        commandId
      );

      return commandId;
    } catch (_) {
      return null;
    }
  }

  function menuToggleLabel(
    label,
    active,
    detail = ''
  ) {
    const marker =
      active ? '✓' : '○';

    return `${marker}  ${label}${
      detail ? ` · ${detail}` : ''
    }`;
  }

  function menuValueLabel(
    icon,
    label,
    value,
    detail = ''
  ) {
    return `${icon}  ${label} · ${value}${
      detail ? ` · ${detail}` : ''
    }`;
  }

  function toggleSetting(
    key,
    label,
    options = {}
  ) {
    settings[key] =
      !settings[key];

    commit(
      `${label}: ${
        settings[key]
          ? 'on'
          : 'off'
      }`,
      Boolean(options.restartTimers)
    );
  }

  function refreshMenus() {
    unregisterMenus();
    registerMenus();
  }

  function registerMenus() {
    if (runtime.menusRegistered) {
      return;
    }

    runtime.menusRegistered = true;

    registerMenu(
      'settings',
      `⚙  Settings · v${VERSION}`,
      openSettings,
      's'
    );

    registerMenu(
      'enabled',
      menuToggleLabel(
        'Script',
        settings.enabled,
        settings.enabled
          ? 'enabled'
          : 'disabled'
      ),
      () => {
        toggleSetting(
          'enabled',
          'UltraWide script'
        );
      },
      'o'
    );

    registerMenu(
      'wide',
      menuToggleLabel(
        'UltraWide',
        settings.wide,
        isWideActive()
          ? 'active'
          : 'inactive'
      ),
      () => {
        toggleSetting(
          'wide',
          'UltraWide mode'
        );
      },
      'u'
    );

    registerMenu(
      'left',
      menuToggleLabel(
        'Left alignment',
        settings.left
      ),
      () => {
        toggleSetting(
          'left',
          'Left alignment'
        );
      },
      'l'
    );

    registerMenu(
      'cap',
      menuValueLabel(
        '⌗',
        'Width cap',
        settings.cap === 'none'
          ? 'Unlimited'
          : `${settings.cap}px`,
        'cycle'
      ),
      cycleCap,
      'm'
    );

    registerMenu(
      'auto',
      menuToggleLabel(
        'Adaptive width',
        settings.auto,
        `≥ ${settings.autoMinWidth}px`
      ),
      () => {
        toggleSetting(
          'auto',
          'Adaptive mode'
        );
      },
      'a'
    );

    registerMenu(
      'composer',
      menuToggleLabel(
        'Wide composer',
        settings.widenComposer
      ),
      () => {
        toggleSetting(
          'widenComposer',
          'Wide composer'
        );
      }
    );

    registerMenu(
      'canvas',
      menuToggleLabel(
        'Split-view safety',
        settings.canvasSafeMode,
        runtime.canvasDetected
          ? 'split view detected'
          : 'standby'
      ),
      () => {
        toggleSetting(
          'canvasSafeMode',
          'Split-view safe mode'
        );
      },
      'c'
    );

    registerMenu(
      'media',
      menuToggleLabel(
        'Safe media',
        settings.safeMedia
      ),
      () => {
        toggleSetting(
          'safeMedia',
          'Safe media constraints'
        );
      }
    );

    registerMenu(
      'pause-hidden',
      menuToggleLabel(
        'Pause hidden tabs',
        settings.pauseWhenHidden,
        runtime.deferredScan
          ? 'scan deferred'
          : 'idle'
      ),
      () => {
        toggleSetting(
          'pauseWhenHidden',
          'Pause in hidden tabs'
        );
      }
    );

    registerMenu(
      'telemetry',
      menuToggleLabel(
        'Performance telemetry',
        settings.performanceTelemetry,
        `${runtime.lastScanDurationMs.toFixed(1)} ms`
      ),
      () => {
        toggleSetting(
          'performanceTelemetry',
          'Performance telemetry'
        );
      }
    );

    registerMenu(
      'debug-overlay',
      menuToggleLabel(
        'Debug overlay',
        settings.debugOverlay,
        settings.debugOverlay
          ? 'visible'
          : 'hidden'
      ),
      () => {
        toggleSetting(
          'debugOverlay',
          'Debug overlay'
        );
      }
    );

    registerMenu(
      'scan',
      menuValueLabel(
        '↻',
        'Rescan layout',
        `${runtime.lastTurnCount} turns`
      ),
      () => {
        scheduleScan(true);
        showToast(
          'UltraWide layout rescanned'
        );
        window.setTimeout(
          refreshMenus,
          0
        );
      }
    );

    registerMenu(
      'diagnostics',
      '⎘  Copy diagnostics',
      () => {
        void copyDiagnostics();
      }
    );

    registerMenu(
      'download-diagnostics',
      '⇩  Download diagnostics',
      downloadDiagnostics
    );

    registerMenu(
      'download-bug-report',
      '⇩  Download bug report',
      downloadBugReport
    );

    registerMenu(
      'reset',
      '↺  Reset to defaults',
      () => {
        if (
          window.confirm(
            'Reset every UltraWide setting to its default value?'
          )
        ) {
          resetSettings();
        }
      },
      'r'
    );
  }

  function createElement(
    tag,
    attributes = {},
    children = []
  ) {
    const element =
      document.createElement(tag);

    for (
      const [key, value] of
      Object.entries(attributes)
    ) {
      if (key === 'className') {
        element.className = value;
      } else if (key === 'text') {
        element.textContent = value;
      } else if (key === 'dataset') {
        Object.assign(
          element.dataset,
          value
        );
      } else if (
        key.startsWith('on') &&
        typeof value === 'function'
      ) {
        element.addEventListener(
          key.slice(2).toLowerCase(),
          value
        );
      } else if (
        value !== null &&
        value !== undefined &&
        value !== false
      ) {
        element.setAttribute(
          key,
          String(value)
        );
      }
    }

    for (const child of children) {
      if (
        child === null ||
        child === undefined
      ) {
        continue;
      }

      element.appendChild(
        typeof child === 'string'
          ? document.createTextNode(child)
          : child
      );
    }

    return element;
  }

  function createCheckbox(
    key,
    label,
    hint = ''
  ) {
    const id =
      `uwc-${key}`;

    const input =
      createElement(
        'input',
        {
          id,
          type: 'checkbox',
          dataset: {
            setting: key
          }
        }
      );

    input.checked =
      Boolean(settings[key]);

    input.addEventListener(
      'change',
      () => {
        if (
          runtime.modalSyncing
        ) {
          return;
        }

        setOptions({
          [key]: input.checked
        });
      }
    );

    return createElement(
      'label',
      {
        className: 'uwc-check',
        for: id
      },
      [
        input,
        createElement(
          'span',
          {
            className:
              'uwc-check-copy'
          },
          [
            label,
            hint
              ? createElement(
                  'span',
                  {
                    className:
                      'uwc-hint',
                    text: ` ${hint}`
                  }
                )
              : null
          ]
        ),
        createElement(
          'span',
          {
            className:
              'uwc-toggle-state',
            dataset: {
              toggleStateFor: key
            },
            text:
              input.checked ? 'ON' : 'OFF',
            'aria-hidden': 'true'
          }
        )
      ]
    );
  }

  function createNumberInput(
    key,
    label,
    hint = '',
    step = '1'
  ) {
    const id =
      `uwc-${key}`;

    const input =
      createElement(
        'input',
        {
          id,
          type: 'number',
          min: LIMITS[key]?.[0],
          max: LIMITS[key]?.[1],
          step,
          value: settings[key],
          dataset: {
            setting: key
          }
        }
      );

    input.addEventListener(
      'change',
      () => {
        if (
          runtime.modalSyncing
        ) {
          return;
        }

        setOptions({
          [key]: input.value
        });
      }
    );

    return createElement(
      'div',
      {
        className: 'uwc-field'
      },
      [
        createElement(
          'label',
          {
            for: id,
            text: label
          }
        ),
        input,
        hint
          ? createElement(
              'div',
              {
                className:
                  'uwc-hint',
                text: hint
              }
            )
          : null
      ]
    );
  }

  function createCapInput() {
    const select =
      createElement(
        'select',
        {
          id: 'uwc-cap',
          dataset: {
            setting: 'cap'
          }
        }
      );

    for (const cap of CAPS) {
      const option =
        createElement(
          'option',
          {
            value: cap,
            text:
              cap === 'none'
                ? 'No limit'
                : `${cap}px`
          }
        );

      option.selected =
        settings.cap === cap;

      select.appendChild(option);
    }

    select.addEventListener(
      'change',
      () => {
        if (
          runtime.modalSyncing
        ) {
          return;
        }

        setOptions({
          cap: select.value
        });
      }
    );

    return createElement(
      'div',
      {
        className: 'uwc-field'
      },
      [
        createElement(
          'label',
          {
            for: 'uwc-cap',
            text:
              'Maximum content width'
          }
        ),
        select,
        createElement(
          'div',
          {
            className: 'uwc-hint',
            text:
              'No limit uses the complete available chat-pane width.'
          }
        )
      ]
    );
  }

  function createSection(
    title,
    children
  ) {
    return createElement(
      'section',
      {
        className:
          'uwc-section'
      },
      [
        createElement(
          'h3',
          { text: title }
        ),
        ...children
      ]
    );
  }

  function createRuntimeMetric(label, value, role) {
    return createElement(
      'div',
      {
        className: 'uwc-metric'
      },
      [
        createElement(
          'span',
          {
            className: 'uwc-metric-label',
            text: label
          }
        ),
        createElement(
          'span',
          {
            className: 'uwc-metric-value',
            dataset: {
              role
            },
            text: String(value ?? '—')
          }
        )
      ]
    );
  }

  function createRuntimeOverview() {
    const health = calculateHealthScore();
    const strategy =
      runtime.strategySelection ||
      selectDomStrategy(
        runtime.lastCapabilities ||
        detectDomCapabilities()
      );

    return createElement(
      'div',
      {
        className: 'uwc-overview',
        'aria-label': 'Runtime overview'
      },
      [
        createRuntimeMetric(
          'Health',
          `${health.score}/100`,
          'metric-health'
        ),
        createRuntimeMetric(
          'Strategy',
          strategy.id || 'unknown',
          'metric-strategy'
        ),
        createRuntimeMetric(
          'Confidence',
          `${strategy.confidence || 0}%`,
          'metric-confidence'
        ),
        createRuntimeMetric(
          'Pane',
          `${getAdaptiveWidth()}px`,
          'metric-pane'
        ),
        createRuntimeMetric(
          'Turns',
          runtime.lastTurnCount,
          'metric-turns'
        ),
        createRuntimeMetric(
          'Watchdog',
          runtime.watchdogIntervalMs
            ? `${runtime.watchdogIntervalMs}ms`
            : 'idle',
          'metric-watchdog'
        )
      ]
    );
  }

  function createHealthBreakdownPanel() {
    const health =
      calculateHealthScore();

    const labels = {
      runtime: 'Runtime',
      styles: 'Styles',
      dom: 'DOM',
      width: 'Width',
      reconciliation: 'Reconcile',
      performance: 'Performance'
    };

    return createElement(
      'div',
      {
        className:
          'uwc-health-breakdown',
        'aria-label':
          'Health breakdown'
      },
      Object.entries(
        health.breakdown
      ).map(([key, value]) =>
        createElement(
          'div',
          {
            className:
              'uwc-health-item'
          },
          [
            createElement(
              'span',
              {
                className:
                  'uwc-health-label',
                text:
                  labels[key] || key
              }
            ),
            createElement(
              'span',
              {
                className:
                  'uwc-health-value',
                dataset: {
                  healthComponent:
                    key
                },
                text:
                  `${value}`
              }
            )
          ]
        )
      )
    );
  }

  function syncSettingsModal() {
    const modal =
      document.getElementById(
        ID.modal
      );

    if (
      !modal ||
      runtime.modalSyncing
    ) {
      return;
    }

    runtime.modalSyncing = true;

    try {
      for (
        const element of
        modal.querySelectorAll(
          '[data-setting]'
        )
      ) {
        const key =
          element.dataset.setting;

        if (!(key in settings)) {
          continue;
        }

        if (
          element instanceof
          HTMLInputElement
        ) {
          if (
            element.type ===
            'checkbox'
          ) {
            element.checked =
              Boolean(settings[key]);

            const statePill =
              modal.querySelector(
                `[data-toggle-state-for="${key}"]`
              );

            if (statePill) {
              statePill.textContent =
                element.checked ? 'ON' : 'OFF';
            }
          } else {
            element.value =
              String(settings[key]);
          }
        } else if (
          element instanceof
          HTMLSelectElement
        ) {
          element.value =
            String(settings[key]);
        }
      }

      const statusTitle =
        modal.querySelector(
          '[data-role="status-title"]'
        );

      const statusDetail =
        modal.querySelector(
          '[data-role="status-detail"]'
        );

      if (statusTitle) {
        statusTitle.textContent =
          isWideActive()
            ? 'UltraWide is active'
            : 'UltraWide is inactive';
      }

      if (statusDetail) {
        statusDetail.textContent =
          getStatusText();
      }

      const statusCard =
        modal.querySelector(
          '[data-role="status-card"]'
        );

      if (statusCard) {
        statusCard.dataset.state =
          isWideActive()
            ? 'active'
            : 'inactive';
      }

      try {
        const health =
          calculateHealthScore();

        const strategy =
          runtime.strategySelection ||
          selectDomStrategy(
            runtime.lastCapabilities ||
            detectDomCapabilities()
          );

        const metricValues = {
          'metric-health':
            `${health.score}/100`,
          'metric-strategy':
            strategy.id || 'unknown',
          'metric-confidence':
            `${strategy.confidence || 0}%`,
          'metric-pane':
            `${getAdaptiveWidth()}px`,
          'metric-turns':
            String(runtime.lastTurnCount),
          'metric-watchdog':
            runtime.watchdogIntervalMs
              ? `${runtime.watchdogIntervalMs}ms`
              : 'idle',
          'health-pill':
            `${health.score} · ${health.status}`
        };

        for (
          const [role, value] of
          Object.entries(metricValues)
        ) {
          const target =
            modal.querySelector(
              `[data-role="${role}"]`
            );

          if (target) {
            target.textContent =
              value;
          }
        }

        for (
          const [key, value] of
          Object.entries(
            health.breakdown || {}
          )
        ) {
          const target =
            modal.querySelector(
              `[data-health-component="${key}"]`
            );

          if (target) {
            target.textContent =
              String(value);
          }
        }
      } catch (error) {
        runtime.lastError =
          String(
            error?.message ||
            error
          );
      }
    } finally {
      runtime.modalSyncing = false;
    }
  }

  function getSettingsSnapshot() {
    try {
      return JSON.stringify(
        normalizeSettings({ ...settings })
      );
    } catch (_) {
      return '';
    }
  }

  function getReloadGuardState() {
    try {
      const raw = sessionStorage.getItem(
        RELOAD_GUARD_KEY
      );

      const parsed = raw
        ? JSON.parse(raw)
        : null;

      return parsed && typeof parsed === 'object'
        ? parsed
        : { timestamps: [] };
    } catch (_) {
      return { timestamps: [] };
    }
  }

  function requestGuardedReload(reason) {
    const now = Date.now();
    const state = getReloadGuardState();
    const timestamps = Array.isArray(state.timestamps)
      ? state.timestamps.filter(
          (timestamp) =>
            now - Number(timestamp) <
              CONFIG.reloadLoopWindowMs
        )
      : [];

    if (
      timestamps.length >=
        CONFIG.reloadLoopMaxCount
    ) {
      pushDebugEvent('reload-suppressed', {
        reason,
        recentReloads: timestamps.length
      });

      showToast(
        'Reload suppressed by loop protection'
      );
      return false;
    }

    timestamps.push(now);

    try {
      sessionStorage.setItem(
        RELOAD_GUARD_KEY,
        JSON.stringify({
          timestamps,
          reason: String(reason || 'reload')
        })
      );
    } catch (_) {}

    pushDebugEvent('reload-requested', {
      reason
    });

    window.setTimeout(() => {
      location.reload();
    }, 0);

    return true;
  }

  function closeSettings(options = {}) {
    const reloadIfChanged =
      options?.reloadIfChanged !== false;

    const modal =
      document.getElementById(ID.modal);

    const openedSnapshot =
      runtime.modalSettingsSnapshot;

    const currentSnapshot =
      getSettingsSnapshot();

    const settingsChanged = Boolean(
      modal &&
      openedSnapshot &&
      currentSnapshot &&
      openedSnapshot !== currentSnapshot
    );

    removeById(ID.modal);
    runtime.modalSettingsSnapshot = '';

    if (
      reloadIfChanged &&
      settingsChanged
    ) {
      requestGuardedReload(
        'settings-changed'
      );

      return;
    }

    const returnFocus =
      runtime.modalReturnFocus;

    runtime.modalReturnFocus = null;

    if (
      isConnectedElement(returnFocus) &&
      typeof returnFocus.focus ===
        'function'
    ) {
      returnFocus.focus({
        preventScroll: true
      });
    }
  }

  function getFocusableElements(container) {
    if (!isConnectedElement(container)) {
      return [];
    }

    return Array.from(
      container.querySelectorAll(
        [
          'button:not([disabled])',
          'input:not([disabled])',
          'select:not([disabled])',
          'textarea:not([disabled])',
          'a[href]',
          '[tabindex]:not([tabindex="-1"])'
        ].join(',')
      )
    ).filter((element) => {
      try {
        return (
          element.getClientRects().length > 0 &&
          element.getAttribute(
            'aria-hidden'
          ) !== 'true'
        );
      } catch (_) {
        return true;
      }
    });
  }

  function openSettings() {
    ensureStyle(
      ID.uiStyle,
      getUiCss()
    );

    const existing =
      document.getElementById(
        ID.modal
      );

    if (existing) {
      syncSettingsModal();

      existing.focus({
        preventScroll: true
      });

      return;
    }

    runtime.modalReturnFocus =
      isElement(document.activeElement)
        ? document.activeElement
        : null;

    runtime.modalSettingsSnapshot =
      getSettingsSnapshot();

    const modal =
      createElement(
        'div',
        {
          id: ID.modal,
          role: 'dialog',
          'aria-modal': 'true',
          'aria-labelledby':
            'uwc-settings-title'
        },
        [
          createElement(
            'div',
            {
              className:
                'uwc-panel'
            },
            [
              createElement(
                'div',
                {
                  className:
                    'uwc-header'
                },
                [
                  createElement(
                    'div',
                    {
                      className:
                        'uwc-header-copy'
                    },
                    [
                      createElement(
                        'div',
                        {
                          className:
                            'uwc-title-row'
                        },
                        [
                          createElement(
                            'h2',
                            {
                              id:
                                'uwc-settings-title',
                              className:
                                'uwc-title',
                              text:
                                PRODUCT_NAME
                            }
                          ),
                          createElement(
                            'span',
                            {
                              className:
                                'uwc-version',
                              text:
                                `v${VERSION}`
                            }
                          )
                        ]
                      ),
                      createElement(
                        'p',
                        {
                          className:
                            'uwc-subtitle',
                          text:
                            'Layout and runtime preferences'
                        }
                      )
                    ]
                  ),
                  createElement(
                    'button',
                    {
                      type: 'button',
                      className:
                        'uwc-close',
                      text: '×',
                      title: 'Close',
                      'aria-label':
                        'Close settings',
                      onclick:
                        closeSettings
                    }
                  )
                ]
              ),

              createElement(
                'div',
                {
                  className:
                    'uwc-body'
                },
                [
                  createElement(
                    'div',
                    {
                      className:
                        'uwc-status',
                      role: 'status',
                      'aria-live':
                        'polite',
                      dataset: {
                        role: 'status-card',
                        state:
                          isWideActive()
                            ? 'active'
                            : 'inactive'
                      }
                    },
                    [
                      createElement(
                        'div',
                        {
                          className:
                            'uwc-status-main'
                        },
                        [
                          createElement(
                            'strong',
                            {
                              dataset: {
                                role: 'status-title'
                              },
                              text:
                                isWideActive()
                                  ? 'UltraWide is active'
                                  : 'UltraWide is inactive'
                            }
                          ),
                          createElement(
                            'span',
                            {
                              className:
                                'uwc-status-detail',
                              dataset: {
                                role: 'status-detail'
                              },
                              text:
                                getStatusText()
                            }
                          )
                        ]
                      ),
                      createElement(
                        'span',
                        {
                          className:
                            'uwc-health-pill',
                          dataset: {
                            role: 'health-pill'
                          },
                          text: (() => {
                            const health =
                              calculateHealthScore();
                            return `${health.score} · ${health.status}`;
                          })()
                        }
                      )
                    ]
                  ),

                  createRuntimeOverview(),
                  createHealthBreakdownPanel(),

                  createSection(
                    'Layout',
                    [
                      createElement(
                        'div',
                        {
                          className:
                            'uwc-grid'
                        },
                        [
                          createCheckbox(
                            'enabled',
                            'Enable script'
                          ),
                          createCheckbox(
                            'wide',
                            'Enable UltraWide'
                          ),
                          createCheckbox(
                            'left',
                            'Left-align content'
                          ),
                          createCapInput(),
                          createCheckbox(
                            'widenComposer',
                            'Widen message composer'
                          ),
                          createCheckbox(
                            'safeMedia',
                            'Safe media constraints'
                          ),
                          createCheckbox(
                            'canvasSafeMode',
                            'Split-view safe mode'
                          ),
                          createCheckbox(
                            'toast',
                            'Show status notifications'
                          )
                        ]
                      )
                    ]
                  ),

                  createSection(
                    'Adaptive behavior',
                    [
                      createElement(
                        'div',
                        {
                          className:
                            'uwc-grid'
                        },
                        [
                          createCheckbox(
                            'auto',
                            'Enable adaptive mode'
                          ),
                          createCheckbox(
                            'disableOnTouch',
                            'Disable UltraWide on touch devices'
                          ),
                          createNumberInput(
                            'autoMinWidth',
                            'Minimum pane width',
                            `${LIMITS.autoMinWidth[0]}–${LIMITS.autoMinWidth[1]} px`
                          ),
                          createNumberInput(
                            'disableBelowHeight',
                            'Minimum window height',
                            '0 disables this condition'
                          )
                        ]
                      )
                    ]
                  ),

                  createSection(
                    'Spacing',
                    [
                      createElement(
                        'div',
                        {
                          className:
                            'uwc-grid'
                        },
                        [
                          createNumberInput(
                            'gutterMin',
                            'Minimum side gutter'
                          ),
                          createNumberInput(
                            'gutterVw',
                            'Responsive gutter in vw',
                            '',
                            '0.1'
                          ),
                          createNumberInput(
                            'gutterMax',
                            'Maximum side gutter'
                          )
                        ]
                      )
                    ]
                  ),

                  createElement(
                    'details',
                    {
                      className:
                        'uwc-advanced'
                    },
                    [
                      createElement(
                        'summary',
                        {
                          text:
                            'Advanced runtime & diagnostics'
                        }
                      ),
                      createElement(
                        'div',
                        {
                          className:
                            'uwc-advanced-body'
                        },
                        [
                          createSection(
                            'Runtime',
                            [
                              createElement(
                                'div',
                                {
                                  className:
                                    'uwc-grid'
                                },
                                [
                                  createNumberInput(
                                    'scanDebounceMs',
                                    'DOM scan debounce',
                                    'Higher values reduce DOM activity'
                                  ),
                                  createNumberInput(
                                    'repairIntervalMs',
                                    'Repair interval',
                                    'Lightweight integrity check'
                                  ),
                                  createNumberInput(
                                    'routePollMs',
                                    'SPA route fallback interval'
                                  ),
                                  createNumberInput(
                                    'toastMs',
                                    'Status-message duration'
                                  ),
                                  createCheckbox(
                                    'pauseWhenHidden',
                                    'Pause background work in hidden tabs'
                                  ),
                                  createCheckbox(
                                    'performanceTelemetry',
                                    'Collect lightweight scan timing'
                                  ),
                                  createCheckbox(
                                    'debugOverlay',
                                    'Show debug overlay'
                                  ),
                                  createCheckbox(
                                    'closeSettingsOnBackdrop',
                                    'Close settings on backdrop'
                                  )
                                ]
                              )
                            ]
                          ),
                          createSection(
                            'Shortcuts',
                            [
                              createElement(
                                'div',
                                {
                                  className:
                                    'uwc-shortcuts'
                                },
                                [
                                  createElement('span',{text:'Alt+O Script'}),
                                  createElement('span',{text:'Alt+U UltraWide'}),
                                  createElement('span',{text:'Alt+L Align'}),
                                  createElement('span',{text:'Alt+M Width'}),
                                  createElement('span',{text:'Alt+A Adaptive'}),
                                  createElement('span',{text:'Alt+C Canvas'}),
                                  createElement('span',{text:'Alt+S Settings'}),
                                  createElement('span',{text:'Alt+R Reset'})
                                ]
                              )
                            ]
                          ),
                          createElement(
                            'div',
                            {
                              className:
                                'uwc-inline-actions'
                            },
                            [
                              createElement(
                                'button',
                                {
                                  type: 'button',
                                  text:
                                    'Download diagnostics',
                                  onclick:
                                    downloadDiagnostics
                                }
                              ),
                              createElement(
                                'button',
                                {
                                  type: 'button',
                                  text:
                                    'Download bug report',
                                  onclick:
                                    downloadBugReport
                                }
                              ),
                              createElement(
                                'button',
                                {
                                  type: 'button',
                                  text:
                                    'Lifecycle torture test',
                                  onclick: async (event) => {
                                    const button =
                                      event?.currentTarget;

                                    if (button) {
                                      button.disabled = true;
                                    }

                                    showToast(
                                      'Running lifecycle torture test…'
                                    );

                                    try {
                                      const result =
                                        await lifecycleTortureSelfTest();

                                      if (
                                        runtime.started &&
                                        !document.getElementById(
                                          ID.modal
                                        )
                                      ) {
                                        openSettings();
                                      }

                                      syncSettingsModal();

                                      showToast(
                                        result.ok
                                          ? 'Lifecycle torture test passed'
                                          : 'Lifecycle torture test found issues'
                                      );
                                    } catch (error) {
                                      runtime.lastError =
                                        String(
                                          error?.message ||
                                          error
                                        );

                                      if (
                                        runtime.started &&
                                        !document.getElementById(
                                          ID.modal
                                        )
                                      ) {
                                        openSettings();
                                      }

                                      showToast(
                                        'Lifecycle torture test failed'
                                      );
                                    } finally {
                                      const liveButton =
                                        document.querySelector(
                                          `#${ID.modal} button[data-role="lifecycle-test"]`
                                        );

                                      if (liveButton) {
                                        liveButton.disabled = false;
                                      }
                                    }
                                  },
                                  dataset: {
                                    role: 'lifecycle-test'
                                  }
                                }
                              )
                            ]
                          )
                        ]
                      )
                    ]
                  ),

                  createElement(
                    'div',
                    {
                      className:
                        'uwc-actions'
                    },
                    [
                      createElement(
                        'button',
                        {
                          type: 'button',
                          text:
                            'Repair now',
                          onclick: () => {
                            try {
                              const result =
                                reconcileDesiredState(
                                  'settings-repair'
                                );

                              syncSettingsModal();

                              if (result.pending) {
                                showToast(
                                  'Repair scheduled · verification pending'
                                );
                              } else if (result.ok) {
                                showToast(
                                  result.changed
                                    ? 'UltraWide repaired and verified'
                                    : 'UltraWide already verified'
                                );
                              } else {
                                showToast(
                                  'Repair completed with remaining issues'
                                );
                              }
                            } catch (error) {
                              runtime.lastError =
                                String(
                                  error?.message ||
                                  error
                                );

                              showToast(
                                'Repair failed · see diagnostics'
                              );
                            }
                          }
                        }
                      ),
                      createElement(
                        'button',
                        {
                          type: 'button',
                          text:
                            'Run self-test',
                          onclick: () => {
                            try {
                              const result =
                                selfTest();

                              syncSettingsModal();

                              showToast(
                                result.ok
                                  ? `Self-test passed · ${result.health.score}/100`
                                  : `Self-test found issues · ${result.health.score}/100`
                              );
                            } catch (error) {
                              runtime.lastError =
                                String(
                                  error?.message ||
                                  error
                                );

                              showToast(
                                'Self-test failed · see diagnostics'
                              );
                            }
                          }
                        }
                      ),
                      createElement(
                        'button',
                        {
                          type: 'button',
                          text:
                            'Copy diagnostics',
                          onclick: () => {
                            void copyDiagnostics()
                              .catch((error) => {
                                runtime.lastError =
                                  String(
                                    error?.message ||
                                    error
                                  );

                                showToast(
                                  'Diagnostics copy failed'
                                );
                              });
                          }
                        }
                      ),
                      createElement(
                        'button',
                        {
                          type: 'button',
                          className:
                            'uwc-danger',
                          text: 'Reset',
                          onclick: () => {
                            if (
                              window.confirm(
                                'Reset every UltraWide setting to its default value?'
                              )
                            ) {
                              resetSettings();
                            }
                          }
                        }
                      ),
                      createElement(
                        'button',
                        {
                          type: 'button',
                          className:
                            'uwc-primary',
                          text: 'Done',
                          onclick:
                            closeSettings
                        }
                      )
                    ]
                  )
                ]
              )
            ]
          )
        ]
      );

    modal.tabIndex = -1;

    modal.addEventListener(
      'click',
      (event) => {
        if (
          settings.closeSettingsOnBackdrop &&
          event.target === modal
        ) {
          closeSettings();
        }
      }
    );

    modal.addEventListener(
      'keydown',
      (event) => {
        if (event.key === 'Escape') {
          event.preventDefault();
          event.stopPropagation();
          closeSettings();
          return;
        }

        if (event.key === 'Tab') {
          const focusable =
            getFocusableElements(modal);

          if (focusable.length === 0) {
            event.preventDefault();
            modal.focus({
              preventScroll: true
            });
            return;
          }

          const first =
            focusable[0];

          const last =
            focusable[
              focusable.length - 1
            ];

          if (
            event.shiftKey &&
            document.activeElement === first
          ) {
            event.preventDefault();
            last.focus();
          } else if (
            !event.shiftKey &&
            document.activeElement === last
          ) {
            event.preventDefault();
            first.focus();
          }
        }
      }
    );

    const parent =
      getBody() ||
      getRoot();

    if (!parent) {
      return;
    }

    parent.appendChild(modal);

    const firstFocusable =
      getFocusableElements(modal)[0];

    (
      firstFocusable ||
      modal
    ).focus({
      preventScroll: true
    });
  }

  function verifyRuntime() {
    const mainStyle =
      document.getElementById(ID.style);
    const uiStyle =
      document.getElementById(ID.uiStyle);
    const root = getRoot();

    const checks = {
      started: runtime.started,
      rootVersion:
        !settings.enabled ||
        root?.getAttribute(ATTR.version) === VERSION,
      mainStyle:
        settings.enabled
          ? mainStyle?.textContent === getMainCss()
          : !mainStyle,
      disabledRootClean:
        settings.enabled ||
        ![
          ATTR.version,
          ATTR.cap,
          ATTR.enabled,
          ATTR.wide,
          ATTR.left,
          ATTR.canvas
        ].some((attribute) =>
          root?.hasAttribute(attribute)
        ),
      disabledMarkersClean:
        settings.enabled ||
        !MANAGED_MARKERS.some(
          hasConnectedMarker
        ),
      uiStyle:
        uiStyle?.textContent === getUiCss(),
      rootObserver:
        Boolean(runtime.rootObserver),
      bodyObserver:
        Boolean(runtime.bodyObserver),
      headObserver:
        Boolean(runtime.headObserver),
      enforcementTimer:
        Boolean(runtime.enforcementTimer),
      domFingerprint:
        Boolean(runtime.lastDomFingerprint || computeDomFingerprint()),
      strategyConfidence:
        !(runtime.strategySelection || selectDomStrategy(runtime.lastCapabilities || detectDomCapabilities())).lowConfidence,
      convergence:
        runtime.convergenceStallCount < CONFIG.convergenceHardLimit,
      widthVerification:
        verifyAppliedWidths().ok,
      rootState:
        !settings.enabled ||
        rootStateMatches(),
      paneObserver:
        typeof ResizeObserver !== 'function' ||
        Boolean(runtime.paneResizeObserver) ||
        !runtime.observedPane,
      paneConnected:
        !runtime.observedPane ||
        runtime.observedPane.isConnected,
      markersConnected:
        !hasDisconnectedMarkers(),
      rootEnabledState:
        !settings.enabled ||
        root?.getAttribute(ATTR.enabled) === '1',
      schedulerState:
        runtime.pendingRepairReasons instanceof Set &&
        runtime.pendingDirtyRegions instanceof Set,
      safeFallbackInactive:
        !runtime.safeFallbackActive,
      invariants:
        evaluateLayoutInvariants().ok
    };

    return {
      ok: Object.values(checks).every(Boolean),
      checks
    };
  }

  function getDiagnostics() {
    const pane = measureEffectivePane();
    const capabilities =
      detectDomCapabilities();
    const compatibility =
      evaluateCompatibility(capabilities);
    const state = getState();

    return {
      generatedAt: new Date().toISOString(),
      name: PRODUCT_NAME,
      version: VERSION,
      userAgent: navigator.userAgent,
      viewport: {
        width: window.innerWidth || 0,
        height: window.innerHeight || 0,
        devicePixelRatio:
          window.devicePixelRatio || 1
      },
      pane: {
        width: pane.width,
        height: pane.height,
        source: pane.source,
        observed:
          Boolean(runtime.observedPane),
        connected:
          Boolean(
            runtime.observedPane?.isConnected
          ),
        resizeObserverAttached:
          Boolean(runtime.paneResizeObserver),
        resizeCount:
          runtime.paneResizeCount,
        lastResizeAt:
          runtime.lastPaneResizeAt
      },
      document: {
        hidden: document.hidden,
        readyState: document.readyState,
        url: location.href,
        language:
          document.documentElement?.lang || ''
      },
      capabilities: {
        browser: {
          navigationApi:
            Boolean(window.navigation),
          resizeObserver:
            typeof ResizeObserver === 'function',
          requestIdleCallback:
            typeof requestIdleCallback === 'function',
          gmStorage: hasGmStorage()
        },
        dom: capabilities
      },
      compatibility,
      health: {
        ...verifyRuntime(),
        ...calculateHealthScore()
      },
      widthVerification: runtime.lastWidthVerification || verifyAppliedWidths(),
      desiredState: runtime.lastDesiredState,
      actualState: runtime.lastActualState,
      stateDiff: runtime.lastStateDiff,
      domFingerprint: {
        value: runtime.lastDomFingerprint || computeDomFingerprint(),
        lastChangedAt: runtime.lastDomFingerprintAt,
        changeCount: runtime.domFingerprintChanges
      },
      selectorHealth:
        getSelectorHealthSummary(),
      repairEffectiveness:
        getRepairEffectivenessMetrics(),
      performanceBudget:
        getPerformanceBudgetReport(),
      repairHistory: [...runtime.repairHistory],
      runtime: {
        repairRequests: runtime.repairRequestCount,
        repairPasses: runtime.repairPassCount,
        coalescedRepairs: runtime.coalescedRepairCount,
        lastRepairAt: runtime.lastRepairAt,
        lastRepairReasons: runtime.lastRepairReasons,
        pendingReasons: [...runtime.pendingRepairReasons],
        pendingDirtyRegions: [...runtime.pendingDirtyRegions],
        invariants: runtime.lastInvariants,
        invariantFailureStreak: runtime.invariantFailureStreak,
        enforcementChecks: runtime.enforcementCheckCount,
        enforcementRepairs: runtime.enforcementRepairCount,
        enforcementRetries: runtime.enforcementRetryCount,
        enforcementLevel: runtime.enforcementLevel,
        watchdogIntervalMs: runtime.watchdogIntervalMs,
        stableWatchdogPasses: runtime.stableWatchdogPasses,
        lastEnforcementAt: runtime.lastEnforcementAt,
        lastEnforcementRepairAt: runtime.lastEnforcementRepairAt,
        lastEnforcementFailures: [...runtime.lastEnforcementFailures],
        safeFallbackActive: runtime.safeFallbackActive,
        safeFallbackReason: runtime.safeFallbackReason,
        reconcileInProgress: runtime.reconcileInProgress,
        reconcilePendingVerification:
          runtime.reconcilePendingVerification,
        reconcilePendingSince:
          runtime.reconcilePendingSince,
        queuedReconciliationReasons: [
          ...runtime.queuedReconciliationReasons
        ],
        queuedReconciliationRequests:
          runtime.queuedReconciliationRequestCount,
        queuedReconciliationRuns:
          runtime.queuedReconciliationRunCount,
        reconcileLockContentions:
          runtime.reconcileLockContentionCount,
        epoch: runtime.epoch,
        staleCallbacksBlocked:
          runtime.staleCallbackCount,
        debugEvents: [...runtime.debugEvents]
      },
      state
    };
  }

  async function copyDiagnostics() {
    const output = JSON.stringify(
      getDiagnostics(),
      null,
      2
    );

    try {
      await navigator.clipboard.writeText(output);
      showToast('UltraWide diagnostics copied');
      return true;
    } catch (_) {}

    try {
      const textarea = document.createElement('textarea');
      textarea.value = output;
      textarea.readOnly = true;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      textarea.style.pointerEvents = 'none';

      (getBody() || getRoot())?.appendChild(textarea);
      textarea.select();

      const copied = document.execCommand('copy');
      textarea.remove();

      if (copied) {
        showToast('UltraWide diagnostics copied');
        return true;
      }
    } catch (_) {}

    console.info('[UltraWide] Diagnostics:', getDiagnostics());
    showToast('Copy failed; diagnostics written to console');
    return false;
  }

  function downloadDiagnostics() {
    const ok = downloadTextFile(
      `ultrawide-diagnostics-${Date.now()}.json`,
      JSON.stringify(
        getDiagnostics(),
        null,
        2
      ),
      'application/json'
    );

    showToast(
      ok
        ? 'UltraWide diagnostics downloaded'
        : 'Diagnostics download failed'
    );

    return ok;
  }

  function createBugReport() {
    const diagnostics = getDiagnostics();
    const health = diagnostics.health;
    const compatibility = diagnostics.compatibility;
    const state = diagnostics.state;

    return [
      `# ${PRODUCT_NAME} Bug Report`,
      '',
      '## Summary',
      '- What happened:',
      '- What you expected:',
      '- Steps to reproduce:',
      '',
      '## Environment',
      `- Version: ${diagnostics.version}`,
      `- URL: ${diagnostics.document.url}`,
      `- User agent: ${diagnostics.userAgent}`,
      `- Viewport: ${diagnostics.viewport.width}x${diagnostics.viewport.height}`,
      `- Pane: ${diagnostics.pane.width}x${diagnostics.pane.height} (${diagnostics.pane.source})`,
      '',
      '## Layout State',
      `- Active wide: ${state.activeWide}`,
      `- Cap: ${state.cap}`,
      `- Turns: ${state.detectedTurns}/${state.rawTurnCandidates}`,
      `- Composer found: ${state.composerFound}`,
      `- Split view detected: ${state.canvasDetected}`,
      `- Safe fallback: ${state.safeFallbackActive}${state.safeFallbackReason ? ` (${state.safeFallbackReason})` : ''}`,
      '',
      '## Compatibility',
      `- Status: ${compatibility.status}`,
      `- Strategy: ${compatibility.strategy}`,
      `- Issues: ${compatibility.issues.length ? compatibility.issues.join(', ') : 'none'}`,
      '',
      '## Health',
      `- OK: ${health.ok}`,
      '```json',
      JSON.stringify(health.checks, null, 2),
      '```',
      '',
      '## Last Error',
      state.lastError || 'none'
    ].join('\n');
  }

  function downloadBugReport() {
    const ok = downloadTextFile(
      `ultrawide-bug-report-${Date.now()}.md`,
      createBugReport(),
      'text/markdown'
    );

    showToast(
      ok
        ? 'UltraWide bug report downloaded'
        : 'Bug report download failed'
    );

    return ok;
  }

  function getState() {
    return {
      name: PRODUCT_NAME,
      version: VERSION,
      started: runtime.started,
      href: runtime.href,

      enabled: settings.enabled,
      wide: settings.wide,
      activeWide: isWideActive(),
      left: settings.left,
      cap: settings.cap,

      effectivePaneWidth:
        getAdaptiveWidth(),
      effectivePaneHeight:
        runtime.effectivePaneHeight,
      paneObserved:
        Boolean(runtime.observedPane),
      paneResizeObserverAttached:
        Boolean(runtime.paneResizeObserver),
      paneResizeCount:
        runtime.paneResizeCount,
      lastPaneResizeAt:
        runtime.lastPaneResizeAt,

      compatibility:
        runtime.lastCompatibility ||
        evaluateCompatibility(),
      domCapabilities:
        runtime.lastCapabilities ||
        detectDomCapabilities(),

      auto: settings.auto,
      autoMinWidth:
        settings.autoMinWidth,
      disableOnTouch:
        settings.disableOnTouch,
      disableBelowHeight:
        settings.disableBelowHeight,

      gutterMin:
        settings.gutterMin,
      gutterVw:
        settings.gutterVw,
      gutterMax:
        settings.gutterMax,

      widenComposer:
        settings.widenComposer,
      safeMedia:
        settings.safeMedia,
      canvasSafeMode:
        settings.canvasSafeMode,

      canvasDetected:
        runtime.canvasDetected,
      transcriptRootDetected:
        Boolean(document.querySelector('[data-thread-user-message-navigation-content]')),
      conversationRootDetected:
        Boolean(document.querySelector('[data-thread-find-target="conversation"]')),
      composerRootDetected:
        Boolean(document.querySelector('#thread-bottom-container')),
      promptDetected:
        Boolean(document.querySelector('#prompt-textarea,[data-testid="prompt-textarea"]')),
      detectedTurns:
        runtime.lastTurnCount,
      rawTurnCandidates:
        runtime.lastRawTurnCount,
      planNoticeCandidates:
        runtime.lastPlanNoticeCandidateCount,
      lastScanAt:
        runtime.lastScanAt,
      lastScanDurationMs:
        runtime.lastScanDurationMs,
      averageScanDurationMs:
        runtime.measuredScanCount > 0
          ? runtime.totalScanDurationMs /
            runtime.measuredScanCount
          : 0,
      maxScanDurationMs:
        runtime.maxScanDurationMs,
      measuredScanCount:
        runtime.measuredScanCount,
      scanCount:
        runtime.scanCount,
      selectorHealth:
        getSelectorHealthSummary(),
      repairEffectiveness:
        getRepairEffectivenessMetrics(),
      performanceBudget:
        getPerformanceBudgetReport(),
      healthBreakdown:
        runtime.healthBreakdown ||
        calculateHealthScore().breakdown,
      runtimeEpoch:
        runtime.epoch,
      staleCallbacksBlocked:
        runtime.staleCallbackCount,
      reconcileInProgress:
        runtime.reconcileInProgress,
      reconcilePendingVerification:
        runtime.reconcilePendingVerification,
      reconcilePendingSince:
        runtime.reconcilePendingSince,
      queuedReconciliationRequests:
        runtime.queuedReconciliationRequestCount,
      queuedReconciliationRuns:
        runtime.queuedReconciliationRunCount,
      repairRequestCount:
        runtime.repairRequestCount,
      repairPassCount:
        runtime.repairPassCount,
      coalescedRepairCount:
        runtime.coalescedRepairCount,
      lastRepairAt:
        runtime.lastRepairAt,
      lastRepairReasons:
        [...runtime.lastRepairReasons],
      invariantFailureStreak:
        runtime.invariantFailureStreak,
      enforcementCheckCount:
        runtime.enforcementCheckCount,
      enforcementRepairCount:
        runtime.enforcementRepairCount,
      enforcementRetryCount:
        runtime.enforcementRetryCount,
      lastEnforcementAt:
        runtime.lastEnforcementAt,
      lastEnforcementRepairAt:
        runtime.lastEnforcementRepairAt,
      lastEnforcementFailures:
        [...runtime.lastEnforcementFailures],
      enforcementTimerActive:
        Boolean(runtime.enforcementTimer),
      rootObserverAttached:
        Boolean(runtime.rootObserver),
      invariants:
        runtime.lastInvariants,
      safeFallbackActive:
        runtime.safeFallbackActive,
      safeFallbackReason:
        runtime.safeFallbackReason,
      mutationBatchCount:
        runtime.mutationBatchCount,
      lastMutationAt:
        runtime.lastMutationAt,
      lastRouteChangeAt:
        runtime.lastRouteChangeAt,
      deferredScan:
        runtime.deferredScan,
      pauseWhenHidden:
        settings.pauseWhenHidden,
      performanceTelemetry:
        settings.performanceTelemetry,
      debugOverlay:
        settings.debugOverlay,
      lastError:
        runtime.lastError,
      storageAvailable:
        runtime.storageAvailable,
      lastSavedAt:
        runtime.lastSavedAt,
      instanceStartedAt:
        runtime.instanceStartedAt,

      markedTurns:
        runtime.marked
          .get(ATTR.turn)
          ?.size || 0,

      conversationRootFound:
        (
          runtime.marked
            .get(
              ATTR.conversationRoot
            )
            ?.size || 0
        ) > 0,

      composerFound:
        (
          runtime.marked
            .get(ATTR.composer)
            ?.size || 0
        ) > 0,

      styleMounted:
        Boolean(
          document.getElementById(
            ID.style
          )
        ),

      bodyObserverAttached:
        Boolean(
          runtime.bodyObserver
        ),

      headObserverAttached:
        Boolean(
          runtime.headObserver
        )
    };
  }

  function start() {
    if (runtime.started) {
      return;
    }

    cleanupLegacyArtifacts();
    loadSettings();

    runtime.epoch += 1;
    runtime.started = true;
    runtime.instanceStartedAt = Date.now();
    runtime.href = location.href;
    runtime.safeFallbackActive = false;
    runtime.safeFallbackReason = '';
    runtime.invariantFailureStreak = 0;
    runtime.enforcementLevel = 0;
    runtime.stableWatchdogPasses = 0;
    runtime.repairHistory = [];
    runtime.lastRepairPlan = null;
    runtime.lastRepairPlanResult = null;
    runtime.convergenceSignature = '';
    runtime.convergencePreviousFailureCount = 0;
    runtime.convergenceStallCount = 0;
    runtime.lastConvergence = null;
    runtime.strategySelection = null;
    runtime.lastMutationAttribution = null;
    runtime.reconcileInProgress = false;
    runtime.reconcilePendingVerification = false;
    runtime.reconcilePendingSince = 0;
    runtime.queuedReconciliationReasons.clear();
    runtime.queuedReconciliationRequestCount = 0;
    runtime.queuedReconciliationRunCount = 0;
    runtime.reconcileLockContentionCount = 0;
    runtime.selectorHealth.clear();
    runtime.lastSelectorHealthAt = 0;
    runtime.performanceBudgetState.clear();
    pushDebugEvent('runtime-start', {
      href: runtime.href
    });

    installHistoryHooks();
    installObservers();
    attachPaneResizeObserver();
    bindEvents();
    registerMenus();
    restartTimers();

    ensureStyle(
      ID.uiStyle,
      getUiCss()
    );

    applyStyles();
    updateDomFingerprint('start');
    calculateHealthScore();
  }

  function stop() {
    if (!runtime.started) {
      return;
    }

    pushDebugEvent('runtime-stop');
    runtime.epoch += 1;
    runtime.started = false;

    cancelScheduledScan();

    if (runtime.queuedReconciliationFrame) {
      cancelNextFrame(
        runtime.queuedReconciliationFrame
      );
      runtime.queuedReconciliationFrame = 0;
    }

    runtime.reconcileInProgress = false;
    runtime.reconcilePendingVerification = false;
    runtime.reconcilePendingSince = 0;
    runtime.queuedReconciliationReasons.clear();
    runtime.pendingRepairReasons.clear();
    runtime.pendingDirtyRegions.clear();

    if (runtime.repairTimer) {
      clearInterval(
        runtime.repairTimer
      );
    }

    if (runtime.routeTimer) {
      clearInterval(
        runtime.routeTimer
      );
    }

    if (runtime.enforcementTimer) {
      clearTimeout(
        runtime.enforcementTimer
      );
    }

    if (runtime.routeDelayTimer) {
      clearTimeout(
        runtime.routeDelayTimer
      );
    }

    if (runtime.toastTimer) {
      clearTimeout(
        runtime.toastTimer
      );
    }

    runtime.repairTimer = 0;
    runtime.routeTimer = 0;
    runtime.enforcementTimer = 0;
    runtime.routeDelayTimer = 0;
    runtime.toastTimer = 0;

    unbindEvents();
    disconnectObservers();
    restoreHistoryHooks();
    unregisterMenus();

    clearManagedMarkers();
    clearRootState();

    removeMainStyle();
    removeUiStyle();
    removeById(ID.toast);
    removeById(ID.debugOverlay);
    closeSettings({
      reloadIfChanged: false
    });
  }

  function restart() {
    stop();
    start();
  }

  function installApi() {
    try {
      const previous =
        window.__mlUltraWide;

      if (
        previous &&
        typeof previous.stop === 'function'
      ) {
        try {
          previous.stop();
        } catch (_) {}
      }

      Object.defineProperty(
        window,
        '__mlUltraWide',
        {
          configurable: true,
          value: Object.freeze({
            name: PRODUCT_NAME,
            version: VERSION,

            start,
            stop,
            restart,

            apply: applyStyles,
            scan: () =>
              scheduleScan(true),
            repair,

            set: setOptions,
            reset: resetSettings,
            state: getState,
            diagnostics: getDiagnostics,
            capabilities: detectDomCapabilities,
            verify: verifyRuntime,
            enforce: () =>
              enforceRuntimeIntegrity('api'),
            reconcile: () =>
              reconcileDesiredState('api'),
            selfTest,
            regressionTest,
            health: calculateHealthScore,
            healthBreakdown: getHealthBreakdown,
            selectorHealth: () =>
              getSelectorHealthSummary(true),
            repairEffectiveness:
              getRepairEffectivenessMetrics,
            performanceBudget:
              getPerformanceBudgetReport,
            repairHistory: () => [
              ...runtime.repairHistory
            ],
            strategy: () =>
              runtime.strategySelection ||
              selectDomStrategy(
                runtime.lastCapabilities || detectDomCapabilities()
              ),
            repairPlan: () =>
              runtime.lastRepairPlan,
            failureCodes: () => ({
              ...FAILURE_CODE
            }),
            convergence: () =>
              runtime.lastConvergence,
            lifecycleTortureSelfTest,
            fingerprint: () =>
              updateDomFingerprint('api'),
            invariants: evaluateLayoutInvariants,
            debugEvents: () => [
              ...runtime.debugEvents
            ],
            clearSafeFallback: () => {
              const cleared =
                clearSafeFallback('api');

              requestRepair(
                'safe-fallback-clear',
                ALL_DIRTY_REGIONS,
                true
              );

              return cleared;
            },
            copyDiagnostics,
            downloadDiagnostics,
            downloadBugReport,

            caps: () => [
              ...CAPS
            ],

            openSettings,
            closeSettings
          })
        }
      );
    } catch (_) {}
  }

  installApi();
  start();
})();
