# INTEGRATION REPORT — EventPulse CSE122

Ngày kiểm tra: 06/10/2026. Đầu ra là dự án HTML/CSS/JavaScript thuần, gồm đúng **32 màn hình**, 4 vai trò và 9 màn dùng chung. Thực hiện trên bản sao trong EventPulse-Merged; không sửa ba bộ code đầu vào.

## Tài liệu và cách giải quyết mâu thuẫn

Đã đối chiếu BTL-32, Screen Inventory Revised, User Flow, Design System, hai PDF mockup Desktop/Mobile, PROJECT_RULES và DATA_SCHEMA theo thứ tự ưu tiên yêu cầu. Checklist đầy đủ ở `docs/SCREEN-CHECKLIST.md`; dữ liệu inventory gốc đã trích xuất nằm trong `docs/screen-inventory-source.json`.

- Attendee lấy SV1, gồm cả A4/A5 theo chỉ dẫn tích hợp mới nhất, dù phân công ban đầu trong inventory ghi SV2. Không lấy ba trang Attendee của SV2 làm bản chính.
- Speaker lấy SV2. `session-edit.html` được tích hợp vào SP3, không thêm màn độc lập ngoài inventory.
- Organizer/Admin lấy mã đang chạy trong **dist/** của SV3, giữ các hàm render, xử lý CRUD và validation, không thay bằng HTML tĩnh.
- Shared: S1/S7/S8/S9 lấy cấu trúc và luồng SV3; S2/S3/S4/S5 giữ logic SV1; S6 giữ form và xử lý SV2 rồi kết nối tài khoản chung.
- SP6 còn thiếu được bổ sung bằng dữ liệu feedback chung. Không bỏ màn chưa có mockup. Bản desktop PDF có hai trang tài liệu tương tự nhau; các màn không có bản vẽ riêng được suy từ các component cùng role và Design System.
- Không có màn Dashboard riêng cho Speaker hay Admin: menu Tổng quan trỏ SP1/AD3; Diễn giả trong Attendee là danh sách đọc tại A1; Sự kiện trỏ landing. Không tạo screen hoặc nghiệp vụ mới cho các nhãn menu.
- Trạng thái duyệt `approved` được chuẩn hóa thành `sessions.status = published` để Attendee đọc được. `reviewStatus` lưu trạng thái duyệt. Trạng thái `rejected`, lý do và lịch sử duyệt được giữ theo User Flow có ưu tiên cao hơn ví dụ enum trong DATA_SCHEMA.
- Demo vai trò là hộp thoại dùng chung, thay cho một trang role-demo trùng chức năng. Login/Register vẫn tồn tại; không bắt buộc đăng nhập để xem landing và chọn demo.

## Nguồn từng màn và đổi tên

| ID  | Nguồn chính | File đầu vào                                                                              | File chính thức                                     |
| --- | ----------- | ----------------------------------------------------------------------------------------- | --------------------------------------------------- |
| S1  | SV3         | `sv3/EventPulse-SV3-Tach-HTML-CSS/dist/index.html`                                        | `index.html`                                        |
| S2  | SV1         | `sv1/EventPulse-SV1/login.html`                                                           | `login.html`                                        |
| S3  | SV1         | `sv1/EventPulse-SV1/register.html`                                                        | `register.html`                                     |
| S4  | SV1         | `sv1/EventPulse-SV1/forgot-password.html`                                                 | `forgot-password.html`                              |
| S5  | SV1         | `sv1/EventPulse-SV1/profile.html`                                                         | `profile.html`                                      |
| S6  | SV2         | `sv2/EventPulse/pages/common/settings.html`                                               | `settings.html`                                     |
| S7  | SV3         | `sv3/EventPulse-SV3-Tach-HTML-CSS/dist/notifications.html`                                | `notifications.html`                                |
| S8  | SV3         | `sv3/EventPulse-SV3-Tach-HTML-CSS/dist/403.html`                                          | `403.html`                                          |
| S9  | SV3         | `sv3/EventPulse-SV3-Tach-HTML-CSS/dist/404.html`                                          | `404.html`                                          |
| A1  | SV1         | `sv1/EventPulse-SV1/pages/attendee/attendee-session-catalog.html`                         | `pages/attendee/attendee-session-catalog.html`      |
| A2  | SV1         | `sv1/EventPulse-SV1/pages/attendee/attendee-session-detail.html`                          | `pages/attendee/attendee-session-detail.html`       |
| A3  | SV1         | `sv1/EventPulse-SV1/pages/attendee/attendee-my-agenda.html`                               | `pages/attendee/attendee-my-agenda.html`            |
| A4  | SV1         | `sv1/EventPulse-SV1/pages/attendee/attendee-schedule-conflict.html`                       | `pages/attendee/attendee-schedule-conflict.html`    |
| A5  | SV1         | `sv1/EventPulse-SV1/pages/attendee/attendee-recommendations.html`                         | `pages/attendee/attendee-recommendations.html`      |
| A6  | SV1         | `sv1/EventPulse-SV1/pages/attendee/attendee-session-feedback.html`                        | `pages/attendee/attendee-session-feedback.html`     |
| A7  | SV1         | `sv1/EventPulse-SV1/pages/attendee/attendee-my-ticket.html`                               | `pages/attendee/attendee-my-ticket.html`            |
| SP1 | SV2         | `sv2/EventPulse/pages/speaker/profile.html`                                               | `pages/speaker/speaker-profile.html`                |
| SP2 | SV2         | `sv2/EventPulse/pages/speaker/my-sessions.html`                                           | `pages/speaker/speaker-my-session.html`             |
| SP3 | SV2         | `sv2/EventPulse/pages/speaker/speaker-session-detail.html`                                | `pages/speaker/speaker-session-detail.html`         |
| SP4 | SV2         | `sv2/EventPulse/pages/speaker/materials.html`                                             | `pages/speaker/speaker-session-materials.html`      |
| SP5 | SV2         | `sv2/EventPulse/pages/speaker/interest-forecast.html`                                     | `pages/speaker/speaker-interest-forecast.html`      |
| SP6 | SV2         | `new: SP6 from SV2 feedback panel`                                                        | `pages/speaker/speaker-feedback-overview.html`      |
| O1  | SV3         | `sv3/EventPulse-SV3-Tach-HTML-CSS/dist/pages/organizer/organizer-dashboard.html`          | `pages/organizer/organizer-dashboard.html`          |
| O2  | SV3         | `sv3/EventPulse-SV3-Tach-HTML-CSS/dist/pages/organizer/organizer-session-management.html` | `pages/organizer/organizer-session-management.html` |
| O3  | SV3         | `sv3/EventPulse-SV3-Tach-HTML-CSS/dist/pages/organizer/organizer-session-detail.html`     | `pages/organizer/organizer-session-detail.html`     |
| O4  | SV3         | `sv3/EventPulse-SV3-Tach-HTML-CSS/dist/pages/organizer/organizer-room-management.html`    | `pages/organizer/organizer-room-management.html`    |
| O5  | SV3         | `sv3/EventPulse-SV3-Tach-HTML-CSS/dist/pages/organizer/organizer-conflict-detection.html` | `pages/organizer/organizer-conflict-detection.html` |
| O6  | SV3         | `sv3/EventPulse-SV3-Tach-HTML-CSS/dist/pages/organizer/organizer-event-alerts.html`       | `pages/organizer/organizer-event-alerts.html`       |
| AD1 | SV3         | `sv3/EventPulse-SV3-Tach-HTML-CSS/dist/pages/admin/admin-ticket-type-management.html`     | `pages/admin/admin-ticket-type-management.html`     |
| AD2 | SV3         | `sv3/EventPulse-SV3-Tach-HTML-CSS/dist/pages/admin/admin-user-management.html`            | `pages/admin/admin-user-management.html`            |
| AD3 | SV3         | `sv3/EventPulse-SV3-Tach-HTML-CSS/dist/pages/admin/admin-event-analytics.html`            | `pages/admin/admin-event-analytics.html`            |
| AD4 | SV3         | `sv3/EventPulse-SV3-Tach-HTML-CSS/dist/pages/admin/admin-checkin-management.html`         | `pages/admin/admin-checkin-management.html`         |

## Duplicate đã loại và màn được bổ sung

- Không đưa `my-agenda.html`, `recommendations.html`, `schedule-conflict.html` của SV2 vào bản chính; giữ A3/A4/A5 từ SV1.
- Không giữ bản `pages/shared/` hoặc `pages/common/` song song với các màn root.
- Speaker: profile → speaker-profile; my-sessions → speaker-my-session; session-edit → speaker-session-detail; materials → speaker-session-materials; interest-forecast → speaker-interest-forecast. Href và JS điều hướng đã chuyển sang tên chính thức.
- Tạo SP6 `speaker-feedback-overview.html`: danh sách phản hồi của phiên thuộc diễn giả, lọc/sắp xếp, điểm trung bình và phân bố đánh giá.
- Tạo lớp tích hợp chung; chỉ một nơi định nghĩa routes, header, bottom navigation, toast và storage. Chi tiết CSS/JS từng màn nằm trong `docs/code-inventory.json`.

## CSS và JavaScript đã tích hợp

| Nhóm file                                      | Vai trò                                                                       |
| ---------------------------------------------- | ----------------------------------------------------------------------------- |
| css/tokens.css                                 | Palette, font và biến Design System chung                                     |
| css/style.css                                  | Một bản CSS nền lấy từ dist SV3, bỏ các bản per-screen trùng nội dung         |
| css/components.css                             | Button, card, badge, form, header, modal, toast, trạng thái, AI component     |
| css/responsive.css                             | Quy tắc desktop/tablet/mobile, bảng chuyển card, bottom-nav và reduced motion |
| css/attendee.css                               | Layout và chi tiết riêng kế thừa SV1                                          |
| css/speaker-*.css                              | Layout các màn Speaker/Settings kế thừa SV2; bỏ root/theme riêng              |
| js/main.js                                     | Khởi động, guard, chọn module, xử lý cảnh báo đến hạn                         |
| js/storage.js + api.js                         | Canonical keys, migration, seed JSON khi thiếu, ưu tiên dữ liệu đã lưu        |
| js/routes.js + ui.js                           | 32 tuyến chính thức và component dùng chung                                   |
| js/bridge.js                                   | Adapter EP/EventPulse để giữ hàm nghiệp vụ SV1/SV2 và dùng storage/UI chung   |
| js/operations.js + domain.js                   | Runtime SV3, validation phân công, xung đột, người nhận cảnh báo, dự báo      |
| js/modules/attendee.js + account.js            | Luồng Attendee và tài khoản SV1                                               |
| js/modules/speaker-*.js + interest-forecast.js | CRUD/AI Speaker SV2, bổ sung đọc phản hồi                                     |
| js/modules/organizer.js + admin.js + shared.js | Giữ/refactor luồng Organizer/Admin/Shared SV3                                 |
| js/enhance.js + i18n.js                        | Animation, trợ năng, bảng mobile, dictionary dịch SV2                         |

Đã thống nhất màu Primary #4F46FF; font Inter, Arial, sans-serif; container tối đa 1280px; padding mobile 16px. Header cùng visual, chỉ khác menu theo vai trò. Mobile dùng bottom navigation 4 mục; toast desktop góc phải trên, mobile phía trên bottom-nav. Icon thao tác chung là SVG. Animation stagger, hover/active, dialog và view transition đều có reduced-motion override.

## Dữ liệu và LocalStorage

Entity chung: users, events, sessions, rooms, agendas, feedback, ticketTypes, userTickets, notifications, eventAlerts, materials. Settings và currentUser là hai đối tượng riêng theo schema. Tổng cộng **13 key chuẩn**; sessionStorage chỉ giữ trạng thái tạm và thông tin mock của phiên trình duyệt.

Dữ liệu gốc được hợp nhất, không duy trì kho riêng theo role. ID trùng giữa SV1 và SV3 đã remap theo `docs/id-mapping.json`. Session tham chiếu speakerIds/roomId; agenda chỉ tham chiếu sessionId. Bổ sung một sự kiện đã kết thúc với vé checkedIn và agenda hoàn thành để demo feedback đúng điều kiện. Các phiên pending/rejected của SV2 vẫn còn để giảng viên kiểm tra duyệt và gửi lại.

| Key/cách lưu cũ                                                  | Đích chuẩn                                                       |
| ---------------------------------------------------------------- | ---------------------------------------------------------------- |
| eventpulse_tickets                                               | eventpulse_userTickets                                           |
| eventpulse_session_materials                                     | eventpulse_materials; chuẩn hóa uploadedBy/type/fileUrl/fileSize |
| eventpulse_speaker_profile                                       | Bản ghi speaker trong eventpulse_users                           |
| eventpulse-theme/language/autosave/reminder/name                 | eventpulse_settings                                              |
| eventpulse_agendaOrder                                           | eventpulse_settings.agendaOrder                                  |
| eventpulse_forecast_note_<id>, eventpulse_forecast_decision_<id> | sessions.forecastNote / forecastDecision                         |
| eventpulse_aiConflict                                            | Bỏ cache suy diễn cũ, tính xung đột từ sessions/agendas          |

Không seed đè dữ liệu đã sửa khi reload. Commit có rollback khi ghi không thành công. Không tự xóa JSON hỏng hoặc reset toàn bộ dữ liệu. Migration chỉ xử lý các key thực tế đã nhận diện trong ba nguồn; đây không phải công cụ nhập dữ liệu tùy ý từ mọi prototype bên ngoài.

## Kết nối nghiệp vụ

- Speaker đề xuất pending → Organizer nhận cùng session → duyệt/phân công → status published → Attendee thấy và lưu agenda.
- Pending chỉ đọc; published khóa phòng/giờ của Speaker, cho cập nhật nội dung; rejected có thể chỉnh và gửi lại.
- Gán phòng kiểm tra thời gian, sự kiện của phòng, sức chứa, đăng ký và xung đột. AI chỉ áp dụng sau xác nhận.
- Attendee lưu lịch kiểm tra trùng giờ; AI gợi ý có loading, giải thích, chọn/bỏ chọn, tạo lại, xác nhận và lưu.
- Feedback kiểm tra phiên đã kết thúc và điều kiện tham dự; Speaker đọc đúng feedback của phiên mình sở hữu.
- Material tạo/sửa/xóa được dùng lại ở Session Detail Attendee. Upload giữ metadata/file mock theo phạm vi môn học.
- Event Alert tạo notification cho nhóm người nhận; cảnh báo hẹn giờ được xử lý khi ứng dụng đang mở hoặc mở lại.
- Admin check-in cập nhật userTickets; Attendee thấy trạng thái tương ứng. Admin user/ticket dùng chung các entity. Analytics tính từ dữ liệu hiện tại, không dùng ảnh tĩnh.

## Giới hạn được công khai

- Frontend mock: không có backend, gửi email thật, thanh toán, QR scanner thật hoặc mô hình AI thật. Upload file mô phỏng lưu metadata; liên kết http/https mở tài nguyên thật do người dùng nhập.
- LocalStorage cùng origin/trình duyệt. Thiết bị khác hoặc port khác không tự đồng bộ. Các màn đọc dữ liệu mới khi tải lại/điều hướng; đây không phải hệ thống cộng tác thời gian thực có xử lý xung đột ghi đồng thời.
- Xác thực demo không phải cơ chế bảo mật production. Mật khẩu tài khoản mock tự tạo được hash trong sessionStorage; phiên trình duyệt mới dùng Demo@123 theo mô tả ở Login.
- Tiếng Việt là giao diện chính. Lựa chọn English giữ dictionary các chuỗi đã được đánh dấu từ SV2; chưa phải bản dịch đầy đủ 32 màn. Tên nội dung chuyên môn của session có thể là tiếng Anh.
- Inter không tải từ CDN; máy không có Inter sử dụng Arial/sans-serif đúng fallback. Chế độ tối tùy chọn của Settings áp dụng chung, dùng lại màu đã có; không tạo theme riêng cho Speaker.
- Kiểm thử bằng Chromium với viewport mô phỏng, không khẳng định đã kiểm tra phần cứng iPad/iPhone hoặc mọi trình duyệt. Các công việc ngoài frontend như quay OBS/nộp LMS không nằm trong ZIP này.
