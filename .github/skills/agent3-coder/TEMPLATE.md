# agent3-coder — Automation Script Templates

Copy-paste-ready templates for every layer, derived from real, working files in this repository (not invented). When generating a new automation script, start from the matching template below instead of free-styling a new shape. Cross-check against the real files linked in each section — if a template and the live file ever disagree, the live file wins.

See [SKILL.md](SKILL.md) for the decision flow (when to reuse vs. create each layer) and [project-config.md](../../project-config.md) for env/route/selector-convention facts referenced here.

## 0. Canonical reference chains (read these first)

- Multi-variant product flow: [CheapComputerFixtureTest.spec.ts](../../../tests/computer/CheapComputerFixtureTest.spec.ts) → [OrderComputerFlow.ts](../../../test-flows/computer/OrderComputerFlow.ts) → [ComputerDetailsPage.ts](../../../modules/pages/ComputerDetailsPage.ts) → [CheapComputerComponent.ts](../../../modules/components/computer/CheapComputerComponent.ts) / [ComputerEssentialComponent.ts](../../../modules/components/computer/ComputerEssentialComponent.ts) → [BaseItemDetailsComponent.ts](../../../modules/components/BaseItemDetailsComponent.ts), data from [CheapComputerData.json](../../../test-data/computer/CheapComputerData.json).
- Simple form flow: [RegisterTest.spec.ts](../../../tests/global/RegisterTest.spec.ts) → [RegisterFlow.ts](../../../test-flows/global/RegisterFlow.ts) → [RegisterPage.ts](../../../modules/pages/RegisterPage.ts) → [RegisterFormComponent.ts](../../../modules/components/global/register/RegisterFormComponent.ts), data from `test-data/global/RegisterGenderData.ts`.

## 1. Component

### 1a. Simple Component — `@selector(...)` decorator convention

Use when the sibling files in the target domain folder already use this convention (e.g. `modules/components/global/register/`, `modules/components/computer/`).

```typescript
import { Locator } from "@playwright/test";
import { selector } from "../SelectorDecorator";

@selector(".my-component-root")
export default class MyComponent {
    protected component: Locator;

    private submitBtnSel = 'button[type="submit"]';
    private errorSel = '.field-validation-error';

    constructor(component: Locator) {
        this.component = component;
    }

    public async clickSubmit(): Promise<void> {
        await this.component.locator(this.submitBtnSel).click();
    }

    public async getErrorMessage(): Promise<string> {
        return (await this.component.locator(this.errorSel).textContent()).trim();
    }
}
```

### 1b. Simple Component — `public static selector` convention

Use when the sibling files in the target domain folder use this convention instead (e.g. `modules/components/global/header/`, `modules/components/global/footer/`, `ProductItemComponent.ts`).

```typescript
import { Locator } from "@playwright/test";

export default class MyComponent {
    public static selector: string = ".my-component-root";

    private submitBtnSel: string = 'button[type="submit"]';

    constructor(private component: Locator) {
        this.component = component;
    }

    public async clickSubmit(): Promise<void> {
        await this.component.locator(this.submitBtnSel).click();
    }
}
```

### 1c. Abstract base Component + variants — when several near-identical UI widgets share behavior

Mirrors `BaseItemDetailsComponent` → `ComputerEssentialComponent` (abstract) → `CheapComputerComponent`/`StandardComputerComponent`. Use this shape instead of copy-pasting near-duplicate Components when 2+ variants share most methods and differ only in a few.

