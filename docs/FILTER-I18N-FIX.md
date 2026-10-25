# Sửa bộ lọc và ngôn ngữ — 24/10/2026

## Nội dung thay đổi

- AD3: căn đáy hàng Từ ngày / Đến ngày / Chủ đề / Phòng / Xóa bộ lọc. Các control cao 44px; select phủ hết wrapper để mũi tên ở bên trong ô. Mobile xếp mỗi control một hàng.
- `js/messages.js`: 1.001 mục dịch dùng chung cho nội dung, biểu mẫu, trạng thái, thông báo, tên trang và các bản tiếng Anh có sẵn của dữ liệu demo.
- `js/i18n.js`: tích hợp mục dịch của màn hình cũ với hệ thống `data-i18n` hiện có; lưu văn bản gốc bằng WeakMap để đổi hai chiều; theo dõi nội dung mới do JavaScript dựng (dialog, validation, toast, tải bất đồng bộ). Hỗ trợ câu có số liệu bằng mẫu khớp cả câu, không thay từ tùy tiện trong chuỗi.
- Dịch placeholder, aria-label, title và data-label của bảng trên mobile. Giữ value của option để việc dịch nhãn không thay giá trị nghiệp vụ. Không sửa input.value, textarea, nội dung đang soạn trong contenteditable, URL, ID hay dữ liệu LocalStorage.
- `js/main.js`: bật theo dõi dịch sau khi module trang đã khởi tạo.
- `js/bridge.js`: thống nhất ngôn ngữ toàn ứng dụng trong settings, tránh cài đặt cũ của từng tài khoản ghi đè ngôn ngữ vừa chọn.
- Các module attendee, speaker-my-sessions, speaker-session-edit, speaker-materials, speaker-feedback, interest-forecast dùng locale hiện hành cho ngày giờ; speaker-profile dịch thông báo native alert; admin dịch tiêu đề cột CSV.
- Giữ các sửa đổi trước đó về menu admin (có Check-in), icon và giao diện đăng nhập/đăng ký. Không thêm framework, thư viện runtime hoặc backend.

## Cách kiểm tra

1. Mở thư mục bằng VS Code và chạy `index.html` bằng Live Server. Không mở bằng file:// vì dự án sử dụng ES modules và fetch JSON.
2. Chọn vai trò demo → Cài đặt → Ngôn ngữ → English. Nội dung cài đặt, nhãn, nút và thông báo tự lưu chuyển ngay; tải lại trang vẫn giữ English.
3. Đi tới từng vai trò; thử mở biểu mẫu thêm phòng, loại vé, người dùng, cảnh báo. Gửi biểu mẫu rỗng để kiểm tra lỗi validation tiếng Anh.
4. Chuyển lại Tiếng Việt; các nhãn trở về tiếng Việt. Dữ liệu đã nhập và dữ liệu nghiệp vụ không bị đổi theo ngôn ngữ.
5. Mở Admin → Tổng quan & phân tích; kiểm tra hàng bộ lọc trên desktop và chế độ mobile 390px.
6. Nếu trình duyệt vẫn dùng CSS/JS cũ, nhấn Ctrl+F5. Không cần xóa LocalStorage hoặc dữ liệu đã làm.

## Kết quả kiểm tra thực tế

- 32 màn × 1440/390px × Sáng/Tối × Việt/Anh = 256 lượt mở màn. Không ghi nhận pageerror/console error, HTTP 404 hoặc tràn ngang ở layout chính.
- Kiểm tra riêng AD3 tại 1440, 1024, 768, 390px × 2 theme × 2 ngôn ngữ: 16 trường hợp. Control cao 44px; desktop 1440 có cùng tọa độ đáy; select có cùng chiều rộng wrapper; mobile mỗi ô full width.
- Mở và gửi biểu mẫu rỗng của AD1, AD2, O4, O6: nhãn và validation đã dịch.
- Mở chi tiết A2/O3 và các màn Speaker SP3/SP4/SP5; kiểm tra dialog chấp nhận và lưu dự báo SP5.
- Đổi VI → EN ngay tại S6, giữ nội dung tên đang nhập, reload giữ English.
- Tạo và lưu phòng bằng giao diện tiếng Anh: LocalStorage có đúng tên và capacity dạng số.
- So sánh LocalStorage trước/sau đổi ngôn ngữ: chỉ settings thay đổi, entity nghiệp vụ giữ nguyên.
- Kiểm tra cú pháp toàn bộ file JS bằng `node --check`; kiểm tra diff không có lỗi whitespace.
- Kết quả chi tiết: `docs/qa/i18n/`.

