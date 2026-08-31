---
name: test-data-environment
description: 'Manage test data (test-data/**) and environment configuration (.env.*, constants) for this Playwright project (sdetpro-k14-playwright). Use when the user asks to "add test data", "create test data for [feature]", "avoid duplicate/unique data", "configure environment variables", "add a new env value", "make data env-overridable", or "test fails because of duplicate email/data". NOT for generating test code/Page Objects (see agent3-coder) and NOT for debugging UI/selector execution failures.'
---

# Test Data & Environment (sdetpro-k14-playwright)

Manages reusable, environment-portable, collision-safe test data — a companion to `agent3-coder`'s Step 6, going deeper into *how* to design the data itself.

See [.github/project-config.md](../../project-config.md) for the full env variable table and file layout; this skill focuses on *designing* the data, not re-listing every variable.

## Environment files

- `.env.example` documents every variable; `.env.dev` / `.env.qa` / `.env.prod` hold real per-environment values (never commit secrets beyond what's already tracked).
- `playwright.config.js` loads `.env.${process.env.ENV || 'qa'}` via `dotenv` — switch environments with `ENV=dev npx playwright test`.
- Variables in use: `BASE_URL`, `HEADLESS`, `TEST_USER_EMAIL`, `TEST_USER_FIRST_NAME`, `TEST_USER_LAST_NAME`, `CI`.
- Adding a new env-driven value: add it to `.env.example` (with a placeholder) and to each real `.env.*` file, then read it via `process.env.YOUR_VAR` — never hardcode the same value directly in test data or test files.

## Step 1: Decide JSON vs `.ts` wrapper

| Use `.json` directly | Use a `.ts` wrapper around the `.json` |
|---|---|
| Pure fixture data, no PII, safe to hardcode (e.g. `CheapComputerData.json` RAM/HDD options) | Data containing email/name/PII that should be overridable per environment (see `DefaultCheckoutUser.ts`) |
| Never needs to change per test run | Needs a **unique value per run** (e.g. registration email — the site rejects duplicates) |

## Step 2: Env-overridable wrapper pattern

Location: `test-data/<domain>/<Name>.ts`, importing a sibling `.json` for the static shape:

```typescript
import defaultData from './<Name>.json';

const <Name> = {
    ...defaultData,
    email: process.env.SOME_ENV_VAR || defaultData.email,
};

export default <Name>;
```

## Step 3: Unique-per-run data (avoid duplicate-data flakiness)

Never inline `Date.now()`/`Math.random()` directly inside a test's `test()` title string — a dynamic title breaks Playwright's retry matching (`Test not found in the worker process`). Instead:

1. Generate the unique value inside the `.ts` test-data wrapper (module-load time is fine here — it's not part of the title).
2. Use `utils/TestDataHelper.ts`'s `uniqueEmail(prefix)` (see below) instead of ad-hoc `Date.now()` calls scattered across files.
3. In the test spec, log the generated value with `console.log` if you need to see it — never put it in the `test()` title.

Reusable helper (create once, reuse everywhere):
```typescript
// utils/TestDataHelper.ts
export function uniqueEmail(prefix: string, domain: string = 'example.com'): string {
    return `${prefix}${Date.now()}@${domain}`;
}
```

## Step 4: Validate

1. Run `get_errors` on any new/changed `.ts` files.
2. Run the affected spec twice in a row to confirm no duplicate-data collisions: `npx playwright test tests/<domain>/<File>.spec.ts --repeat-each=2`.
3. Confirm no secret/PII value is hardcoded outside `.env.*` files.

## Common Pitfalls

- **Hardcoded email/PII directly in `.json`**: breaks re-runs against real sites that reject duplicates (registration, signup forms) — wrap in `.ts` with a unique generator.
- **Dynamic value in test title**: causes `Test not found in the worker process` on retry — generate uniqueness in test-data, not in the title string.
- **Same env var name reused for unrelated data**: keep `.env.example` as the single source of truth for what each variable means.
- **Forgetting `.env.example`**: new variables added only to `.env.qa` are invisible to teammates setting up `.env.dev`/`.env.prod` — always document in `.env.example` too.
