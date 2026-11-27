// ==UserScript==
// @name         🖥️ UltraWide ChatGPT
// @namespace    https://www.instagram.com/jsm.ig/
// @version      2026.11.27.1
// @author       jsmdev
// @description  ✨ Make ChatGPT better on any screen! Enjoy wider chats, adjustable layouts, easier reading, smooth scrolling, and more room to work.
// @license      JSM-Custom-1.1
// @match        https://chatgpt.com/*
// @match        https://www.chatgpt.com/*
// @icon         https://raw.githubusercontent.com/jsmlabs/ultrawide-chatgpt/master/assets/ultrawide-icon.png
// @run-at       document-start
// @noframes
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        unsafeWindow
// ==/UserScript==

/*
  UltraWide ChatGPT
  Version: 2026.11.27.1
  --------------------------------------------------------------------------
  November 27, 2026 - Preserve native user attachment geometry
  --------------------------------------------------------------------------
  - Scope Safe Media image, video, iframe and figure overrides to assistant content.
  - Preserve native user attachment dimensions, aspect ratios and reserved layout space.
  --------------------------------------------------------------------------
  November 20, 2026 - Scroll ownership and editor-input hardening
  --------------------------------------------------------------------------
  - Preserve real horizontal scroll controls in composer ancestor scrollports.
  - Do not hide previously guarded bars when their scroll owner becomes active.
  - Exclude hidden/inert suggestion portals from @ menu recovery.
  - Avoid layout churn during IME text composition.

  November 20, 2026 - Further scroll and focus lifecycle hardening
  --------------------------------------------------------------------------
  - Scope cosmetic scrollbar hiding strictly to active @ mentions.
  - Preserve native horizontal scrolling outside mention mode.
  - Release stale scroll guards on focus transitions to other editors.
  - Prefer the currently focused composer input in multi-editor layouts.
  - Improve menu-owner selection and skip repairs for unfocused composers.
  - Add focused deterministic regression checks for candidate eligibility.

  Community contribution: petrt3522 (Greasy Fork, October 29, 2026)
  https://greasyfork.org/scripts/557270-ultrawide-chatgpt/discussions/342892
  Integration: adaptation and hardening by jsmdev. Thanks to petrt3522
  for investigating, documenting and sharing the original improvements.
  Fork modifications supplied with the MIT license statement; preserve
  attribution and consult repository LICENSE for official distribution terms.

  November 20, 2026 - Scroll preservation and popup hardening
  --------------------------------------------------------------------------
  - Preserve real horizontal composer scrolling; suppress only empty tracks.
  - Never hide a portal element from hit-test geometry alone.
  - Stop overriding document body overflow, preserving ChatGPT scroll ownership.
  - Prefer nearby suggestion menus; avoid releasing actual scroll containers.
  - Leave a collapsed menu native when viewport space is insufficient.
  - Do not auto-update a local patched build from the upstream script.

  November 20, 2026 - Caret and scroll-area ownership hardening
   --------------------------------------------------------------------------
   - Detect mentions at the current caret, not only at the end of the draft.
   - Prefer the actually focused composer in split/Work layouts.
   - Preserve Radix-style horizontal scrollbar controls whose scroll viewport
     is a sibling rather than an ancestor of the scrollbar widget.
   - Avoid unclipping containers with embedded scroll-area viewports.
   - Preserve the last cleared-state diagnostic for regression triage.

  November 19, 2026 - Four-pass stability audit
  --------------------------------------------------------------------------
  - Select the @ suggestion menu by input geometry rather than document order.
  - Support collapsed 0-height menus without capturing hidden menus elsewhere.
  - Limit ancestor unclipping to elements that actually intersect placement.
  - Never mistake generic thin UI elements for horizontal scrollbars.
  - Guard only empty native scroll tracks; preserve real horizontal scrolling.
  - Extend browser regression coverage for menu selection and cleanup.

  November 19, 2026 - Sixth fix: targeted @-suggestion popup recovery
  --------------------------------------------------------------------------
  - Identify the actual suggestionMenu/composer-home-top-menu component;
    its lower rounded edge can resemble a horizontal scrollbar when clipped.
  - Correct only off-screen, misplaced or ancestor-clipped @-suggestion menus.
  - Preserve normal menu placement, vertical list scrolling, item clicks,
    focus, the Work composer, and transcript width.
  - Restore original inline properties on close, stop and disable.
  - Extend read-only diagnostics with suggestion-popup geometry and repairs.

  November 19, 2026 - Fifth fix: native scrollbar and DOM hit-testing
  --------------------------------------------------------------------------
  - Handle the observed case where @ is active, but the old diagnostic reports
    zero guarded scrollports and zero visual scrollbar elements.
  - While an @ mention is active, suppress native horizontal scrollbar tracks
    in bounded composer-only scopes without disabling horizontal scrolling.
  - Extend element detection with sampled hit-testing directly beneath the
    composer, including elements with data-testid outside its wrapper subtree.
  - Preserve visible suggestion menus, dialogs, buttons and text editors.
  - Expose elementFromPoint/ancestor geometry in the CSP-safe diagnostic bridge;
    all temporary attributes are restored on input clear, stop, and disable.

  November 19, 2026 - Fourth fix: visible mention bar and diagnostics
  --------------------------------------------------------------------------
  - Detect a thin, full-width, textless horizontal bar rendered immediately
    beneath an active @-mention composer, even when it is not scrollable and
    has no scrollbar role or standard overflow class.
  - Bound candidate discovery to the local composer and adjacent siblings;
    never scan or clip the transcript, mention popup, input, or other editors.
  - Retain intentionally hidden bar markers while mention input remains
    active; cleanly remove all guards on input change, disable, and stop.
  - Publish the console API via unsafeWindow when available. Keep the
    existing private script API and offer a CSP-safe DOM-event fallback.
  - Return actionable read-only geometry for DOM diagnosis.

  November 19, 2026 - Third fix: inner and subpixel scrollports
  --------------------------------------------------------------------------
  - Check every narrow composer ancestor, including form and input wrappers.
  - Detect 1px overflow and overflow-x:scroll even with no excess width.
  - Include scoped narrow horizontal scrollbar widgets beside the composer.
  - Keep editors, mention popups, transcript, and full-page scrolling intact.
  - Expose composerOverflow() for read-only live DOM diagnostics.

  November 19, 2026 - Follow-up: mention-triggered composer scrollbar
  --------------------------------------------------------------------------
  - Contain overflow in the actual narrow parent scrollport, not just the form.
  - Re-audit after @-mention input/React updates without scanning the page.
  - Do not clip popovers or other composer surfaces without an overflow fault.
  - Restore temporary guards on disable, navigation, and shutdown.
  - Fix a later canonical-composer rule overriding the local width bound.

  November 19, 2026 - Work composer horizontal overflow correction
  --------------------------------------------------------------------------
  - Keep the inherited thread width within the actual composer container.
  - Prevent a horizontal scrollbar under the independent Work composer.
  - Preserve wide transcript sizing, standard composer sizing and text inputs.
  - Add a focused CSS regression contract for the composer boundary.

  Retained community improvements vs. original 2026.10.13.1
  --------------------------------------------------------------------------
  - Sizes the transcript from the actual chat-pane width in CSS pixels;
    adapts to browser zoom, sidebar resizing, navigation, and DOM remounts.
  - Refines width, box-sizing, and max-width rules for conversation content
    while preserving safe responsive layout and existing inline values.
  - Corrects Work/Project thread positioning with scoped CSS overrides for
    the native --thread-content-x offset and clipping-container translation,
    avoiding competing JavaScript translations on the supported Work layout.
  - Retains reversible clipping-ancestor/transcript alignment as a fallback
    for other DOM structures; restores prior styles when disabled or stopped.
  - Verifies both width and actual on-screen position, detecting content
    clipped beyond the left or right edge of the main conversation pane.
  - Supports independently sized Work composers without false width failures;
    retains full-width checks for standard composer layouts.
  - Bounds repeated self-repair attempts on unchanged failures and resets
    retry guards when the pane geometry changes.
  - Refreshes stale DOM/selector health after delayed mounts; manual health
    checks use current DOM state rather than empty startup measurements.
  - Scores background performance by average time over budget, excluding
    manual self-test samples from the aggregate while retaining raw metrics.
  - Reduces background overhead through deferred full-health calculations,
    reusable clip-element lookup, and cheaper free-plan notice filtering.
  - Expands diagnostics for pane/clipping geometry, alignment mode, Work
    composer handling, repair-loop safeguards, and performance measurements.
  - Omits upstream auto-update URLs to protect this local compatibility fork.

  Original author changelog (2026.10.13.1) follows unchanged below.

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
  - Low-power mode reduces routine scans and watchdog/poll frequency without removing recovery
  - Memoizes short-lived DOM capability checks and avoids duplicate scans per repair pass
  - Skips structural rescans on ordinary streamed content inside already managed turns
  - Throttles unrelated free-plan-notice searches and caps diagnostic visibility sampling
  - Reduces needless large-subtree inspection on child-list mutations
  - Retains immediate repair of structural changes, manual checks, and diagnostics
  - Filters irrelevant head mutations to avoid unnecessary style integrity scans
  - Retains immediate detection for small new free-plan notices under throttling
  - Fixes disabled-state root attributes being resurrected by environment events
  - Honors the widenComposer toggle for global composer CSS variable overrides
  - Prevents animation-frame reconciliation spin while a scan is pending
  - Releases the reconciliation pending lock after a failed scan
  - Tracks internal mutation intents as consumable records to preserve external edits
  - Avoids disabled-state false-positive turn-marker invariant failures
  - Detects external deletion of managed DOM markers and restores them
  - Invalidation-aware CSS caching for the wide-composer setting
  - Adds focused regression checks for lifecycle, reconciliation, and mutation contracts
  - Fixes adaptive pane measurement when transcript roots are narrower than their chat pane
  - Preserves primary composer inputs when unrelated forms exceed the candidate limit
  - Renders the debug overlay without innerHTML for Trusted Types compatibility
  - Restores immediate observer initialization at document-start before root creation
  - Avoids reloading away unsaved settings when persistent storage fails

  Shortcuts
  - Alt+O  Enable/disable script
  - Alt+U  Enable/disable UltraWide
  - Alt+L  Enable/disable left alignment
  - Alt+M  Cycle maximum width
  - Alt+A  Enable/disable adaptive mode
  - Alt+C  Enable/disable split-view safe mode
  - Alt+S  Open settings
  - Alt+R  Reset settings

  Low-power mode (enabled by default)
  - Coalesces structural scans and avoids rescanning streamed message content
  - Limits routine repair/polling while retaining immediate DOM structural checks
  - Full diagnostics and manual repair remain available

  Console API
  - window.__mlUltraWide.state()
  - window.__mlUltraWide.diagnostics()
  - window.__mlUltraWide.capabilities()
  - window.__mlUltraWide.composerOverflow()
  - fallback (when page API is isolated):
    document.dispatchEvent(new Event('uwc:composer-debug'));
    JSON.parse(document.documentElement.getAttribute('data-uwc-composer-debug'));
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

  const VERSION = '2026.11.27.1';
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
    pane: 'data-uwc-pane',

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
    ATTR.pane,
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
    lowPowerMode: true,

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
    lowPowerCapabilityCacheMs: 1200,
    lowPowerSelectorHealthStaleMs: 30000,
    lowPowerNoticeThrottleMs: 15000,
    lowPowerScanDebounceMs: 550,
    lowPowerRepairIntervalMs: 30000,
    lowPowerRoutePollMs: 30000,
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
      'hidden',
      ...MANAGED_MARKERS
    ])
  });

  const COMPOSER_INPUT_TEST_IDS = [
    '[data-testid="prompt-textarea"]',
    '[data-testid="composer-input"]',
    '[data-testid="composer:input"]'
  ].join(',');
  const PRIMARY_COMPOSER_INPUT = `#prompt-textarea,${COMPOSER_INPUT_TEST_IDS}`;
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
      PRIMARY_COMPOSER_INPUT,
      'form[data-type="unified-composer"] textarea',
      'form[data-type="unified-composer"] [contenteditable="true"]',
      'form[data-type="unified-composer"] [role="textbox"]',
      ':is(main,[role="main"]) form textarea',
      ':is(main,[role="main"]) form [contenteditable="true"][role="textbox"]'
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
      '[data-testid="document-editor"]',
      '[data-testid^="document-editor-"]',
      '[data-testid="spreadsheet-editor"]',
      '[data-testid^="spreadsheet-editor-"]',
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

  // A 1.1ms watchdog and a 28ms watchdog must not be treated as equally bad.
  // The raw original-author budget thresholds remain visible in diagnostics.
  // One frame (16ms) of *average excess* per background operation is the
  // severity scale for the user-facing performance-health score.
  const PERFORMANCE_SCORE_EXCESS_SCALE_MS = 16;

  function performanceScoreFromExcess(excessMs, samples) {
    const count = Math.max(0, Number(samples) || 0);
    if (!count) return 100; // No measured violation evidence yet.
    const averageExcess = Math.max(0, Number(excessMs) || 0) / count;
    return Math.round(Math.max(0, Math.min(100,
      100 * (1 - averageExcess / PERFORMANCE_SCORE_EXCESS_SCALE_MS)
    )));
  }

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
    MARKER_ATTRIBUTE_DRIFT: 'MARKER_ATTRIBUTE_DRIFT',
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
    composerScrollGuardNodes: new Set(),
    composerVisualScrollbarNodes: new Set(),
    composerMentionScrollbarScopeNodes: new Set(),
    composerScrollGuardInitialOverflow: new WeakMap(),
    composerScrollGuardFrame: 0,
    composerScrollGuardTimer: 0,
    composerScrollGuardLateTimer: 0,
    composerScrollGuardLastAudit: null,
    mentionPopupNode: null,
    mentionPopupOriginalStyle: new Map(),
    mentionPopupClipNodes: new Set(),
    mentionPopupLastAudit: null,

    canvasDetected: false,
    effectivePaneWidth: 0,
    effectivePaneHeight: 0,
    sizedPane: null,
    sizedPanePriorValue: '',
    sizedPanePriorPriority: '',
    sizedPaneAppliedValue: '',
    clipAlignmentNode: null,
    clipAlignmentPrevious: '',
    clipAlignmentPreviousPriority: '',
    clipAlignmentShift: 0,
    clipAlignmentApplied: '',
    clipThreadNode: null,
    clipThreadPrevious: '',
    clipThreadPreviousPriority: '',
    clipThreadShift: 0,
    clipThreadApplied: '',
    clipAlignmentFrame: 0,
    clipAlignmentTimer: 0,
    clipAlignmentLastMutationCheck: 0,
    clipAlignmentLockSignature: '',
    clipAlignmentLockThread: null,
    clipAlignmentLockCount: 0,
    clipAlignmentLockChecks: 0,
    clipAlignmentLockDrifts: 0,
    clipAlignmentInfo: null,
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
    healthSnapshotDirty: false,
    watchdogHealthDeferrals: 0,
    selectorHealth: new Map(),
    lastSelectorHealthAt: 0,
    lastCapabilitiesAt: 0,
    lastPlanNoticeScanAt: 0,
    skippedContentMutationBatches: 0,
    repairHistory: [],
    strategySelection: null,
    performanceBudgetState: new Map(),
    reconcileInProgress: false,
    reconcilePendingVerification: false,
    postScanFailureSignature: '',
    postScanSameFailureCount: 0,
    postScanRepairPaused: false,
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
    const visibilitySampleLimit = settings.lowPowerMode ? 16 : 200;

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
        nodes.slice(0, visibilitySampleLimit)
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
    // document-start runs before ChatGPT mounts its transcript. The initial
    // health snapshot may contain 0 hits even after a later DOM scan has
    // already detected the actual nodes. Never trust that stale mismatch.
    const capabilities = runtime.lastCapabilities;
    const cachedHit = (id) =>
      runtime.selectorHealth.get(id)?.hitCount || 0;
    const contradictedByCurrentDom = Boolean(
      capabilities && (
        (capabilities.mainPresent && !cachedHit('main')) ||
        (capabilities.transcriptRoot && !cachedHit('transcript-root')) ||
        (capabilities.conversationTarget && !cachedHit('conversation-target')) ||
        (capabilities.virtualizedTurns && !cachedHit('virtualized-turns')) ||
        (capabilities.fallbackTurns && !cachedHit('fallback-turns'))
      )
    );
    if (
      refresh ||
      contradictedByCurrentDom ||
      !runtime.lastSelectorHealthAt ||
      Date.now() - runtime.lastSelectorHealthAt >
        (settings.lowPowerMode
          ? CONFIG.lowPowerSelectorHealthStaleMs
          : CONFIG.selectorHealthStaleMs)
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

    const excessMs = Math.max(0, durationMs - budget);
    const next = {
      ...previous,
      budgetMs: budget,
      samples: previous.samples + 1,
      violations:
        previous.violations +
        (excessMs > 0 ? 1 : 0),
      overBudgetMs: (previous.overBudgetMs || 0) + excessMs,
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
      averageOverBudgetMs:
        next.samples > 0 ? next.overBudgetMs / next.samples : 0,
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
        overBudgetMs: state.overBudgetMs || 0,
        averageMs:
          state.samples > 0
            ? state.totalMs /
              state.samples
            : 0,
        averageOverBudgetMs:
          state.samples > 0
            ? (state.overBudgetMs || 0) / state.samples
            : 0,
        violationRate:
          state.samples > 0
            ? state.violations /
              state.samples
            : 0
      };
    }

    // Manual self-tests are explicitly diagnostic and must not increase the
    // background health score just by adding fast, successful samples.
    // Retain their counts and timing in operations for transparency.
    const sampled =
      Object.values(operations)
        .filter((item) =>
          item.samples > 0 && item.name !== 'selfTest'
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

    // Violation *frequency* overreacts to tiny overruns, especially with
    // only one or two startup samples. Grade by excess elapsed time instead.
    // No manual self-test samples contribute to either numerator or denominator.
    const totalOverBudgetMs = sampled.reduce(
      (sum, item) => sum + (item.overBudgetMs || 0), 0
    );
    const averageOverBudgetMs = totalSamples
      ? totalOverBudgetMs / totalSamples
      : 0;
    const score = performanceScoreFromExcess(
      totalOverBudgetMs, totalSamples
    );

    return {
      score,
      scoringMethod: 'average-over-budget-ms',
      scoreExcessScaleMs: PERFORMANCE_SCORE_EXCESS_SCALE_MS,
      dataAvailable: totalSamples > 0,
      totalOverBudgetMs,
      averageOverBudgetMs,
      status:
        score >= 90
          ? 'healthy'
          : score >= 70
            ? 'degraded'
            : 'unhealthy',
      totalSamples,
      totalViolations,
      excludedFromHealthScore: ['selfTest'],
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

    const key = mutationIntentKey(type, attributeName);
    const previous = intents.get(key);
    const now = Date.now();
    intents.set(key, {
      expiresAt: now + CONFIG.mutationIntentTtlMs,
      count: (previous && previous.expiresAt >= now ? previous.count : 0) + 1
    });
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
    const entry = intents.get(key);

    if (!entry || entry.expiresAt < now || entry.count <= 0) {
      intents.delete(key);
      return false;
    }

    // One script-originated operation accounts for one observer record.
    // Never suppress later external changes on the same node/attribute.
    entry.count -= 1;
    if (entry.count === 0) intents.delete(key);
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
      if (element?.isConnected && element.getAttribute(attribute) === '1') {
        return true;
      }
    }

    return false;
  }

  function hasMarkerAttributeDrift() {
    for (const [attribute, elements] of runtime.marked) {
      for (const element of elements) {
        if (element?.isConnected && element.getAttribute(attribute) !== '1') {
          return true;
        }
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

    output.lowPowerMode = normalizeBoolean(
      input.lowPowerMode,
      output.lowPowerMode
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
      ATTR.pane,
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
      PRIMARY_COMPOSER_INPUT,
      'form[data-type="unified-composer"]'
    ];

    for (const selector of selectors) {
      let anchor = null;

      try {
        anchor = Array.from(
          document.querySelectorAll(selector)
        ).find((element) =>
          !element.closest(SELECTOR.excludedComposerAncestor) &&
          isVisibleElement(element)
        ) || null;
      } catch (_) {}

      if (!anchor) {
        continue;
      }

      // Prefer the actual pane: semantic transcript roots may be much narrower
      // than their containing main and must not determine adaptive activation.
      const main =
        anchor.closest?.('main,[role="main"]') ||
        nearestMain(anchor) ||
        null;

      if (isVisibleElement(main)) {
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
      const mains = Array.from(
        document.querySelectorAll(
          'main,[role="main"]'
        )
      ).filter((element) =>
        !element.closest(SELECTOR.excludedComposerAncestor) &&
        isVisibleElement(element)
      );
      const conversation = `${SELECTOR.preferredTurns},${SELECTOR.fallbackMessages}`;
      return mains.find((element) => Array.from(element.querySelectorAll(conversation))
        .some((turn) => !turn.closest(SELECTOR.excludedComposerAncestor) && isVisibleElement(turn))) || null;
    } catch (_) {
      return null;
    }
  }

  // A pane owns its override only until another actor replaces it.
  // Always restore the previously existing inline declaration on cleanup.
  function restoreSizedPane() {
    const pane = runtime.sizedPane;
    if (pane?.style &&
        pane.style.getPropertyValue('--uwc-content-width') ===
          runtime.sizedPaneAppliedValue &&
        pane.style.getPropertyPriority('--uwc-content-width') === 'important') {
      markMutationIntent(pane, 'attributes', 'style');
      if (runtime.sizedPanePriorValue) {
        pane.style.setProperty('--uwc-content-width',
          runtime.sizedPanePriorValue, runtime.sizedPanePriorPriority);
      } else {
        pane.style.removeProperty('--uwc-content-width');
      }
    }
    runtime.sizedPane = null;
    runtime.sizedPanePriorValue = '';
    runtime.sizedPanePriorPriority = '';
    runtime.sizedPaneAppliedValue = '';
  }

  function clearSizedPane() {
    restoreSizedPane();
  }

  function syncSizedPane(pane = null, width = 0) {
    pane = pane || (runtime.observedPane?.isConnected
      ? runtime.observedPane : resolveActivePane());
    if (!pane || pane.isConnected === false || !pane.style || !settings.enabled ||
        !isWideActive() || runtime.safeFallbackActive) {
      restoreSizedPane();
      return false;
    }

    const measured = Number(width) > 0 ? Number(width) :
      Number(getVisibleRect(pane)?.width || 0);
    if (measured < 200 || !Number.isFinite(measured)) {
      restoreSizedPane();
      return false;
    }

    if (runtime.sizedPane !== pane) {
      restoreSizedPane();
      runtime.sizedPane = pane;
      runtime.sizedPanePriorValue =
        pane.style.getPropertyValue('--uwc-content-width');
      runtime.sizedPanePriorPriority =
        pane.style.getPropertyPriority('--uwc-content-width');
    }

    const target = String(Math.round(getExpectedContentWidthPx(measured) * 100) / 100) + 'px';
    if (pane.style.getPropertyValue('--uwc-content-width') !== target ||
        pane.style.getPropertyPriority('--uwc-content-width') !== 'important') {
      markMutationIntent(pane, 'attributes', 'style');
      pane.style.setProperty('--uwc-content-width', target, 'important');
    }
    runtime.sizedPaneAppliedValue = target;
    return true;
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
    syncSizedPane(pane, width);

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

  function detectDomCapabilities(force = false) {
    const now = Date.now();
    if (
      settings.lowPowerMode &&
      !force &&
      runtime.lastCapabilities &&
      now - runtime.lastCapabilitiesAt < CONFIG.lowPowerCapabilityCacheMs
    ) {
      return runtime.lastCapabilities;
    }

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
    runtime.lastCapabilitiesAt = now;

    if (
      !settings.lowPowerMode &&
      (!runtime.lastSelectorHealthAt ||
      Date.now() - runtime.lastSelectorHealthAt >
        CONFIG.selectorHealthStaleMs)
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
      !capabilities.threadBottomContainer &&
      !document.querySelector(SELECTOR.composerInput)
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

  // Keep the clip ancestor aligned to the pane AND its inner transcript
  // aligned inside that ancestor. Work can independently recenter either node
  // without changing the pane dimensions or triggering a ResizeObserver.
  function clearClipThreadAlignment() {
    const node = runtime.clipThreadNode;
    if (node?.style && node.style.getPropertyValue('translate') ===
        runtime.clipThreadApplied) {
      markMutationIntent(node, 'attributes', 'style');
      if (runtime.clipThreadPrevious) {
        node.style.setProperty('translate', runtime.clipThreadPrevious,
          runtime.clipThreadPreviousPriority);
      } else {
        node.style.removeProperty('translate');
      }
    }
    runtime.clipThreadNode = null;
    runtime.clipThreadPrevious = '';
    runtime.clipThreadPreviousPriority = '';
    runtime.clipThreadShift = 0;
    runtime.clipThreadApplied = '';
  }

  function clearClipAlignment() {
    if (runtime.clipAlignmentFrame) {
      cancelNextFrame(runtime.clipAlignmentFrame);
      runtime.clipAlignmentFrame = 0;
    }
    clearClipThreadAlignment();
    const node = runtime.clipAlignmentNode;
    if (node?.style && node.style.getPropertyValue('translate') ===
        runtime.clipAlignmentApplied) {
      markMutationIntent(node, 'attributes', 'style');
      if (runtime.clipAlignmentPrevious) {
        node.style.setProperty('translate',
          runtime.clipAlignmentPrevious,
          runtime.clipAlignmentPreviousPriority);
      } else {
        node.style.removeProperty('translate');
      }
    }
    runtime.clipAlignmentNode = null;
    runtime.clipAlignmentPrevious = '';
    runtime.clipAlignmentPreviousPriority = '';
    runtime.clipAlignmentShift = 0;
    runtime.clipAlignmentApplied = '';
    runtime.clipAlignmentLockSignature = '';
    runtime.clipAlignmentLockThread = null;
  }

  function findPaneClipAncestor(pane) {
    if (!pane) return null;
    const cached = runtime.clipAlignmentNode;
    if (cached?.isConnected && pane.contains(cached) &&
        getComputedStyle(cached).overflowX === 'clip' &&
        ((runtime.clipThreadNode?.isConnected &&
          cached.contains(runtime.clipThreadNode)) ||
         cached.querySelector('[data-thread-user-message-navigation-content]'))) {
      return cached;
    }
    const roots = Array.from(document.querySelectorAll(
      '[data-thread-user-message-navigation-content]'
    ));
    for (const thread of roots) {
      if (!pane.contains(thread) || !getVisibleRect(thread)) continue;
      for (let node = thread.parentElement;
           node && node !== pane;
           node = node.parentElement) {
        const bounds = getVisibleRect(node);
        if (!bounds) continue;
        if (getComputedStyle(node).overflowX === 'clip' &&
            bounds.width > 0.65 * pane.getBoundingClientRect().width) {
          return node;
        }
      }
    }
    return null;
  }

  function syncClipAlignment() {
    // Reuse the observed pane for inexpensive periodic checks. The observer
    // rebinds on route/pane changes and the cached node is validated below.
    let pane = runtime.observedPane?.isConnected
      ? runtime.observedPane : resolveActivePane();
    if (runtime.clipAlignmentNode?.isConnected && pane &&
        !pane.contains(runtime.clipAlignmentNode)) {
      pane = resolveActivePane();
    }
    const pr = getVisibleRect(pane);
    if (!runtime.started || !settings.enabled ||
        !isWideActive() || runtime.safeFallbackActive ||
        document.hidden || !pane || !pr) {
      if (!document.hidden || !settings.enabled || !runtime.started) {
        clearClipAlignment();
      }
      runtime.clipAlignmentInfo = {active:false,reason:'wide-mode-inactive-or-hidden'};
      return;
    }

    const clip = findPaneClipAncestor(pane);
    const cr = getVisibleRect(clip);
    if (!clip || !cr || cr.width > pr.width + 30) {
      clearClipAlignment();
      runtime.clipAlignmentInfo = {active:false,reason:'no-safe-clipping-container'};
      return;
    }

    // v10: This is the exact DOM and CSS offset mechanism captured in the
    // user's Work trace. The stylesheet above owns both the native variable
    // and the clipping element's translate. Writing another inline translate
    // here would REPLACE the native translate and produce a +/-154px flip.
    const nativeScroll = clip.parentElement;
    const nativeHost = nativeScroll?.parentElement;
    if (nativeScroll?.classList.contains('thread-scroll-container') &&
        nativeHost?.getAttribute('class')?.includes('group/thread-scroll-layout')) {
      // Clean up any old JS overrides if a former non-native layout remounted.
      if (runtime.clipAlignmentNode || runtime.clipThreadNode) clearClipAlignment();
      const fixedClip = getVisibleRect(clip);
      const fixedThread = getVisibleRect(clip.querySelector(
        '[data-thread-user-message-navigation-content]'
      ));
      runtime.clipAlignmentInfo = {
        active: false,
        mode: 'native-thread-offset-css',
        reason: 'CSS-normalized-native-thread-offset',
        clipShiftPx: 0,
        threadShiftPx: 0,
        shiftPx: 0,
        geometryLocked: false,
        paneLeft: +pr.left.toFixed(1),
        paneRight: +pr.right.toFixed(1),
        correctedClipLeft: fixedClip ? +fixedClip.left.toFixed(1) : null,
        correctedClipRight: fixedClip ? +fixedClip.right.toFixed(1) : null,
        threadLeft: fixedThread ? +fixedThread.left.toFixed(1) : null,
        threadRight: fixedThread ? +fixedThread.right.toFixed(1) : null,
        offscreenLeftPx: fixedThread ? Math.max(0, Math.round(pr.left - fixedThread.left)) : null,
        offscreenRightPx: fixedThread ? Math.max(0, Math.round(fixedThread.right - pr.right)) : null
      };
      return;
    }

    const threadProbe = (runtime.clipThreadNode?.isConnected &&
      clip.contains(runtime.clipThreadNode))
      ? runtime.clipThreadNode
      : clip.querySelector('[data-thread-user-message-navigation-content]');
    const lockSignature = [
      location.pathname,
      pr.left.toFixed(1), pr.width.toFixed(1), cr.width.toFixed(1)
    ].join('|');

    // Work's layout engine can react to our translations by relocating the
    // exact same elements with unchanged pane geometry. Chasing that state at
    // every timer/DOM callback produced visible left/right oscillation. After
    // a successful correction, freeze the applied translation until the pane
    // or the anchored DOM nodes truly change. Do NOT shift the node again
    // simply because a subsequent bounding-rect measurement changed.
    if (runtime.clipAlignmentNode && runtime.clipAlignmentApplied &&
        runtime.clipAlignmentNode.style.getPropertyValue('translate') !==
          runtime.clipAlignmentApplied) {
      clearClipAlignment();
    }
    if (runtime.clipAlignmentLockSignature === lockSignature &&
        runtime.clipAlignmentNode === clip &&
        runtime.clipAlignmentLockThread === threadProbe &&
        threadProbe?.isConnected) {
      runtime.clipAlignmentLockChecks++;
      const currentThread = getVisibleRect(threadProbe);
      const driftLeft = currentThread
        ? Math.max(0, Math.round(pr.left - currentThread.left)) : 0;
      const driftRight = currentThread
        ? Math.max(0, Math.round(currentThread.right - pr.right)) : 0;
      if (driftLeft > 8 || driftRight > 8) runtime.clipAlignmentLockDrifts++;
      runtime.clipAlignmentInfo = {
        ...(runtime.clipAlignmentInfo || {}),
        active: Boolean(runtime.clipAlignmentShift || runtime.clipThreadShift),
        clipShiftPx: runtime.clipAlignmentShift,
        threadShiftPx: runtime.clipThreadShift,
        shiftPx: runtime.clipAlignmentShift,
        geometryLocked: true,
        lockSignature,
        lockChecks: runtime.clipAlignmentLockChecks,
        lockDriftCount: runtime.clipAlignmentLockDrifts,
        paneLeft: +pr.left.toFixed(1),
        paneRight: +pr.right.toFixed(1),
        correctedClipLeft: +cr.left.toFixed(1),
        correctedClipRight: +cr.right.toFixed(1),
        threadLeft: currentThread ? +currentThread.left.toFixed(1) : null,
        threadRight: currentThread ? +currentThread.right.toFixed(1) : null,
        offscreenLeftPx: driftLeft,
        offscreenRightPx: driftRight
      };
      return;
    }
    runtime.clipAlignmentLockSignature = '';
    runtime.clipAlignmentLockThread = null;

    if (runtime.clipAlignmentNode !== clip) {
      clearClipAlignment();
      const prior = clip.style.getPropertyValue('translate');
      if ((prior && prior !== 'none') ||
          getComputedStyle(clip).translate !== 'none') {
        runtime.clipAlignmentInfo = {active:false,reason:'existing-clip-translate'};
        return;
      }
      runtime.clipAlignmentNode = clip;
      runtime.clipAlignmentPrevious = prior;
      runtime.clipAlignmentPreviousPriority =
        clip.style.getPropertyPriority('translate');
    }

    const naturalLeft = cr.left - runtime.clipAlignmentShift;
    const desiredLeft = pr.left + Math.max(0, (pr.width - cr.width) / 2);
    const shift = desiredLeft - naturalLeft;
    if (!Number.isFinite(shift) || Math.abs(shift) > pr.width * 0.6) {
      clearClipAlignment();
      runtime.clipAlignmentInfo = {active:false,reason:'excessive-clip-offset'};
      return;
    }

    const appliedShift = Math.abs(shift) > 10 ? Math.round(shift * 10) / 10 : 0;
    if (Math.abs(appliedShift - runtime.clipAlignmentShift) >= 0.2) {
      markMutationIntent(clip, 'attributes', 'style');
      if (appliedShift) {
        clip.style.setProperty('translate', `${appliedShift}px 0px`, 'important');
      } else if (runtime.clipAlignmentPrevious) {
        clip.style.setProperty('translate', runtime.clipAlignmentPrevious,
          runtime.clipAlignmentPreviousPriority);
      } else {
        clip.style.removeProperty('translate');
      }
      runtime.clipAlignmentShift = appliedShift;
      runtime.clipAlignmentApplied = clip.style.getPropertyValue('translate');
    }

    const adjustedClip = getVisibleRect(clip);
    const thread = (runtime.clipThreadNode?.isConnected &&
      clip.contains(runtime.clipThreadNode))
      ? runtime.clipThreadNode
      : clip.querySelector('[data-thread-user-message-navigation-content]');
    if (runtime.clipThreadNode && runtime.clipThreadNode !== thread) {
      clearClipThreadAlignment();
    }
    let threadRect = getVisibleRect(thread);
    let innerReason = '';
    if (threadRect && adjustedClip &&
        threadRect.width <= adjustedClip.width + 8 &&
        threadRect.width >= adjustedClip.width * 0.50) {
      if (runtime.clipThreadNode !== thread) {
        const prior = thread.style.getPropertyValue('translate');
        if ((prior && prior !== 'none') ||
            getComputedStyle(thread).translate !== 'none') {
          innerReason = 'existing-thread-translate';
        } else {
          runtime.clipThreadNode = thread;
          runtime.clipThreadPrevious = prior;
          runtime.clipThreadPreviousPriority =
            thread.style.getPropertyPriority('translate');
        }
      }
      if (runtime.clipThreadNode === thread) {
        // Its current bounds already include any previous script translation.
        // Compensate for native Work layout shifts independently from the clip.
        const unshiftedThreadLeft = threadRect.left - runtime.clipThreadShift;
        const centeredThreadLeft = adjustedClip.left +
          Math.max(0, (adjustedClip.width - threadRect.width) / 2);
        const needed = centeredThreadLeft - unshiftedThreadLeft;
        if (Number.isFinite(needed) && Math.abs(needed) <= pr.width * 0.6) {
          const nextShift = Math.abs(needed) > 10
            ? Math.round(needed * 10) / 10 : 0;
          if (Math.abs(nextShift - runtime.clipThreadShift) >= 0.2) {
            markMutationIntent(thread, 'attributes', 'style');
            if (nextShift) {
              thread.style.setProperty('translate', `${nextShift}px 0px`, 'important');
            } else if (runtime.clipThreadPrevious) {
              thread.style.setProperty('translate', runtime.clipThreadPrevious,
                runtime.clipThreadPreviousPriority);
            } else {
              thread.style.removeProperty('translate');
            }
            runtime.clipThreadShift = nextShift;
            runtime.clipThreadApplied = thread.style.getPropertyValue('translate');
          }
          threadRect = getVisibleRect(thread);
        } else {
          innerReason = 'excessive-thread-offset';
          clearClipThreadAlignment();
        }
      }
    } else {
      innerReason = !threadRect ? 'no-visible-thread' : 'incompatible-thread-width';
      clearClipThreadAlignment();
    }

    const outerAligned = adjustedClip &&
      adjustedClip.left >= pr.left - 8 &&
      adjustedClip.right <= pr.right + 8;
    const innerAligned = adjustedClip && threadRect &&
      threadRect.left >= Math.max(pr.left, adjustedClip.left) - 8 &&
      threadRect.right <= Math.min(pr.right, adjustedClip.right) + 8;
    if (outerAligned && innerAligned && thread?.isConnected) {
      runtime.clipAlignmentLockSignature = lockSignature;
      runtime.clipAlignmentLockThread = thread;
      runtime.clipAlignmentLockCount++;
    }
    runtime.clipAlignmentInfo = {
      active: Boolean(appliedShift || runtime.clipThreadShift),
      geometryLocked: Boolean(runtime.clipAlignmentLockSignature),
      lockSignature: runtime.clipAlignmentLockSignature,
      lockCount: runtime.clipAlignmentLockCount,
      shiftPx: appliedShift, // Backward-compatible outer shift field.
      clipShiftPx: appliedShift,
      threadShiftPx: runtime.clipThreadShift,
      innerReason,
      paneLeft: +pr.left.toFixed(1),
      paneRight: +pr.right.toFixed(1),
      clipWidth: +cr.width.toFixed(1),
      correctedClipLeft: adjustedClip ? +adjustedClip.left.toFixed(1) : null,
      correctedClipRight: adjustedClip ? +adjustedClip.right.toFixed(1) : null,
      threadLeft: threadRect ? +threadRect.left.toFixed(1) : null,
      threadRight: threadRect ? +threadRect.right.toFixed(1) : null,
      threadBeyondClipLeft: adjustedClip && threadRect
        ? Math.max(0, Math.round(adjustedClip.left - threadRect.left)) : null,
      threadBeyondClipRight: adjustedClip && threadRect
        ? Math.max(0, Math.round(threadRect.right - adjustedClip.right)) : null
    };
  }

  function scheduleClipAlignment() {
    if (!runtime.started || runtime.clipAlignmentFrame) return;
    const epoch = currentRuntimeEpoch();
    runtime.clipAlignmentFrame = requestNextFrame(() => {
      runtime.clipAlignmentFrame = 0;
      if (!rejectStaleCallback(epoch, 'clip-alignment')) {
        syncClipAlignment();
      }
    });
  }

  // v9: No periodic alignment timer. Work may measure/rewrite its own layout
  // after an inline translation; polling that translation caused a feedback
  // loop roughly once per second. DOM/route/resize events remain supported.
  function startClipAlignmentTimer() {
    if (runtime.clipAlignmentTimer) {
      clearInterval(runtime.clipAlignmentTimer);
      runtime.clipAlignmentTimer = 0;
    }
  }

  function onPaneResize(entries) {
    const entry = entries?.[0];

    if (!entry || entry.target !== runtime.observedPane) {
      return;
    }

    const rect =
      getVisibleRect(entry.target) ||
      entry.contentRect;

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
    syncSizedPane(runtime.observedPane, width);
    runtime.lastPaneResizeAt = Date.now();
    runtime.paneResizeCount += 1;
    scheduleClipAlignment();

    if (!changed || !runtime.started) {
      return;
    }

    // A genuinely different pane size is fresh evidence: allow bounded repair.
    runtime.postScanFailureSignature = '';
    runtime.postScanSameFailureCount = 0;
    runtime.postScanRepairPaused = false;

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

  function attachPaneResizeObserver(pane = resolveActivePane()) {
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
    clearSizedPane();
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
      ).some((element) =>
        !element.closest(`[role="dialog"],[aria-modal="true"],${SELECTOR.preferredTurns},${SELECTOR.fallbackMessages}`) &&
        isVisibleElement(element)
      );
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

    const managedTurn = `[${ATTR.turn}="1"]`;
    const pane = `[${ATTR.pane}="1"]`;
    const inPane = `:is(${pane},${pane} *)`;
    const assistantMessage = ':is([data-markdown-text-style="assistant-message"],[data-message-author-role="assistant"])';
    const assistantTurn = `:is(${managedTurn}${assistantMessage},${managedTurn} ${assistantMessage})`;
    const tableContainer = '[class*="TableContainer-"]';
    const tableScroller = '[class*="TableScroller-"]';
    const structuredTableScroller = `${assistantTurn} ${tableContainer} > ${tableScroller}`;

    // User attachments reserve their own native thumbnail geometry. Never
    // override their dimensions: intrinsic portrait images can escape the slot.
    const safeMediaCss = settings.safeMedia
      ? `
:root[${ATTR.enabled}="1"][${ATTR.wide}="1"]
${assistantTurn} img,
:root[${ATTR.enabled}="1"][${ATTR.wide}="1"]
${assistantTurn} video,
:root[${ATTR.enabled}="1"][${ATTR.wide}="1"]
${assistantTurn} iframe,
:root[${ATTR.enabled}="1"][${ATTR.wide}="1"]
${assistantTurn} figure{
  max-width:100%!important;
  box-sizing:border-box!important;
}

:root[${ATTR.enabled}="1"][${ATTR.wide}="1"]
${assistantTurn} img,
:root[${ATTR.enabled}="1"][${ATTR.wide}="1"]
${assistantTurn} video{
  height:auto!important;
}

:root[${ATTR.enabled}="1"][${ATTR.wide}="1"]
[${ATTR.turn}="1"] pre{
  max-width:100%!important;
  overflow-x:auto!important;
}

:root[${ATTR.enabled}="1"][${ATTR.wide}="1"]
${managedTurn} table:not(:where(${structuredTableScroller} table)){
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

/* Do not override body overflow: ChatGPT controls document and overlay scrolling. */