## Phạm vi và giới hạn

Tên người, địa danh, email, tên file và nội dung người dùng tự nhập không được dịch tự động. Những giá trị trong ô nhập để chỉnh sửa vẫn là dữ liệu gốc; bản tiếng Anh của dữ liệu demo chỉ được dùng ở phần hiển thị khi đã có mục dịch tương ứng. Đây là từ điển nội bộ, không gọi dịch máy/API bên ngoài.

Các kiểm thử trên là smoke test toàn bộ màn và kiểm tra các thao tác liên quan, không phải chứng nhận mọi tổ hợp CRUD/AI hoặc mọi trình duyệt. Cửa sổ chọn file và thông báo validation gốc của trình duyệt có thể theo ngôn ngữ hệ điều hành.

Khi bổ sung chữ giao diện mới, ưu tiên `data-i18n`/`t()`; đối với module cũ, thêm câu đầy đủ vào `messages.js`. Không dùng bộ dịch để thay field ID hay giá trị enum.

## Các dòng sửa so với bản Git gốc

```text
+++ b/css/components.css
@@ -546,0 +547,3 @@ button:disabled {
@@ -711,0 +715 @@ dialog::backdrop {
@@ -712,0 +717,20 @@ dialog::backdrop {
@@ -1547,0 +1572,42 @@ input[type='search']::-webkit-search-cancel-button {
+++ b/css/responsive.css
@@ -8,4 +7,0 @@
+++ b/js/bridge.js
@@ -48 +48 @@ export function settings(patch) {
+++ b/js/i18n.js
@@ -0,0 +1 @@
@@ -142,0 +144,3 @@ const homeMessages = {
@@ -340,0 +345,3 @@ const homeMessages = {
@@ -537 +544 @@ export function language() {
@@ -562,0 +570 @@ export function applyTranslations(root = document) {
@@ -564,0 +573,114 @@ export function applyTranslations(root = document) {
+++ b/js/main.js
@@ -1 +1 @@
@@ -55,0 +56 @@ async function start() {
+++ b/js/modules/account.js
@@ -29,0 +30 @@
+++ b/js/modules/admin.js
@@ -0,0 +1 @@
@@ -100 +101 @@ function analytics(c) {
@@ -391 +392 @@ export async function adminAction(c, a, t) {
+++ b/js/modules/attendee.js
@@ -0,0 +1 @@
@@ -15 +16 @@
@@ -17 +18 @@
@@ -610 +611 @@
+++ b/js/modules/interest-forecast.js
@@ -0,0 +1 @@
@@ -83 +84 @@
+++ b/js/modules/speaker-feedback.js
@@ -0,0 +1 @@
@@ -41 +42 @@ function draw() {
+++ b/js/modules/speaker-materials.js
@@ -0,0 +1 @@
@@ -103 +104 @@
+++ b/js/modules/speaker-my-sessions.js
@@ -0,0 +1 @@
@@ -57 +58 @@
@@ -109 +110 @@
+++ b/js/modules/speaker-profile.js
@@ -0,0 +1 @@
@@ -404 +405 @@
+++ b/js/modules/speaker-session-edit.js
@@ -0,0 +1 @@
@@ -42 +43 @@
+++ b/js/ui.js
@@ -212,2 +212,2 @@ export function header(user, screen, url, unread = 0) {
@@ -215 +215 @@ export function header(user, screen, url, unread = 0) {
@@ -267 +267 @@ export function header(user, screen, url, unread = 0) {
@@ -314 +314 @@ icons.settings =
js/messages.js: file mới (1.004 dòng)
```
