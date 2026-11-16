---
name: create-manual-test-case
description: "Create structured manual test cases from analyzed requirements for this Playwright project. Use when the user asks to write manual test scripts, convert requirements into test cases, define test steps and expected results, prepare CSV or Excel-ready test cases, or document positive, negative, boundary, and alternate scenarios."
---

# Create Manual Test Case

Converts analyzed requirements into implementation-ready manual test cases before UI inspection or Playwright code generation.

## Workflow

1. Read the requirement analysis and source material.
2. Split independent behaviors into separate scenarios.
3. Define preconditions, test data, numbered actions, and expected results.
4. Include positive, negative, validation, boundary, and alternate cases when supported by the requirement.
5. Mark assumptions and unresolved questions instead of inventing behavior.
6. Assign stable IDs and priorities.
7. Make every expected result observable and testable.

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

The output is consumed by `plan-test-script-implementation` to group cases into spec files and decide execution order, then by `inspect-ui-before-automation` for element verification and `generate-playwright-test` for implementation. Do not generate Playwright code in this skill unless the user explicitly requests it.