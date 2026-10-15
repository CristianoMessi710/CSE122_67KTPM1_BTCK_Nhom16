import { mountHome } from './modules/home.js';
import { t, applyTranslations } from './i18n.js';
import { mountHeader, routeURL, currentUser } from './bridge.js';
import { routes as allRoutes, homeByRole } from './routes.js';
import * as U from './ui.js';
import { read, write, commit, uid } from './storage.js';
import { loadData, mockRequest } from './api.js';
import { alertRecipients, conflicts, validateAssignment } from './domain.js';
import { organizerRender, organizerAction, organizerSubmit } from './modules/organizer.js';
import { adminRender, adminAction, adminSubmit } from './modules/admin.js';
import { sharedRender, sharedAction, sharedSubmit } from './modules/shared.js';
const screen = document.body.dataset.screen;
const entry = document.querySelector('script[src*="/js/main.js"]');
const base = new URL('../', import.meta.url).href;
export const routes = allRoutes;
const titles = {
    S1: 'Trang chủ',
    S7: 'Thông báo',
    S8: 'Không có quyền truy cập',
    S9: 'Không tìm thấy trang',
    O1: 'Tổng quan sự kiện',
    O2: 'Quản lý phiên',
    O3: 'Chi tiết duyệt phiên',
    O4: 'Quản lý phòng',
    O5: 'Phát hiện xung đột',
    O6: 'Cảnh báo sự kiện',
    AD1: 'Quản lý loại vé',
    AD2: 'Quản lý người dùng',
    AD3: 'Phân tích sự kiện',
    AD4: 'Quản lý check-in'
};
const descriptions = {
    O1: 'Theo dõi chương trình và tình trạng vận hành của sự kiện.',
    O2: 'Quản lý lịch trình, diễn giả và trạng thái duyệt.',
    O3: 'Kiểm tra nội dung, gán phòng và khung giờ cho phiên.',
    O4: 'Quản lý phòng, sức chứa và thiết bị đi kèm.',
    O5: 'Kiểm tra lịch trình và xử lý các phiên trùng phòng, trùng giờ.',
    O6: 'Thông báo thay đổi đến đúng người, đúng thời điểm.',
    AD1: 'Quản lý loại vé, số lượng và trạng thái bán.',
    AD2: 'Quản lý tài khoản và quyền truy cập sự kiện.',
    AD3: 'Theo dõi hiệu quả sự kiện từ dữ liệu hiện có.',
    AD4: 'Tra cứu vé và xác nhận người tham dự.',
    S7: 'Cập nhật mới nhất dành cho bạn.'
};
export const C = {
    screen,
    base,
    data: {},
    user: null,
    state: { ...Object.fromEntries(new URLSearchParams(location.search)), selected: new Set() },
    url: (id, q = '') => base + (routes[id] || routes.S9) + q,
    go(id, q = '') {
        location.href = this.url(id, q);
    },
    room: (id) => C.data.rooms.find((r) => r.id === id),
    person: (id) => C.data.users.find((u) => u.id === id),
    render,
    toast: U.toast
};
C.home = () => homeByRole[C.user?.role] || 'S1';
C.notification = (
    title,
    message,
    userIds = [C.user?.id],
    type = 'system',
    entityType = '',
    entityId = ''
) =>
    userIds.filter(Boolean).map((userId) => ({
        id: uid('NOT'),
        userId,
        type,
        title,
        message,
        relatedEntityType: entityType,
        relatedEntityId: entityId,
        isRead: false,
        createdAt: new Date().toISOString()
    }));
C.save = async (updates, title, notifications = []) => {
    await mockRequest();
    commit({
        ...updates,
        notifications: [...(updates.notifications || C.data.notifications), ...notifications]
    });
    Object.assign(C.data, updates);
    C.data.notifications = read('notifications');
    if (updates.sessions) C.data.sessions = read('sessions');
    U.toast(title);
};
function shell(content) {
    if (screen === 'S1') return `<main id="main" class="home-main">${content}</main>`;
    return `<main id="main" class="workspace">${content}<p class="footer-note">EventPulse · CSE122 · Dữ liệu mô phỏng</p></main>`;
}
C.head = (actions = '') =>
    `<div class="page-head"><div><h1>${titles[screen]}</h1><p>${descriptions[screen] || ''}</p></div><div class="actions">${actions}</div></div>`;
