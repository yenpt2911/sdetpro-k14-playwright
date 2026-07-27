# Playwright E2E Testing Guide

## 1. Muc tieu cua project

Project nay dung Playwright de viet E2E test theo mo hinh tach lop ro rang:

- `tests/`: noi chua test case
- `test-data/`: du lieu dau vao cho tung kịch bản test
- `test-flows/`: business flow gom nhieu buoc lon
- `modules/pages/`: page object dai dien cho tung trang
- `modules/components/`: component object dai dien cho tung khu vuc hoac widget tren trang
- `utils/`: helper dung chung

Muc tieu cua cach to chuc nay la giup test:

- de doc
- de tai su dung
- de mo rong khi them san pham hoac flow moi
- giam duplicate code UI actions

## 2. Cau truc hien tai

```text
.
|-- modules/
|   |-- components/
|   |   |-- BaseItemDetailsComponent.ts
|   |   |-- SelectorDecorator.ts
|   |   `-- computer/
|   |       |-- ComputerEssentialComponent.ts
|   |       |-- CheapComputerComponent.ts
|   |       `-- StandardComputerComponent.ts
|   `-- pages/
|       |-- ComputerDetailsPage.ts
|       |-- ShoppingCartPage.ts
|       |-- CheckoutOptionsPage.ts
|       `-- CheckoutPage.ts
|-- test-data/
|   `-- computer/
|       |-- CheapComputerData.json
|       `-- StandardComputerData.json
|-- test-flows/
|   `-- computer/
|       `-- OrderComputerFlow.ts
|-- tests/
|   `-- computer/
|       |-- CheapComputerTest.spec.ts
|       `-- StandardComputerTest.spec.ts
|-- playwright.config.js
`-- package.json
```

## 3. Mo hinh thiet ke chinh

### 3.1 Luong chay test

```text
spec file
-> test-data
-> flow
-> page
-> component
-> Playwright locator/action
```

Vi du voi cheap computer:

- `tests/computer/CheapComputerTest.spec.ts`
- `test-data/computer/CheapComputerData.json`
- `test-flows/computer/OrderComputerFlow.ts`
- `modules/pages/ComputerDetailsPage.ts`
- `modules/components/computer/CheapComputerComponent.ts`
- `modules/components/computer/ComputerEssentialComponent.ts`
- `modules/components/BaseItemDetailsComponent.ts`

### 3.2 Vai tro tung lop

#### `spec`
Chi mo ta test scenario o muc cao:

- vao trang nao
- dung flow nao
- truyen component nao
- truyen du lieu nao
- verify den dau

#### `test-data`
Chua du lieu cau hinh cho test, vi du:

- processor
- RAM
- HDD
- software
- OS
- thong tin checkout

#### `flow`
Dong goi business flow lon, vi du:

- build cau hinh may tinh
- add to cart
- verify shopping cart
- checkout guest
- input billing
- input shipping

#### `page`
Dai dien cho mot page va la noi tap hop cac component thuoc page do.

Vi du `ComputerDetailsPage` tra ve:

- computer component
- header component
- bar notification text

#### `component`
Dong goi thao tac tren mot khu vuc cu the cua UI.

Vi du:

- `BaseItemDetailsComponent`: gia, so luong, add to cart, bo chon default options
- `ComputerEssentialComponent`: hanh vi chung cho computer details
- `CheapComputerComponent`: cach chon option cua cheap computer
- `StandardComputerComponent`: cach chon option cua standard computer

## 4. File cau hinh dang duoc su dung

Repo dang co 2 file config:

- `playwright.config.ts`: `testDir = './e2e'`
- `playwright.config.js`: `testDir = './tests'`

Voi source code hien tai, cac test chinh dang nam trong `tests/`, vi vay file config phu hop voi framework nay la `playwright.config.js`.

Neu chay `npm test`, script hien tai goi `playwright test --headed`, Playwright se uu tien file config mac dinh trong root. Hay giu y dieu nay neu ban thay ket qua chay khong dung thu muc mong muon.

## 5. Cach chay test

### Cai dependencies

```bash
npm install
npx playwright install
```

### Chay toan bo test trong `tests/`

```bash
npx playwright test --config=playwright.config.js
```

### Chay test co giao dien headed

```bash
npx playwright test --config=playwright.config.js --headed
```

### Chay 1 file test

```bash
npx playwright test tests/computer/CheapComputerTest.spec.ts --config=playwright.config.js
```

### Chay UI mode

```bash
npm run ui
```

Neu muon UI mode dung dung thu muc `tests/`, nen chay:

```bash
npx playwright test --config=playwright.config.js --ui
```

## 6. Cach tao mot E2E test moi theo source code nay

Duoi day la quy trinh khuyen nghi khi them mot test moi.

### Buoc 1. Tao test data

Them file JSON trong `test-data/` theo domain phu hop.

Vi du tao file:

`test-data/computer/MyComputerData.json`

```json
{
  "processorType": "2.2 GHz",
  "ram": "8GB",
  "hdd": "400 GB",
  "software": "Image Viewer"
}
```

Neu flow can them du lieu khac, ban them field moi trong JSON va doc field do o flow/component.

### Buoc 2. Tao hoac tai su dung component

Neu trang san pham moi co logic chon option giong component da co, co the tai su dung.

Neu can them component moi, tao file trong `modules/components/<domain>/`.

Vi du:

```ts
import { Locator } from "@playwright/test";
import ComputerEssentialComponent from "./ComputerEssentialComponent";
import { selector } from "../SelectorDecorator";

