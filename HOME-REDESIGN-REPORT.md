# EventPulse — Báo cáo thiết kế lại S1

Ngày bàn giao: 13/10/2026. HTML/CSS/JavaScript thuần, ES modules, không thêm thư viện vào ứng dụng.

## Phần đã thực hiện

Trang chủ mới lấy cảm hứng ở nhịp bố cục của Wix: tiêu đề lớn, khoảng trắng rộng, thẻ nổi và các section theo chiều cuộn. Nội dung, thương hiệu và minh họa đều dành riêng cho EventPulse. Không tải chữ, ảnh, font hoặc thư viện của Wix.

S1 có đủ 12 phần: header sticky; hero với 5 thẻ nổi; dải số liệu; giới thiệu AI và marquee; 4 vai trò; bộ lọc/carousel phiên; 4 tính năng; diễn giả; 6 bước tham gia; CTA; 6 FAQ; footer nhiều cột. Có skeleton khi tải, empty khi không có phiên và error kèm thử lại.

- `css/home.css` chỉ được link ở `index.html`. Không có mã #hex/rgb/rgba hoặc !important trong file này. Màu dùng token; thêm --home-muted, --home-glass và --form-ring với bản dark. Các token màu chính giữ nguyên.
- Dùng font stack sẵn có. Nội dung rộng 1200px ở desktop, h1 clamp tới 88px, section cách nhau 112px; mobile giảm cột và padding 16px.
- Reveal dùng IntersectionObserver, stagger 60ms; hero trôi/parallax nhẹ; hover nâng 4px. Marquee dừng khi hover và có nút tạm dừng chuyển động. prefers-reduced-motion tắt hiệu ứng.
- FAQ dùng details/summary, hỗ trợ bàn phím và animation khi mở. Minh họa vai trò là HTML/CSS tự dựng, có aria-hidden cho phần trang trí.

## Dữ liệu và nghiệp vụ

S1 đọc snapshot chung thông qua loader hiện có, ưu tiên các chỉnh sửa trong LocalStorage. Không tạo bộ dữ liệu riêng cho landing.

| Số liệu | Cách tính | Seed hiện tại |
|---|---|---:|
| Phiên trong chương trình | Phiên đã công bố/duyệt của sự kiện đang công bố | 10 |
| Diễn giả | Users có role speaker, status active | 5 |
| Phòng | Rooms thuộc sự kiện, không disabled | 6 |
| Lượt đăng ký phiên | Tổng registeredCount của các phiên công bố/duyệt | 877 |

Đây là lượt đăng ký **phiên**, không phải số người duy nhất hay lượt bán vé. Huy hiệu còn chỗ tính capacity trừ registeredCount. Countdown lấy startDate. Các số liệu thay đổi theo dữ liệu dùng chung.

Nút **Lưu lịch** mở Session Detail của Attendee; người tham dự xác nhận qua luồng thêm agenda hiện có. Giữ kiểm tra sức chứa, trùng giờ, lưu agenda bằng sessionId và tạo notification. Guest hoặc vai trò khác được hướng dẫn chọn demo Attendee. Không tạo luồng lưu song song. Đã kiểm thử S1 → A2 → xác nhận → agenda và reload vẫn còn dữ liệu.

Bốn nút vai trò gọi setRole hiện có: Attendee → A1, Speaker → SP1, Organizer → O1, Admin → AD3. Các module CRUD/AI của bốn role giữ nguyên.

## Điều hướng và ngôn ngữ

- `navigation.js` quản lý một indicator chung cho desktop/mobile. Dùng transform + width, 300ms cubic-bezier(0.4,0,0.2,1).
- Trước khi chuyển trang lưu left/width/index và group vào sessionStorage. Trang mới vẽ vị trí cũ, rồi hai requestAnimationFrame chuyển tới mục mới. Không phát animation lạ lần đầu; có nhánh reduced motion.
- Cùng trang dùng link #anchor và chỉ cập nhật active/aria-current/indicator. Hashchange không dựng lại header. Đã xử lý cả trường hợp mở trang chủ bằng `/` thay vì `/index.html`.
- Scroll-spy giữ mục theo section; khi bấm anchor không bị đổi ngược bởi các section đang lướt qua. Resize, đổi ngôn ngữ và theme đo lại vị trí.
- mountHeader giữ nguyên DOM nếu chữ/menu/tài khoản không đổi, giúp tránh ngắt animation khi module role gọi shell lại.
- `i18n.js` có t(), locale(), localized(), VI/EN cho toàn bộ S1, header/menu role, bottom-nav, dialog demo, thông báo S1, FAQ/footer và aria-label mới. Đổi ngôn ngữ re-render tại chỗ; lang/title/meta cập nhật và reload giữ lựa chọn.
- Bổ sung trường *_en trong events/sessions/users/rooms. Chỉ bổ sung bản dịch cho seed đã lưu nếu nội dung gốc còn khớp; lỗi tải bản dịch tùy chọn không chặn dữ liệu LocalStorage; không ghi đè nội dung người dùng sửa. Bản ghi tự sửa thiếu bản dịch fallback về tiếng Việt theo yêu cầu. Tên riêng giữ nguyên.
- Ngày giờ dùng Intl; date-only được đọc ở nửa đêm địa phương để tránh hiển thị lệch một ngày.

