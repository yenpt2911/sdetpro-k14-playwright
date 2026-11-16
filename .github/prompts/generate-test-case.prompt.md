---
description: "Generate manual test cases from a requirement source using the playwright-requirement-to-test agent and agent0-create-manual-test-case skill"
name: "Generate Test Case"
argument-hint: "Requirement source (file path, pasted text, or feature/page name on demowebshop.tricentis.com)"
agent: "playwright-requirement-to-test"
---
Generate manual test cases for the following requirement:

${input:requirement:Describe the requirement, feature, or paste the requirement source (file/text/URL section)}

Run only Phase 1 (Create manual test cases) of your workflow:
1. If the requirement above is a URL, open it and analyze the live page directly; otherwise read and break the provided requirement into atomic requirements (actor, action, expected outcome, priority).
2. Split into positive, negative, boundary, and alternate scenarios only when supported by the requirement — do not invent behavior.
3. Write Given/When/Then acceptance criteria tied to an observable UI/state change.
4. Search `tests/`, `test-flows/`, `modules/pages/`, `modules/components/` for existing coverage of the same requirement and note any overlap.
5. Load `agent0-create-manual-test-case` and produce manual test cases with stable IDs, preconditions, test data, numbered actions, and observable expected results. Produce CSV/Excel-ready rows if the requirement implies spreadsheet output.

Do not inspect live UI elements and do not generate or run any Playwright code in this pass — stop after the manual test cases are produced and report assumptions or open questions instead of guessing.


