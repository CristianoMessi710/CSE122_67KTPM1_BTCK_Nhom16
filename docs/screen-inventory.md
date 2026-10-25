# Screen Inventory — EventPulse / CSE122

Ngày tổng hợp: 25/10/2026. Phạm vi: bản EventPulse sau tích hợp và sửa bộ lọc/i18n.

## Nguồn và mức độ xác nhận

Tài liệu này tổng hợp từ [bản chép Inventory Revised](screen-inventory-source.json), [inventory code](code-inventory.json), [checklist triển khai](SCREEN-CHECKLIST.md), mã nguồn và các báo cáo QA có trong bản bàn giao. Bản chép nguồn hiện có **32 dòng, 20 trường**, không phải chỉ 12 trường. Bảng dưới gom thành 12 nhóm thông tin để đọc và truy vết; phần chi tiết giữ nguyên mọi trường nguồn. Không thay thế hoặc sửa Excel gốc.

Barem ghi inventory có đủ 12 cột, nhưng chưa có tên 12 cột bắt buộc trong tài liệu barem đã đọc. Nếu giảng viên có template riêng, cần đối chiếu template đó trước khi nộp. Chưa xác minh lại byte của Excel, User Flow và bản thiết kế gốc trong lần tổng hợp này; mô tả flow bên dưới là luồng triển khai để nghiệm thu, không tự nhận là bản chép nguyên văn User Flow.

SV1/SV2/SV3 là phân công theo nguồn, không xác nhận ai đã tự viết từng dòng hoặc đủ vertical slice. Chưa có tên, MSSV và tài khoản GitHub được cả ba thành viên xác nhận.

## Quy ước

- **I — Đã triển khai:** có file và được mở trong đợt kiểm tra; không đồng nghĩa mọi nghiệp vụ đều đã test.
- **Q — Smoke đã ghi nhận:** các ca mở màn không thay thế test toàn bộ CRUD/AI.
- **E — Chờ minh chứng:** Figma, task, branch thực tế, commit, PR/review và OBS chưa được xác minh cho từng màn.
- **DONE:** chỉ đánh khi đủ DoD và minh chứng; hiện chưa tự đánh DONE cho màn nào.

QA1: [256 ca mở màn](qa/i18n/screens.json), 32 màn × 1440/390px × Việt/Anh × Sáng/Tối. QA2: [tương tác form và đổi ngôn ngữ](qa/i18n/interactions.json). QA3: [bộ lọc, dữ liệu và reload](qa/i18n/filter-and-data.json). Các ca nghiệp vụ và ma trận 768/1024px trước đó xem [TEST-REPORT](../TEST-REPORT.md), không coi là vừa chạy lại hôm nay. Chưa đủ kiểm chứng 320/375px, zoom 200%, toàn bộ Tab/Esc và contrast AA.

## Bảng tổng hợp 12 cột

