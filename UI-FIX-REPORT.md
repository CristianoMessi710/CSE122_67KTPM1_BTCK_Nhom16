# UI-FIX-REPORT — EventPulse

Ngày kiểm tra: 12/10/2026. Sửa trên bản EventPulse-Merged đã bàn giao.

## Phạm vi và giới hạn mục 7

Chỉ sửa **11 file CSS và hàm initials trong js/ui.js**. Đối chiếu byte xác nhận mọi HTML, JSON và các JS nghiệp vụ giữ nguyên. Không đổi tên class, không thêm thư viện chạy trong dự án.

**Mục 7 có hai yêu cầu mâu thuẫn:** chỉ được sửa CSS/initials nhưng cần gắn class trong hàm render khác. Bản này ưu tiên giới hạn phạm vi: đã định nghĩa modifier published/pending/rejected/completed và tô đúng màu biểu đồ hiện hữu bằng CSS theo thứ tự cố định của renderer O1. Không sửa renderer để gắn class. Vì thế kết quả hiển thị đạt, nhưng phần “áp class tương ứng ở nơi render” **chưa thực hiện**. Nếu renderer đổi thứ tự trạng thái sau này, cần cập nhật mapping CSS hoặc cho phép thay markup render.

## Kết quả 10 mục

| Mục | Kết quả | Cách sửa và bằng chứng |
|---|---|---|
| 1. Tìm kiếm | Đạt | Rule chung dùng :where; .search > input padding-left 40px; icon 20px, top 50%, translateY(-50%). Padding cũ đo được 12px. |
| 2. Grid | Đạt | Bỏ .card + .card. Ba thẻ Catalog cùng hàng có top bằng nhau; trước đó thẻ 2/3 lệch 16px. Speaker cũng thẳng hàng. |
| 3. Bộ lọc | Đạt trong viewport nghiệm thu | Search flex-basis 240px, select width auto/min-width 160px; mobile từng control một hàng. Ô tìm kiếm Catalog trong label được cấp ít nhất 240px ở desktop. Nút chuyển hàng khi tổng control vượt chỗ trống, không ép nhỏ chữ. |
| 4. Nút phòng | Đạt | Bỏ giới hạn 105px. Desktop ba nút Xem lịch/Sửa/Lưu trữ cùng hàng, cao 44px, căn phải; mobile nhóm nằm dưới, rộng toàn thẻ. |
| 5. Initials | Đạt | Lấy ký tự đầu từ đầu/từ cuối, trim + split khoảng trắng, toUpperCase; rỗng/null/undefined trả chuỗi rỗng. “Ban tổ chức demo” → “BD”. |
| 6. Notice | Đạt | Chữ var(--text); icon/viền trái dùng semantic warning/error; nền soft theo tone và theme. |
| 7. Tiến độ | Đạt màu; giới hạn gắn class như trên | 4 thanh O1 đo được success #22C55E, warning #F59E0B, error #EF4444, info #3B82F6. Renderer đang dùng .bar span, không phải .progress span. |
| 8. Badge | Đạt | Một bộ tại components.css, bỏ border-left. Nền/ink semantic; tương phản tối thiểu 6,36:1, vượt 4,5:1. |
| 9. Dark mode | Đạt kiểm tra nêu dưới | Token dark tại tokens.css; bỏ các rule đổi riêng body. Sửa màu surface hard-code và foreground trên nút primary; sửa thêm sao đánh giá bị tối. |
| 10. Icon meta | Đạt | Inline-flex, align-items center, gap 6px; .icon-svg chỉ có một định nghĩa 20px/stroke 1.8. |

## Kiểm thử HTTP và ảnh trước/sau

Chạy Chromium qua HTTP server, không dùng file://. 5 màn: A1 Catalog, O4 Rooms, O1 Dashboard, AD2 Users, SP2 My Session. Mỗi màn kiểm tra **1440×844 và 390×844**, theme light/dark: **20 trường hợp trước + 20 sau**, có 40 ảnh full-page.

- 20/20 trường hợp sau sửa: không tràn ngang, không pageerror, console error hoặc response 404 trong lượt nghiệm thu.
- Đo vị trí icon/ô nhập, hàng card, nhóm nút phòng, bộ lọc và màu thanh tiến độ qua computed styles/DOMRect.
- Rà 32 màn ở dark mode để phát hiện chữ tối trên nền tối. Phát hiện sao A6 có tương phản 1,94:1; đã sửa sang --muted và kiểm tra lại A6 không còn lỗi này.
- Tạo badge thử nghiệm với đủ 5 biến thể ở cả hai theme để đo tương phản; không thêm các phần tử thử vào mã nguồn.
- Các số liệu nằm trong `docs/ui-review/*-results.json`, `audit-recheck.json`. Đây là nghiệm thu giao diện; không tuyên bố đã chạy lại toàn bộ CRUD vì JS nghiệp vụ không đổi.