```typescript
// modules/components/<domain>/<Domain>EssentialComponent.ts — shared abstract base
import { Locator } from "@playwright/test";
import BaseItemDetailsComponent from "../BaseItemDetailsComponent"; // or another shared base

export default abstract class MyDomainEssentialComponent extends BaseItemDetailsComponent {
    protected constructor(component: Locator) {
        super(component);
    }

    // Methods that differ per variant stay abstract:
    public abstract selectVariantSpecificOption(type: string): Promise<string>;

    // Methods shared by every variant go here as concrete implementations:
    protected async selectOption(type: string): Promise<string> {
        const optionSel = `//label[contains(text(),"${type}")]`;
        const optionEle = (await this.component.locator(optionSel).all())[0];
        await optionEle.scrollIntoViewIfNeeded();
        const optionText = await optionEle.textContent();
        await optionEle.click();
        return optionText;
    }
}
```

```typescript
// modules/components/<domain>/<Variant>Component.ts — one per variant
import { Locator } from "@playwright/test";
import MyDomainEssentialComponent from "./MyDomainEssentialComponent";
import { selector } from "../SelectorDecorator";

@selector(".product-essential")
export default class VariantAComponent extends MyDomainEssentialComponent {
    constructor(component: Locator) {
        super(component);
    }

    async selectVariantSpecificOption(type: string): Promise<string> {
        return await this.selectOption(type);
    }
}
```

## 2. Page Object

### 2a. Standard Page Object

```typescript
import { Page } from "@playwright/test";
import MyComponent from "../components/<domain>/MyComponent";

export default class MyPage {
    constructor(private page: Page) {}

    public myComponent(): MyComponent {
        return new MyComponent(this.page.locator(MyComponent.selectorValue)); // or MyComponent.selector for the public-static convention
    }
}
```

### 2b. Page Object with a generic factory (interchangeable variant Components)

Mirrors `ComputerDetailsPage.computerComp<T>()` — use this instead of adding one accessor method per variant.

```typescript
import { Locator, Page } from "@playwright/test";
import MyDomainEssentialComponent from "../components/<domain>/MyDomainEssentialComponent";

export type MyDomainComponentConstructor<T extends MyDomainEssentialComponent> = new (component: Locator) => T;

export default class MyDomainDetailsPage {
    constructor(private page: Page) {}

    public myDomainComp<T extends MyDomainEssentialComponent>(
        componentClass: MyDomainComponentConstructor<T>
    ): T {
        return new componentClass(this.page.locator(componentClass.selectorValue));
    }
}
```

Rule: never call `page.goto()` inside a Page Object — navigation is a test/flow-level concern.

## 3. Fixture registration

Edit [fixtures/PageObjectTestFixture.ts](../../../fixtures/PageObjectTestFixture.ts) — add the type entry and the fixture factory, no navigation inside:

```typescript
export type PageObjectFixtures = {
    // ...existing entries
    myPage: MyPage,
};

export const test = pageObjectFixture.extend<PageObjectFixtures>({
    // ...existing entries
    myPage: async ({ page }, use) => {
        const myPage = new MyPage(page);
        await use(myPage);
    },
});
```

Only add a new **worker-scoped** fixture (like [GlobalBeforeAllFixture.ts](../../../fixtures/GlobalBeforeAllFixture.ts)) for one-time setup that must run once per worker — it must depend on `browser`, never on `page` (scope mismatch), and must create/close its own page internally.

## 4. Flow

Mirrors [OrderComputerFlow.ts](../../../test-flows/computer/OrderComputerFlow.ts) / [RegisterFlow.ts](../../../test-flows/global/RegisterFlow.ts):

```typescript
import { expect } from "@playwright/test";
import { test as pageObjectFixtures, PageObjectFixtures } from "../../fixtures/PageObjectTestFixture";
import { test as globalTestAll } from "../../fixtures/GlobalBeforeAllFixture";
import { mergeTests } from "@playwright/test";

export const test = mergeTests(pageObjectFixtures, globalTestAll).extend<{ myFlow: MyFlow }>({
    myFlow: async ({ myPage, otherPage }, use) => {
        const myFlow = new MyFlow({ myPage, otherPage });
        await use(myFlow);
    }
});

export default class MyFlow {
    constructor(
        private readonly fixture: Pick<PageObjectFixtures, 'myPage' | 'otherPage'>
    ) {}

