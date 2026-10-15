# EventPulse — Phần Diễn giả — SV2

Bài tập cuối kỳ **CSE122 · Lớp 67KTPM1 · Nhóm 16**. EventPulse là giao diện hệ thống quản lý sự kiện, viết bằng HTML, CSS và JavaScript thuần với ES modules.

**Nhánh:** `feature/speaker` · **Giai đoạn:** bản cuối đã tích hợp.

Ghi nhận phạm vi Speaker do SV2 phụ trách trong bản tích hợp cuối. Các trang Attendee của nguồn SV2 không được dùng làm bản chính; Attendee chính thức lấy từ SV1.

> Mỗi nhánh chứa toàn bộ mã nguồn để chạy ứng dụng. Phạm vi dưới đây thể hiện phân công chức năng, không có nghĩa nhánh chỉ chứa file của một sinh viên. README này mô tả bản bàn giao, không thay thế lịch sử commit hoặc xác nhận tác giả của mọi thay đổi.

## Chạy dự án

1. Clone repository, mở thư mục bằng VS Code.
2. Cài extension **Live Server**.
3. Nhấp phải `index.html` → **Open with Live Server**.
4. Chọn **Trải nghiệm bản demo**, sau đó chọn vai trò muốn xem. Có thể đổi vai trò từ header.

```bash
git clone https://github.com/CristianoMessi710/CSE122_67KTPM1_BTCK_Nhom16.git
cd CSE122_67KTPM1_BTCK_Nhom16
git switch feature/speaker
```

Cách khác, nếu máy có Python:

```bash
python -m http.server 5500
```

Mở http://localhost:5500. Trên máy dùng lệnh `python3`, thay `python` bằng `python3`. Không mở trực tiếp bằng `file://` vì ứng dụng dùng ES modules và tải JSON. Không cần cài npm hoặc chạy build.

## Phạm vi chức năng

- Xem/chỉnh sửa hồ sơ diễn giả và kiểm tra dữ liệu nhập.
- Xem các phiên, đề xuất phiên mới và theo dõi kết quả duyệt.
- Chỉnh sửa phiên trong màn chi tiết theo trạng thái cho phép.
- Thêm/sửa/xóa tài liệu, mô phỏng tải tệp và lưu liên kết.
- Dự báo mức quan tâm: loading, giải thích, độ tin cậy, thử lại và lưu ghi chú.
- Xem tổng quan phản hồi của phiên thuộc diễn giả. Màn SP6 được bổ sung trong quá trình tích hợp; xem báo cáo nguồn.

## Màn hình trong phạm vi

| ID | Màn hình | File |
| --- | --- | --- |
| SP1 | Hồ sơ diễn giả | [pages/speaker/speaker-profile.html](pages/speaker/speaker-profile.html) |
| SP2 | Phiên của tôi | [pages/speaker/speaker-my-session.html](pages/speaker/speaker-my-session.html) |
| SP3 | Chi tiết và chỉnh sửa phiên | [pages/speaker/speaker-session-detail.html](pages/speaker/speaker-session-detail.html) |
| SP4 | Tài liệu phiên | [pages/speaker/speaker-session-materials.html](pages/speaker/speaker-session-materials.html) |
| SP5 | Dự báo mức quan tâm | [pages/speaker/speaker-interest-forecast.html](pages/speaker/speaker-interest-forecast.html) |
| SP6 | Tổng quan phản hồi | [pages/speaker/speaker-feedback-overview.html](pages/speaker/speaker-feedback-overview.html) |

## Phân công trong bản tích hợp

| Thành viên | Phần chính | Thư mục màn hình |
| --- | --- | --- |
| SV1 | Người tham dự (Attendee) | `pages/attendee/` |
| SV2 | Diễn giả (Speaker) | `pages/speaker/` |
| SV3 | Ban tổ chức và Quản trị viên | `pages/organizer/`, `pages/admin/` |

Các màn Shared được tổng hợp từ các nguồn và chuẩn hóa dùng chung. Quyết định về nguồn từng màn, đổi tên và phần bổ sung nằm trong [INTEGRATION-REPORT.md](INTEGRATION-REPORT.md). Nhãn SV1/SV2/SV3 thể hiện phân công; chưa gán tên hoặc mã sinh viên khi chưa có thông tin xác nhận.

## Mã nguồn liên quan