@selector(".product-essential")
export default class MyComputerComponent extends ComputerEssentialComponent {
    constructor(component: Locator) {
        super(component);
    }

    async selectProcessorType(type: string): Promise<string> {
        return await this.selectCompOption(type);
    }

    async selectRAMType(type: string): Promise<string> {
        return await this.selectCompOption(type);
    }
}
```

Khi nao can component moi?

- HTML/locator khac component cu
- cach chon option khac, vi du dropdown thay vi radio/checkbox
- can them hanh vi rieng cho mot loai san pham

### Buoc 3. Tai su dung hoac cap nhat page object

`ComputerDetailsPage` dang co generic method:

```ts
computerComp<Tun extends ComputerEssentialComponent>(
    computerComponentClass: ComputerComponentConstructor<Tun>
): Tun
```

Muc dich cua method nay la nhan vao class component va tra ve dung instance component do.

Neu page moi la page khac hoan toan, tao page object moi trong `modules/pages/`.

### Buoc 4. Tai su dung hoac viet flow

Neu business flow giong nhau, tiep tuc dung `OrderComputerFlow`.

Flow nay hien tai da gom:

- build spec
- add to cart
- verify shopping cart
- agree TOS
- checkout guest
- input billing address
- input shipping address
- select shipping method

Neu luong nghiep vu khac, tao flow moi trong `test-flows/`.

Nen dat flow o muc business thay vi viet thang vao spec file de:

- spec ngan gon
- de tai su dung nhieu lan
- de bao tri

### Buoc 5. Tao file spec

Them file vao `tests/` theo domain.

Vi du:

```ts
import { test } from '@playwright/test';
import OrderComputerFlow from '../../test-flows/computer/OrderComputerFlow';
import MyComputerComponent from '../../modules/components/computer/MyComputerComponent';
import testData from '../../test-data/computer/MyComputerData.json';

