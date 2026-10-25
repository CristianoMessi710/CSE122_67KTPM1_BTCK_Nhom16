import { t, locale } from './i18n.js';
const html = (parts, ...values) =>
    parts.reduce((result, part, index) => result + part + (values[index] ?? ''), '');
export const esc = (v) =>
    String(v ?? '').replace(
        /[&<>"']/g,
        (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]
    );
export const icons = {
    grid: 'M3 3h7v7H3z M14 3h7v7h-7z M3 14h7v7H3z M14 14h7v7h-7z',
    calendar:
        'M5 5h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2 M7 3v4 M17 3v4 M3 10h18',
    room: 'M4 21h16 M6 21V3h12v18 M10 3v18 M14 12h.01',
    bell: 'M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9 M10 21h4',
    users: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2 M9 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8 M17 4a4 4 0 0 1 0 7 M22 21v-2a4 4 0 0 0-3-3.87',
    ticket: 'M3 5h18v5a2 2 0 0 0 0 4v5H3v-5a2 2 0 0 0 0-4z M9 5v14',
    check: 'm5 12 4 4L19 6',
    clock: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18 M12 7v5l3 2',
    search: 'M11 3a8 8 0 1 0 0 16 8 8 0 0 0 0-16 m6 14 4 4',
    plus: 'M12 5v14 M5 12h14',
    arrow: 'M4 12h16 m-6-6 6 6-6 6',
    chart: 'M3 3v18h18 M7 16v-5 M12 16V7 M17 16v-8',
    alert: 'm12 3 10 18H2z M12 9v4 M12 17h.01',
    spark: 'm12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5z',
    download: 'M12 3v12 m-5-5 5 5 5-5 M4 16v5h16v-5',
    menu: 'M3 6h18 M3 12h18 M3 18h18',
    close: 'm6 6 12 12 M6 18 18 6',
    mail: 'M3 5h18v14H3z m0 0 9 8 9-8',
    pin: 'M12 21s7-7 7-12a7 7 0 0 0-14 0c0 5 7 12 7 12 M12 6a3 3 0 1 0 0 6 3 3 0 0 0 0-6',
    shield: 'm12 3 8 3v6c0 6-8 9-8 9s-8-3-8-9V6z',
    back: 'M20 12H4 m6-6-6 6 6 6'
};
export const icon = (n) =>
    `<svg class="icon-svg" aria-hidden="true" viewBox="0 0 24 24"><path d="${icons[n] || icons.grid}"/></svg>`;
export const btn = (text, action, cls = '', extra = '') =>
    `<button type="button" class="btn ${cls}" data-action="${action}" ${extra}>${text}</button>`;
export const link = (text, href, cls = '') => `<a class="btn ${cls}" href="${href}">${text}</a>`;
export const labels = {
    approved: 'Đã duyệt',
    published: 'Đã công bố',
    pending: 'Chờ duyệt',
    rejected: 'Từ chối',
    completed: 'Hoàn thành',
    draft: 'Bản nháp',
    cancelled: 'Đã hủy',
    archived: 'Đã lưu trữ',
    active: 'Đang hoạt động',
    available: 'Còn trống',
    occupied: 'Đang sử dụng',
    maintenance: 'Bảo trì',
    disabled: 'Ngừng sử dụng',
    inactive: 'Ngừng bán',
    soldOut: 'Đã bán hết',
    valid: 'Hợp lệ',
    checkedIn: 'Đã check-in',
    expired: 'Hết hạn',
    locked: 'Đã khóa',
    scheduled: 'Đã lên lịch',
    attendee: 'Người tham dự',
    speaker: 'Diễn giả',
    organizer: 'Ban tổ chức',
    admin: 'Quản trị viên',
    info: 'Thông tin',
    warning: 'Lưu ý',
    urgent: 'Khẩn cấp'
};
for (const role of ['attendee', 'speaker', 'organizer', 'admin']) {
    Object.defineProperty(labels, role, { enumerable: true, get: () => t('role.' + role) });
}
export const badge = (s, text) =>
    `<span class="badge ${['approved', 'published', 'active', 'available', 'valid', 'checkedIn'].includes(s) ? 'green' : ['pending', 'scheduled', 'occupied', 'warning', 'soldOut'].includes(s) ? 'yellow' : ['rejected', 'cancelled', 'locked', 'urgent', 'expired'].includes(s) ? 'red' : ['speaker', 'organizer', 'admin'].includes(s) ? 'purple' : ''}">${esc(text || labels[s] || s)}</span>`;
export const kpis = (items) =>
    `<div class="kpis">${items.map(([n, l, i]) => `<div class="kpi"><div class="kpi-icon">${icon(i)}</div><div><strong>${esc(n)}</strong><span>${esc(l)}</span></div></div>`).join('')}</div>`;
export const money = (n) => new Intl.NumberFormat(locale()).format(n) + ' ₫';
export const date = (s) =>
    s
        ? new Intl.DateTimeFormat(locale(), {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric'
          }).format(new Date(/^\d{4}-\d{2}-\d{2}$/.test(s) ? s + 'T00:00:00' : s))
        : t('common.notSelected');
export const time = (s) =>
    s
        ? new Intl.DateTimeFormat(locale(), {
              hour: '2-digit',
              minute: '2-digit',
              hour12: false
          }).format(new Date(/^\d{4}-\d{2}-\d{2}$/.test(s) ? s + 'T00:00:00' : s))
        : '—';
export const initials = (name = '') => {
    const words = String(name ?? '')
        .trim()
        .split(/\s+/)
        .filter(Boolean);
    if (!words.length) return '';
    const first = Array.from(words[0])[0];
    const last = words.length > 1 ? Array.from(words.at(-1))[0] : '';
    return (first + last).toUpperCase();
};
export const empty = (title, text = '', cta = '') =>
    `<div class="empty"><div class="empty-icon">${icon('calendar')}</div><h3>${esc(title)}</h3><p>${esc(text)}</p>${cta}</div>`;
export const notice = (title, text, type = '') =>
    `<div class="notice ${type}" role="${type === 'error' ? 'alert' : 'status'}">${icon(type === 'error' || type === 'warning' ? 'alert' : 'check')}<div><strong>${esc(title)}</strong><p>${esc(text)}</p></div></div>`;
export const search = (value, placeholder = 'Tìm kiếm…') =>
    `<div class="search">${icon('search')}<input id="search" aria-label="${placeholder}" data-filter="q" value="${esc(value || '')}" placeholder="${placeholder}"></div>`;
export const options = (items, value, placeholder) =>
    `${placeholder ? `<option value="">${esc(placeholder)}</option>` : ''}${items
        .map((x) => {
            const [v, t] = Array.isArray(x) ? x : [x, labels[x] || x];
            return `<option value="${esc(v)}" ${v === value ? 'selected' : ''}>${esc(t)}</option>`;
        })
        .join('')}`;
export const filter = (key, items, value, placeholder) =>
    `<select id="filter-${key}" data-filter="${key}" aria-label="${esc(placeholder)}">${options(items, value, placeholder)}</select>`;
export function field(name, label, value = '', type = 'text', items = null, extra = '') {
    return `<div class="field ${extra.includes('full') ? 'full' : ''}"><label for="f-${name}">${label}</label>${items ? `<select id="f-${name}" name="${name}">${options(items, value, t('common.select'))}</select>` : type === 'textarea' ? `<textarea id="f-${name}" name="${name}" maxlength="2000">${esc(value)}</textarea>` : `<input id="f-${name}" name="${name}" type="${type}" value="${esc(value)}" ${type === 'number' ? 'step="1"' : ''}>`}<span class="field-error" data-error="${name}" aria-live="polite"></span></div>`;
}
export function showErrors(form, errors) {
    form.querySelectorAll('[data-error]').forEach(
        (x) => (x.textContent = errors[x.dataset.error] || '')
    );
    for (const input of form.querySelectorAll('input,select,textarea')) {
        input.setAttribute('aria-invalid', errors[input.name] ? 'true' : 'false');
    }
    if (Object.keys(errors).length) {
        form.querySelector(`[name="${Object.keys(errors)[0]}"]`)?.focus();
        return true;
    }
    return false;
}
export const table = (heads, rows) =>
    `<div class="table-wrap"><table class="data-table"><thead><tr>${heads.map((h) => `<th scope="col">${h}</th>`).join('')}</tr></thead><tbody>${rows.join('')}</tbody></table></div>`;
export const cell = (label, html, cls = '') =>
    `<td data-label="${esc(label)}" class="${cls}">${html}</td>`;
export function modal(title, content) {
    const d = document.querySelector('#dialog');
    delete d.dataset.kind;
    d.innerHTML = `${btn(icon('close'), 'close', 'icon close', `aria-label="${t('common.close')}"`)}<h2 id="dialog-title">${esc(title)}</h2>${content}`;
    if (!d.open) d.showModal();
    return d;
}
export function close() {
    document.querySelector('#dialog').close();
}
export function confirm(title, text, action) {
    return new Promise((resolve) => {
        const d = modal(
            title,
            `<p class="muted">${esc(text)}</p><div class="modal-actions">${btn(t('common.cancel'), 'close')}${btn(action, 'confirm', 'primary')}</div>`
        );
        let settled = false;
        const done = (v) => {
            if (settled) return;
            settled = true;
            d.removeEventListener('click', click);
            d.removeEventListener('close', cancel);
            close();
            resolve(v);
        };
        const click = (e) => {
            if (e.target.closest('[data-action="confirm"]')) done(true);
        };
        const cancel = () => done(false);
        d.addEventListener('click', click);
        d.addEventListener('close', cancel, { once: true });
    });
}
export function toast(text, type = 'success') {
    const status =
        type === true
            ? 'error'
            : ['success', 'error', 'warning', 'info'].includes(type)
              ? type
              : 'success';
    const el = document.createElement('div');
    el.className = 'toast ' + status;
    el.setAttribute('role', status === 'error' ? 'alert' : 'status');
    el.innerHTML =
        icon(status === 'success' ? 'check' : status === 'info' ? 'bell' : 'alert') +
        `<span>${esc(text)}</span>`;
    document.querySelector('#toasts').append(el);
    setTimeout(() => el.remove(), 6000);
}
export const loading = (text) =>
    `<div class="loading" role="status"><span class="spinner"></span>${esc(text)}</div>`;
export const barChart = (items) =>
    `<div class="bar-chart">${items.map(([name, val, max, color]) => `<div class="bar-row"><div class="bar-label"><span>${esc(name)}</span><strong>${esc(val)}</strong></div><div class="bar"><span style="width:${Math.min(100, (100 * val) / Math.max(1, max))}%;background:${color || 'var(--primary)'}"></span></div></div>`).join('')}</div>`;

// One shell for every role; role changes only the menu destinations.
export function header(user, screen, url, unread = 0) {
    const menus = {
        attendee: [
            ['A1', 'nav.sessionCatalog', 'calendar'],
            ['A3', 'nav.myAgenda', 'clock'],
            ['A1#speakers', 'nav.speakers', 'users'],
            ['S1#about', 'nav.events', 'grid']
        ],
        speaker: [
            ['SP1', 'nav.dashboard', 'grid'],
            ['SP2', 'nav.mySession', 'calendar'],
            ['SP4', 'nav.materials', 'upload'],
            ['SP1#speakerForm', 'nav.profile', 'users']
        ],
        organizer: [
            ['O1', 'nav.dashboard', 'grid'],
            ['O2', 'nav.sessionCatalog', 'calendar'],
            ['O4', 'nav.rooms', 'room'],
            ['O6', 'nav.alerts', 'bell']
        ],
        admin: [
            ['AD3', 'nav.adminOverview', 'chart'],
            ['AD1', 'nav.ticketTypes', 'ticket'],
            ['AD2', 'nav.users', 'users'],
            ['AD4', 'nav.checkIn', 'check']
        ]
    };
    const home = screen === 'S1';
    const homeMenu = [
        ['S1#about', 'home.nav.about', 'grid'],
        ['S1#ai', 'home.nav.ai', 'spark'],
        ['S1#roles', 'home.nav.roles', 'users'],
        ['S1#featured', 'home.nav.sessions', 'calendar']
    ];
    const desktop = home || !user ? homeMenu : menus[user.role];
    const mobile =
        home || !user
            ? [
                  ['S1#about', 'nav.home', 'grid'],
                  ['S1#featured', 'nav.sessionCatalog', 'calendar'],
                  ['S1#roles', 'home.nav.roles', 'users'],
                  ['S1#speakers', 'nav.speakers', 'users']
              ]
            : user.role === 'attendee'
              ? [
                    ['S1', 'nav.home', 'grid'],
                    ['A1', 'nav.sessionCatalog', 'calendar'],
                    ['A3', 'nav.myAgenda', 'clock'],
                    ['S5', 'nav.profile', 'users']
                ]
              : menus[user.role];
    const href = (id) => {
        const [route, anchor] = id.split('#');
        return route === screen && anchor
            ? '#' + anchor
            : url(route) + (anchor ? '#' + anchor : '');
    };
    const active = (id, items) => {
        const [route, hash] = id.split('#');
        const exact = !!location.hash && items.some(([item]) => item === screen + location.hash);
        if (hash)
            return (
                route === screen &&
                (location.hash === '#' + hash || (home && !location.hash && hash === 'about'))
            );
        return (
            !exact &&
            (id === screen ||
                (screen === 'O3' && id === 'O2') ||
                (screen === 'SP3' && id === 'SP2'))
        );
    };
    const links = (items) =>
        items
            .map(
                ([id, key, ico]) =>
                    `<a href="${href(id)}" data-nav-key="${id}" class="${active(id, items) ? 'active' : ''}" ${active(id, items) ? 'aria-current="page"' : ''}>${icon(ico)}<span>${t(key)}</span></a>`
            )
            .join('');
    const avatar =
        user?.avatar && /^(data:image\/(png|jpeg|webp);base64,|assets\/)/.test(user.avatar)
            ? `<img class="avatar" alt="${t('aria.avatar')}" src="${esc(user.avatar.startsWith('assets/') ? new URL(user.avatar, new URL('../', import.meta.url)).href : user.avatar)}">`
            : `<span class="avatar">${esc(initials(user?.fullName || 'EP'))}</span>`;
    const group = home || !user ? 'home' : user.role;
    const account =
        user && !home
            ? `<a class="icon-btn" data-notification-link href="${url('S7')}" aria-label="${t('aria.notifications', { count: unread })}">${icon('bell')}${unread ? `<span class="count">${unread}</span>` : ''}</a><a class="icon-btn profile-link" href="${url(user.role === 'speaker' ? 'SP1' : 'S5')}" aria-label="${t('aria.profile')}">${avatar}</a><a class="icon-btn settings-link" href="${url('S6')}" aria-label="${t('nav.settings')}">${icon('settings')}</a>`
            : `<a class="btn btn-secondary home-login" href="${url('S2')}">${t('common.login')}</a>`;
    return html`<header class="app-header">
            <div class="header-inner">
                <a class="brand" href="${url('S1')}" aria-label="EventPulse"
                    ><span class="brandmark">${icon('spark')}</span>EventPulse</a
                >
                <nav
                    id="header-nav"
                    class="nav"
                    data-nav-group="${group}"
                    aria-label="${t('aria.mainNav')}"
                >
                    ${links(desktop)}
                </nav>
                <div class="header-actions">
                    ${account}<button
                        class="btn ${home ? 'btn-primary' : 'btn-ghost'} demo-button"
                        type="button"
                        data-switch-role
                    >
                        ${t(user && !home ? 'common.switchRole' : 'common.demo')}</button
                    >${home ? `<button class="icon-btn home-menu-toggle" type="button" data-menu-toggle aria-controls="header-nav" aria-expanded="false" aria-label="${t('aria.menu')}">${icon('menu')}</button>` : ''}
                </div>
            </div>
        </header>
        <nav
            class="bottom-nav"
            data-nav-group="${group}-mobile"
            aria-label="${t('aria.mobileNav')}"
        >
            ${links(mobile)}
        </nav>`;
}

icons.upload = 'M12 16V3 m-5 5 5-5 5 5 M4 16v5h16v-5';
icons.settings =
    'M9.5 3h5l.5 2.5 2 1.2 2.4-.8 2.5 4.2-1.9 1.7v2.4l1.9 1.7-2.5 4.2-2.4-.8-2 1.2-.5 2.5h-5L9 20.5l-2-1.2-2.4.8-2.5-4.2L4 14.2v-2.4L2.1 10.1l2.5-4.2 2.4.8 2-1.2L9.5 3z M15 13a3 3 0 1 1-6 0 3 3 0 0 1 6 0';
icons.edit = 'm4 16 12-12 4 4-12 12H4z M14 6l4 4';
icons.trash = 'M3 6h18 M8 6V3h8v3 M5 6l1 15h12l1-15 M10 10v7 M14 10v7';
