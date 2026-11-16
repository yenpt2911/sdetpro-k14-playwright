# Hướng dẫn sử dụng bộ Agent/Skill — sdetpro-k14-playwright

Tài liệu tổng hợp toàn bộ chức năng, luồng chạy (flow), và cách sử dụng các skill trong `.github/skills/` + agent điều phối trong `.github/agents/` của project này. Đọc file này trước khi tự tay chỉnh sửa hoặc gọi từng skill riêng lẻ.

## 1. Mục đích tổng thể

Bộ agent này biến **1 requirement (thường là 1 URL sống)** thành **1 bộ Playwright automation script chạy pass**, đi qua 5 bước (phase) tuần tự, mỗi bước có bằng chứng thật (không suy diễn/bịa):

```text
URL/Requirement
  -> [Phase 1] Manual test case (agent0)
  -> [Phase 2] Implementation plan (agent1)
  -> [Phase 3] Verify locator trên browser thật (agent2)
  -> [Phase 4] Sinh code automation (agent3)
  -> [Phase 5] Chạy test, debug nếu fail (agent4), traceability check, dọn dẹp
```

## 2. Cấu trúc file

```text
.github/
  agents/
    playwright-requirement-to-test.agent.md   # Agent điều phối — chạy full 5 phase
  skills/
    agent0-create-manual-test-case/SKILL.md
    agent1-tc-planner-test-script-implementation/SKILL.md
    agent2-explorer/SKILL.md
    agent3-coder/SKILL.md
    agent3-coder/TEMPLATE.md                  # Template code copy-paste cho từng layer
    agent4-debugger/SKILL.md
    test-data-environment/SKILL.md
    HDSD.md                                   # Chính là file này
  workflows/
    agent-failure-routing.md                  # Bảng routing khi test fail
  project-config.md                           # Nguồn sự thật duy nhất: env/route/kiến trúc/convention
```

## 3. Cách gọi

- **Gọi cả pipeline**: dùng agent mode `playwright-requirement-to-test` (file `.agent.md`) — nó tự load lần lượt từng skill theo đúng thứ tự 5 phase.
- **Gọi 1 skill riêng lẻ**: nêu rõ ý định khớp với phần "Use when..." trong `description` của từng `SKILL.md`, ví dụ:
  - "phân tích trang X, viết manual test case" -> `agent0-create-manual-test-case`
  - "lập plan gộp các test case này thành spec file nào" -> `agent1-tc-planner-test-script-implementation`
  - "mở trình duyệt kiểm tra locator của nút Register" -> `agent2-explorer`
  - "viết test cho chức năng Y" -> `agent3-coder`
  - "test vừa gen bị fail, sửa giúp" -> `agent4-debugger`
  - "thêm test data cho...", "email bị trùng" -> `test-data-environment`

## 4. Chi tiết từng Phase/Skill

### Phase 1 — `agent0-create-manual-test-case`
- **Input**: URL hoặc requirement text.
- **Việc làm**: mở live page (browser tool), phân tích thành atomic requirement, tách scenario Positive/Negative/Boundary/Alternate (chỉ khi có căn cứ, không bịa), viết test case có ID ổn định (`TC-001`, ...), precondition, test data, step đánh số, expected result quan sát được.
- **Output**: manual test case dạng Markdown (bảng Step/Action/Expected) hoặc CSV.
- **Không** viết code Playwright ở bước này.

### Phase 2 — `agent1-tc-planner-test-script-implementation`
- **Input**: manual test case từ Phase 1.
- **Việc làm**: gom case theo route/precondition chung thành 1 spec file; case chỉ khác **data** thành 1 test data-driven (`testData.forEach`); xác định layer nào reuse/mới (Component/Page/Flow/Fixture); phân loại case độc lập (chạy song song được) vs phụ thuộc (phải chạy tuần tự cùng file); sắp thứ tự chạy để feedback nhanh nhất.
- **Output**: bản kế hoạch (spec file nào chứa TC nào, layer reuse/new, thứ tự chạy, rủi ro). **Không** sinh code.

