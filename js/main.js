import { applyTranslations, observeTranslations, t } from './i18n.js';
import { loadData } from './api.js';
import { read, commit, uid } from './storage.js';
import { guard, mountHeader, applySettings, currentUser, routeURL } from './bridge.js';
import { alertRecipients } from './domain.js';
const screen = document.body.dataset.screen;
async function scheduledAlerts() {
    const alerts = read('eventAlerts', []),
        due = alerts.filter(
            (a) => a.status === 'scheduled' && new Date(a.scheduledAt) <= new Date()
        );
    if (!due.length) return;
    const data = await loadData(),
        notifications = read('notifications', []);
    for (const a of due) {
        const recipients = alertRecipients(a, data);
        a.status = 'published';
        a.sentAt = new Date().toISOString();
        a.recipientIds = recipients;
        for (const userId of recipients)
            notifications.push({
                id: uid('NOT'),
                userId,
                type: 'schedule-change',
                title: a.title,
                message: a.message.replace(/<[^>]*>/g, ''),
                relatedEntityType: 'eventAlert',
                relatedEntityId: a.id,
                isRead: false,
                createdAt: new Date().toISOString()
            });
    }
    commit({ eventAlerts: alerts, notifications });
}
async function start() {
    try {
        applySettings();
        await loadData();
        applySettings();
        const role = document.body.dataset.role;
        if (role !== 'shared' && !(await guard([role]))) return;
        if (screen === 'S6' && !(await guard())) return;
        mountHeader();
        if (
            screen.startsWith('O') ||
            screen.startsWith('AD') ||
            ['S1', 'S7', 'S8', 'S9'].includes(screen)
        )
            await import('./operations.js');
        else if (screen.startsWith('A')) await import('./modules/attendee.js');
        else if (screen === 'SP6') await import('./modules/speaker-feedback.js');
        else if (screen.startsWith('SP') || screen === 'S6')
            await import('./modules/' + document.body.dataset.module);
        else await import('./modules/account.js');
        await import('./enhance.js');
        observeTranslations();
        applyTranslations();
        if (!screen.startsWith('O') && !screen.startsWith('AD')) {
            await scheduledAlerts();
            setInterval(() => scheduledAlerts().catch((e) => EP.inlineError(e)), 15000);
        }
        window.addEventListener('storage', () => {
            const user = currentUser(),
                expected = document.body.dataset.role;
            if (
                !['S1', 'S2', 'S3', 'S4', 'S8', 'S9'].includes(screen) &&
                (!user ||
                    user.status !== 'active' ||
                    (expected !== 'shared' && user.role !== expected))
            ) {
                location.href = routeURL('S8');
                return;
            }
            mountHeader();
        });
    } catch (error) {
        const main = document.querySelector('main') || document.querySelector('#app');
        if (main)
            main.innerHTML = `<section class="error-state home-loading home-wrap"><h1>${t('home.error.title')}</h1><p>${t('home.error.description')}</p><button class="btn btn-primary" data-page-retry>${t('common.retry')}</button></section>`;
        applySettings();
        mountHeader();
    }
}
start();
