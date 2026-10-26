# EventPulse — Bài tập cuối kỳ

**CSE122 · Lớp 67KTPM1 · Nhóm 16**

EventPulse là giao diện hệ thống quản lý sự kiện, được xây dựng bằng **HTML, CSS và JavaScript thuần**, sử dụng ES modules. Dự án tích hợp bốn vai trò: **Người tham dự, Diễn giả, Ban tổ chức và Quản trị viên**, cùng các màn hình dùng chung.

**Nhánh bàn giao:** `main`.

## Thành viên và phân công

| Thành viên | Họ và tên | Mã sinh viên | Phần chính | Nhánh chức năng |
| --- | --- | --- | --- | --- |
| SV1 | Trần Đức Tuyên | 2551170973 | Người tham dự | `feature/attendee` |
| SV2 | Phan Anh Vũ | 2551170975 | Diễn giả | `feature/speaker` |
| SV3 | Nguyễn Hữu Tú | 2551170969 | Ban tổ chức và Quản trị viên | `feature/organizer-admin` |

Mỗi nhánh chứa mã nguồn ứng dụng để chạy và kiểm tra các luồng liên quan. Các màn dùng chung, giao diện, điều hướng và dữ liệu được tích hợp trong cùng một dự án.

## Chạy dự án

```bash
git clone https://github.com/CristianoMessi710/CSE122_67KTPM1_BTCK_Nhom16.git
cd CSE122_67KTPM1_BTCK_Nhom16
git switch main
```

Mở thư mục bằng VS Code, nhấp phải `index.html` và chọn **Open with Live Server**. Tại trang chủ, chọn **Trải nghiệm bản demo** rồi chọn vai trò.

Có thể chạy bằng HTTP server của Python:

```bash
python -m http.server 5500
```