### Phase 3 — `agent2-explorer`
- **Input**: URL/route + manual test case.
- **Việc làm bắt buộc**:
  1. Mở **trình duyệt Edge thật** (không dùng browser preview nhúng của VS Code) bằng cách chạy 1 script Playwright ngắn qua terminal (`chromium.launch({ channel: 'msedge', headless: false })`), đặt tạm ở `tmp/`.
  2. Tái hiện precondition sống (login, tạo dữ liệu trước...) rồi đi theo đúng step của manual test case.
  3. Với mỗi element cần verify: lấy role/name/label/attribute + **XPath** (theo đúng thứ tự ưu tiên sinh XPath — xem mục 5.2), thực thi 1 hành động/assertion tối thiểu để chứng minh locator hoạt động thật.
  4. Chọn locator code thật theo **Locator priority** (xem mục 5.1).
  5. Lưu locator đã verify thành file `.ts` (Component stub) tại `modules/components/<domain>/`, khớp convention của file cùng thư mục (`@selector(...)` hay `public static selector`).
  6. **Xóa script tạm** trong `tmp/` bằng lệnh terminal — bắt buộc, là hành động cuối cùng của phase.
- **Output**: Component `.ts` đã có locator verify sẵn (method chưa implement thì để `// TODO: implement in agent3-coder`).

### Phase 4 — `agent3-coder`
- **Input**: plan (Phase 2) + Component stub (Phase 3).
- **Kiến trúc bắt buộc**: `Test Spec -> Fixture -> Flow -> Page Object -> Component -> Playwright API`, cộng `Test Spec -> Test Data + Constants`. Không được nhảy cóc layer (test không được tạo `Locator` trực tiếp).
- **Trước khi viết bất kỳ hàm nào**: phải tìm trong toàn bộ `modules/**`, `test-flows/**`, `utils/**` xem đã có hàm tương đương chưa — có thì dùng/mở rộng, không có mới tạo mới (xem mục 5.3 "Reuse-first").
- **Test data `.json`**: bắt buộc nằm trong `test-data/<domain>/<Name>Data.json`, không inline trong spec.
- **Tên test phải map 1:1 với manual test case**: `` `<Feature> | <TC-ID>: <tiêu đề scenario manual>` `` — xem mục 5.4.
- **Template chuẩn**: dùng [TEMPLATE.md](agent3-coder/TEMPLATE.md) cho từng layer (Component thường / Component có base-abstract-variant / Page Object thường / Page Object generic factory / Fixture / Flow / Constants / Test data / Test spec / `utils/` helper) — tất cả lấy từ code thật đang chạy trong project (`OrderComputerFlow.ts`, `RegisterFlow.ts`...), không tự sáng tạo cấu trúc mới.
- **Output**: file `.spec.ts` + mọi Component/Page/Flow/Fixture/test-data/constants còn thiếu.

### Phase 5 — Execute & Debug (`agent4-debugger` khi fail)
1. Chạy spec hẹp nhất: `npx playwright test <path> --config=playwright.config.js`.
2. Pass -> báo cáo, dừng lại.
3. Fail -> phân loại theo **owning layer** (route/fixture/flow/page/component/selector/data/environment — xem [agent4-debugger/SKILL.md](agent4-debugger/SKILL.md)) và chỉ sửa đúng layer đó, không thêm wait/retry để né lỗi thật.
4. Nếu lỗi do locator/UI đổi -> quay lại Phase 2 -> Phase 3 -> Phase 4. Nếu lỗi code thuần -> `agent4-debugger` sửa trực tiếp (tối đa 3 vòng/loại lỗi). Nếu sai flow nghiệp vụ -> quay lại `agent0` sửa test case. Xem chi tiết bảng routing tại [agent-failure-routing.md](../workflows/agent-failure-routing.md).
5. **Traceability check** (bắt buộc trước khi báo hoàn thành): dùng `npx playwright test <path> --list` để lấy **tên test đã resolve runtime** (không `grep` trực tiếp file `.spec.ts` vì TC ID có thể được interpolate từ JSON data lúc chạy, `grep` source sẽ bị false-negative), đối chiếu với toàn bộ TC ID ở Phase 1 — TC ID nào không có test tương ứng phải liệt kê rõ là "coverage gap", không được báo pipeline hoàn thành nếu còn sót.
6. **Dọn dẹp cuối cùng** (bắt buộc): chỉ giữ lại file automation đã deliver (spec + Component/Page/Flow/Fixture/test-data/constants phụ thuộc). Xóa mọi file scratch/debug tạo ra trong quá trình (script `tmp/`, debug script...) bằng lệnh terminal thật.