test('Test my computer component', async ({ page }) => {
    await page.goto('https://demowebshop.tricentis.com/build-your-own-computer');

    const computerFlow = new OrderComputerFlow(page, MyComputerComponent, testData);

    await computerFlow.buildCompSpecAndAddToCart();
    await computerFlow.verifyShoppingCart();
    await computerFlow.agreeTOSAndCheckout();
    await computerFlow.inputBillingAddress();
    await computerFlow.inputShippingAddress();
    await computerFlow.selectShippingMethod();
});
```

## 7. Cach quyet dinh tao file o dau

### Tao trong `tests/` khi:

- ban dang mo ta mot scenario hoan chinh
- ban chi can noi cac buoc lon lai voi nhau

### Tao trong `test-flows/` khi:

- nhieu test dung cung mot luong nghiep vu
- can gop nhieu page/component actions thanh business step

### Tao trong `modules/pages/` khi:

- can dai dien cho mot page moi
- can tra ve component tren page do
- can boc tach locator/page-level actions

### Tao trong `modules/components/` khi:

- can thao tac voi 1 khu vuc UI cu the
- can tai su dung locators va actions cua mot widget
- page qua lon nen can tach nho

### Tao trong `test-data/` khi:

- ban muon tach du lieu khoi test logic
- can chay nhieu bo data cho cung 1 flow

## 8. Convention dang duoc ap dung trong repo

### 8.1 Dat ten file

- test file: `SomethingTest.spec.ts`
- flow file: `SomethingFlow.ts`
- page file: `SomethingPage.ts`
- component file: `SomethingComponent.ts`
- data file: `SomethingData.json`

### 8.2 Test nen mong va ro y nghia

Spec file nen ngan gon, uu tien:

- `goto`
- khoi tao flow
- goi cac buoc muc cao
- tranh viet locator truc tiep trong spec

### 8.3 Dung data-driven

Khong hard-code gia tri chon option trong component neu no thuoc ve test scenario. Dua du lieu vao JSON va truyen vao flow.

### 8.4 Tai su dung base class

- `BaseItemDetailsComponent` cho hanh vi chung cua trang chi tiet san pham
- `ComputerEssentialComponent` cho hanh vi chung cua computer
- component cu the chi override phan khac nhau

## 9. Vi du workflow tao test moi

Vi du ban muon test `Standard computer`:

1. Tao data trong `test-data/computer/StandardComputerData.json`
2. Dung `StandardComputerComponent` de xu ly dropdown
3. Dung `OrderComputerFlow` de build spec va checkout
4. Tao `tests/computer/StandardComputerTest.spec.ts`
5. Chay:

```bash
npx playwright test tests/computer/StandardComputerTest.spec.ts --config=playwright.config.js
```

## 10. Luu y ky thuat tu source hien tai

### 10.1 Co 2 kieu chon option

- `CheapComputerComponent`: chon bang text label va click
- `StandardComputerComponent`: chon bang dropdown option

Dieu nay cho thay component la noi dung de xu ly khac biet ve UI implementation.

### 10.2 Flow dang chiu trach nhiem tinh gia va checkout

`OrderComputerFlow` hien tai khong chi add to cart ma con:

- tinh tong gia theo option da chon
- verify shopping cart
- chay tiep checkout guest

Neu sau nay flow qua dai, nen tach nho them theo module, vi du:

- `BuildComputerFlow`
- `CartFlow`
- `CheckoutFlow`

### 10.3 Can thong nhat config Playwright

Do repo dang co ca `playwright.config.ts` va `playwright.config.js`, nen de tranh nham lan ban nen:

- giu 1 file config chinh
- hoac luon chay command kem `--config=playwright.config.js`

## 11. Checklist khi them E2E test moi

- [ ] Xac dinh page can test
- [ ] Xac dinh co can page object moi khong
- [ ] Xac dinh co can component moi khong
- [ ] Tao file data JSON
- [ ] Tao hoac tai su dung flow
- [ ] Tao file spec
- [ ] Chay rieng file spec vua tao
- [ ] Kiem tra HTML report

## 12. Lenh mau thuong dung

```bash
npx playwright test --config=playwright.config.js
npx playwright test tests/computer/CheapComputerTest.spec.ts --config=playwright.config.js
npx playwright test tests/computer/StandardComputerTest.spec.ts --config=playwright.config.js
npx playwright show-report
```

## 13. Tom tat

Neu ban muon tao E2E test moi trong repo nay, hay nho quy tac don gian sau:

1. Dat test scenario trong `tests/`
2. Dat du lieu trong `test-data/`
3. Dat business steps trong `test-flows/`
4. Dat page-level actions trong `modules/pages/`
5. Dat component-level actions trong `modules/components/`
6. Tai su dung base classes toi da
7. Chay test voi `playwright.config.js`

Mo hinh nay phu hop khi project co nhieu test case cung dung chung page va component, va can duy tri source code de doc, de mo rong, de bao tri.
