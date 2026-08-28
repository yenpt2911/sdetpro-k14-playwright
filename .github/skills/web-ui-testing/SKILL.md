---
name: web-ui-testing
description: 'Run, debug, and verify Playwright web UI tests in this project (sdetpro-k14-playwright). Use when the user asks to "run the tests", "run [feature] test", "check if the UI works", "debug a failing test", "why did this test fail", "take a screenshot", or "verify the login/checkout page". NOT for generating new test code, Page Objects, Components, Flows, or Fixtures (see generate-playwright-test skill for that).'
---

# Web UI Testing (sdetpro-k14-playwright)

Runs existing Playwright specs, diagnoses failures, and verifies UI behavior. Complements [generate-playwright-test](../generate-playwright-test/SKILL.md), which creates new test code — this skill only executes/debugs what already exists.

## When to use
- Running one, several, or all specs under `tests/**`
- Investigating why a test failed (report, trace, screenshot)
- Visually confirming a page/component behaves correctly
- Confirming a locator/selector still matches the live page after a UI change

## Step 1: Identify the target

- Ask/search for the domain (`tests/computer/`, `tests/global/`, etc.) if not given.
- Confirm which config is active: `playwright.config.js` (`testDir: ./tests`, headless:false) is the real one; `playwright.config.ts` (`./e2e`) is stale/unused — don't run against it.

## Step 2: Run the test(s)

```powershell
npx playwright test tests/<domain>/<File>.spec.ts
```

- Omit the path to run the whole suite.
- Add `--headed` to watch it visually (note: `headless:false` is already hardcoded, so a browser window always opens locally).
- Add `--debug` to step through with the Playwright Inspector.
- Add `-g "<test name substring>"` to run a single named test.

## Step 3: Diagnose a failure

1. Read the terminal output first — assertion failures show expected vs actual.
2. Open `playwright-report/index.html` (run `npx playwright show-report` if needed) for the full HTML report with screenshots/traces.
3. Check `test-results/<test-name>/` for `trace.zip`, `-actual.png`, and error context.
4. Trace the failure back through the layers: Test → Flow → Page Object → Component. Report the exact file/line responsible.
5. Common root causes to check first (see Common Pitfalls below): missing `page.goto()`, missing `await`, stale selector in a Component, hardcoded absolute URL.

## Step 4: Fix vs. report

- If the bug is a broken selector/locator in a `modules/components/**` file, fixing it is in scope for this skill (small, targeted fix).
- If the fix requires a new Component/Page Object/Flow/Fixture, hand off to the **generate-playwright-test** skill instead of building new layers here.
- Always re-run the affected spec after any fix to confirm it's green.

## Step 5: Validate

1. Run `get_errors` on any file you edited.
2. Re-run: `npx playwright test tests/<domain>/<File>.spec.ts`.
3. Confirm the report/trace no longer shows the original failure.

## Common Pitfalls (see also generate-playwright-test's list)

- **Missing `page.goto()`**: a test failing instantly on a blank/about:blank page almost always means navigation was skipped in the test body.
- **Wrong config picked up**: don't debug against `playwright.config.ts` (`./e2e`) — the active suite is `./tests` via `playwright.config.js`.
- **Missing `await`**: an action that silently didn't happen (e.g. click not registering) is often a missing `await` on an async Component method.
- **Stale selector**: if the site's markup changed, the fix belongs in the Component's private selector field, not the test or Page Object.
- **Hardcoded absolute URLs**: should never appear in a test; if one causes a failure, replace it with `constants/Routes.ts` + `baseURL`.
