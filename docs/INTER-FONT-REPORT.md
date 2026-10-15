# Tích hợp Inter 4.1 — 13/10/2026

Đã hoàn tất phần font còn thiếu của EventPulse, từ ZIP Inter-4.1 do người dùng cung cấp. Không tải font hay tài nguyên từ bên ngoài.

## File

- assets/fonts/InterVariable.woff2 — thường, weight 100–900.
- assets/fonts/InterVariable-Italic.woff2 — nghiêng, weight 100–900.
- assets/fonts/LICENSE-Inter.txt — license nguyên bản từ ZIP.
- css/tokens.css — font-face tên CSS Inter để các stack hiện có dùng cùng font; font-display swap, optical sizing auto, font-synthesis none.
- 32 file HTML — preload font thường trong head, đường dẫn đúng cho root/pages. Nội dung và JS nghiệp vụ không sửa.
- css/home.css — span nhấn của h1 dùng display block + text-wrap balance, tránh “lai.” bị rơi thành một dòng riêng khi font thật thay đổi kích thước chữ. Giữ line-height/tracking đã nới ở đợt trước.

Hai tệp WOFF2 và license được sao chép nguyên byte từ ZIP; không chỉnh sửa font. Không sử dụng local() nên không phụ thuộc phiên bản Inter cài trên máy người xem. Inter ở trong project và được phục vụ cùng host với website. Font thường được preload; font nghiêng chỉ tải khi cần.

## Nghiệm thu

- CSS.getPlatformFontsForNode xác nhận glyph thật dùng Inter Variable, isCustomFont=true; kiểm tra cả 400/500/600/700/800, thường và nghiêng. Không dựa riêng vào font-family hay document.fonts.check để kết luận.
- S1/A1/SP2/O4/AD2/S6 ở 1440/390px, sáng/tối (24 trường hợp): không lỗi console/404/tài nguyên ngoài hoặc tràn ngang; h1 dùng font Inter thật.
- S1 ở 1024/768px, sáng/tối (4 trường hợp): không lỗi/tràn ngang.
- Kiểm tra lại hero sau cân bằng dòng ở cả 4 kích thước, sáng/tối (8 trường hợp): đạt.
- Kiểm tra các chữ cái tiếng Việt được dựng bằng NFC, đủ ký tự trong cmap; không cần fallback cho những ký tự đã kiểm tra.
- Lighthouse Accessibility S1: 100/100 ở 1440 và 390px.
- Đã xem ảnh nội bộ desktop/mobile để kiểm tra dấu và xuống dòng.

JSON số liệu nằm trong docs/inter-font/. Các báo cáo/ảnh trước đó là lịch sử trước khi font được tích hợp; thông tin “chưa có Inter” trong báo cáo typography cũ đã được giải quyết bởi đợt này.

## Cách dùng

Giải nén bản ZIP mới, mở index.html bằng Live Server, Ctrl+F5. Không phải cài font trên Windows. Trong DevTools → Elements → Computed → Rendered Fonts, có thể thấy tên font thực Inter Variable (được khai báo với alias CSS Inter).
