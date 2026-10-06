# UltraWide ChatGPT

A robust userscript that expands ChatGPT into an ultra-wide, pane-aware layout while preserving usability across Chat, Work, split views, SPA navigation, and React remounts.

**UltraWide ChatGPT** is designed as more than a static CSS override. It continuously detects the active ChatGPT layout, applies width changes through the current thread structure, verifies runtime integrity, and can automatically repair recoverable layout failures.

> Current source version: `2026.10.06.22`

## Features

- **Ultra-wide conversations** with configurable maximum width
- **Left-aligned content** for better use of large displays
- **Adaptive mode** based on the effective live chat-pane width
- **Wide composer support** using the same thread-width strategy as messages
- **Split-view safety** for Work, artifacts, editors, and legacy Canvas-style layouts
- **Safe media constraints** to prevent oversized images and embedded content
- **Responsive gutters** with configurable minimum, viewport-relative, and maximum spacing
- **SPA-aware behavior** that survives ChatGPT route changes without aggressive polling
- **React/remount resilience** for virtualized transcripts and dynamically replaced layout roots
- **Automatic self-healing** with bounded reconciliation and retry logic
- **Runtime health scoring** for layout, DOM, styles, reconciliation, and performance
- **Selector health monitoring** with hit counts, visibility, failure streaks, and confidence
- **Diagnostics and bug-report export** directly from the settings UI
- **Built-in self-tests and regression tests** for runtime verification
- **Performance telemetry** with explicit budgets for critical maintenance operations
- **Settings migration** from earlier UltraWide configuration versions
- **Hot-reload-safe lifecycle** with complete observer, timer, listener, style, and marker cleanup
- **Userscript-manager menu commands** for common actions
- **Keyboard shortcuts** for fast layout control
- **Public console API** for diagnostics, verification, testing, and automation

## Installation

### Userscript manager

Install a userscript manager such as:

- Tampermonkey
- Violentmonkey
- another manager compatible with standard userscript metadata and `GM_*` storage/menu APIs

Then install the script from the userscript URL declared in the source metadata:

```text
https://update.greasyfork.org/scripts/557270/Wide%20ChatGPT.user.js
```

The script runs on:

```text
https://chatgpt.com/*
https://www.chatgpt.com/*
```

It starts at `document-start` and does not run inside frames.

## Usage

After installation, open ChatGPT normally. UltraWide is enabled by default and automatically adapts to the current chat pane.

Open the settings interface with:

```text
Alt+S
```

You can also open it from the userscript-manager menu.

### Default behavior

| Setting | Default |
|---|---:|
| Script enabled | On |
| UltraWide enabled | On |
| Left alignment | On |
| Width cap | Unlimited |
| Adaptive mode | On |
| Minimum pane width | `1100px` |
| Disable on touch devices | Off |
| Minimum window height | `560px` |
| Minimum side gutter | `16px` |
| Responsive gutter | `2vw` |
| Maximum side gutter | `36px` |
| Wide composer | On |
| Safe media constraints | On |
| Split-view safe mode | On |
| Status notifications | On |
| Status-message duration | `1500ms` |
| DOM scan debounce | `240ms` |
| Repair interval | `10000ms` |
| SPA route fallback interval | `10000ms` |
| Pause work in hidden tabs | On |
| Performance telemetry | On |
| Debug overlay | Off |
| Close settings on backdrop | On |

## Width caps

UltraWide can run without a maximum width or use one of the predefined caps:

```text
Unlimited
1200px
1400px
1600px
1800px
2000px
2200px
2400px
2800px
3200px
3600px
4200px
```

Use `Alt+M` to cycle through them quickly.

## Settings

The settings interface is organized into focused sections.

### Layout

- Enable or disable the entire script
- Enable or disable UltraWide mode
- Left-align conversation content
- Select a maximum width cap
- Widen the message composer
- Apply safe media constraints
- Enable split-view safe mode
- Show or hide status notifications

### Adaptive behavior

- Enable adaptive mode
- Disable UltraWide on touch-like devices
- Configure the minimum pane width
- Configure the minimum window height

Adaptive mode uses the **effective live ChatGPT pane width**, not only the browser viewport. This keeps layout decisions correct when sidebars or split views reduce the actual chat area.

