import { test } from '../../test-flows/global/SearchFlow';
import testData from '../../test-data/global/SearchData.json';
import ROUTES from '../../constants/Routes';

testData.forEach(data => {
    test(`Test product search | keyword: ${data.keyword}`, async ({ page, searchFlow }) => {
        await page.goto(ROUTES.home);
        await searchFlow.searchForProduct(data.keyword);
        await searchFlow.verifyResultsContainKeyword(data.keyword);
    });
});
