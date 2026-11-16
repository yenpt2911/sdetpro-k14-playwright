/**
 * Generates a unique email for tests against real sites that reject duplicate registrations.
 * Safe to call at test-data module-load time; never embed the result in a `test()` title
 * (see flaky-test-triage skill — dynamic titles break retries).
 */
export function uniqueEmail(prefix: string, domain: string = 'example.com'): string {
    return `${prefix}${Date.now()}@${domain}`;
}
