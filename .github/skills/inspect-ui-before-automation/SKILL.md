---
name: inspect-ui-before-automation
description: "Inspect the live Playwright application and verify UI elements before generating automation. Use when the user asks to inspect elements, validate selectors, check a page before writing tests, verify a locator by execution, or investigate whether a manual test step is automatable."
---

# Inspect UI Before Automation

Inspects the live application before creating or changing Components, Page Objects, Flows, or test specs. This prevents selectors and page assumptions from being invented from prose alone.

## Required order

1. Identify the route and precondition from the requirement or manual test case.
2. Open the route with the available browser/Playwright tooling.
3. Inspect the target element's accessible role, name, label, text, attributes, and surrounding structure.
4. Prefer a resilient locator in this order:
   - role plus accessible name
   - label
   - stable test ID
   - stable semantic attribute
   - CSS selector only when the above are unavailable
5. Execute a minimal action or assertion against the candidate locator.
6. Record the observed result, including redirects, dialogs, disabled states, validation messages, and dynamic behavior.
7. Only then map the interaction to a Component method or existing abstraction.

## Evidence record

For every inspected control, record:

```text
Requirement/test step:
Route:
Element purpose:
Observed role/name/label:
Candidate locator:
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

## Handoff

Pass verified route and locator evidence to `generate-playwright-test` or `generate-test-from-test-case`. If execution fails, use `web-ui-testing` to diagnose the failure and update the owning Component rather than patching the test with waits.