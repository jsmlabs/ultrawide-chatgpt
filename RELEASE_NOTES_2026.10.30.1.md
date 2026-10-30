# Release notes - UltraWide ChatGPT 2026.10.30.1

**Published:** 30 October 2026 on [Greasy Fork](https://greasyfork.org/en/scripts/557270-ultrawide-chatgpt) · **Source:** [GitHub](https://github.com/jsmlabs/ultrawide-chatgpt/blob/master/script.user.js) · **Integration:** [PR #4](https://github.com/jsmlabs/ultrawide-chatgpt/pull/4)

## Community contribution

Special thanks to **[petrt3522](https://greasyfork.org/scripts/557270-ultrawide-chatgpt/discussions/342892)** for investigating zoom, sidebar, Work and clipping issues, sharing a complete fork, and offering the improvements back to the original project. Credits appear in the userscript source, README, changelog, Greasy Fork description, and these notes.

## What changed

This version integrates the useful improvements across pane sizing, Work/Project alignment, clipping fallback, composer detection, repair-loop bounds, selector health, performance severity reporting, and diagnostics. Maintainer adaptations preserve earlier CSS values, avoid clobbering other browser scripts' later changes, use bounded position sampling, and retain the existing public console API.

The `uwc.settings.v14` storage key, settings defaults, and existing GM permissions remain unchanged.

## Verification and test scope

- Full source-to-source review of the provided published version `2026.10.13.1` and contributor fork.
- No newly introduced network APIs, dynamic code execution, remote dependencies or additional `@grant` entries detected in the supplied fork.
- GitHub Actions syntax check and **10/10 isolated Node tests passed** at PR head [`22dc850ab314446b0e39dc11f09857f5fd488e1d`](https://github.com/jsmlabs/ultrawide-chatgpt/commit/22dc850ab314446b0e39dc11f09857f5fd488e1d). The userscript source was merged unchanged by [PR #4](https://github.com/jsmlabs/ultrawide-chatgpt/pull/4). These are not live browser tests.
- **Maintainer manual testing:** **Visual UI inspection only.** This is not a comprehensive functional, end-to-end, or compatibility test of Work, Projects, zoom, resizing, or cleanup.
- Browser-console checks attempted during review did **not** yield working UltraWide API results (`window.__mlUltraWide` was `undefined` in the page console). No passing live-browser diagnostic result is claimed.
- Live browser behavior in ChatGPT Work/Project layouts and clipping **remains unverified**.
- A static audit cannot guarantee the absence of malicious behavior.

## Known limitations

1. Native Work CSS offsets and clip translations are tied to the current ChatGPT DOM and may become incompatible after UI changes.
2. The fork's secondary alignment fallback and self-healing transitions need validation under streaming and rapid sidebar / zoom changes.
3. The older supplied Greasy Fork source and contributor fork declare MIT. The current public Greasy Fork listing and GitHub metadata both state JSM Custom License v1.1. Honor historical grants and contributor attribution; the code bytes and license obligations have not received independent full verification.
4. Publication is not proof of full browser compatibility. No additional deployment, tag or GitHub Release was performed with this documentation update.

## Release and provenance status (2026-10-30)

- **GitHub:** Integrated into `master` by [PR #4](https://github.com/jsmlabs/ultrawide-chatgpt/pull/4), merge commit [`4cf1025`](https://github.com/jsmlabs/ultrawide-chatgpt/commit/4cf1025b82ad81e9d5f8710dac75062bddd7b8d0).
- **Greasy Fork:** The [public listing](https://greasyfork.org/en/scripts/557270-ultrawide-chatgpt) shows `2026.10.30.1`, 30 October 2026, and `JSM-Custom-1.1`. Its separate code/history pages returned older source content during inspection, so **hosted-code byte parity with GitHub is unverified**.
- **GitHub tag / GitHub Release:** Not created as part of this work.
- **Contributors:** petrt3522 is credited for the fork and improvements. Thanks for investigating and sharing them.

