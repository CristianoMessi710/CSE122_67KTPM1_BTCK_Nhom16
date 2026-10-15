# TEST REPORT — EventPulse-Merged

Ngày kiểm thử: 06/10/2026. Chạy qua HTTP bằng Chromium headless; kiểm tra DOM, LocalStorage, điều hướng, lỗi JavaScript/tải tài nguyên và ảnh chụp. Không dùng kết quả suy đoán từ việc đọc code để thay cho các test dưới đây.

## Kết quả tổng hợp

| Nhóm             | Kết quả                  | Bằng chứng/phạm vi                                                                                                                                       |
| ---------------- | ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Screen Inventory | PASS                     | Đúng 32 filename; không thiếu, không dư HTML                                                                                                             |
| Navigation       | PASS                     | Mở đủ 32 màn, demo Speaker, route đăng ký/đăng nhập, liên kết giữa các role                                                                              |
| CRUD             | PASS                     | 15 bước liên vai trò; 14 kịch bản mở rộng, chi tiết bên dưới                                                                                             |
| Validation       | PASS                     | Email, xác nhận mật khẩu, sức chứa phòng, pending readonly, khóa giờ/phòng đã duyệt, overlap agenda, quyền tài liệu                                      |
| AI               | PASS                     | Loading, result, explanation, retry, chọn đề xuất, xác nhận trước lưu/đổi phòng, insufficient data                                                       |
| LocalStorage     | PASS                     | Dữ liệu qua reload/đổi role, đúng 13 key chuẩn, migration, lỗi ghi giữ form, không tự reset JSON hỏng                                                    |
| Desktop          | PASS                     | 32 màn × 1440px, không tràn ngang hoặc lỗi tài nguyên                                                                                                    |
| Tablet           | PASS                     | 32 màn × 1024px và 768px, không tràn ngang                                                                                                               |
| Mobile           | PASS                     | 32 màn × 390px, bottom-nav, bảng dạng card, kiểm tra dialog và reduced motion                                                                            |
| Console          | PASS nghiệp vụ; có lưu ý | Không ReferenceError/null/JSON parse không xử lý. Chromium có 4 thông báo native hủy view transition khi bài test đổi reduced-motion và điều hướng nhanh |
| 404 link         | PASS                     | 193 href/src/action cục bộ và import tĩnh hợp lệ; 32 màn tải CSS/JS không lỗi 404                                                                        |
| Empty state      | PASS                     | Agenda trống, danh sách, tài liệu chưa có; dữ liệu AI không đủ                                                                                           |
| Loading state    | PASS                     | Dự báo loading, upload mock tiến trình, thao tác async                                                                                                   |
| Error state      | PASS                     | Lỗi tải + thử lại; AI lỗi + thử lại; lỗi ghi giữ input + thử lại; dữ liệu hỏng không bị xóa                                                              |
| Accessibility    | Kiểm tra cơ bản          | Label, focus-visible, dialog native, icon label, thông báo lỗi bằng chữ; không khẳng định chứng nhận WCAG                                                |

## Ma trận màn hình

**128 lượt mở = 32 màn × 4 chiều rộng (1440, 1024, 768, 390px).** Mỗi lượt kiểm tra tiêu đề chính, header, trạng thái bottom navigation, scrollWidth và response lỗi. Xem `docs/qa/browser-results.json` và `docs/SCREEN-CHECKLIST.md`.

Kiểm thử viewport là mô phỏng responsive trong Chromium, không phải kiểm thử trên phần cứng iPad/iPhone. Ảnh minh họa mobile nằm tại `docs/qa/mobile-390.png`. Không coi việc tải màn hình thành công là bằng chứng rằng mọi tổ hợp dữ liệu trên màn đều đã được thử.

## 15 bước nghiệp vụ liên vai trò

1. Landing chọn demo Speaker và điều hướng đúng SP1.
2. Speaker lưu hồ sơ vào users chung.
3. Speaker tạo đề xuất session pending.
4. Session pending chỉ đọc, không cho lưu chỉnh sửa.
5. Organizer duyệt cùng ID session, phân công phòng/giờ, status published.
6. Speaker thấy quyền chỉnh sửa phù hợp sau duyệt.
7. Attendee thấy session vừa duyệt và thêm agenda sau xác nhận.
8. Reload giữ agenda.
9. Attendee gửi feedback cho session đã kết thúc và đã tham dự.
10. Speaker đọc feedback đó ở SP6.
11. Speaker thêm link tài liệu theo schema chuẩn.
12. Attendee thấy tài liệu trong session detail.
13. Admin tra mã, xác nhận check-in và cập nhật userTickets.
14. Attendee thấy trạng thái check-in mới.
15. Notification liên quan hiển thị ở màn dùng chung.

