<div align="center">

# 🖥️ UltraWide ChatGPT

### A wider workspace. A cleaner conversation.

**Adaptive conversation width · Pane-aware layouts · Runtime controls**

A configurable Tampermonkey userscript for ChatGPT Chat and Work. Widen conversations, optionally expand the composer, and retain responsive layout recovery, diagnostics, and low-power operation.

[![Version](https://img.shields.io/badge/version-2026.10.13.1-2563eb?style=flat-square)](script.user.js)
[![Type](https://img.shields.io/badge/type-Tampermonkey%20userscript-475569?style=flat-square)](script.user.js)
[![License file](https://img.shields.io/badge/license-JSM%20Custom%20v1.0-64748b?style=flat-square)](LICENSE)
![Browser validation](https://img.shields.io/badge/live%20browser-unverified-c47f17?style=flat-square)

**[⬇️ Install](#installation)** · **[✨ Features](#features)** · **[⚙️ Configure](#configuration)** · **[⌨️ Shortcuts](#keyboard-shortcuts)** · **[🩺 Diagnostics](#diagnostics-and-console-api)** · **[🧪 Verification](#testing-and-verification)**

</div>

---

> [!IMPORTANT]
> **Compatibility status:** The current userscript is version `2026.10.13.1`. The 20-pass synthetic-DOM test result documented below refers to the earlier `2026.10.12.2` source; it must **not** be treated as validation of the current version. Live ChatGPT browser compatibility, split-view behavior, and performance remain unverified here. ChatGPT's internal layout can change without notice.

## Overview

> **Quick orientation:** [Install](#installation) → [Configure](#configuration) → [Verify](#testing-and-verification) → [Troubleshoot](#troubleshooting). The current script is [`script.user.js`](script.user.js); performance and compatibility must be checked on your browser.


ChatGPT's default reading width can leave substantial unused space on large displays. UltraWide ChatGPT changes the layout of the active conversation while trying to preserve the boundaries of the chat pane and avoid unrelated editors or dialogs.

The script runs locally in the browser, uses semantic DOM markers and ChatGPT thread-width CSS variables where available, and re-evaluates the layout after navigation, remounts, and relevant DOM changes. It is a **layout customization**, not an alternative ChatGPT client.

### ✨ At a glance

| Area | Behavior |
| --- | --- |
| Conversation | Wider assistant/user turns, with support for virtualized transcripts |
| Message composer | Optional width expansion; disabled independently of conversation width |
| Responsive sizing | Uses the effective chat-pane width when available, not just the browser viewport |
| Split view | Detects visible artifact/editor panels and applies a safety-oriented layout |
| Content overflow | Optional constraints for images, video, iframes, code blocks, and tables |
| Navigation | Tracks single-page application (SPA) navigation and structural remounts |
| Reliability | Observers, integrity checks, bounded repair attempts, and safe fallback |
| Performance | Low-power mode, coalesced scans, selective mutation processing, hidden-tab pause |
| Controls | Settings dialog, Tampermonkey menu, eight shortcuts, and a console API |
| Diagnostics | Runtime health, selector coverage, width verification, repair history, exportable reports |

---

## Installation

### Requirements

- A modern browser with a userscript manager supporting the declared Tampermonkey-compatible `GM_*` APIs.
- [Tampermonkey](https://www.tampermonkey.net/) installed and enabled.
- Access to `https://chatgpt.com/` or `https://www.chatgpt.com/`.

### Install from GitHub

1. Open the current **[`script.user.js`](./script.user.js)** in this repository.
2. Select **Raw** to open the actual `.user.js` file. If Tampermonkey offers to install it, review the permissions and confirm.
3. If no installation prompt appears, create a new userscript in Tampermonkey and paste the complete `.user.js` source, preserving its metadata header.
4. Open or refresh [ChatGPT](https://chatgpt.com/) and check the Tampermonkey menu for **UltraWide ChatGPT**.
5. Press **`Alt+S`** (outside the message editor) to open settings.

**Manual alternative:** Open [`script.user.js`](./script.user.js), copy its full contents into a new Tampermonkey userscript, and preserve the metadata header.

> [!NOTE]
> The installation link refers to the verified root-level `script.user.js`. Review the script and its permissions before installing.

### Update an existing installation

1. Install the newer `.user.js` version through Tampermonkey, replacing the existing **UltraWide ChatGPT** installation as appropriate.
2. Ensure only **one enabled copy** is active to avoid duplicate layout control.
3. Refresh ChatGPT. Existing settings use `uwc.settings.v14`; the script also includes migration support for earlier storage keys (`v1`-`v13`).
4. If the old layout persists, inspect the active userscripts and use **Repair now** or reload the page.

### Temporarily disable or uninstall

- Press **`Alt+O`** or use the Tampermonkey menu to turn off UltraWide's layout behavior without uninstalling the script.
- Disable the userscript in Tampermonkey to stop it from loading on subsequent page visits.
- Uninstall it through Tampermonkey if no longer needed. Stored settings may remain in the userscript manager or browser storage until cleared separately.

## Features

### 1. Wider conversation layout

UltraWide overrides the thread layout's responsive width variables and supplements them with targeted attributes on detected conversation roots and turns. The design accounts for ChatGPT's virtualized conversation structure, so remounted turns can be found again.

- Unlimited-width mode constrained by the available pane and configured side gutters.
- Optional maximum-width caps from `1200` through `4200` pixels.
- Optional left-aligned conversation content.
- Specific handling for current assistant message content and user message bubbles.
- Avoidance of broad page-wide content rewriting.

### 2. Adaptive, pane-aware sizing

With adaptive mode on, widening activates only when the **effective chat pane** meets the minimum width. The current default is `1100px`. A minimum viewport height and an optional touch-device rule can further restrict activation.

This is especially useful when a sidebar or split-view panel reduces the usable chat area without changing the overall browser window dimensions.

### 3. Composer and rich-content handling

- **Wide composer:** Enable or disable message-composer widening independently.
- **Safe media:** Constrain images, video, embedded frames, preformatted code, and tables to avoid unnecessary horizontal overflow.
- **Split-view safe mode:** Adjust widening when a visible artifact or editor panel is detected.
- **Selective DOM targeting:** Exclude settings dialogs and common code-editor containers from composer discovery.

Split-view detection is heuristic. It is not a guarantee that every future ChatGPT panel variant is recognized.

### 4. Recovery and SPA support

The runtime responds to route changes, DOM mutations, pane resizing, and lifecycle events. Recovery logic includes:

- Detection of missing or altered managed styles and root attributes.
- Reapplication of externally removed layout markers.
- Bounded reconciliation and automatic integrity checks.
- Single-instance replacement and cleanup on stop/restart.
- Stale-callback protection across runtime restarts.
- A safety fallback for persistent width/geometry problems.

The script does not promise uninterrupted compatibility with every ChatGPT update; recovery depends on recognizing enough of the current DOM.

### 5. Low-power mode

**Enabled by default.** Low-power mode reduces background work by coalescing structural scans, avoiding ordinary streaming-content rescans, caching short-lived capability checks, and throttling nonessential notice detection.

Under default settings, the effective minimum scan debounce is `550ms`, and the background repair and route-fallback intervals are each at least `30s`. Structural changes may still trigger more immediate work. The watchdog uses a separate adaptive schedule.

---

## Configuration

Open the settings dialog with **`Alt+S`**, or select **Settings** from the Tampermonkey menu. Most settings can also be changed through `window.__mlUltraWide.set(...)` in the browser console.

### Layout and adaptive behavior

| Setting | Default | Description |
| --- | --- | --- |
| `enabled` | `true` | Enable UltraWide's managed layout behavior |
| `wide` | `true` | Enable expanded width |
| `left` | `true` | Left-align managed content |
| `cap` | `"none"` | Maximum content width (`none` = no fixed pixel cap) |
| `auto` | `true` | Enable adaptive activation rules |
| `autoMinWidth` | `1100` | Minimum effective chat-pane width, in pixels |
| `disableOnTouch` | `false` | Suppress adaptive widening on touch-like devices |
| `disableBelowHeight` | `560` | Minimum browser window height, in pixels (`0` disables the rule) |
| `gutterMin` | `16` | Minimum horizontal gutter, in pixels |
| `gutterVw` | `2` | Responsive gutter, in viewport-width units (`vw`) |
| `gutterMax` | `36` | Maximum horizontal gutter, in pixels |
| `widenComposer` | `true` | Widen the message composer |
| `safeMedia` | `true` | Apply rich-content overflow constraints |
| `canvasSafeMode` | `true` | Adapt layout in detected split-view/editor states |
| `toast` | `true` | Show status notifications |

Allowed width caps:

```text
none | 1200 | 1400 | 1600 | 1800 | 2000 | 2200 | 2400 | 2800 | 3200 | 3600 | 4200
```

**Note:** Disabling `auto` bypasses the adaptive width, height, and touch activation checks; it does not disable `enabled` or `wide`.

### Runtime and advanced behavior

| Setting | Default | Description |
| --- | --- | --- |
| `toastMs` | `1500` | Duration of status messages, in milliseconds |
| `scanDebounceMs` | `240` | Base DOM scan debounce; low-power mode can raise it |
| `repairIntervalMs` | `10000` | Base periodic repair interval, in milliseconds |
| `routePollMs` | `10000` | Base SPA route-fallback polling interval, in milliseconds |
| `lowPowerMode` | `true` | Reduce background processing |
| `pauseWhenHidden` | `true` | Defer selected background work while the tab is hidden |
| `performanceTelemetry` | `true` | Record lightweight local timing metrics |
| `debugOverlay` | `false` | Show a runtime diagnostic overlay |
| `closeSettingsOnBackdrop` | `true` | Allow closing settings by clicking the backdrop |

Numeric settings are validated and clamped by the script. Configured base intervals may differ from **effective** low-power intervals; inspect `state()` to see the latter.

### Example configurations

Use the browser developer console on ChatGPT:

```js
// Wider layout, capped at 2400px, with adaptive activation.
window.__mlUltraWide.set({ cap: '2400', auto: true });

// Keep the wider conversation but leave the composer at its native width.
window.__mlUltraWide.set({ widenComposer: false });

// Prioritize reduced background activity.
window.__mlUltraWide.set({
  lowPowerMode: true,
  pauseWhenHidden: true,
  debugOverlay: false
});

// Restore all default settings.
window.__mlUltraWide.reset();
```

`cap` values are **strings**, including `"none"`. Invalid cap values cause `set()` to throw an error instead of silently choosing another width.

> [!CAUTION]
> Closing the settings dialog **after changing saved settings** can trigger a guarded page reload. Save or copy unfinished ChatGPT drafts before editing settings.

## Keyboard shortcuts

Shortcuts are handled when focus is **outside** a text input, contenteditable editor, or other recognized typing target. Browser or extension shortcut conflicts may prevent activation.

| Shortcut | Action |
| --- | --- |
| `Alt+O` | Enable / disable the script's layout behavior |
| `Alt+U` | Enable / disable UltraWide width |
| `Alt+L` | Toggle left alignment |
| `Alt+M` | Cycle maximum-width caps |
| `Alt+A` | Toggle adaptive mode |
| `Alt+C` | Toggle split-view safe mode |
| `Alt+S` | Open settings |
| `Alt+R` | Reset settings to defaults |

The Tampermonkey menu also provides quick toggles, rescan, diagnostics export, bug-report export, and reset actions.

---

## Diagnostics and console API

The userscript exposes a local API at **`window.__mlUltraWide`**. Open the browser developer console on a ChatGPT page where the userscript is running.

### Start here

```js
const uwc = window.__mlUltraWide;

uwc.state();           // Settings, layout status, scan counts, runtime details
uwc.verify();          // Named integrity checks with an aggregate ok flag
uwc.health();          // Composite runtime health and component scores
uwc.capabilities();    // Detected DOM capabilities
uwc.diagnostics();     // Full local diagnostics object
uwc.repair();          // Request layout repair
uwc.selfTest();        // Runtime checks for the current page
uwc.regressionTest();  // Deterministic built-in contract tests
```

### API reference

| Group | Methods |
| --- | --- |
| Lifecycle | `start()`, `stop()`, `restart()` |
| Layout control | `apply()`, `scan()`, `repair()`, `set({...})`, `reset()`, `caps()` |
| UI | `openSettings()`, `closeSettings()` |
| Inspection | `state()`, `diagnostics()`, `capabilities()`, `verify()`, `invariants()` |
| Health | `health()`, `healthBreakdown()`, `selectorHealth()`, `performanceBudget()`, `repairEffectiveness()` |
| Repair analysis | `reconcile()`, `enforce()`, `repairPlan()`, `repairHistory()`, `convergence()`, `failureCodes()` |
| DOM/runtime | `strategy()`, `fingerprint()`, `debugEvents()`, `clearSafeFallback()` |
| Tests | `selfTest()`, `regressionTest()`, `lifecycleTortureSelfTest()` |
| Exports | `copyDiagnostics()`, `downloadDiagnostics()`, `downloadBugReport()` |

Most inspection methods return objects; some maintenance methods change runtime state. **Run the lifecycle torture test only when you can tolerate a temporary stop/restart of the script.**

### Reporting a problem

1. Reproduce the problem and record the ChatGPT view (Chat, Work, or split view).
2. Check `window.__mlUltraWide.verify()` and `window.__mlUltraWide.selfTest()`.
3. Use **Download diagnostics** or **Download bug report** from Settings or the Tampermonkey menu.
4. Record whether a manual **Repair now** or page reload corrected it.
5. When filing a GitHub issue, include reproduction steps, expected versus actual behavior, browser/userscript-manager details, and **redacted** diagnostics if helpful.

**Privacy reminder:** Diagnostics can contain the current page URL, browser user agent, settings, DOM information, and runtime events. Review exports before publishing them. Do not attach private conversation content, tokens, or other sensitive information to public issues.

## Troubleshooting

| Symptom | Check / action |
| --- | --- |
| Nothing changes on ChatGPT | Verify Tampermonkey is active, only one script copy is enabled, and `state().enabled` / `state().wide` are `true`. Refresh the page. |
| Layout stays narrow | Check `state().activeWide`, `autoMinWidth`, browser height, and effective pane width. Try `auto: false` for diagnosis. |
| Composer remains narrow | Check `widenComposer`. Composer detection excludes dialogs and unrelated editors. |
| Split view looks cramped | Enable `canvasSafeMode`; reduce `cap` or return to `auto: true`. |
| Layout breaks after navigation | Run `window.__mlUltraWide.scan()` or `repair()`, then inspect `verify()` and compatibility diagnostics. |
| A user or assistant turn loses styling | Run `repair()`; check marker integrity and the selected DOM strategy. |
| Noticeable CPU use | Keep `lowPowerMode` and `pauseWhenHidden` on; disable `debugOverlay`. Compare scan and repair metrics before/after. |
| Shortcut does not work | Move focus outside the composer and check for a browser/extension shortcut conflict. |
| Settings revert | Check `state().storageAvailable`; userscript-manager storage permissions or local-storage restrictions may interfere. |
| Page reloads after settings | This is expected when closing a changed settings dialog; a reload-loop guard limits repeated reloads. |
| Safe fallback is active | Inspect `state().safeFallbackReason` and `verify()`. Correct pane/geometry issues before manually calling `clearSafeFallback()`. |

**Useful diagnostic sequence:**

```js
const uwc = window.__mlUltraWide;
console.table({
  enabled: uwc.state().enabled,
  activeWide: uwc.state().activeWide,
  paneWidth: uwc.state().effectivePaneWidth,
  detectedTurns: uwc.state().detectedTurns
});
uwc.verify();
uwc.repair();
uwc.selfTest();
```

---

## Testing and verification

**Historical validation record:** The documented synthetic test results apply to version `2026.10.12.2`, not the current `2026.10.13.1` script. No equivalent current-version test outcome is asserted here.

| Validation | Result | Scope |
| --- | --- | --- |
| `node --check` | Passed | JavaScript parsing |
| Built-in regression suite | **20 passed / 0 failed** | Synthetic DOM fixture |
| Initial transcript and composer markers | Passed | Synthetic DOM fixture |
| Externally removed marker recovery | Passed | Synthetic DOM fixture |
| Composer option CSS exclusion | Passed | Synthetic DOM fixture |
| Disabled state after simulated resize | Passed | Synthetic DOM fixture |
| Re-enable, restart, reinjection, cleanup | Passed | Synthetic DOM fixture |
| Actual ChatGPT browser behavior | **Not verified** | Requires live testing |
| Live split-view and Work compatibility | **Not verified** | Requires live testing |
| Browser performance benchmarks | **Not verified** | Requires live testing |

### Reproduce the available tests

For the current script, JavaScript syntax can be checked locally with Node.js:

```bash
node --check script.user.js
```

Run the built-in checks on an actual ChatGPT page:

```js
window.__mlUltraWide.regressionTest();
window.__mlUltraWide.selfTest();
window.__mlUltraWide.verify();
```

**Historical test limitation:** The earlier 20-test result used a mocked DOM and cannot establish real browser layout accuracy, performance, or current-version compatibility. The previously referenced regression runner and validation report are not present at their documented root paths.

### Suggested live acceptance checks

Before treating a new ChatGPT DOM revision as compatible, verify:

1. A normal conversation renders at the configured width without horizontal page overflow.
2. Long conversations remain usable as turns mount and unmount during scrolling.
3. The composer toggle affects the composer without widening unrelated editors.
4. Chat, Work, narrow panes, sidebar changes, and split-view panels stay within their visible bounds.
5. Settings persist after refresh and previous versions migrate correctly.
6. Disabling the script removes managed layout CSS and markers; re-enabling restores them.
7. Navigation, resizes, hidden-tab transitions, and repeated reinjection do not create duplicate styles or unnecessary loops.
8. Runtime diagnostics show no recurring errors, and interaction remains responsive on the target device.

---

## Design and implementation

The implementation is a single self-contained userscript. No build step or external JavaScript framework is required at installation time.

```text
ChatGPT DOM / SPA events
        │
        ▼
Capability detection + pane measurement
        │
        ▼
DOM strategy + managed marker discovery
        │
        ▼
Thread-variable and targeted CSS application
        │
        ▼
Integrity monitoring + bounded reconciliation
        │
        └── Diagnostics / safe fallback / lifecycle cleanup
```

Notable implementation decisions:

- **Scoped CSS:** Uses script-specific `data-uwc-*` attributes alongside ChatGPT layout variables, rather than replacing application markup.
- **Small repair surface:** Tracks intended markers and dirty regions, reconciling changes rather than clearing every marker on each scan.
- **Observability:** Exposes selector coverage, component health, width checks, timing budgets, and repair-effectiveness metrics. These are diagnostic indicators, not guarantees.
- **Lifecycle hygiene:** Aborts managed listeners and disconnects observers, cancels scheduled work, and removes owned styles/markers when stopped.
- **Storage migration:** Reads earlier settings formats and normalizes values to current defaults and ranges.

## Privacy and security

- **Client-side operation:** The reviewed script does not contain a `fetch`, `XMLHttpRequest`, or other explicit runtime telemetry-upload call. Its layout processing and runtime diagnostics run locally.
- **Storage:** Prefers Tampermonkey `GM_getValue` / `GM_setValue`; falls back to browser `localStorage` when needed. A `sessionStorage` key tracks reload-loop protection.
- **Permissions:** Declares the four `GM_*` grants shown in the userscript header and matches only `chatgpt.com` and `www.chatgpt.com` URL patterns.
- **External metadata:** The userscript's icon refers to a CDN URL. That metadata resource is separate from runtime telemetry.
- **Diagnostics:** Reports are generated/downloaded locally but can expose environment details if you share them.

Install userscripts only from a source you trust, review changes before updates, and avoid running multiple scripts that modify the same ChatGPT width variables without checking compatibility.

## Limitations

- ChatGPT is a third-party application with internal HTML, attributes, and CSS variables that may change at any time.
- DOM strategy confidence and health scores are heuristics, not proof of correct rendering.
- Automatic repair cannot fix every incompatibility or conflict with other browser extensions.
- Width behavior may vary by browser, zoom level, platform, ChatGPT experiment, or UI variant.
- The currently supplied validation evidence is **synthetic**, not a completed live-browser acceptance test.

---

## Project files

| File | Purpose |
| --- | --- |
| [`script.user.js`](./script.user.js) | Current installable Tampermonkey userscript (`2026.10.13.1`) |
| [`LICENSE`](./LICENSE) | JSM Custom License v1.0; differs from the script metadata's `MIT` declaration |
| `README.md` | Installation, usage, reference, and maintenance documentation |

## Release notes

### `2026.10.13.1` - current script

The repository currently ships `script.user.js` at this version. Its source header documents Chat/Work compatibility adaptations, lifecycle recovery and diagnostics improvements; these are implementation descriptions, not independently verified browser results.

### `2026.10.12.2` - reliability and lifecycle fixes

- Corrected disabled-state root cleanup after environment events.
- Fixed the `widenComposer: false` interaction with global composer width variables and CSS caching.
- Prevented unnecessary reconciliation scheduling while a verification pass is pending.
- Released pending reconciliation state when a scan fails.
- Refined mutation-intent attribution so subsequent external edits are not incorrectly suppressed.
- Recovered deleted managed-marker attributes already present in internal tracking sets.
- Removed false-positive turn-marker invariant failures while disabled.
- Extended the built-in regression suite to **20 tests**.

The historical validation-report file referenced by the prior README is not available at that path in the current repository.

## Contributing and support

Reproducible bug reports and narrowly scoped compatibility fixes are welcome where the repository accepts contributions. When reporting a regression, include the script version, affected ChatGPT view, reproduction steps, console health results, and a minimal redacted diagnostic export.

For proposed fixes, preserve existing settings names and user-facing shortcuts where possible, keep observer work bounded, and test both **enabled** and **disabled** lifecycle paths. Validate changes in a real browser before claiming ChatGPT compatibility.

---

## License and attribution

**License discrepancy:** The repository's [`LICENSE`](LICENSE) contains **JSM Custom License v1.0**, including a restriction on standalone resale, while the current userscript metadata declares `@license MIT`. These are not equivalent. Review both before reuse or redistribution; the license declarations require reconciliation by the repository owner. This README does not amend either license.

Created by **jsmdev**. This is an independent userscript and is **not affiliated with, endorsed by, or maintained by OpenAI**. ChatGPT is a trademark of its respective owner.

<div align="center">

---

**More room for the conversation. More control over the layout.**

[Back to top](#-ultrawide-chatgpt) · [Install](#installation) · [Configuration](#configuration) · [Diagnostics](#diagnostics-and-console-api) · [Source](script.user.js)

</div>