| ID | Màn hình | Role / quyền | File thực tế | Phụ trách theo phân công | Mục tiêu / tác vụ | Flow | CRUD / JS | Dữ liệu chuẩn | State / AI | Thiết kế / QA | Truy vết / nghiệm thu |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| S1 | Trang chủ sự kiện | Dùng chung | [index.html](../index.html) | SV3 | Tìm hiểu sự kiện, quyết định tham gia; Xem thông tin tổng quan sự kiện | Landing → đăng nhập/đăng ký hoặc chọn role demo → trang mặc định của role. | R; Slider/carousel session nổi bật, smooth-scroll, toggle menu mobile | events, sessions, users, rooms, userTickets | Loading: Có (skeleton banner); Empty: Có (chưa có event); Error: Có (lỗi tải dữ liệu event); Success: —; AI: Không | QA1; thiết kế từng màn: chưa xác minh | I / Q / E; chưa DONE |
| S2 | Đăng nhập | Dùng chung | [login.html](../login.html) | SV1 | Truy cập hệ thống theo đúng vai trò; Đăng nhập | Nhập tài khoản → validation → đăng nhập mock → route theo role; lỗi thì giữ form. | R; Validate email/mật khẩu, hiện/ẩn mật khẩu, submit async, redirect theo role | users, currentUser | Loading: Có (đang xác thực); Empty: —; Error: Có (sai tài khoản/mật khẩu); Success: Có (đăng nhập thành công → điều hướng); AI: Không | QA1; thiết kế từng màn: chưa xác minh | I / Q / E; chưa DONE |
| S3 | Đăng ký | Dùng chung | [register.html](../register.html) | SV1 | Tạo tài khoản mới để tham gia sự kiện; Đăng ký (Attendee/Speaker) | Nhập thông tin → validation → tạo tài khoản mock; kiểm tra tiếp luồng sau đăng ký khi quay OBS. | C; Validate realtime (email trùng, mật khẩu khớp), hiển thị độ mạnh mật khẩu | users, currentUser | Loading: Có (đang tạo tài khoản); Empty: —; Error: Có (email đã tồn tại, dữ liệu không hợp lệ); Success: Có (tạo tài khoản thành công); AI: Không | QA1; thiết kế từng màn: chưa xác minh | I / Q / E; chưa DONE |
| S4 | Quên mật khẩu | Dùng chung | [forgot-password.html](../forgot-password.html) | SV1 | Khôi phục quyền truy cập khi quên mật khẩu; Yêu cầu đặt lại mật khẩu | Đăng nhập → quên mật khẩu → nhập email → phản hồi mô phỏng; không gửi email thật. | U; Validate định dạng email, đếm ngược gửi lại mã | users | Loading: Có (đang gửi yêu cầu); Empty: —; Error: Có (email không tồn tại); Success: Có (đã gửi liên kết đặt lại); AI: Không | QA1; thiết kế từng màn: chưa xác minh | I / Q / E; chưa DONE |
| S5 | Hồ sơ cá nhân (Attendee/Organizer/Admin) | Dùng chung | [profile.html](../profile.html) | SV1 | Quản lý thông tin cá nhân; Xem/sửa hồ sơ | Header → hồ sơ → sửa → validation → lưu và cập nhật người dùng. | R/U; Validate form, preview avatar trước khi lưu, toast xác nhận | users, currentUser | Loading: Có (đang tải hồ sơ); Empty: —; Error: Có (lưu thất bại); Success: Có (cập nhật thành công); AI: Không | QA1; thiết kế từng màn: chưa xác minh | I / Q / E; chưa DONE |
| S6 | Cài đặt | Dùng chung | [settings.html](../settings.html) | SV2 | Tuỳ chỉnh trải nghiệm sử dụng; Cấu hình tài khoản | Header → cài đặt → đổi ngôn ngữ/theme/tùy chọn → tự lưu; đổi mật khẩu là mock. | U; Toggle switch, lưu tức thời (auto-save), validate đổi mật khẩu | settings, users | Loading: —; Empty: —; Error: Có (lưu cài đặt thất bại); Success: Có (đã lưu cài đặt); AI: Không | QA1; thiết kế từng màn: chưa xác minh | I / Q / E; chưa DONE |
| S7 | Thông báo | Dùng chung | [notifications.html](../notifications.html) | SV3 | Nắm bắt kịp thời thay đổi liên quan đến mình; Xem danh sách thông báo | Header → thông báo → xem/đánh dấu đã đọc → mở nội dung liên quan. | R/U; Đánh dấu đã đọc, lọc theo loại, realtime badge counter (mock) | eventAlerts, notifications | Loading: Có (đang tải thông báo); Empty: Có (chưa có thông báo); Error: Có (tải thông báo lỗi); Success: Có (đánh dấu đã đọc thành công); AI: Không | QA1; thiết kế từng màn: chưa xác minh | I / Q / E; chưa DONE |
| S8 | Không có quyền truy cập | Dùng chung | [403.html](../403.html) | SV3 | Ngăn truy cập trái phép ngoài quyền hạn; Xử lý khi vào nhầm khu vực không có quyền | Truy cập sai role → thông báo không có quyền → chọn role hoặc về màn phù hợp. | —; Tự động điều hướng theo role sau X giây (đếm ngược) | currentUser | Loading: —; Empty: —; Error: —; Success: —; AI: Không | QA1; thiết kế từng màn: chưa xác minh | I / Q / E; chưa DONE |
| S9 | Không tìm thấy trang | Dùng chung | [404.html](../404.html) | SV3 | Xử lý khi truy cập đường dẫn không tồn tại; Xử lý lỗi điều hướng | Đường dẫn lỗi được đưa tới trang 404 → quay lại hoặc về trang chủ; host phải cấu hình trang lỗi riêng. | —; Nút quay lại trang trước (dùng history API) | Không CRUD | Loading: —; Empty: —; Error: —; Success: —; AI: Không | QA1; thiết kế từng màn: chưa xác minh | I / Q / E; chưa DONE |
| A1 | Danh mục Session | Người tham dự | [pages/attendee/attendee-session-catalog.html](../pages/attendee/attendee-session-catalog.html) | SV1 | Chọn được session phù hợp giữa agenda dài; Duyệt & tìm kiếm session | Catalog → tìm kiếm/lọc/sắp xếp → chi tiết A2; menu sang agenda/speakers/events theo route hiện có. | R; Search debounce, filter đa tiêu chí, sort, render card/list, nút 'Thêm vào agenda' | sessions, users, rooms | Loading: Có (đang tải danh sách); Empty: Có (không có session khớp bộ lọc); Error: Có (lỗi tải dữ liệu); Success: —; AI: Không | QA1; thiết kế từng màn: chưa xác minh | I / Q / E; chưa DONE |
| A2 | Chi tiết Session | Người tham dự | [pages/attendee/attendee-session-detail.html](../pages/attendee/attendee-session-detail.html) | SV1 | Hiểu rõ nội dung trước khi thêm vào lịch; Xem chi tiết session | A1 → chi tiết → thêm agenda → kiểm tra trùng giờ → lưu hoặc A4 → agenda/thông báo. | R; Tab mô tả/diễn giả/tài liệu, cập nhật sức chứa realtime (mock), modal xác nhận thêm | sessions, users, rooms, agendas, notifications | Loading: Có (đang tải chi tiết); Empty: —; Error: Có (session không tồn tại/đã bị huỷ); Success: Có (đã thêm vào agenda); AI: Không | QA1; thiết kế từng màn: chưa xác minh | I / Q / E; chưa DONE |
| A3 | Agenda của tôi | Người tham dự | [pages/attendee/attendee-my-agenda.html](../pages/attendee/attendee-my-agenda.html) | SV1 | Có một lịch trình cá nhân không trùng giờ; Tạo & quản lý agenda cá nhân | Mở agenda → xem/sắp xếp/bỏ phiên → lưu; trùng lịch dẫn sang A4. | C/R/U; Kéo-thả sắp xếp, phát hiện trùng giờ realtime, xuất/in agenda, xoá có xác nhận | agendas, sessions | Loading: Có (đang tải agenda); Empty: Có (agenda trống); Error: Có (không lưu được thay đổi); Success: Có (đã cập nhật agenda); AI: Không | QA1; thiết kế từng màn: chưa xác minh | I / Q / E; chưa DONE |
| A4 | Trợ lý gợi ý thay thế (AI) | Người tham dự | [pages/attendee/attendee-schedule-conflict.html](../pages/attendee/attendee-schedule-conflict.html) | SV2 | Giải quyết nhanh khi 2 session bị trùng giờ; Xử lý xung đột lịch | Phát hiện trùng giờ → xem cặp xung đột → gợi ý thay thế → chọn/xác nhận → lưu agenda. | R/U; Hiển thị 2 session xung đột cạnh nhau, nút chấp nhận gợi ý áp dụng ngay vào agenda | agendas, sessions | Loading: Có (AI đang phân tích xung đột); Empty: Có (không có session thay thế phù hợp); Error: Có ('Không thể xử lý yêu cầu lúc này' + Thử lại); Success: Có (đã áp dụng session thay thế); AI: AI-2: Conflict Resolver | QA1; thiết kế từng màn: chưa xác minh | I / Q / E; chưa DONE |
| A5 | Gợi ý cho bạn (AI) | Người tham dự | [pages/attendee/attendee-recommendations.html](../pages/attendee/attendee-recommendations.html) | SV2 | Khám phá session phù hợp sở thích mà chưa nghĩ tới; Nhận đề xuất session cá nhân hoá | Chọn sở thích/điều kiện → xử lý → kết quả + lý do → chọn/bỏ/tạo lại → xác nhận lưu agenda. | R; Nút 'Vì sao gợi ý này', làm mới gợi ý, thêm thẳng vào agenda | sessions, agendas | Loading: Có (đang tạo đề xuất); Empty: Có ('Không đủ dữ liệu để đưa ra đề xuất'); Error: Có (AI lỗi xử lý, cho phép Thử lại/Dùng thủ công); Success: Có (đã thêm gợi ý vào agenda); AI: AI-1: Agenda Recommender | QA1; thiết kế từng màn: chưa xác minh | I / Q / E; chưa DONE |
| A6 | Phản hồi Session | Người tham dự | [pages/attendee/attendee-session-feedback.html](../pages/attendee/attendee-session-feedback.html) | SV1 | Chia sẻ trải nghiệm để cải thiện sự kiện; Đánh giá session đã tham dự | Chọn phiên đủ điều kiện tham dự → chấm điểm/nhận xét → validation → lưu/sửa/xóa phản hồi. | C/R/U/D; Rating component, validate độ dài nhận xét, sửa/xoá có xác nhận | feedback, sessions, userTickets | Loading: Có (đang gửi đánh giá); Empty: Có (chưa từng đánh giá session nào); Error: Có (gửi đánh giá thất bại); Success: Có (đã lưu đánh giá); AI: Không | QA1; thiết kế từng màn: chưa xác minh | I / Q / E; chưa DONE |
| A7 | Vé của tôi | Người tham dự | [pages/attendee/attendee-my-ticket.html](../pages/attendee/attendee-my-ticket.html) | SV1 | Xác nhận quyền tham dự tại sự kiện; Xem vé & check-in | Chọn vé → xem mã vé/QR mock → check-in mock/tải ảnh vé nếu đủ điều kiện. | R; Sinh mã QR (mock), tải vé PDF/ảnh, cập nhật trạng thái check-in realtime (mock) | userTickets, ticketTypes, events | Loading: Có (đang tải vé); Empty: Có (chưa có vé); Error: Có (vé không hợp lệ/hết hạn); Success: Có (check-in thành công); AI: Không | QA1; thiết kế từng màn: chưa xác minh | I / Q / E; chưa DONE |
| SP1 | Hồ sơ diễn giả | Diễn giả | [pages/speaker/speaker-profile.html](../pages/speaker/speaker-profile.html) | SV2 | Được người tham dự và ban tổ chức nhận diện đúng; Quản lý hồ sơ diễn giả | Xem hồ sơ → sửa thông tin/ảnh/link → validation → lưu. | R/U; Validate form, preview ảnh đại diện, đếm ký tự tiểu sử | users | Loading: Có (đang tải hồ sơ); Empty: —; Error: Có (lưu thất bại); Success: Có (cập nhật thành công); AI: Không | QA1; thiết kế từng màn: chưa xác minh | I / Q / E; chưa DONE |
| SP2 | Session của tôi | Diễn giả | [pages/speaker/speaker-my-session.html](../pages/speaker/speaker-my-session.html) | SV2 | Theo dõi và đề xuất session của mình; Quản lý session của tôi | Danh sách phiên → đề xuất mới hoặc mở SP3; theo dõi trạng thái ban tổ chức. | C/R/U; Filter theo trạng thái (chờ duyệt/đã duyệt/từ chối), form đề xuất session mới có validate | sessions, users | Loading: Có (đang tải danh sách); Empty: Có (chưa có session nào); Error: Có (gửi đề xuất thất bại); Success: Có (đã gửi đề xuất/cập nhật); AI: Không | QA1; thiết kế từng màn: chưa xác minh | I / Q / E; chưa DONE |
| SP3 | Chi tiết Session của tôi | Diễn giả | [pages/speaker/speaker-session-detail.html](../pages/speaker/speaker-session-detail.html) | SV2 | Chỉnh sửa nội dung chi tiết cho từng session; Chỉnh sửa chi tiết session | SP2 → chi tiết → chỉnh sửa theo trạng thái → lưu/gửi duyệt; phòng/giờ phụ thuộc quyền. | U; Autosave nháp, hiển thị timeline trạng thái (chờ duyệt→duyệt/từ chối) | sessions, rooms | Loading: Có (đang tải chi tiết); Empty: —; Error: Có (không lưu được thay đổi); Success: Có (đã lưu thay đổi); AI: Không | QA1; thiết kế từng màn: chưa xác minh | I / Q / E; chưa DONE |
| SP4 | Tài liệu Session | Diễn giả | [pages/speaker/speaker-session-materials.html](../pages/speaker/speaker-session-materials.html) | SV2 | Cung cấp tài liệu chất lượng cho người tham dự; Quản lý tài liệu buổi nói chuyện | Chọn phiên có quyền → thêm file mock/link → validation/upload → sửa/xóa tài liệu. | C/R/U/D; Kéo-thả upload (mock), preview tên file/kích thước, xoá có xác nhận | materials, sessions | Loading: Có (đang tải lên); Empty: Có (chưa có tài liệu); Error: Có (định dạng/kích thước không hợp lệ); Success: Có (tải lên thành công); AI: Không | QA1; thiết kế từng màn: chưa xác minh | I / Q / E; chưa DONE |
| SP5 | Dự báo mức độ quan tâm (AI) | Diễn giả | [pages/speaker/speaker-interest-forecast.html](../pages/speaker/speaker-interest-forecast.html) | SV2 | Chuẩn bị tốt hơn cho session đông người; Xem dự báo mức độ quan tâm | Chọn phiên → xử lý → dự báo + giải thích/confidence → tạo lại/chấp nhận/bỏ qua → lưu ghi chú. | R; Biểu đồ dự báo, nút giải thích lý do dự báo, làm mới dự báo | sessions, agendas | Loading: Có (đang tính toán dự báo); Empty: Có ('Không đủ dữ liệu để đưa ra đề xuất'); Error: Có ('AI chưa chắc chắn về kết quả này' + Thử lại); Success: Có (đã cập nhật dự báo mới nhất); AI: AI-3: Interest Forecast | QA1; thiết kế từng màn: chưa xác minh | I / Q / E; chưa DONE |
| SP6 | Phản hồi nhận được | Diễn giả | [pages/speaker/speaker-feedback-overview.html](../pages/speaker/speaker-feedback-overview.html) | SV2 | Cải thiện chất lượng bài nói dựa trên phản hồi; Xem phản hồi từ người tham dự | Chọn phiên của diễn giả → xem điểm và phản hồi hiện có. | R; Biểu đồ phân bố sao, lọc theo session, sắp xếp theo mới nhất | feedback, sessions | Loading: Có (đang tải phản hồi); Empty: Có (chưa có phản hồi); Error: Có (lỗi tải dữ liệu); Success: —; AI: Không | QA1; thiết kế từng màn: chưa xác minh | I / Q / E; chưa DONE |
| O1 | Bảng điều khiển Ban tổ chức | Ban tổ chức | [pages/organizer/organizer-dashboard.html](../pages/organizer/organizer-dashboard.html) | SV3 | Nắm tổng quan tình trạng vận hành sự kiện; Theo dõi tổng quan sự kiện | Dashboard → xem phiên cần duyệt/xung đột → O2/O3/O5. | R; Biểu đồ tổng quan, cảnh báo nổi khi có xung đột mới | sessions, rooms, agendas | Loading: Có (đang tải dashboard); Empty: Có (chưa có dữ liệu sự kiện); Error: Có (lỗi tải số liệu); Success: —; AI: Không | QA1; thiết kế từng màn: chưa xác minh | I / Q / E; chưa DONE |
| O2 | Quản lý Session | Ban tổ chức | [pages/organizer/organizer-session-management.html](../pages/organizer/organizer-session-management.html) | SV3 | Kiểm soát nội dung chương trình sự kiện; Duyệt & quản lý session | Tìm/lọc/chọn phiên → xem chi tiết O3 → duyệt/từ chối theo điều kiện. | R/U; Bulk action duyệt/từ chối, filter đa tiêu chí, tìm kiếm | sessions | Loading: Có (đang tải danh sách); Empty: Có (không có session chờ duyệt); Error: Có (duyệt thất bại); Success: Có (đã cập nhật trạng thái); AI: Không | QA1; thiết kế từng màn: chưa xác minh | I / Q / E; chưa DONE |
| O3 | Chi tiết duyệt Session | Ban tổ chức | [pages/organizer/organizer-session-detail.html](../pages/organizer/organizer-session-detail.html) | SV3 | Sắp xếp session vào đúng phòng, đúng giờ; Gán phòng & khung giờ cho session | Chọn phiên → xem nội dung → gán phòng/giờ → validation → kiểm tra xung đột → lưu hoặc O5. | U; Dropdown chọn phòng/giờ có kiểm tra khả dụng, form lý do từ chối bắt buộc khi từ chối | sessions, rooms, notifications | Loading: Có (đang lưu phân công); Empty: —; Error: Có (phòng/giờ đã được dùng); Success: Có (đã gán phòng/giờ thành công); AI: Không | QA1; thiết kế từng màn: chưa xác minh | I / Q / E; chưa DONE |
| O4 | Quản lý Phòng | Ban tổ chức | [pages/organizer/organizer-room-management.html](../pages/organizer/organizer-room-management.html) | SV3 | Sử dụng hiệu quả cơ sở vật chất sự kiện; Quản lý phòng tổ chức | Danh sách phòng → thêm/sửa/lưu trữ → validation tên/sức chứa → lưu; xem lịch phòng. | C/R/U; Form validate sức chứa > 0, tìm kiếm phòng, badge trạng thái đang dùng/trống | rooms, sessions | Loading: Có (đang tải danh sách phòng); Empty: Có (chưa có phòng nào); Error: Có (lưu phòng thất bại, trùng tên); Success: Có (đã lưu phòng); AI: Không | QA1; thiết kế từng màn: chưa xác minh | I / Q / E; chưa DONE |
| O5 | Phát hiện xung đột (AI) | Ban tổ chức | [pages/organizer/organizer-conflict-detection.html](../pages/organizer/organizer-conflict-detection.html) | SV3 | Phát hiện sớm và xử lý xung đột lịch/phòng ở cấp toàn sự kiện; Phát hiện & xử lý xung đột hệ thống | Quét xung đột → xem kết quả/đề xuất AI mock → áp dụng có xác nhận hoặc xử lý thủ công/bỏ qua. | R/U; Danh sách xung đột được highlight, nút áp dụng gợi ý AI trực tiếp vào lịch | sessions, rooms | Loading: Có (đang quét toàn bộ lịch); Empty: Có (không phát hiện xung đột nào); Error: Có ('Không thể xử lý yêu cầu lúc này' + Thử lại/Xử lý thủ công); Success: Có (đã áp dụng phương án xử lý); AI: AI-2: Conflict Resolver (cấp hệ thống) | QA1; thiết kế từng màn: chưa xác minh | I / Q / E; chưa DONE |
| O6 | Cảnh báo sự kiện | Ban tổ chức | [pages/organizer/organizer-event-alerts.html](../pages/organizer/organizer-event-alerts.html) | SV3 | Thông báo kịp thời khi có thay đổi chương trình; Soạn & gửi cảnh báo sự kiện | Tạo/sửa cảnh báo → chọn đối tượng → validation → gửi ngay/lên lịch → notifications; không có scheduler máy chủ. | C/R/U/D; Rich text soạn thảo, chọn đối tượng nhận (role/nhóm), lên lịch gửi | eventAlerts, notifications | Loading: Có (đang gửi thông báo); Empty: Có (chưa có cảnh báo nào); Error: Có (gửi thất bại); Success: Có (đã gửi/thu hồi thông báo); AI: Không | QA1; thiết kế từng màn: chưa xác minh | I / Q / E; chưa DONE |
| AD1 | Quản lý loại vé | Quản trị viên | [pages/admin/admin-ticket-type-management.html](../pages/admin/admin-ticket-type-management.html) | SV3 | Kiểm soát cấu trúc giá vé của sự kiện; Quản lý loại vé | Danh sách loại vé → tạo/sửa → validation → mở/ngừng bán/lưu trữ → lưu. | C/R/U/Archive; Validate giá/số lượng, toggle ngưng bán, tìm kiếm loại vé | ticketTypes, userTickets | Loading: Có (đang tải danh sách vé); Empty: Có (chưa có loại vé nào); Error: Có (lưu thất bại, trùng tên loại vé); Success: Có (đã lưu loại vé); AI: Không | QA1; thiết kế từng màn: chưa xác minh | I / Q / E; chưa DONE |
| AD2 | Quản lý Người dùng | Quản trị viên | [pages/admin/admin-user-management.html](../pages/admin/admin-user-management.html) | SV3 | Kiểm soát quyền truy cập hệ thống; Quản lý người dùng | Tìm/lọc người dùng → thêm/sửa role/trạng thái → xác nhận khóa → lưu. | C/R/U/Archive; Tìm kiếm/lọc theo role & trạng thái, bulk khoá tài khoản, xác nhận trước khi khoá | users | Loading: Có (đang tải danh sách); Empty: Có (không có người dùng khớp bộ lọc); Error: Có (thao tác thất bại); Success: Có (đã cập nhật người dùng); AI: Không | QA1; thiết kế từng màn: chưa xác minh | I / Q / E; chưa DONE |
| AD3 | Phân tích sự kiện | Quản trị viên | [pages/admin/admin-event-analytics.html](../pages/admin/admin-event-analytics.html) | SV3 | Ra quyết định dựa trên số liệu thực tế của sự kiện; Xem phân tích tổng thể sự kiện | Chọn khoảng ngày/chủ đề/phòng → KPI/biểu đồ → dự báo → xác nhận ghi nhận hoặc xem thủ công → xuất CSV. | R; Biểu đồ tương tác (lọc theo khoảng thời gian), xuất báo cáo (mock) | ticketTypes, userTickets, agendas, feedback, sessions | Loading: Có (đang tổng hợp số liệu); Empty: Có (chưa đủ dữ liệu để thống kê); Error: Có (lỗi tải số liệu); Success: —; AI: AI-3: Interest Forecast (dashboard insight) | QA1; thiết kế từng màn: chưa xác minh | I / Q / E; chưa DONE |
| AD4 | Quản lý Check-in | Quản trị viên | [pages/admin/admin-checkin-management.html](../pages/admin/admin-checkin-management.html) | SV3 | Đảm bảo đúng người vào đúng sự kiện; Quản lý check-in vé | Nhập mã vé/quét mock → kiểm tra hợp lệ → xác nhận check-in → cập nhật vé và báo cáo. | R/U; Tìm kiếm theo mã vé/tên, quét mã (mock), cập nhật trạng thái realtime | userTickets, events, users | Loading: Có (đang tra cứu); Empty: Có (chưa có lượt check-in nào); Error: Có (mã vé không hợp lệ); Success: Có (check-in thành công); AI: Không | QA1; thiết kế từng màn: chưa xác minh | I / Q / E; chưa DONE |