    // One business step per public method — a test composes these.
    public async doBusinessStep(expectedValue: number): Promise<void> {
        const myComponent = this.fixture.myPage.myComponent();
        await myComponent.clickSubmit();
        // Business-invariant assertions belong here, not in the test:
        expect(await myComponent.getSomeValue()).toBe(expectedValue);
    }
}
```

## 5. Constants

`constants/Routes.ts` — relative path only, never a full URL:

```typescript
const ROUTES = {
    // ...existing routes
    myFeature: '/my-relative-path',
};
export default ROUTES;
```

`constants/<Domain>.ts` — magic-string maps (mirrors `Payment.ts`/`CreditCardType.ts`):

```typescript
const MY_DOMAIN_CONST = {
    optionA: 'Option A Label',
    optionB: 'Option B Label',
};
export default MY_DOMAIN_CONST;
```

## 6. Test data

### 6a. Pure JSON — no PII, never needs to change per run

`test-data/<domain>/<Name>Data.json` (mirrors `CheapComputerData.json`):
```json
[
    { "ram": "4 GB", "hdd": "320 GB", "processorType": "2.2 GHz Intel Pentium Dual-Core T4200" }
]
```

### 6b. `.ts` env-override wrapper — PII or environment-specific values

`test-data/<domain>/<Name>.ts` wrapping a sibling `.json` (mirrors [DefaultCheckoutUser.ts](../../../test-data/DefaultCheckoutUser.ts)):
```typescript
import defaultData from './<Name>.json';

const <Name> = {
    ...defaultData,
    email: process.env.SOME_ENV_VAR || defaultData.email,
};
export default <Name>;
```

### 6c. Unique-per-run values

Use `utils/TestDataHelper.ts`'s `uniqueEmail(prefix)` inside a `.ts` test-data wrapper or directly in the test body (module-load time, never inside a `test()` title string):
```typescript
import { uniqueEmail } from '../../utils/TestDataHelper';
const email = uniqueEmail('my-prefix');
```

## 7. Test spec

Location: `tests/<domain>/<Feature>Test.spec.ts`. Mirrors [CheapComputerFixtureTest.spec.ts](../../../tests/computer/CheapComputerFixtureTest.spec.ts):

```typescript
import { test } from '../../test-flows/<domain>/<Name>Flow';
import testData from '../../test-data/<domain>/<Name>Data.json';
import ROUTES from '../../constants/Routes';

testData.forEach(data => {
    test(`Test <scenario> | <varying field>: ${data.someField}`, async ({ page, myFlow }) => {
        await page.goto(ROUTES.myFeature);
        await myFlow.doBusinessStep(data.expectedValue);
    });
});
```

Single-scenario variant (no data variation):
```typescript
import { test } from '../../test-flows/<domain>/<Name>Flow';
import ROUTES from '../../constants/Routes';

test('Test <scenario> | TC-XXX: <short description>', async ({ page, myFlow }) => {
    await page.goto(ROUTES.myFeature);
    await myFlow.doBusinessStep(42);
});
```

## 8. `utils/` helper (only for genuinely cross-domain logic)

Mirrors [TestDataHelper.ts](../../../utils/TestDataHelper.ts) / [PageHelper.ts](../../../utils/PageHelper.ts) — a plain exported async function, `Page` (or other Playwright type) as the first parameter when it needs page access:

```typescript
import { Page } from "@playwright/test";

export async function myHelper(page: Page, someArg: string): Promise<void> {
    // ...
}
```

## Checklist before handing off

- [ ] Searched `modules/**`, `test-flows/**`, `utils/**` project-wide for an existing equivalent before writing anything new (see SKILL.md Step 1).
- [ ] Matched the sibling-file selector convention (`@selector(...)` vs `public static selector`) in the target domain folder.
- [ ] Test data `.json` lives under `test-data/<domain>/`, never inline in the spec.
- [ ] `page.goto(ROUTES.xxx)` is explicit in the test body, not in a Page Object or fixture.
- [ ] Test title maps 1:1 to the manual test case it implements: `<TC-ID>: <manual test case's scenario title>` — not just the ID loosely present somewhere in a freely-invented title.
- [ ] `get_errors` run on every new/changed `.ts` file, and the new spec executed at least once.
