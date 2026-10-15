# EventPulse — Phần Ban tổ chức và Quản trị viên — SV3

Bài tập cuối kỳ **CSE122 · Lớp 67KTPM1 · Nhóm 16**. EventPulse là giao diện hệ thống quản lý sự kiện, viết bằng HTML, CSS và JavaScript thuần với ES modules.

**Nhánh:** `feature/organizer-admin` · **Giai đoạn:** bản cuối đã tích hợp.

Ghi nhận phạm vi Organizer và Admin do SV3 phụ trách. Nguồn tích hợp lấy từ bản chạy trong dist/ của SV3; cấu trúc repository cuối đã chuẩn hóa nên không cần thư mục dist/ để chạy.

> Mỗi nhánh chứa toàn bộ mã nguồn để chạy ứng dụng. Phạm vi dưới đây thể hiện phân công chức năng, không có nghĩa nhánh chỉ chứa file của một sinh viên. README này mô tả bản bàn giao, không thay thế lịch sử commit hoặc xác nhận tác giả của mọi thay đổi.

## Chạy dự án

1. Clone repository, mở thư mục bằng VS Code.
2. Cài extension **Live Server**.
3. Nhấp phải `index.html` → **Open with Live Server**.
4. Chọn **Trải nghiệm bản demo**, sau đó chọn vai trò muốn xem. Có thể đổi vai trò từ header.

```bash
git clone https://github.com/CristianoMessi710/CSE122_67KTPM1_BTCK_Nhom16.git
cd CSE122_67KTPM1_BTCK_Nhom16
git switch feature/organizer-admin
```

Cách khác, nếu máy có Python:

```bash
python -m http.server 5500
```

Mở http://localhost:5500. Trên máy dùng lệnh `python3`, thay `python` bằng `python3`. Không mở trực tiếp bằng `file://` vì ứng dụng dùng ES modules và tải JSON. Không cần cài npm hoặc chạy build.

## Phạm vi chức năng

- Organizer: Dashboard, duyệt và phân công phiên, kiểm tra xung đột phòng/giờ.
- Quản lý phòng: thêm/sửa/lưu trữ, kiểm tra sức chứa và tên trùng.
- Tạo/chỉnh sửa cảnh báo, gửi ngay hoặc lên lịch theo luồng demo.
- Admin: quản lý loại vé, người dùng và vai trò; xác nhận các thao tác liên quan.
- Tra cứu vé/check-in giả lập, cập nhật trạng thái; xem KPI và biểu đồ từ dữ liệu.

## Màn hình trong phạm vi

| ID | Màn hình | File |
| --- | --- | --- |
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

## Phân công trong bản tích hợp

| Thành viên | Phần chính | Thư mục màn hình |
| --- | --- | --- |
| SV1 | Người tham dự (Attendee) | `pages/attendee/` |
| SV2 | Diễn giả (Speaker) | `pages/speaker/` |
| SV3 | Ban tổ chức và Quản trị viên | `pages/organizer/`, `pages/admin/` |

Các màn Shared được tổng hợp từ các nguồn và chuẩn hóa dùng chung. Quyết định về nguồn từng màn, đổi tên và phần bổ sung nằm trong [INTEGRATION-REPORT.md](INTEGRATION-REPORT.md). Nhãn SV1/SV2/SV3 thể hiện phân công; chưa gán tên hoặc mã sinh viên khi chưa có thông tin xác nhận.

## Mã nguồn liên quan

- [js/modules/organizer.js](js/modules/organizer.js)
- [js/modules/admin.js](js/modules/admin.js)

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
