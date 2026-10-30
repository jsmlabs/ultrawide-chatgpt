<div align="center">

# 🖥️ UltraWide ChatGPT

**More room to read. More control over your workspace.**

A responsive, configurable **Tampermonkey userscript** that widens ChatGPT conversations and optionally the message composer - without replacing the ChatGPT interface.

[![Version](https://img.shields.io/badge/version-2026.10.13.1-2563eb?style=flat-square)](./script.user.js)
[![Userscript](https://img.shields.io/badge/platform-Tampermonkey-0f766e?style=flat-square)](https://www.tampermonkey.net/)
[![ChatGPT](https://img.shields.io/badge/target-ChatGPT%20Chat%20%26%20Work-334155?style=flat-square)](https://chatgpt.com/)
[![License](https://img.shields.io/badge/license-JSM%20Custom%20v1.1-64748b?style=flat-square)](./LICENSE)

[**Install userscript**](https://raw.githubusercontent.com/jsmlabs/ultrawide-chatgpt/master/script.user.js) · [Features](#-features) · [Settings](#-configuration) · [Troubleshooting](#-troubleshooting) · [Source](./script.user.js)

</div>

---

> [!IMPORTANT]
> **Compatibility:** The source version is `2026.10.13.1`. Current live-browser compatibility with ChatGPT Chat, Work, and split view has **not been independently verified**. ChatGPT's DOM changes over time. See [verification](#-verification-and-limitations) before relying on this customization.

## ✨ Features

| | Capability | What it does |
| :--: | --- | --- |
| ↔️ | **Wider conversations** | Expands conversation width, with optional caps from 1,200 to 4,200 px or no fixed cap. |
| 📐 | **Adaptive sizing** | Checks the effective chat-pane width instead of relying only on the viewport. |
| ⌨️ | **Optional wide composer** | Controls composer width separately from conversation width. |
| 🪟 | **Split-view awareness** | Applies a safety-oriented layout when supported editor or artifact panels are detected. |
| 🖼️ | **Safer content overflow** | Optionally constrains media, tables, and code blocks within the available space. |
| 🔄 | **SPA recovery** | Rechecks layout after navigation, relevant DOM remounts, and pane resizing. |
| 🌙 | **Low-power operation** | Coalesces work, reduces routine polling, and pauses selected background work in hidden tabs. |
| 🩺 | **Runtime diagnostics** | Exposes integrity checks, health reports, repair actions, and diagnostics exports. |

**Designed for large monitors, but pane-aware:** Adaptive widening is enabled by default and requires an effective chat-pane width of at least **1,100 px**. The default horizontal gutter stays between 16 and 36 px. Smaller or constrained panes can retain the native layout.

## 🚀 Installation

**Requirements:** A modern browser, [Tampermonkey](https://www.tampermonkey.net/) with the declared `GM_*` APIs enabled, and access to [ChatGPT](https://chatgpt.com/).

1. **[Open the installable userscript](https://raw.githubusercontent.com/jsmlabs/ultrawide-chatgpt/master/script.user.js)**. Review the source and permissions, then approve the Tampermonkey installation prompt.
2. If your browser does not offer installation, open [`script.user.js`](./script.user.js), copy its complete contents, and create a new userscript in Tampermonkey. Preserve the `// ==UserScript==` metadata block.
3. Open or refresh **[chatgpt.com](https://chatgpt.com/)**.
4. Use the Tampermonkey **UltraWide ChatGPT** menu, or press **`Alt+S`** with focus outside the message editor, to open settings.

> [!TIP]
> Updating? Replace the existing installation rather than running two enabled copies. The current storage key is `uwc.settings.v14`; migration logic supports earlier settings keys. Refresh ChatGPT after updating.

**Disable or remove:** Press `Alt+O` to toggle layout behavior, disable the script in Tampermonkey, or uninstall it through your userscript manager. Uninstalling may not clear retained settings automatically.

## 🎛️ Configuration

Open **Settings** with `Alt+S` or the Tampermonkey menu. Defaults are documented below; advanced intervals may be adjusted automatically in low-power mode.

| Setting | Default | Purpose |
| --- | :---: | --- |
| `enabled` / `wide` | `true` / `true` | Master layout and widening switches |
| `left` | `true` | Left-align managed conversation content |
| `cap` | `"none"` | Optional width cap; string value |
| `auto` | `true` | Enable pane-width and device checks |
| `autoMinWidth` | `1100` | Minimum effective chat-pane width in px |
| `disableBelowHeight` | `560` | Minimum window height in px; `0` disables |
| `disableOnTouch` | `false` | Optionally avoid adaptive widening on touch devices |
| `gutterMin` / `gutterMax` | `16` / `36` | Minimum and maximum horizontal gutters in px |
| `gutterVw` | `2` | Responsive gutter component in vw |
| `widenComposer` | `true` | Independently widen the message composer |
| `safeMedia` | `true` | Constrain rich content to avoid overflow |
| `canvasSafeMode` | `true` | Use a cautious layout in detected split views |
| `lowPowerMode` | `true` | Reduce background DOM work |
| `pauseWhenHidden` | `true` | Defer selected work in hidden tabs |
| `performanceTelemetry` | `true` | Collect lightweight local timing measurements |
| `debugOverlay` | `false` | Show an on-page diagnostics overlay |
| `toast` / `toastMs` | `true` / `1500` | Status notifications and duration in ms |
| `closeSettingsOnBackdrop` | `true` | Dismiss settings by clicking outside the dialog |

**Allowed `cap` values:** `none`, `1200`, `1400`, `1600`, `1800`, `2000`, `2200`, `2400`, `2800`, `3200`, `3600`, `4200` (all strings).

<details>
<summary><strong>Advanced runtime settings</strong></summary>

| Setting | Base default | Meaning |
| --- | ---: | --- |
| `scanDebounceMs` | `240` | Structural scan debounce (ms) |
| `repairIntervalMs` | `10000` | Repair interval (ms) |
| `routePollMs` | `10000` | SPA route polling fallback (ms) |

In default low-power mode, the effective scan debounce is at least **550 ms** and the two routine intervals above are at least **30 s**. Structural changes may still trigger immediate recovery. See `window.__mlUltraWide.state()` for effective values.

</details>

### Keyboard shortcuts

Shortcuts operate outside recognized typing fields and can conflict with browser or extension bindings.

| Keys | Action | Keys | Action |
| --- | --- | --- | --- |
| `Alt+S` | Open settings | `Alt+O` | Toggle layout |
| `Alt+U` | Toggle wide mode | `Alt+L` | Toggle left alignment |
| `Alt+M` | Cycle width caps | `Alt+A` | Toggle adaptive mode |
| `Alt+C` | Toggle split-view safe mode | `Alt+R` | Reset defaults |

> [!CAUTION]
> Closing settings after saving changes can trigger a guarded page reload. Preserve unfinished ChatGPT drafts before changing settings.

## 🧩 Console API

The script provides the local `window.__mlUltraWide` API. In the browser console on a ChatGPT tab where the script is active:

```js
const uwc = window.__mlUltraWide;

// Inspect
uwc.state();
uwc.verify();
uwc.health();
uwc.capabilities();
uwc.diagnostics();

// Configure - cap values are strings
uwc.set({ cap: '2400', auto: true, widenComposer: false });

// Recover or restore
uwc.repair();
uwc.reset();
```

<details>
<summary><strong>More inspection, lifecycle, and export commands</strong></summary>

| Area | Available methods |
| --- | --- |
| Runtime | `start()`, `stop()`, `restart()`, `apply()`, `scan()`, `reconcile()`, `enforce()` |
| Settings | `set({...})`, `reset()`, `caps()`, `openSettings()`, `closeSettings()` |
| Integrity | `verify()`, `invariants()`, `health()`, `healthBreakdown()`, `selectorHealth()` |
| Analysis | `state()`, `diagnostics()`, `capabilities()`, `strategy()`, `fingerprint()`, `performanceBudget()` |
| Recovery | `repair()`, `repairPlan()`, `repairHistory()`, `repairEffectiveness()`, `convergence()`, `failureCodes()`, `clearSafeFallback()` |
| Tests | `selfTest()`, `regressionTest()`, `lifecycleTortureSelfTest()` |
| Reports | `debugEvents()`, `copyDiagnostics()`, `downloadDiagnostics()`, `downloadBugReport()` |

Some commands mutate runtime state. In particular, `lifecycleTortureSelfTest()` intentionally stops and restarts the script.

</details>

## 🛠️ Troubleshooting

| Problem | First checks |
| --- | --- |
| No width change | Confirm only one active copy, `state().enabled`, `state().wide`, and refresh. |
| Still narrow | Inspect `state().activeWide`, pane width, `autoMinWidth`, and viewport height. |
| Composer unchanged | Confirm `widenComposer` is enabled. Dialogs and unrelated editors are intentionally excluded. |
| Split view is cramped | Check `canvasSafeMode`; try a smaller cap or adaptive sizing. |
| Layout changed after navigation | Run `window.__mlUltraWide.repair()` and inspect `verify()`. |
| High CPU usage | Leave `lowPowerMode` and `pauseWhenHidden` enabled; disable the debug overlay. |
| Hotkey does nothing | Move focus out of the composer; check browser and extension shortcut conflicts. |
| Settings do not persist | Inspect `state().storageAvailable` and userscript storage permissions. |
| Safe fallback active | Inspect `state().safeFallbackReason` and `verify()` before clearing it. |

For a reproducible issue, capture the script version, browser, userscript manager, ChatGPT view, steps, expected and actual result, and **redacted** diagnostics. [Open a GitHub issue](https://github.com/jsmlabs/ultrawide-chatgpt/issues/new).

> [!WARNING]
> Diagnostic exports may include page URLs, user-agent data, settings, DOM indicators, and runtime events. Review and redact before sharing; never publish private conversations or credentials.

## 🧪 Verification and limitations

| Evidence | Status | Scope |
| --- | --- | --- |
| Historical `node --check` | Previously reported as passed | JavaScript parsing of earlier version |
| Historical built-in regression suite | **20 passed, 0 failed** | Synthetic DOM, version `2026.10.12.2` |
| Current userscript `2026.10.13.1` | **Not independently validated here** | No current-version runtime test claim |
| Live ChatGPT / Work / split view | **Unverified** | Requires real-browser validation |
| Performance and resource usage | **Unverified** | Requires measurements on target browsers |

The prior synthetic test results must **not** be interpreted as validation of version `2026.10.13.1` or of live ChatGPT compatibility. Node.js tests now exercise selected pane-width, position, and composer contracts in isolation. These checks do not validate the live ChatGPT DOM or its split-view behavior. Check CI results for the exact revision before treating them as passing.

To check JavaScript syntax locally, after obtaining the repository:

```bash
node --check script.user.js
node --test tests/*.test.cjs
```

To evaluate the current browser session:

```js
window.__mlUltraWide.regressionTest();
window.__mlUltraWide.selfTest();
window.__mlUltraWide.verify();
```

**Practical acceptance criteria:** confirm normal and long conversations, chat-pane resizing, sidebars, Work, split view, composer independence, refresh persistence, disable/re-enable cleanup, and navigation recovery. Check that the page does not overflow horizontally and inspect diagnostics for persistent errors. These are manual checks, not reported successful tests.

## 🏗️ How it works

```text
ChatGPT navigation / DOM / pane resize
                 │
                 ▼
     Detect layout capabilities
                 │
                 ▼
       Measure effective pane
                 │
                 ▼
    Select targets + apply CSS
                 │
                 ▼
       Verify and repair state
```

UltraWide is a **single self-contained userscript**, with no application build step. It uses targeted layout rules and markers, ChatGPT thread-width variables where available, and bounded observation/reconciliation to handle supported DOM changes. Detection and split-view classification are heuristic; they cannot guarantee compatibility with future interface revisions. The userscript runs in the browser and does not replace or proxy the ChatGPT service.

**Repository files:** [`script.user.js`](./script.user.js) · [`README.md`](./README.md) · [`LICENSE`](./LICENSE)

## 📄 License and attribution

Distributed under **[JSM Custom License v1.1](./LICENSE)**, a **custom source-available license, not an OSI-approved open-source license**. It permits use, modification, redistribution, and commercial integration subject to attribution and other conditions; resale of substantially unchanged standalone copies is restricted. Read the complete license before redistributing or using the software commercially.

Created by **jsmdev**. This independent project is **not affiliated with or endorsed by OpenAI**. ChatGPT is a trademark of its respective owner.

---

<div align="center">

**A wider workspace for ChatGPT.**

[Install](https://raw.githubusercontent.com/jsmlabs/ultrawide-chatgpt/master/script.user.js) · [Settings](#-configuration) · [Troubleshooting](#-troubleshooting) · [Back to top](#-ultrawide-chatgpt)

</div>
