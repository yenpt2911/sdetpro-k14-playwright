import {test as base} from  '@playwright/test';

export const test = base.extend<{initValue: string, somethingElse: number}>({

    initValue: async ({page}, use) => {
        console.log('Before test body');
        await use("initValue");
        console.log('After test body');
    },

    somethingElse: async ({page}, use) => {
        await use(1);
    }
});

