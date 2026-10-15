# EventPulse-Merged — CSE122

Dự án HTML/CSS/JavaScript thuần tích hợp SV1 + SV2 + bản dist của SV3. Có 32 màn hình chính thức, dùng chung dữ liệu và Design System. Không cần npm/Vite để chạy.

## Mở bằng VS Code

1. Giải nén EventPulse-Merged.zip, mở thư mục **EventPulse-Merged** bằng VS Code.
2. Cài extension **Live Server**, nhấp phải `index.html` → **Open with Live Server**.
3. Chọn **Trải nghiệm bản demo** rồi chọn Người tham dự, Diễn giả, Ban tổ chức hoặc Quản trị viên. Nút **Đổi vai trò** có ở header.
4. Nếu muốn dùng form Login: `minhanh@example.com` / `Demo@123`. Tài khoản Speaker thứ hai để xem đủ các đề xuất mẫu: xem email của USR102 trong `assets/data/users.json`, mật khẩu `Demo@123`.

Có thể chạy `python3 -m http.server 5500` trong thư mục dự án rồi mở `http://localhost:5500`. Không mở bằng file:// vì ứng dụng dùng ES modules và fetch JSON.

## Xem điện thoại/iPad

Mở DevTools (F12) → Toggle device toolbar (Ctrl+Shift+M trên Windows) → Responsive. Dùng 390×844 cho điện thoại, 768 hoặc 1024px cho tablet, 1440px cho desktop. Refresh sau khi đổi viewport nếu cần. Nội dung mobile có bottom navigation, bảng chuyển card và modal trong giới hạn màn hình.

## Dữ liệu

Lần đầu seed từ assets/data/*.json; lần sau dùng LocalStorage. Đổi vai trò trong cùng địa chỉ để thấy dữ liệu liên thông. Không đổi port giữa các phần demo. Dữ liệu mẫu dùng sự kiện tháng 10/2026, có một sự kiện đã kết thúc để demo feedback. Khi ngày thực tế vượt ngày sự kiện, các validation hết hạn sẽ hoạt động đúng thiết kế.

Muốn trở về dữ liệu mẫu: dùng DevTools → Application → Local Storage, chỉ xóa các key eventpulse_ của bản demo rồi reload. Việc này xóa dữ liệu bạn đã thử sửa; không thực hiện nếu cần giữ chúng.

## Kịch bản demo

- Speaker → Phiên của tôi → Đề xuất phiên → Organizer → Phiên → Duyệt/phân công → Attendee → Phiên → Lưu lịch.
- Speaker → Tài liệu → thêm link/file mock → Attendee → Chi tiết phiên → Tài liệu.
- Organizer → Cảnh báo → gửi → Attendee → chuông thông báo.
- Admin → Vé → Quản lý check-in → mã EP26-001-A7K2 → xác nhận → Attendee → Vé của tôi.
- AI: Attendee gợi ý/xung đột; Organizer kiểm tra phòng; Speaker dự báo và lưu ghi chú. Các thao tác quan trọng có xác nhận.

Các trạng thái QA: `?state=error` cho lỗi tải chung, `?state=empty` cho các danh sách SV3, `?state=ai-error` cho lỗi AI. Nút Thử lại phục hồi luồng. Chỉ dùng khi cần minh họa lỗi, không phải URL mặc định.

## Tài liệu bàn giao

- INTEGRATION-REPORT.md: nguồn từng màn, rename/duplicate, refactor, dữ liệu và giới hạn.
- TEST-REPORT.md: kết quả thực tế, phạm vi và cách tái hiện.
- docs/SCREEN-CHECKLIST.md: checklist 32 màn.
- docs/FOLDER-TREE.md: toàn bộ cây file.
- docs/qa/: bằng chứng kiểm thử JSON và ảnh viewport.

Code không minify; HTML, CSS, JS tách riêng. `js/bridge.js` giữ API tương thích để logic SV1/SV2 dùng cùng storage và component của dự án tích hợp.
