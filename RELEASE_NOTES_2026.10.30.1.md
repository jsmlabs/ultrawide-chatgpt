# Release notes - 2026.10.30.1

## Community contribution

Special thanks to **petrt3522**, whose [Greasy Fork proposal](https://greasyfork.org/scripts/557270-ultrawide-chatgpt/discussions/342892) and supplied userscript provided the basis for this update. The project acknowledges the contributor in the userscript, README, changelog, and these notes.

## What changed

This version integrates the useful improvements across pane sizing, Work/Project alignment, clipping fallback, composer detection, repair-loop bounds, selector health, performance severity reporting, and diagnostics. Maintainer adaptations preserve earlier CSS values, avoid clobbering other browser scripts' later changes, use bounded position sampling, and retain the existing public console API.

The `uwc.settings.v14` storage key, settings defaults, and existing GM permissions remain unchanged.

## Security and quality checks

- Full source-to-source review of the provided published version `2026.10.13.1` and contributor fork.
- No newly introduced network APIs, dynamic code execution, remote dependencies or additional `@grant` entries detected in the supplied fork.
- GitHub Actions syntax check and **10/10 isolated Node tests passed** at PR head [`22dc850ab314446b0e39dc11f09857f5fd488e1d`](https://github.com/jsmlabs/ultrawide-chatgpt/commit/22dc850ab314446b0e39dc11f09857f5fd488e1d). The userscript source was merged unchanged by [PR #4](https://github.com/jsmlabs/ultrawide-chatgpt/pull/4). These are not live browser tests.
- **Maintainer testing scope:** The maintainer reports checking only the **visible user interface / appearance**. This was not a comprehensive functional test, end-to-end validation, or confirmation that Work/Projects, browser zoom, resizing, or cleanup behave correctly.
- Browser-console checks attempted during review did **not** yield working UltraWide API results (`window.__mlUltraWide` was `undefined` in the page console). No passing live-browser diagnostic result is claimed.
- Live browser behavior in ChatGPT Work/Project layouts and clipping **remains unverified**.
- A static audit cannot guarantee the absence of malicious behavior.

## Known risks and unresolved decisions

1. Native Work CSS offsets and clip translations are tied to the current ChatGPT DOM and may become incompatible after UI changes.
2. The fork's secondary alignment fallback and self-healing transitions need validation under streaming and rapid sidebar / zoom changes.
3. The distributed Greasy Fork code declares MIT while repository metadata and LICENSE use JSM Custom License v1.1. Confirm official release licensing and contributor notices.
4. The maintainer reports publishing this version despite incomplete manual functional testing; do not interpret publication as proof of Work, zoom, or browser compatibility. No additional deploy, tag, or GitHub Release is authorized by this documentation change.

## Release and provenance status (2026-10-30)

- **GitHub:** Integrated into `master` by [PR #4](https://github.com/jsmlabs/ultrawide-chatgpt/pull/4), merge commit [`4cf1025`](https://github.com/jsmlabs/ultrawide-chatgpt/commit/4cf1025b82ad81e9d5f8710dac75062bddd7b8d0).
- **Greasy Fork:** The maintainer reports publication of `2026.10.30.1` on 2026-10-30 at [the official listing](https://greasyfork.org/en/scripts/557270-ultrawide-chatgpt). Independent retrieval of the public listing/code/version history still showed `2026.10.13.1`; the hosted version and byte parity were **not independently verified**.
- **GitHub tag / GitHub Release:** Not created as part of this work.
- **Contributors:** petrt3522 is credited for the fork and improvements. Thanks for investigating and sharing them.

**Testing disclosure:** Maintainer inspection was limited to the visible interface. Functional behavior in the real ChatGPT browser, including Work, Projects, zoom and cleanup, remains unverified.
