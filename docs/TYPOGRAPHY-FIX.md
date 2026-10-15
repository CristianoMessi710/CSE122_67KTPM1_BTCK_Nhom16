> Cập nhật: Inter 4.1 đã được tích hợp. Xem INTER-FONT-REPORT.md; phần dưới là báo cáo trước khi nhận font.

# Sửa typography S1 — 13/10/2026

Đã xác nhận dự án không có font-face hay tệp Inter. Khai báo Inter, Arial, sans-serif chỉ là danh sách ưu tiên; không bảo đảm Inter tồn tại. CSS.getPlatformFontsForNode trên Chromium kiểm thử cho thấy font thực tế là DejaVu Sans Bold (font fallback Linux), không phải Inter; trên Windows có thể fallback Arial.

Đợt này sửa css/home.css:
- Hero: font-weight 800 → 700; line-height 1.03 → 1.2; letter-spacing -0.055em → -0.01em. Override mobile cũng -0.01em.
- Section heading: line-height 1.1 → 1.22; letter-spacing -0.045em → -0.015em.
- Tiêu đề thẻ: nới line-height tới 1.3–1.35, giảm tracking âm về -0.01em.
- Các tracking âm tuyệt đối của tên, số và avatar đổi về -0.01em.

Kiểm tra qua HTTP ở 1440/1024/768/390px, sáng/tối: 8/8 không tràn ngang hoặc lỗi console. Đã xem hero desktop/mobile để kiểm tra dấu tiếng Việt. Font-family và bảng màu vẫn giữ theo Design System; các module nghiệp vụ không sửa.

Còn thiếu để hoàn tất Inter: tệp font cục bộ (ưu tiên Inter Variable .woff2 có đủ ký tự tiếng Việt, kèm license). Theo yêu cầu trước đó “Không tải ảnh/font/thư viện từ bên ngoài”, đợt này không tải font từ mạng và chưa thêm font-face trỏ tới tệp không tồn tại. Sau khi có font sẽ đặt trong assets/fonts/, khai báo font-face dùng URL cục bộ, font-display: swap và kiểm tra font thực tế bằng DevTools. Không dùng local() để tránh mỗi máy chọn một phiên bản khác nhau.

Báo cáo S1 và ảnh của các đợt trước phản ánh bản typography trước; diff và số liệu đợt này nằm trong docs/typography/.