Kết quả: **15/15 PASS**, không lỗi JavaScript trong chuỗi này. Chi tiết `docs/qa/flow-results.json`.

## 14 kịch bản mở rộng

- Room: chặn capacity 0, tạo phòng hợp lệ, xác nhận lưu trữ.
- Event Alert: gửi thông báo và Attendee nhận được.
- User: chặn email sai, thêm user, xác nhận khóa.
- Attendee AI: lỗi có chủ đích → retry → bỏ chọn/chọn → xác nhận → lưu agenda.
- Speaker AI: lỗi → retry → xác nhận ghi chú → lưu vào session.
- Storage: mô phỏng lỗi ghi → dữ liệu không bị thêm → input còn nguyên → retry thành công.
- Page error: hiển thị lỗi tải và nút thử lại khôi phục.
- Mobile: mở dialog ở 390px, không tràn; reduced-motion tắt animation.
- Materials: upload PDF mock → sửa tên → xác nhận xóa; lưu chung đúng entity.
- Ticket type: tạo loại vé và xác nhận tạm dừng bán.
- Organizer conflict: AI tìm phòng, chưa sửa trước xác nhận, sau xác nhận cập nhật session chung.
- Attendee overlap: chuyển Conflict Resolver, agenda không bị tự lưu khi trùng giờ.
- Register/Login: chặn confirm password sai, đăng ký và đăng nhập route đúng role.
- LocalStorage: toàn bộ key còn lại thuộc danh sách canonical.

Kết quả: **14/14 PASS**. Chi tiết `docs/qa/extended-results.json`. Bốn thông báo native `Transition was aborted ... ViewTransition opt-in disabled` xuất hiện khi tự động hóa đổi tùy chọn motion và chuyển trang nhanh; thao tác vẫn hoàn thành. Đây là giới hạn ghi nhận của chạy headless, không được che bằng cách tắt bộ thu lỗi.

## Kiểm tra trạng thái bổ sung

- Loading và insufficient data của AI Speaker; nút Accept bị khóa khi không có dữ liệu.
- Không cho quản lý tài liệu của session không thuộc Speaker hiện tại.
- Empty agenda và session ID không tồn tại.
- Attendee truy cập trang Admin được chuyển 403.
- Migration key tài liệu/agendaOrder cũ sang canonical rồi xóa key trùng.
- JSON hỏng hiển thị lỗi tải; dữ liệu gốc không bị xóa/seed đè.

Kết quả: **6/6 PASS**, không lỗi JavaScript. Chi tiết `docs/qa/state-results.json`.

## Rà soát tĩnh và dữ liệu

`docs/qa/static-results.json` ghi lại số file, đường dẫn và tham chiếu entity. Chạy Node syntax check cho toàn bộ JavaScript. Không phát hiện import thiếu hoặc trùng khai báo gây syntax error. Các ID tham chiếu users/events/sessions/rooms/ticketTypes đều tồn tại. Alias route không còn trỏ về pages/shared hoặc filename generic Speaker đã bỏ.

## Cách tái hiện nhanh

Mở Live Server cùng origin. Tạo đề xuất bằng Speaker, ghi nhớ tên, đổi Organizer để duyệt, đổi Attendee để lưu. Trạng thái pending và published phải được kiểm tra trên cùng session ID. Để thử upload, dùng file PDF nhỏ; đây là upload mock metadata. Để thử AI lỗi, thêm `?state=ai-error` vào URL AI; để thử lỗi tải, thêm `?state=error`.

Các bài test dùng profile trình duyệt riêng, không đưa dữ liệu QA đã tạo vào JSON bàn giao. Không kiểm thử backend, email thật, scanner thật, thanh toán, Safari/Firefox hay nhiều thiết bị đồng thời. Chưa thực hiện kiểm thử vét cạn mọi field, quyền và tổ hợp bộ lọc.
