# Báo cáo sử dụng AI — EventPulse / CSE122

Ngày tổng hợp: 25/10/2026. Trạng thái: bản khai theo bằng chứng hiện có, **chờ cả ba thành viên đọc và xác nhận trước khi nộp**. Không phải bản cam kết đã được nhóm ký xác nhận.

## 1. Công cụ và phạm vi

Trong chuỗi làm việc hiện có, ChatGPT/Codex được dùng để hỗ trợ đọc yêu cầu, phân tích code, tích hợp dự án, sinh/sửa HTML/CSS/JavaScript, viết nội dung giao diện, hỗ trợ kiểm thử tự động, giải thích code và tạo tài liệu. AI đã trực tiếp chỉnh sửa mã nguồn; không khai rằng AI chỉ gợi ý hoặc nhóm tự viết toàn bộ code.

Chưa có bằng chứng để thống kê chính xác toàn bộ lần sử dụng AI, tỷ lệ dòng code do AI sinh hoặc việc từng thành viên có dùng công cụ khác hay không. Không tự ghi phần trăm, số giờ tiết kiệm, phiên bản model hay prompt không còn lưu. Mỗi thành viên cần bổ sung công cụ và phạm vi sử dụng thực tế của mình.

AI hỗ trợ trong quá trình chuẩn bị sản phẩm và luyện tập. Barem cấm đưa đề Live Modification đang thi vào ChatGPT/Claude/Gemini/Cursor/Copilot; tài liệu này không cho phép dùng AI trong phần thi bị cấm.

## 2. AI làm công cụ phát triển và AI trong sản phẩm

| Nội dung | Thực tế hiện có |
| --- | --- |
| AI hỗ trợ phát triển | ChatGPT/Codex hỗ trợ sinh, sửa, phân tích code và viết tài liệu |
| AI gợi ý agenda | Mô phỏng bằng JavaScript dựa trên dữ liệu phiên, sở thích và agenda |
| AI xử lý xung đột | Logic kiểm tra thời gian/phòng và đưa phương án, người dùng xác nhận trước khi áp dụng |
| AI dự báo quan tâm | Ước tính mô phỏng từ đăng ký/lượt lưu, có giải thích và độ tin cậy |
| LLM API / mô hình tự huấn luyện | Chưa có bằng chứng tích hợp; không khai là đã có |
| Backend / dữ liệu đồng bộ qua máy chủ | Phiên bản này dùng JSON + LocalStorage; không khai là backend thật |

## 3. Nhật ký các đợt hỗ trợ xác định được

Bảng mô tả đợt công việc, không giả lập lịch sử commit. Ngoại trừ đợt sửa bộ lọc/i18n có báo cáo ngày 24/10/2026, chưa xác nhận chính xác ngày của mọi lượt yêu cầu; không dùng ngày trong báo cáo cũ làm bằng chứng tác giả hoặc thời điểm code.