### Spacing

Configure the side gutter using three values:

- minimum gutter
- responsive `vw` gutter
- maximum gutter

### Advanced runtime & diagnostics

Advanced settings expose:

- DOM scan debounce
- repair interval
- SPA route fallback interval
- status-message duration
- hidden-tab background-work behavior
- performance telemetry
- debug overlay
- backdrop-close behavior

The advanced section also provides runtime actions such as diagnostics export, bug-report generation, repair, self-test, and lifecycle testing.

## Keyboard shortcuts

| Shortcut | Action |
|---|---|
| `Alt+O` | Enable / disable the script |
| `Alt+U` | Enable / disable UltraWide mode |
| `Alt+L` | Enable / disable left alignment |
| `Alt+M` | Cycle maximum width |
| `Alt+A` | Enable / disable adaptive mode |
| `Alt+C` | Enable / disable split-view safe mode |
| `Alt+S` | Open settings |
| `Alt+R` | Reset settings |

## Runtime dashboard

The settings UI exposes a compact runtime overview with:

- **Health** — aggregate runtime health score
- **Strategy** — selected DOM compatibility strategy
- **Confidence** — strategy confidence score
- **Pane** — measured effective chat-pane width
- **Turns** — detected conversation-turn count
- **Watchdog** — current enforcement interval

Health is further broken down into:

- Runtime
- Styles
- DOM
- Width
- Reconciliation
- Performance

This makes failures observable instead of silently degrading the layout.

## Self-healing and compatibility

ChatGPT is a dynamic React application whose DOM can change during navigation, scrolling, virtualization, split-view transitions, or product updates. UltraWide therefore treats the layout as a continuously verified runtime state.

The script includes:

- bounded `MutationObserver` processing
- attribute-aware structural change detection
- pane-aware `ResizeObserver` handling
- root lifecycle monitoring
- head/style integrity monitoring
- SPA route detection
- native Navigation API support when available
- safe History API fallback
- runtime epochs that reject stale asynchronous callbacks
- serialized reconciliation to avoid overlapping repairs
- automatic recovery from recoverable invariant failures
- safe fallback handling for persistent geometry-safety failures

### DOM strategy selection

UltraWide detects current ChatGPT capabilities and selects the most suitable strategy instead of assuming one fixed DOM structure.

Current strategy classes include:

```text
virtualized-thread
conversation-target
turn-markers
semantic-fallback
```

If confidence falls below the required threshold, the runtime reports degraded compatibility rather than silently claiming success.

## Current ChatGPT DOM support

The current architecture is built around modern ChatGPT transcript and composer structures, including support for:

```text
[data-thread-user-message-navigation-content]
[data-thread-find-target="conversation"]
[data-turn-key]
[data-content-search-turn-key]
#thread-bottom-container
#prompt-textarea
```

Fallback selectors are also maintained for compatible legacy or alternate structures.

The width implementation primarily overrides ChatGPT thread-level width variables rather than relying only on individual message wrappers. This helps the layout remain stable during transcript virtualization and React remounts.

## Diagnostics

UltraWide can generate structured diagnostics containing information such as:

- script version
- current URL and user agent
- viewport and pane geometry
- current layout state
- detected conversation turns
- composer detection state
- split-view state
- selected DOM strategy and confidence
- compatibility issues
- observer state
- selector health
- width verification
- reconciliation state
- repair history
- performance-budget metrics
- runtime health
- recent debug events

Available actions include:

- **Copy diagnostics**
- **Download diagnostics** as JSON
- **Download bug report** as a prefilled Markdown report
- **Repair now**
- **Run self-test**
- **Lifecycle torture test**

## Console API

UltraWide exposes a frozen public API at:

```js
window.__mlUltraWide
```

### State and diagnostics

```js
window.__mlUltraWide.state()
window.__mlUltraWide.diagnostics()
window.__mlUltraWide.capabilities()
window.__mlUltraWide.verify()
window.__mlUltraWide.health()
window.__mlUltraWide.healthBreakdown()
window.__mlUltraWide.selectorHealth()
window.__mlUltraWide.performanceBudget()
window.__mlUltraWide.repairEffectiveness()
window.__mlUltraWide.fingerprint()
window.__mlUltraWide.invariants()
window.__mlUltraWide.debugEvents()
```

