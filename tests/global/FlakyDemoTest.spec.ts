import { test, expect } from '@playwright/test';

// Intentionally flaky: fails on the first attempt, passes on retry #1.
// Title is static so retries can find the test (see flaky-test-triage skill).
test('Flaky demo', async ({}, testInfo) => {
    console.log(`Run timestamp: ${Date.now()}`);
    expect(testInfo.retry, 'Fails on first attempt on purpose, simulating flakiness').toBeGreaterThan(0);
});
