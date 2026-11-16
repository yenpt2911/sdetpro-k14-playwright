---
name: agent2-explorer
description: "Open the live Playwright application in a real browser at a given URL, self-navigate and explore its functionality following manual test case steps, then persist verified locators as .ts files matching this project's conventions. Use when the user asks to inspect elements, validate selectors, check a page before writing tests, verify a locator by execution, capture locators to a file, or investigate whether a manual test step is automatable."
---

# agent2-explorer

- **Input:** a URL supplied by the user (or the route implied by a manual test case's precondition/steps) plus the manual test cases produced by `agent0-create-manual-test-case`. The implementation plan from `agent1-tc-planner-test-script-implementation` is optional context, used only for spec-file grouping/order — it is never required before exploring.
- **Output:** verified locators persisted as `.ts` files (Component selector stubs, following this project's existing `@selector(...)`/`public static selector` conventions) ready for `agent3-coder`.

See [.github/project-config.md](../../project-config.md) for env/BASE_URL resolution, routes, and the two coexisting selector conventions.

Opens the live application and self-navigates through it before creating or changing Components, Page Objects, Flows, or test specs. This prevents selectors and page assumptions from being invented from prose alone.

## Required order

1. Identify the route and precondition from the supplied URL or from the manual test case's precondition/steps. Resolve the base URL the same way the project already does — `process.env.BASE_URL`, falling back to `https://demowebshop.tricentis.com` (see [.github/project-config.md](../../project-config.md)) — instead of hardcoding a different domain.
2. Launch a real, visible Microsoft Edge browser window and navigate directly to the resolved URL — do not ask the user to describe the page; load it and read the live DOM/accessibility tree yourself. Do this by running a short, self-contained Playwright script through the terminal (e.g. under a scratch folder such as `tmp/`, never inside `tests/`), launching with `chromium.launch({ channel: 'msedge', headless: false })` (or `test.use({ channel: 'msedge' })` if driven through `@playwright/test`). An embedded/simple browser preview tool is not a substitute — the point is a real OS Edge window the user can see opening and navigating.
3. Reproduce the manual test case's precondition live before touching the target step (e.g. log in first, create a prerequisite record, complete an earlier step) — do not assume a precondition is already satisfied just because the browser session happens to be in that state.
4. Follow the manual test case's steps in order, performing each action (fill, select, click) against the live page to reach every screen/state the test case describes, not just the starting page.
5. Inspect the target element's accessible role, name, label, text, attributes, surrounding structure, and its XPath — capture the XPath for every verified element regardless of which locator strategy is ultimately used in code, so it is always available as evidence. Build the XPath itself following the priority order in the "XPath generation priority" section below; never default straight to an absolute/positional path.
6. Choose the actual Component-code locator following the priority order in the "Locator priority" section below.
7. Execute a minimal action or assertion against the candidate locator to verify it resolves and behaves as the test case expects.
8. Record the observed result, including redirects, dialogs, disabled states, validation messages, and dynamic behavior.
9. If a step reveals a new route or screen not described in the test case, keep exploring it rather than stopping at the literal step text.
10. Only then map the interaction to a Component method or existing abstraction.
11. Persist every verified locator as `.ts` following the "Persisting locators" section below.
12. Delete every scratch script created under `tmp/` (or wherever it was created) via an actual terminal command (e.g. `Remove-Item`/`rm`) as the last action of the session — this is mandatory even across multiple re-runs of the same script, and must happen before ending the response. Never leave a scratch exploration script behind in the repo.

## Locator priority

When choosing the locator to hard-code in Component code, try each strategy in order and stop at the first one that is stable and unique. Always keep the XPath from step 5 in the evidence record even when a higher-priority locator wins.

1. Role + accessible name — `page.getByRole('button', { name: 'Register' })`
2. Label — `page.getByLabel('Email')`
3. Stable test ID — `page.getByTestId('...')`
4. Stable semantic attribute — `page.locator('#Email')`, `page.locator('[data-valmsg-for="Email"]')`
5. CSS selector/XPath — only when none of the above are unique or stable; store the exact string as the Component's private selector field, e.g. `private emailSel = '#Email';`

## XPath generation priority

When recording the XPath in the evidence record (step 5), construct it in this order and stop at the first form that is unique and stable — never jump straight to an absolute/positional path:

1. Unique `id` — `//*[@id='Email']`
2. Unique stable attribute (`name`, `data-*`, `aria-*`, `type` combined with tag) — `//input[@name='Email']`, `//*[@data-valmsg-for='Email']`
3. Tag + stable attribute combination when no single attribute is unique alone — `//button[@type='submit' and @class='button-1 register-next-step-button']`
4. Visible text content — `//button[text()='Register']` or `//a[contains(text(),'Log in')]` — only for elements with fixed, non-dynamic text
5. Relative path from a nearby stable ancestor (`id` or stable attribute) — `//div[@id='register-buttons']//button`
6. Absolute/positional path (`/html[1]/body[1]/div[4]/...`) — last resort only, and only kept as supplementary evidence; never let this be the only recorded form when a higher-priority option exists, and never use it as the actual Component selector field.

## Persisting locators

After a locator is verified live, write it into this project's existing structure instead of leaving it as prose:

- Create or update a Component stub at `modules/components/<domain>/<Name>Component.ts`.
- Check sibling files in that domain folder first — if they use the `@selector(...)` class decorator (e.g. `register/`), match that; if they use `public static selector` (e.g. `footer/`, top-level components), match that instead.
- Populate private selector fields from live evidence (constructor + fields only) — leave method bodies as `// TODO: implement in agent3-coder` when the behavior itself is not yet written.
- Never hand off locators only as prose or chat text — the `.ts` file is the deliverable.

## Evidence record

For every inspected control, record:

```text
Test case ID:
Requirement/test step:
Route:
Element purpose:
Observed role/name/label:
Candidate locator:
XPath:
Verification action:
Observed result:
Automation decision:
```

## Rules

- Never claim a selector is valid without executing it or verifying it against the live DOM.
- Do not use brittle generated class names, positional selectors, or `nth()` unless inspection proves they are the only stable option.
- Do not add arbitrary waits. Use Playwright auto-waiting and observable state.
- If the environment is unavailable, report the blocker and keep the locator as unverified; do not generate it as confirmed evidence.
- Keep inspection changes separate from production test changes.
- Do not ask the user to describe the page or provide the selector when a URL or manual test case already implies it — open the browser and discover it directly.
- Every exploration session must open a real, visible Microsoft Edge window (via a scratch Playwright script run through the terminal) and self-navigate through the manual test case's steps in it — never claim navigation happened without an actual script execution backing it.
- Never leave a scratch exploration script in `tmp/` (or elsewhere) after the session ends — delete it with an actual terminal command as the final action, even if the script was re-run multiple times.

## Handoff

Pass the verified route, locator evidence, and persisted Component `.ts` stubs to `agent3-coder`. If execution fails after generation, classify the failure by owning layer (route, fixture, flow, page, component, selector, data, or environment) and hand off to `agent4-debugger` rather than patching the test with waits.