## Hồ sơ nghiệm thu từng màn

Các state bên dưới là **yêu cầu nguồn**, không phải khẳng định tất cả đã kiểm thử. Dấu “—” trong nguồn không được tự nâng thành yêu cầu mới. Chuỗi chưa có bằng chứng được ghi “Chưa xác minh”, không tạo Task ID, commit, PR hay đường dẫn video giả.

### S1 — Trang chủ sự kiện

| Trường nguồn | Giá trị |
| --- | --- |
| ID | S1 |
| Role | Dùng chung |
| User goal | Tìm hiểu sự kiện, quyết định tham gia |
| User task | Xem thông tin tổng quan sự kiện |
| Tên màn hình | Trang chủ sự kiện |
| Tên file HTML | index.html |
| Chức năng chính | Giới thiệu sự kiện, lịch trình nổi bật, CTA đăng nhập/đăng ký |
| CRUD | R |
| Entity sử dụng | events |
| JavaScript interaction | Slider/carousel session nổi bật, smooth-scroll, toggle menu mobile |
| AI feature | Không |
| Loading state | Có (skeleton banner) |
| Empty state | Có (chưa có event) |
| Error state | Có (lỗi tải dữ liệu event) |
| Success state | — |
| Responsive requirement | Desktop/Tablet/Mobile |
| Người phụ trách | SV3 |
| OBS cần quay | Có |
| Mức độ | Bắt buộc |
| Ghi chú | Cổng vào chung cho mọi vai trò \| Màn hỗ trợ dùng chung; chưa cần mockup riêng ở giai đoạn 12 màn core |

**Dữ liệu triển khai:** `eventpulse_events`, `eventpulse_sessions`, `eventpulse_users`, `eventpulse_rooms`, `eventpulse_userTickets`.

| Minh chứng | Tình trạng |
| --- | --- |
| Tên / MSSV / GitHub của người chịu trách nhiệm | Chưa xác minh |
| Link mockup/frame + ngày tạo thực | Chưa xác minh |
| Link task + Task ID | Chưa xác minh |
| Branch + commit triển khai của thành viên | Chưa xác minh |
| PR + người review + ngày merge | Chưa xác minh |
| Video OBS + ngày quay + thời lượng | Chưa xác minh |
| Test nghiệp vụ từng action | Có test một phần trong báo cáo chung; cần thành viên xác nhận ca của màn |
| 320px / 375px / zoom 200% / Tab / Esc / contrast | Chưa đủ bằng chứng toàn màn |
| Kết luận | Đã triển khai; chờ hoàn tất minh chứng và DoD |

### S2 — Đăng nhập

| Trường nguồn | Giá trị |
| --- | --- |
| ID | S2 |
| Role | Dùng chung |
| User goal | Truy cập hệ thống theo đúng vai trò |
| User task | Đăng nhập |
| Tên màn hình | Đăng nhập |
| Tên file HTML | login.html |
| Chức năng chính | Xác thực tài khoản, phân luồng theo role |
| CRUD | R |
| Entity sử dụng | (auth - không có entity CRUD) |
| JavaScript interaction | Validate email/mật khẩu, hiện/ẩn mật khẩu, submit async, redirect theo role |
| AI feature | Không |
| Loading state | Có (đang xác thực) |
| Empty state | — |
| Error state | Có (sai tài khoản/mật khẩu) |
| Success state | Có (đăng nhập thành công → điều hướng) |
| Responsive requirement | Desktop/Tablet/Mobile |
| Người phụ trách | SV1 |
| OBS cần quay | Có |
| Mức độ | Bắt buộc |
| Ghi chú | Màn hỗ trợ dùng chung; chưa cần mockup riêng ở giai đoạn 12 màn core |

**Dữ liệu triển khai:** `eventpulse_users`, `eventpulse_currentUser`.

| Minh chứng | Tình trạng |
| --- | --- |
| Tên / MSSV / GitHub của người chịu trách nhiệm | Chưa xác minh |
| Link mockup/frame + ngày tạo thực | Chưa xác minh |
| Link task + Task ID | Chưa xác minh |
| Branch + commit triển khai của thành viên | Chưa xác minh |
| PR + người review + ngày merge | Chưa xác minh |
| Video OBS + ngày quay + thời lượng | Chưa xác minh |
| Test nghiệp vụ từng action | Có test một phần trong báo cáo chung; cần thành viên xác nhận ca của màn |
| 320px / 375px / zoom 200% / Tab / Esc / contrast | Chưa đủ bằng chứng toàn màn |
| Kết luận | Đã triển khai; chờ hoàn tất minh chứng và DoD |

### S3 — Đăng ký

| Trường nguồn | Giá trị |
| --- | --- |
| ID | S3 |
| Role | Dùng chung |
| User goal | Tạo tài khoản mới để tham gia sự kiện |
| User task | Đăng ký (Attendee/Speaker) |
| Tên màn hình | Đăng ký |
| Tên file HTML | register.html |
| Chức năng chính | Tạo tài khoản mới, chọn vai trò Attendee/Speaker |
| CRUD | C |
| Entity sử dụng | users |
| JavaScript interaction | Validate realtime (email trùng, mật khẩu khớp), hiển thị độ mạnh mật khẩu |
| AI feature | Không |
| Loading state | Có (đang tạo tài khoản) |
| Empty state | — |
| Error state | Có (email đã tồn tại, dữ liệu không hợp lệ) |
| Success state | Có (tạo tài khoản thành công) |
| Responsive requirement | Desktop/Tablet/Mobile |
| Người phụ trách | SV1 |
| OBS cần quay | Có |
| Mức độ | Bắt buộc |
| Ghi chú | Màn hỗ trợ dùng chung; chưa cần mockup riêng ở giai đoạn 12 màn core |

**Dữ liệu triển khai:** `eventpulse_users`, `eventpulse_currentUser`.

| Minh chứng | Tình trạng |
| --- | --- |
| Tên / MSSV / GitHub của người chịu trách nhiệm | Chưa xác minh |
| Link mockup/frame + ngày tạo thực | Chưa xác minh |
| Link task + Task ID | Chưa xác minh |
| Branch + commit triển khai của thành viên | Chưa xác minh |
| PR + người review + ngày merge | Chưa xác minh |
| Video OBS + ngày quay + thời lượng | Chưa xác minh |
| Test nghiệp vụ từng action | Có test một phần trong báo cáo chung; cần thành viên xác nhận ca của màn |
| 320px / 375px / zoom 200% / Tab / Esc / contrast | Chưa đủ bằng chứng toàn màn |
| Kết luận | Đã triển khai; chờ hoàn tất minh chứng và DoD |

### S4 — Quên mật khẩu

| Trường nguồn | Giá trị |
| --- | --- |
| ID | S4 |
| Role | Dùng chung |
| User goal | Khôi phục quyền truy cập khi quên mật khẩu |
| User task | Yêu cầu đặt lại mật khẩu |
| Tên màn hình | Quên mật khẩu |
| Tên file HTML | forgot-password.html |
| Chức năng chính | Gửi yêu cầu reset mật khẩu qua email giả lập |
| CRUD | U |
| Entity sử dụng | users |
| JavaScript interaction | Validate định dạng email, đếm ngược gửi lại mã |
| AI feature | Không |
| Loading state | Có (đang gửi yêu cầu) |
| Empty state | — |
| Error state | Có (email không tồn tại) |
| Success state | Có (đã gửi liên kết đặt lại) |
| Responsive requirement | Desktop/Tablet/Mobile |
| Người phụ trách | SV1 |
| OBS cần quay | Có |
| Mức độ | Nên có |
| Ghi chú | Màn hỗ trợ dùng chung; chưa cần mockup riêng ở giai đoạn 12 màn core |

**Dữ liệu triển khai:** `eventpulse_users`.

| Minh chứng | Tình trạng |
| --- | --- |
| Tên / MSSV / GitHub của người chịu trách nhiệm | Chưa xác minh |
| Link mockup/frame + ngày tạo thực | Chưa xác minh |
| Link task + Task ID | Chưa xác minh |
| Branch + commit triển khai của thành viên | Chưa xác minh |
| PR + người review + ngày merge | Chưa xác minh |
| Video OBS + ngày quay + thời lượng | Chưa xác minh |
| Test nghiệp vụ từng action | Có test một phần trong báo cáo chung; cần thành viên xác nhận ca của màn |
| 320px / 375px / zoom 200% / Tab / Esc / contrast | Chưa đủ bằng chứng toàn màn |
| Kết luận | Đã triển khai; chờ hoàn tất minh chứng và DoD |

### S5 — Hồ sơ cá nhân (Attendee/Organizer/Admin)

| Trường nguồn | Giá trị |
| --- | --- |
| ID | S5 |
| Role | Dùng chung |
| User goal | Quản lý thông tin cá nhân |
| User task | Xem/sửa hồ sơ |
| Tên màn hình | Hồ sơ cá nhân (Attendee/Organizer/Admin) |
| Tên file HTML | profile.html |
| Chức năng chính | Xem & cập nhật thông tin cá nhân, đổi avatar |
| CRUD | R/U |
| Entity sử dụng | users |
| JavaScript interaction | Validate form, preview avatar trước khi lưu, toast xác nhận |
| AI feature | Không |
| Loading state | Có (đang tải hồ sơ) |
| Empty state | — |
| Error state | Có (lưu thất bại) |
| Success state | Có (cập nhật thành công) |
| Responsive requirement | Desktop/Tablet/Mobile |
| Người phụ trách | SV1 |
| OBS cần quay | Có |
| Mức độ | Bắt buộc |
| Ghi chú | Speaker dùng speaker-profile.html riêng \| Màn hỗ trợ dùng chung; chưa cần mockup riêng ở giai đoạn 12 màn core |

