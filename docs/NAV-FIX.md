# Sửa hai vạch active chồng nhau — 12/10/2026

Xóa rule `.nav a.active:after` tại css/attendee.css (dòng 166–176 bản trước sửa). Giữ `.nav-indicator` dùng chung và hiệu ứng trượt; không thay HTML/JS.

Đã kiểm tra qua HTTP: Catalog và Lịch của tôi, 1440/390px, sáng/tối (8 trường hợp). Desktop chỉ còn 1 indicator cao 3px, thẳng với mục active; pseudo-element cũ không còn. Mobile header nav ẩn đúng breakpoint. Không tràn ngang, không lỗi console hoặc HTTP 404 trong các lượt kiểm tra.

Báo cáo và ảnh UI-FIX trước đó là kết quả của đợt sửa trước; bản vá này bổ sung cho đợt đó.
