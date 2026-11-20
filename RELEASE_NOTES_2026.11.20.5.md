# UltraWide ChatGPT — 2026.11.20.5

**Release date:** November 20, 2026  
**Scope:** Branding, metadata, documentation, and icon integration — no intended behavioral changes.

## What's new

- Custom square icon now appears in userscript metadata and README.
- Updated name and short, plain-English marketing description for Tampermonkey.
- Preserved the fixed, regression-tested composer selection and scroll behavior from `2026.11.20.4`.
- Kept GitHub source free of explicit automatic Greasy Fork update directives; users can install or update from the official published Greasy Fork listing when it carries this version.

## Verification

- GitHub Actions runs JavaScript syntax and Node regression checks for this source release.
- A successful CI check establishes isolated test coverage, not live compatibility with every ChatGPT layout or Tampermonkey browser environment.
- The custom icon is committed to `assets/ultrawide-icon.png`; it is a square PNG rather than a remote generic brand SVG.

## Attribution

Developed and maintained by **jsmdev**. Special thanks to **petrt3522** for pane-relative sizing, Work layout, and clipping investigations: [community discussion](https://greasyfork.org/scripts/557270-ultrawide-chatgpt/discussions/342892) and [merged PR #4](https://github.com/jsmlabs/ultrawide-chatgpt/pull/4).

## Licensing

[JSM Custom License v1.1](./LICENSE) applies to this distribution, subject to any applicable earlier grants and third-party notices.

See [README](./README.md) and [CHANGELOG](./CHANGELOG.md).
