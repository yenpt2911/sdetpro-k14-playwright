---
name: agent0-create-manual-test-case
description: "Analyze a requirement source (typically a single URL to a live page) and create structured manual test cases for this Playwright project. Use when the user asks to analyze a page/URL, write manual test scripts, convert requirements into test cases, define test steps and expected results, prepare CSV or Excel-ready test cases, or document positive, negative, boundary, and alternate scenarios."
---

# agent0-create-manual-test-case

- **Input:** a requirement source — most commonly a single URL to a live page, but also accepts pasted text/CSV/JSON/Markdown.
- **Output:** implementation-ready manual test cases (analysis + manual test scripts), before UI inspection or Playwright code generation.

See [.github/project-config.md](../../project-config.md) for this project's BASE_URL/env resolution, routes, and layered architecture — resolve the target URL from there instead of hardcoding a different domain.

## Workflow

1. If the input is a URL, open it with the available browser tooling and read the live page (fields, buttons, labels, validation messages, navigation) as the requirement source; otherwise read the provided requirement text/file.
2. Break the source into atomic requirements: actor, action, expected outcome, priority.
3. Split independent behaviors into separate scenarios (positive, negative, boundary, alternate) only when supported by the source — do not invent behavior.
4. Write Given/When/Then acceptance criteria tied to an observable UI/state change for each scenario.
5. Search `tests/`, `test-flows/`, `modules/pages/`, `modules/components/` for existing coverage of the same requirement and note any overlap.
6. Define preconditions, test data, numbered actions, and expected results for each scenario.
7. Mark assumptions and unresolved questions instead of inventing behavior.
8. Assign stable IDs and priorities.
9. Make every expected result observable and testable.

## Required test case format

Use this format for Markdown output:

```markdown
### TC-001: <scenario title>
- Priority: High | Medium | Low
- Type: Positive | Negative | Boundary | Validation | Alternate
- Preconditions:
  - <required state>
- Test data:
  - <field>: <value>

| Step | Action | Expected result |
|------|--------|-----------------|
| 1 | <user action> | <observable result> |
```

For CSV or Excel-ready output, use these columns:

```text
TestCaseId,Title,Priority,Type,Preconditions,StepNumber,Action,ExpectedResult,TestData,Tags
```

Repeat one row per step and keep `TestCaseId` the same for all rows belonging to one test case.

## Quality rules

- Do not put multiple actions in one step when they have separate expected results.
- Keep expected results next to the action that causes them.
- Use business language; do not prescribe CSS selectors or implementation details.
- Include final outcome verification, not only intermediate clicks.
- Avoid credentials and secrets in committed test cases.
- Preserve source requirement IDs where available.

## Handoff

The output is consumed by `agent1-tc-planner-test-script-implementation` to group cases into spec files and decide execution order, then by `agent2-explorer` for element verification and `agent3-coder` for implementation. Do not generate Playwright code in this skill unless the user explicitly requests it.