**Dữ liệu triển khai:** `eventpulse_users`, `eventpulse_currentUser`.

| Minh chứng | Tình trạng |
| --- | --- |
| Tên / MSSV / GitHub của người chịu trách nhiệm | Chưa xác minh |
| Link mockup/frame + ngày tạo thực | Chưa xác minh |
| Link task + Task ID | Chưa xác minh |
| Branch + commit triển khai của thành viên | Chưa xác minh |
| PR + người review + ngày merge | Chưa xác minh |
| Video OBS + ngày quay + thời lượng | Chưa xác minh |
| Test nghiệp vụ từng action | Có test một phần trong báo cáo chung; cần thành viên xác nhận ca của màn |
| 320px / 375px / zoom 200% / Tab / Esc / contrast | Chưa đủ bằng chứng toàn màn |
| Kết luận | Đã triển khai; chờ hoàn tất minh chứng và DoD |

### S6 — Cài đặt

| Trường nguồn | Giá trị |
| --- | --- |
| ID | S6 |
| Role | Dùng chung |
| User goal | Tuỳ chỉnh trải nghiệm sử dụng |
| User task | Cấu hình tài khoản |
| Tên màn hình | Cài đặt |
| Tên file HTML | settings.html |
| Chức năng chính | Đổi mật khẩu, ngôn ngữ, chế độ tối/sáng, tuỳ chọn thông báo |
| CRUD | U |
| Entity sử dụng | users |
| JavaScript interaction | Toggle switch, lưu tức thời (auto-save), validate đổi mật khẩu |
| AI feature | Không |
| Loading state | — |
| Empty state | — |
| Error state | Có (lưu cài đặt thất bại) |
| Success state | Có (đã lưu cài đặt) |
| Responsive requirement | Desktop/Tablet/Mobile |
| Người phụ trách | SV2 |
| OBS cần quay | Có |
| Mức độ | Nên có |
| Ghi chú | Màn hỗ trợ dùng chung; chưa cần mockup riêng ở giai đoạn 12 màn core |

**Dữ liệu triển khai:** `eventpulse_settings`, `eventpulse_users`.

| Minh chứng | Tình trạng |
| --- | --- |
| Tên / MSSV / GitHub của người chịu trách nhiệm | Chưa xác minh |
| Link mockup/frame + ngày tạo thực | Chưa xác minh |
| Link task + Task ID | Chưa xác minh |
| Branch + commit triển khai của thành viên | Chưa xác minh |
| PR + người review + ngày merge | Chưa xác minh |
| Video OBS + ngày quay + thời lượng | Chưa xác minh |
| Test nghiệp vụ từng action | Có test một phần trong báo cáo chung; cần thành viên xác nhận ca của màn |
| 320px / 375px / zoom 200% / Tab / Esc / contrast | Chưa đủ bằng chứng toàn màn |
| Kết luận | Đã triển khai; chờ hoàn tất minh chứng và DoD |

### S7 — Thông báo

| Trường nguồn | Giá trị |
| --- | --- |
| ID | S7 |
| Role | Dùng chung |
| User goal | Nắm bắt kịp thời thay đổi liên quan đến mình |
| User task | Xem danh sách thông báo |
| Tên màn hình | Thông báo |
| Tên file HTML | notifications.html |
| Chức năng chính | Tổng hợp thông báo hệ thống + cảnh báo từ Ban tổ chức (đổi phòng/giờ) |
| CRUD | R/U |
| Entity sử dụng | event_alerts, notifications |
| JavaScript interaction | Đánh dấu đã đọc, lọc theo loại, realtime badge counter (mock) |
| AI feature | Không |
| Loading state | Có (đang tải thông báo) |
| Empty state | Có (chưa có thông báo) |
| Error state | Có (tải thông báo lỗi) |
| Success state | Có (đánh dấu đã đọc thành công) |
| Responsive requirement | Desktop/Tablet/Mobile |
| Người phụ trách | SV3 |
| OBS cần quay | Có |
| Mức độ | Bắt buộc |
| Ghi chú | Dùng chung Attendee + Speaker; dữ liệu do Organizer tạo ở Event Alerts \| Màn hỗ trợ dùng chung; chưa cần mockup riêng ở giai đoạn 12 màn core |

**Dữ liệu triển khai:** `eventpulse_eventAlerts`, `eventpulse_notifications`.

| Minh chứng | Tình trạng |
| --- | --- |
| Tên / MSSV / GitHub của người chịu trách nhiệm | Chưa xác minh |
| Link mockup/frame + ngày tạo thực | Chưa xác minh |
| Link task + Task ID | Chưa xác minh |
| Branch + commit triển khai của thành viên | Chưa xác minh |
| PR + người review + ngày merge | Chưa xác minh |
| Video OBS + ngày quay + thời lượng | Chưa xác minh |
| Test nghiệp vụ từng action | Có test một phần trong báo cáo chung; cần thành viên xác nhận ca của màn |
| 320px / 375px / zoom 200% / Tab / Esc / contrast | Chưa đủ bằng chứng toàn màn |
| Kết luận | Đã triển khai; chờ hoàn tất minh chứng và DoD |

### S8 — Không có quyền truy cập

| Trường nguồn | Giá trị |
| --- | --- |
| ID | S8 |
| Role | Dùng chung |
| User goal | Ngăn truy cập trái phép ngoài quyền hạn |
| User task | Xử lý khi vào nhầm khu vực không có quyền |
| Tên màn hình | Không có quyền truy cập |
| Tên file HTML | 403.html |
| Chức năng chính | Thông báo không đủ quyền, hướng dẫn quay lại trang phù hợp với role |
| CRUD | — |
| Entity sử dụng | — |
| JavaScript interaction | Tự động điều hướng theo role sau X giây (đếm ngược) |
| AI feature | Không |
| Loading state | — |
| Empty state | — |
| Error state | — |
| Success state | — |
| Responsive requirement | Desktop/Tablet/Mobile |
| Người phụ trách | SV3 |
| OBS cần quay | Có |
| Mức độ | Nên có |
| Ghi chú | Màn hỗ trợ dùng chung; chưa cần mockup riêng ở giai đoạn 12 màn core |

**Dữ liệu triển khai:** `eventpulse_currentUser`.

| Minh chứng | Tình trạng |
| --- | --- |
| Tên / MSSV / GitHub của người chịu trách nhiệm | Chưa xác minh |
| Link mockup/frame + ngày tạo thực | Chưa xác minh |
| Link task + Task ID | Chưa xác minh |
| Branch + commit triển khai của thành viên | Chưa xác minh |
| PR + người review + ngày merge | Chưa xác minh |
| Video OBS + ngày quay + thời lượng | Chưa xác minh |
| Test nghiệp vụ từng action | Có test một phần trong báo cáo chung; cần thành viên xác nhận ca của màn |
| 320px / 375px / zoom 200% / Tab / Esc / contrast | Chưa đủ bằng chứng toàn màn |
| Kết luận | Đã triển khai; chờ hoàn tất minh chứng và DoD |

### S9 — Không tìm thấy trang

| Trường nguồn | Giá trị |
| --- | --- |
| ID | S9 |
| Role | Dùng chung |
| User goal | Xử lý khi truy cập đường dẫn không tồn tại |
| User task | Xử lý lỗi điều hướng |
| Tên màn hình | Không tìm thấy trang |
| Tên file HTML | 404.html |
| Chức năng chính | Thông báo trang không tồn tại, gợi ý quay về trang chủ/dashboard |
| CRUD | — |
| Entity sử dụng | — |
| JavaScript interaction | Nút quay lại trang trước (dùng history API) |
| AI feature | Không |
| Loading state | — |
| Empty state | — |
| Error state | — |
| Success state | — |
| Responsive requirement | Desktop/Tablet/Mobile |
| Người phụ trách | SV3 |
| OBS cần quay | Có |
| Mức độ | Nên có |
| Ghi chú | Màn hỗ trợ dùng chung; chưa cần mockup riêng ở giai đoạn 12 màn core |

**Dữ liệu triển khai:** không CRUD.

| Minh chứng | Tình trạng |
| --- | --- |
| Tên / MSSV / GitHub của người chịu trách nhiệm | Chưa xác minh |
| Link mockup/frame + ngày tạo thực | Chưa xác minh |
| Link task + Task ID | Chưa xác minh |
| Branch + commit triển khai của thành viên | Chưa xác minh |
| PR + người review + ngày merge | Chưa xác minh |
| Video OBS + ngày quay + thời lượng | Chưa xác minh |
| Test nghiệp vụ từng action | Có test một phần trong báo cáo chung; cần thành viên xác nhận ca của màn |
| 320px / 375px / zoom 200% / Tab / Esc / contrast | Chưa đủ bằng chứng toàn màn |
| Kết luận | Đã triển khai; chờ hoàn tất minh chứng và DoD |

### A1 — Danh mục Session

| Trường nguồn | Giá trị |
| --- | --- |
| ID | A1 |
| Role | Người tham dự |
| User goal | Chọn được session phù hợp giữa agenda dài |
| User task | Duyệt & tìm kiếm session |
| Tên màn hình | Danh mục Session |
| Tên file HTML | attendee-session-catalog.html |
| Chức năng chính | Liệt kê toàn bộ session, tìm kiếm theo tên/diễn giả, lọc theo track/giờ/phòng |
| CRUD | R |
| Entity sử dụng | sessions, speakers, rooms |
| JavaScript interaction | Search debounce, filter đa tiêu chí, sort, render card/list, nút 'Thêm vào agenda' |
| AI feature | Không |
| Loading state | Có (đang tải danh sách) |
| Empty state | Có (không có session khớp bộ lọc) |
| Error state | Có (lỗi tải dữ liệu) |
| Success state | — |
| Responsive requirement | Desktop/Tablet/Mobile |
| Người phụ trách | SV1 |
| OBS cần quay | Có |
| Mức độ | Bắt buộc |
| Ghi chú | Canva Desktop: Đã có \| Mobile representative: Đã có |

**Dữ liệu triển khai:** `eventpulse_sessions`, `eventpulse_users`, `eventpulse_rooms`.

| Minh chứng | Tình trạng |
| --- | --- |
| Tên / MSSV / GitHub của người chịu trách nhiệm | Chưa xác minh |
| Link mockup/frame + ngày tạo thực | Chưa xác minh |
| Link task + Task ID | Chưa xác minh |
| Branch + commit triển khai của thành viên | Chưa xác minh |
| PR + người review + ngày merge | Chưa xác minh |
| Video OBS + ngày quay + thời lượng | Chưa xác minh |
| Test nghiệp vụ từng action | Có test một phần trong báo cáo chung; cần thành viên xác nhận ca của màn |
| 320px / 375px / zoom 200% / Tab / Esc / contrast | Chưa đủ bằng chứng toàn màn |
| Kết luận | Đã triển khai; chờ hoàn tất minh chứng và DoD |

### A2 — Chi tiết Session

| Trường nguồn | Giá trị |
| --- | --- |
| ID | A2 |
| Role | Người tham dự |
| User goal | Hiểu rõ nội dung trước khi thêm vào lịch |
| User task | Xem chi tiết session |
| Tên màn hình | Chi tiết Session |
| Tên file HTML | attendee-session-detail.html |
| Chức năng chính | Xem mô tả, diễn giả, phòng, sức chứa còn lại, nút thêm agenda |
| CRUD | R |
| Entity sử dụng | sessions, speakers, rooms |
| JavaScript interaction | Tab mô tả/diễn giả/tài liệu, cập nhật sức chứa realtime (mock), modal xác nhận thêm |
| AI feature | Không |
| Loading state | Có (đang tải chi tiết) |
| Empty state | — |
| Error state | Có (session không tồn tại/đã bị huỷ) |
| Success state | Có (đã thêm vào agenda) |
| Responsive requirement | Desktop/Tablet/Mobile |
| Người phụ trách | SV1 |
| OBS cần quay | Có |
| Mức độ | Có thể gộp |
| Ghi chú | Có thể gộp thành modal trong Session Catalog nếu rút gọn phạm vi \| Chưa có mockup Canva riêng; triển khai theo User Flow/Design System khi code |