### Repair and reconciliation

```js
window.__mlUltraWide.repair()
window.__mlUltraWide.enforce()
window.__mlUltraWide.reconcile()
window.__mlUltraWide.repairHistory()
window.__mlUltraWide.repairPlan()
window.__mlUltraWide.convergence()
window.__mlUltraWide.failureCodes()
window.__mlUltraWide.clearSafeFallback()
```

### Testing

```js
window.__mlUltraWide.selfTest()
window.__mlUltraWide.regressionTest()
window.__mlUltraWide.lifecycleTortureSelfTest()
```

### Runtime control

```js
window.__mlUltraWide.start()
window.__mlUltraWide.stop()
window.__mlUltraWide.restart()
window.__mlUltraWide.apply()
window.__mlUltraWide.scan()
```

### Settings

```js
window.__mlUltraWide.set({ cap: '2400', auto: false })
window.__mlUltraWide.reset()
window.__mlUltraWide.caps()
window.__mlUltraWide.openSettings()
window.__mlUltraWide.closeSettings()
```

### Diagnostics export

```js
window.__mlUltraWide.copyDiagnostics()
window.__mlUltraWide.downloadDiagnostics()
window.__mlUltraWide.downloadBugReport()
```

## Troubleshooting

If ChatGPT changes its layout and UltraWide no longer behaves as expected:

1. Open settings with `Alt+S`.
2. Check the runtime health score, selected strategy, confidence, and health breakdown.
3. Use **Repair now**.
4. Run **Run self-test**.
5. If the issue persists, use **Download diagnostics** or **Download bug report**.

You can also inspect the runtime directly:

```js
window.__mlUltraWide.verify()
window.__mlUltraWide.selfTest()
window.__mlUltraWide.diagnostics()
```

For a deeper lifecycle check:

```js
await window.__mlUltraWide.lifecycleTortureSelfTest()
```

## Performance design

The script is designed to avoid turning DOM monitoring into continuous heavy work.

Key measures include:

- bounded mutation processing
- debounced scans
- dirty-region tracking
- coalesced repair requests
- serialized reconciliation
- hidden-tab pausing
- adaptive watchdog intervals
- stale-callback rejection
- lightweight scan timing
- explicit runtime performance budgets

Performance budgets are tracked for:

| Operation | Budget |
|---|---:|
| Watchdog | `1ms` |
| Reconciliation | `2ms` |
| Full scan | `8ms` |
| Self-test | `20ms` |

Budget violations are recorded in diagnostics and contribute to the performance health component.

## Settings persistence and migration

Settings are stored through userscript-manager storage when available, with `localStorage` as a fallback.

The current storage schema is:

```text
uwc.settings.v14
```

Older UltraWide settings schemas are detected, normalized, migrated, and saved into the current format automatically.

Input values are validated and clamped to supported ranges before use.

## Cleanup and lifecycle safety

Stopping or reinjecting UltraWide performs explicit cleanup of managed resources, including:

- timers
- animation frames
- idle callbacks
- mutation observers
- resize observers
- event listeners
- History API hooks
- userscript menu registrations
- injected styles
- root-state attributes
- managed DOM markers
- settings UI
- debug overlay

Same-version reinjection stops the previous runtime before installing the new instance, preventing duplicate active instances.

## Privacy and permissions

The userscript declares only the following privileged userscript APIs:

```text
GM_getValue
GM_setValue
GM_registerMenuCommand
GM_unregisterMenuCommand
```

The current source does not use `fetch`, `XMLHttpRequest`, `WebSocket`, or `GM_xmlhttpRequest` for runtime network communication.

Diagnostics remain local unless you explicitly copy, download, or share them.

## Compatibility notes

UltraWide targets the current ChatGPT web application and intentionally includes multiple compatibility strategies because ChatGPT's internal DOM is not a stable public API.

A future ChatGPT update can therefore temporarily reduce compatibility. The script is designed to make such failures visible through strategy confidence, health scoring, diagnostics, and verification tools rather than masking them.

## Version

```text
2026.10.06.22
```

## Author

**jsmdev**

## License

Licensed under the **MIT License**.
