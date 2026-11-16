---
name: agent1-tc-planner-test-script-implementation
description: "Plan Playwright test script implementation from manual test cases produced by agent0-create-manual-test-case, before UI inspection or code generation. Use when the user asks to plan test automation, group test cases into test files, decide test execution order, optimize test run time, reduce duplicate setup/navigation, or organize which Page Objects/Components/Flows/Fixtures are needed before generating tests."
---

# agent1-tc-planner-test-script-implementation

- **Input:** the manual test cases produced by `agent0-create-manual-test-case`.
- **Output:** an implementation plan for the test scripts (spec file groupings, reuse/new layer decisions, execution order) — no Playwright code.

See [.github/project-config.md](../../project-config.md) for the layered architecture, fixture layers, and `playwright.config.js` execution settings referenced below.

Turns a set of manual test cases into an implementation plan: which spec files to create, which layers to reuse vs build, and in what order to run cases so total execution time is minimized. Produces a plan only — no Playwright code.

## Position in the workflow

`agent0-create-manual-test-case` (manual test cases) -> **this skill** (implementation plan) -> `agent2-explorer` (verify elements, save locators as .ts) -> `agent3-coder` (write test scripts).

## Workflow

1. **Group by route and precondition.** Cluster test cases that start from the same route and share the same precondition/login state. Each cluster is a candidate for one spec file (or one `describe` block) so setup/navigation is not duplicated.
2. **Group by varying data only.** If two or more test cases differ only in input data with identical steps, plan them as one data-driven test using `testData.forEach(...)` over a `test-data/**` fixture, instead of separate test cases — this cuts both code duplication and redundant browser context setup.
3. **Map to existing layers.** For each cluster, search `tests/`, `test-flows/`, `modules/pages/`, `modules/components/`, `fixtures/` for reusable Page Objects, Components, Flows, and Fixtures. Mark each required layer as `reuse` or `new`. Do not plan a new layer when an existing one already covers the behavior.
4. **Assign target spec files.** One file per feature/domain following `tests/<domain>/<Feature>Test.spec.ts`, matching `agent3-coder`'s convention. List which test case IDs map into which file.
5. **Classify dependency vs independence.**
   - Independent cases (no shared mutable state, e.g. two unrelated validation checks) can run in any order/in parallel.
   - Dependent cases (e.g. register an account, then log in with it) must stay in the same file/`describe.serial` block and run in a fixed order — never split across files relying on execution order between files.
6. **Order for fastest useful feedback.**
   - Put high-priority/critical-path cases first within each file so failures surface early.
   - Keep fast validation-only cases (e.g. field-level negative checks) separate from slow multi-step flows (e.g. full checkout) so a quick run can target only the fast group.
   - Check `playwright.config.js` for `workers`/`fullyParallel`; only rely on cross-file parallelism for independent clusters, never for dependent ones.
7. **Flag risk.** Note any cluster likely to cause flakiness or duplication (e.g. two clusters touching the same shared test account/data) and the reused/new layer decision behind it.
8. **Record open questions.** If a manual test case is ambiguous about route, precondition, or data, list it as an open question instead of guessing — do not invent a plan for an unclear case.

## Required plan format

```markdown
## Implementation Plan: <feature>

### Spec file: tests/<domain>/<Feature>Test.spec.ts
- Test cases: TC-001, TC-002 (data-driven: <field> varies)
- Precondition/route: <shared starting state>
- Layers: Component <reuse|new>, Page Object <reuse|new>, Flow <reuse|new>, Fixture <reuse|new>
- Execution order: TC-001 -> TC-002 (independent, may run in parallel)

### Spec file: tests/<domain>/<OtherFeature>Test.spec.ts
- Test cases: TC-003 -> TC-004 (dependent, must run in this order, same file)
- ...

### Risks / open questions
- <cluster or test case>: <risk or unresolved detail>
```

## Rules

- Do not generate Component/Page Object/Flow/Fixture/test code in this skill — only the plan.
- Do not reorder or merge test cases in a way that changes their observable expected result.
- Never plan dependent cases to run in parallel or across separate files.
- Prefer reusing an existing spec file/describe block over creating a new one for the same feature.
- Keep the plan traceable to test case IDs so `agent3-coder` can implement it without re-deriving scope.

## Handoff

Pass the plan (spec file groupings, reuse/new layer decisions, execution order, risks) to `agent2-explorer` for element verification and locator capture per cluster, then to `agent3-coder` to implement each spec file in the planned order.