**Dữ liệu triển khai:** `eventpulse_sessions`, `eventpulse_users`, `eventpulse_rooms`, `eventpulse_agendas`, `eventpulse_notifications`.

| Minh chứng | Tình trạng |
| --- | --- |
| Tên / MSSV / GitHub của người chịu trách nhiệm | Chưa xác minh |
| Link mockup/frame + ngày tạo thực | Chưa xác minh |
| Link task + Task ID | Chưa xác minh |
| Branch + commit triển khai của thành viên | Chưa xác minh |
| PR + người review + ngày merge | Chưa xác minh |
| Video OBS + ngày quay + thời lượng | Chưa xác minh |
| Test nghiệp vụ từng action | Có test một phần trong báo cáo chung; cần thành viên xác nhận ca của màn |
| 320px / 375px / zoom 200% / Tab / Esc / contrast | Chưa đủ bằng chứng toàn màn |
| Kết luận | Đã triển khai; chờ hoàn tất minh chứng và DoD |

### A3 — Agenda của tôi

| Trường nguồn | Giá trị |
| --- | --- |
| ID | A3 |
| Role | Người tham dự |
| User goal | Có một lịch trình cá nhân không trùng giờ |
| User task | Tạo & quản lý agenda cá nhân |
| Tên màn hình | Agenda của tôi |
| Tên file HTML | attendee-my-agenda.html |
| Chức năng chính | Thêm/xoá/sắp xếp session trong lịch cá nhân theo dạng timeline theo ngày |
| CRUD | C/R/U |
| Entity sử dụng | agendas, sessions |
| JavaScript interaction | Kéo-thả sắp xếp, phát hiện trùng giờ realtime, xuất/in agenda, xoá có xác nhận |
| AI feature | Không |
| Loading state | Có (đang tải agenda) |
| Empty state | Có (agenda trống) |
| Error state | Có (không lưu được thay đổi) |
| Success state | Có (đã cập nhật agenda) |
| Responsive requirement | Desktop/Tablet/Mobile |
| Người phụ trách | SV1 |
| OBS cần quay | Có |
| Mức độ | Bắt buộc |
| Ghi chú | Kích hoạt AI-2 khi phát hiện trùng giờ \| Canva Desktop: Đã có \| Mobile representative: Đã có |

**Dữ liệu triển khai:** `eventpulse_agendas`, `eventpulse_sessions`.

| Minh chứng | Tình trạng |
| --- | --- |
| Tên / MSSV / GitHub của người chịu trách nhiệm | Chưa xác minh |
| Link mockup/frame + ngày tạo thực | Chưa xác minh |
| Link task + Task ID | Chưa xác minh |
| Branch + commit triển khai của thành viên | Chưa xác minh |
| PR + người review + ngày merge | Chưa xác minh |
| Video OBS + ngày quay + thời lượng | Chưa xác minh |
| Test nghiệp vụ từng action | Có test một phần trong báo cáo chung; cần thành viên xác nhận ca của màn |
| 320px / 375px / zoom 200% / Tab / Esc / contrast | Chưa đủ bằng chứng toàn màn |
| Kết luận | Đã triển khai; chờ hoàn tất minh chứng và DoD |

### A4 — Trợ lý gợi ý thay thế (AI)

| Trường nguồn | Giá trị |
| --- | --- |
| ID | A4 |
| Role | Người tham dự |
| User goal | Giải quyết nhanh khi 2 session bị trùng giờ |
| User task | Xử lý xung đột lịch |
| Tên màn hình | Trợ lý gợi ý thay thế (AI) |
| Tên file HTML | attendee-schedule-conflict.html |
| Chức năng chính | AI phân tích session trùng giờ trong agenda và đề xuất session thay thế phù hợp |
| CRUD | R/U |
| Entity sử dụng | agendas, sessions |
| JavaScript interaction | Hiển thị 2 session xung đột cạnh nhau, nút chấp nhận gợi ý áp dụng ngay vào agenda |
| AI feature | AI-2: Conflict Resolver |
| Loading state | Có (AI đang phân tích xung đột) |
| Empty state | Có (không có session thay thế phù hợp) |
| Error state | Có ('Không thể xử lý yêu cầu lúc này' + Thử lại) |
| Success state | Có (đã áp dụng session thay thế) |
| Responsive requirement | Desktop/Tablet/Mobile |
| Người phụ trách | SV2 |
| OBS cần quay | Có |
| Mức độ | Bắt buộc |
| Ghi chú | Luồng: Nhập→Xử lý→Kết quả→Giải thích→Chấp nhận/Sửa/Từ chối/Tạo lại/Lưu \| Chưa có mockup Canva riêng; triển khai theo User Flow/Design System khi code |

**Dữ liệu triển khai:** `eventpulse_agendas`, `eventpulse_sessions`.

| Minh chứng | Tình trạng |
| --- | --- |
| Tên / MSSV / GitHub của người chịu trách nhiệm | Chưa xác minh |
| Link mockup/frame + ngày tạo thực | Chưa xác minh |
| Link task + Task ID | Chưa xác minh |
| Branch + commit triển khai của thành viên | Chưa xác minh |
| PR + người review + ngày merge | Chưa xác minh |
| Video OBS + ngày quay + thời lượng | Chưa xác minh |
| Test nghiệp vụ từng action | Có test một phần trong báo cáo chung; cần thành viên xác nhận ca của màn |
| 320px / 375px / zoom 200% / Tab / Esc / contrast | Chưa đủ bằng chứng toàn màn |
| Kết luận | Đã triển khai; chờ hoàn tất minh chứng và DoD |

### A5 — Gợi ý cho bạn (AI)

| Trường nguồn | Giá trị |
| --- | --- |
| ID | A5 |
| Role | Người tham dự |
| User goal | Khám phá session phù hợp sở thích mà chưa nghĩ tới |
| User task | Nhận đề xuất session cá nhân hoá |
| Tên màn hình | Gợi ý cho bạn (AI) |
| Tên file HTML | attendee-recommendations.html |
| Chức năng chính | AI đề xuất danh sách session dựa trên sở thích/lịch sử đã xem |
| CRUD | R |
| Entity sử dụng | sessions, agendas |
| JavaScript interaction | Nút 'Vì sao gợi ý này', làm mới gợi ý, thêm thẳng vào agenda |
| AI feature | AI-1: Agenda Recommender |
| Loading state | Có (đang tạo đề xuất) |
| Empty state | Có ('Không đủ dữ liệu để đưa ra đề xuất') |
| Error state | Có (AI lỗi xử lý, cho phép Thử lại/Dùng thủ công) |
| Success state | Có (đã thêm gợi ý vào agenda) |
| Responsive requirement | Desktop/Tablet/Mobile |
| Người phụ trách | SV2 |
| OBS cần quay | Có |
| Mức độ | Bắt buộc |
| Ghi chú | Luồng AI đầy đủ theo mục 12 \| Chưa có mockup Canva riêng; triển khai theo User Flow/Design System khi code |

**Dữ liệu triển khai:** `eventpulse_sessions`, `eventpulse_agendas`.

| Minh chứng | Tình trạng |
| --- | --- |
| Tên / MSSV / GitHub của người chịu trách nhiệm | Chưa xác minh |
| Link mockup/frame + ngày tạo thực | Chưa xác minh |
| Link task + Task ID | Chưa xác minh |
| Branch + commit triển khai của thành viên | Chưa xác minh |
| PR + người review + ngày merge | Chưa xác minh |
| Video OBS + ngày quay + thời lượng | Chưa xác minh |
| Test nghiệp vụ từng action | Có test một phần trong báo cáo chung; cần thành viên xác nhận ca của màn |
| 320px / 375px / zoom 200% / Tab / Esc / contrast | Chưa đủ bằng chứng toàn màn |
| Kết luận | Đã triển khai; chờ hoàn tất minh chứng và DoD |

### A6 — Phản hồi Session

| Trường nguồn | Giá trị |
| --- | --- |
| ID | A6 |
| Role | Người tham dự |
| User goal | Chia sẻ trải nghiệm để cải thiện sự kiện |
| User task | Đánh giá session đã tham dự |
| Tên màn hình | Phản hồi Session |
| Tên file HTML | attendee-session-feedback.html |
| Chức năng chính | Đánh giá sao, viết nhận xét, sửa/xoá đánh giá của mình |
| CRUD | C/R/U/D |
| Entity sử dụng | feedback |
| JavaScript interaction | Rating component, validate độ dài nhận xét, sửa/xoá có xác nhận |
| AI feature | Không |
| Loading state | Có (đang gửi đánh giá) |
| Empty state | Có (chưa từng đánh giá session nào) |
| Error state | Có (gửi đánh giá thất bại) |
| Success state | Có (đã lưu đánh giá) |
| Responsive requirement | Desktop/Tablet/Mobile |
| Người phụ trách | SV1 |
| OBS cần quay | Có |
| Mức độ | Bắt buộc |
| Ghi chú | Chỉ hiển thị với session đã diễn ra \| Canva Desktop: Đã có |

**Dữ liệu triển khai:** `eventpulse_feedback`, `eventpulse_sessions`, `eventpulse_userTickets`.

| Minh chứng | Tình trạng |
| --- | --- |
| Tên / MSSV / GitHub của người chịu trách nhiệm | Chưa xác minh |
| Link mockup/frame + ngày tạo thực | Chưa xác minh |
| Link task + Task ID | Chưa xác minh |
| Branch + commit triển khai của thành viên | Chưa xác minh |
| PR + người review + ngày merge | Chưa xác minh |
| Video OBS + ngày quay + thời lượng | Chưa xác minh |
| Test nghiệp vụ từng action | Có test một phần trong báo cáo chung; cần thành viên xác nhận ca của màn |
| 320px / 375px / zoom 200% / Tab / Esc / contrast | Chưa đủ bằng chứng toàn màn |
| Kết luận | Đã triển khai; chờ hoàn tất minh chứng và DoD |

### A7 — Vé của tôi

| Trường nguồn | Giá trị |
| --- | --- |
| ID | A7 |
| Role | Người tham dự |
| User goal | Xác nhận quyền tham dự tại sự kiện |
| User task | Xem vé & check-in |
| Tên màn hình | Vé của tôi |
| Tên file HTML | attendee-my-ticket.html |
| Chức năng chính | Hiển thị mã vé/QR, loại vé, trạng thái check-in |
| CRUD | R |
| Entity sử dụng | tickets |
| JavaScript interaction | Sinh mã QR (mock), tải vé PDF/ảnh, cập nhật trạng thái check-in realtime (mock) |
| AI feature | Không |
| Loading state | Có (đang tải vé) |
| Empty state | Có (chưa có vé) |
| Error state | Có (vé không hợp lệ/hết hạn) |
| Success state | Có (check-in thành công) |
| Responsive requirement | Desktop/Tablet/Mobile |
| Người phụ trách | SV1 |
| OBS cần quay | Có |
| Mức độ | Bắt buộc |
| Ghi chú | Chưa có mockup Canva riêng; triển khai theo User Flow/Design System khi code |

**Dữ liệu triển khai:** `eventpulse_userTickets`, `eventpulse_ticketTypes`, `eventpulse_events`.

| Minh chứng | Tình trạng |
| --- | --- |
| Tên / MSSV / GitHub của người chịu trách nhiệm | Chưa xác minh |
| Link mockup/frame + ngày tạo thực | Chưa xác minh |
| Link task + Task ID | Chưa xác minh |
| Branch + commit triển khai của thành viên | Chưa xác minh |
| PR + người review + ngày merge | Chưa xác minh |
| Video OBS + ngày quay + thời lượng | Chưa xác minh |
| Test nghiệp vụ từng action | Có test một phần trong báo cáo chung; cần thành viên xác nhận ca của màn |
| 320px / 375px / zoom 200% / Tab / Esc / contrast | Chưa đủ bằng chứng toàn màn |
| Kết luận | Đã triển khai; chờ hoàn tất minh chứng và DoD |