## Form và CSS dùng chung

Component form nằm ở components.css: select native với wrapper/chevron SVG tự vẽ, option theo theme, checkbox/radio custom, nút file, date/time, number/search, textarea, progress, segmented và trạng thái validation. Giữ nguyên name/value/event listener, keyboard và validation nghiệp vụ. Không dùng thư viện dropdown.

Bỏ các .nav/.eyebrow/select/.bottom-nav cũ trong role/style. Navigation và breakpoint của nó có một nguồn ở components.css; home.css chỉ override có scope S1. Responsive.css giữ layout/table/grid/form responsive. Bỏ các switch/segmented/progress cũ để dùng chung. Popup option và lịch hệ điều hành vẫn giữ hành vi native; chiều cao, viền, nền, chevron, focus và color-scheme của control đã thống nhất.

## Kiểm thử

| Kiểm tra | Kết quả |
|---|---|
| S1 guest + 4 role; S2/S3/S6/A1/O2/AD2 ở 1440/390, sáng/tối | 44/44 không tràn ngang, console error, HTTP 404 hoặc tài nguyên ngoài |
| S1 ở 1024/768, sáng/tối | 4/4 đạt; tổng matrix 48 trường hợp |
| VI → EN → reload → VI | Đạt; chữ UI S1/header/footer/dialog đổi ngay; không sót chữ Việt trong lượt EN (tên riêng không tính) |
| Indicator tiến/lùi và chuyển trang | Có tọa độ trung gian; header giữ nguyên khi đổi anchor |
| Bottom-nav, hamburger và Escape | Đạt ở 390px |
| Carousel/filter/dots | Lọc AI trả 4 phiên seed; nút tiếp theo chuyển 1/10 → 2/10; vuốt cảm ứng làm scrollLeft tăng từ 2px lên 344px; có scroll-snap và phím mũi tên |
| FAQ bàn phím / theme / tạm dừng chuyển động | Đạt |
| Loading, empty, error, retry và reduced motion | Đạt các lượt kiểm tra tương ứng |
| Luồng lưu agenda từ S1 | Đạt; xác nhận, notification, lưu sessionId; reload vẫn tồn tại |
| Lighthouse Accessibility S1 | Trước 100/100; sau 100/100, ở cả 1440 và 390 |
| Axe WCAG A/AA cho S1 | 8 tổ hợp VI/EN × sáng/tối × 1440/390: 0 violation khi tắt motion để đo trạng thái hiển thị ổn định |
| JS syntax và link HTML nội bộ | Không lỗi syntax; không href/src nội bộ thiếu file |
| Đối chiếu bảo toàn | Body của 31 trang khác không đổi; dữ liệu gốc/ID/quan hệ/số liệu không đổi khi loại các field *_en |

Đã kiểm tra bằng Chromium qua HTTP. Lighthouse phiên bản 13.5.0; bộ công cụ kiểm thử nằm ngoài gói website. Lighthouse/axe là kiểm tra tự động, không thay thế kiểm thử toàn bộ trình đọc màn hình hoặc mọi trình duyệt. Các báo cáo kiểm thử trước trong dự án là lịch sử của những đợt sửa cũ; kết quả đợt này nằm ở docs/home-redesign/.

Một lỗi hủy snapshot của View Transition khi đi nhanh qua trang loading/error được xử lý bằng script rất nhỏ chạy sớm trong head. Nó bắt lifecycle promise và đúng lỗi hủy native; không chặn lỗi ứng dụng hay promise khác.

## File tạo/sửa