| Đợt | Yêu cầu từ người dùng | AI đã hỗ trợ | Bằng chứng trong dự án | Phần nhóm cần xác nhận |
| --- | --- | --- | --- | --- |
| Tích hợp SV1/SV2/SV3 | Gộp theo ownership, giữ chức năng và dữ liệu liên role | Hỗ trợ tổ chức file, chỉnh route, chia sẻ dữ liệu và kiểm thử | [INTEGRATION-REPORT](../INTEGRATION-REPORT.md), [code inventory](code-inventory.json), [TEST-REPORT](../TEST-REPORT.md) | Từng SV kiểm tra chức năng của role mình, xác nhận phần code thực sự hiểu |
| Trang chủ | Thiết kế S1, animation, i18n và form thống nhất | Sinh/sửa giao diện và JS hỗ trợ | [HOME-REDESIGN-REPORT](../HOME-REDESIGN-REPORT.md), thư mục docs/home-redesign | Đối chiếu thiết kế và tự demo tương tác; không nhận nguyên mẫu AI là Figma phân rã |
| Typography và giao diện | Rà lỗi chữ, icon, ô tìm kiếm, bộ lọc | Hỗ trợ CSS và các hàm UI | [UI-FIX-REPORT](../UI-FIX-REPORT.md), [TYPOGRAPHY-FIX](TYPOGRAPHY-FIX.md), [NAV-AUTH-FIX](NAV-AUTH-FIX.md) | Kiểm tra lại trên máy người dùng; phân biệt kết quả tự chạy với QA do công cụ chạy |
| Menu Admin | Người dùng phản ánh Tổng quan và Phân tích giống nhau, hỏi Check-in | Chỉnh navigation để có mục Check-in và tránh hai mục cùng đích | [ADMIN-MENU-FIX](ADMIN-MENU-FIX.md), js/ui.js | Giải thích được route và active state; xác nhận bằng thao tác trên bản nộp |
| Bộ lọc + VI/EN | Người dùng gửi ảnh hàng ngày/chủ đề/phòng lệch và chỉ header đổi ngôn ngữ | Sửa căn hàng, catalog dịch, nội dung động, locale và lưu lựa chọn | [FILTER-I18N-FIX](FILTER-I18N-FIX.md), js/i18n.js, js/messages.js, css/components.css, [QA i18n](qa/i18n/screens.json) | Kiểm tra các ngữ cảnh còn sót, không coi 256 lượt mở màn là 256 ca CRUD đầy đủ |
| Hồ sơ nộp bài | Yêu cầu Inventory đúng yêu cầu và khai báo AI trung thực | Tổng hợp inventory, bản khai AI và checklist chứng cứ | [screen-inventory](screen-inventory.md), tài liệu này | Điền người/đường dẫn thật; đọc, sửa và xác nhận nội dung trước nộp |

Các yêu cầu trên là diễn giải từ hội thoại hiện có, không phải bản chép prompt đầy đủ. Báo cáo ghi rõ thiếu thông tin thay vì dựng lại prompt hoặc lịch sử giả.

## 4. Ví dụ kết quả chưa đạt và cách khắc phục

### 4.1. Đổi ngôn ngữ chỉ tác động một phần UI

- Hiện tượng: người dùng phản ánh khi chọn English, thanh điều hướng đổi nhưng nội dung các màn vẫn tiếng Việt.
- Phân tích: i18n cũ chủ yếu xử lý phần tử có data-i18n; nhiều module dựng nhãn, dialog và thông báo bằng chuỗi cứng.
- AI hỗ trợ sửa: bổ sung catalog câu, dịch nội dung động, cache văn bản gốc để đổi hai chiều, giữ giá trị form/option và dữ liệu lưu; thống nhất language trong settings.
- Kiểm tra do công cụ chạy: ma trận 32 màn × 2 viewport × 2 theme × 2 language; mở form/validation, kiểm tra reload và so sánh dữ liệu trước/sau đổi ngôn ngữ.
- Giới hạn: tên người, địa danh, nội dung người dùng và ô đang chỉnh sửa không dịch máy. Câu giao diện mới cần được thêm từ điển. Chưa tự nhận mọi nội dung và mọi kịch bản đã được kiểm tra thủ công.

### 4.2. Hàng bộ lọc báo cáo bị lệch

- Hiện tượng: hai ô ngày có label, còn select và nút căn giữa khiến control không cùng hàng.
- AI hỗ trợ sửa: scope analytics-filters, căn flex-end, control cao 44px, select phủ wrapper và xếp một cột trên mobile.
- Bằng chứng: [filter-and-data.json](qa/i18n/filter-and-data.json), [báo cáo sửa](FILTER-I18N-FIX.md).
- Phần cần tự giải thích: khác biệt giữa align-items:center và flex-end, flex-wrap, min-width và breakpoint.

### 4.3. Hai mục Admin cùng một trang

- Hiện tượng: người dùng nhận thấy Tổng quan và Phân tích giống nhau; đây là vấn đề điều hướng, không phải hai nghiệp vụ độc lập đã triển khai.
- AI hỗ trợ sửa: menu dùng một mục Tổng quan & phân tích, thêm truy cập Check-in theo màn hiện có; không tạo dashboard rỗng để tăng số trang.
- Phần cần tự giải thích: routes, URL, class active và data-nav-key trong menu desktop/mobile.

Những ví dụ này cho thấy kết quả bàn giao trước đó cần sửa tiếp. Không kết luận mọi lỗi do AI gây ra; các dự án gốc và những đợt chỉnh sửa đều có thể góp phần. Điều xác nhận được là người dùng đã phản ánh lỗi và AI đã tham gia sửa.

