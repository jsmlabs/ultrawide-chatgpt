# UltraWide ChatGPT — 2026.11.20.4

**Release date:** November 20, 2026  
**Distribution:** GitHub source update; Greasy Fork versions are managed separately.  
**Target:** ChatGPT web UI, including supported conversation, Work and split-view layouts.

## Overview

This release focuses on safer scroll handling, active-composer detection, caret-relative `@` suggestion behavior, popup clipping and full cleanup of temporary layout changes. It preserves the existing single-file userscript, settings migration, shortcuts and diagnostic API.

## Changes

- **Native scroll safety:** Do not suppress real horizontal scroll areas merely because their visible scrollbar looks decorative. Detect sibling scroll-area viewports where applicable.
- **Mention context:** Only apply mention-specific overflow protection when the cursor is in a valid mention fragment; avoid ordinary emails and inactive `@` text.
- **Popup recovery:** Avoid broad clipping overrides, stale menus, and unnecessarily changing unrelated interface elements.
- **Lifecycle:** Audit focus transitions and restore owned temporary styles and markers on shutdown or disable.
- **Compatibility:** Preserve independently sized Work composers and pane-relative conversation layout.

## Verification

| Check | Result | Scope |
| --- | --- | --- |
| `node --check script.user.js` | Passed locally | JavaScript parser |
| Focused Node cases | 8/8 passed locally | Scroll-guard predicates and mention caret matching |
| GitHub Actions | Inspect latest commit run | Repository CI |
| Live ChatGPT + Tampermonkey | Not verified | Requires in-browser testing |
| All browser/DOM variants | Not verified | Requires broader integration coverage |

The tests listed above do not imply that every scrolling, popup, responsive, or browser interaction has been validated.

## Credits

Developed and maintained by **jsmdev**.

Special thanks to **petrt3522** for investigating and sharing ChatGPT layout, pane sizing, and clipping improvements. Earlier work was integrated with maintainer hardening: [community discussion](https://greasyfork.org/scripts/557270-ultrawide-chatgpt/discussions/342892) · [merged PR #4](https://github.com/jsmlabs/ultrawide-chatgpt/pull/4). Additional [Work table feedback](https://greasyfork.org/scripts/557270-ultrawide-chatgpt/discussions/344206) is also credited.

## Upgrade

Install the userscript from the [Greasy Fork listing](https://greasyfork.org/en/scripts/557270-ultrawide-chatgpt) if it advertises this release, or copy [the GitHub source](./script.user.js) into Tampermonkey. Refresh ChatGPT and check settings. Avoid running two enabled copies. Manually modified userscripts should be backed up before replacing them.

## License

The repository distributes this version under [JSM Custom License v1.1](./LICENSE), a custom source-available license. Prior MIT grants and third-party rights are not revoked by changing later metadata; retain relevant attribution and source notices.