### SP1 — Hồ sơ diễn giả

| Trường nguồn | Giá trị |
| --- | --- |
| ID | SP1 |
| Role | Diễn giả |
| User goal | Được người tham dự và ban tổ chức nhận diện đúng |
| User task | Quản lý hồ sơ diễn giả |
| Tên màn hình | Hồ sơ diễn giả |
| Tên file HTML | speaker-profile.html |
| Chức năng chính | Xem/sửa tiểu sử, ảnh, mạng xã hội, lĩnh vực chuyên môn |
| CRUD | R/U |
| Entity sử dụng | speakers |
| JavaScript interaction | Validate form, preview ảnh đại diện, đếm ký tự tiểu sử |
| AI feature | Không |
| Loading state | Có (đang tải hồ sơ) |
| Empty state | — |
| Error state | Có (lưu thất bại) |
| Success state | Có (cập nhật thành công) |
| Responsive requirement | Desktop/Tablet/Mobile |
| Người phụ trách | SV2 |
| OBS cần quay | Có |
| Mức độ | Bắt buộc |
| Ghi chú | Canva Desktop: Đã có |

**Dữ liệu triển khai:** `eventpulse_users`.

| Minh chứng | Tình trạng |
| --- | --- |
| Tên / MSSV / GitHub của người chịu trách nhiệm | Chưa xác minh |
| Link mockup/frame + ngày tạo thực | Chưa xác minh |
| Link task + Task ID | Chưa xác minh |
| Branch + commit triển khai của thành viên | Chưa xác minh |
| PR + người review + ngày merge | Chưa xác minh |
| Video OBS + ngày quay + thời lượng | Chưa xác minh |
| Test nghiệp vụ từng action | Có test một phần trong báo cáo chung; cần thành viên xác nhận ca của màn |
| 320px / 375px / zoom 200% / Tab / Esc / contrast | Chưa đủ bằng chứng toàn màn |
| Kết luận | Đã triển khai; chờ hoàn tất minh chứng và DoD |

### SP2 — Session của tôi

| Trường nguồn | Giá trị |
| --- | --- |
| ID | SP2 |
| Role | Diễn giả |
| User goal | Theo dõi và đề xuất session của mình |
| User task | Quản lý session của tôi |
| Tên màn hình | Session của tôi |
| Tên file HTML | speaker-my-session.html |
| Chức năng chính | Danh sách session đã đăng ký, đề xuất session mới, xem trạng thái duyệt |
| CRUD | C/R/U |
| Entity sử dụng | sessions |
| JavaScript interaction | Filter theo trạng thái (chờ duyệt/đã duyệt/từ chối), form đề xuất session mới có validate |
| AI feature | Không |
| Loading state | Có (đang tải danh sách) |
| Empty state | Có (chưa có session nào) |
| Error state | Có (gửi đề xuất thất bại) |
| Success state | Có (đã gửi đề xuất/cập nhật) |
| Responsive requirement | Desktop/Tablet/Mobile |
| Người phụ trách | SV2 |
| OBS cần quay | Có |
| Mức độ | Bắt buộc |
| Ghi chú | Canva Desktop: Đã có |

**Dữ liệu triển khai:** `eventpulse_sessions`, `eventpulse_users`.

| Minh chứng | Tình trạng |
| --- | --- |
| Tên / MSSV / GitHub của người chịu trách nhiệm | Chưa xác minh |
| Link mockup/frame + ngày tạo thực | Chưa xác minh |
| Link task + Task ID | Chưa xác minh |
| Branch + commit triển khai của thành viên | Chưa xác minh |
| PR + người review + ngày merge | Chưa xác minh |
| Video OBS + ngày quay + thời lượng | Chưa xác minh |
| Test nghiệp vụ từng action | Có test một phần trong báo cáo chung; cần thành viên xác nhận ca của màn |
| 320px / 375px / zoom 200% / Tab / Esc / contrast | Chưa đủ bằng chứng toàn màn |
| Kết luận | Đã triển khai; chờ hoàn tất minh chứng và DoD |

### SP3 — Chi tiết Session của tôi

| Trường nguồn | Giá trị |
| --- | --- |
| ID | SP3 |
| Role | Diễn giả |
| User goal | Chỉnh sửa nội dung chi tiết cho từng session |
| User task | Chỉnh sửa chi tiết session |
| Tên màn hình | Chi tiết Session của tôi |
| Tên file HTML | speaker-session-detail.html |
| Chức năng chính | Sửa mô tả, thời lượng, mục tiêu buổi nói chuyện; xem lịch sử duyệt |
| CRUD | U |
| Entity sử dụng | sessions |
| JavaScript interaction | Autosave nháp, hiển thị timeline trạng thái (chờ duyệt→duyệt/từ chối) |
| AI feature | Không |
| Loading state | Có (đang tải chi tiết) |
| Empty state | — |
| Error state | Có (không lưu được thay đổi) |
| Success state | Có (đã lưu thay đổi) |
| Responsive requirement | Desktop/Tablet/Mobile |
| Người phụ trách | SV2 |
| OBS cần quay | Có |
| Mức độ | Bắt buộc |
| Ghi chú | Chưa có mockup Canva riêng; triển khai theo User Flow/Design System khi code |

**Dữ liệu triển khai:** `eventpulse_sessions`, `eventpulse_rooms`.

| Minh chứng | Tình trạng |
| --- | --- |
| Tên / MSSV / GitHub của người chịu trách nhiệm | Chưa xác minh |
| Link mockup/frame + ngày tạo thực | Chưa xác minh |
| Link task + Task ID | Chưa xác minh |
| Branch + commit triển khai của thành viên | Chưa xác minh |
| PR + người review + ngày merge | Chưa xác minh |
| Video OBS + ngày quay + thời lượng | Chưa xác minh |
| Test nghiệp vụ từng action | Có test một phần trong báo cáo chung; cần thành viên xác nhận ca của màn |
| 320px / 375px / zoom 200% / Tab / Esc / contrast | Chưa đủ bằng chứng toàn màn |
| Kết luận | Đã triển khai; chờ hoàn tất minh chứng và DoD |

### SP4 — Tài liệu Session

| Trường nguồn | Giá trị |
| --- | --- |
| ID | SP4 |
| Role | Diễn giả |
| User goal | Cung cấp tài liệu chất lượng cho người tham dự |
| User task | Quản lý tài liệu buổi nói chuyện |
| Tên màn hình | Tài liệu Session |
| Tên file HTML | speaker-session-materials.html |
| Chức năng chính | Upload/xoá slide, link tài liệu tham khảo cho từng session |
| CRUD | C/R/U/D |
| Entity sử dụng | sessions.materials |
| JavaScript interaction | Kéo-thả upload (mock), preview tên file/kích thước, xoá có xác nhận |
| AI feature | Không |
| Loading state | Có (đang tải lên) |
| Empty state | Có (chưa có tài liệu) |
| Error state | Có (định dạng/kích thước không hợp lệ) |
| Success state | Có (tải lên thành công) |
| Responsive requirement | Desktop/Tablet/Mobile |
| Người phụ trách | SV2 |
| OBS cần quay | Có |
| Mức độ | Bắt buộc |
| Ghi chú | Canva Desktop: Đã có |

**Dữ liệu triển khai:** `eventpulse_materials`, `eventpulse_sessions`.

| Minh chứng | Tình trạng |
| --- | --- |
| Tên / MSSV / GitHub của người chịu trách nhiệm | Chưa xác minh |
| Link mockup/frame + ngày tạo thực | Chưa xác minh |
| Link task + Task ID | Chưa xác minh |
| Branch + commit triển khai của thành viên | Chưa xác minh |
| PR + người review + ngày merge | Chưa xác minh |
| Video OBS + ngày quay + thời lượng | Chưa xác minh |
| Test nghiệp vụ từng action | Có test một phần trong báo cáo chung; cần thành viên xác nhận ca của màn |
| 320px / 375px / zoom 200% / Tab / Esc / contrast | Chưa đủ bằng chứng toàn màn |
| Kết luận | Đã triển khai; chờ hoàn tất minh chứng và DoD |

### SP5 — Dự báo mức độ quan tâm (AI)

| Trường nguồn | Giá trị |
| --- | --- |
| ID | SP5 |
| Role | Diễn giả |
| User goal | Chuẩn bị tốt hơn cho session đông người |
| User task | Xem dự báo mức độ quan tâm |
| Tên màn hình | Dự báo mức độ quan tâm (AI) |
| Tên file HTML | speaker-interest-forecast.html |
| Chức năng chính | AI dự báo số lượng người tham dự dự kiến dựa trên lượt lưu/agenda mock |
| CRUD | R |
| Entity sử dụng | sessions, agendas |
| JavaScript interaction | Biểu đồ dự báo, nút giải thích lý do dự báo, làm mới dự báo |
| AI feature | AI-3: Interest Forecast |
| Loading state | Có (đang tính toán dự báo) |
| Empty state | Có ('Không đủ dữ liệu để đưa ra đề xuất') |
| Error state | Có ('AI chưa chắc chắn về kết quả này' + Thử lại) |
| Success state | Có (đã cập nhật dự báo mới nhất) |
| Responsive requirement | Desktop/Tablet/Mobile |
| Người phụ trách | SV2 |
| OBS cần quay | Có |
| Mức độ | Bắt buộc |
| Ghi chú | Chưa có mockup Canva riêng; triển khai theo User Flow/Design System khi code |

**Dữ liệu triển khai:** `eventpulse_sessions`, `eventpulse_agendas`.

| Minh chứng | Tình trạng |
| --- | --- |
| Tên / MSSV / GitHub của người chịu trách nhiệm | Chưa xác minh |
| Link mockup/frame + ngày tạo thực | Chưa xác minh |
| Link task + Task ID | Chưa xác minh |
| Branch + commit triển khai của thành viên | Chưa xác minh |
| PR + người review + ngày merge | Chưa xác minh |
| Video OBS + ngày quay + thời lượng | Chưa xác minh |
| Test nghiệp vụ từng action | Có test một phần trong báo cáo chung; cần thành viên xác nhận ca của màn |
| 320px / 375px / zoom 200% / Tab / Esc / contrast | Chưa đủ bằng chứng toàn màn |
| Kết luận | Đã triển khai; chờ hoàn tất minh chứng và DoD |

### SP6 — Phản hồi nhận được

| Trường nguồn | Giá trị |
| --- | --- |
| ID | SP6 |
| Role | Diễn giả |
| User goal | Cải thiện chất lượng bài nói dựa trên phản hồi |
| User task | Xem phản hồi từ người tham dự |
| Tên màn hình | Phản hồi nhận được |
| Tên file HTML | speaker-feedback-overview.html |
| Chức năng chính | Tổng hợp đánh giá sao trung bình & nhận xét theo từng session |
| CRUD | R |
| Entity sử dụng | feedback |
| JavaScript interaction | Biểu đồ phân bố sao, lọc theo session, sắp xếp theo mới nhất |
| AI feature | Không |
| Loading state | Có (đang tải phản hồi) |
| Empty state | Có (chưa có phản hồi) |
| Error state | Có (lỗi tải dữ liệu) |
| Success state | — |
| Responsive requirement | Desktop/Tablet/Mobile |
| Người phụ trách | SV2 |
| OBS cần quay | Có |
| Mức độ | Có thể gộp |
| Ghi chú | Có thể gộp làm tab trong Session của tôi nếu rút gọn phạm vi \| Chưa có mockup Canva riêng; triển khai theo User Flow/Design System khi code |

**Dữ liệu triển khai:** `eventpulse_feedback`, `eventpulse_sessions`.

| Minh chứng | Tình trạng |
| --- | --- |
| Tên / MSSV / GitHub của người chịu trách nhiệm | Chưa xác minh |
| Link mockup/frame + ngày tạo thực | Chưa xác minh |
| Link task + Task ID | Chưa xác minh |
| Branch + commit triển khai của thành viên | Chưa xác minh |
| PR + người review + ngày merge | Chưa xác minh |
| Video OBS + ngày quay + thời lượng | Chưa xác minh |
| Test nghiệp vụ từng action | Có test một phần trong báo cáo chung; cần thành viên xác nhận ca của màn |
| 320px / 375px / zoom 200% / Tab / Esc / contrast | Chưa đủ bằng chứng toàn màn |
| Kết luận | Đã triển khai; chờ hoàn tất minh chứng và DoD |