| File/nhóm | Thay đổi |
|---|---|
| index.html | CSS S1 mới, skeleton, metadata/i18n |
| css/home.css (mới) | Toàn bộ landing, responsive và reduced motion có scope S1 |
| js/modules/home.js (mới) | Render 12 phần, carousel, số liệu, countdown, observer và tương tác S1 |
| js/modules/shared.js | Nhánh S1 gọi renderer mới; các nhánh Shared khác giữ logic |
| js/i18n.js | Từ điển đầy đủ S1/header/demo, t/locale/localized và dịch attribute |
| js/ui.js | Header/menu dùng t, labels role động, ngày giờ theo locale, HTML template dễ đọc |
| js/bridge.js | Settings guest/user, re-render khi đổi language, demo dialog, giữ header DOM, hash routing |
| js/navigation.js (mới) | Indicator, persistence chuyển trang và anchor active |
| js/enhance.js | Dùng indicator chung, bọc select để style chevron |
| js/view-transitions.js (mới) | Listener snapshot native chạy sớm |
| js/main.js | Dịch/loading/error ngay từ lúc boot |
| js/operations.js | Shell S1 và mount/re-render home; không thay CRUD role |
| js/api.js | Bổ sung bản dịch cho seed LocalStorage an toàn |
| css/components.css | Form/nav/eyebrow chung và responsive navigation |
| css/responsive.css | Bỏ navigation duplicate; giữ layout responsive |
| css/style.css | Bỏ nav/bottom-nav/select cũ |
| 7 CSS role | Bỏ component trùng; giữ layout role |
| css/tokens.css | Token phụ dành cho landing/focus và bản dark |
| assets/data/{events,sessions,users,rooms}.json | Chỉ thêm trường hiển thị *_en |
| 31 HTML khác | Chỉ thêm script lifecycle ở head; body/đường dẫn nghiệp vụ giữ nguyên |

Danh sách từng file:

- `403.html`
- `404.html`
- `assets/data/events.json`
- `assets/data/rooms.json`
- `assets/data/sessions.json`
- `assets/data/users.json`
- `css/attendee.css`
- `css/components.css`
- `css/responsive.css`
- `css/speaker-interest-forecast.css`
- `css/speaker-materials.css`
- `css/speaker-my-sessions.css`
- `css/speaker-profile.css`
- `css/speaker-session-edit.css`
- `css/speaker-settings.css`
- `css/style.css`
- `css/tokens.css`
- `forgot-password.html`
- `index.html`
- `js/api.js`
- `js/bridge.js`
- `js/enhance.js`
- `js/i18n.js`
- `js/main.js`
- `js/modules/shared.js`
- `js/operations.js`
- `js/ui.js`
- `login.html`
- `notifications.html`
- `pages/admin/admin-checkin-management.html`
- `pages/admin/admin-event-analytics.html`
- `pages/admin/admin-ticket-type-management.html`
- `pages/admin/admin-user-management.html`
- `pages/attendee/attendee-my-agenda.html`
- `pages/attendee/attendee-my-ticket.html`
- `pages/attendee/attendee-recommendations.html`
- `pages/attendee/attendee-schedule-conflict.html`
- `pages/attendee/attendee-session-catalog.html`
- `pages/attendee/attendee-session-detail.html`
- `pages/attendee/attendee-session-feedback.html`
- `pages/organizer/organizer-conflict-detection.html`
- `pages/organizer/organizer-dashboard.html`
- `pages/organizer/organizer-event-alerts.html`
- `pages/organizer/organizer-room-management.html`
- `pages/organizer/organizer-session-detail.html`
- `pages/organizer/organizer-session-management.html`
- `pages/speaker/speaker-feedback-overview.html`
- `pages/speaker/speaker-interest-forecast.html`
- `pages/speaker/speaker-my-session.html`
- `pages/speaker/speaker-profile.html`
- `pages/speaker/speaker-session-detail.html`
- `pages/speaker/speaker-session-materials.html`
- `profile.html`
- `register.html`
- `settings.html`
- `css/home.css`
- `js/modules/home.js`
- `js/navigation.js`
- `js/view-transitions.js`

## Cách tự kiểm tra lại

1. Giải nén bản ZIP mới vào thư mục riêng; mở index.html bằng VS Code Live Server. Ctrl+F5 để tải CSS mới.
2. Xem S1 ở 1440/1024/768/390px; mở footer để đổi ngôn ngữ và theme. Đổi English, reload, kiểm tra header, dialog demo và các section; đổi lại Tiếng Việt.
3. Bấm các mục header tiến/lùi; cuộn để thấy scroll-spy. Chọn demo Attendee, chuyển Phiên ↔ Lịch của tôi để thấy indicator qua các trang.
4. Thử filter, mũi tên/dots carousel, kéo ngang trên thiết bị cảm ứng; mở/đóng FAQ bằng Tab + Enter.
5. Chọn vai trò Attendee, bấm Lưu lịch của phiên chưa lưu, xác nhận ở trang chi tiết; kiểm tra agenda và reload.
6. Mở DevTools Console/Network. Kiểm tra các màn S2/S3/S6/A1/O2/AD2, các ô chọn, nút file, focus và checkbox.
7. Thêm ?state=empty hoặc ?state=error ở index.html để xem trạng thái; bật prefers-reduced-motion trong DevTools Rendering để kiểm tra tắt chuyển động.

Diff có số dòng tại docs/home-redesign/HOME-REDESIGN.patch. JSON nghiệm thu và Lighthouse nằm trong cùng thư mục. Không cần npm install để chạy website.