## 5. Phân biệt bằng chứng kiểm thử

| Loại bằng chứng | Có thể khẳng định | Không được suy ra |
| --- | --- | --- |
| Log Playwright/Chromium và node --check | Công cụ đã thực hiện những ca có trong báo cáo | Sinh viên đã tự kiểm tra từng ca hoặc hiểu toàn bộ code |
| Chụp ảnh/đo overflow trong QA | Viewport được thử có kết quả đã ghi | Chạy tốt trên mọi máy thật, mọi trình duyệt hoặc đạt WCAG AA |
| CRUD thử lưu phòng và reload | Ca cụ thể giữ dữ liệu đúng | Mọi loại CRUD đều đã được test toàn diện |
| Test liên vai trò trên localhost | Các role dùng chung dữ liệu trình duyệt trong ca thử | Đồng bộ realtime giữa nhiều máy hoặc bảo mật role ở backend |
| Báo cáo trước đây trong repo | Có hồ sơ kết quả từ đợt trước | Toàn bộ ca được chạy lại ngày viết báo cáo này |

Các kiểm thử mới nhất trước khi lập tài liệu này xem FILTER-I18N-FIX.md. Lần tổng hợp tài liệu hôm nay chỉ kiểm tra đường dẫn, số màn và tính nhất quán tài liệu; không tự nhận đã chạy lại browser matrix.

## 6. Trách nhiệm và xác nhận của từng người

Phân công gốc: SV1 Attendee và trục Design System/điều hướng/A11y; SV2 Speaker và trục kiến trúc JS/data/AI UX; SV3 Organizer/Admin và trục responsive/QA/merge/deploy. Đây là trách nhiệm theo đề bài, không phải chứng nhận đã thực hiện đầy đủ.

| Thành viên | Tên / MSSV / GitHub | AI thực tế đã dùng, file/tác vụ | Phần tự viết/sửa/kiểm tra | Task / commit / PR / OBS | Xác nhận |
| --- | --- | --- | --- | --- | --- |
| SV1 | Chưa cung cấp | Cần thành viên bổ sung | Cần thành viên bổ sung | Chưa xác minh | Chưa xác nhận |
| SV2 | Chưa cung cấp | Cần thành viên bổ sung | Cần thành viên bổ sung | Chưa xác minh | Chưa xác nhận |
| SV3 | Chưa cung cấp | Cần thành viên bổ sung | Cần thành viên bổ sung | Chưa xác minh | Chưa xác nhận |

Không gán các sửa đổi do trợ lý thực hiện cho một sinh viên nếu chưa có bằng chứng. README riêng/branch riêng không thay thế lịch sử đóng góp. Nếu AI hỗ trợ merge, thành viên vẫn cần tự review, hiểu diff và chịu trách nhiệm bản nộp.

## 7. Những điều chưa thể chứng nhận

- Chưa xác minh toàn bộ Figma/Canva, task board, timeline trước code, GitHub mới nhất, PR/review và deploy.
- Chưa có bộ OBS và bằng chứng live modification của từng người để đối chiếu 1:1 inventory.
- Không có thống kê phần trăm code AI hoặc xác nhận cả ba người đã đọc hết code.
- Chưa đủ kiểm thử 320/375px, zoom 200%, toàn bộ bàn phím/contrast hoặc kiểm toán XSS toàn dự án.
- Nhiều phần là mock: xác thực, AI, upload/check-in và thông báo; không trình bày là dịch vụ production.

## 8. Việc cần làm trước khi nộp

1. Mỗi thành viên đọc tài liệu, sửa các mô tả chưa đúng và điền xác nhận thật.
2. Điền link minh chứng thật trong screen-inventory.md; đánh dấu rõ mục còn thiếu.
3. Tự chạy demo, ghi người chạy/ngày/đầu vào/kết quả; không chỉ sao chép log tự động.
4. Chuẩn bị ít nhất một ví dụ lỗi AI hỗ trợ đã hiểu nguyên nhân, mở được đoạn code và giải thích diff.
5. Tập giải thích api.js → LocalStorage → module → DOM, event delegation, validation, AI control và cách tránh XSS.
6. Không khai bù PR/commit/OBS, không ghi lùi ngày thiết kế và không cam kết đã review khi chưa review.
