/** Compatibility facade: SV1 and SV2 call the same storage and UI as SV3. */
import * as S from './storage.js';
import { applyTranslations, t, language } from './i18n.js';
import { captureIndicators, initializeIndicators, updateActiveLinks } from './navigation.js';
import * as U from './ui.js';
import { base, loadData, delay } from './api.js';
import { routes, homeByRole } from './routes.js';
const url = (path) => new URL(path, base).href;
export const currentUser = () => {
    const u = S.read('currentUser');
    return u ? S.read('users', []).find((x) => x.id === u.id) || null : null;
};
export const routeURL = (id) => url(routes[id] || routes.S9);
export function mountHeader() {
    const u = currentUser();
    const unread = S.read('notifications', []).filter(
        (n) => n.userId === u?.id && !n.isRead
    ).length;
    const signature = JSON.stringify([
        u?.id,
        u?.role,
        u?.fullName,
        u?.avatar,
        document.body.dataset.screen,
        language(),
        unread
    ]);
    const existing = document.querySelector('.app-header');
    if (existing?.dataset.signature === signature) {
        initializeIndicators();
        existing.classList.toggle('is-scrolled', scrollY > 16);
        return;
    }
    const previous = captureIndicators();
    document.querySelector('.app-header')?.remove();
    document.querySelector('.bottom-nav')?.remove();
    document.body.insertAdjacentHTML(
        'afterbegin',
        U.header(u, document.body.dataset.screen, routeURL, unread)
    );
    initializeIndicators(previous);
    document.querySelector('.app-header').dataset.signature = signature;
    document.querySelector('.app-header')?.classList.toggle('is-scrolled', scrollY > 16);
}
export function settings(patch) {
    const all = S.read('settings', {}),
        id = currentUser()?.id || 'guest';
    if (!patch) return { ...all, ...all.byUser?.[id], language: language() };
    const beforeLanguage = language();
    S.write('settings', {
        ...all,
        ...(patch.language ? { language: patch.language } : {}),
        byUser: { ...all.byUser, [id]: { ...all.byUser?.[id], ...patch } }
    });
    applySettings();
    mountHeader();
    if (beforeLanguage !== language()) {
        if (
            document.querySelector('#dialog')?.open &&
            document.querySelector('#dialog').dataset.kind === 'demo'
        )
            roleDialog();
        window.dispatchEvent(new CustomEvent('ep:locale'));
    }
}
export function applySettings() {
    const s = settings();
    document.documentElement.dataset.appearance = s.theme || 'light';
    document.documentElement.dataset.language = s.language || 'vi';
    document.body.classList.remove('dark');
    applyTranslations();
}
export function notification(
    title,
    message,
    type = 'system',
    entity = '',
    id = '',
    userId = currentUser()?.id
) {
    return {
        id: S.uid('NOT'),
        userId,
        type,
        title,
        message,
        relatedEntityType: entity,
        relatedEntityId: id,
        isRead: false,
        createdAt: new Date().toISOString()
    };
}
export function persist(changes, note) {
    if (changes.agendaOrder) {
        changes.settings = { ...S.read('settings', {}), agendaOrder: changes.agendaOrder };
        delete changes.agendaOrder;
    }
    if (note)
        changes.notifications = [
            ...S.read('notifications', []),
            ...(Array.isArray(note) ? note : [note])
        ];
    S.commit(changes);
}
export async function guard(roles) {
    await loadData();
    const u = currentUser();
    if (!u) {
        location.replace(routeURL('S2'));
        return null;
    }
    if (u.status !== 'active' || (roles && !roles.includes(u.role))) {
        location.replace(routeURL('S8'));
        return null;
    }
    return u;
}
export async function setRole(role) {
    await loadData();
    let u = S.read('users').find((x) => x.role === role && x.status === 'active');
    if (!u) throw Error(t('demo.unavailable'));
    S.write('currentUser', u);
    location.href = routeURL(homeByRole[role]);
}
export function roleDialog() {
    const content =
        `<p>${t('demo.description')}</p><div class="role-grid">` +
        Object.entries(U.labels)
            .filter(([k]) => homeByRole[k])
            .map(
                ([k, v]) =>
                    `<button class="btn btn-secondary" data-demo-role="${k}" type="button">${U.icon(k === 'attendee' ? 'ticket' : k === 'speaker' ? 'users' : k === 'organizer' ? 'calendar' : 'shield')}${v}</button>`
            )
            .join('') +
        '</div><div class="actions"><a class="btn btn-ghost" href="' +
        routeURL('S2') +
        `">${t('demo.account')}</a>` +
        (currentUser()
            ? `<button class="btn btn-ghost" data-logout>${t('common.logout')}</button>`
            : '') +
        '</div>';
    const d = U.modal(t('demo.title'), content);
    d.dataset.kind = 'demo';
    d.querySelectorAll('[data-demo-role]').forEach(
        (b) => (b.onclick = () => task(b, () => setRole(b.dataset.demoRole)))
    );
}
export function inlineError(e) {
    let el = document.getElementById('action-error');
    if (!el) {
        el = document.createElement('div');
        el.id = 'action-error';
        el.className = 'notice error';
        el.setAttribute('role', 'alert');
        document.querySelector('main')?.prepend(el);
    }
    el.textContent = e.message || String(e);
}
async function task(button, fn) {
    const old = button?.innerHTML;
    if (button) {
        button.disabled = true;
        button.textContent = t('common.processing');
    }
    document.getElementById('action-error')?.remove();
    try {
        await delay(250);
        await fn();
    } catch (e) {
        inlineError(e);
        U.toast(e.message, true);
    } finally {
        if (button?.isConnected) {
            button.disabled = false;
            button.innerHTML = old;
        }
    }
}
function errorPanel(e) {
    document.querySelector('main').innerHTML = U.empty(
        t('home.error.title'),
        e.message,
        `<button class="btn btn-primary" data-page-retry>${t('common.retry')}</button>`
    );
}
const store = {
    get: (k, f = []) =>
        k === 'agendaOrder' ? S.read('settings', {}).agendaOrder || {} : S.read(k, f),
    set: (k, v) => {
        if (k === 'agendaOrder') S.write('settings', { ...S.read('settings', {}), agendaOrder: v });
        else S.write(k, v);
        return v;
    },
    remove: (k) => S.write(k, null)
};
const EP = {
    root: base,
    url,
    store,
    commit: S.commit,
    init: loadData,
    guard,
    currentUser,
    get roles() {
        return Object.fromEntries(Object.keys(homeByRole).map((k) => [k, U.labels[k]]));
    },
    routeFor: (r) => routeURL(homeByRole[r]),
    setRole,
    uid: S.uid,
    notification,
    persist,
    toast: (m, t) => U.toast(m, t),
    shell: (title) => {
        document.title = title + ' | EventPulse';
        mountHeader();
    },
    footer() {},
    errorPanel,
    inlineError,
    task,
    delay,
    confirm: (title, m) => U.confirm(title, m, t('common.confirm')),
    esc: U.esc,
    safeImage: (v) =>
        /^(data:image\/(png|jpeg|webp);base64,|https?:\/\/|assets\/)/.test(v || '')
            ? v.startsWith('assets/')
                ? url(v)
                : v
            : '',
    overlap: (a, b) =>
        new Date(a.startTime) < new Date(b.endTime) && new Date(b.startTime) < new Date(a.endTime),
    icon: U.icon
};
window.EP = EP;
const speakerAPI = {
    ...EP,
    KEYS: {
        currentUser: 'eventpulse_currentUser',
        speakerProfile: 'eventpulse_users',
        materials: 'eventpulse_materials'
    },
    ensureSeed() {},
    getJSON: (k, f) => S.read(k.replace(/^eventpulse_/, ''), f),
    setJSON: (k, v) => S.write(k.replace(/^eventpulse_/, ''), v),
    getSettings: () => ({ ...settings(), name: currentUser()?.fullName }),
    setSettings: settings,
    applyI18nNav: applyTranslations,
    applyRoleNav() {},
    getAllSessions: () => S.read('sessions', []),
    getSessionsForSpeaker: (id) => S.read('sessions', []).filter((s) => s.speakerIds.includes(id)),
    upsertSession(s) {
        const all = S.read('sessions', []),
            old = all.find((x) => x.id === s.id);
        if (!s.speakerIds?.includes(currentUser().id))
            throw Error('Bạn không có quyền sửa phiên này.');
        if (old && old.status === 'pending' && s.status === 'pending')
            throw Error('Phiên đang chờ duyệt chỉ được xem.');
        persist(
            {
                sessions: all.some((x) => x.id === s.id)
                    ? all.map((x) => (x.id === s.id ? s : x))
                    : [...all, s]
            },
            [
                notification('Đã cập nhật phiên', s.title, 'system', 'session', s.id),
                ...S.read('users')
                    .filter((u) => u.role === 'organizer' && u.status === 'active')
                    .map((u) =>
                        notification(
                            'Phiên được cập nhật',
                            s.title,
                            'system',
                            'session',
                            s.id,
                            u.id
                        )
                    )
            ]
        );
    },
    mergeSpeakerSessions(id, items) {
        const all = S.read('sessions'),
            map = new Map(items.map((s) => [s.id, s]));
        const next = all.map((s) => map.get(s.id) || s);
        for (const s of items) if (!all.some((x) => x.id === s.id)) next.push(s);
        persist(
            { sessions: next },
            S.read('users')
                .filter((u) => u.role === 'organizer' && u.status === 'active')
                .map((u) =>
                    notification(
                        'Có đề xuất phiên mới',
                        'Kiểm tra danh sách phiên chờ duyệt.',
                        'system',
                        'session',
                        '',
                        u.id
                    )
                )
        );
    }
};
window.EventPulse = speakerAPI;
document.addEventListener('click', (e) => {
    if (e.target.closest('[data-switch-role]')) roleDialog();
    const toggle = e.target.closest('[data-menu-toggle]');
    if (toggle) {
        const nav = document.getElementById('header-nav');
        const open = nav.classList.toggle('open');
        toggle.setAttribute('aria-expanded', String(open));
    }
    if (e.target.closest('#header-nav a')) {
        document.getElementById('header-nav')?.classList.remove('open');
        document.querySelector('[data-menu-toggle]')?.setAttribute('aria-expanded', 'false');
    }
    if (e.target.closest('[data-logout]')) {
        S.write('currentUser', null);
        location.href = routeURL('S1');
    }
    if (e.target.closest('[data-action="close"]')) U.close();
    if (e.target.closest('[data-page-retry]')) {
        const u = new URL(location.href);
        u.searchParams.delete('state');
        location.href = u.href;
    }
});
window.addEventListener('ep:data', () => {
    const target = document.querySelector('[data-notification-link]');
    if (!target) return;
    const unread = S.read('notifications', []).filter(
        (n) => n.userId === currentUser()?.id && !n.isRead
    ).length;
    target.setAttribute('aria-label', t('aria.notifications', { count: unread }));
    let badge = target.querySelector('.count');
    if (!unread) {
        badge?.remove();
        return;
    }
    if (!badge) {
        badge = document.createElement('span');
        badge.className = 'count';
        target.append(badge);
    }
    badge.textContent = unread;
});

window.addEventListener('hashchange', updateActiveLinks);

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        document.getElementById('header-nav')?.classList.remove('open');
        document.querySelector('[data-menu-toggle]')?.setAttribute('aria-expanded', 'false');
    }
});
