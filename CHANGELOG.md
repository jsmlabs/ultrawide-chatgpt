# Changelog

## [2026.11.27.4] - 2026-11-27

### Fixed
- Use the native 48 × 48 ChatGPT website favicon from chatgpt.com instead of the generic Simple Icons OpenAI SVG.
- Synchronize README branding and metadata checks; no runtime layout changes.
- Add an advisory CI check for the external icon's HTTP response and PNG dimensions; network failures are reported separately from offline regression tests.

## [2026.11.27.3] - 2026-11-27

### Fixed
- Restore the original OpenAI SVG icon from Simple Icons in userscript metadata and README.
- Preserve the plain userscript name and all runtime behavior.
- Update icon metadata regression checks.

## [2026.11.27.2] - 2026-11-27

### Fixed
- Remove the screen emoji from the userscript name and retain the existing PNG icon.
- Display the existing PNG logo in the README instead of the heading emoji.

## [2026.11.27.1] - 2026-11-27

### Fixed
- Scope Safe Media image, video, iframe and figure sizing to assistant content, preserving native user attachment dimensions and reserved space to address attachment/message overlap.
- Keep text bubble width, transcript sizing and existing scroll behavior unchanged.

### Verification
- Added deterministic CSS-generation regression tests for assistant media scope and the Safe Media setting.
- Live ChatGPT/Tampermonkey attachment layout remains to be verified; Greasy Fork publication is separate.

## [Unreleased] — Repository maintenance (2026-11-20)

### Restored
- Reinstated the v2026.11.20.5 userscript after a subsequent commit unexpectedly reverted its metadata and focused-composer priority logic to v2026.11.20.4.
- Recovered the custom PNG icon from an earlier Git commit, resolving the broken `@icon` path.
- Removed the GitHub script's Greasy Fork update URLs to prevent automatic downgrades to the separately published older build.

### Improved
- Upgraded CI to Node 24 compatible major action versions and added self-contained repository integrity tests.
- Added contributor guidance, security reporting guidance, a focused bug-report template, and editor conventions.
- No intentional behavior change relative to the v2026.11.20.5 release; current-version browser integration remains unverified.

## [2026.11.20.5] - 2026-11-20

### Changed
- Update userscript display metadata with a clear, approachable benefit-focused description and display emoji.
- Use the already-uploaded, square custom project icon instead of the generic OpenAI SVG.
- Display the project icon in the GitHub README and align current release links.
- Preserve all functional fixes and existing settings from version `2026.11.20.4`.
- Do not add Greasy Fork auto-update URLs to the GitHub development source.

### Verification
- Syntax and repository Node regression tests are run by GitHub Actions for the published commit.
- Real ChatGPT/Tampermonkey browser integration remains separately unverified.


## [2026.11.20.4] - 2026-11-20

**GitHub source update.** Greasy Fork publication and live production compatibility must be verified separately.

### Fixed
- Preserve functional horizontal scrolling even when a scrollbar is rendered alongside a scroll-area viewport.
- Prevent unnecessary cosmetic scrollbar guards outside an active composer `@`-mention context.
- Use caret-relative mention detection to avoid stale popup recovery for inactive mentions.
- Restore temporary popup and scrollbar styles more conservatively on focus changes, navigation, disable and stop.

### Improved
- Prefer the focused composer when several editors are present, while respecting the active chat pane.
- Bound scroll and clipping recovery to the relevant DOM scope, reducing interference with native interactions.
- Maintain existing keyboard shortcuts, configuration storage, diagnostic APIs, license and contributor attribution.

