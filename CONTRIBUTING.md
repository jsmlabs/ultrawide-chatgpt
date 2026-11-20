# Contributing to UltraWide ChatGPT

Keep changes small, reversible, and scoped to the **active ChatGPT pane**. Avoid applying layout rules to unrelated editors, dialogs, suggestion menus, scroll containers, or Work panels.

## Development checklist

1. Preserve the current settings key (`uwc.settings.v14`), public `window.__mlUltraWide` API and keyboard shortcuts.
2. Restore original styles and markers when stopped, disabled, or remounted. Do not overwrite a subsequent third-party style change.
3. Do not introduce dependencies, new userscript permissions, external networking, or dynamic code execution without a clear technical justification.
4. Add a focused regression test for fixes when feasible. Node **24** is used in CI; there is no build step or package installation.
5. Run the repository checks:

```bash
node --check script.user.js
node --test tests/*.test.cjs
```

These are isolated checks, **not** live ChatGPT or Tampermonkey tests. UI changes should additionally be reviewed manually in long chats, Work, split view, sidebar resizing, zoom, code/table scroll, `@` suggestions, navigation and disable/re-enable cleanup. State exactly which cases were actually tested.

## Reports, releases and attribution

Use the [bug report template](./.github/ISSUE_TEMPLATE/bug_report.yml). Provide a version, browser/userscript manager, steps, expected/actual behavior and redacted diagnostics. Never post private conversations, URLs or credentials.

Synchronize the userscript metadata, runtime version, README and [CHANGELOG](./CHANGELOG.md) when making a new release. The changelog is the canonical release history; standalone release notes are optional and must not be linked unless they are committed. GitHub and Greasy Fork are **separate** publication channels: do not insert Greasy Fork automatic update directives into a newer GitHub development build.

Respect [JSM Custom License v1.1](./LICENSE), all applicable earlier contributor notices, and the recorded contribution by [petrt3522](https://github.com/jsmlabs/ultrawide-chatgpt/pull/4).
