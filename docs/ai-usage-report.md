# Báo cáo sử dụng AI — EventPulse / CSE122

Ngày tổng hợp ban đầu: 25/10/2026; cập nhật: 26/10/2026. Người tổng hợp: Nguyễn Hữu Tú — 2551170969 — SV3. Trạng thái: bản khai theo bằng chứng hiện có, **chờ cả ba thành viên đọc và xác nhận trước khi nộp**. Không phải bản cam kết đã được nhóm ký xác nhận.

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

Các kiểm thử được ghi nhận trước đây xem FILTER-I18N-FIX.md. Đợt cập nhật 26/10/2026 chỉ bổ sung thông tin và đối chiếu tài liệu; không tự nhận chạy lại browser matrix, kiểm chứng deploy hoặc sửa hết lỗi runtime.

## 6. Trách nhiệm và xác nhận của từng người

Phân công gốc: SV1 Attendee và trục Design System/điều hướng/A11y; SV2 Speaker và trục kiến trúc JS/data/AI UX; SV3 Organizer/Admin và trục responsive/QA/merge/deploy. Đây là trách nhiệm theo đề bài, không phải chứng nhận đã thực hiện đầy đủ.

| Thành viên | Họ tên và tài khoản | Công cụ và phạm vi khai báo | Phần tự thực hiện / kiểm tra | Minh chứng và xác nhận |
| --- | --- | --- | --- | --- |
| SV1 | Trần Đức Tuyên — 2551170973; [CristianoMessi710](https://github.com/CristianoMessi710) | ChatGPT; sinh/sửa HTML/CSS/JS A1/A3/A5, AI-1, i18n nội dung động, navigation và toast theo khai báo | Đã nêu lỗi English chỉ đổi navigation; phần tự demo/kiểm VI-EN còn là gợi ý cần xác nhận, không ghi là đã hoàn thành | feature/attendee; chưa có commit triển khai/PR được đối chiếu; [Playlist SV1](https://youtube.com/playlist?list=PLNjSq0kZHBoQ&si=DrQkSvg-yy1_2dvF). Thông tin do người tổng hợp chuyển lại |
| SV2 | Phan Anh Vũ — 2551170975; [caubetinhnghich](https://github.com/caubetinhnghich) | ChatGPT, Claude; phân tích flow Speaker, hỗ trợ HTML/CSS/JS, seed/LocalStorage, validation, debug sự kiện và responsive theo khai báo | Khai báo đã đối chiếu kịch bản demo với HTML/JS và sửa mô tả hành vi cho đúng; không tự nâng thành đã tự viết/sửa toàn bộ code | Nhánh main; be12e54 — Delete BTQT chưa chứng minh phạm vi Speaker; khai báo chưa có PR; [Playlist SV2](https://www.youtube.com/watch?v=Qt8kaEVm8Zc&list=PLNf-YAqt-PeY) |
| SV3 | Nguyễn Hữu Tú — 2551170969; GitHub cá nhân chưa cung cấp | Có bằng chứng trao đổi ChatGPT/Codex về tích hợp, giao diện/i18n/toast, tài liệu, OBS, Git, dữ liệu demo và ôn live modification | Đã gửi ảnh web/Console/LocalStorage và code để trao đổi; có hướng dẫn sửa nhưng chưa có diff/commit xác nhận mọi bài ôn đã áp dụng | [Playlist SV3](https://www.youtube.com/watch?v=M0-wLN6guSM&list=PLROvsl37oK8E); chưa đối chiếu đủ commit/PR theo màn |

Không gán các sửa đổi do trợ lý thực hiện cho một sinh viên nếu chưa có bằng chứng. README riêng/branch riêng không thay thế lịch sử đóng góp. Nếu AI hỗ trợ merge, thành viên vẫn cần tự review, hiểu diff và chịu trách nhiệm bản nộp.

## 7. Những điều chưa thể chứng nhận

- Chưa xác minh toàn bộ Figma/Canva, task board, timeline trước code, GitHub mới nhất, PR/review và deploy.
- Người tổng hợp đã cung cấp 3 playlist và báo mỗi thành viên đã quay xong 3 video theo hướng dẫn mới của giảng viên. Đã nhận đủ danh sách 9 màn chọn quay, dùng playlist theo lựa chọn của người tổng hợp; chưa xác minh quyền xem, nội dung từng video và ngày quay/thời lượng; không tiếp tục áp dụng yêu cầu số lượng 1:1 toàn bộ Inventory trong PDF cũ.
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


## 9. Các hỗ trợ bổ sung trong quá trình chuẩn bị bảo vệ

| Nội dung | AI hỗ trợ | Bằng chứng hiện có và giới hạn |
| --- | --- | --- |
| Kịch bản OBS | Soạn lời đọc, thao tác, câu chuyển tiếp và ví dụ code cho O3/O5/AD4 | Có nội dung trao đổi và file kịch bản; không suy ra mọi bước đã xuất hiện trong video |
| Check-in và lịch hết hạn | Giải thích status valid khác với điều kiện còn hạn; hướng dẫn xem ngày theo eventId trong LocalStorage | Có ảnh người dùng gửi; dữ liệu trên máy người dùng từng có EVT001 kết thúc 21/10/2026. AI ban đầu tham chiếu bản seed khác ngày 22/10, sau đó điều chỉnh theo ảnh |
| Chuẩn bị dữ liệu demo | Hướng dẫn chỉnh ngày sự kiện demo trong LocalStorage, giữ kiểm tra nghiệp vụ | Thay trong F12 không tự sửa JSON trong GitHub hoặc máy khác. Có ảnh sửa nhầm EVT002; AI đã hướng dẫn chọn EVT001 và khôi phục sự kiện lịch sử theo bản gốc |
| Lỗi Console | Đọc ảnh lỗi NotFoundError/innerHTML tại operations.js, phân biệt với WebSocket Live Server và favicon 404 | Chưa có bằng chứng lỗi runtime đã sửa; không khai đã hoàn tất hoặc đạt Console sạch |
| Ôn live modification | Giải thích bộ đếm kết quả, reset state, sort, chống trùng phòng, đếm ký tự, validation lý do, grid responsive và empty state | Người dùng đã cung cấp các đoạn O2/O4/reject. Phần chống trùng tên và validation tối thiểu 5 ký tự vốn đã có trong code gửi; không khai AI hay sinh viên vừa tạo mới toàn bộ tính năng |
| Cập nhật hồ sơ | Điền 3 tên/MSSV/playlist và quy định 3 video/người vào Inventory, tổng hợp khai báo này | Hỗ trợ viết báo cáo không thay cho xác nhận thực tế của từng người |

## 10. Một số yêu cầu thực tế đã gửi cho AI

Các câu dưới được trích từ cuộc trao đổi hiện có, không phải lịch sử đầy đủ. Không tự gán chúng cho SV1 hoặc SV2.

1. “TÔI CẦN BẠN ĐÓNG VAI TRÒ MASTER INTEGRATOR CHO DỰ ÁN EVENTPULSE – CSE122.”
2. “viết kịch bản hãy viết thêm cả các câu chuyển tiếp giữa các mục”
3. “trong barem chấm điểm hôm qua có phần thực hành code để mai tôi lên vấn đáp code trực tiếp hãy tạo bài tập để tôi ôn tập”
4. “hãy thử làm mẫu bài 1 cho tôi”
5. “Nhập những thông tin này vào phần inventory phần AI-usage hãy nhập hộ tôi luôn” — hai vế được ghép cùng dòng từ yêu cầu cập nhật.

Kết quả sử dụng: AI đã cung cấp phương án, code mẫu, giải thích và nội dung tài liệu. Các ví dụ ôn tập chưa có bằng chứng commit không được ghi là đã triển khai vào bản nộp. Thành viên cần tự chạy, đọc diff và chịu trách nhiệm phần thực sự sử dụng.

## 11. Các điểm cần đính chính hoặc tự kiểm chứng

- Hướng dẫn ban đầu chọn 3 màn chủ đạo cho SV3 không thay thế yêu cầu video trong PDF cũ. Sau đó người tổng hợp báo giảng viên cập nhật mỗi người 3 video; báo cáo và Inventory áp dụng thông tin mới, chờ đính kèm thông báo thực tế.
- Một bài luyện empty state ban đầu chỉ mô tả tìm kiếm không có kết quả; đã đính chính rằng chưa bao phủ đầy đủ đề D1 giả lập dữ liệu rỗng có biểu tượng/thông điệp/CTA.
- Các ví dụ code có tên biến giả định hoặc dựa trên đoạn người dùng gửi phải đối chiếu đúng file trước khi dùng. Không khẳng định code mẫu đã chạy đúng khi chưa test.
- Báo cáo này là bản kê khai theo bằng chứng và thông tin người tổng hợp cung cấp. Không điền thay chữ xác nhận, ngày ký hay cam kết tự viết của hai thành viên còn lại.


## 12. Khai báo bổ sung SV1 và SV2 do người tổng hợp cung cấp

### 12.1. SV1 Trần Đức Tuyên

- MSSV: 2551170973. GitHub khai báo: https://github.com/CristianoMessi710.
- Ba màn quay: A1 — Danh mục session; A3 — Agenda của tôi; A5 — Gợi ý session.
- Nhánh: feature/attendee. Chưa cung cấp mã commit triển khai; khai báo chưa có PR liên quan phần cá nhân trong repo.
- Bảng công việc: [Trello chung](https://trello.com/b/IUQmQXEP/eventpulse-screen-inventory); chưa có Task ID hoặc link thẻ riêng.
- Công cụ AI khai báo: ChatGPT; chưa cung cấp model/phiên bản hay bản ghi prompt riêng của thành viên, không tự dựng lại.

**AI hỗ trợ theo khai báo:** sinh/sửa HTML, CSS, JavaScript cho A1 (card, thanh lọc, debounce), A3 (timeline, kéo-thả), dựng AI-1 Agenda Recommender ở A5 với giải thích, độ tin cậy, làm mới, thêm vào agenda và loading/empty/error/success; hỗ trợ i18n nội dung động, navigation theo data-nav-key và bố cục toast.

**Lỗi nêu được:** bật English thì chỉ thanh điều hướng đổi ngôn ngữ, A1/A3/A5 vẫn còn tiếng Việt. Hồ sơ dự án trước đó ghi AI tham gia sửa catalog/i18n và nội dung động. Chưa có diff để khẳng định riêng SV1 tự thực hiện phần sửa này; thành viên cần chỉ được code đã dùng và tự kiểm tra bản nộp.

**Phần tự kiểm tra đang chờ xác nhận:** thông tin gửi đến vẫn chứa lời gợi ý “bạn tự viết” và “Gợi ý khung”, nên không coi đó là bản khai đã thực hiện. Đề xuất thành viên tự làm rồi ghi kết quả thực tế: thêm/bỏ phiên khỏi agenda, kiểm tra trùng giờ, xem lý do gợi ý và thử lại khi lỗi; kiểm VI/EN tại từng màn; giải thích api.js → LocalStorage → attendee.js → DOM, event delegation, validation và escape HTML. Đây là danh sách cần xác nhận, không phải kết quả kiểm thử đã đạt.

### 12.2. SV2 Phan Anh Vũ

- MSSV: 2551170975. GitHub khai báo: https://github.com/caubetinhnghich.
- Ba màn quay: SP2 — Phiên của tôi; SP4 — Tài liệu Session; SP1 — Hồ sơ diễn giả.
- Nhánh khai báo: main. Commit mới nhất được cung cấp: be12e54 — “Delete BTQT”. Chưa có URL commit/repository cụ thể để đối chiếu tác giả và file liên quan; không dùng thông điệp này làm chứng cứ tự động hoàn thành Speaker.
- PR: khai báo chưa có pull request trong repo. Task/issue trong repo: thành viên chưa thấy. Nhóm đã cung cấp [bảng Trello chung](https://trello.com/b/IUQmQXEP/eventpulse-screen-inventory), không suy ra không có Trello chỉ vì không có GitHub issue.
- Công cụ AI khai báo: ChatGPT và Claude; chưa có prompt/model cụ thể do SV2 cung cấp.

**AI hỗ trợ theo khai báo:** phân tích luồng các màn Speaker, seed dữ liệu, đọc/ghi LocalStorage, validation, xử lý lỗi và cập nhật giao diện khi thao tác; hỗ trợ HTML/CSS/JS cho hồ sơ, phiên và tài liệu; debug đồng bộ dữ liệu/sự kiện/responsive; gợi ý tách hàm và tổ chức code. “Cập nhật giao diện theo thời gian thực” trong lời khai không được hiểu là có backend hoặc đồng bộ đa máy.

**Phần tự thực hiện theo khai báo:** đối chiếu hướng dẫn demo với HTML và JavaScript để làm rõ hành vi thật, sửa lời thoại và hướng dẫn cho khớp code. Đây là kiểm chứng tài liệu và hành vi, chưa chứng minh toàn bộ code do thành viên tự viết.

**Ví dụ AI mô tả chưa đúng và cách xử lý được khai báo:** kịch bản từng nói tìm kiếm debounce 300 ms, Empty State có nút khôi phục bộ lọc hoặc có lựa chọn loại tài liệu “Slide”. Sau khi đọc code, thành viên điều chỉnh kịch bản: tìm kiếm lọc khi nhập; Empty State mở form đề xuất phiên; màn tài liệu kiểm tra định dạng file, không có bước chọn loại “Slide”. Các mô tả này áp dụng bản thành viên đã đối chiếu, chưa được chạy lại trên bản tích hợp hiện tại.

### 12.3. Trạng thái xác nhận

Thông tin được Nguyễn Hữu Tú chuyển để tổng hợp, không tự thêm chữ ký hoặc ngày xác nhận của SV1/SV2. Giữ nguyên các giới hạn về Git, quyền xem video và ca kiểm thử chưa chạy. Cả ba người cần đọc lại, sửa chi tiết chưa đúng và chịu trách nhiệm phần khai báo của mình.