/*
 * ChatGPT's newer Work/Project transcript uses --thread-content-x on its
 * scroll-layout host to translate the inner overflow-clipping container.
 * Its native value may be -half the sidebar width, even though the scroll
 * viewport is already pane-relative. Correct the SOURCE of that offset.
 * The explicit clip translate override also protects against native rules
 * that do not use the custom property. In particular, never add a JS
 * translate to a container that already has this native translate.
 * Limit these rules to the observed current Work structure and wide mode.
 */
:root[${ATTR.enabled}="1"][${ATTR.wide}="1"]
${inPane}[class*="group/thread-scroll-layout"]{
  --thread-content-x:0px!important;
}

:root[${ATTR.enabled}="1"][${ATTR.wide}="1"]
${inPane}[class*="group/thread-scroll-layout"]
.thread-scroll-container > [class*="container-type:inline-size"]{
  translate:none!important;
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
   Applying them at the active pane keeps sizing pane-relative when React
   changes intermediate wrappers or utility-class names. */
:root[${ATTR.enabled}="1"][${ATTR.wide}="1"] ${pane}{
  --thread-content-responsive-max-width:var(--uwc-content-width)!important;
  --thread-content-max-width:var(--uwc-content-width)!important;
  --thread-body-max-width:calc(
    var(--thread-content-max-width) +
    (var(--thread-body-inline-padding,0px) * 2)
  )!important;
  min-width:0!important;
}

:root[${ATTR.enabled}="1"][${ATTR.wide}="1"]
${inPane}[data-thread-user-message-navigation-content]{
  --thread-content-responsive-max-width:var(--uwc-content-width)!important;
  --thread-content-max-width:var(--uwc-content-width)!important;
  --thread-body-max-width:calc(
    var(--thread-content-max-width) +
    (var(--thread-body-inline-padding,0px) * 2)
  )!important;
  width:100%!important;
  max-width:min(100%,var(--thread-body-max-width))!important;
  min-width:0!important;
  margin-inline:auto!important;
  box-sizing:border-box!important;
}

/* Conversation content inherits the transcript variables even when React
   virtualizes and remounts individual turns. */
:root[${ATTR.enabled}="1"][${ATTR.wide}="1"]
${inPane}[data-thread-find-target="conversation"]{
  --thread-content-responsive-max-width:var(--uwc-content-width)!important;
  --thread-content-max-width:var(--uwc-content-width)!important;
  --thread-body-max-width:calc(
    var(--thread-content-max-width) +
    (var(--thread-body-inline-padding,0px) * 2)
  )!important;
  width:100%!important;
  max-width:100%!important;
  min-width:0!important;
  box-sizing:border-box!important;
}

/* Any current width wrapper that redefines the same variables is normalized
   back to the UltraWide width. Variable names are stable semantic anchors and
   avoid dependency on generated hash classes. */
:root[${ATTR.enabled}="1"][${ATTR.wide}="1"]
${inPane}[data-thread-user-message-navigation-content] [class*="thread-content-max-width"],
:root[${ATTR.enabled}="1"][${ATTR.wide}="1"]
${inPane}[data-thread-user-message-navigation-content] [class*="thread-body-max-width"]{
  --thread-content-responsive-max-width:var(--uwc-content-width)!important;
  --thread-content-max-width:var(--uwc-content-width)!important;
  --thread-body-max-width:calc(
    var(--thread-content-max-width) +
    (var(--thread-body-inline-padding,0px) * 2)
  )!important;
}

${settings.widenComposer ? `
/* The transcript can be ~2000px wide while the Work composer remains
   an independent ~600px surface. Never inherit the pane-wide pixel value as
   an unbounded inner composer width: it makes compact Work inputs scroll
   horizontally. Resolve the thread-width chain against the LOCAL containing
   block and leave the transcript width unchanged. */
:root[${ATTR.enabled}="1"][${ATTR.wide}="1"]
${inPane}#thread-bottom-container,
:root[${ATTR.enabled}="1"][${ATTR.wide}="1"]
${inPane}[${ATTR.composer}="1"]{
  --thread-content-responsive-max-width:min(100%,var(--uwc-content-width))!important;
  --thread-content-max-width:min(100%,var(--uwc-content-width))!important;
  --thread-body-max-width:min(100%,var(--uwc-content-width))!important;
  min-width:0!important;
  max-width:100%!important;
  box-sizing:border-box!important;
}

/* The canonical bottom container is full-width only inside its own parent.
   Avoid max-width:none: a compact Work bottom area must remain bounded. */
:root[${ATTR.enabled}="1"][${ATTR.wide}="1"]
${inPane}#thread-bottom-container{
  width:100%!important;
  max-width:100%!important;
}

/* Prevent descendants with a native thread-width utility from reintroducing
   the pane's much larger width or a horizontal scrollport. */
:root[${ATTR.enabled}="1"][${ATTR.wide}="1"]
${inPane}#thread-bottom-container [class*="thread-content-max-width"],
:root[${ATTR.enabled}="1"][${ATTR.wide}="1"]
${inPane}#thread-bottom-container [class*="thread-body-max-width"],
:root[${ATTR.enabled}="1"][${ATTR.wide}="1"]
${inPane}[${ATTR.composer}="1"] [class*="thread-content-max-width"],
:root[${ATTR.enabled}="1"][${ATTR.wide}="1"]
${inPane}[${ATTR.composer}="1"] [class*="thread-body-max-width"]{
  --thread-content-responsive-max-width:min(100%,var(--uwc-content-width))!important;
  --thread-content-max-width:min(100%,var(--uwc-content-width))!important;
  --thread-body-max-width:min(100%,var(--uwc-content-width))!important;
  width:min(100%,var(--uwc-content-width))!important;
  max-width:100%!important;
  min-width:0!important;
  box-sizing:border-box!important;
  margin-inline:auto!important;
}

/* Only an actually overflowing composer scroll host receives this marker.
   @ mentions can remount the input and create a horizontal scrollport one or
   two ancestors above it. Do not clip generic dialogs or suggestion lists. */
:root[${ATTR.enabled}="1"][${ATTR.wide}="1"]
[data-uwc-composer-scroll-guard="1"]{
  min-width:0!important;
  max-width:100%!important;
  box-sizing:border-box!important;
  /* Empty forced tracks are cosmetic; scrollable content is never marked. */
  overflow-x:clip!important;
}

/* A horizontal scrollbar widget rendered as a sibling of the input needs
   display:none rather than overflow clipping. Never hide input scrollbars. */
:root[${ATTR.enabled}="1"][${ATTR.wide}="1"]
[data-uwc-composer-scroll-guard="1"]:is([data-orientation="horizontal"],[role="scrollbar"][aria-orientation="horizontal"]){
  display:none!important;
}

/* An @-mention can mount a narrow, full-width visual scrollbar as an
   unlabelled adjacent DOM node. Only a geometry-verified element receives
   this marker. Never use a broad selector that hides other ChatGPT controls. */
:root[${ATTR.enabled}="1"][${ATTR.wide}="1"]
[data-uwc-composer-visual-scrollbar="1"]{
  display:none!important;
}

/* The @ suggestion menu (not a scrollbar) can be placed beneath the
   composer by a clipped/incorrect floating-position context. Only menus
   verified offscreen or clipped receive the repair marker. The menu's own
   vertical scroll area must remain scrollable and interactive. */
:root[${ATTR.enabled}="1"][${ATTR.wide}="1"]
.composer-home-top-menu[data-uwc-mention-popup-repaired="1"]{
  position:fixed!important;
  inset:auto!important;
  top:auto!important;
  left:var(--uwc-mention-popup-left)!important;
  right:auto!important;
  bottom:var(--uwc-mention-popup-bottom)!important;
  width:var(--uwc-mention-popup-width)!important;
  max-width:calc(100vw - 16px)!important;
  max-height:var(--uwc-mention-popup-height)!important;
  height:auto!important;
  min-height:0!important;
  margin:0!important;
  transform:none!important;
  translate:none!important;
  z-index:2147483000!important;
  box-sizing:border-box!important;
}
:root[${ATTR.enabled}="1"][${ATTR.wide}="1"]
.composer-home-top-menu[data-uwc-mention-popup-repaired="1"]
[data-mention-list-scroll-area]{
  min-height:0!important;
  max-height:var(--uwc-mention-popup-height)!important;
  overflow-y:auto!important;
  overscroll-behavior-y:contain;
}
/* An ancestor can clip a correctly repositioned fixed popup when a
   transformed parent creates its containing block. Release only the
   tightly scoped, previously identified clipping ancestors while open. */
:root[${ATTR.enabled}="1"][${ATTR.wide}="1"]
[data-uwc-mention-clip-release="1"]{
  overflow:visible!important;
}

/* Some builds render the thin bar as a native ::-webkit-scrollbar, with no
   separate DOM element and without measurable scrollWidth overflow. Only
   target the bounded composer subtree while an @ mention is in progress.
   Never clip the scrollport itself or hide the suggestion popup. */
:root[${ATTR.enabled}="1"][${ATTR.wide}="1"]
[data-uwc-composer-mention-scroll-scope="1"]::-webkit-scrollbar:horizontal{
  height:0!important;
  display:none!important;
}

` : ''}

:root[${ATTR.enabled}="1"][${ATTR.wide}="1"]
[${ATTR.conversationRoot}="1"],
:root[${ATTR.enabled}="1"][${ATTR.wide}="1"]
[${ATTR.conversationPath}="1"]{
  min-width:0!important;
  box-sizing:border-box!important;
}

:root[${ATTR.enabled}="1"][${ATTR.wide}="1"]
[${ATTR.turn}="1"]{
  width:min(100%,var(--uwc-content-width))!important;
  max-width:100%!important;
  min-width:0!important;
  margin-inline:auto!important;
  box-sizing:border-box!important;
}

:root[${ATTR.enabled}="1"][${ATTR.wide}="1"]
[${ATTR.turnPath}="1"]{
  min-width:0!important;
  box-sizing:border-box!important;
}

:root[${ATTR.enabled}="1"][${ATTR.wide}="1"]
[${ATTR.composerPath}="1"]{
  min-width:0!important;
  box-sizing:border-box!important;
}

:root[${ATTR.enabled}="1"][${ATTR.wide}="1"]
[${ATTR.composer}="1"]{
  width:min(100%,var(--uwc-content-width))!important;
  max-width:100%!important;
  min-width:0!important;
  margin-inline:auto!important;
  box-sizing:border-box!important;
}

:root[${ATTR.enabled}="1"][${ATTR.wide}="1"]
[${ATTR.planNoticePath}="1"]{
  min-width:0!important;
  box-sizing:border-box!important;
}

:root[${ATTR.enabled}="1"][${ATTR.wide}="1"]
[${ATTR.planNotice}="1"]{
  width:min(100%,var(--uwc-content-width))!important;
  max-width:100%!important;
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
  max-width:100%!important;
  min-width:0!important;
  margin-inline:0!important;
}

/* Current virtualized assistant/user message markers. */
:root[${ATTR.enabled}="1"][${ATTR.wide}="1"]
${inPane}[data-markdown-text-style="assistant-message"]{
  width:100%!important;
  max-width:none!important;
  min-width:0!important;
  box-sizing:border-box!important;
}

:root[${ATTR.enabled}="1"][${ATTR.left}="1"]
${inPane}[data-markdown-text-style="assistant-message"]{
  text-align:left!important;
}

:root[${ATTR.enabled}="1"][${ATTR.wide}="1"]
${inPane}[data-user-message-bubble="true"]{
  max-width:min(var(--user-chat-width,80%),var(--uwc-content-width))!important;
}

${safeMediaCss}

/* Keep structured tables native and scroll wide content inside the widget.
   Table wrapper sizing also applies when optional safe media is disabled. */
:root[${ATTR.enabled}="1"][${ATTR.wide}="1"]
${assistantTurn} ${tableContainer}:has(> ${tableScroller}),
:root[${ATTR.enabled}="1"][${ATTR.wide}="1"]
${structuredTableScroller}{
  width:100%!important;
  min-width:0!important;
  max-width:100%!important;
  box-sizing:border-box!important;
}

:root[${ATTR.enabled}="1"][${ATTR.wide}="1"]
${structuredTableScroller}{
  overflow-x:auto!important;
}

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
#${ID.toast}{position:fixed!important;right:20px!important;bottom:20px!important;z-index:2147483647!important;max-width:min(420px,calc(100vw - 32px))!important;padding:12px 16px!important;border:1px solid var(--border-light,#454545)!important;border-radius:12px!important;background:var(--main-surface-primary,#212121)!important;color:var(--text-primary,#f4f4f4)!important;box-shadow:0 16px 56px #0006!important;font:13px/1.5 ui-sans-serif,system-ui,sans-serif!important;pointer-events:none!important}
#${ID.debugOverlay}{position:fixed!important;left:16px!important;bottom:16px!important;z-index:2147483645!important;display:grid!important;gap:4px!important;max-width:min(440px,calc(100vw - 32px))!important;padding:12px!important;border:1px solid #454545!important;border-radius:12px!important;background:#181818!important;color:#e5e5e5!important;box-shadow:0 18px 48px #0008!important;font:11px/1.4 ui-monospace,monospace!important;pointer-events:none!important}
#${ID.modal}{--uwc-accent:#10a37f;--uwc-accent-strong:#0d9270;--uwc-danger:#d95454;--uwc-ui-bg:var(--main-surface-primary,#212121);--uwc-ui-bg-secondary:var(--main-surface-secondary,#272727);--uwc-ui-bg-tertiary:var(--main-surface-tertiary,#333);--uwc-ui-text:var(--text-primary,#f4f4f4);--uwc-ui-muted:var(--text-secondary,#a6a6a6);--uwc-ui-border:var(--border-light,#404040);--uwc-ui-border-strong:var(--border-medium,#565656);position:fixed!important;inset:0!important;z-index:2147483646!important;display:flex!important;align-items:center!important;justify-content:center!important;padding:24px!important;background:rgba(0,0,0,.64)!important;color:var(--uwc-ui-text)!important;font:14px/1.5 ui-sans-serif,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif!important;backdrop-filter:blur(5px)!important}
#${ID.modal} *,#${ID.modal} *::before,#${ID.modal} *::after{box-sizing:border-box!important}
#${ID.modal} .uwc-panel{width:min(760px,100%)!important;max-height:min(90dvh,900px)!important;overflow-y:auto!important;overflow-x:hidden!important;overscroll-behavior:contain!important;border:1px solid var(--uwc-ui-border)!important;border-radius:18px!important;background:var(--uwc-ui-bg)!important;color:var(--uwc-ui-text)!important;box-shadow:0 28px 100px #0008!important;scrollbar-width:thin!important}
#${ID.modal} .uwc-header{position:sticky!important;top:0!important;z-index:5!important;display:flex!important;align-items:center!important;justify-content:space-between!important;gap:16px!important;min-height:88px!important;padding:18px 28px!important;border-bottom:1px solid var(--uwc-ui-border)!important;background:var(--uwc-ui-bg)!important}
#${ID.modal} .uwc-header-copy{min-width:0!important}
#${ID.modal} .uwc-title-row{display:flex!important;align-items:center!important;gap:10px!important;flex-wrap:wrap!important}
#${ID.modal} .uwc-title{margin:0!important;font-size:20px!important;line-height:1.25!important;letter-spacing:-.035em!important;font-weight:680!important;color:var(--uwc-ui-text)!important}
#${ID.modal} .uwc-version{display:inline-flex!important;align-items:center!important;min-height:21px!important;padding:2px 7px!important;border:1px solid var(--uwc-ui-border)!important;border-radius:6px!important;color:var(--uwc-ui-muted)!important;font:550 11px/1.3 ui-monospace,SFMono-Regular,Consolas,monospace!important}
#${ID.modal} .uwc-subtitle{margin:5px 0 0!important;color:var(--uwc-ui-muted)!important;font-size:12px!important}
#${ID.modal} button{font:550 13px/1.35 ui-sans-serif,system-ui,sans-serif!important;color:var(--uwc-ui-text)!important;min-height:36px!important;padding:8px 12px!important;border:1px solid var(--uwc-ui-border)!important;border-radius:9px!important;background:transparent!important;cursor:pointer!important;transition:background-color .14s,border-color .14s!important}
#${ID.modal} button:hover{background:var(--uwc-ui-bg-tertiary)!important;border-color:var(--uwc-ui-border-strong)!important}
#${ID.modal} button:disabled{opacity:.45!important;cursor:not-allowed!important}
#${ID.modal} .uwc-close{display:grid!important;place-items:center!important;flex:none!important;width:36px!important;min-width:36px!important;height:36px!important;padding:0!important;border:0!important;border-radius:9px!important;background:transparent!important;font-size:23px!important;font-weight:350!important;color:var(--uwc-ui-muted)!important}
#${ID.modal} .uwc-body{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;column-gap:24px!important;row-gap:0!important;padding:22px 28px 0!important}
#${ID.modal} .uwc-status{grid-column:1/-1!important;display:flex!important;align-items:center!important;justify-content:space-between!important;gap:16px!important;margin:0 0 26px!important;padding:14px 16px!important;border:1px solid var(--uwc-ui-border)!important;border-radius:12px!important;background:var(--uwc-ui-bg-secondary)!important}
#${ID.modal} .uwc-status-main{display:grid!important;grid-template-columns:8px minmax(0,1fr)!important;gap:2px 11px!important;align-items:start!important;min-width:0!important}
#${ID.modal} .uwc-status-main::before{content:""!important;grid-row:1/span 2!important;align-self:start!important;width:8px!important;height:8px!important;margin-top:6px!important;border-radius:50%!important;background:var(--uwc-accent)!important}
#${ID.modal} .uwc-status[data-state="inactive"] .uwc-status-main::before{background:var(--uwc-ui-muted)!important}
#${ID.modal} .uwc-status strong{font-size:13px!important;font-weight:640!important}
#${ID.modal} .uwc-status-detail{font-size:12px!important;color:var(--uwc-ui-muted)!important;line-height:1.4!important}
#${ID.modal} .uwc-health-pill{flex:none!important;display:inline-flex!important;align-items:center!important;min-height:28px!important;padding:4px 9px!important;border:1px solid var(--uwc-ui-border)!important;border-radius:7px!important;font:550 11px/1.2 ui-monospace,monospace!important;color:var(--uwc-ui-muted)!important;white-space:nowrap!important}
#${ID.modal} .uwc-section{min-width:0!important;margin:0 0 25px!important;padding:0!important;border:0!important;background:transparent!important}
#${ID.modal} .uwc-section h3{display:flex!important;align-items:center!important;gap:10px!important;margin:0 0 11px!important;padding:0 0 9px!important;border-bottom:1px solid var(--uwc-ui-border)!important;font-size:13px!important;font-weight:660!important;line-height:1.4!important;letter-spacing:-.01em!important;color:var(--uwc-ui-text)!important;text-transform:none!important}
#${ID.modal} .uwc-section[data-section="layout"]{grid-column:1/-1!important}
#${ID.modal} .uwc-grid{display:grid!important;grid-template-columns:1fr!important;gap:3px!important}
#${ID.modal} .uwc-section[data-section="layout"]>.uwc-grid{grid-template-columns:repeat(2,minmax(0,1fr))!important;column-gap:14px!important}
#${ID.modal} .uwc-check{position:relative!important;display:grid!important;grid-template-columns:minmax(0,1fr) 38px!important;align-items:center!important;gap:12px!important;min-height:49px!important;padding:10px 8px!important;border-radius:9px!important;cursor:pointer!important;color:var(--uwc-ui-text)!important;transition:background-color .12s!important}
#${ID.modal} .uwc-check:hover{background:var(--uwc-ui-bg-secondary)!important}
#${ID.modal} .uwc-check:has(input:focus-visible){outline:2px solid var(--uwc-accent)!important;outline-offset:1px!important}
#${ID.modal} .uwc-check input[type="checkbox"]{position:absolute!important;width:1px!important;height:1px!important;opacity:0!important;pointer-events:none!important}
#${ID.modal} .uwc-check-copy{min-width:0!important;font-size:13px!important;font-weight:480!important;line-height:1.4!important}
#${ID.modal} .uwc-toggle-state{position:relative!important;display:block!important;flex:none!important;width:36px!important;height:21px!important;overflow:hidden!important;border-radius:30px!important;border:1px solid var(--uwc-ui-border-strong)!important;background:var(--uwc-ui-bg-tertiary)!important;font-size:0!important;color:transparent!important}
#${ID.modal} .uwc-toggle-state::after{content:""!important;position:absolute!important;left:3px!important;top:3px!important;width:13px!important;height:13px!important;border-radius:50%!important;background:var(--uwc-ui-muted)!important;transition:transform .16s,background-color .16s!important}
#${ID.modal} .uwc-check input:checked~.uwc-toggle-state{background:var(--uwc-accent)!important;border-color:var(--uwc-accent)!important}
#${ID.modal} .uwc-check input:checked~.uwc-toggle-state::after{background:#fff!important;transform:translateX(15px)!important}
#${ID.modal} .uwc-field{display:flex!important;flex-direction:column!important;justify-content:center!important;gap:6px!important;min-width:0!important;min-height:72px!important;padding:9px 8px!important;border-radius:9px!important}
#${ID.modal} .uwc-field>label{font-size:12px!important;font-weight:560!important}
#${ID.modal} .uwc-hint{display:block!important;margin-top:3px!important;font-size:11px!important;font-weight:400!important;line-height:1.4!important;color:var(--uwc-ui-muted)!important}
#${ID.modal} .uwc-field input:not([type="checkbox"]),#${ID.modal} select,#${ID.modal} textarea{width:100%!important;min-width:0!important;min-height:37px!important;padding:8px 10px!important;border:1px solid var(--uwc-ui-border)!important;border-radius:8px!important;outline:0!important;background:var(--uwc-ui-bg-secondary)!important;color:var(--uwc-ui-text)!important;font:13px/1.4 ui-sans-serif,system-ui,sans-serif!important}
#${ID.modal} .uwc-field input:hover,#${ID.modal} select:hover{border-color:var(--uwc-ui-border-strong)!important}
#${ID.modal} .uwc-field input:focus,#${ID.modal} select:focus{border-color:var(--uwc-accent)!important;box-shadow:0 0 0 2px color-mix(in srgb,var(--uwc-accent) 17%,transparent)!important}
#${ID.modal} button:focus-visible,#${ID.modal} input:focus-visible,#${ID.modal} select:focus-visible,#${ID.modal} summary:focus-visible{outline:2px solid var(--uwc-accent)!important;outline-offset:3px!important}
#${ID.modal} .uwc-primary{border-color:var(--uwc-accent)!important;background:var(--uwc-accent)!important;color:white!important}
#${ID.modal} .uwc-primary:hover{border-color:var(--uwc-accent-strong)!important;background:var(--uwc-accent-strong)!important}
#${ID.modal} .uwc-danger{color:var(--uwc-danger)!important}
#${ID.modal} .uwc-advanced{grid-column:1/-1!important;min-width:0!important;margin:0 0 18px!important;border-top:1px solid var(--uwc-ui-border)!important;background:transparent!important}
#${ID.modal} .uwc-advanced>summary{display:flex!important;align-items:center!important;justify-content:space-between!important;gap:12px!important;min-height:50px!important;padding:12px 0!important;cursor:pointer!important;list-style:none!important;font-size:13px!important;font-weight:630!important}
#${ID.modal} .uwc-advanced>summary::-webkit-details-marker{display:none!important}
#${ID.modal} .uwc-advanced>summary::after{content:"⌄"!important;color:var(--uwc-ui-muted)!important;font-size:20px!important;line-height:1!important;transition:transform .16s!important}
#${ID.modal} .uwc-advanced[open]>summary::after{transform:rotate(180deg)!important}
#${ID.modal} .uwc-advanced:not([open])>.uwc-advanced-body{display:none!important}
#${ID.modal} .uwc-advanced-body{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:0 20px!important;padding:12px 0 0!important}
#${ID.modal} .uwc-advanced-body>.uwc-section{margin-bottom:20px!important}
#${ID.modal} .uwc-overview,#${ID.modal} .uwc-health-breakdown{display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;grid-column:1/-1!important;gap:8px!important;margin:0 0 16px!important}
#${ID.modal} .uwc-metric,#${ID.modal} .uwc-health-item{min-width:0!important;padding:10px 12px!important;border-radius:9px!important;background:var(--uwc-ui-bg-secondary)!important;border:1px solid var(--uwc-ui-border)!important}
#${ID.modal} .uwc-metric-label,#${ID.modal} .uwc-health-label{display:block!important;margin-bottom:4px!important;color:var(--uwc-ui-muted)!important;font-size:10px!important;font-weight:550!important;letter-spacing:0!important;text-transform:none!important;white-space:normal!important}
#${ID.modal} .uwc-metric-value,#${ID.modal} .uwc-health-value{display:block!important;color:var(--uwc-ui-text)!important;font:600 12px/1.4 ui-monospace,monospace!important;overflow-wrap:anywhere!important}
#${ID.modal} .uwc-health-item{display:flex!important;justify-content:space-between!important;gap:8px!important}
#${ID.modal} .uwc-shortcuts{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:7px!important}
#${ID.modal} .uwc-shortcuts span{display:flex!important;align-items:center!important;min-height:32px!important;padding:7px 9px!important;border:1px solid var(--uwc-ui-border)!important;border-radius:8px!important;background:var(--uwc-ui-bg-secondary)!important;font:11px/1.4 ui-monospace,monospace!important;color:var(--uwc-ui-muted)!important}
#${ID.modal} .uwc-inline-actions{grid-column:1/-1!important;display:flex!important;flex-wrap:wrap!important;gap:8px!important;margin:6px 0 15px!important}
#${ID.modal} .uwc-actions{position:sticky!important;bottom:0!important;z-index:5!important;grid-column:1/-1!important;display:flex!important;align-items:center!important;justify-content:flex-end!important;gap:8px!important;flex-wrap:wrap!important;margin:4px -28px 0!important;padding:14px 28px!important;border-top:1px solid var(--uwc-ui-border)!important;background:var(--uwc-ui-bg)!important}
#${ID.modal} .uwc-actions::before{content:"Changes save automatically"!important;flex:1 1 auto!important;color:var(--uwc-ui-muted)!important;font-size:11px!important}
@media(max-width:700px){#${ID.modal}{padding:10px!important}#${ID.modal} .uwc-panel{max-height:calc(100dvh - 20px)!important;border-radius:14px!important}#${ID.modal} .uwc-header{min-height:70px!important;padding:15px 18px!important}#${ID.modal} .uwc-body{display:block!important;padding:17px 18px 0!important}#${ID.modal} .uwc-status{margin-bottom:22px!important}#${ID.modal} .uwc-section[data-section="layout"]>.uwc-grid{grid-template-columns:1fr!important}#${ID.modal} .uwc-advanced-body{grid-template-columns:1fr!important}#${ID.modal} .uwc-actions{margin:4px -18px 0!important;padding:12px 18px!important}#${ID.modal} .uwc-actions::before{flex-basis:100%!important}}
@media(max-width:440px){#${ID.modal} .uwc-title{font-size:18px!important}#${ID.modal} .uwc-version{font-size:10px!important}#${ID.modal} .uwc-status{align-items:flex-start!important;flex-direction:column!important}#${ID.modal} .uwc-overview,#${ID.modal} .uwc-health-breakdown{grid-template-columns:repeat(2,minmax(0,1fr))!important}#${ID.modal} .uwc-actions button{flex:1 1 calc(50% - 6px)!important}}
@media(prefers-reduced-motion:reduce){#${ID.modal} *,#${ID.modal} *::before,#${ID.modal} *::after{animation:none!important;transition:none!important;scroll-behavior:auto!important}}

/* Consumer settings – restrained native ChatGPT / Apple-like hierarchy */
#${ID.modal}{--uwc-accent:var(--text-primary,#f4f4f4);--uwc-accent-strong:var(--text-primary,#fff);background:rgba(0,0,0,.52)!important;backdrop-filter:blur(9px)!important}
#${ID.modal} .uwc-panel{width:min(560px,100%)!important;max-height:min(88dvh,820px)!important;border-radius:22px!important;box-shadow:0 30px 90px #0007!important;scrollbar-width:thin!important}
#${ID.modal} .uwc-header{min-height:82px!important;padding:23px 28px 18px!important;border-bottom:0!important;position:relative!important}
#${ID.modal} .uwc-title{font-size:22px!important;font-weight:650!important;letter-spacing:-.04em!important}
#${ID.modal} .uwc-subtitle{font-size:13px!important;margin-top:6px!important}
#${ID.modal} .uwc-version{display:none!important}
#${ID.modal} .uwc-close{width:32px!important;min-width:32px!important;height:32px!important;border-radius:50%!important;background:var(--uwc-ui-bg-secondary)!important;font-size:21px!important}
#${ID.modal} .uwc-body{display:block!important;padding:9px 28px 0!important}
#${ID.modal} .uwc-status{margin:4px 0 24px!important;padding:14px 15px!important;border:0!important;border-radius:13px!important;background:var(--uwc-ui-bg-secondary)!important}
#${ID.modal} .uwc-status strong{font-size:14px!important;font-weight:620!important}
#${ID.modal} .uwc-status-detail{font-size:12px!important}
#${ID.modal} .uwc-status-main::before{background:#19a879!important}
#${ID.modal} .uwc-section{margin:0 0 21px!important}
#${ID.modal} .uwc-section h3{font-size:12px!important;font-weight:600!important;color:var(--uwc-ui-muted)!important;border:0!important;margin:0 0 5px!important;padding:0 10px!important}
#${ID.modal} .uwc-section[data-section="your-view"]>.uwc-grid{grid-template-columns:1fr!important;gap:0!important}
#${ID.modal} .uwc-check{min-height:51px!important;padding:10px 11px!important;border-radius:11px!important;grid-template-columns:minmax(0,1fr) 43px!important}
#${ID.modal} .uwc-check-copy{font-size:14px!important;font-weight:500!important;line-height:1.45!important}
#${ID.modal} .uwc-toggle-state{width:40px!important;height:24px!important;border:0!important;background:var(--uwc-ui-bg-tertiary)!important}
#${ID.modal} .uwc-toggle-state::after{width:18px!important;height:18px!important;left:3px!important;top:3px!important;background:#fff!important;box-shadow:0 1px 3px #0003!important}
#${ID.modal} .uwc-check input:checked~.uwc-toggle-state{background:#16a879!important;border:0!important}
#${ID.modal} .uwc-check input:checked~.uwc-toggle-state::after{transform:translateX(16px)!important}
#${ID.modal} .uwc-check:hover{background:var(--uwc-ui-bg-secondary)!important}
#${ID.modal} .uwc-field{min-height:66px!important;padding:10px 11px!important}
#${ID.modal} .uwc-field>label{font-size:13px!important}
#${ID.modal} .uwc-field select,#${ID.modal} .uwc-field input{border-radius:10px!important;min-height:39px!important}
#${ID.modal} .uwc-advanced{margin:6px 0 14px!important;border-top:1px solid var(--uwc-ui-border)!important}
#${ID.modal} .uwc-advanced>summary{font-size:14px!important;font-weight:540!important;min-height:52px!important;padding:13px 10px!important}
#${ID.modal} .uwc-advanced-body{display:block!important;padding:7px 0 12px!important}
#${ID.modal} .uwc-consumer-extras{margin-bottom:18px!important;padding:4px 0!important;border-radius:12px!important;background:var(--uwc-ui-bg-secondary)!important}
#${ID.modal} .uwc-advanced-body>.uwc-section{margin:18px 0!important}
#${ID.modal} .uwc-advanced-body .uwc-grid{display:grid!important;grid-template-columns:1fr!important;gap:2px!important}
#${ID.modal} .uwc-health-pill{display:inline-flex!important;margin:4px 10px 17px!important;font-size:11px!important;font-family:ui-sans-serif,system-ui,sans-serif!important}
#${ID.modal} .uwc-consumer-tools{display:flex!important;flex-wrap:wrap!important;gap:8px!important;padding:12px 6px 20px!important;border-top:1px solid var(--uwc-ui-border)!important}
#${ID.modal} .uwc-consumer-tools button{font-size:12px!important}
#${ID.modal} .uwc-overview,#${ID.modal} .uwc-health-breakdown{grid-template-columns:repeat(2,minmax(0,1fr))!important}
#${ID.modal} .uwc-actions{position:sticky!important;bottom:0!important;margin:4px -28px 0!important;padding:13px 28px 17px!important;background:var(--uwc-ui-bg)!important;border-top:1px solid var(--uwc-ui-border)!important;justify-content:flex-end!important}
#${ID.modal} .uwc-actions::before{content:'Saved automatically'!important;font-size:12px!important}
#${ID.modal} .uwc-actions .uwc-primary{min-width:86px!important;border-radius:999px!important;background:var(--uwc-ui-text)!important;border-color:var(--uwc-ui-text)!important;color:var(--uwc-ui-bg)!important;font-size:13px!important}
#${ID.modal} .uwc-actions .uwc-primary:hover{opacity:.86!important}
#${ID.modal} button:focus-visible,#${ID.modal} input:focus-visible,#${ID.modal} select:focus-visible,#${ID.modal} summary:focus-visible{outline:2px solid #16a879!important;outline-offset:3px!important}
@media(max-width:620px){#${ID.modal}{padding:10px!important}#${ID.modal} .uwc-panel{max-height:calc(100dvh - 20px)!important;border-radius:18px!important}#${ID.modal} .uwc-header{padding:20px 20px 13px!important}#${ID.modal} .uwc-body{padding:8px 20px 0!important}#${ID.modal} .uwc-actions{margin:4px -20px 0!important;padding:12px 20px 15px!important}#${ID.modal} .uwc-actions::before{flex-basis:auto!important}#${ID.modal} .uwc-actions button{flex:0 0 auto!important}}
@media(prefers-color-scheme:light){#${ID.modal}{--uwc-accent:#161616}}
`.trim();
  }

  function getCssCacheKey() {
    return [
      VERSION,
      settings.cap,
      settings.gutterMin,
      settings.gutterVw,
      settings.gutterMax,
      settings.safeMedia,
      settings.widenComposer
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

    if (!settings.enabled) {
      clearRootState();
      return;
    }

    const pane = resolveActivePane();
    const paneRect = getVisibleRect(pane);
    if (paneRect) syncSizedPane(pane, paneRect.width);

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
    scheduleClipAlignment();
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
    clearClipAlignment();
    clearSizedPane();
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
        if (!previous.has(element) || element.getAttribute(attribute) !== '1') {
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
    clearComposerScrollGuard();
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

  function queryConversationTurns(pane) {
    let preferred = [];

    try {
      preferred = Array.from(
        pane.querySelectorAll(
          SELECTOR.preferredTurns
        )
      ).filter((turn) => !turn.closest(SELECTOR.excludedComposerAncestor));
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
        pane.querySelectorAll(
          SELECTOR.fallbackMessages
        )
      ).filter(isConnectedElement);
    } catch (_) {}

    runtime.lastRawTurnCount =
      fallbackMessages.length;

    const fallbackTurns =
      fallbackMessages
        .filter((message) => !message.closest(SELECTOR.excludedComposerAncestor))
        .map((message) => {
          const article = message.closest('article');
          return article !== pane && pane.contains(article)
            ? article
            : message.parentElement === pane ? message : message.parentElement;
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

  function markConversation(desired, main) {
    const turns = main ? queryConversationTurns(main) : [];
    runtime.lastTurnCount = turns.length;

    if (turns.length === 0) {
      return;
    }

    let conversationRoot =
      commonAncestor(
        turns,
        main
      ) || main;

    if (
      turns.length === 1 &&
      conversationRoot === turns[0]
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

    for (const turn of turns) {
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

  function findComposerInput(pane) {
    if (!pane) return null;
    let candidates = [];

    try {
      const recent = Array.from(
        pane.querySelectorAll(
          SELECTOR.composerInput
        )
      ).slice(-CONFIG.maxComposerCandidates);

      // A large number of unrelated forms must not push the real composer
      // out of the bounded candidate set before its priority is evaluated.
      const primary = Array.from(pane.querySelectorAll(
        PRIMARY_COMPOSER_INPUT
      ));
      candidates = Array.from(new Set([...primary, ...recent]))
        .filter(isConnectedElement);
    } catch (_) {}

    if (candidates.length === 0) {
      return null;
    }

    const isExcluded = (element) => {
      try {
        return Boolean(
          element.closest(
            `${SELECTOR.excludedComposerAncestor},${SELECTOR.preferredTurns},${SELECTOR.fallbackMessages}`
          )
        );
      } catch (_) {
        return false;
      }
    };

    const focused =
      document.activeElement;

    const scored = candidates
      .filter((element) =>
        !isExcluded(element) &&
        isVisibleElement(element)
      )
      .map((element, index) => {
        let score = index + (element === focused || element.contains?.(focused) ? 3000 : 0);
        // A focused unrelated form must not outrank the canonical prompt.
        if (element.matches(PRIMARY_COMPOSER_INPUT)) score += 800;

        try {
          if (element.id === 'prompt-textarea') {
            score += 1600;
          }

          if (
            element.matches(
              COMPOSER_INPUT_TEST_IDS
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

  const COMPOSER_SCROLL_GUARD_ATTR = 'data-uwc-composer-scroll-guard';
  const COMPOSER_VISUAL_SCROLLBAR_ATTR = 'data-uwc-composer-visual-scrollbar';
  const COMPOSER_MENTION_SCROLL_SCOPE_ATTR = 'data-uwc-composer-mention-scroll-scope';
  const COMPOSER_DEBUG_REQUEST = 'uwc:composer-debug';
  const COMPOSER_DEBUG_ATTR = 'data-uwc-composer-debug';

  const MENTION_POPUP_MARKER = 'data-uwc-mention-popup-repaired';
  const MENTION_CLIP_RELEASE_ATTR = 'data-uwc-mention-clip-release';
  const MENTION_POPUP_SELECTOR =
    '.composer-home-top-menu:has([data-mention-list-scroll-area])';
  const MENTION_POPUP_STYLE_KEYS = Object.freeze([
    '--uwc-mention-popup-left', '--uwc-mention-popup-bottom',
    '--uwc-mention-popup-width', '--uwc-mention-popup-height'
  ]);

  function clearMentionPopupRepair() {
    const menu = runtime.mentionPopupNode;
    if (menu) {
      for (const [name, prior] of runtime.mentionPopupOriginalStyle) {
        const current = menu.style.getPropertyValue(name);
        // Do not overwrite changes made by ChatGPT or another extension.
        if (current !== prior.applied) continue;
        markMutationIntent(menu, 'attributes', 'style');
        if (prior.value) menu.style.setProperty(name, prior.value, prior.priority);
        else menu.style.removeProperty(name);
      }
      if (menu.hasAttribute(MENTION_POPUP_MARKER)) {
        setBooleanAttribute(menu, MENTION_POPUP_MARKER, false);
      }
    }
    runtime.mentionPopupNode = null;
    runtime.mentionPopupOriginalStyle.clear();
    for (const node of runtime.mentionPopupClipNodes) {
      if (node.hasAttribute?.(MENTION_CLIP_RELEASE_ATTR)) {
        setBooleanAttribute(node, MENTION_CLIP_RELEASE_ATTR, false);
      }
    }
    runtime.mentionPopupClipNodes.clear();
  }

  function storeMentionPopupVar(menu, name, value) {
    const next = String(value);
    const previous = runtime.mentionPopupOriginalStyle.get(name);
    if (!previous) {
      runtime.mentionPopupOriginalStyle.set(name, {
        value: menu.style.getPropertyValue(name),
        priority: menu.style.getPropertyPriority(name),
        applied: next
      });
    } else {
      previous.applied = next;
    }
    if (menu.style.getPropertyValue(name) !== next) {
      markMutationIntent(menu, 'attributes', 'style');
      menu.style.setProperty(name, next);
    }
  }

  function inspectMentionPopup(input, mentionActive) {
    const composer = input && (input.closest('form') ||
      input.closest(SELECTOR.composerShell) || input);
    const composerRect = composer?.getBoundingClientRect();
    // A page can contain multiple suggestion menus (split panes, hidden
    // dialogs, or stale portals). Never use the first matching DOM node.
    // Score only menus that overlap the active composer horizontally.
    const matchedMenus = [];
    if (input && mentionActive && composerRect?.width > 0) {
      for (const element of document.querySelectorAll(MENTION_POPUP_SELECTOR)) {
        const box = element.getBoundingClientRect();
        const css = getComputedStyle(element);
        if (!box.width || css.display === 'none' ||
            css.visibility === 'hidden' || css.visibility === 'collapse' ||
            element.closest('[hidden],[aria-hidden="true"],[inert]')) continue;
        const overlap = Math.max(0, Math.min(box.right, composerRect.right) -
          Math.max(box.left, composerRect.left));
        if (overlap < Math.min(box.width, composerRect.width) * 0.28) continue;
        // A fully collapsed panel is still recoverable when its items exist.
        if (!box.height && element.querySelectorAll('[data-list-navigation-item]').length < 2) continue;
        const distance = Math.abs(box.bottom - composerRect.top);
        if (distance > Math.max(innerHeight, 850)) continue;
        matchedMenus.push({ element, distance,
          owned: composer.contains(element) ? 1 : 0 });
      }
    }
    // Prefer a menu owned by this composer's DOM when both are plausible.
    // A nearby unrelated portal must not steal a valid owned suggestion list.
    matchedMenus.sort((a, b) => {
      if (Math.abs(a.distance - b.distance) <= 32 && a.owned !== b.owned) {
        return b.owned - a.owned;
      }
      return a.distance - b.distance || b.owned - a.owned;
    });
    const menu = matchedMenus[0]?.element || null;
    const result = {
      present: Boolean(menu), active: Boolean(mentionActive),
      candidates: matchedMenus.length,
      repaired: Boolean(menu?.hasAttribute(MENTION_POPUP_MARKER)),
      reason: '', menu: null, composer: null, clippedBy: []
    };
    if (!menu || !composerRect) return { menu, result, shouldFix: false };
    const menuRect = menu.getBoundingClientRect();
    result.menu = { left: menuRect.left, top: menuRect.top,
      bottom: menuRect.bottom, width: menuRect.width, height: menuRect.height };
    result.composer = { left: composerRect.left, top: composerRect.top,
      bottom: composerRect.bottom, width: composerRect.width };
    if (composerRect.width < 100 || composerRect.top < 80 ||
        innerWidth < 240 || innerHeight < 160) {
      result.reason = 'insufficient-viewport-space';
      return { menu, result, shouldFix: false };
    }
    // Detect ancestor clipping instead of mistaking a clipped menu's rounded
    // bottom border for a native scrollbar. Exclude the menu itself, whose
    // overflow-hidden is intentional for its rounded corners.
    let top = Math.max(0, menuRect.top);
    let bottom = Math.min(innerHeight, menuRect.bottom);
    for (let node = menu.parentElement, depth = 0;
      node && node !== document.documentElement && depth < 20;
      node = node.parentElement, depth += 1) {
      const css = getComputedStyle(node);
      if (/(hidden|clip|scroll|auto)/.test(css.overflowY)) {
        const clip = node.getBoundingClientRect();
        top = Math.max(top, clip.top);
        bottom = Math.min(bottom, clip.bottom);
        result.clippedBy.push({ tag: node.tagName.toLowerCase(),
          id: node.id || '', height: Math.round(clip.height),
          overflowY: css.overflowY });
      }
    }
    const visibleHeight = Math.max(0, bottom - top);
    result.menu.visibleHeight = Math.round(visibleHeight);
    const misplaced = menuRect.top >= composerRect.top - 8 ||
      menuRect.bottom > composerRect.top + 12;
    const clipped = menuRect.height > 100 &&
      visibleHeight < Math.min(100, menuRect.height * 0.45);
    const collapsed = menuRect.height < 36 &&
      menu.querySelectorAll('[data-list-navigation-item]').length > 2;
    const shouldFix = misplaced || clipped || collapsed ||
      (runtime.mentionPopupNode === menu && menu.hasAttribute(MENTION_POPUP_MARKER));
    result.reason = misplaced ? 'popup-below-or-overlapping-composer'
      : clipped ? 'popup-clipped-by-ancestor-or-viewport'
      : collapsed ? 'popup-collapsed-to-thin-strip' : 'native-menu-is-visible';
    return { menu, result, shouldFix };
  }

  function auditMentionPopup(input, mentionActive) {
    if (!runtime.started || !settings.enabled || !isWideActive() ||
        runtime.safeFallbackActive) {
      clearMentionPopupRepair();
      runtime.mentionPopupLastAudit = { reason: 'inactive' };
      return;
    }
    const { menu, result, shouldFix } = inspectMentionPopup(input, mentionActive);
    if (runtime.mentionPopupNode && runtime.mentionPopupNode !== menu) {
      clearMentionPopupRepair();
    }
    if (!shouldFix || !menu) {
      if (runtime.mentionPopupNode) clearMentionPopupRepair();
      runtime.mentionPopupLastAudit = result;
      return;
    }
    const rect = result.composer;
    const margin = 8;
    const availableHeight = Math.floor(rect.top - margin * 2);
    if (availableHeight < 72) {
      clearMentionPopupRepair();
      runtime.mentionPopupLastAudit = { ...result, reason: 'not-enough-room-above' };
      return;
    }
    const configuredHeight = parseFloat(getComputedStyle(menu)
      .getPropertyValue('--composer-top-menu-max-height')) || 687;
    const maxHeight = Math.min(availableHeight, Math.max(120, configuredHeight));
    const width = Math.min(rect.width, innerWidth - margin * 2);
    const targetLeft = Math.max(margin, Math.min(rect.left, innerWidth - margin - width));
    // A transformed composer creates the containing block for fixed children.
    // Convert viewport geometry into that containing block's local CSS units.
    // This prevents the popup shifting sideways on centered Work composers.
    let fixedRoot = null;
    for (let node = menu.parentElement; node && node !== document.documentElement;
      node = node.parentElement) {
      const css = getComputedStyle(node);
      if (css.transform !== 'none' || css.translate !== 'none' ||
          css.perspective !== 'none' || css.filter !== 'none' ||
          /layout|paint|strict|content/.test(css.contain) ||
          /transform/.test(css.willChange)) {
        fixedRoot = node;
        break;
      }
    }
    let left = targetLeft;
    let bottom = Math.max(margin, innerHeight - rect.top + margin);
    let localWidth = width;
    let localMaxHeight = maxHeight;
    if (fixedRoot) {
      const bounds = fixedRoot.getBoundingClientRect();
      const sx = bounds.width / (fixedRoot.offsetWidth || bounds.width || 1);
      const sy = bounds.height / (fixedRoot.offsetHeight || bounds.height || 1);
      if (sx > 0 && sy > 0 && Number.isFinite(sx) && Number.isFinite(sy)) {
        left = (targetLeft - bounds.left) / sx;
        bottom = (bounds.bottom - (rect.top - margin)) / sy;
        localWidth = width / sx;
        localMaxHeight = maxHeight / sy;
      }
    }
    if (runtime.mentionPopupNode !== menu) {
      runtime.mentionPopupNode = menu;
      runtime.mentionPopupOriginalStyle.clear();
    }
    // Release only hidden/clip ancestors that would otherwise mask the popup;
    // leave normal scrollports, popovers and the transcript untouched.
    const nextClipNodes = new Set();
    for (let node = menu.parentElement, depth = 0;
      node && node !== document.documentElement && depth < 12;
      node = node.parentElement, depth += 1) {
      if (node.matches('main,[role="main"],body,.thread-scroll-container,'+
          '[data-thread-user-message-navigation-content]')) break;
      const style = getComputedStyle(node);
      if ((style.overflowY === 'hidden' || style.overflowY === 'clip' ||
           style.overflowX === 'hidden' || style.overflowX === 'clip') &&
          node.scrollHeight <= node.clientHeight + 1 &&
          node.scrollWidth <= node.clientWidth + 1 &&
          !node.matches('[data-radix-scroll-area-viewport],[role="listbox"],'+
            '[data-scroll-area-viewport],[data-slot="scroll-area-viewport"]') &&
          !node.querySelector('[data-radix-scroll-area-viewport],'+
            '[data-scroll-area-viewport],[data-slot="scroll-area-viewport"]')) {
        const bounds = node.getBoundingClientRect();
        // Only release ancestors whose clip region would actually mask the
        // intended popup. Other hidden/clip containers keep their semantics.
        const targetTop = rect.top - margin - maxHeight;
        const targetBottom = rect.top - margin;
        const obstructs = bounds.height > 0 && (
          bounds.top > targetTop + 2 || bounds.bottom < targetBottom - 2 ||
          bounds.left > targetLeft + 2 || bounds.right < targetLeft + width - 2
        );
        if (obstructs) nextClipNodes.add(node);
      }
    }
    for (const oldNode of runtime.mentionPopupClipNodes) {
      if (!nextClipNodes.has(oldNode)) {
        setBooleanAttribute(oldNode, MENTION_CLIP_RELEASE_ATTR, false);
      }
    }
    for (const node of nextClipNodes) {
      setBooleanAttribute(node, MENTION_CLIP_RELEASE_ATTR, true);
    }
    runtime.mentionPopupClipNodes = nextClipNodes;

    const values = [left, bottom, localWidth, localMaxHeight];
    MENTION_POPUP_STYLE_KEYS.forEach((name, index) => {
      storeMentionPopupVar(menu, name, `${Math.round(values[index])}px`);
    });
    setBooleanAttribute(menu, MENTION_POPUP_MARKER, true);
    result.repaired = true;
    result.placement = { left: Math.round(left), bottom: Math.round(bottom),
      width: Math.round(width), maxHeight: Math.round(maxHeight),
      fixedContainingBlock: fixedRoot?.id || fixedRoot?.tagName || 'viewport',
      clipReleases: nextClipNodes.size };
    runtime.mentionPopupLastAudit = result;
  }


  function clearComposerScrollGuard() {
    clearMentionPopupRepair();
    if (runtime.composerScrollGuardFrame) {
      cancelNextFrame(runtime.composerScrollGuardFrame);
      runtime.composerScrollGuardFrame = 0;
    }
    if (runtime.composerScrollGuardTimer) {
      clearTimeout(runtime.composerScrollGuardTimer);
      runtime.composerScrollGuardTimer = 0;
    }
    if (runtime.composerScrollGuardLateTimer) {
      clearTimeout(runtime.composerScrollGuardLateTimer);
      runtime.composerScrollGuardLateTimer = 0;
    }
    for (const element of runtime.composerScrollGuardNodes) {
      if (element?.hasAttribute?.(COMPOSER_SCROLL_GUARD_ATTR)) {
        setBooleanAttribute(element, COMPOSER_SCROLL_GUARD_ATTR, false);
      }
    }
    runtime.composerScrollGuardNodes.clear();
    for (const element of runtime.composerVisualScrollbarNodes) {
      if (element?.hasAttribute?.(COMPOSER_VISUAL_SCROLLBAR_ATTR)) {
        setBooleanAttribute(element, COMPOSER_VISUAL_SCROLLBAR_ATTR, false);
      }
    }
    runtime.composerVisualScrollbarNodes.clear();
    for (const element of runtime.composerMentionScrollbarScopeNodes) {
      if (element?.hasAttribute?.(COMPOSER_MENTION_SCROLL_SCOPE_ATTR)) {
        setBooleanAttribute(element, COMPOSER_MENTION_SCROLL_SCOPE_ATTR, false);
      }
    }
    runtime.composerMentionScrollbarScopeNodes.clear();
    getRoot()?.removeAttribute(COMPOSER_DEBUG_ATTR);
    runtime.composerScrollGuardInitialOverflow = new WeakMap();
    runtime.composerScrollGuardLastAudit = {
      at: Date.now(), reason: 'cleared', found: 0, guarded: 0,
      visualBars: 0, nativeScrollbarScopes: 0, mentionActive: false
    };
  }

  // The inline composer may be a compact Work surface while the transcript
  // uses the full pane. Limit all candidates to the actual composer geometry.
  function shouldGuardComposerHorizontalTrack({
    mentionActive, widthExcess, scrollbarWidget, containsInput,
    canScrollX, previouslyGuarded, originalOverflowX
  }) {
    if (!mentionActive || widthExcess > 1) return false;
    return Boolean(scrollbarWidget ||
      (containsInput && (canScrollX || previouslyGuarded) &&
       originalOverflowX === 'scroll'));
  }

  // A scrollbar is not cosmetic if its owner (or a nearby scroll host)
  // actually contains horizontally scrollable content. Prefer retaining a
  // harmless track over disabling controls for code, chips or attachments.
  function isGenuineHorizontalScrollport(node) {
    if (!isElement(node) || !node.isConnected || node.clientWidth <= 0) return false;
    if (node.scrollWidth <= node.clientWidth + 1) return false;
    const css = getComputedStyle(node);
    return /^(auto|scroll|overlay)$/.test(css.overflowX);
  }

  function hasRealHorizontalScroll(element, boundary) {
    if (!isElement(element)) return false;
    for (let node = element, depth = 0;
      node && depth < 10; node = node.parentElement, depth += 1) {
      if (isGenuineHorizontalScrollport(node)) return true;
      if (node === boundary || node.matches('main,[role="main"],body,html')) break;
    }
    // Radix and similar scroll areas render the scrollbar *beside* its
    // viewport. Looking only at ancestors can hide a functional scrollbar.
    const scrollArea = element.closest(
      '[data-radix-scroll-area-root],[data-slot="scroll-area"],'+
      '[data-scroll-area-root],[data-testid="scroll-area"]'
    );
    if (scrollArea && (!boundary || boundary.contains(scrollArea) ||
        scrollArea.contains(boundary))) {
      const viewports = scrollArea.querySelectorAll(
        '[data-radix-scroll-area-viewport],[data-slot="scroll-area-viewport"],'+
        '[data-scroll-area-viewport],[data-testid="scroll-area-viewport"]'
      );
      for (const viewport of Array.from(viewports).slice(0, 12)) {
        if (isGenuineHorizontalScrollport(viewport)) return true;
      }
    }
    return false;
  }

  function mentionAtComposerCaret(input) {
    if (!isElement(input)) return false;
    let preceding = '';
    if (typeof input.value === 'string') {
      // An @ menu is contextual to the caret, not the end of the textarea.
      const position = Number.isInteger(input.selectionStart)
        ? input.selectionStart : input.value.length;
      preceding = input.value.slice(Math.max(0, position - 256), position);
    } else if (input.isContentEditable) {
      const selection = document.getSelection?.();
      if (selection?.rangeCount && input.contains(selection.anchorNode)) {
        try {
          const range = selection.getRangeAt(0).cloneRange();
          range.selectNodeContents(input);
          range.setEnd(selection.anchorNode, selection.anchorOffset);
          preceding = range.toString().slice(-256);
        } catch (_) { return false; }
      } else {
        return false;
      }
    } else {
      preceding = String(input.textContent || '').slice(-256);
    }
    return /(?:^|\s)@[^\s@]{0,64}$/u.test(preceding);
  }

  function getComposerScrollCandidates() {
    const pane = runtime.observedPane?.isConnected
      ? runtime.observedPane : resolveActivePane();
    const focused = document.activeElement;
    const focusedInput = isElement(focused)
      ? (focused.matches(SELECTOR.composerInput)
        ? focused : focused.closest(SELECTOR.composerInput)) : null;
    const input = focusedInput && pane?.contains(focusedInput)
      ? focusedInput : findComposerInput(pane);
    if (!input || !pane?.contains(input)) {
      return { candidates: [], visualCandidates: [], input: null, mentionActive: false };
    }

    const form = input.closest('form');
    const shell = form || input.closest(SELECTOR.composerShell) || input.parentElement;
    const shellRect = getVisibleRect(shell);
    const inputRect = getVisibleRect(input);
    if (!shellRect || shellRect.width < 100 || !inputRect) {
      return { candidates: [], visualCandidates: [], input, mentionActive: false };
    }

    const hasOtherFocusedEditor = isElement(focused) &&
      focused !== input && !input.contains(focused) &&
      Boolean(focused.closest('input,textarea,[contenteditable="true"],[role="textbox"]'));
    const mentionActive = !hasOtherFocusedEditor && mentionAtComposerCaret(input);
    const candidates = new Set();
    let node = input.parentElement;
    for (let depth = 0; node && node !== pane && depth < 18;
      depth += 1, node = node.parentElement) {
      candidates.add(node);
      const rect = getVisibleRect(node);
      // Large Work panes and document scroll containers are not composer hosts.
      if (depth > 4 && rect &&
          (rect.width > shellRect.width + 180 ||
           rect.height > Math.max(420, shellRect.height + 240))) break;
    }

    const shells = [shell, input.closest('#thread-bottom-container')].filter(Boolean);
    let outer = shell.parentElement;
    for (let depth = 0; outer && outer !== pane && depth < 3;
      depth += 1, outer = outer.parentElement) {
      const rect = getVisibleRect(outer);
      if (!rect || rect.width > shellRect.width + 110 ||
          rect.height > Math.max(420, shellRect.height + 230)) break;
      shells.push(outer);
    }

    // Look at nearby descendants and siblings. A visual bar may have no role,
    // scrollbar attribute, or overflow class and may live next to <form>.
    const visualNodes = new Set(runtime.composerVisualScrollbarNodes);
    let budget = 260;
    for (const root of shells) {
      if (!budget) break;
      for (const element of root.querySelectorAll('*')) {
        if (!budget--) break;
        if (element.matches(
          '[class*="overflow-"],[style*="overflow"],'+
          '[data-orientation="horizontal"],[role="scrollbar"],'+
          '[data-radix-scroll-area-viewport]'
        )) candidates.add(element);
        if (mentionActive) visualNodes.add(element);
      }
      if (mentionActive) {
        for (const sibling of root.parentElement?.children || []) {
          if (sibling !== root) visualNodes.add(sibling);
        }
      }
    }

    // Hit-test the actual pixels immediately below the composer. The native
    // ChatGPT structure can place a bar in a portal outside all nearby roots.
    // Only a thin, horizontally aligned, non-interactive surface qualifies.
    const probe = [];
    if (mentionActive && typeof document.elementsFromPoint === 'function') {
      const sampled = new Set();
      for (const xFraction of [0.16, 0.5, 0.84]) {
        const x = shellRect.left + shellRect.width * xFraction;
        for (const offset of [5, 10, 15, 20]) {
          const y = shellRect.bottom + offset;
          if (x < 0 || y < 0 || x >= innerWidth || y >= innerHeight) continue;
          for (const hit of document.elementsFromPoint(x, y).slice(0, 7)) {
            if (!isElement(hit) || sampled.has(hit)) continue;
            sampled.add(hit);
            const r = getVisibleRect(hit);
            if (!r || r.width < shellRect.width * 0.72 ||
                r.width > shellRect.width + 60 || r.height < 3 || r.height > 24 ||
                r.top < shellRect.bottom - 5 || r.top > shellRect.bottom + 24 ||
                Math.abs(r.left - shellRect.left) > 36 ||
                hit === input || hit.contains(input) ||
                hit.closest('[role="dialog"],[aria-modal="true"],'+
                  '[role="listbox"],[role="menu"],.monaco-editor,.cm-editor') ||
                hit.matches('button,input,textarea,[contenteditable],a,'+
                  '[role="button"],[role="textbox"],[role="option"]') ||
                hit.querySelector('button,input,textarea,[contenteditable],a,'+
                  '[role="button"],[role="textbox"],[role="option"],'+
                  '[role="listbox"],[role="menu"]') ||
                String(hit.textContent || '').trim()) continue;
            const style = getComputedStyle(hit);
            if (['auto','scroll','overlay'].includes(style.overflowX) &&
                hit.scrollWidth > hit.clientWidth) continue;
            if (style.position === 'fixed' || style.visibility === 'hidden') continue;
            // Portal geometry alone can match a menu border, loading bar or
            // another extension. Only a semantically identified scrollbar
            // may be hidden; retain the hit-test observation for diagnostics.
            const identifiedScrollbar = hit.matches(
              '[role="scrollbar"][aria-orientation="horizontal"],'+
              '[data-orientation="horizontal"]'
            ) || /(?:^|[\s_-])(scrollbar|scroll-thumb|scroll-track)(?:$|[\s_-])/i.test(
              typeof hit.className === 'string' ? hit.className : ''
            );
            if (identifiedScrollbar) visualNodes.add(hit);
            probe.push({ tag: hit.tagName.toLowerCase(), id: hit.id || '', 
              className: typeof hit.className === 'string'
                ? hit.className.slice(0, 70) : '',
              width: Math.round(r.width), height: Math.round(r.height),
              reason: 'under-composer-hit-test' });
          }
        }
      }
    }

    const list = [];
    const widthMin = shellRect.width * 0.58;
    const widthMax = shellRect.width + 100;
    const center = shellRect.left + shellRect.width / 2;
    const maxHeight = Math.max(420, shellRect.height + 230);
    for (const element of candidates) {
      if (!isConnectedElement(element) || element === input ||
          element.matches('textarea,[contenteditable="true"],[role="textbox"]') ||
          element.closest('[role="dialog"],[aria-modal="true"],'+
            '[role="listbox"],[role="menu"],.monaco-editor,.cm-editor')) continue;
      const rect = getVisibleRect(element);
      const retainedWidget = runtime.composerScrollGuardNodes.has(element) &&
        element.matches('[data-orientation="horizontal"],'+
          '[role="scrollbar"][aria-orientation="horizontal"]');
      if (retainedWidget && !rect &&
          !hasRealHorizontalScroll(element.parentElement, shell)) {
        list.push({ element, shouldGuard: true, previous: true,
          scrollbarWidget: true, overflowX: 'visible', widthExcess: 0,
          width: 0, height: 0 });
        continue;
      }
      if (!rect || rect.width < widthMin || rect.width > widthMax ||
          rect.height > maxHeight || rect.height < 8 ||
          Math.abs((rect.left + rect.width / 2) - center) > 95 ||
          rect.bottom < shellRect.top - 70 ||
          rect.top > shellRect.bottom + 60) continue;
      const style = getComputedStyle(element);
      const scrollbarWidget = (
        element.matches('[data-orientation="horizontal"],'+
          '[role="scrollbar"][aria-orientation="horizontal"]') &&
        rect.height <= 26 && rect.top >= shellRect.bottom - 16
      );
      const widthExcess = element.scrollWidth - element.clientWidth;
      const canScrollX = ['auto','scroll','overlay'].includes(style.overflowX);
      const previous = runtime.composerScrollGuardNodes.has(element);
      const originalX = previous
        ? runtime.composerScrollGuardInitialOverflow.get(element)
        : style.overflowX;
      // Clipping an overflowing editor host destroys keyboard/mouse scrolling.
      // Only suppress an empty *forced* track, or a verified cosmetic widget.
      const shouldGuard = !hasRealHorizontalScroll(element, shell) &&
        shouldGuardComposerHorizontalTrack({
        mentionActive, widthExcess, scrollbarWidget,
        containsInput: element.contains(input), canScrollX,
        previouslyGuarded: previous, originalOverflowX: originalX
      });
      list.push({ element, shouldGuard, previous, scrollbarWidget,
        overflowX: style.overflowX, widthExcess,
        width: Math.round(rect.width), height: Math.round(rect.height) });
    }

    const visualCandidates = [];
    if (mentionActive) {
      for (const element of visualNodes) {
        const previous = runtime.composerVisualScrollbarNodes.has(element);
        if (!isConnectedElement(element) || element === input ||
            element === shell || element === form ||
            element.matches('button,input,textarea,[contenteditable],[role="textbox"],'+
              '[role="listbox"],[role="menu"],[role="button"],a') ||
            element.closest('[role="dialog"],[aria-modal="true"],'+
              '[role="listbox"],[role="menu"],.monaco-editor,.cm-editor')) continue;
        // Preserve hidden previous candidates until the active mention ends:
        // inspecting their zero-sized layout would make the guard flicker.
        if (previous && !hasRealHorizontalScroll(element, shell) &&
            !element.querySelector('button,a,[tabindex]:not([tabindex="-1"]),'+
              '[role="slider"],[role="button"]')) {
          visualCandidates.push({ element, previous, shouldHide: true,
            width: 0, height: 0, reason: 'retained-active-mention' });
          continue;
        }
        const rect = getVisibleRect(element);
        if (!rect || rect.height < 4 || rect.height > 22 ||
            rect.width < shellRect.width * 0.77 ||
            rect.width > shellRect.width + 24 ||
            Math.abs(rect.left - shellRect.left) > 28 ||
            rect.top < inputRect.bottom - 5 ||
            rect.top > Math.max(shellRect.bottom + 26, inputRect.bottom + 68) ||
            String(element.textContent || '').trim() ||
            element.matches('[aria-live]') ||
            element.querySelector('button,input,textarea,[contenteditable],'+
              '[role="button"],[role="option"],[role="listbox"]')) continue;
        const css = getComputedStyle(element);
        // Don't hide a genuine scrollport's content just because its visible
        // container has the shape of a scrollbar track.
        if (['auto','scroll','overlay'].includes(css.overflowX) &&
            element.scrollWidth > element.clientWidth) continue;
        if (css.position === 'fixed' || css.visibility === 'hidden') continue;
        // Geometry alone also matches progress indicators, subtle borders and
        // loading placeholders. Only hide an explicitly identified scrollbar.
        const className = typeof element.className === 'string' ? element.className : '';
        const isScrollbar = element.matches(
          '[role="scrollbar"][aria-orientation="horizontal"],'+
          '[data-orientation="horizontal"]'
        ) || /(?:^|[\s_-])(scrollbar|scroll-thumb|scroll-track)(?:$|[\s_-])/i.test(className);
        if (!isScrollbar || hasRealHorizontalScroll(element, shell)) continue;
        visualCandidates.push({ element, previous, shouldHide: true,
          width: Math.round(rect.width), height: Math.round(rect.height),
          reason: 'mention-adjacent-thin-bar' });
      }
    }
    return { candidates: list, visualCandidates, input, mentionActive, probe };
  }

  // Read-only inspection of the compositor strip and its surrounding DOM.
  // This is deliberately independent of the script's own guessed candidates.
  function getComposerBarSurfaceProbe(input) {
    const form = input?.closest('form');
    const shell = form || input?.closest(SELECTOR.composerShell);
    const rect = shell && getVisibleRect(shell);
    if (!rect) return { reason: 'composer-shell-not-visible', points: [], ancestry: [] };
    const ancestry = [];
    for (let node = input, depth = 0; node && depth < 12;
      node = node.parentElement, depth += 1) {
      const r = getVisibleRect(node);
      if (!r) continue;
      const css = getComputedStyle(node);
      ancestry.push({ tag: node.tagName.toLowerCase(), id: node.id || '',
        className: typeof node.className === 'string' ? node.className.slice(0, 80) : '',
        width: Math.round(r.width), height: Math.round(r.height),
        overflowX: css.overflowX, scrollWidth: node.scrollWidth,
        clientWidth: node.clientWidth, scrollLeft: node.scrollLeft });
      if (node.matches('main,[role="main"]')) break;
    }
    const points = [];
    if (typeof document.elementsFromPoint === 'function') {
      for (const offset of [5, 10, 15]) {
        const x = Math.round(rect.left + rect.width / 2);
        const y = Math.round(rect.bottom + offset);
        if (x < 0 || y < 0 || x >= innerWidth || y >= innerHeight) continue;
        points.push({ x, y, elements: document.elementsFromPoint(x, y)
          .slice(0, 6).map(node => {
            const r = getVisibleRect(node);
            const css = getComputedStyle(node);
            return { tag: node.tagName.toLowerCase(), id: node.id || '',
              className: typeof node.className === 'string'
                ? node.className.slice(0, 80) : '',
              width: r ? Math.round(r.width) : 0,
              height: r ? Math.round(r.height) : 0,
              top: r ? Math.round(r.top) : 0,
              overflowX: css.overflowX,
              scrollWidth: node.scrollWidth, clientWidth: node.clientWidth,
              text: String(node.textContent || '').trim().slice(0, 45) };
          }) });
      }
    }
    return { shell: { left: Math.round(rect.left), top: Math.round(rect.top),
      bottom: Math.round(rect.bottom), width: Math.round(rect.width),
      height: Math.round(rect.height) }, points, ancestry };
  }

  function getComposerOverflowDiagnostics() {
    const scan = getComposerScrollCandidates();
    const describe = ({ element, ...details }) => ({
      tag: element.tagName.toLowerCase(),
      id: element.id || '',
      className: typeof element.className === 'string'
        ? element.className.slice(0, 100) : '',
      ...details
    });
    return {
      version: VERSION,
      inputFound: Boolean(scan.input),
      mentionActive: scan.mentionActive,
      guardCount: runtime.composerScrollGuardNodes.size,
      visualBarCount: runtime.composerVisualScrollbarNodes.size,
      nativeScrollbarScopeCount: runtime.composerMentionScrollbarScopeNodes.size,
      mentionPopup: inspectMentionPopup(scan.input, scan.mentionActive).result,
      lastMentionPopupAudit: runtime.mentionPopupLastAudit,
      surfaceProbe: getComposerBarSurfaceProbe(scan.input),
      hitTestCandidates: scan.probe || [],
      candidates: scan.candidates.filter(item => item.shouldGuard ||
        item.previous || item.widthExcess > 0).map(describe),
      visualCandidates: scan.visualCandidates.map(describe),
      lastAudit: runtime.composerScrollGuardLastAudit
    };
  }

  // CSP-safe console fallback: the page dispatches a plain DOM Event and
  // receives read-only JSON via an HTML attribute (no inline script injection).
  function onComposerDebugRequest() {
    try {
      const result = JSON.stringify(getComposerOverflowDiagnostics());
      getRoot()?.setAttribute(COMPOSER_DEBUG_ATTR, result);
    } catch (error) {
      getRoot()?.setAttribute(COMPOSER_DEBUG_ATTR,
        JSON.stringify({ version: VERSION, error: String(error?.message || error) }));
    }
  }

  function auditComposerScrollGuard() {
    if (!runtime.started || !settings.enabled || !settings.widenComposer ||
        !isWideActive() || runtime.safeFallbackActive) {
      clearComposerScrollGuard();
      return;
    }
    const scan = getComposerScrollCandidates();
    if (!scan.input) {
      clearComposerScrollGuard();
      return;
    }
    auditMentionPopup(scan.input, scan.mentionActive);
    const next = new Set(scan.candidates.filter(item => item.shouldGuard)
      .map(item => item.element));
    for (const previous of runtime.composerScrollGuardNodes) {
      if (!next.has(previous)) {
        setBooleanAttribute(previous, COMPOSER_SCROLL_GUARD_ATTR, false);
      }
    }
    for (const element of next) {
      if (!runtime.composerScrollGuardNodes.has(element)) {
        runtime.composerScrollGuardInitialOverflow.set(
          element, getComputedStyle(element).overflowX
        );
      }
      setBooleanAttribute(element, COMPOSER_SCROLL_GUARD_ATTR, true);
    }
    runtime.composerScrollGuardNodes = next;

    const nextBars = new Set(scan.visualCandidates.filter(item => item.shouldHide)
      .map(item => item.element));
    for (const previous of runtime.composerVisualScrollbarNodes) {
      if (!nextBars.has(previous)) {
        setBooleanAttribute(previous, COMPOSER_VISUAL_SCROLLBAR_ATTR, false);
      }
    }
    for (const element of nextBars) {
      setBooleanAttribute(element, COMPOSER_VISUAL_SCROLLBAR_ATTR, true);
    }
    runtime.composerVisualScrollbarNodes = nextBars;

    // Chrome may show a native horizontal scrollbar without any matching
    // element or measurable scrollWidth overflow. Apply a cosmetic scrollbar
    // track rule to only nearby, same-width composer hosts while @ is active.
    const nextScopes = new Set();
    if (scan.mentionActive) {
      const form = scan.input.closest('form');
      const shell = form || scan.input.closest(SELECTOR.composerShell);
      const shellRect = shell && getVisibleRect(shell);
      let node = form || shell;
      for (let depth = 0; node && shellRect && depth < 8;
        node = node.parentElement, depth += 1) {
        const r = getVisibleRect(node);
        if (!r || node.matches('main,[role="main"],body,html') ||
            r.width > shellRect.width + 120 ||
            r.height > Math.max(360, shellRect.height + 240)) break;
        // Only a scrollbar-forced track with no scrollable horizontal
        // content can be cosmetically suppressed. Keep genuine scrollports.
        const style = getComputedStyle(node);
        if (r.width >= shellRect.width * 0.72 &&
            style.overflowX === 'scroll' &&
            node.scrollWidth <= node.clientWidth + 1) {
          nextScopes.add(node);
        }
      }
    }
    for (const previous of runtime.composerMentionScrollbarScopeNodes) {
      if (!nextScopes.has(previous)) {
        setBooleanAttribute(previous, COMPOSER_MENTION_SCROLL_SCOPE_ATTR, false);
      }
    }
    for (const element of nextScopes) {
      setBooleanAttribute(element, COMPOSER_MENTION_SCROLL_SCOPE_ATTR, true);
    }
    runtime.composerMentionScrollbarScopeNodes = nextScopes;
    runtime.composerScrollGuardLastAudit = {
      at: Date.now(), found: scan.candidates.length,
      guarded: next.size, visualBars: nextBars.size,
      nativeScrollbarScopes: nextScopes.size,
      mentionActive: scan.mentionActive
    };
  }

  function scheduleComposerScrollGuardAudit() {
    if (!runtime.started || !settings.enabled) return;
    if (runtime.composerScrollGuardFrame) {
      cancelNextFrame(runtime.composerScrollGuardFrame);
    }
    const epoch = currentRuntimeEpoch();
    runtime.composerScrollGuardFrame = requestNextFrame(() => {
      runtime.composerScrollGuardFrame = 0;
      if (rejectStaleCallback(epoch, 'composer-overflow-audit')) return;
      auditComposerScrollGuard();
    });
    // React may mount @-mention UI asynchronously after the input event.
    if (runtime.composerScrollGuardTimer) {
      clearTimeout(runtime.composerScrollGuardTimer);
    }
    runtime.composerScrollGuardTimer = setTimeout(() => {
      runtime.composerScrollGuardTimer = 0;
      if (rejectStaleCallback(epoch, 'composer-overflow-delayed')) return;
      auditComposerScrollGuard();
    }, 110);
    // Some autocomplete/scroll-area widgets settle after the first
    // animation frame. One final bounded audit handles these delayed mounts.
    if (runtime.composerScrollGuardLateTimer) {
      clearTimeout(runtime.composerScrollGuardLateTimer);
    }
    runtime.composerScrollGuardLateTimer = setTimeout(() => {
      runtime.composerScrollGuardLateTimer = 0;
      if (rejectStaleCallback(epoch, 'composer-overflow-late')) return;
      auditComposerScrollGuard();
    }, 380);
  }

  function onComposerActivity(event) {
    if (event?.isComposing || event?.keyCode === 229) return;
    const target = event?.target;
    const activeComposerTarget = isElement(target) &&
      (target.matches?.(SELECTOR.composerInput) ||
       target.closest?.(SELECTOR.composerInput));
    if (!activeComposerTarget) {
      // Switching to an unrelated editor must release an earlier @ guard.
      if (event?.type === 'focusin' && isElement(target) &&
          target.matches('input,textarea,[contenteditable="true"],[role="textbox"]')) {
        scheduleComposerScrollGuardAudit();
      }
      return;
    }
    scheduleComposerScrollGuardAudit();
  }

  function onComposerFocusOut(event) {
    const target = event?.target;
    if (!isElement(target) || !(target.matches?.(SELECTOR.composerInput) ||
        target.closest?.(SELECTOR.composerInput))) return;
    // The next focus target is not settled during focusout; perform a
    // frame-delayed reconciliation rather than clearing a menu prematurely.
    scheduleComposerScrollGuardAudit();
  }

  function markComposer(desired, main) {
    if (!settings.widenComposer) {
      return;
    }

    const input =
      findComposerInput(main);

    if (!input) {
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
      const raw = String(element.textContent || '');
      // Most candidate containers are not notices. Avoid expensive computed
      // styles and whitespace normalization for clearly unrelated text.
      if (raw.length < 8 || !/free/i.test(raw)) {
        return false;
      }
      const text = raw.replace(/\s+/g, ' ').trim().toLowerCase();

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
          !hasFreePlanNoticeText(element) ||
          !isVisibleElement(element)
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

  function markPlanNotice(desired, main) {
    runtime.lastPlanNoticeScanAt = Date.now();
    if (!main || !isWideActive()) {
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

  function fingerprintFromCapabilities(capabilities) {
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

  function computeDomFingerprint() {
    return fingerprintFromCapabilities(detectDomCapabilities());
  }

  function updateDomFingerprint(reason = 'scan', capabilities = null) {
    const next = capabilities
      ? fingerprintFromCapabilities(capabilities)
      : computeDomFingerprint();
    const previous = runtime.lastDomFingerprint;
    const changed = Boolean(previous && previous !== next);

    runtime.lastDomFingerprint = next;
    runtime.lastDomFingerprintAt = Date.now();

    if (changed) {
      // Structural changes invalidate early document-start health snapshots.
      // This does not trigger a layout repair or introduce another scan loop.
      runtime.lastSelectorHealthAt = 0;
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

  function getPaneOverflow(rect, paneRect) {
    return {
      leftPx: Math.max(0, paneRect.left - rect.left),
      rightPx: Math.max(0, rect.right - paneRect.right)
    };
  }

  function isCanonicalComposer(composer) {
    return Boolean(composer && (
      composer.matches?.('#thread-bottom-container,#thread-bottom') ||
      composer.closest?.('#thread-bottom-container,#thread-bottom') ||
      composer.querySelector?.('#thread-bottom-container,#thread-bottom')
    ));
  }

  function inspectConversationPosition(
    bound = getVisibleRect(resolveActivePane())
  ) {
    const result = {
      checked: false,
      ok: true,
      paneLeft: bound ? +bound.left.toFixed(1) : null,
      paneRight: bound ? +bound.right.toFixed(1) : null,
      paneWidth: bound ? +bound.width.toFixed(1) : null,
      contentLeft: null,
      contentRight: null,
      clippedLeftPx: 0,
      clippedRightPx: 0,
      leftPx: 0,
      rightPx: 0,
      sampled: 0
    };
    if (!bound) return result;

    // Reuse managed turns. Query only one content anchor per turn instead of
    // walking every message in a long conversation on every verification.
    const turns = Array.from(runtime.marked.get(ATTR.turn) || []).slice(-80);
    for (const turn of turns) {
      if (result.sampled >= 20) break;
      const anchor = turn?.querySelector?.(
        '[data-markdown-text-style="assistant-message"],' +
        '[data-user-message-bubble="true"]'
      ) || turn;
      const rect = getVisibleRect(anchor);
      if (!rect || rect.top >= (window.innerHeight || 0) || rect.bottom <= 0) {
        continue;
      }
      const overflow = getPaneOverflow(rect, bound);
      if (!result.sampled) {
        result.contentLeft = +rect.left.toFixed(1);
        result.contentRight = +rect.right.toFixed(1);
      }
      result.sampled += 1;
      result.leftPx = Math.max(result.leftPx, overflow.leftPx);
      result.rightPx = Math.max(result.rightPx, overflow.rightPx);
    }
    result.leftPx = Math.round(result.leftPx * 100) / 100;
    result.rightPx = Math.round(result.rightPx * 100) / 100;
    result.clippedLeftPx = result.leftPx;
    result.clippedRightPx = result.rightPx;
    result.checked = result.sampled > 0;
    result.ok = result.leftPx <= 8 && result.rightPx <= 8;
    return result;
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

    const position = inspectConversationPosition();
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

    // ChatGPT Work can have a compact, independent input (e.g. 720px) while
    // the transcript fills the pane. Only require full composer width when
    // ChatGPT's canonical full-width bottom container actually exists.
    // Otherwise a permanent false failure causes full scans every ~50ms.
    const canonicalComposer = isCanonicalComposer(composer);
    const composerWidthRequired = settings.widenComposer && canonicalComposer;

    const checks = {
      turn: !shouldVerify || !turn ||
        Math.abs(turnWidth - expected) <= tolerance ||
        turnWidth >= expected * 0.90,
      composer: !shouldVerify || !composerWidthRequired || !composer ||
        Math.abs(composerWidth - expected) <= tolerance ||
        composerWidth >= expected * 0.90,
      paneBound: !shouldVerify ||
        (!turnWidth || turnWidth <= paneWidth + 4) &&
        (!composerWidth || composerWidth <= paneWidth + 4),
      // A 1128px-wide message behind the sidebar is NOT healthy just
      // because its width is below the pane width. Use its actual position.
      panePosition: !shouldVerify || position.sampled === 0 ||
        (position.clippedLeftPx <= 8 && position.clippedRightPx <= 8)
    };

    const result = {
      ok: Object.values(checks).every(Boolean),
      checkedAt: Date.now(),
      paneWidth,
      position,
      measuredPaneCssWidth: runtime.sizedPane?.style.getPropertyValue('--uwc-content-width') || null,
      expectedWidth: expected,
      tolerance,
      turnWidth,
      composerWidth,
      composerWidthRequired,
      composerMode: !composer ? 'none' : (canonicalComposer ? 'canonical' : 'independent'),
      composerLayout: canonicalComposer ? 'canonical-thread-bottom' : 'independent-work-or-custom',
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
      markerAttributeDrift: hasMarkerAttributeDrift(),
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

    if (desired.markers && actual.markerAttributeDrift) {
      failures.push(FAILURE_CODE.MARKER_ATTRIBUTE_DRIFT);
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
      !actual.composerMarker &&
      findComposerInput(runtime.observedPane || resolveActivePane())
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
      set.has(FAILURE_CODE.DISCONNECTED_MARKERS) ||
      set.has(FAILURE_CODE.MARKER_ATTRIBUTE_DRIFT)
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
      runtime.reconcileInProgress ||
      runtime.reconcilePendingVerification ||
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

  function getHealthBreakdown(refreshSelectors = false) {
    const verification =
      verifyRuntime();

    const width =
      runtime.lastWidthVerification ||
      verifyAppliedWidths();

    const compatibility =
      runtime.lastCompatibility ||
      evaluateCompatibility();

    const selectors =
      getSelectorHealthSummary(refreshSelectors);

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

  function calculateHealthScore(refreshSelectors = false) {
    const result =
      getHealthBreakdown(refreshSelectors);

    runtime.healthScore =
      result.score;
    runtime.healthStatus =
      result.status;
    runtime.healthBreakdown =
      result.breakdown;
    runtime.healthSnapshotDirty = false;

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
      calculateHealthScore(true);
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
      'low-power-settings-contract',
      () => ({
        ok:
          normalizeSettings({}).lowPowerMode === true &&
          normalizeSettings({lowPowerMode: false}).lowPowerMode === false &&
          normalizeSettings({lowPowerMode: 'false'}).lowPowerMode === true
      })
    );

    test(
      'low-power-stream-mutation-contract',
      () => {
        const turn = document.createElement('article');
        turn.setAttribute(ATTR.turn, '1');
        const container = document.createElement('div');
        turn.appendChild(container);
        const normal = document.createElement('span');
        const structural = document.createElement('div');
        structural.setAttribute('data-turn-key', 'synthetic');
        const textRecord = {
          type: 'childList',
          target: container,
          addedNodes: [normal],
          removedNodes: []
        };
        const structuralRecord = {
          ...textRecord,
          addedNodes: [structural]
        };
        return {
          ok:
            isManagedContentOnlyMutationBatch([textRecord]) ===
              settings.lowPowerMode &&
            !isManagedContentOnlyMutationBatch([structuralRecord])
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
      'performance-severity-grading',
      () => ({
        ok:
          performanceScoreFromExcess(0, 0) === 100 &&
          performanceScoreFromExcess(0.1, 1) >= 99 &&
          performanceScoreFromExcess(0.1, 1) >
            performanceScoreFromExcess(20, 1) &&
          performanceScoreFromExcess(16 * 10, 10) === 0
      })
    );

    test(
      'performance-manual-test-exclusion',
      () => {
        const before = getPerformanceBudgetReport();
        const score = before.score;
        // Both the numerator and denominator exclude selfTest operation
        // timings; a counterexample can be tested without live DOM mutation.
        const sampled = Object.values(before.operations)
          .filter((item) => item.name !== 'selfTest');
        const count = sampled.reduce((n, item) => n + item.samples, 0);
        const excess = sampled.reduce((n, item) => n + (item.overBudgetMs || 0), 0);
        return {
          ok: score === performanceScoreFromExcess(excess, count) &&
            before.excludedFromHealthScore.includes('selfTest')
        };
      }
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

    test(
      'initial-layout-contract',
      () => ({
        ok:
          runtime.started &&
          (!settings.enabled ||
            runtime.scanCount > 0 ||
            Boolean(runtime.animationFrame) ||
            Boolean(runtime.scanTimer) ||
            Boolean(runtime.idleCallback))
      })
    );

    test(
      'marker-drift-recovery',
      () => {
        const previous = runtime.marked.get(ATTR.turn);
        const stub = {
          isConnected: true,
          value: null,
          getAttribute() { return this.value; },
          hasAttribute() { return this.value !== null; },
          setAttribute(_, value) { this.value = String(value); },
          removeAttribute() { this.value = null; }
        };
        try {
          runtime.marked.set(ATTR.turn, new Set([stub]));
          const detected = hasMarkerAttributeDrift() && !hasConnectedMarker(ATTR.turn);
          const desired = createDesiredMarkers();
          for (const [attribute, elements] of runtime.marked) {
            desired.set(attribute, new Set(elements));
          }
          applyMarkerDiff(desired);
          return { ok: detected && hasConnectedMarker(ATTR.turn) && !hasMarkerAttributeDrift() };
        } finally {
          runtime.marked.set(ATTR.turn, previous);
        }
      }
    );

    test(
      'composer-horizontal-scroll-eligibility',
      () => {
        const base = {
          mentionActive: true, widthExcess: 0,
          scrollbarWidget: false, containsInput: true,
          canScrollX: true, previouslyGuarded: false,
          originalOverflowX: 'scroll'
        };
        return { ok:
          shouldGuardComposerHorizontalTrack(base) &&
          !shouldGuardComposerHorizontalTrack({ ...base, mentionActive: false }) &&
          !shouldGuardComposerHorizontalTrack({ ...base, widthExcess: 2 }) &&
          !shouldGuardComposerHorizontalTrack({ ...base, originalOverflowX: 'auto' }) &&
          !shouldGuardComposerHorizontalTrack({ ...base, containsInput: false }) &&
          shouldGuardComposerHorizontalTrack({ ...base, scrollbarWidget: true, containsInput: false }) &&
          !shouldGuardComposerHorizontalTrack({ ...base, scrollbarWidget: true, widthExcess: 5 })
        };
      }
    );

    test(
      'mention-caret-context',
      () => {
        const textarea = document.createElement('textarea');
        textarea.value = 'Ask @al about code';
        textarea.setSelectionRange(7, 7);
        const middle = mentionAtComposerCaret(textarea);
        textarea.setSelectionRange(textarea.value.length, textarea.value.length);
        const end = mentionAtComposerCaret(textarea);
        textarea.value = 'write test@example.com';
        textarea.setSelectionRange(textarea.value.length, textarea.value.length);
        const email = mentionAtComposerCaret(textarea);
        textarea.value = 'Hello @';
        textarea.setSelectionRange(textarea.value.length, textarea.value.length);
        const empty = mentionAtComposerCaret(textarea);
        textarea.value = 'Hello @one@two';
        textarea.setSelectionRange(textarea.value.length, textarea.value.length);
        const doubleAt = mentionAtComposerCaret(textarea);
        return { ok: middle && !end && !email && empty && !doubleAt };
      }
    );

    test(
      'scrollport-horizontal-ownership',
      () => {
        // A disconnected scrollport must never count as verified live UI.
        const root = document.createElement('div');
        const viewport = document.createElement('div');
        root.appendChild(viewport);
        return { ok: !isGenuineHorizontalScrollport(viewport) &&
          !hasRealHorizontalScroll(viewport, root) };
      }
    );

    test(
      'composer-css-toggle-and-local-width-boundary',
      () => {
        const previous = settings.widenComposer;
        const localWidth = '--thread-content-max-width:min(100%,var(--uwc-content-width))!important;';
        try {
          settings.widenComposer = true;
          const enabledCss = buildMainCss();
          settings.widenComposer = false;
          const disabledCss = buildMainCss();
          return {
            ok: enabledCss.includes(localWidth) &&
              enabledCss.includes('overflow-x:clip!important;') &&
              enabledCss.includes('#thread-bottom-container{\n  width:100%!important;') &&
              enabledCss.includes('[data-uwc-composer-scroll-guard="1"]') &&
              enabledCss.includes(`#thread-bottom-container[${ATTR.composer}="1"]{\n  width:100%!important;\n  max-width:100%!important;`) &&
              !disabledCss.includes(localWidth) &&
              enabledCss.includes('[data-uwc-composer-visual-scrollbar="1"]') &&
              !disabledCss.includes('[data-uwc-composer-scroll-guard="1"]')
          };
        } finally {
          settings.widenComposer = previous;
        }
      }
    );

    test(
      'mutation-intent-consumption',
      () => {
        const element = document.createElement('div');
        const record = {
          target: element,
          type: 'attributes',
          attributeName: 'data-uwc-test'
        };
        markMutationIntent(element, 'attributes', record.attributeName);
        return {
          ok: hasMutationIntent(record) && !hasMutationIntent(record)
        };
      }
    );

    test(
      'disabled-root-contract',
      () => {
        if (settings.enabled) return { ok: true, skipped: true };
        setRootState();
        return { ok: rootStateMatches() };
      }
    );

    test(
      'reconciliation-pending-queue-contract',
      () => {
        const oldPending = runtime.reconcilePendingVerification;
        const oldFrame = runtime.queuedReconciliationFrame;
        const oldReasons = new Set(runtime.queuedReconciliationReasons);
        try {
          runtime.reconcilePendingVerification = true;
          runtime.queuedReconciliationFrame = 0;
          runtime.queuedReconciliationReasons.add('contract-test');
          return { ok: scheduleQueuedReconciliation() === false };
        } finally {
          runtime.reconcilePendingVerification = oldPending;
          runtime.queuedReconciliationFrame = oldFrame;
          runtime.queuedReconciliationReasons.clear();
          oldReasons.forEach((value) => runtime.queuedReconciliationReasons.add(value));
        }
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

    const markedPanes = runtime.marked.get(ATTR.pane);
    if (settings.enabled && (
      hasMarkerAttributeDrift() ||
      (pane ? !markedPanes?.has(pane) : markedPanes?.size)
    )) {
      failures.push(FAILURE_CODE.MARKER_ATTRIBUTE_DRIFT);
    }

    if (
      settings.enabled &&
      runtime.lastTurnCount > 0 &&
      !hasConnectedMarker(ATTR.turn)
    ) {
      failures.push(FAILURE_CODE.TURN_MARKERS_MISSING);
    }

    if (
      settings.enabled &&
      settings.widenComposer &&
      !hasConnectedMarker(ATTR.composer) &&
      findComposerInput(pane)
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

  // Running a health report inside the watchdog repeats its own layout and
  // selector checks, and is unnecessary unless someone requests diagnostics.
  // The watchdog continues to verify/repair the layout on its usual schedule.
  function deferWatchdogHealthRefresh() {
    runtime.healthSnapshotDirty = true;
    runtime.watchdogHealthDeferrals += 1;
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
      deferWatchdogHealthRefresh();
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
      deferWatchdogHealthRefresh();
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
      deferWatchdogHealthRefresh();
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
      deferWatchdogHealthRefresh();
      return true;
    }

    runtime.enforcementRetryCount = 0;
    runtime.enforcementLevel = 0;
    runtime.lastEnforcementFailures = [];
    deferWatchdogHealthRefresh();
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
      const pane = resolveActivePane();
      const previousPanes = runtime.marked.get(ATTR.pane);
      if (pane ? !previousPanes?.has(pane) : previousPanes?.size) {
        ALL_DIRTY_REGIONS.forEach((region) => dirty.add(region));
      }
      attachPaneResizeObserver(pane);

      const desired = createDesiredMarkers();
      seedDesiredMarkers(desired, dirty);
      addDesiredMarker(desired, ATTR.pane, pane);

      if (dirty.has(DIRTY.split)) {
        detectCanvas();
      }

      if (dirty.has(DIRTY.conversation)) {
        markConversation(desired, pane);
      }

      if (dirty.has(DIRTY.composer)) {
        markComposer(desired, pane);
      }

      if (dirty.has(DIRTY.notice)) {
        markPlanNotice(desired, pane);
      }

      applyMarkerDiff(desired);
      scheduleComposerScrollGuardAudit();
      const capabilities = detectDomCapabilities(true);
      evaluateCompatibility(capabilities);
      setRootState();
      updateDomFingerprint('scan', capabilities);
      scheduleClipAlignment();
      verifyAppliedWidths();
      runtime.scanCount += 1;

      const scanInvariants =
        evaluateLayoutInvariants();

      if (runtime.reconcilePendingVerification) {
        runtime.reconcilePendingVerification = false;
        runtime.reconcilePendingSince = 0;
        const widthCheck = runtime.lastWidthVerification || verifyAppliedWidths();
        if (widthCheck.ok && scanInvariants.ok) {
          runtime.postScanFailureSignature = '';
          runtime.postScanSameFailureCount = 0;
          runtime.postScanRepairPaused = false;
          runtime.queuedReconciliationReasons.delete('post-scan-verification');
          // Preserve other pending reasons, without creating a new loop.
          scheduleQueuedReconciliation();
        } else {
          const failureSignature = JSON.stringify({
            width: widthCheck.checks,
            invariantFailures: scanInvariants.failures,
            fingerprint: runtime.lastDomFingerprint,
            paneWidth: Math.round(widthCheck.paneWidth / 8) * 8
          });
          runtime.postScanSameFailureCount =
            failureSignature === runtime.postScanFailureSignature
              ? runtime.postScanSameFailureCount + 1
              : 1;
          runtime.postScanFailureSignature = failureSignature;
          if (runtime.postScanSameFailureCount <= 2) {
            runtime.queuedReconciliationReasons.add('post-scan-verification');
            scheduleQueuedReconciliation();
          } else {
            runtime.postScanRepairPaused = true;
            runtime.queuedReconciliationReasons.delete('post-scan-verification');
            pushDebugEvent('reconciliation-paused-repeated-failure', {
              repeats: runtime.postScanSameFailureCount,
              widthChecks: widthCheck.checks,
              invariantFailures: scanInvariants.failures
            });
            scheduleQueuedReconciliation();
          }
        }
      } else {
        processInvariantResult(scanInvariants);
      }

      syncDebugOverlay();
    } catch (error) {
      // A failed asynchronous scan cannot leave reconciliation locked.
      runtime.reconcilePendingVerification = false;
      runtime.reconcilePendingSince = 0;
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
    }, settings.lowPowerMode
      ? Math.max(settings.scanDebounceMs, CONFIG.lowPowerScanDebounceMs)
      : settings.scanDebounceMs);

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
      `UltraWide ${VERSION}`,
      `wide=${isWideActive() ? 'active' : 'inactive'} cap=${settings.cap}`,
      `pane=${getAdaptiveWidth()}x${runtime.effectivePaneHeight || 0}`,
      `turns=${runtime.lastTurnCount}/${runtime.lastRawTurnCount}`,
      `composer=${hasConnectedMarker(ATTR.composer) ? 'yes' : 'no'} split=${runtime.canvasDetected ? 'yes' : 'no'}`,
      `compat=${compatibility.status} strategy=${compatibility.strategy}`,
      `safe=${runtime.safeFallbackActive ? runtime.safeFallbackReason || 'active' : 'off'}`
    ];

    // Text-only DOM updates work under Trusted Types enforcement and avoid
    // parsing runtime diagnostics as HTML.
    const fragment = document.createDocumentFragment();
    rows.forEach((value, index) => {
      const line = document.createElement('div');
      if (index === 0) {
        const title = document.createElement('strong');
        title.textContent = value;
        line.appendChild(title);
      } else {
        line.textContent = value;
      }
      fragment.appendChild(line);
    });
    overlay.replaceChildren(fragment);
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
      return settings.lowPowerMode ? 30000 : CONFIG.enforcementStableIntervalMs;
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
      return settings.lowPowerMode ? 1500 : CONFIG.enforcementUnstableIntervalMs;
    }

    if (now - recentActivity < 5000) {
      return settings.lowPowerMode ? 4500 : CONFIG.enforcementActiveIntervalMs;
    }

    if (runtime.stableWatchdogPasses >= 8) {
      return settings.lowPowerMode ? 30000 : CONFIG.enforcementStableIntervalMs;
    }

    return settings.lowPowerMode ? 15000 : CONFIG.enforcementNormalIntervalMs;
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
      }, settings.lowPowerMode
        ? Math.max(settings.repairIntervalMs, CONFIG.lowPowerRepairIntervalMs)
        : settings.repairIntervalMs);

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
      }, settings.lowPowerMode
        ? Math.max(settings.routePollMs, CONFIG.lowPowerRoutePollMs)
        : settings.routePollMs);

    scheduleEnforcementWatchdog(settings.lowPowerMode
      ? 4500
      : CONFIG.enforcementActiveIntervalMs);
    startClipAlignmentTimer();
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

    const previousLowPower =
      settings.lowPowerMode;

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
      previousLowPower !== settings.lowPowerMode ||
      previousRepair !==
        settings.repairIntervalMs ||
      previousRoute !==
        settings.routePollMs;

    if (previousLowPower !== settings.lowPowerMode) {
      runtime.lastCapabilitiesAt = 0;
      runtime.lastSelectorHealthAt = 0;
    }

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
    runtime.lastCapabilitiesAt = 0;
    runtime.lastPlanNoticeScanAt = 0;
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

  function isManagedContentOnlyMutationBatch(records) {
    if (!settings.lowPowerMode || !records?.length) {
      return false;
    }

    for (const record of records) {
      if (record.type !== 'childList' || !isElement(record.target)) {
        return false;
      }

      // Text and presentation changes in a managed turn do not affect
      // which structural nodes need width markers.
      const turn = record.target.closest(`[${ATTR.turn}]`);
      if (!turn || record.target.closest(`[${ATTR.planNotice}]`)) {
        return false;
      }

      const added = record.addedNodes || [];
      const removed = record.removedNodes || [];
      if (
        added.length > CONFIG.maxMutationNodes ||
        removed.length > CONFIG.maxMutationNodes
      ) {
        return false;
      }

      for (const node of [...added, ...removed]) {
        if (nodeMayRequireScan(node)) {
          return false;
        }
      }
    }

    return true;
  }

  function mutationMayContainPlanNotice(record) {
    const candidates = [record.target, ...(record.addedNodes || [])];
    return candidates.some((node) =>
      isElement(node) &&
      node.childElementCount <= 5 &&
      hasFreePlanNoticeText(node)
    );
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
      if (record.type === 'attributes') {
        // React and other extensions may remove an existing managed marker.
        // Schedule the relevant region even after the selector stops matching.
        if (record.attributeName === ATTR.pane) dirty.add(DIRTY.root);
        if ([ATTR.conversationRoot, ATTR.conversationPath, ATTR.turn, ATTR.turnPath]
          .includes(record.attributeName)) dirty.add(DIRTY.conversation);
        if ([ATTR.composer, ATTR.composerPath]
          .includes(record.attributeName)) dirty.add(DIRTY.composer);
        if ([ATTR.planNotice, ATTR.planNoticePath]
          .includes(record.attributeName)) dirty.add(DIRTY.notice);
        inspectNode(record.target);
      }

      if (
        record.type === 'childList' &&
        isElement(record.target)
      ) {
        try {
          if (record.target.closest(SELECTOR.main)) {
            if (
              !settings.lowPowerMode ||
              Date.now() - runtime.lastPlanNoticeScanAt >=
                CONFIG.lowPowerNoticeThrottleMs ||
              record.target.closest(`[${ATTR.planNotice}]`) ||
              mutationMayContainPlanNotice(record)
            ) {
              dirty.add(DIRTY.notice);
            }
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

    // Mention widgets may appear after the input event. Restrict extra
    // audits to DOM changes inside the active composer, never streamed turns.
    if (relevantRecords.some((record) => record.type === 'childList' && (
        (isElement(record.target) && record.target.closest(
          '#thread-bottom-container,form[data-type="unified-composer"]')) ||
        [...Array.from(record.addedNodes || []),
          ...Array.from(record.removedNodes || [])].some(node => isElement(node) && (
          node.matches('.composer-home-top-menu') ||
          node.querySelector('.composer-home-top-menu')
        ))
      ))) {
      scheduleComposerScrollGuardAudit();
    }

    // A Work layout offset can change without resizing the main pane.
    // Rate-limit readback during streaming/content mutations.
    if (Date.now() - runtime.clipAlignmentLastMutationCheck >= 250) {
      runtime.clipAlignmentLastMutationCheck = Date.now();
      scheduleClipAlignment();
    }

    if (isManagedContentOnlyMutationBatch(relevantRecords)) {
      runtime.skippedContentMutationBatches += 1;
      return;
    }

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

  function headMutationTouchesOwnedStyle(record) {
    const check = (node) => {
      const element = node?.nodeType === 3 ? node.parentElement : node;
      if (!isElement(element)) return false;
      if (element.id === ID.style || element.id === ID.uiStyle) return true;
      try {
        return Boolean(
          element.closest(`#${ID.style},#${ID.uiStyle}`) ||
          element.querySelector(`#${ID.style},#${ID.uiStyle}`)
        );
      } catch (_) {
        return false;
      }
    };

    if (check(record.target)) return true;
    for (const node of record.addedNodes || []) {
      if (check(node)) return true;
    }
    for (const node of record.removedNodes || []) {
      if (check(node)) return true;
    }
    return false;
  }

  function onHeadMutations(records = []) {
    const attribution = attributeMutations(records || []);
    if (attribution.source === 'ultrawide') {
      return;
    }

    if (
      settings.lowPowerMode &&
      !records.some(headMutationTouchesOwnedStyle)
    ) {
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
      runtime.lastCapabilitiesAt = 0;
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

    document.addEventListener('input', onComposerActivity,
      { capture: true, passive: true, signal });
    document.addEventListener('focusin', onComposerActivity,
      { capture: true, passive: true, signal });
    document.addEventListener('focusout', onComposerFocusOut,
      { capture: true, passive: true, signal });
    document.addEventListener('keyup', onComposerActivity,
      { capture: true, passive: true, signal });
    document.addEventListener(COMPOSER_DEBUG_REQUEST, onComposerDebugRequest,
      { signal });

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

    // At document-start, html/head/body may not exist yet. The initial
    // observer bootstrap cannot observe a missing document root.
    if (document.readyState === 'loading') {
      document.addEventListener(
        'DOMContentLoaded',
        guardRuntimeEpoch(() => {
          installObservers();
          applyStyles();
        }, 'dom-ready'),
        { once: true, signal }
      );
    }
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
          'Adjust when panels are open'
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
          'Keep images within view'
        );
      }
    );

    registerMenu(
      'low-power',
      menuToggleLabel(
        'Low-power mode',
        settings.lowPowerMode,
        settings.lowPowerMode ? 'optimized' : 'standard'
      ),
      () => {
        toggleSetting('lowPowerMode', 'Low-power mode');
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
              'Conversation width'
          }
        ),
        select,
        createElement(
          'div',
          {
            className: 'uwc-hint',
            text:
              'Choose how much room your messages can use.'
          }
        )
      ]
    );
  }

  function getUiStatusText() {
    if (!settings.enabled) return 'Your usual ChatGPT layout is active.';
    if (!isWideActive()) return 'The usual layout is being used at this window size.';
    return 'Your chats use more of the available space.';
  }

  function createSection(
    title,
    children
  ) {
    return createElement(
      'section',
      {
        className:
          'uwc-section',
        dataset: { section: String(title).toLowerCase().replace(/[^a-z0-9]+/g, '-') }
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
      runtime: 'Performance',
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
              'uwc-health-item',
            title: key === 'performance'
              ? 'Measures average milliseconds over the original timing budgets. Raw violations are retained in diagnostics; manual self-test timing is excluded.'
              : null
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
            ? 'Wide view is on'
            : 'Wide view is off';
      }

      if (statusDetail) {
        statusDetail.textContent =
          getUiStatusText();
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
      settingsChanged &&
      runtime.storageAvailable &&
      requestGuardedReload('settings-changed')
    ) {
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
    getSelectorHealthSummary(true);
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
                            'Make more room for what matters.'
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
                                  ? 'Wide view is on'
                                  : 'Wide view is off'
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
                                getUiStatusText()
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


                  createSection(
                    'Your view',
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
                            'Use UltraWide'
                          ),
                          createCheckbox(
                            'wide',
                            'Wider conversations'
                          ),
                          createCheckbox(
                            'left',
                            'Align messages to the left'
                          ),
                          createCapInput(),
                          createCheckbox(
                            'widenComposer',
                            'Wider message box'
                          ),
                          createCheckbox(
                            'safeMedia',
                            'Keep images within view'
                          ),
                          createCheckbox(
                            'canvasSafeMode',
                            'Adjust when panels are open'
                          ),
                          createCheckbox(
                            'toast',
                            'Show notifications'
                          )
                        ]
                      )
                    ]
                  ),

                  createSection(
                    'Automatic layout',
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
                            'Adjust automatically'
                          ),
                          createCheckbox(
                            'disableOnTouch',
                            'Keep standard layout on touchscreens'
                          ),
                          createNumberInput(
                            'autoMinWidth',
                            'Minimum chat width',
                            `${LIMITS.autoMinWidth[0]}–${LIMITS.autoMinWidth[1]} px`
                          ),
                          createNumberInput(
                            'disableBelowHeight',
                            'Minimum screen height',
                            '0 disables this condition'
                          )
                        ]
                      )
                    ]
                  ),

                  createSection(
                    'Side spacing',
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
                            'Minimum side space'
                          ),
                          createNumberInput(
                            'gutterVw',
                            'Responsive side space',
                            '',
                            '0.1'
                          ),
                          createNumberInput(
                            'gutterMax',
                            'Maximum side space'
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
                            'More settings'
                        }
                      ),
                      createElement(
                        'div',
                        {
                          className:
                            'uwc-advanced-body'
                        },
                        [
                          createRuntimeOverview(),
                          createHealthBreakdownPanel(),
                          createSection(
                            'Performance',
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
                                    'Update delay',
                                    'Low-power minimum: 550 ms'
                                  ),
                                  createNumberInput(
                                    'repairIntervalMs',
                                    'Background check frequency',
                                    'Low-power minimum: 30 seconds'
                                  ),
                                  createNumberInput(
                                    'routePollMs',
                                    'Navigation check frequency',
                                    'Low-power minimum: 30 seconds'
                                  ),
                                  createNumberInput(
                                    'toastMs',
                                    'Notification duration'
                                  ),
                                  createCheckbox(
                                    'lowPowerMode',
                                    'Low-power mode (fewer background scans)'
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
                                    'Show on-screen diagnostics'
                                  ),
                                  createCheckbox(
                                    'closeSettingsOnBackdrop',
                                    'Close when clicking outside'
                                  )
                                ]
                              )
                            ]
                          ),
                          createSection(
                            'Keyboard shortcuts',
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
                                    'Save support details',
                                  onclick:
                                    downloadDiagnostics
                                }
                              ),
                              createElement(
                                'button',
                                {
                                  type: 'button',
                                  text:
                                    'Save problem report',
                                  onclick:
                                    downloadBugReport
                                }
                              ),
                              createElement(
                                'button',
                                {
                                  type: 'button',
                                  text:
                                    'Advanced stability check',
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
                            'Check and repair',
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
                            'Check everything',
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
                            'Copy support details',
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
                          text: 'Restore defaults',
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

    // Consumer-first settings: move secondary controls without recreating
    // inputs or replacing their event listeners. Every option remains reachable.
    const advancedBody = modal.querySelector('.uwc-advanced-body');
    const basicSection = modal.querySelector('.uwc-section[data-section="your-view"]');
    const basicGrid = basicSection?.querySelector('.uwc-grid');
    if (advancedBody && basicGrid) {
      const extras = createElement('section', {
        className: 'uwc-consumer-extras',
        'aria-label': 'Additional display options'
      });
      for (const key of ['safeMedia', 'canvasSafeMode']) {
        const field = modal.querySelector(`[data-setting="${key}"]`)?.closest('.uwc-check');
        if (field) extras.appendChild(field);
      }
      if (extras.children.length) advancedBody.insertBefore(extras, advancedBody.firstChild);
      for (const selector of ['[data-section="automatic-layout"]', '[data-section="side-spacing"]']) {
        const section = modal.querySelector(`.uwc-section${selector}`);
        if (section) advancedBody.appendChild(section);
      }
      const healthPill = modal.querySelector('.uwc-health-pill');
      if (healthPill) advancedBody.appendChild(healthPill);
      const footer = modal.querySelector('.uwc-actions');
      if (footer) {
        const utility = createElement('div', { className: 'uwc-consumer-tools', 'aria-label': 'Maintenance and support' });
        for (const button of Array.from(footer.querySelectorAll('button'))) {
          if (button.textContent?.trim() !== 'Done') utility.appendChild(button);
        }
        advancedBody.appendChild(utility);
      }
    }

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

    // Start with the dialog itself, not the Close button. Keyboard
    // navigation remains available without an unnecessary focus ring.
    modal.focus({ preventScroll: true });
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
      markersIntact:
        !hasMarkerAttributeDrift(),
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
    // A diagnostic request is explicit, not a background poll. Sample the
    // live DOM once so the top-level health score and selectorHealth agree.
    getSelectorHealthSummary(true);
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
      clipAlignment: runtime.clipAlignmentInfo,
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
        clipAlignmentPollActive: Boolean(runtime.clipAlignmentTimer),
        clipAlignmentGeometryLocked: Boolean(runtime.clipAlignmentLockSignature),
        clipAlignmentLockCount: runtime.clipAlignmentLockCount,
        clipAlignmentLockChecks: runtime.clipAlignmentLockChecks,
        clipAlignmentLockDrifts: runtime.clipAlignmentLockDrifts,
        clipThreadShiftPx: runtime.clipThreadShift,
        stableWatchdogPasses: runtime.stableWatchdogPasses,
        lastEnforcementAt: runtime.lastEnforcementAt,
        lastEnforcementRepairAt: runtime.lastEnforcementRepairAt,
        lastEnforcementFailures: [...runtime.lastEnforcementFailures],
        safeFallbackActive: runtime.safeFallbackActive,
        safeFallbackReason: runtime.safeFallbackReason,
        reconcileInProgress: runtime.reconcileInProgress,
        reconcilePendingVerification:
          runtime.reconcilePendingVerification,
        postScanSameFailureCount: runtime.postScanSameFailureCount,
        postScanRepairPaused: runtime.postScanRepairPaused,
        healthSnapshotDirty: runtime.healthSnapshotDirty,
        watchdogHealthDeferrals: runtime.watchdogHealthDeferrals,
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
        (runtime.healthSnapshotDirty || !runtime.healthBreakdown)
          ? calculateHealthScore().breakdown
          : runtime.healthBreakdown,
      healthSnapshotDirty: runtime.healthSnapshotDirty,
      watchdogHealthDeferrals: runtime.watchdogHealthDeferrals,
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
      lowPowerMode:
        settings.lowPowerMode,
      skippedContentMutationBatches:
        runtime.skippedContentMutationBatches,
      effectiveScanDebounceMs:
        settings.lowPowerMode
          ? Math.max(settings.scanDebounceMs, CONFIG.lowPowerScanDebounceMs)
          : settings.scanDebounceMs,
      effectiveRepairIntervalMs:
        settings.lowPowerMode
          ? Math.max(settings.repairIntervalMs, CONFIG.lowPowerRepairIntervalMs)
          : settings.repairIntervalMs,
      effectiveRoutePollMs:
        settings.lowPowerMode
          ? Math.max(settings.routePollMs, CONFIG.lowPowerRoutePollMs)
          : settings.routePollMs,
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

      composerScrollGuard: runtime.composerScrollGuardLastAudit,
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
    runtime.postScanFailureSignature = '';
    runtime.postScanSameFailureCount = 0;
    runtime.postScanRepairPaused = false;
    runtime.clipAlignmentLockSignature = '';
    runtime.clipAlignmentLockThread = null;
    runtime.clipAlignmentLockCount = 0;
    runtime.clipAlignmentLockChecks = 0;
    runtime.clipAlignmentLockDrifts = 0;
    runtime.queuedReconciliationReasons.clear();
    runtime.queuedReconciliationRequestCount = 0;
    runtime.queuedReconciliationRunCount = 0;
    runtime.reconcileLockContentionCount = 0;
    runtime.selectorHealth.clear();
    runtime.healthSnapshotDirty = false;
    runtime.watchdogHealthDeferrals = 0;
    runtime.lastSelectorHealthAt = 0;
    runtime.lastCapabilitiesAt = 0;
    runtime.lastPlanNoticeScanAt = 0;
    runtime.skippedContentMutationBatches = 0;
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

    if (runtime.clipAlignmentTimer) {
      clearInterval(runtime.clipAlignmentTimer);
      runtime.clipAlignmentTimer = 0;
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

      const api = Object.freeze({
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
            composerOverflow: getComposerOverflowDiagnostics,
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
          });
      Object.defineProperty(window, '__mlUltraWide', {
        configurable: true, value: api
      });
      // With GM_* grants Tampermonkey can isolate window from the page's
      // DevTools console. unsafeWindow exposes the same backwards-compatible
      // API when the browser/manager permits cross-world references.
      try {
        if (typeof unsafeWindow !== 'undefined' && unsafeWindow &&
            unsafeWindow !== window) {
          Object.defineProperty(unsafeWindow, '__mlUltraWide', {
            configurable: true, value: api
          });
        }
      } catch (_) {
        // The DOM-event diagnostic bridge remains available in sandboxed
        // browsers that prohibit callable cross-world objects.
      }
    } catch (_) {}
  }

  installApi();
  start();
})();
