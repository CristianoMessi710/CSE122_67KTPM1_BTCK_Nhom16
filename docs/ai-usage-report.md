# Báo cáo sử dụng AI trong dự án EventPulse

**Môn học:** CSE122 — Phát triển ứng dụng Web cơ bản.
**Lớp:** 67KTPM1.
**Nhóm:** 16.
**Người tổng hợp:** Nguyễn Hữu Tú — 2551170969.
**Ngày cập nhật:** 26/10/2026.

## 1. Mục đích và phạm vi

Báo cáo trình bày cách nhóm sử dụng AI trong quá trình xây dựng, tích hợp và chuẩn bị thuyết trình dự án EventPulse. Nội dung được tổng hợp từ trao đổi phát triển dự án và thông tin các thành viên cung cấp.

AI được sử dụng để phân tích yêu cầu, hỗ trợ sinh và chỉnh sửa HTML/CSS/JavaScript, giải thích code, hỗ trợ kiểm tra giao diện và soạn tài liệu. Các phần có AI tham gia sinh hoặc sửa mã được khai báo trong phạm vi hỗ trợ của từng thành viên.

## 2. Công cụ AI và cách sử dụng

| Công cụ | Thành viên sử dụng | Phạm vi hỗ trợ |
| --- | --- | --- |
| ChatGPT | SV1, SV2, SV3 | Phân tích yêu cầu, sinh và chỉnh sửa code, giải thích, hỗ trợ đối chiếu và soạn tài liệu |
| Claude | SV2 | Hỗ trợ thiết kế luồng, tổ chức code và xử lý các chức năng Speaker |
| Codex trong quá trình trao đổi với ChatGPT | Phần tích hợp và chuẩn bị hồ sơ do SV3 tổng hợp | Đọc và chỉnh sửa file, đối chiếu cấu trúc dự án, hỗ trợ kiểm thử và chuẩn bị commit tài liệu |

Nhóm sử dụng AI để chuẩn bị sản phẩm và luyện tập trước buổi bảo vệ. Phần thực hành Live Modification thực hiện theo quy chế của giảng viên: sinh viên tự chỉnh sửa và giải thích mã nguồn; không sử dụng AI để viết hộ trong thời gian thi.

## 3. Phân biệt AI hỗ trợ phát triển và tính năng AI trong sản phẩm

| Nội dung | Cách triển khai |
| --- | --- |
| AI hỗ trợ phát triển | Công cụ AI hỗ trợ phân tích, sinh, sửa và giải thích mã nguồn, tài liệu |
| Gợi ý lịch cá nhân | JavaScript mô phỏng đề xuất dựa trên dữ liệu phiên, sở thích và agenda |
| Phát hiện và xử lý xung đột | Kiểm tra phòng và khoảng thời gian; gợi ý phương án để người dùng xác nhận |
| Dự báo mức quan tâm | Ước tính mô phỏng từ dữ liệu đăng ký và lượt lưu, kèm giải thích |
| Lưu trữ dữ liệu | JSON khởi tạo và LocalStorage; các vai trò dùng chung dữ liệu trên cùng origin và trình duyệt |

Các tính năng AI trong phiên bản này là cơ chế mô phỏng phục vụ bài tập frontend, không phải kết nối đến LLM API. Xác thực, tải tệp và email cũng sử dụng cơ chế demo của dự án.

## 4. Hồ sơ sử dụng AI của từng thành viên

### 4.1. SV1 — Trần Đức Tuyên

**Mã sinh viên:** 2551170973.

**Phần phụ trách:** Người tham dự.

**Ba màn hình thuyết trình:**

- A1 — Danh mục phiên.
- A3 — Lịch cá nhân.
- A5 — Gợi ý phiên.