Truy cập [http://localhost:5500](http://localhost:5500). Ứng dụng dùng HTTP server để tải ES modules và dữ liệu JSON; chạy trực tiếp từ mã nguồn, không cần bước build.

## Chức năng chính

- **Người tham dự:** danh mục và chi tiết phiên, lịch cá nhân, xử lý trùng lịch, gợi ý lịch, phản hồi và vé cá nhân.
- **Diễn giả:** hồ sơ, đề xuất và quản lý phiên, tài liệu, dự báo mức quan tâm và tổng quan phản hồi.
- **Ban tổ chức:** tổng quan sự kiện, quản lý và duyệt phiên, phân công phòng và thời gian, quản lý phòng, phát hiện xung đột và cảnh báo sự kiện.
- **Quản trị viên:** quản lý loại vé, người dùng, check-in và phân tích sự kiện.
- **Dùng chung:** trang chủ, tài khoản, hồ sơ, cài đặt, thông báo và các trang trạng thái truy cập.

Các vai trò sử dụng dữ liệu chung, liên kết qua các ID như `sessionId`, `speakerIds`, `roomId` và `userId`.

## Video thuyết trình

| Thành viên | Ba màn hình trình bày | Danh sách phát |
| --- | --- | --- |
| SV1 — Trần Đức Tuyên | A1 Danh mục phiên; A3 Lịch cá nhân; A5 Gợi ý phiên | [Video SV1](https://youtube.com/playlist?list=PLNjSq0kZHBoQ) |
| SV2 — Phan Anh Vũ | SP2 Phiên của tôi; SP4 Tài liệu phiên; SP1 Hồ sơ diễn giả | [Video SV2](https://www.youtube.com/watch?v=Qt8kaEVm8Zc&list=PLNf-YAqt-PeY) |
| SV3 — Nguyễn Hữu Tú | O3 Chi tiết và phân công phiên; O5 Phát hiện và xử lý xung đột; AD4 Quản lý check-in | [Video SV3](https://www.youtube.com/watch?v=M0-wLN6guSM&list=PLROvsl37oK8E) |

## Hồ sơ thực hiện của sinh viên 3

**Họ và tên:** Nguyễn Hữu Tú.

**Mã sinh viên:** 2551170969.

**Vai trò:** SV3 — Ban tổ chức và Quản trị viên.

### Màn hình thuyết trình

- **O3 — Chi tiết và phân công phiên:** trình bày thông tin phiên, phân công phòng và thời gian, kiểm tra hợp lệ và lưu thay đổi.
- **O5 — Phát hiện và xử lý xung đột:** trình bày phát hiện phiên trùng phòng hoặc giờ, phương án gợi ý và thao tác xác nhận áp dụng.
- **AD4 — Quản lý check-in:** trình bày tra cứu vé, kiểm tra trạng thái, xác nhận check-in và lịch sử check-in.

**Video:** [Danh sách phát thuyết trình SV3](https://www.youtube.com/watch?v=M0-wLN6guSM&list=PLROvsl37oK8E).

### Mã nguồn và quản lý công việc

- **Repository:** [CSE122 Nhóm 16](https://github.com/CristianoMessi710/CSE122_67KTPM1_BTCK_Nhom16).
- **Nhánh chức năng:** `feature/organizer-admin`.
- **Bản tích hợp:** `main`.
- **PR cập nhật Inventory và báo cáo sử dụng AI:** [Pull Request #3](https://github.com/CristianoMessi710/CSE122_67KTPM1_BTCK_Nhom16/pull/3).
- **Bảng quản lý công việc:** [EventPulse Screen Inventory trên Trello](https://trello.com/b/IUQmQXEP/eventpulse-screen-inventory).

### Sử dụng AI

**Công cụ:** ChatGPT.

**Phần AI hỗ trợ:**

- Hỗ trợ sinh và chỉnh sửa HTML, CSS, JavaScript cho các màn Organizer và Admin; giao diện responsive và các trạng thái loading, empty, error, success.
- Hỗ trợ luồng phân công phòng, kiểm tra xung đột và đề xuất phòng thay thế; tra cứu, kiểm tra vé và xác nhận check-in.
- Hỗ trợ tích hợp mã nguồn của ba thành viên, chuẩn hóa giao diện và LocalStorage, xử lý giao diện, ngôn ngữ và thông báo toast.
- Hỗ trợ soạn kịch bản video, hồ sơ Inventory, báo cáo sử dụng AI và tài liệu ôn vấn đáp.

**Phần tự thực hiện và kiểm tra:**

Trực tiếp thao tác demo và quay video ba màn O3, O5, AD4; thực hiện các bước Git để đẩy nhánh, cập nhật mã nguồn và hợp nhất tài liệu. Đọc, đối chiếu các đoạn xử lý trong `organizer.js` và `operations.js`; thực hành chỉnh sửa bộ lọc, validation biểu mẫu và render dữ liệu để chuẩn bị vấn đáp.

## Màn hình trong dự án

| ID | Màn hình | File |
| --- | --- | --- |
| S1 | Trang chủ | [index.html](index.html) |
| S2 | Đăng nhập | [login.html](login.html) |
| S3 | Đăng ký | [register.html](register.html) |
| S4 | Quên mật khẩu | [forgot-password.html](forgot-password.html) |
| S5 | Hồ sơ cá nhân | [profile.html](profile.html) |
| S6 | Cài đặt | [settings.html](settings.html) |
| S7 | Thông báo | [notifications.html](notifications.html) |
| S8 | Không có quyền truy cập | [403.html](403.html) |
| S9 | Không tìm thấy trang | [404.html](404.html) |
| A1 | Danh sách phiên | [pages/attendee/attendee-session-catalog.html](pages/attendee/attendee-session-catalog.html) |
| A2 | Chi tiết phiên | [pages/attendee/attendee-session-detail.html](pages/attendee/attendee-session-detail.html) |
| A3 | Lịch cá nhân | [pages/attendee/attendee-my-agenda.html](pages/attendee/attendee-my-agenda.html) |
| A4 | Giải quyết trùng lịch | [pages/attendee/attendee-schedule-conflict.html](pages/attendee/attendee-schedule-conflict.html) |
| A5 | Gợi ý lịch bằng AI | [pages/attendee/attendee-recommendations.html](pages/attendee/attendee-recommendations.html) |
| A6 | Phản hồi phiên | [pages/attendee/attendee-session-feedback.html](pages/attendee/attendee-session-feedback.html) |
| A7 | Vé của tôi | [pages/attendee/attendee-my-ticket.html](pages/attendee/attendee-my-ticket.html) |
| SP1 | Hồ sơ diễn giả | [pages/speaker/speaker-profile.html](pages/speaker/speaker-profile.html) |
| SP2 | Phiên của tôi | [pages/speaker/speaker-my-session.html](pages/speaker/speaker-my-session.html) |
| SP3 | Chi tiết và chỉnh sửa phiên | [pages/speaker/speaker-session-detail.html](pages/speaker/speaker-session-detail.html) |
| SP4 | Tài liệu phiên | [pages/speaker/speaker-session-materials.html](pages/speaker/speaker-session-materials.html) |
| SP5 | Dự báo mức quan tâm | [pages/speaker/speaker-interest-forecast.html](pages/speaker/speaker-interest-forecast.html) |
| SP6 | Tổng quan phản hồi | [pages/speaker/speaker-feedback-overview.html](pages/speaker/speaker-feedback-overview.html) |
| O1 | Dashboard ban tổ chức | [pages/organizer/organizer-dashboard.html](pages/organizer/organizer-dashboard.html) |
| O2 | Quản lý phiên | [pages/organizer/organizer-session-management.html](pages/organizer/organizer-session-management.html) |
| O3 | Chi tiết và phân công phiên | [pages/organizer/organizer-session-detail.html](pages/organizer/organizer-session-detail.html) |
| O4 | Quản lý phòng | [pages/organizer/organizer-room-management.html](pages/organizer/organizer-room-management.html) |
| O5 | Phát hiện xung đột | [pages/organizer/organizer-conflict-detection.html](pages/organizer/organizer-conflict-detection.html) |
| O6 | Cảnh báo sự kiện | [pages/organizer/organizer-event-alerts.html](pages/organizer/organizer-event-alerts.html) |
| AD1 | Quản lý loại vé | [pages/admin/admin-ticket-type-management.html](pages/admin/admin-ticket-type-management.html) |
| AD2 | Quản lý người dùng | [pages/admin/admin-user-management.html](pages/admin/admin-user-management.html) |
| AD3 | Phân tích sự kiện | [pages/admin/admin-event-analytics.html](pages/admin/admin-event-analytics.html) |
| AD4 | Quản lý check-in | [pages/admin/admin-checkin-management.html](pages/admin/admin-checkin-management.html) |

## Cấu trúc mã nguồn

```text
index.html              Trang chủ và truy cập demo
pages/attendee/          Màn hình Người tham dự
pages/speaker/           Màn hình Diễn giả
pages/organizer/         Màn hình Ban tổ chức
pages/admin/             Màn hình Quản trị viên
css/                    Design token, component và responsive
js/                     Điều hướng, UI, dữ liệu và module chức năng
assets/data/            Dữ liệu JSON khởi tạo
assets/fonts/           Phông Inter lưu cục bộ và giấy phép
assets/images/          Hình ảnh minh họa
docs/                   Inventory và tài liệu dự án
```

Các màn đăng nhập, đăng ký, hồ sơ, cài đặt, thông báo và trang trạng thái nằm tại thư mục gốc. Danh sách đường dẫn được quản lý trong [js/routes.js](js/routes.js).

## Công nghệ và dữ liệu

- **Giao diện:** HTML, CSS, JavaScript thuần và ES modules.
- **Lưu trữ:** khởi tạo từ `assets/data/*.json`, đọc và ghi thay đổi bằng LocalStorage.
- **Thực thể dùng chung:** users, events, sessions, rooms, agendas, feedback, ticketTypes, userTickets, notifications, eventAlerts và materials.
- **Khóa dữ liệu:** tiền tố `eventpulse_`; tài khoản hiện tại dùng `eventpulse_currentUser`, cài đặt dùng `eventpulse_settings`.
- **Phạm vi chạy:** frontend demo trong trình duyệt; dữ liệu LocalStorage được dùng chung giữa các vai trò trên cùng origin và trình duyệt.
- **Gợi ý AI, tải tệp và email:** sử dụng cơ chế mô phỏng phục vụ bài tập, không yêu cầu API key dịch vụ AI hoặc backend xác thực thực tế.

## Tài liệu dự án

- [Hướng dẫn chạy và kịch bản demo](README-INTEGRATION.md).
- [Báo cáo tích hợp](INTEGRATION-REPORT.md).
- [Báo cáo kiểm thử](TEST-REPORT.md).
- [Screen Inventory và minh chứng](docs/screen-inventory.md).
- [Báo cáo sử dụng AI](docs/ai-usage-report.md).
- [Danh sách màn hình](docs/SCREEN-CHECKLIST.md).
- [Cây thư mục](docs/FOLDER-TREE.md).
