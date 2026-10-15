/** Canonical storage shared by all four roles. */
export const prefix = 'eventpulse_';
export const keys = [
    'users',
    'events',
    'sessions',
    'rooms',
    'agendas',
    'feedback',
    'ticketTypes',
    'userTickets',
    'notifications',
    'eventAlerts',
    'materials'
];
export const filenames = {
    ticketTypes: 'ticket-types',
    userTickets: 'user-tickets',
    eventAlerts: 'event-alerts'
};
const allowed = new Set([...keys, 'currentUser', 'settings']);
export function read(key, fallback = null) {
    const raw = localStorage.getItem(prefix + key);
    if (raw === null) return structuredClone(fallback);
    try {
        return JSON.parse(raw);
    } catch {
        throw new Error(
            'Dữ liệu ' + key + ' không hợp lệ. Hãy khôi phục bản sao trước khi tiếp tục.'
        );
    }
}
export function normalizeSession(s) {
    const status =
        s.status === 'approved'
            ? 'published'
            : s.reviewStatus === 'rejected' && s.status === 'draft'
              ? 'rejected'
              : s.status;
    const next = {
        ...s,
        status,
        reviewStatus:
            status === 'published' || status === 'completed'
                ? 'approved'
                : status === 'rejected'
                  ? 'rejected'
                  : 'pending'
    };
    delete next.speaker;
    delete next.room;
    next.registeredCount = Number(next.registeredCount || 0);
    next.capacity = Number(next.capacity || 100);
    next.speakerIds ||= [];
    next.reviewNote = next.rejectionReason || next.reviewNote || '';
    return next;
}
let failNextWrite = new URLSearchParams(location.search).get('state') === 'save-error';
export function commit(updates) {
    if (sessionStorage.getItem('eventpulse_testFailWrite') === '1' || failNextWrite) {
        failNextWrite = false;
        sessionStorage.removeItem('eventpulse_testFailWrite');
        throw Error('Không thể lưu — nội dung vẫn được giữ trong biểu mẫu. Hãy thử lại.');
    }
    for (const key of Object.keys(updates))
        if (!allowed.has(key)) throw Error('Key không thuộc schema: ' + key);
    if (updates.sessions) updates.sessions = updates.sessions.map(normalizeSession);
    const before = Object.fromEntries(
        Object.keys(updates).map((k) => [k, localStorage.getItem(prefix + k)])
    );
    try {
        for (const [k, v] of Object.entries(updates))
            localStorage.setItem(prefix + k, JSON.stringify(v));
    } catch {
        for (const [k, v] of Object.entries(before)) {
            try {
                v === null
                    ? localStorage.removeItem(prefix + k)
                    : localStorage.setItem(prefix + k, v);
            } catch {}
        }
        throw Error(
            'Không thể lưu — bộ nhớ trình duyệt không khả dụng. Dữ liệu nhập vẫn được giữ tạm.'
        );
    }
    window.dispatchEvent(new CustomEvent('ep:data', { detail: Object.keys(updates) }));
}
export const write = (key, value) => commit({ [key]: value });
export const uid = (p) => p + crypto.randomUUID().replaceAll('-', '');
export function migrate() {
    const aliases = {
        eventpulse_tickets: 'userTickets',
        eventpulse_session_materials: 'materials'
    };
    for (const [old, key] of Object.entries(aliases)) {
        const raw = localStorage.getItem(old);
        if (raw === null) continue;
        let items;
        try {
            items = JSON.parse(raw);
        } catch {
            throw Error('Không đọc được dữ liệu cũ: ' + old);
        }
        if (!Array.isArray(items)) throw Error('Dữ liệu cũ không phải danh sách: ' + old);
        if (key === 'materials')
            items = items.map((m) => ({
                id: m.id,
                sessionId: m.sessionId,
                uploadedBy: m.uploadedBy || m.speakerId,
                title: m.title || m.fileName,
                fileName: m.fileName,
                type: m.kind === 'link' ? 'link' : 'document',
                fileUrl: m.fileUrl || m.url || '',
                fileSize: m.fileSize || m.size || 0,
                status: m.status || 'available',
                uploadedAt: m.uploadedAt,
                mockFile: !m.url && !m.fileUrl
            }));
        const current = read(key, []);
        write(key, [...current, ...items.filter((x) => !current.some((y) => y.id === x.id))]);
        localStorage.removeItem(old);
    }
    const oldProfile = localStorage.getItem('eventpulse_speaker_profile');
    if (oldProfile && read('users')) {
        const p = JSON.parse(oldProfile),
            users = read('users'),
            u = read('currentUser');
        const id = u?.role === 'speaker' ? u.id : 'USR102';
        write(
            'users',
            users.map((x) =>
                x.id === id
                    ? {
                          ...x,
                          fullName: p.name || x.fullName,
                          bio: p.bio || x.bio,
                          expertise: p.expertise || x.expertise,
                          avatar: p.avatar || x.avatar,
                          company: p.company || '',
                          jobTitle: p.jobTitle || '',
                          socialLinks: p.social || {}
                      }
                    : x
            )
        );
        localStorage.removeItem('eventpulse_speaker_profile');
    }
    const settings = read('settings', {});
    let changed = false;
    for (const k of [
        'eventpulse-theme',
        'eventpulse-language',
        'eventpulse-autosave',
        'eventpulse-reminder',
        'eventpulse-name'
    ]) {
        const value = localStorage.getItem(k);
        if (value !== null) {
            const field = k.replace('eventpulse-', '');
            if (settings[field] === undefined)
                settings[field] = ['autosave', 'reminder'].includes(field)
                    ? value === 'true'
                    : value;
            changed = true;
        }
    }
    const order = localStorage.getItem('eventpulse_agendaOrder');
    if (order) {
        settings.agendaOrder = JSON.parse(order);
        changed = true;
    }
    if (changed) {
        write('settings', settings);
        [
            'eventpulse-theme',
            'eventpulse-language',
            'eventpulse-autosave',
            'eventpulse-reminder',
            'eventpulse-name',
            'eventpulse_agendaOrder'
        ].forEach((k) => localStorage.removeItem(k));
    }
    // Forecast notes are moved into the owning session, never left in per-session keys.
    const sessions = read('sessions', []);
    let notesChanged = false;
    const removals = [];
    for (const s of sessions) {
        const k = 'eventpulse_forecast_note_' + s.id,
            raw = localStorage.getItem(k);
        if (raw !== null) {
            s.forecastNote = raw;
            notesChanged = true;
            removals.push(k);
        }
        const decision = 'eventpulse_forecast_decision_' + s.id;
        if (localStorage.getItem(decision) !== null) {
            s.forecastDecision = localStorage.getItem(decision);
            notesChanged = true;
            removals.push(decision);
        }
    }
    if (notesChanged) {
        write('sessions', sessions);
        removals.forEach((k) => localStorage.removeItem(k));
    }
    localStorage.removeItem('eventpulse_aiConflict');
}