### O1 — Bảng điều khiển Ban tổ chức

| Trường nguồn | Giá trị |
| --- | --- |
| ID | O1 |
| Role | Ban tổ chức |
| User goal | Nắm tổng quan tình trạng vận hành sự kiện |
| User task | Theo dõi tổng quan sự kiện |
| Tên màn hình | Bảng điều khiển Ban tổ chức |
| Tên file HTML | organizer-dashboard.html |
| Chức năng chính | Tổng số session/phòng, cảnh báo trùng lịch, capacity trung bình |
| CRUD | R |
| Entity sử dụng | sessions, rooms, agendas |
| JavaScript interaction | Biểu đồ tổng quan, cảnh báo nổi khi có xung đột mới |
| AI feature | Không |
| Loading state | Có (đang tải dashboard) |
| Empty state | Có (chưa có dữ liệu sự kiện) |
| Error state | Có (lỗi tải số liệu) |
| Success state | — |
| Responsive requirement | Desktop/Tablet/Mobile |
| Người phụ trách | SV3 |
| OBS cần quay | Có |
| Mức độ | Bắt buộc |
| Ghi chú | Chưa có mockup Canva riêng; triển khai theo User Flow/Design System khi code |

**Dữ liệu triển khai:** `eventpulse_sessions`, `eventpulse_rooms`, `eventpulse_agendas`.

| Minh chứng | Tình trạng |
| --- | --- |
| Tên / MSSV / GitHub của người chịu trách nhiệm | Chưa xác minh |
| Link mockup/frame + ngày tạo thực | Chưa xác minh |
| Link task + Task ID | Chưa xác minh |
| Branch + commit triển khai của thành viên | Chưa xác minh |
| PR + người review + ngày merge | Chưa xác minh |
| Video OBS + ngày quay + thời lượng | Chưa xác minh |
| Test nghiệp vụ từng action | Có test một phần trong báo cáo chung; cần thành viên xác nhận ca của màn |
| 320px / 375px / zoom 200% / Tab / Esc / contrast | Chưa đủ bằng chứng toàn màn |
| Kết luận | Đã triển khai; chờ hoàn tất minh chứng và DoD |

### O2 — Quản lý Session

| Trường nguồn | Giá trị |
| --- | --- |
| ID | O2 |
| Role | Ban tổ chức |
| User goal | Kiểm soát nội dung chương trình sự kiện |
| User task | Duyệt & quản lý session |
| Tên màn hình | Quản lý Session |
| Tên file HTML | organizer-session-management.html |
| Chức năng chính | Danh sách toàn bộ session, lọc theo trạng thái, duyệt/từ chối nhanh |
| CRUD | R/U |
| Entity sử dụng | sessions |
| JavaScript interaction | Bulk action duyệt/từ chối, filter đa tiêu chí, tìm kiếm |
| AI feature | Không |
| Loading state | Có (đang tải danh sách) |
| Empty state | Có (không có session chờ duyệt) |
| Error state | Có (duyệt thất bại) |
| Success state | Có (đã cập nhật trạng thái) |
| Responsive requirement | Desktop/Tablet/Mobile |
| Người phụ trách | SV3 |
| OBS cần quay | Có |
| Mức độ | Bắt buộc |
| Ghi chú | Canva Desktop: Đã có \| Mobile representative: Đã có |

**Dữ liệu triển khai:** `eventpulse_sessions`.

| Minh chứng | Tình trạng |
| --- | --- |
| Tên / MSSV / GitHub của người chịu trách nhiệm | Chưa xác minh |
| Link mockup/frame + ngày tạo thực | Chưa xác minh |
| Link task + Task ID | Chưa xác minh |
| Branch + commit triển khai của thành viên | Chưa xác minh |
| PR + người review + ngày merge | Chưa xác minh |
| Video OBS + ngày quay + thời lượng | Chưa xác minh |
| Test nghiệp vụ từng action | Có test một phần trong báo cáo chung; cần thành viên xác nhận ca của màn |
| 320px / 375px / zoom 200% / Tab / Esc / contrast | Chưa đủ bằng chứng toàn màn |
| Kết luận | Đã triển khai; chờ hoàn tất minh chứng và DoD |

### O3 — Chi tiết duyệt Session

| Trường nguồn | Giá trị |
| --- | --- |
| ID | O3 |
| Role | Ban tổ chức |
| User goal | Sắp xếp session vào đúng phòng, đúng giờ |
| User task | Gán phòng & khung giờ cho session |
| Tên màn hình | Chi tiết duyệt Session |
| Tên file HTML | organizer-session-detail.html |
| Chức năng chính | Gán phòng, khung giờ, sức chứa; ghi lý do khi từ chối |
| CRUD | U |
| Entity sử dụng | sessions, rooms |
| JavaScript interaction | Dropdown chọn phòng/giờ có kiểm tra khả dụng, form lý do từ chối bắt buộc khi từ chối |
| AI feature | Không |
| Loading state | Có (đang lưu phân công) |
| Empty state | — |
| Error state | Có (phòng/giờ đã được dùng) |
| Success state | Có (đã gán phòng/giờ thành công) |
| Responsive requirement | Desktop/Tablet/Mobile |
| Người phụ trách | SV3 |
| OBS cần quay | Có |
| Mức độ | Bắt buộc |
| Ghi chú | Chưa có mockup Canva riêng; triển khai theo User Flow/Design System khi code |

**Dữ liệu triển khai:** `eventpulse_sessions`, `eventpulse_rooms`, `eventpulse_notifications`.

| Minh chứng | Tình trạng |
| --- | --- |
| Tên / MSSV / GitHub của người chịu trách nhiệm | Chưa xác minh |
| Link mockup/frame + ngày tạo thực | Chưa xác minh |
| Link task + Task ID | Chưa xác minh |
| Branch + commit triển khai của thành viên | Chưa xác minh |
| PR + người review + ngày merge | Chưa xác minh |
| Video OBS + ngày quay + thời lượng | Chưa xác minh |
| Test nghiệp vụ từng action | Có test một phần trong báo cáo chung; cần thành viên xác nhận ca của màn |
| 320px / 375px / zoom 200% / Tab / Esc / contrast | Chưa đủ bằng chứng toàn màn |
| Kết luận | Đã triển khai; chờ hoàn tất minh chứng và DoD |

### O4 — Quản lý Phòng

| Trường nguồn | Giá trị |
| --- | --- |
| ID | O4 |
| Role | Ban tổ chức |
| User goal | Sử dụng hiệu quả cơ sở vật chất sự kiện |
| User task | Quản lý phòng tổ chức |
| Tên màn hình | Quản lý Phòng |
| Tên file HTML | organizer-room-management.html |
| Chức năng chính | Thêm/sửa/lưu trữ phòng, sức chứa, thiết bị đi kèm |
| CRUD | C/R/U |
| Entity sử dụng | rooms |
| JavaScript interaction | Form validate sức chứa > 0, tìm kiếm phòng, badge trạng thái đang dùng/trống |
| AI feature | Không |
| Loading state | Có (đang tải danh sách phòng) |
| Empty state | Có (chưa có phòng nào) |
| Error state | Có (lưu phòng thất bại, trùng tên) |
| Success state | Có (đã lưu phòng) |
| Responsive requirement | Desktop/Tablet/Mobile |
| Người phụ trách | SV3 |
| OBS cần quay | Có |
| Mức độ | Bắt buộc |
| Ghi chú | Canva Desktop: Đã có |

**Dữ liệu triển khai:** `eventpulse_rooms`, `eventpulse_sessions`.

| Minh chứng | Tình trạng |
| --- | --- |
| Tên / MSSV / GitHub của người chịu trách nhiệm | Chưa xác minh |
| Link mockup/frame + ngày tạo thực | Chưa xác minh |
| Link task + Task ID | Chưa xác minh |
| Branch + commit triển khai của thành viên | Chưa xác minh |
| PR + người review + ngày merge | Chưa xác minh |
| Video OBS + ngày quay + thời lượng | Chưa xác minh |
| Test nghiệp vụ từng action | Có test một phần trong báo cáo chung; cần thành viên xác nhận ca của màn |
| 320px / 375px / zoom 200% / Tab / Esc / contrast | Chưa đủ bằng chứng toàn màn |
| Kết luận | Đã triển khai; chờ hoàn tất minh chứng và DoD |

### O5 — Phát hiện xung đột (AI)

| Trường nguồn | Giá trị |
| --- | --- |
| ID | O5 |
| Role | Ban tổ chức |
| User goal | Phát hiện sớm và xử lý xung đột lịch/phòng ở cấp toàn sự kiện |
| User task | Phát hiện & xử lý xung đột hệ thống |
| Tên màn hình | Phát hiện xung đột (AI) |
| Tên file HTML | organizer-conflict-detection.html |
| Chức năng chính | AI quét toàn bộ session để phát hiện trùng phòng/giờ và đề xuất phương án xử lý |
| CRUD | R/U |
| Entity sử dụng | sessions, rooms |
| JavaScript interaction | Danh sách xung đột được highlight, nút áp dụng gợi ý AI trực tiếp vào lịch |
| AI feature | AI-2: Conflict Resolver (cấp hệ thống) |
| Loading state | Có (đang quét toàn bộ lịch) |
| Empty state | Có (không phát hiện xung đột nào) |
| Error state | Có ('Không thể xử lý yêu cầu lúc này' + Thử lại/Xử lý thủ công) |
| Success state | Có (đã áp dụng phương án xử lý) |
| Responsive requirement | Desktop/Tablet/Mobile |
| Người phụ trách | SV3 |
| OBS cần quay | Có |
| Mức độ | Bắt buộc |
| Ghi chú | Dùng lại AI-2 ở góc nhìn vận hành thay vì góc nhìn cá nhân \| Chưa có mockup Canva riêng; triển khai theo User Flow/Design System khi code |

**Dữ liệu triển khai:** `eventpulse_sessions`, `eventpulse_rooms`.

| Minh chứng | Tình trạng |
| --- | --- |
| Tên / MSSV / GitHub của người chịu trách nhiệm | Chưa xác minh |
| Link mockup/frame + ngày tạo thực | Chưa xác minh |
| Link task + Task ID | Chưa xác minh |
| Branch + commit triển khai của thành viên | Chưa xác minh |
| PR + người review + ngày merge | Chưa xác minh |
| Video OBS + ngày quay + thời lượng | Chưa xác minh |
| Test nghiệp vụ từng action | Có test một phần trong báo cáo chung; cần thành viên xác nhận ca của màn |
| 320px / 375px / zoom 200% / Tab / Esc / contrast | Chưa đủ bằng chứng toàn màn |
| Kết luận | Đã triển khai; chờ hoàn tất minh chứng và DoD |

### O6 — Cảnh báo sự kiện

| Trường nguồn | Giá trị |
| --- | --- |
| ID | O6 |
| Role | Ban tổ chức |
| User goal | Thông báo kịp thời khi có thay đổi chương trình |
| User task | Soạn & gửi cảnh báo sự kiện |
| Tên màn hình | Cảnh báo sự kiện |
| Tên file HTML | organizer-event-alerts.html |
| Chức năng chính | Soạn, gửi, sửa, thu hồi thông báo thay đổi lịch/phòng đến người liên quan |
| CRUD | C/R/U/D |
| Entity sử dụng | event_alerts |
| JavaScript interaction | Rich text soạn thảo, chọn đối tượng nhận (role/nhóm), lên lịch gửi |
| AI feature | Không |
| Loading state | Có (đang gửi thông báo) |
| Empty state | Có (chưa có cảnh báo nào) |
| Error state | Có (gửi thất bại) |
| Success state | Có (đã gửi/thu hồi thông báo) |
| Responsive requirement | Desktop/Tablet/Mobile |
| Người phụ trách | SV3 |
| OBS cần quay | Có |
| Mức độ | Bắt buộc |
| Ghi chú | Nguồn dữ liệu cho notifications.html của Attendee/Speaker \| Canva Desktop: Đã có |