function render() {
    const focused = document.activeElement?.id;
    const start = document.activeElement?.selectionStart;
    const content = screen.startsWith('O')
        ? organizerRender(C)
        : screen.startsWith('AD')
          ? adminRender(C)
          : sharedRender(C);
    document.querySelector('#app').innerHTML = shell(content);
    mountHeader();
    if (screen === 'S1') {
        mountHome(C);
        applyTranslations();
    }
    if (focused) {
        const input = document.getElementById(focused);
        input?.focus({ preventScroll: true });
        try {
            if (start !== null) input?.setSelectionRange(start, start);
        } catch {}
    }
}
async function boot() {
    try {
        C.data = await loadData(base);
        if (screen === 'O5') {
            const raw = sessionStorage.getItem('eventpulse_pendingAssignment');
            if (raw) {
                const draft = JSON.parse(raw);
                if (C.state.id === draft.id)
                    C.data.sessions = C.data.sessions.map((s) => (s.id === draft.id ? draft : s));
            }
        }
        const current = read('currentUser');
        C.user = current
            ? C.data.users.find((u) => u.id === current.id && u.status === 'active')
            : null;
        if (
            (screen.startsWith('O') && C.user?.role !== 'organizer') ||
            (screen.startsWith('AD') && C.user?.role !== 'admin') ||
            (screen === 'S7' && !C.user)
        ) {
            C.go('S8');
            return;
        }
        render();
        await processScheduled();
        if (screen === 'S8') countdown();
        const context = null;
        if (context?.registerTool) {
            const controller = new AbortController();
            context.registerTool(
                {
                    name: 'list_eventpulse_sessions',
                    description:
                        'Read the current session list visible to the signed-in organizer or admin.',
                    inputSchema: {
                        type: 'object',
                        properties: { status: { type: 'string' } },
                        additionalProperties: false
                    },
                    annotations: { readOnlyHint: true },
                    execute: (input) => {
                        if (!C.user || !['organizer', 'admin'].includes(C.user.role))
                            throw Error('Không đủ quyền');
                        if (
                            !input ||
                            typeof input !== 'object' ||
                            (input.status !== undefined && typeof input.status !== 'string')
                        )
                            throw Error('Trạng thái không hợp lệ');
                        return C.data.sessions
                            .filter((s) => !input.status || s.status === input.status)
                            .map(({ id, title, status, roomId, startTime, endTime }) => ({
                                id,
                                title,
                                status,
                                roomId,
                                startTime,
                                endTime
                            }));
                    }
                },
                { signal: controller.signal }
            );
            window.addEventListener('pagehide', () => controller.abort(), { once: true });
        }
    } catch (e) {
        document.querySelector('#app').innerHTML =
            `<main class="workspace">${U.empty('Không thể tải EventPulse', e.message, U.btn('Thử lại', 'retry-load', 'primary') + U.link('Trang chủ', C.url('S1')))}</main>`;
    }
}
function countdown() {
    let n = 8;
    const timer = setInterval(() => {
        n--;
        const el = document.getElementById('countdown');
        if (el) el.textContent = n;
        if (n <= 0) {
            clearInterval(timer);
            C.go(C.home());
        }
    }, 1000);
}
async function processScheduled() {
    const due = C.data.eventAlerts.filter(
        (a) => a.status === 'scheduled' && new Date(a.scheduledAt) <= new Date()
    );
    if (!due.length) return;
    const notifications = [];
    const alerts = C.data.eventAlerts.map((a) => {
        if (!due.some((x) => x.id === a.id)) return a;
        const recipients = alertRecipients(a, C.data);
        notifications.push(
            ...C.notification(a.title, a.message, recipients, 'schedule-change', 'eventAlert', a.id)
        );
        return {
            ...a,
            status: 'published',
            sentAt: new Date().toISOString(),
            recipientIds: recipients
        };
    });
    try {
        commit({ eventAlerts: alerts, notifications: [...C.data.notifications, ...notifications] });
        C.data.eventAlerts = alerts;
        C.data.notifications.push(...notifications);
        render();
    } catch {
        U.toast('Chưa thể gửi cảnh báo đã lên lịch. Sẽ thử lại.', true);
    }
}
setInterval(() => {
    if (C.data.eventAlerts) processScheduled();
}, 15000);
window.addEventListener('storage', () => {
    if (C.data.sessions) {
        const previous = conflicts(C.data.sessions).length;
        for (const key of Object.keys(C.data)) C.data[key] = read(key, C.data[key]);
        const user = C.data.users.find((u) => u.id === C.user?.id);
        if (C.user && (!user || user.status !== 'active' || user.role !== C.user.role)) {
            write('currentUser', null);
            C.go('S8');
            return;
        }
        if (conflicts(C.data.sessions).length > previous)
            U.toast('Phát hiện xung đột lịch mới. Kiểm tra mục Xung đột.', true);
        render();
    }
});
document.addEventListener('mousedown', (e) => {
    if (e.target.closest('[data-action="format"]')) e.preventDefault();
});
let searchTimer;
document.addEventListener('input', (e) => {
    const filter = e.target.dataset.filter;
    if (filter) {
        clearTimeout(searchTimer);
        searchTimer = setTimeout(
            () => {
                C.state[filter] = e.target.value;
                render();
            },
            filter === 'q' ? 180 : 0
        );
    }
});
document.addEventListener('change', (e) => {
    const f = e.target.closest('form[data-form="assignment"]');
    if (f) {
        const old = C.data.sessions.find((s) => s.id === f.dataset.id);
        const values = Object.fromEntries(new FormData(f));
        const errors = validateAssignment(
            { ...old, ...values, capacity: +values.capacity },
            C.data.sessions,
            C.data.rooms
        );
        document.getElementById('availability').innerHTML = Object.keys(errors).length
            ? U.notice('Chưa thể phân công', Object.values(errors).join(' '), 'warning')
            : U.notice(
                  'Phòng khả dụng',
                  'Phòng và sức chứa phù hợp với khung giờ đã chọn.',
                  'success'
              );
    }
});
document.addEventListener('change', (e) => {
    if (e.target.dataset.filter) {
        C.state[e.target.dataset.filter] = e.target.value;
        render();
    }
    if (e.target.dataset.select) {
        e.target.checked
            ? C.state.selected.add(e.target.dataset.select)
            : C.state.selected.delete(e.target.dataset.select);
        const target = document.getElementById('selected-count');
        if (target) target.textContent = C.state.selected.size;
    }
    if (e.target.dataset.action === 'select-all') {
        document.querySelectorAll('[data-select]').forEach((x) => {
            x.checked = e.target.checked;
            x.checked
                ? C.state.selected.add(x.dataset.select)
                : C.state.selected.delete(x.dataset.select);
        });
        const t = document.getElementById('selected-count');
        if (t) t.textContent = C.state.selected.size;
    }
});
document.addEventListener('click', async (e) => {
    const target = e.target.closest('[data-action]');
    if (!target) return;
    const action = target.dataset.action;
    if (action === 'close') {
        U.close();
        return;
    }
    if (action === 'confirm' || action === 'select-all') return;
    if (action === 'menu') {
        const nav = document.querySelector('.nav');
        nav.classList.toggle('open');
        target.setAttribute('aria-expanded', nav.classList.contains('open'));
        return;
    }
    if (action === 'retry-load') {
        const url = new URL(location.href);
        url.searchParams.delete('state');
        location.href = url;
        return;
    }
    if (action === 'clear-filters') {
        C.state = { selected: new Set() };
        render();
        return;
    }
    try {
        if (await sharedAction(C, action, target)) return;
        if (screen.startsWith('O')) await organizerAction(C, action, target);
        else if (screen.startsWith('AD')) await adminAction(C, action, target);
    } catch (error) {
        U.toast(error.message, true);
    }
});
document.addEventListener('submit', async (e) => {
    if (!e.target.dataset.form) return;
    e.preventDefault();
    const form = e.target;
    const submit = e.submitter;
    form.dataset.intent = submit?.value || '';
    const old = submit?.innerHTML;
    if (submit) {
        submit.disabled = true;
        submit.innerHTML = 'Đang lưu…';
    }
    try {
        if (!(await sharedSubmit(C, form))) {
            if (screen.startsWith('O')) await organizerSubmit(C, form);
            else if (screen.startsWith('AD')) await adminSubmit(C, form);
        }
    } catch (error) {
        let banner = form.querySelector('.save-error');
        if (!banner) {
            banner = document.createElement('div');
            banner.className = 'save-error';
            form.prepend(banner);
        }
        banner.innerHTML = U.notice('Không thể lưu', error.message, 'error');
    } finally {
        if (submit?.isConnected) {
            submit.disabled = false;
            submit.innerHTML = old;
        }
    }
});
boot();

window.addEventListener('ep:locale', () => {
    if (screen === 'S1') {
        render();
        const dialog = document.querySelector('#dialog');
        if (dialog?.open)
            window.EP.toast(t('common.language') + ': ' + document.documentElement.lang, 'info');
    }
});