| Badge | Light | Dark |
|---|---:|---:|
| green | 6.49:1 | 8.73:1 |
| yellow | 6.37:1 | 9.00:1 |
| red | 6.80:1 | 7.15:1 |
| blue | 7.15:1 | 6.85:1 |
| purple | 8.77:1 | 6.76:1 |

## Nơi xem ảnh

Ảnh nằm trong `docs/ui-review/before/` và `docs/ui-review/after/`. Tên file: `{ID}-{chiều rộng}-{light|dark}.png`. Ví dụ `O4-1440-dark.png` cho trang phòng desktop tối. Các ảnh dùng dữ liệu mẫu của dự án, không lấy thông tin tài khoản thật.

## File và dòng thay đổi

Toàn bộ diff có số dòng cũ/mới trong **docs/UI-FIX.patch**; từng file có bản `.diff` riêng trong `docs/ui-review/`. Dấu `@@ -dòng_cũ,số_dòng +dòng_mới,số_dòng @@` chỉ rõ vị trí sửa. Việc hợp nhất selector và định dạng lại khiến số dòng thay đổi trên nhiều đoạn; dùng patch để xem chính xác thay vì đối chiếu số dòng bản cũ.

| File | Dòng thêm/xóa | Đoạn diff |
|---|---:|---:|
| `css/attendee.css` | +281 / −155 | 33 |
| `css/components.css` | +640 / −183 | 22 |
| `css/responsive.css` | +106 / −36 | 7 |
| `css/speaker-interest-forecast.css` | +56 / −43 | 10 |
| `css/speaker-materials.css` | +75 / −29 | 16 |
| `css/speaker-my-sessions.css` | +59 / −64 | 13 |
| `css/speaker-profile.css` | +75 / −12 | 15 |
| `css/speaker-session-edit.css` | +105 / −54 | 13 |
| `css/speaker-settings.css` | +109 / −45 | 15 |
| `css/style.css` | +46 / −517 | 41 |
| `css/tokens.css` | +32 / −0 | 1 |
| `js/ui.js` | +10 / −6 | 1 |

Các điểm chính theo số dòng **bản sau sửa**:

| File | Dòng bắt đầu | Nội dung |
|---|---:|---|
| `css/tokens.css` | 37 | Bộ token dark |
| `css/tokens.css` | 27 | Màu nền/ink semantic |
| `css/components.css` | 329 | Rule form specificity thấp |
| `css/components.css` | 889 | Padding 40px |
| `css/components.css` | 895 | Căn giữa icon |
| `css/components.css` | 904 | Flex toolbar/filter |
| `css/components.css` | 943 | Nút phòng |
| `css/components.css` | 958 | Badge chung |
| `css/components.css` | 457 | Notice warning |
| `css/components.css` | 1067 | Modifier tiến độ |
| `css/components.css` | 1091 | Mapping O1 không sửa render |
| `css/components.css` | 1107 | Trục icon meta |
| `css/components.css` | 855 | SVG chung |
| `css/responsive.css` | 328 | Bộ lọc mobile |
| `js/ui.js` | 85 | Hàm initials |

## Kết quả gộp CSS

Không còn selector toàn cục trùng giữa style.css và components.css (đã so sánh bằng parser CSS). Các family .badge/.search/.avatar/.icon-svg được bỏ khỏi CSS role để dùng component chung. Rule trong breakpoint responsive là override theo kích thước, không phải bộ component độc lập.

Token sáng chính giữ nguyên. Các token soft/ink và dark được thêm vào tokens.css theo yêu cầu mới; CSS khác tham chiếu token. --on-primary tách màu chữ trên nền primary khỏi --surface để dark mode không biến chữ nút thành tối.

## Cách mở

Giải nén ZIP, mở index.html bằng VS Code Live Server. Chọn demo role; vào Cài đặt chọn Sáng/Tối hoặc dùng cùng tài khoản khi kiểm tra trang thuộc role đó. Ctrl+Shift+M để đặt chiều rộng 390/1440. Nếu trình duyệt dùng CSS cũ, Ctrl+F5 để tải lại.
