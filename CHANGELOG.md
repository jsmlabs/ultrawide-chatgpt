# Changelog

All notable changes are recorded here. An entry under **Unreleased** is not a published release.

## [2026.10.30.1] - Unreleased candidate

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

### Release gates

- **Not published**. The maintainer has inspected **only the visible UI/appearance**. Live functionality, Work CSS offset, fallback alignment, browser-zoom handling, SPA remounts, and other end-to-end behaviors have not been confirmed. Browser-console diagnostic attempts did not establish a working page-context API. Automated CI tests are separate evidence and must not be represented as comprehensive manual testing.
- Static inspection found no new networking, remote code loading, extra userscript permissions, or dynamic execution primitives; this is not a guarantee against all malicious or faulty behavior.
- The supplied published and contributor scripts both declare MIT; the GitHub repository declares JSM Custom License v1.1. The license notice discrepancy requires owner review before release.

## [2026.10.13.1] - Published baseline

Official UltraWide ChatGPT version used as the integration baseline. See the original version's in-source changelog for historical details.