**Video:** [Danh sách phát SV1](https://youtube.com/playlist?list=PLNjSq0kZHBoQ).

**GitHub:** [CristianoMessi710](https://github.com/CristianoMessi710).

**Nhánh chức năng:** `feature/attendee`.

**Quản lý công việc:** [Bảng Trello EventPulse](https://trello.com/b/IUQmQXEP/eventpulse-screen-inventory).

**Công cụ AI:** ChatGPT.

**Phần AI hỗ trợ:**

- Sinh và chỉnh sửa HTML, CSS, JavaScript cho A1, gồm thẻ phiên, thanh lọc và xử lý tìm kiếm.
- Hỗ trợ A3, gồm timeline và tương tác với lịch cá nhân.
- Hỗ trợ luồng AI-1 Agenda Recommender ở A5, gồm giải thích, độ tin cậy, làm mới, thêm vào agenda và các trạng thái loading, empty, error, success.
- Hỗ trợ i18n nội dung động của Attendee, shared navigation có active state theo `data-nav-key` và bố cục toast.

**Nội dung trình bày:** danh mục phiên, quản lý agenda và gợi ý phiên được thể hiện trong ba video của thành viên.

### 4.2. SV2 — Phan Anh Vũ

**Mã sinh viên:** 2551170975.

**Phần phụ trách:** Diễn giả.

**Ba màn hình thuyết trình:**

- SP2 — Phiên của tôi.
- SP4 — Tài liệu phiên.
- SP1 — Hồ sơ diễn giả.

**Video:** [Danh sách phát SV2](https://www.youtube.com/watch?v=Qt8kaEVm8Zc&list=PLNf-YAqt-PeY).

**GitHub:** [caubetinhnghich](https://github.com/caubetinhnghich).

**Nhánh chức năng trong bản tích hợp:** `feature/speaker`; bản bàn giao dùng `main`.

**Quản lý công việc:** [Bảng Trello EventPulse](https://trello.com/b/IUQmQXEP/eventpulse-screen-inventory).

**Công cụ AI:** ChatGPT và Claude.

**Phần AI hỗ trợ:**

- Phân tích luồng các màn Speaker, khởi tạo dữ liệu, đọc/ghi LocalStorage và cập nhật giao diện theo thao tác người dùng.
- Hỗ trợ HTML, CSS, JavaScript cho form hồ sơ, quản lý phiên và tài liệu phiên.
- Hỗ trợ validation, xử lý sự kiện, dữ liệu, trạng thái và responsive.
- Gợi ý tách hàm và tổ chức code để dễ theo dõi và bảo trì.

**Phần tự thực hiện và kiểm tra theo thông tin thành viên cung cấp:**

Đối chiếu hướng dẫn demo với HTML và JavaScript của các màn hình, sau đó điều chỉnh lời thoại và thao tác cho khớp hành vi thực tế. Nội dung đã đối chiếu gồm cách tìm kiếm lọc khi nhập, nút mở form đề xuất phiên tại Empty State và kiểm tra định dạng tệp tại trang tài liệu.

### 4.3. SV3 — Nguyễn Hữu Tú

**Mã sinh viên:** 2551170969.

**Phần phụ trách:** Ban tổ chức và Quản trị viên.

**Ba màn hình thuyết trình:**

- **O3 — Chi tiết và phân công phiên:** thông tin phiên, phân công phòng và thời gian, validation và lưu thay đổi.
- **O5 — Phát hiện và xử lý xung đột:** kiểm tra trùng phòng hoặc giờ, hiển thị phương án và xác nhận áp dụng.
- **AD4 — Quản lý check-in:** tra cứu vé, kiểm tra trạng thái, xác nhận check-in và lịch sử check-in.

**Video:** [Danh sách phát SV3](https://www.youtube.com/watch?v=M0-wLN6guSM&list=PLROvsl37oK8E).

**GitHub dự án:** [CSE122 Nhóm 16](https://github.com/CristianoMessi710/CSE122_67KTPM1_BTCK_Nhom16).

**Nhánh chức năng:** `feature/organizer-admin`.

**Bản tích hợp:** `main`.

**PR tài liệu:**

- [PR #3 — Cập nhật Inventory và báo cáo sử dụng AI](https://github.com/CristianoMessi710/CSE122_67KTPM1_BTCK_Nhom16/pull/3).
- [PR #4 — Cập nhật README nộp bài và hồ sơ SV3](https://github.com/CristianoMessi710/CSE122_67KTPM1_BTCK_Nhom16/pull/4).

**Quản lý công việc:** [Bảng Trello EventPulse](https://trello.com/b/IUQmQXEP/eventpulse-screen-inventory).

**Công cụ AI:** ChatGPT, với hỗ trợ chỉnh sửa file và chuẩn bị tài liệu bằng Codex trong quá trình trao đổi.

**Phần AI hỗ trợ:**

- Hỗ trợ sinh và chỉnh sửa HTML, CSS, JavaScript cho các màn Organizer và Admin, responsive và các trạng thái loading, empty, error, success.
- Hỗ trợ luồng phân công phòng, kiểm tra xung đột lịch và đề xuất phòng thay thế; tra cứu, kiểm tra và xác nhận check-in.
- Hỗ trợ tích hợp mã nguồn của ba sinh viên, chuẩn hóa giao diện, navigation, dữ liệu và LocalStorage.
- Hỗ trợ chỉnh giao diện, ngôn ngữ, toast và giải thích các điều kiện ngày giờ của dữ liệu demo.
- Hỗ trợ soạn kịch bản video O3, O5, AD4; Inventory; báo cáo sử dụng AI; README và tài liệu ôn vấn đáp.

**Phần tự thực hiện và kiểm tra:**

Trực tiếp thao tác demo và quay video ba màn O3, O5, AD4; thực hiện các bước Git để đẩy nhánh, cập nhật mã nguồn và hợp nhất tài liệu. Đọc, đối chiếu các đoạn xử lý trong `organizer.js` và `operations.js`; thực hành chỉnh sửa bộ lọc, validation biểu mẫu và render dữ liệu để chuẩn bị vấn đáp.

## 5. Các đợt AI hỗ trợ phần tích hợp

| Nội dung | Công việc AI hỗ trợ | Tài liệu và mã nguồn liên quan |
| --- | --- | --- |
| Tích hợp ba phần | Tổ chức file, chuẩn hóa đường dẫn, ownership và dữ liệu chung | [Báo cáo tích hợp](../INTEGRATION-REPORT.md), `js/routes.js`, `js/storage.js` |
| Trang chủ | Giao diện, animation, i18n và các tương tác | [Báo cáo trang chủ](../HOME-REDESIGN-REPORT.md), `js/modules/home.js` |
| Component và responsive | Typography, icon, tìm kiếm, bộ lọc, modal và toast | `css/components.css`, `css/responsive.css`, `js/ui.js` |
| Điều hướng | Menu theo role và truy cập màn Check-in | `js/ui.js`, `js/bridge.js`, `js/routes.js` |
| Ngôn ngữ | Catalog dịch, nội dung động, locale và lựa chọn ngôn ngữ | `js/i18n.js`, `js/messages.js` |
| Hồ sơ bàn giao | Inventory, báo cáo sử dụng AI, README và kịch bản video | [Inventory](screen-inventory.md), [README](../README.md) |

## 6. Đối chiếu và điều chỉnh kết quả AI

Kết quả AI được dùng làm đầu vào để đối chiếu với yêu cầu, mã nguồn và thao tác demo. Một ví dụ cụ thể từ SV2 là điều chỉnh kịch bản thuyết trình cho đúng với cách tìm kiếm hoạt động khi nhập, CTA mở form đề xuất phiên tại Empty State và quy tắc kiểm tra định dạng tệp của trang tài liệu.

Trong phần tích hợp, nội dung ngôn ngữ được chuẩn hóa qua catalog dịch và các module dựng giao diện động. Điều hướng Admin được đối chiếu với danh sách màn hình, sử dụng mục Tổng quan và phân tích cùng đường truy cập Check-in. Các điều kiện phân công phòng và check-in được giải thích dựa trên dữ liệu phiên, phòng, trạng thái vé và ngày sự kiện.

Các kết quả kiểm thử do công cụ hỗ trợ được lưu trong [TEST-REPORT.md](../TEST-REPORT.md), [FILTER-I18N-FIX.md](FILTER-I18N-FIX.md) và [QA i18n](qa/i18n/screens.json). Video của từng thành viên là tài liệu trình bày thao tác và chức năng; log tự động được ghi nhận riêng theo báo cáo kiểm thử.

## 7. Tài liệu và minh chứng

- [Repository của nhóm](https://github.com/CristianoMessi710/CSE122_67KTPM1_BTCK_Nhom16).
- [README bàn giao](../README.md).
- [Screen Inventory](screen-inventory.md).
- [Bảng quản lý công việc](https://trello.com/b/IUQmQXEP/eventpulse-screen-inventory).
- [Video SV1](https://youtube.com/playlist?list=PLNjSq0kZHBoQ).
- [Video SV2](https://www.youtube.com/watch?v=Qt8kaEVm8Zc&list=PLNf-YAqt-PeY).
- [Video SV3](https://www.youtube.com/watch?v=M0-wLN6guSM&list=PLROvsl37oK8E).

Báo cáo sử dụng thông tin thực tế đã được cung cấp, phân biệt hỗ trợ của AI với phần thao tác và đối chiếu của thành viên. Các phần mã có AI hỗ trợ được trình bày đúng phạm vi; không quy toàn bộ mã sinh bởi AI thành mã tự viết của một cá nhân.