### Verification and limitations
- The current `script.user.js` passed `node --check` locally.
- Eight focused Node cases for scrollbar eligibility and caret-relative mentions passed against the supplied `2026.11.20.4` source.
- Node regression tests are included in the repository; future GitHub Actions results should be inspected on the published commit.
- Live ChatGPT and Tampermonkey integration were not verified in this update.
- Continued credit to [petrt3522](https://greasyfork.org/scripts/557270-ultrawide-chatgpt/discussions/342892) and [PR #4](https://github.com/jsmlabs/ultrawide-chatgpt/pull/4).

All notable changes are recorded here. An entry under **Unreleased** is not a published release.

## [2026.11.19.9] - 2026-11-19

### Fixed

- Restore full-width structured tables in Work and keep horizontal scrolling inside the widget. Thanks to [petrt3522](https://greasyfork.org/scripts/557270-ultrawide-chatgpt/discussions/344206) for reporting the issue and proposing a fix.
- Contain horizontal overflow beneath the Work composer, including empty scrollbar tracks during `@` mentions.
- Recover clipped or off-screen `@` suggestion menus near the active composer and restore temporary styles during cleanup.

### Improved

- Scope width and clipping overrides to the active chat pane, refresh layout markers after pane remounts, and ignore stale resize events.
- Prioritize the chat composer over secondary forms and avoid treating inline editors and dialogs as split-view panels.
- Add composer overflow and suggestion-menu geometry diagnostics. The existing DevTools API uses `unsafeWindow` where supported, with a DOM-event fallback.

## [2026.10.30.1] - 2026-10-30

**Published on [Greasy Fork](https://greasyfork.org/en/scripts/557270-ultrawide-chatgpt).** See the [release notes](./RELEASE_NOTES_2026.10.30.1.md) for provenance, verification limits and support information.

**Community contribution: [petrt3522](https://greasyfork.org/scripts/557270-ultrawide-chatgpt/discussions/342892)**. Thanks for investigating, iterating on, and sharing the Work, zoom, and layout fixes for integration in the official UltraWide ChatGPT project.

### Integrated from contributor proposal (maintainer adapted)

- Size wide conversation content from the actual CSS-pixel chat-pane width, including zoom and sidebar changes.
- Improve transcript, ancestor, message, notice, and composer width constraints.
- Normalize Work-thread offset with explicitly scoped CSS, retaining a guarded clipping-container alignment fallback for alternate DOM structures.
- Check visible content position as well as width, with bounded managed-turn sampling.
- Exempt independently-sized Work composers from canonical full-width verification.
- Bound repeated post-scan reconciliation on the same failure signature and reset guards on geometry changes.
- Refresh selector-health snapshots when contradicted by newly available DOM capabilities.
- Measure performance by average time exceeding its budget (excluding manual self-test samples from the background score while retaining detailed metrics).
- Defer duplicate watchdog health calculations and reduce free-plan notice filtering overhead.
- Expand diagnostics, preserving width and position metrics.

### Maintainer hardening

- Preserve pre-existing pane and clip translation styles and avoid overwriting subsequent external style changes during cleanup.
- Bound conversation position checks to managed elements, reducing repeated full-transcript queries.
- Preserve pre-existing console-facing composer and pane diagnostics contracts.
- Align Userscript metadata, runtime constant, and internal version to `2026.10.30.1`.
- Add tests covering safety-pattern checks, versions, pane lifecycle, composer geometry, clipping ownership, and performance.

### Publication and validation

- GitHub PR [#4](https://github.com/jsmlabs/ultrawide-chatgpt/pull/4) was squash-merged into `master` at commit [`4cf1025`](https://github.com/jsmlabs/ultrawide-chatgpt/commit/4cf1025b82ad81e9d5f8710dac75062bddd7b8d0).
- On 2026-10-30 the maintainer published `2026.10.30.1` to [Greasy Fork](https://greasyfork.org/en/scripts/557270-ultrawide-chatgpt). The **public listing now independently confirms the version, date, and `JSM-Custom-1.1` license metadata**. Some separate code/history retrieval results were stale, so hosted-source **byte parity with GitHub is not confirmed**.
- At the exact final PR head `22dc850ab314446b0e39dc11f09857f5fd488e1d`, GitHub Actions passed JavaScript syntax and **10/10 isolated Node regression tests**. This is not evidence of real-world browser behavior.
- Maintainer browser testing was **limited to visual UI inspection**. The page-console API could not be reached during the available diagnostic attempts. Live functionality, Work CSS, clipping alignment, browser zoom, SPA remounts and end-to-end behavior remain unverified.
- Static review of the supplied fork detected no new networking, remote code loading, userscript permissions, or dynamic execution primitives. This is not a guarantee against all security or correctness issues.
- **License notice history:** The owner-provided earlier Greasy Fork script and contributor fork declared MIT. GitHub and the current Greasy Fork listing now declare JSM Custom License v1.1. The historical licenses and contributor attribution must still be respected; metadata alignment is not a substitute for legal or full-source verification.

## [2026.10.13.1] - Published baseline

Official UltraWide ChatGPT version used as the integration baseline. See the original version's in-source changelog for historical details.
