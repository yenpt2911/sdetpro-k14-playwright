import { test, expect } from '@playwright/test';
import SearchApiClient from '../../modules/api/SearchApiClient';
import testData from '../../test-data/api/SearchApiData.json';

testData.forEach(data => {
    test(`Test API search | query: ${data.query}`, async ({ request }) => {
        const apiClient = new SearchApiClient(request);
        const response = await apiClient.search(data.query);

        expect(response.status()).toBe(200);
        const body = await response.text();
        expect(body.toLowerCase()).toContain(data.query.toLowerCase());
    });
});
