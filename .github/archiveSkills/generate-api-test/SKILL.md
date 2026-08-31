---
name: generate-api-test
description: 'Generate new Playwright API tests for this project (sdetpro-k14-playwright) using the built-in `request` fixture, following an API Client layer parallel to the UI Page Object layer. Use when the user asks to "create an API test", "add an API test for [endpoint]", "test the [endpoint] API", "verify response status/body", or needs to hit an HTTP endpoint directly without a browser UI. NOT for UI/browser-driven tests (see generate-playwright-test) and NOT for debugging existing tests (see web-ui-testing).'
---

# Generate API Test (sdetpro-k14-playwright)

Generates API-level tests using Playwright's built-in `request` fixture (`APIRequestContext`), mirroring the UI layering (`Test -> API Client -> Playwright request API`) instead of `Test -> Fixture -> Flow -> Page Object -> Component`.

## Architecture (must follow)

```
Test Spec (*.spec.ts, in tests/api/**)
  -> API Client (modules/api/**, wraps APIRequestContext for one resource/domain)
    -> Playwright request API (context.get/post/put/delete)
Test Spec -> Test Data (test-data/**) + Constants (constants/Routes.ts)
```

- No Component/Page Object/Flow layers — API tests are flat by design (no UI to decompose).
- Reuse `constants/Routes.ts` for relative paths, same as UI tests — never hardcode absolute URLs.
- The built-in `request` fixture from `@playwright/test` already resolves relative URLs against `baseURL` in `playwright.config.js`, exactly like `page.goto()`.

## Step 1: Determine what already exists

1. Search `modules/api/` for an existing API Client covering the target endpoint/resource.
2. Search `tests/api/` for an existing spec covering the same endpoint.
3. Search `constants/Routes.ts` for the relative path; add an entry if missing.

## Step 2: Create an API Client (only if missing)

Location: `modules/api/<Domain>ApiClient.ts`

- Constructor takes a single `APIRequestContext` (the `request` fixture value), never a `Page`.
- One public async method per endpoint/operation, returning the raw `APIResponse` (let the test/flow decide what to assert — status, body, headers).
- Never assert inside the API Client — assertions belong in the test spec.

Template:
```typescript
import { APIRequestContext, APIResponse } from "@playwright/test";

export default class MyDomainApiClient {
    constructor(private request: APIRequestContext) {}

    public async getResource(query: string): Promise<APIResponse> {
        return await this.request.get(`/my-endpoint?q=${encodeURIComponent(query)}`);
    }
}
```

## Step 3: Write the test spec

Location: `tests/api/<Feature>ApiTest.spec.ts`

Rules:
- Import `test`/`expect` directly from `@playwright/test` (the built-in `request` fixture is already available — no custom fixture needed unless the API Client itself needs DI for reuse across tests).
- Construct the API Client in the test body: `new MyDomainApiClient(request)`.
- Assert on `response.status()`, `response.ok()`, and parsed body (`await response.json()` or `await response.text()`).
- Use `constants/Routes.ts` for the endpoint path passed into the API Client, not hardcoded inline.
- Use `testData.forEach(...)` for data-driven variations, same convention as UI tests.

Template:
```typescript
import { test, expect } from '@playwright/test';
import MyDomainApiClient from '../../modules/api/MyDomainApiClient';
import testData from '../../test-data/api/MyDomainData.json';

testData.forEach(data => {
    test(`Test API <endpoint> | query: ${data.query}`, async ({ request }) => {
        const apiClient = new MyDomainApiClient(request);
        const response = await apiClient.getResource(data.query);

        expect(response.status()).toBe(200);
        const body = await response.text();
        expect(body.toLowerCase()).toContain(data.query.toLowerCase());
    });
});
```

## Step 4: Validate

1. Run `get_errors` on all new/changed `.ts` files.
2. Run the new spec: `npx playwright test tests/api/<Feature>ApiTest.spec.ts`.
3. Confirm the assertion actually inspects the response (status + body) rather than only checking `response.ok()` — a symptom of a weak test is asserting nothing about the payload.

## Common Pitfalls

- **Reaching for a Page Object/Component for a pure API test**: API tests never touch `Page`/`Locator` — if the test needs to open a browser, it's a UI test (`generate-playwright-test`), not an API test.
- **Hardcoded absolute URLs**: same rule as UI tests — use `constants/Routes.ts` + `baseURL`.
- **Asserting only `response.ok()`**: always also verify the response body/shape when the endpoint returns meaningful data, not just the HTTP status.
- **Mixing API and UI test data files**: keep API-only test data under `test-data/api/` to avoid confusing which layer consumes it.