## 5. Quy tắc xuyên suốt (áp dụng nhiều phase)

### 5.1 Locator priority (khi chọn API Playwright để hard-code)
1. Role + accessible name — `page.getByRole(...)`
2. Label — `page.getByLabel(...)`
3. Test ID — `page.getByTestId(...)`
4. Attribute ổn định — `page.locator('#Email')`, `[data-valmsg-for="Email"]`
5. CSS/XPath — chỉ khi không còn lựa chọn nào ổn định/unique hơn.

### 5.2 XPath generation priority (khi tự dựng chuỗi XPath làm bằng chứng)
1. `id` duy nhất -> 2. attribute ổn định (`name`/`data-*`/`aria-*`) -> 3. tag + attribute kết hợp -> 4. text hiển thị cố định -> 5. relative path từ ancestor ổn định -> 6. absolute/positional path (chỉ làm bằng chứng phụ, không bao giờ dùng làm selector chính thức).

### 5.3 Reuse-first (bắt buộc trước khi viết hàm mới)
- Tìm toàn project (`modules/**`, `test-flows/**`, `utils/**`) chứ không chỉ trong file đang sửa.
- Logic generic -> đặt đúng "common" theo phạm vi: dùng mọi domain -> `utils/**`; dùng chung Component cùng domain -> base Component class; dùng chung giữa Flow -> base Flow/hàm export dùng chung. Chỉ dùng 1 lần thì để local, không ép thành common.
- Test data: đọc `test-data/**` trước, chỉ thêm phần còn thiếu, không tạo bản sao gần giống.

### 5.4 Traceability tên test ↔ manual test case
- Test title bắt buộc chứa `<TC-ID>: <tiêu đề scenario manual>` — không đặt tên tự do không liên kết được với case gốc.
- Kiểm tra bằng `--list` (không `grep` source) vì TC ID có thể chỉ xuất hiện sau khi resolve data JSON lúc runtime.

### 5.5 Dọn dẹp scratch file
- Mọi script Playwright chạy qua terminal để khám phá/debug (không phải file automation chính thức) phải bị xóa bằng lệnh terminal ngay sau khi lấy xong bằng chứng — không để sót trong `tmp/` hay bất kỳ đâu trong repo.

## 6. Nguồn tham chiếu dùng chung

- [project-config.md](../project-config.md): BASE_URL/env resolution, danh sách route, 2 convention selector (`@selector` vs `public static selector`), fixture layers, reporting/execution config — mọi skill phải tra cứu ở đây thay vì tự suy đoán.
- [agent-failure-routing.md](../workflows/agent-failure-routing.md): bảng quyết định quay lại phase nào khi test fail, cap tối đa 3 vòng/loại lỗi.
- [TEMPLATE.md](agent3-coder/TEMPLATE.md): code mẫu copy-paste cho từng layer, lấy từ file thật trong repo.

## 7. Lỗi thường gặp cần tránh (rút ra từ thực tế project)

- Dùng browser preview nhúng của VS Code thay vì mở Edge thật qua terminal script — không được chấp nhận làm bằng chứng cho `agent2-explorer`.
- `Date.now()` sinh trùng giá trị khi gọi đồng bộ trong `.map()`/vòng lặp cùng 1 tick — phải salt thêm index khi cần unique nhiều giá trị cùng lúc.
- Nhúng giá trị động (`Date.now()`, `Math.random()`) trực tiếp vào `test()` title — làm Playwright mất khả năng match lại test khi retry (`Test not found in the worker process`). Sinh giá trị unique trong test-data, không trong title.
- `.validation-summary-errors` (lỗi server-side, ví dụ email trùng) khác với `[data-valmsg-for="..."]` (lỗi client-side per-field) — chọn đúng selector theo đúng loại lỗi đang test.
- Dùng `grep` trực tiếp trên file `.spec.ts` để kiểm tra traceability TC ID khi ID được interpolate từ JSON lúc runtime — phải dùng `--list` để lấy tên đã resolve.
- Markdown anchor link kiểu `[Text](#anchor)` trong các file `.md` này có thể gây false-positive lỗi "file not found" từ linter của project — dùng tham chiếu plain-text hoặc link tới file khác thay vì anchor nội bộ.
