---
name: agent4-debugger
description: "Debug and fix a failing Playwright test produced by agent3-coder until it passes. Use when the user asks to debug a failing test, fix a test that just failed, investigate why a generated test failed, or make a newly generated test pass."
---

# agent4-debugger

- **Input:** a test run that failed after `agent3-coder` generated or changed it.
- **Output:** the same test script running green (`passed`), with only the owning layer changed.

See [.github/project-config.md](../../project-config.md) for the layer definitions (route/fixture/flow/page/component/selector/data/environment) referenced in the classification below.

Only runs when `agent3-coder`'s output fails. Do not invent new scenarios or refactor unrelated code here — this skill only makes the already-planned test pass.

## Workflow

1. Run the narrowest failing spec: `npx playwright test <path> --config=playwright.config.js`.
2. Read the terminal output, the HTML report, and the trace for the exact failure (assertion diff, timeout, selector not found, navigation error, thrown exception).
3. Classify the failure by owning layer:
   - **Route** — wrong/missing entry in `constants/Routes.ts`, or `page.goto()` missing/incorrect in the test body.
   - **Fixture** — missing registration in `fixtures/PageObjectTestFixture.ts`, wrong scope (`worker` fixture depending on `page`).
   - **Flow** — business step method in `test-flows/**` doesn't match the actual page behavior or ordering.
   - **Page** — Page Object exposes the wrong Component or missing method.
   - **Component** — selector in `modules/components/**` no longer matches the live DOM, or a method is missing `await`.
   - **Selector** — the locator itself is stale/wrong (re-verify live with the same locator preference order `agent2-explorer` uses: role+name, label, test ID, semantic attribute, CSS last).
   - **Data** — `test-data/**` value is invalid, stale, or colliding (e.g. duplicate email on a site that rejects duplicates).
   - **Environment** — `.env.*`/`playwright.config.js` misconfiguration (base URL, proxy, headless flag).
4. Fix only the owning layer — do not patch a selector problem by adding waits, and do not patch a data problem by changing the test's assertions.
5. Rerun the same focused spec to confirm the fix.
6. If still failing, repeat steps 2-5 with the new failure signature. If the same layer fails twice with different root causes, or the environment itself is unavailable, stop and report the blocker instead of guessing further.

## Rules

- Never use `page.waitForTimeout()`, arbitrary retries, or `--retries` to mask a real failure.
- Never mark a test as passed without an actual green run in the terminal output.
- If the fix requires a new Component/Page Object/Flow/Fixture that doesn't exist, hand back to `agent3-coder` instead of building new layers here.
- Keep the fix scoped to the owning layer; do not opportunistically refactor other passing tests.

## Handoff

Report the final passing run (command + result) back as the pipeline output. If blocked by environment/data outside the repo's control, report the blocker explicitly instead of claiming success.
