# Preserved Mainline WIP Integration Design

**Goal:** Safely migrate the user-facing changes preserved on `codex/main-wip-preserved-20260409` into the current multi-site `main` branch without regressing the shipped multi-domain architecture.

## Current State

- The preserved WIP lives on the old root-entry implementation, with edits in `docs.html`, `index.html`, `styles.css`, and `tests/homepage.spec.js`.
- The current `main` branch already uses the multi-site structure centered on `sites/brioi/index.html`, `sites/cradeo/index.html`, `sites/drigeo/index.html`, `/styles/styles.css`, and runtime config modules under `/scripts`.
- Directly merging or rebasing the preserved branch onto `main` would risk deleting or regressing the newer multi-site implementation and its test coverage.

## Integration Strategy

Use manual content-porting rather than branch-level merge:

1. Port the Brioi homepage copy and pricing changes from the preserved WIP into `sites/brioi/index.html`.
2. Port the compact quick-start redesign from the preserved WIP into the root `docs.html`, and move its matching style changes into `styles/styles.css`.
3. Update `tests/homepage.spec.js` so the test suite validates the migrated behavior while preserving the existing multi-site assertions.
4. Leave the current root legacy entry files (`index.html`, `styles.css`, `main.js`) untouched unless a migrated change is still required by a page that remains part of the mainline experience.

## Intended Product Changes

### Brioi homepage

- Rename the support feature card title from `7x24h 专属售后` to `专属售后随时待命`.
- Update the periodic plan bullets to express concurrent-thread capacity:
  - Plus: `支持 1 线程并发`
  - Pro: `支持 3 线程并发`
  - MAX: `支持 10 线程并发`
- Keep the existing multi-site pricing structure, but retain the preserved WIP's preferred Brioi presentation in the "更多套餐" panel:
  - `按量付费` starts at `¥5`
  - keep the `充 100 送 100` featured recharge card
  - downgrade the enterprise card back to secondary emphasis

### Docs page

- Replace the current `docs-steps-grid` section with the preserved WIP's compact `docs-quickstart` block.
- Remove the `配置速查表` table section from the mainline docs page.
- Keep the remaining API-key setup sections and current multi-site navigation wiring intact.

## Explicit Exclusions

Do not merge the following preserved files into `main`:

- `.tmp-home-hero-chat-restored.png`
- `styles.css.backup`
- `assets/software-icons/claude-text.svg`
- `assets/software-icons/codex-text.svg`
- `assets/software-icons/githubcopilot-text.svg`
- `assets/software-icons/opencode-text.svg`
- `docs/superpowers/plans/2026-04-06-brioi-supported-software-official-icons.md`
- `docs/superpowers/plans/2026-04-08-multi-domain-homepage.md`

These files are currently untracked, unused by the mainline UI, or clearly temporary artifacts.

## Files To Modify

- `sites/brioi/index.html`
- `docs.html`
- `styles/styles.css`
- `tests/homepage.spec.js`

## Verification

- Run the affected Playwright tests red-first before implementation.
- Re-run the targeted tests once the migrated changes are in place.
- Re-run the full `npm test` suite in the `main` worktree before committing or pushing.
