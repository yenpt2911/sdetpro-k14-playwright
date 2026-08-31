# Project Config Reference — sdetpro-k14-playwright

Single source of truth for environment, routing, and architecture config used by every skill/agent in `.github/skills` and `.github/agents`. Reference this file instead of re-deriving config from scattered source files.

## Active config entrypoint

- [playwright.config.js](../playwright.config.js) is the **active** config (`testDir: './tests'`). `playwright.config.ts` and the top-level `e2e/` folder are legacy/unused — do not target them.
- Env file loaded via `dotenv.config({ path: `.env.${process.env.ENV || 'qa'}` })` → defaults to `.env.qa` when `ENV` is unset.

## Environment variables

| Variable | Where used | Default / fallback |
|---|---|---|
| `BASE_URL` | `playwright.config.js` (`use.baseURL`), [fixtures/GlobalBeforeAllFixture.ts](../fixtures/GlobalBeforeAllFixture.ts) | `https://demowebshop.tricentis.com` |
| `HEADLESS` | `playwright.config.js` (`use.headless`) | `false` (runs headed unless `HEADLESS=true`) |
| `ENV` | selects which `.env.<ENV>` file dotenv loads | `qa` |
| `TEST_USER_EMAIL` / `TEST_USER_FIRST_NAME` / `TEST_USER_LAST_NAME` | checkout/login test data | see `.env.example` |
| `TEST_NEW_ACCOUNT_EMAIL` | [test-data/global/NewAccountData.ts](../test-data/global/NewAccountData.ts) override | generated via `uniqueEmail()` when unset |

Env files present: `.env.dev`, `.env.qa`, `.env.prod`, `.env.example` (template — copy and fill, never hardcode credentials in skills/specs).

**Rule for any skill opening a browser or building a URL:** resolve as `process.env.BASE_URL || 'https://demowebshop.tricentis.com'`, then append a route from `constants/Routes.ts` (or an unlisted relative path if the route isn't in that file yet). Never hardcode a different domain.

## Routes

Defined in [constants/Routes.ts](../constants/Routes.ts) as relative paths (combine with `baseURL`):

```ts
ROUTES.home                 // '/'
ROUTES.jewelry              // '/jewelry'
ROUTES.jewelryProduct       // '/black-white-diamond-heart'
ROUTES.buildCheapComputer   // '/build-your-cheap-own-computer'
ROUTES.buildStandardComputer// '/build-your-own-computer'
ROUTES.register             // '/register'
```

Add new routes here rather than inlining literal path strings in a spec/flow when the route will be reused.

## Layered architecture (folder → responsibility)

```
tests/            spec files, one describe/feature per file, imports `test` from a test-flows/ file
test-flows/       business-flow classes wrapping Page Objects; each also exports a `mergeTests`-based `test` with its flow as a fixture
modules/pages/    Page Objects — one per route/screen, expose Component accessors
modules/components/  Component classes — one per reusable UI widget/region, own the actual selectors
test-data/        typed data wrappers (.ts) around .json fixtures; unique/dynamic values (e.g. email) generated here, not in spec titles
constants/        shared constants: routes, enums (CreditCardType, Payment)
fixtures/         Playwright fixture layers (see below)
utils/            small helpers (TestDataHelper.ts `uniqueEmail()`, AdHelper.ts, PageHelper.ts)
test-cases/       existing manual test case docs (e.g. JewelryOrder.md) — check here before writing new ones
```

## Fixture layers (`fixtures/`)

| File | Scope | Status |
|---|---|---|
| `PageObjectTestFixture.ts` | test | **Active** — exposes all Page Objects (`homePage`, `checkoutPage`, `registerPage`, etc.) for DI; no navigation inside fixtures except where explicitly commented |
| `GlobalBeforeAllFixture.ts` | worker (`auto: true`) | **Active** — one-time warm-up `page.goto(BASE_URL)` per worker via the worker-scoped `browser` fixture (not `page`, to avoid scope-mismatch errors) |
| `LoginBeforeTestFixture.ts`, `GlobalBeforeEachFixture.ts`, `SimpleTestFixture.ts` | — | learning/demo fixtures, **not wired into real test flows** |

Real flows compose fixtures via `mergeTests(pageObjectFixtures, globalTestAll)` directly inside the relevant `test-flows/<domain>/<Name>Flow.ts` file (see `RegisterFlow.ts`, `OrderComputerFlow.ts`) — there is no separate `flows.fixture.ts`.

## Component selector conventions (two conventions coexist — match the sibling files in the same folder)

- `public static selector = '.css-selector'` — majority convention (`modules/components/global/footer/*`, `ProductItemComponent.ts`, `PageBodyComponent.ts`, top-level components).
- `@selector('.css-selector')` class decorator from [modules/components/SelectorDecorator.ts](../modules/components/SelectorDecorator.ts) — used in `modules/components/global/register/*`.

When creating a new Component, check existing files in the target domain folder first; only default to `public static selector` (majority) when the folder is brand new.

## Reporting / execution

- Reporters: `html` (`open: 'never'`) + `allure-playwright` → results in `allure-results/`, viewable via `playwright-report/`.
- `retries`: 2 in CI (`process.env.CI`), 1 locally.
- `trace: on-first-retry`, `video: on-first-retry`, `screenshot: only-on-failure`.
- `actionTimeout: 5000ms` — real test runs use this, not the (much longer) integrated browser-tool timeouts used during manual exploration.
- npm scripts: `npm test` → `playwright test --headed`; `npm run ui` → `playwright test --ui`.

## Known repo quirks (see also `/memories/repo/playwright-framework-notes.md`)

- The integrated browser tool used for manual/live inspection (not real `npx playwright test` runs) can hang on actionability checks ("visible, enabled and stable") even when the element is genuinely visible/has a valid bounding box. Workaround for manual verification only: `page.locator(sel).evaluate(el => el.click())`. Never carry this into real Component/Flow code.
- `e2e/` and `playwright.config.ts` are legacy — ignore when generating or debugging tests.

## Consumed by

`agent0-create-manual-test-case`, `agent1-tc-planner-test-script-implementation`, `agent2-explorer`, `agent3-coder`, `agent4-debugger`, `test-data-environment` — all should resolve BASE_URL/routes/fixture/selector conventions from this file rather than re-deriving them independently.
