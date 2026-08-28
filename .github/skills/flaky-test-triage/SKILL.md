---
name: flaky-test-triage
description: 'Detect, diagnose, and fix flaky Playwright tests in this project (sdetpro-k14-playwright) — tests that pass/fail inconsistently across runs/retries. Use when the user asks "why is this test flaky", "this test sometimes fails", "test passes locally but fails in CI", "fix flaky test", "reduce retries", or "test is unstable". NOT for a test that fails consistently every time (see web-ui-testing for one-off deterministic failures) and NOT for generating new test code (see generate-playwright-test).'
---

# Flaky Test Triage (sdetpro-k14-playwright)

Diagnoses and fixes **non-deterministic** test failures (pass sometimes, fail other times) — different from `web-ui-testing`, which debugs a test that fails the same way every run.

## Step 1: Confirm it's actually flaky, not deterministic

1. Run the suspect spec 3+ times in a row: `npx playwright test tests/<domain>/<File>.spec.ts --repeat-each=3`.
2. If it fails **every** time with the same error → it's a deterministic bug, hand off to `web-ui-testing` instead.
3. If it fails **intermittently** or only on retry → continue with this skill.

Note: `playwright.config.js` already sets `retries: process.env.CI ? 2 : 1`, `trace: 'on-first-retry'`, `video: 'on-first-retry'` — a test that only fails on attempt #1 but passes on retry is a classic flaky signature and already has trace/video captured automatically.

## Step 2: Classify the root cause

Check in this order — these cover the vast majority of flakiness in this codebase:

| Symptom | Likely cause | Where to look |
|---|---|---|
| Fails at random points, different each run | Race condition — action fired before element ready | Missing `await`, or an action right after navigation without waiting for the target element |
| `Test not found in the worker process` on retry | Test title includes a non-deterministic value (`Date.now()`, random data) computed at **module-import time** — retries re-import the file and generate a new title | Test spec title string; any `test-data/**.ts` wrapper (like `NewAccountData.ts`) that computes values at import time |
| Fails only in CI, passes locally | Slower CI machine hits `actionTimeout: 5 * 1000` (5s, hardcoded in `playwright.config.js`) | Element that legitimately takes longer to appear (spinner, AJAX-loaded content) |
| Fails only on 2nd/3rd run in the same suite, not the 1st | Leftover state from a previous test (cart items, cookies, localStorage) not isolated | Test doesn't reset state; missing a fresh `page`/context per test |
| Fails intermittently with `strict mode violation` (locator resolves to 2+ elements) | Selector too broad, matches an extra element added by unrelated UI (banner, ad, duplicate row) | Component's selector definition |
| Timeout waiting for network-dependent content (search results, product list) | No explicit wait for the async content, relying on `waitForTimeout` (banned in this project) or nothing at all | Component/Flow method missing Playwright auto-wait target |

## Step 3: Isolate the root cause

- Reproduce with `--repeat-each=5 --workers=1` to remove parallelism as a variable.
- Use `--trace=on` (temporarily override config) to force a trace on every run, then inspect with `npx playwright show-trace test-results/.../trace.zip` even on passing runs to compare timing.
- If suspecting shared state, run the single spec in isolation vs. the full suite: `npx playwright test tests/<domain>/<File>.spec.ts` vs `npx playwright test`. If it only fails in the full suite, it's a state-isolation bug, not a timing bug.
- If suspecting a title-based retry bug, grep the failing test's title string for template literals (`` `...${...}` ``) — any interpolated value must be static per file-load, not regenerated (e.g. `Date.now()` inside a `.ts` test-data wrapper).

## Step 4: Fix (never mask)

Do NOT fix flakiness by:
- Increasing `retries` in `playwright.config.js`
- Adding `page.waitForTimeout()`
- Reducing assertions

Do fix by:
- **Race condition**: add the missing `await`, or wait on a specific Component/Page Object locator state (Playwright auto-waits on `.click()`/`.fill()`/assertions already — the fix is usually adding the missing action, not a manual wait).
- **Dynamic test title**: remove interpolated non-deterministic values from `test()` titles; log them with `console.log` instead (see the `NewAccountData` email fix — title stayed static, email was logged).
- **CI-only timeout**: increase `actionTimeout` for that specific slow interaction via `test.setTimeout()` or a scoped locator `.waitFor()`, rather than a global config bump.
- **Leftover state**: ensure the test/flow starts from a clean slate — verify no fixture reuses a `page`/cart state across tests unexpectedly (check `fixtures/PageObjectTestFixture.ts` and any `scope: 'worker'` fixture in `fixtures/GlobalBeforeAllFixture.ts`, which is intentionally a once-per-worker warmup, not shared test state).
- **Overly broad selector**: narrow the Component's root/child selector so it only matches the intended element (see `modules/components/SelectorDecorator.ts` usage patterns).

## Step 5: Validate the fix

1. Run `--repeat-each=10` (or more) on the fixed spec to build confidence it's no longer flaky: `npx playwright test tests/<domain>/<File>.spec.ts --repeat-each=10`.
2. Run the full suite once to confirm no regression from the fix.
3. Run `get_errors` on any changed `.ts` files.

## Common Pitfalls (from this project's history)

- **Dynamic test titles from `.ts` test-data wrappers**: any wrapper file (pattern from `DefaultCheckoutUser.ts`/`NewAccountData.ts`) that generates a value at import time (timestamp, random ID) will break retries if that value ends up in a test title.
- **`scope: 'worker'` fixtures depending on `page`**: causes a hard runtime error, not flakiness, but often discovered during flaky-test investigation — worker fixtures must use `browser`, not `page` (see `GlobalBeforeAllFixture.ts`).
- **`headless: false` hardcoded**: local runs always open a visible browser; timing can differ from CI (`headless` driven by `HEADLESS` env var) — don't assume local pass = CI pass.
- **Confusing "fails once, passes on retry" with "fixed"**: a test that only passes because of the built-in retry is still flaky — don't close the investigation just because CI is green.
