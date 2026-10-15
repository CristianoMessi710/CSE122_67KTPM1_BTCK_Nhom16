import { homeRender } from './home.js';
import * as U from '../ui.js';
import { write, uid } from '../storage.js';
const { esc, icon, btn, link, badge, empty, filter, field, notice } = U;
export function sharedRender(c) {
    const d = c.data,
        s = c.state;
    if (c.screen === 'S1') return homeRender(c);
    if (c.screen === 'S7') {
        const all = d.notifications.filter((n) => n.userId === c.user.id);
        const list = (s.state === 'empty' ? [] : all)
            .filter((n) => (!s.type || n.type === s.type) && (!s.unread || !n.isRead))
            .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
        return (
            c.head(btn('Đánh dấu tất cả đã đọc', 'read-all', 'primary')) +
            `<div class="filters">${filter(
                'type',
                [
                    ['general', 'Thông tin chung'],
                    ['schedule-change', 'Thay đổi lịch'],
                    ['ticket', 'Vé'],
                    ['feedback', 'Phản hồi'],
                    ['reminder', 'Nhắc lịch'],
                    ['system', 'Hệ thống']
                ],
                s.type,
                'Tất cả loại thông báo'
            )}${filter('unread', [['1', 'Chưa đọc']], s.unread, 'Tất cả trạng thái')}<span class="muted">${all.filter((n) => !n.isRead).length} chưa đọc</span></div><section class="panel">${list.map((n) => `<article class="notification ${n.isRead ? '' : 'unread'}"><div class="avatar">${icon('bell')}</div><div class="info"><h3>${esc(n.title)}</h3><p class="muted">${esc(n.message.replace(/<[^>]*>/g, ''))}</p><small>${U.date(n.createdAt)} · ${U.time(n.createdAt)}</small></div><div class="actions">${n.isRead ? badge('completed', 'Đã đọc') : btn('Đánh dấu đã đọc', 'read-notification', 'small', `data-id="${n.id}"`)}</div></article>`).join('') || empty('Bạn chưa có thông báo nào', 'Các cập nhật liên quan đến bạn sẽ xuất hiện tại đây.')}</section>`
        );
    }
    if (c.screen === 'S8')
        return `<section class="error-page"><p class="error-code">403</p><h1>Bạn chưa có quyền truy cập</h1><p class="muted">Trang này dành cho vai trò khác. ${c.user ? 'Bạn đang dùng tài khoản ' + esc(U.labels[c.user.role]) + '.' : 'Hãy đăng nhập để tiếp tục.'}</p><p>Tự chuyển về trang phù hợp sau <strong id="countdown">8</strong> giây.</p><div class="actions">${link('Về trang phù hợp', c.url(c.home()), 'primary')}${btn('Chọn tài khoản demo', 'login')}</div></section>`;
    return `<section class="error-page"><p class="error-code">404</p><h1>Không tìm thấy trang</h1><p class="muted">Đường dẫn có thể đã thay đổi hoặc không tồn tại. Bạn có thể quay lại và tiếp tục khám phá EventPulse.</p><div class="actions">${btn(icon('back') + ' Quay lại', 'history-back')}${link('Về trang chủ', c.url('S1'), 'primary')}</div></section>`;
}
export async function sharedAction(c, a, t) {
    if (a === 'login') {
        c.go('S2');
        return true;
    }
    if (a === 'register') {
        c.go('S3');
        return true;
    }
    if (a === 'account') {
        U.modal(
            'Truy cập bản demo',
            `<p class="muted">Chọn tài khoản mẫu để kiểm tra từng vai trò. Đây là đăng nhập mô phỏng, không dùng mật khẩu thật.</p><form data-form="demo-login">${field(
                'userId',
                'Tài khoản mẫu *',
                c.user?.id || 'USR008',
                'text',
                c.data.users
                    .filter((u) => u.status === 'active')
                    .map((u) => [u.id, `${u.fullName} · ${U.labels[u.role]}`])
            )}<div class="modal-actions">${c.user ? btn('Đăng xuất', 'logout') : ''}<button class="btn primary" type="submit">Vào ứng dụng</button></div></form>`
        );
        return true;
    }
    if (a === 'logout') {
        write('currentUser', null);
        c.go('S1');
        return true;
    }
    if (a === 'register') {
        U.modal(
            'Đăng ký tham dự · demo',
            `<p class="muted">Tạo hồ sơ người tham dự trên trình duyệt để kiểm tra thông báo. Luồng tài khoản đầy đủ sẽ tích hợp với phần Shared của nhóm.</p><form data-form="demo-register" novalidate>${field('fullName', 'Họ và tên *')}${field('email', 'Email *', '', 'email')}<div class="modal-actions">${btn('Hủy', 'close')}<button class="btn primary" type="submit">Tạo hồ sơ demo</button></div></form>`
        );
        return true;
    }
    if (a === 'prev-slide' || a === 'next-slide') {
        const len = c.data.sessions.filter((s) =>
            ['approved', 'published'].includes(s.status)
        ).length;
        c.state.slide =
            ((c.state.slide || 0) + (a === 'next-slide' ? 1 : -1) + len) % Math.max(1, len);
        c.render();
        return true;
    }
    if (a === 'history-back') {
        if (history.length > 1) history.back();
        else c.go('S1');
        return true;
    }
    if (a === 'read-all' || a === 'read-notification') {
        const notifications = c.data.notifications.map((n) =>
            n.userId === c.user.id && (a === 'read-all' || n.id === t.dataset.id)
                ? { ...n, isRead: true }
                : n
        );
        await c.save({ notifications }, 'Đã đánh dấu đã đọc.');
        c.render();
        return true;
    }
    return false;
}
export async function sharedSubmit(c, f) {
    const v = Object.fromEntries(new FormData(f));
    if (f.dataset.form === 'demo-login') {
        const user = c.data.users.find((u) => u.id === v.userId && u.status === 'active');
        if (!user) throw Error('Tài khoản không khả dụng.');
        write('currentUser', { id: user.id, role: user.role });
        c.user = user;
        c.go(['attendee', 'speaker'].includes(user.role) ? 'S7' : c.home());
        return true;
    }
    if (f.dataset.form === 'demo-register') {
        const errors = {};
        if (v.fullName.trim().length < 2) errors.fullName = 'Nhập họ tên ít nhất 2 ký tự.';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email)) errors.email = 'Email không hợp lệ.';
        if (c.data.users.some((u) => u.email.toLowerCase() === v.email.trim().toLowerCase()))
            errors.email = 'Email đã được sử dụng.';
        if (U.showErrors(f, errors)) return true;
        const user = {
            id: uid('USR'),
            fullName: v.fullName.trim(),
            email: v.email.trim().toLowerCase(),
            phone: '',
            avatar: '',
            role: 'attendee',
            status: 'active',
            interests: [],
            bio: '',
            expertise: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        await c.save({ users: [...c.data.users, user] }, 'Đã tạo hồ sơ demo.');
        write('currentUser', { id: user.id, role: user.role });
        c.go('S7');
        return true;
    }
    return false;
}
