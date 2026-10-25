# Sửa icon điều hướng và biểu mẫu tài khoản

Ngày 24/10/2026. Chỉ sửa giao diện và nhãn trợ năng.

- js/ui.js: render icon cho mọi menu, bỏ phụ thuộc vào việc mảng desktop trùng mobile; đổi biểu tượng Cài đặt sang bánh răng SVG.
- css/components.css: căn giữa icon và chữ bằng inline-flex, thêm gap; cho input mật khẩu co lại để nút Hiện/Ẩn không bị ép xuống dòng; điều chỉnh khoảng chữ và chiều cao dòng tiêu đề form.
- css/responsive.css: giữ nút Cài đặt trên tablet/mobile.
- js/modules/account.js: cập nhật aria-label tương ứng trạng thái Hiện/Ẩn.

Kiểm tra Chromium: 48 trường hợp gồm 4 role và login/register, rộng 1440/1024/768/390, sáng/tối. Không tràn ngang, không pageerror; icon menu và nút Cài đặt có mặt; toggle password hoạt động. Kiểm tra cú pháp JS và git diff --check đều đạt. Đây không phải lượt kiểm thử lại toàn bộ nghiệp vụ.

Cách áp dụng: có thể dùng toàn bộ bản này hoặc chỉ chép đè 4 file nêu trên vào bản cùng nguồn. Giữ một bản sao trước khi chép nếu bạn đã tự sửa thêm. Mở bằng Live Server rồi Ctrl+F5. Không cần xóa LocalStorage. Chưa push lên GitHub.
