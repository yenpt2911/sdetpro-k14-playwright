# Manual Test Cases: Register New Account

Source: https://demowebshop.tricentis.com/register — analyzed live (real Edge browser, see Phase 3 evidence below).

### TC-001: Register with gender = male
- Priority: High
- Type: Positive
- Preconditions:
  - Not logged in
- Test data:
  - gender: male
  - firstName: New
  - lastName: Account
  - email: unique per run (e.g. `newaccount-0<timestamp>@example.com`)
  - password: `Test@12345`

| Step | Action | Expected result |
|------|--------|-----------------|
| 1 | Navigate to `/register` | Registration form is displayed |
| 2 | Select gender "Male" | Radio button is checked |
| 3 | Fill First name, Last name, Email, Password, Confirm password | Fields accept input |
| 4 | Click "Register" | Redirected to result page showing "Your registration completed" |

### TC-002: Register with gender = female
- Priority: High
- Type: Positive
- Same as TC-001, gender: female.

### TC-003: Register with no gender selected
- Priority: Medium
- Type: Alternate
- Same as TC-001 but gender is not selected — site does not require gender, registration still succeeds.

### TC-004: Register with all fields empty
- Priority: High
- Type: Negative
- Preconditions:
  - Not logged in
- Test data:
  - all fields empty
- Verified live (real error text):

| Step | Action | Expected result |
|------|--------|-----------------|
| 1 | Navigate to `/register` | Registration form is displayed |
| 2 | Click "Register" without filling any field | Field errors appear: "First name is required.", "Last name is required.", "Email is required.", "Password is required." |

### TC-005: Register with invalid email format
- Priority: High
- Type: Validation
- Test data:
  - email: `not-an-email`, other fields valid

| Step | Action | Expected result |
|------|--------|-----------------|
| 1 | Fill valid data except email = "not-an-email" | — |
| 2 | Click "Register" | Field error "Wrong email" appears next to Email (verified live) |

### TC-006: Register with an email that already has an account
- Priority: High
- Type: Negative
- Preconditions:
  - An account with a known email already exists (register it first in the same test)
- Test data:
  - email: the same email used in a prior successful registration

| Step | Action | Expected result |
|------|--------|-----------------|
| 1 | Register successfully with a fresh unique email, then log out | Registration succeeds |
| 2 | Navigate to `/register` again and submit the same email with different other fields | A summary error "The specified email already exists" appears in `.validation-summary-errors` (NOT in the per-field Email span, which stays empty — verified live evidence, see [RegisterFormComponent.ts](../modules/components/global/register/RegisterFormComponent.ts)) |

### TC-007: Register with password and confirm password mismatch
- Priority: High
- Type: Validation
- Test data:
  - password: `Test@12345`, confirmPassword: `Different@123`

| Step | Action | Expected result |
|------|--------|-----------------|
| 1 | Fill valid data with mismatching password/confirm password | — |
| 2 | Click "Register" | Field error "The password and confirmation password do not match." appears |

## Handoff

Implemented and passing as [RegisterTest.spec.ts](../tests/global/RegisterTest.spec.ts) (TC-001/002/003), [RegisterValidationTest.spec.ts](../tests/global/RegisterValidationTest.spec.ts) (TC-004/005/007), [RegisterDuplicateEmailTest.spec.ts](../tests/global/RegisterDuplicateEmailTest.spec.ts) (TC-006).