**Dữ liệu triển khai:** `eventpulse_eventAlerts`, `eventpulse_notifications`.

| Minh chứng | Tình trạng |
| --- | --- |
| Tên / MSSV / GitHub của người chịu trách nhiệm | Chưa xác minh |
| Link mockup/frame + ngày tạo thực | Chưa xác minh |
| Link task + Task ID | Chưa xác minh |
| Branch + commit triển khai của thành viên | Chưa xác minh |
| PR + người review + ngày merge | Chưa xác minh |
| Video OBS + ngày quay + thời lượng | Chưa xác minh |
| Test nghiệp vụ từng action | Có test một phần trong báo cáo chung; cần thành viên xác nhận ca của màn |
| 320px / 375px / zoom 200% / Tab / Esc / contrast | Chưa đủ bằng chứng toàn màn |
| Kết luận | Đã triển khai; chờ hoàn tất minh chứng và DoD |

### AD1 — Quản lý loại vé

| Trường nguồn | Giá trị |
| --- | --- |
| ID | AD1 |
| Role | Quản trị viên |
| User goal | Kiểm soát cấu trúc giá vé của sự kiện |
| User task | Quản lý loại vé |
| Tên màn hình | Quản lý loại vé |
| Tên file HTML | admin-ticket-type-management.html |
| Chức năng chính | Thêm/sửa/ngưng bán loại vé, giá, số lượng phát hành |
| CRUD | C/R/U/Archive |
| Entity sử dụng | tickets |
| JavaScript interaction | Validate giá/số lượng, toggle ngưng bán, tìm kiếm loại vé |
| AI feature | Không |
| Loading state | Có (đang tải danh sách vé) |
| Empty state | Có (chưa có loại vé nào) |
| Error state | Có (lưu thất bại, trùng tên loại vé) |
| Success state | Có (đã lưu loại vé) |
| Responsive requirement | Desktop/Tablet/Mobile |
| Người phụ trách | SV3 |
| OBS cần quay | Có |
| Mức độ | Bắt buộc |
| Ghi chú | Canva Desktop: Đã có |

**Dữ liệu triển khai:** `eventpulse_ticketTypes`, `eventpulse_userTickets`.

| Minh chứng | Tình trạng |
| --- | --- |
| Tên / MSSV / GitHub của người chịu trách nhiệm | Chưa xác minh |
| Link mockup/frame + ngày tạo thực | Chưa xác minh |
| Link task + Task ID | Chưa xác minh |
| Branch + commit triển khai của thành viên | Chưa xác minh |
| PR + người review + ngày merge | Chưa xác minh |
| Video OBS + ngày quay + thời lượng | Chưa xác minh |
| Test nghiệp vụ từng action | Có test một phần trong báo cáo chung; cần thành viên xác nhận ca của màn |
| 320px / 375px / zoom 200% / Tab / Esc / contrast | Chưa đủ bằng chứng toàn màn |
| Kết luận | Đã triển khai; chờ hoàn tất minh chứng và DoD |

### AD2 — Quản lý Người dùng

| Trường nguồn | Giá trị |
| --- | --- |
| ID | AD2 |
| Role | Quản trị viên |
| User goal | Kiểm soát quyền truy cập hệ thống |
| User task | Quản lý người dùng |
| Tên màn hình | Quản lý Người dùng |
| Tên file HTML | admin-user-management.html |
| Chức năng chính | Thêm/sửa/khoá tài khoản, phân quyền vai trò |
| CRUD | C/R/U/Archive |
| Entity sử dụng | users |
| JavaScript interaction | Tìm kiếm/lọc theo role & trạng thái, bulk khoá tài khoản, xác nhận trước khi khoá |
| AI feature | Không |
| Loading state | Có (đang tải danh sách) |
| Empty state | Có (không có người dùng khớp bộ lọc) |
| Error state | Có (thao tác thất bại) |
| Success state | Có (đã cập nhật người dùng) |
| Responsive requirement | Desktop/Tablet/Mobile |
| Người phụ trách | SV3 |
| OBS cần quay | Có |
| Mức độ | Bắt buộc |
| Ghi chú | Canva Desktop: Đã có |

**Dữ liệu triển khai:** `eventpulse_users`.

| Minh chứng | Tình trạng |
| --- | --- |
| Tên / MSSV / GitHub của người chịu trách nhiệm | Chưa xác minh |
| Link mockup/frame + ngày tạo thực | Chưa xác minh |
| Link task + Task ID | Chưa xác minh |
| Branch + commit triển khai của thành viên | Chưa xác minh |
| PR + người review + ngày merge | Chưa xác minh |
| Video OBS + ngày quay + thời lượng | Chưa xác minh |
| Test nghiệp vụ từng action | Có test một phần trong báo cáo chung; cần thành viên xác nhận ca của màn |
| 320px / 375px / zoom 200% / Tab / Esc / contrast | Chưa đủ bằng chứng toàn màn |
| Kết luận | Đã triển khai; chờ hoàn tất minh chứng và DoD |

### AD3 — Phân tích sự kiện

| Trường nguồn | Giá trị |
| --- | --- |
| ID | AD3 |
| Role | Quản trị viên |
| User goal | Ra quyết định dựa trên số liệu thực tế của sự kiện |
| User task | Xem phân tích tổng thể sự kiện |
| Tên màn hình | Phân tích sự kiện |
| Tên file HTML | admin-event-analytics.html |
| Chức năng chính | Biểu đồ vé bán, tỉ lệ check-in, session được quan tâm nhất, xu hướng theo thời gian |
| CRUD | R |
| Entity sử dụng | tickets, agendas, feedback, sessions |
| JavaScript interaction | Biểu đồ tương tác (lọc theo khoảng thời gian), xuất báo cáo (mock) |
| AI feature | AI-3: Interest Forecast (dashboard insight) |
| Loading state | Có (đang tổng hợp số liệu) |
| Empty state | Có (chưa đủ dữ liệu để thống kê) |
| Error state | Có (lỗi tải số liệu) |
| Success state | — |
| Responsive requirement | Desktop/Tablet/Mobile |
| Người phụ trách | SV3 |
| OBS cần quay | Có |
| Mức độ | Bắt buộc |
| Ghi chú | Tái sử dụng AI-3 ở góc nhìn Admin để cảnh báo session có nguy cơ quá tải; SP5 vẫn là màn AI-3 chuyên biệt cho Speaker \| Canva Desktop: Đã có \| Mobile representative: Đã có |

**Dữ liệu triển khai:** `eventpulse_ticketTypes`, `eventpulse_userTickets`, `eventpulse_agendas`, `eventpulse_feedback`, `eventpulse_sessions`.

| Minh chứng | Tình trạng |
| --- | --- |
| Tên / MSSV / GitHub của người chịu trách nhiệm | Chưa xác minh |
| Link mockup/frame + ngày tạo thực | Chưa xác minh |
| Link task + Task ID | Chưa xác minh |
| Branch + commit triển khai của thành viên | Chưa xác minh |
| PR + người review + ngày merge | Chưa xác minh |
| Video OBS + ngày quay + thời lượng | Chưa xác minh |
| Test nghiệp vụ từng action | Có test một phần trong báo cáo chung; cần thành viên xác nhận ca của màn |
| 320px / 375px / zoom 200% / Tab / Esc / contrast | Chưa đủ bằng chứng toàn màn |
| Kết luận | Đã triển khai; chờ hoàn tất minh chứng và DoD |

### AD4 — Quản lý Check-in

| Trường nguồn | Giá trị |
| --- | --- |
| ID | AD4 |
| Role | Quản trị viên |
| User goal | Đảm bảo đúng người vào đúng sự kiện |
| User task | Quản lý check-in vé |
| Tên màn hình | Quản lý Check-in |
| Tên file HTML | admin-checkin-management.html |
| Chức năng chính | Tra cứu vé, xác nhận check-in thủ công, xem lịch sử check-in |
| CRUD | R/U |
| Entity sử dụng | tickets |
| JavaScript interaction | Tìm kiếm theo mã vé/tên, quét mã (mock), cập nhật trạng thái realtime |
| AI feature | Không |
| Loading state | Có (đang tra cứu) |
| Empty state | Có (chưa có lượt check-in nào) |
| Error state | Có (mã vé không hợp lệ) |
| Success state | Có (check-in thành công) |
| Responsive requirement | Desktop/Tablet/Mobile |
| Người phụ trách | SV3 |
| OBS cần quay | Có |
| Mức độ | Có thể gộp |
| Ghi chú | Có thể gộp làm tab trong Quản lý loại vé nếu rút gọn phạm vi \| Chưa có mockup Canva riêng; triển khai theo User Flow/Design System khi code |

**Dữ liệu triển khai:** `eventpulse_userTickets`, `eventpulse_events`, `eventpulse_users`.

| Minh chứng | Tình trạng |
| --- | --- |
| Tên / MSSV / GitHub của người chịu trách nhiệm | Chưa xác minh |
| Link mockup/frame + ngày tạo thực | Chưa xác minh |
| Link task + Task ID | Chưa xác minh |
| Branch + commit triển khai của thành viên | Chưa xác minh |
| PR + người review + ngày merge | Chưa xác minh |
| Video OBS + ngày quay + thời lượng | Chưa xác minh |
| Test nghiệp vụ từng action | Có test một phần trong báo cáo chung; cần thành viên xác nhận ca của màn |
| 320px / 375px / zoom 200% / Tab / Esc / contrast | Chưa đủ bằng chứng toàn màn |
| Kết luận | Đã triển khai; chờ hoàn tất minh chứng và DoD |

## Checklist DoD áp dụng riêng cho mỗi màn

Không dùng một checkbox toàn dự án thay cho nghiệm thu từng màn. Barem nói DoD 14 bước nhưng không liệt kê tách đủ 14 số mục; dưới đây là cách tách vận hành, không nhận là template nguyên văn của giảng viên.

1. Có ID, mục tiêu và role trong inventory.
2. Flow và điều kiện chuyển trạng thái khớp nguồn.
3. Có link mockup/frame; ghi đúng ngày, cả khi bổ sung sau code.
4. HTML semantic, đúng một main và một h1 sau render.
5. CSS dùng design token/component chung.
6. Responsive 320/375/768/≥1024px và zoom 200%.
7. JavaScript hoạt động, đúng quyền và action.
8. Validation có nội dung lỗi, không chỉ màu/alert.
9. JSON/LocalStorage đúng entity/key; CRUD giữ sau reload.
10. Normal/Loading/Empty/Error/Success theo yêu cầu nguồn.
11. AI đủ chuỗi Input → Processing → Output → Explainability → Control → Save/Apply nếu áp dụng; có failure/uncertainty.
12. A11y: label/alt/focus/Tab/Esc/contrast.
13. Task → branch → commit → PR/review → merge có bằng chứng.
14. OBS đúng màn, webcam/giọng nói/giải thích/sửa trực tiếp/test/commit và mã truy vết.

## Chuẩn hóa entity không làm đổi nghiệp vụ

Các tên legacy trong nguồn được giữ nguyên ở hồ sơ nguồn: speakers → users(role=speaker); sessions.materials → materials liên kết sessionId; event_alerts → eventAlerts; tickets → ticketTypes hoặc userTickets tùy màn. Không đổi ID, filename hay bỏ chức năng vì đổi tên entity. `eventpulse_currentUser`/`eventpulse_settings` là trạng thái ứng dụng, không phải entity backend. Xác thực, upload, QR/check-in và AI hiện có phần mock; xem README và báo cáo tích hợp.

## Việc còn thiếu trước nộp

- Xác nhận tên/MSSV/GitHub và từng màn do mỗi thành viên hiểu, kiểm tra, quay OBS.
- Đính kèm User Flow gốc, link Figma/Canva có quyền xem và lịch sử thực tế; không ghi lùi ngày.
- Điền task/commit/PR/review/OBS thực vào từng hồ sơ. Có nhánh không đồng nghĩa có đóng góp kỹ thuật.
- Chạy test còn thiếu, ghi ngày/người chạy/kết quả/lỗi còn lại trước khi đánh DONE.
- Xác minh deploy bằng link thực trên ẩn danh/điện thoại; không suy ra deploy thành công từ localhost.
