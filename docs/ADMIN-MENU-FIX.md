# Menu Admin

Menu desktop và mobile: Tổng quan & phân tích (AD3), Loại vé (AD1), Người dùng (AD2), Check-in (AD4).
Bỏ mục AD3#analytics trùng trang. Đổi trong js/ui.js và thêm nhãn Việt/Anh riêng trong js/i18n.js, không thay nhãn role khác.

Kiểm tra 32 lượt điều hướng thực tế: 4 mục, 4 viewport 1440/1024/768/390, Việt/Anh. Mỗi trang chỉ có một mục active trong từng menu; không tràn ngang hoặc pageerror. Cú pháp JS và diff check đạt.

Gói này bao gồm bản sửa icon và form tài khoản trước đó. Nếu đã áp dụng gói EventPulse-UI-Fixed.zip, chỉ cần chép đè js/ui.js và js/i18n.js. Mở lại bằng Live Server rồi Ctrl+F5. Không cần xóa LocalStorage. Chưa push lên GitHub.
