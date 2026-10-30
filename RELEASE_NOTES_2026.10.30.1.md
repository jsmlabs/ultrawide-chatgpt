# Release notes - 2026.10.30.1 (DRAFT / NOT PUBLISHED)

## Community contribution

Special thanks to **petrt3522**, whose [Greasy Fork proposal](https://greasyfork.org/scripts/557270-ultrawide-chatgpt/discussions/342892) and supplied userscript provided the basis for this update. The project acknowledges the contributor in the userscript, README, changelog, and these notes.

## What changed

This candidate integrates the useful improvements across pane sizing, Work/Project alignment, clipping fallback, composer detection, repair-loop bounds, selector health, performance severity reporting, and diagnostics. Maintainer adaptations preserve earlier CSS values, avoid clobbering other browser scripts' later changes, use bounded position sampling, and retain the existing public console API.

The `uwc.settings.v14` storage key, settings defaults, and existing GM permissions remain unchanged.

## Security and quality checks

- Full source-to-source review of the provided published version `2026.10.13.1` and contributor fork.
- No newly introduced network APIs, dynamic code execution, remote dependencies or additional `@grant` entries detected in the supplied fork.
- CI syntax and isolated Node regression tests: check the **final PR head** for outcomes, not these notes.
- Live browser validation for ChatGPT Work/Project layouts and clipping **outstanding**.
- A static audit cannot guarantee the absence of malicious behavior.

## Known risks and unresolved decisions

1. Native Work CSS offsets and clip translations are tied to the current ChatGPT DOM and may become incompatible after UI changes.
2. The fork's secondary alignment fallback and self-healing transitions need validation under streaming and rapid sidebar / zoom changes.
3. The distributed Greasy Fork code declares MIT while repository metadata and LICENSE use JSM Custom License v1.1. Confirm official release licensing and contributor notices.
4. Do not update the Greasy Fork listing or merge this draft PR until live checks and owner release approval.

**Release status:** Candidate only. No publication or merge has taken place.
