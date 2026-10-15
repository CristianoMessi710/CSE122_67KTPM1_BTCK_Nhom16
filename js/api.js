import { t } from './i18n.js';
import { keys, filenames, read, write, commit, migrate, normalizeSession } from './storage.js';
export const base = new URL('../', import.meta.url).href;
export const delay = (ms = 350) => new Promise((resolve) => setTimeout(resolve, ms));
let loading;
export async function loadData() {
    if (!loading)
        loading = (async () => {
            if (new URLSearchParams(location.search).get('state') === 'error')
                throw Error(t('home.error.description'));
            migrate();
            const entries = await Promise.all(
                keys.map(async (key) => {
                    const stored = read(key);
                    if (stored !== null) {
                        if (!Array.isArray(stored))
                            throw Error('Dữ liệu ' + key + ' phải là danh sách.');
                        if (
                            ['events', 'sessions', 'users', 'rooms'].includes(key) &&
                            stored.some(
                                (item) => !Object.keys(item).some((field) => field.endsWith('_en'))
                            )
                        ) {
                            try {
                                const response = await fetch(base + 'assets/data/' + key + '.json');
                                if (response.ok) {
                                    const seed = await response.json();
                                    let changed = false;
                                    for (const item of stored) {
                                        const original = seed.find((x) => x.id === item.id);
                                        if (!original) continue;
                                        for (const [field, value] of Object.entries(original)) {
                                            if (!field.endsWith('_en') || item[field] !== undefined)
                                                continue;
                                            const baseField = field.slice(0, -3);
                                            if (
                                                JSON.stringify(item[baseField]) ===
                                                JSON.stringify(original[baseField])
                                            ) {
                                                item[field] = value;
                                                changed = true;
                                            }
                                        }
                                    }
                                    if (changed) write(key, stored);
                                }
                            } catch {
                                // Optional display translations must never block stored user data.
                            }
                        }
                        return [key, stored];
                    }
                    const response = await fetch(
                        base + 'assets/data/' + (filenames[key] || key) + '.json'
                    );
                    if (!response.ok)
                        throw Error('Không tải được ' + key + '. Hãy chạy dự án bằng Live Server.');
                    return [key, await response.json()];
                })
            );
            const data = Object.fromEntries(entries),
                missing = {};
            for (const key of keys) if (read(key) === null) missing[key] = data[key];
            if (read('settings') === null)
                missing.settings = {
                    language: 'vi',
                    theme: 'light',
                    autosave: true,
                    reminder: true,
                    agendaOrder: {}
                };
            if (Object.keys(missing).length) commit(missing);
            // Backward-compatible status migration preserves edits and identity.
            const normalized = read('sessions').map(normalizeSession);
            if (JSON.stringify(normalized) !== JSON.stringify(read('sessions')))
                commit({ sessions: normalized });
            migrate();
            return snapshot();
        })().catch((e) => {
            loading = null;
            throw e;
        });
    await loading;
    return snapshot();
}
export const snapshot = () => Object.fromEntries(keys.map((k) => [k, read(k, [])]));
export async function mockRequest() {
    await delay();
    if (!navigator.onLine || new URLSearchParams(location.search).get('state') === 'save-error')
        throw Error('Không thể lưu — dữ liệu vẫn được giữ tạm trong biểu mẫu.');
}