- [js/modules/speaker-profile.js](js/modules/speaker-profile.js)
- [js/modules/speaker-my-sessions.js](js/modules/speaker-my-sessions.js)
- [js/modules/speaker-session-edit.js](js/modules/speaker-session-edit.js)
- [js/modules/speaker-materials.js](js/modules/speaker-materials.js)
- [js/modules/interest-forecast.js](js/modules/interest-forecast.js)
- [js/modules/speaker-feedback.js](js/modules/speaker-feedback.js)

Cấu trúc chung:

```text
index.html              Trang chủ và truy cập demo
pages/attendee/          Màn hình Người tham dự
pages/speaker/           Màn hình Diễn giả
pages/organizer/         Màn hình Ban tổ chức
pages/admin/             Màn hình Quản trị viên
css/                    Token, component, responsive và CSS theo màn
js/                     Router, UI, dữ liệu và module chức năng
assets/data/            Dữ liệu JSON ban đầu
assets/fonts/           Inter lưu cục bộ và giấy phép
assets/images/          Hình ảnh minh họa
docs/                   Checklist và bằng chứng kiểm thử
```

Các màn tài khoản, cài đặt, thông báo, 403 và 404 nằm tại root. Danh sách đường dẫn chính thức: [js/routes.js](js/routes.js).

## Dữ liệu và giới hạn demo

- Lần đầu tải dữ liệu từ `assets/data/*.json`; những lần sau ưu tiên dữ liệu đã chỉnh trong LocalStorage.
- Các entity dùng chung: users, events, sessions, rooms, agendas, feedback, ticketTypes, userTickets, notifications, eventAlerts và materials.
- Dữ liệu dùng tiền tố `eventpulse_`; tài khoản hiện tại là `eventpulse_currentUser`, cài đặt là `eventpulse_settings`.
- Đổi vai trò trên **cùng origin/port và cùng trình duyệt** để xem liên kết dữ liệu. LocalStorage không đồng bộ giữa các máy hoặc các trình duyệt.
- Đây là frontend demo, không có backend hay xác thực production. Chức năng AI, tải tệp và email theo cơ chế mô phỏng của dự án; không yêu cầu API key dịch vụ AI.
- Dữ liệu mẫu có ngày sự kiện cố định. Các điều kiện hết hạn hoặc tham dự phụ thuộc ngày của dữ liệu và thời gian thực tế.
- Muốn khôi phục dữ liệu mẫu: mở DevTools → Application → Local Storage, xóa các key `eventpulse_` rồi tải lại. Thao tác này xóa thay đổi demo đã lưu; hãy sao lưu nếu cần giữ.

## Kiểm tra nhanh bản bàn giao

1. Mở trang chủ, lần lượt chọn bốn vai trò demo.
2. Speaker đề xuất phiên → Organizer duyệt/phân công → Attendee xem phiên và lưu lịch.
3. Organizer gửi cảnh báo → đổi sang Attendee để kiểm tra thông báo theo đối tượng nhận.
4. Admin thử tra cứu/check-in bằng vé mẫu trong dữ liệu; kiểm tra trạng thái liên quan.
5. Tải lại trang để kiểm tra dữ liệu đã lưu.
6. Dùng DevTools kiểm tra viewport 1440, 1024, 768 và 390px; thử Sáng/Tối và VI/EN. Đây là hướng dẫn kiểm tra, không phải tuyên bố đã chạy lại toàn bộ test khi viết README.

## Tài liệu tham chiếu

- [Hướng dẫn chạy và kịch bản demo](README-INTEGRATION.md)
- [Báo cáo tích hợp và nguồn từng màn](INTEGRATION-REPORT.md)
- [Báo cáo kiểm thử đã ghi nhận](TEST-REPORT.md)
- [Checklist màn hình](docs/SCREEN-CHECKLIST.md)
- [Cây thư mục chi tiết](docs/FOLDER-TREE.md)
- [Báo cáo trang chủ](HOME-REDESIGN-REPORT.md)
- [Báo cáo sửa giao diện](UI-FIX-REPORT.md)

## Trạng thái nhánh và bàn giao

`main` là bản hoàn chỉnh để nộp. `dev` và các nhánh `feature/*` được giữ lại để thể hiện tổ chức dự án; không bắt buộc tạo thêm công việc sau khi chốt bài. Không xóa phần của người khác khỏi nhánh.

Nếu cần sửa sau bàn giao, tạo nhánh sửa từ bản phù hợp, kiểm tra ảnh hưởng liên vai trò rồi tạo Pull Request. Các file dùng chung như `css/tokens.css`, `css/components.css`, `js/ui.js`, `js/storage.js` và dữ liệu JSON cần được phối hợp trước khi chỉnh.
