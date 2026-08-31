# Playwright MCP Guide

## Purpose

This guide explains how to use Playwright MCP with this repository to inspect the Demo Web Shop application, execute browser scenarios, and turn discoveries into Playwright tests.

MCP in this context means the Playwright Model Context Protocol server that allows an AI assistant to drive a real browser session and report back what it observes.

## What Playwright MCP Is Good For

Use Playwright MCP when you want to:

- open the application in a real browser
- inspect pages without writing code first
- verify visible elements, labels, links, buttons, and form fields
- execute a manual scenario step by step
- confirm actual validation messages before automating them
- collect realistic flows and edge cases for test design

Do not use MCP as a replacement for the final automated test suite. Use it to explore, validate assumptions, and reduce guesswork before writing automation.

## Repository Setup

This repository already contains an MCP server configuration in [.vscode/mcp.json](.vscode/mcp.json):

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": [
        "@playwright/mcp@latest"
      ]
    }
  }
}
```

That means VS Code can launch the Playwright MCP server for this workspace when MCP-compatible tooling is used.

## Prerequisites

Before using MCP Playwright in this project, make sure:

1. Node.js is installed.
2. Project dependencies are installed with `npm install`.
3. VS Code is opened in this workspace.
4. The Playwright MCP server entry in [.vscode/mcp.json](.vscode/mcp.json) is present.
5. The target site is reachable: `https://demowebshop.tricentis.com`.

## Typical MCP Workflow

Recommended workflow for QA analysis:

1. Explore the page.
2. Identify the real user path.
3. Confirm the actual UI text and validation behavior.
4. List scenarios.
5. Create automation only after the UI behavior is verified.

Example workflow for this project:

1. Open the Demo Web Shop homepage.
2. Navigate to a target page such as Login, Register, Product Details, Cart, or Checkout.
3. Read the rendered page structure.
4. Execute the scenario manually through the browser.
5. Record expected and actual behavior.
6. Convert the validated scenario into a Playwright test under the framework's POM structure.

## Good Prompt Patterns

When asking an AI assistant to use Playwright MCP, be explicit about the outcome you want.

Good examples:

- `Use Playwright MCP to open https://demowebshop.tricentis.com and identify the login page controls.`
- `Explore the guest checkout flow without placing a final order. List mandatory billing fields and validation messages.`
- `Run this scenario through the browser and report actions, expected result, actual result, and PASS/FAIL.`
- `Use Playwright MCP to inspect the search page and identify filters, inputs, and test scenarios.`

Avoid vague prompts such as:

- `Check website`
- `Do testing`
- `Find bugs`

Those prompts are too broad and usually produce low-value results.

## Recommended MCP Use Cases In This Repo

### 1. Explore Before Automating

Use MCP first when you need to understand:

- page structure
- visible headings
- actual labels used by form controls
- whether a flow branches to login, guest checkout, or confirmation
- exact validation messages

This is especially useful for:

- login
- registration
- add to cart
- checkout as guest
- search filters
- cart validation

### 2. Validate Business Flows

Use MCP to verify end-to-end behavior before adding or updating test coverage.

Examples:

- add a desktop product to cart
- proceed to cart and start guest checkout
- submit empty billing form and capture required field errors
- enter invalid email and confirm billing does not advance
- enter valid billing details and confirm shipping step opens

### 3. Capture Stable Locators Indirectly

MCP helps you inspect accessible names and labels so you can later prefer:

- `getByRole()`
- `getByLabel()`
- `getByPlaceholder()`
- `getByText()`

This reduces the need to guess locators while writing tests.

## QA Strategy For MCP Sessions

As a senior QA workflow, use MCP in this order:

1. Confirm entry point.
2. Confirm critical controls exist.
3. Execute the happy path.
4. Execute key negative validations.
5. Record exact system responses.
6. Only then write the automated test.

For every scenario, capture:

- preconditions
- test steps
- expected result
- actual result
- pass or fail
- exact UI messages

## Example MCP Session: Guest Checkout

This is a practical example based on this application.

### Goal

Verify a guest user can order a desktop product and reach Shipping Address only after valid Billing Address input.

### Exploration Steps

1. Open `https://demowebshop.tricentis.com`.
2. Navigate to `Computers`.
3. Open `Desktops`.
4. Open the first desktop product.
5. Add the product to cart.
6. Open `Shopping cart`.
7. Accept Terms of Service.
8. Click `Checkout`.
9. Choose `Checkout as Guest`.
10. Inspect the Billing Address form.
11. Submit blank data and record all required-field errors.
12. Submit invalid email and record the email validation message.
13. Submit valid billing data and confirm the Shipping Address step becomes available.

### What To Record

- mandatory fields
- optional fields
- inline validation messages
- whether the current step remains open after invalid input
- whether the next step becomes visible after valid input

## Mapping MCP Findings To This Framework

After exploration, convert the validated behavior into this project's layered design:

1. Test spec in `tests/`
2. Flow in `test-flows/`
3. Page object in `modules/pages/`
4. Component in `modules/components/`
5. Test data in `test-data/`

For this repository, that usually means:

- reusing `OrderComputerFlow.ts` for computer purchase journeys
- reusing `CheckoutPage.ts` and checkout components for billing and shipping
- keeping route values in [constants/Routes.ts](constants/Routes.ts)
- storing scenario data in JSON under `test-data/`

## Playwright MCP Best Practices

1. Start with inspection, not code generation.
2. Validate actual UI text before asserting it in tests.
3. Prefer accessible names and labels over brittle selectors.
4. Keep each MCP session focused on one business flow.
5. Use MCP to confirm edge cases that are expensive to guess.
6. Do not stop at navigation. Always verify state changes.
7. When a flow fails, capture where it failed and what the page showed.

## Common Mistakes

1. Exploring too broadly without identifying a concrete scenario.
2. Writing automation before confirming the real form messages.
3. Assuming the first visible button is the right button when the page contains duplicate actions.
4. Ignoring guest-vs-login branching in checkout.
5. Using MCP only for screenshots instead of structured page inspection.

## Suggested Prompt Templates

### Template 1: Explore A Page

```text
Use Playwright MCP to open <url>.
Inspect the page without making changes.
Identify:
1. Main sections
2. Interactive elements
3. Buttons, inputs, links, and checkboxes
4. Important user flows
5. Potential test scenarios
```

### Template 2: Execute A Scenario

```text
Use Playwright MCP to execute this scenario:
1. <step>
2. <step>
3. <step>

Do not generate code yet.
Report:
- Actions performed
- Expected result
- Actual result
- PASS/FAIL
```

### Template 3: Prepare Automation

```text
Using Playwright MCP, inspect the application first.
Then identify the test scenarios.
After that, generate a Playwright test script using the repo's Page Object Model pattern.
```

## Limitations

Playwright MCP is useful, but it has limits:

- it is not the source of truth for framework structure
- it does not replace maintainable automated tests
- browser state may expire between sessions
- dynamic pages can expose duplicate controls that need careful verification
- live environments may behave differently across runs

Always confirm the final automated coverage by running Playwright tests locally.

## Summary

Use Playwright MCP in this repository as a discovery and validation tool before writing automation.

The best pattern is:

1. inspect the real application
2. validate the real scenario
3. capture exact messages and step transitions
4. convert the findings into the repo's POM-based Playwright tests

That workflow produces more accurate tests and fewer false assumptions.