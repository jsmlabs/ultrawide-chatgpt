# Changelog

All notable changes are recorded here. An entry under **Unreleased** is not a published release.

## [2026.10.30.1] - 2026-10-30 (GitHub integrated; Greasy Fork publication reported)

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
- On 2026-10-30 the maintainer **reported publishing** `2026.10.30.1` to [Greasy Fork](https://greasyfork.org/en/scripts/557270-ultrawide-chatgpt). The independently retrieved Greasy Fork listing/version history still showed `2026.10.13.1` at the time of this documentation update; remote version and content parity remain **unverified**.
- At the exact final PR head `22dc850ab314446b0e39dc11f09857f5fd488e1d`, GitHub Actions passed JavaScript syntax and **10/10 isolated Node regression tests**. This is not evidence of real-world browser behavior.
- Maintainer browser testing was **limited to visual UI inspection**. The page-console API could not be reached during the available diagnostic attempts. Live functionality, Work CSS, clipping alignment, browser zoom, SPA remounts and end-to-end behavior remain unverified.
- Static review of the supplied fork detected no new networking, remote code loading, userscript permissions, or dynamic execution primitives. This is not a guarantee against all security or correctness issues.
- **License notices remain inconsistent:** The owner-provided previously published and fork scripts declared MIT; GitHub currently declares JSM Custom License v1.1. Compare the actual hosted new version and clarify distribution terms without erasing existing rights or contributor attribution.

## [2026.10.13.1] - Published baseline

Official UltraWide ChatGPT version used as the integration baseline. See the original version's in-source changelog for historical details.
