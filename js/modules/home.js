import * as U from '../ui.js';
import { t, localized, language, locale } from '../i18n.js';
import { setRole, settings, roleDialog, routeURL } from '../bridge.js';
import { updateActiveLinks } from '../navigation.js';
const { esc, icon, initials } = U;
const html = (parts, ...values) =>
    parts.reduce((result, part, index) => result + part + (values[index] ?? ''), '');
const roles = ['attendee', 'speaker', 'organizer', 'admin'];
const roleIcons = { attendee: 'calendar', speaker: 'users', organizer: 'room', admin: 'chart' };
const copy = (key, values) => esc(t(key, values));
const pill = (text, href, primary = false) =>
    html`<a class="btn ${primary ? 'btn-primary' : 'btn-secondary'} home-pill" href="${href}"
        >${copy(text)}${icon('arrow')}</a
    >`;
const demo = () =>
    html`<button class="btn btn-primary home-pill" type="button" data-switch-role>
        ${copy('common.demo')}${icon('arrow')}
    </button>`;
const category = (key) => {
    const text = t('home.category.' + key);
    return text === 'home.category.' + key ? key : text;
};
const published = (c) =>
    c.state.state === 'empty'
        ? []
        : c.data.sessions.filter(
              (s) => s.eventId === c.homeEvent?.id && ['published', 'approved'].includes(s.status)
          );
function sessionCards(c, chosen = '') {
    const list = published(c).filter((s) => !chosen || s.category === chosen);
    return (
        list
            .map((s, i) => {
                const room = c.room(s.roomId),
                    names = s.speakerIds.map((id) => c.person(id)?.fullName).filter(Boolean);
                return html`<article
                    class="home-session-card"
                    data-slide="${i}"
                    aria-label="${esc(localized(s, 'title'))}"
                >
                    <div class="home-session-top">
                        <span class="home-category">${esc(category(s.category))}</span
                        ><span class="home-session-index" aria-hidden="true"
                            >${String(i + 1).padStart(2, '0')}</span
                        >
                    </div>
                    <h3>
                        <a href="${c.url('A2', '?id=' + encodeURIComponent(s.id))}"
                            >${esc(localized(s, 'title'))}</a
                        >
                    </h3>
                    <p class="home-session-description">${esc(localized(s, 'description'))}</p>
                    <div class="home-session-meta">
                        <span>${icon('calendar')}${U.date(s.startTime)}</span
                        ><span>${icon('clock')}${U.time(s.startTime)} – ${U.time(s.endTime)}</span
                        ><span
                            >${icon('pin')}${esc(localized(room, 'name') || t('home.roomPending'))}</span
                        ><span
                            >${icon('users')}${esc(names.join(', ') || t('home.speakerPending'))}</span
                        >
                    </div>
                    <div class="home-session-actions">
                        <button
                            class="btn btn-primary home-pill"
                            type="button"
                            data-home-save="${esc(s.id)}"
                        >
                            ${copy('home.save')}${icon('plus')}</button
                        ><a
                            class="home-text-link"
                            href="${c.url('A2', '?id=' + encodeURIComponent(s.id))}"
                            >${copy('home.details')}${icon('arrow')}</a
                        >
                    </div>
                </article>`;
            })
            .join('') ||
        html`<div class="empty-state home-empty">
            <span class="home-symbol">${icon('calendar')}</span>
            <h3>${copy('home.empty.title')}</h3>
            <p>${copy('home.empty.description')}</p>
        </div>`
    );
}
function artwork(role, c) {
    const sessions = published(c).slice(0, 3),
        person = c.data.users.find((u) => u.role === 'speaker');
    return html`<div class="home-role-art" aria-hidden="true">
        <div class="home-art-window">
            <div class="home-window-toolbar">
                <span></span><span></span><span></span><b>EventPulse</b>
            </div>
            <div class="home-art-body">
                <div class="home-art-sidebar">
                    ${icon(roleIcons[role])}${icon('calendar')}${icon('users')}
                </div>
                <div class="home-art-content">
                    <p class="home-art-title">
                        ${copy({ attendee: 'home.mock.agenda', speaker: 'home.mock.session', organizer: 'home.mock.schedule', admin: 'home.mock.insight' }[role])}
                    </p>
                    ${
                        role === 'admin'
                            ? html`<div class="home-art-bars">
                                      ${Array.from({ length: 7 }, (_, i) => html`<span style="--bar-height:${[36, 58, 45, 80, 62, 94, 74][i]}%"></span>`).join('')}
                                  </div>
                                  <div class="home-art-line"></div>`
                            : role === 'speaker'
                              ? html`<div class="home-art-speaker">
                                        <span class="home-person-avatar"
                                            >${esc(initials(person?.fullName))}</span
                                        ><strong>${esc(person?.fullName || 'EventPulse')}</strong>
                                    </div>
                                    <div class="home-art-line"></div>
                                    <div class="home-art-line short"></div>`
                              : sessions
                                    .map(
                                        (s, i) =>
                                            html`<div class="home-art-row">
                                                <span
                                                    >${role === 'organizer' ? icon('room') : icon('clock')}</span
                                                >
                                                <div>
                                                    <strong>${esc(localized(s, 'title'))}</strong
                                                    ><small>${U.time(s.startTime)}</small>
                                                </div>
                                                ${icon('check')}
                                            </div>`
                                    )
                                    .join('') ||
                                html`<div class="home-art-line"></div>
                                    <div class="home-art-line short"></div>`
                    }
                </div>
            </div>
        </div>
        <span class="home-art-orbit">${icon(roleIcons[role])}</span>
    </div>`;
}
function footer(c) {
    const columns = [
        [
            'home.footer.product',
            [
                ['home.nav.sessions', '#featured'],
                ['home.nav.ai', '#ai'],
                ['nav.speakers', '#speakers']
            ]
        ],
        ['home.footer.roles', roles.map((role) => ['role.' + role, role])],
        [
            'home.footer.support',
            [
                ['home.footer.faq', '#faq'],
                ['common.login', c.url('S2')],
                ['home.register', c.url('S3')]
            ]
        ],
        [
            'home.footer.legal',
            [
                ['home.footer.data', '#faq-5'],
                ['home.footer.privacy', 'privacy']
            ]
        ]
    ];
    return html`<footer class="home-footer" id="home-footer">
        <div class="home-wrap">
            <div class="home-footer-grid">
                <div class="home-footer-brand">
                    <a class="brand" href="#about"
                        ><span class="brandmark">${icon('spark')}</span>EventPulse</a
                    >
                    <p>${copy('home.footer.about')}</p>
                </div>
                ${columns
                    .map(
                        ([title, items]) =>
                            html`<div class="home-footer-column">
                                <h3>${copy(title)}</h3>
                                ${items.map(([key, href]) => (roles.includes(href) ? html`<button type="button" data-home-role="${href}">${copy(key)}</button>` : href === 'privacy' ? html`<button type="button" data-home-privacy>${copy(key)}</button>` : html`<a href="${href}">${copy(key)}</a>`)).join('')}
                            </div>`
                    )
                    .join('')}
            </div>
            <div class="home-footer-bottom">
                <p>${copy('home.footer.copyright', { year: new Date().getFullYear() })}</p>
                <div class="home-preferences">
                    <label for="home-language">${copy('common.language')}</label
                    ><select id="home-language" aria-label="${copy('common.language')}">
                        <option value="vi" ${language() === 'vi' ? 'selected' : ''}>
                            ${copy('common.vi')}
                        </option>
                        <option value="en" ${language() === 'en' ? 'selected' : ''}>
                            ${copy('common.en')}
                        </option></select
                    ><button
                        class="icon-btn"
                        type="button"
                        data-home-theme
                        aria-label="${copy('common.theme')}"
                    >
                        ${icon('settings')}
                    </button>
                </div>
            </div>
        </div>
    </footer>`;
}
export function homeRender(c) {
    c.homeEvent = c.data.events.find((e) => e.status === 'published');
    const event = c.homeEvent,
        sessions = published(c),
        mini = sessions[0];
    const speaker =
        c.data.users.find((u) => u.id === mini?.speakerIds[0]) ||
        c.data.users.find((u) => u.role === 'speaker');
    const speakers = c.data.users.filter((u) => u.role === 'speaker' && u.status === 'active');
    const rooms = c.data.rooms.filter((r) => r.eventId === event?.id && r.status !== 'disabled');
    const stats = [
        sessions.length,
        speakers.length,
        rooms.length,
        sessions.reduce((n, s) => n + Number(s.registeredCount || 0), 0)
    ];
    const meta = event
        ? html`<span>${icon('calendar')}${U.date(event.startDate)} – ${U.date(event.endDate)}</span
              ><span>${icon('pin')}${esc(localized(event, 'location'))}</span>`
        : '';
    const seats = mini
        ? Math.max(
              0,
              Number(mini.capacity || c.room(mini.roomId)?.capacity || 0) -
                  Number(mini.registeredCount || 0)
          )
        : 0;
    const prompts = Array.from(
        { length: 5 },
        (_, i) =>
            html`<span class="home-prompt"
                >${icon(i === 1 ? 'calendar' : 'spark')}${copy('home.prompt.' + (i + 1))}</span
            >`
    ).join('');
    const categories = [...new Set(sessions.map((s) => s.category).filter(Boolean))];
    return html`<section class="home-hero" id="about" data-home-section>
            <div class="home-wrap home-hero-layout">
                <div class="home-hero-copy">
                    <p class="home-eyebrow" data-home-reveal>${copy('home.kicker')}</p>
                    <h1 data-home-reveal>
                        ${copy(event ? 'home.hero.first' : 'home.noEvent.title')}<br />${event ? html`<span>${copy('home.hero.second')}</span>` : ''}
                    </h1>
                    <p class="home-lead" data-home-reveal>
                        ${esc(event ? localized(event, 'description') : t('home.noEvent.description'))}
                    </p>
                    <div class="home-actions" data-home-reveal>
                        ${demo()}${pill('home.explore', '#featured')}
                    </div>
                    <p class="home-fine" data-home-reveal>${icon('check')}${copy('home.noCard')}</p>
                    <div class="home-event-meta" data-home-reveal>${meta}</div>
                </div>
                <div class="home-hero-visual" aria-label="${copy('home.event')}">
                    <div class="home-orbit home-orbit-one"></div>
                    <div class="home-orbit home-orbit-two"></div>
                    <div class="home-hero-symbol" aria-hidden="true">${icon('spark')}</div>
                    ${
                        mini
                            ? html`<article class="home-float home-float-session">
                                      <div class="home-mini-label">
                                          ${icon('calendar')}${copy('home.nav.sessions')}
                                      </div>
                                      <h2>${esc(localized(mini, 'title'))}</h2>
                                      <div class="home-mini-meta">
                                          ${U.time(mini.startTime)} – ${U.time(mini.endTime)}<span
                                              >${esc(localized(c.room(mini.roomId), 'name'))}</span
                                          >
                                      </div>
                                      <div class="home-mini-bottom">
                                          <span class="home-person-avatar"
                                              >${esc(initials(speaker?.fullName))}</span
                                          ><span>${esc(speaker?.fullName)}</span>${icon('arrow')}
                                      </div>
                                  </article>
                                  <div class="home-float home-float-capacity">
                                      ${icon('check')}<strong
                                          >${copy('home.seats', { count: seats })}</strong
                                      >
                                  </div>`
                            : ''
                    }
                    <div class="home-float home-float-speaker">
                        <span class="home-person-avatar">${esc(initials(speaker?.fullName))}</span>
                        <div>
                            <small>${copy('role.speaker')}</small
                            ><strong>${esc(speaker?.fullName || 'EventPulse')}</strong>
                        </div>
                        ${icon('spark')}
                    </div>
                    <div class="home-float home-float-countdown">
                        <small>${copy('home.countdown')}</small>
                        <div data-home-countdown data-date="${esc(event?.startDate || '')}"></div>
                    </div>
                    <div class="home-float home-float-note">
                        ${icon('spark')}<span>${copy('home.connections')}</span>
                    </div>
                </div>
            </div>
        </section>
        <section class="home-stats" aria-label="${copy('home.stats.label')}">
            <div class="home-wrap home-stats-grid">
                ${['sessions', 'speakers', 'rooms', 'registrations'].map((key, i) => html`<div data-home-reveal><strong class="home-count" data-count="${stats[i]}" aria-label="${stats[i]}">${stats[i]}</strong><span>${copy('home.stats.' + key)}</span></div>`).join('')}
            </div>
        </section>
        <section class="home-ai home-section" id="ai" data-home-section>
            <div class="home-wrap home-centered">
                <p class="home-eyebrow" data-home-reveal>${copy('home.ai.kicker')}</p>
                <h2 class="home-display" data-home-reveal>${copy('home.ai.title')}</h2>
                <p class="home-section-lead" data-home-reveal>${copy('home.ai.description')}</p>
                <button
                    class="btn btn-primary home-pill"
                    type="button"
                    data-switch-role
                    data-home-reveal
                >
                    ${copy('home.ai.button')}${icon('spark')}
                </button>
            </div>
            <div class="home-marquee" data-home-reveal>
                <div class="home-marquee-track">
                    <div>${prompts}</div>
                    <div aria-hidden="true">${prompts}</div>
                </div>
            </div>
            <p class="home-ai-note">${icon('shield')}${copy('home.ai.note')}</p>
            <div class="home-motion-controls">
                <button class="home-text-link" type="button" data-home-motion aria-pressed="false">
                    ${copy('home.motion.pause')}
                </button>
            </div>
        </section>
        <section class="home-section" id="roles" data-home-section>
            <div class="home-wrap">
                <div class="home-section-heading">
                    <p class="home-eyebrow" data-home-reveal>${copy('home.roles.kicker')}</p>
                    <h2 class="home-display" data-home-reveal>${copy('home.roles.title')}</h2>
                    <p class="home-section-lead" data-home-reveal>
                        ${copy('home.roles.description')}
                    </p>
                </div>
                <div class="home-roles-grid">
                    ${roles
                        .map(
                            (role, i) =>
                                html`<article class="home-role-card" data-home-reveal>
                                    ${artwork(role, c)}
                                    <div class="home-role-content">
                                        <span class="home-role-number" aria-hidden="true"
                                            >0${i + 1}</span
                                        >
                                        <h3>${copy('role.' + role)}</h3>
                                        <p>${copy('home.role.' + role)}</p>
                                        <button
                                            class="btn btn-secondary home-pill"
                                            type="button"
                                            data-home-role="${role}"
                                        >
                                            ${copy('home.roles.button')}${icon('arrow')}
                                        </button>
                                    </div>
                                </article>`
                        )
                        .join('')}
                </div>
            </div>
        </section>
        <section class="home-section home-featured" id="featured" data-home-section>
            <div class="home-wrap">
                <div class="home-section-heading">
                    <p class="home-eyebrow" data-home-reveal>${copy('home.featured.kicker')}</p>
                    <h2 class="home-display" data-home-reveal>${copy('home.featured.title')}</h2>
                    <p class="home-section-lead" data-home-reveal>
                        ${copy('home.featured.description')}
                    </p>
                </div>
                <div
                    class="home-category-filters"
                    role="group"
                    aria-label="${copy('home.category.all')}"
                >
                    <button
                        type="button"
                        data-home-category=""
                        aria-pressed="${!c.state.homeCategory}"
                    >
                        ${copy('home.category.all')}</button
                    >${categories.map((cat) => html`<button type="button" data-home-category="${esc(cat)}" aria-pressed="${c.state.homeCategory === cat}">${esc(category(cat))}</button>`).join('')}
                </div>
                <div
                    class="home-carousel"
                    id="home-carousel"
                    role="region"
                    aria-roledescription="${copy('home.carousel.role')}"
                    aria-label="${copy('home.carousel')}"
                    tabindex="0"
                >
                    ${sessionCards(c, c.state.homeCategory || '')}
                </div>
                <div class="home-carousel-controls">
                    <div class="home-dots" id="home-dots"></div>
                    <div class="home-carousel-navigation">
                        <span
                            class="home-carousel-count"
                            id="home-carousel-count"
                            aria-live="polite"
                        ></span
                        ><button
                            class="icon-btn"
                            type="button"
                            data-home-prev
                            aria-label="${copy('home.prev')}"
                        >
                            ${icon('back')}</button
                        ><button
                            class="icon-btn"
                            type="button"
                            data-home-next
                            aria-label="${copy('home.next')}"
                        >
                            ${icon('arrow')}
                        </button>
                    </div>
                </div>
            </div>
        </section>
        <section class="home-section home-capabilities">
            <div class="home-wrap">
                <p class="home-eyebrow" data-home-reveal>${copy('home.features.kicker')}</p>
                <h2 class="home-display" data-home-reveal>${copy('home.features.title')}</h2>
                <div class="home-features-grid">
                    ${['spark', 'calendar', 'ticket', 'bell']
                        .map(
                            (ico, i) =>
                                html`<article class="home-feature-card" data-home-reveal>
                                    <span class="home-feature-icon">${icon(ico)}</span>
                                    <h3>${copy('home.feature.' + (i + 1) + '.title')}</h3>
                                    <p>${copy('home.feature.' + (i + 1) + '.description')}</p>
                                    <span class="home-feature-arrow" aria-hidden="true"
                                        >${icon('arrow')}</span
                                    >
                                </article>`
                        )
                        .join('')}
                </div>
            </div>
        </section>
        <section class="home-section" id="speakers" data-home-section>
            <div class="home-wrap">
                <div class="home-section-heading">
                    <p class="home-eyebrow" data-home-reveal>${copy('home.speakers.kicker')}</p>
                    <h2 class="home-display" data-home-reveal>${copy('home.speakers.title')}</h2>
                    <p class="home-section-lead" data-home-reveal>
                        ${copy('home.speakers.description')}
                    </p>
                </div>
                <div class="home-speakers-grid">
                    ${
                        speakers
                            .map(
                                (person) =>
                                    html`<article class="home-speaker-card" data-home-reveal>
                                        <div class="home-speaker-portrait" aria-hidden="true">
                                            <span>${esc(initials(person.fullName))}</span
                                            >${icon('spark')}
                                        </div>
                                        <h3>${esc(person.fullName)}</h3>
                                        <p>
                                            ${esc((localized(person, 'expertise') || []).join(' · ') || t('home.speaker.expertise'))}
                                        </p>
                                        <span class="home-speaker-count"
                                            >${copy('home.speaker.sessions', { count: sessions.filter((s) => s.speakerIds.includes(person.id)).length })}</span
                                        >
                                    </article>`
                            )
                            .join('') || html`<p>${copy('home.speaker.empty')}</p>`
                    }
                </div>
            </div>
        </section>
        <section class="home-section home-steps">
            <div class="home-wrap home-steps-layout">
                <div class="home-steps-heading">
                    <p class="home-eyebrow" data-home-reveal>${copy('home.steps.kicker')}</p>
                    <h2 class="home-display" data-home-reveal>${copy('home.steps.title')}</h2>
                </div>
                <ol class="home-step-list">
                    ${Array.from(
                        { length: 6 },
                        (_, i) =>
                            html`<li data-home-reveal>
                                <span class="home-step-number" aria-hidden="true">0${i + 1}</span>
                                <div>
                                    <h3>${copy('home.step.' + (i + 1) + '.title')}</h3>
                                    <p>${copy('home.step.' + (i + 1) + '.description')}</p>
                                </div>
                            </li>`
                    ).join('')}
                </ol>
            </div>
        </section>
        <section class="home-section home-cta">
            <div class="home-wrap home-centered">
                <span class="home-cta-symbol" aria-hidden="true">${icon('spark')}</span>
                <h2 class="home-display" data-home-reveal>${copy('home.cta.title')}</h2>
                <p class="home-section-lead" data-home-reveal>${copy('home.cta.description')}</p>
                <div class="home-actions" data-home-reveal>
                    ${demo()}${pill('home.register', c.url('S3'))}
                </div>
            </div>
        </section>
        <section class="home-section home-faq" id="faq">
            <div class="home-wrap home-faq-layout">
                <h2 class="home-display" data-home-reveal>${copy('home.faq.title')}</h2>
                <div>
                    ${Array.from(
                        { length: 6 },
                        (_, i) =>
                            html`<details class="home-faq-item" id="faq-${i + 1}" data-home-reveal>
                                <summary>
                                    ${copy('home.faq.' + (i + 1) + '.q')}<span aria-hidden="true"
                                        >${icon('plus')}</span
                                    >
                                </summary>
                                <div class="home-faq-answer">
                                    <p>${copy('home.faq.' + (i + 1) + '.a')}</p>
                                </div>
                            </details>`
                    ).join('')}
                </div>
            </div>
        </section>
        ${footer(c)}`;
}
let cleanup = () => {};
export function mountHome(c) {
    cleanup();
    const root = document.querySelector('.home-main');
    if (!root) return;
    const controller = new AbortController(),
        signal = controller.signal;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)');
    const timers = new Set(),
        frames = new Set();
    const schedule = (fn) => {
        const id = requestAnimationFrame(() => {
            frames.delete(id);
            fn();
        });
        frames.add(id);
    };
    const observer = new IntersectionObserver(
        (entries) => {
            entries
                .filter((entry) => entry.isIntersecting)
                .forEach((entry) => {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                    const counter = entry.target.querySelector('[data-count]');
                    if (counter && !reduce.matches) {
                        const end = Number(counter.dataset.count),
                            start = performance.now();
                        const tick = (now) => {
                            counter.textContent = new Intl.NumberFormat(locale()).format(
                                Math.round(end * Math.min(1, (now - start) / 900))
                            );
                            if (now - start < 900) schedule(() => tick(performance.now()));
                        };
                        counter.textContent = '0';
                        schedule(() => tick(performance.now()));
                    }
                });
        },
        { threshold: 0.12 }
    );
    root.querySelectorAll('[data-home-reveal]').forEach((el, i) => {
        el.style.setProperty('--reveal-delay', (i % 4) * 60 + 'ms');
        observer.observe(el);
    });
    root.classList.add('home-motion-ready');
    const countdown = root.querySelector('[data-home-countdown]');
    function updateCountdown() {
        const raw = countdown.dataset.date;
        if (!raw || !Number.isFinite(Date.parse(raw))) {
            countdown.textContent = '—';
            return;
        }
        const remaining = Math.max(0, new Date(raw + 'T00:00:00').getTime() - Date.now());
        if (!remaining) {
            countdown.textContent = t('home.started');
            return;
        }
        countdown.innerHTML = [
            [Math.floor(remaining / 86400000), 'days'],
            [Math.floor(remaining / 3600000) % 24, 'hours'],
            [Math.floor(remaining / 60000) % 60, 'minutes']
        ]
            .map(
                ([value, key]) =>
                    html`<span
                        ><strong>${String(value).padStart(2, '0')}</strong
                        ><small>${copy('home.' + key)}</small></span
                    >`
            )
            .join('');
    }
    updateCountdown();
    timers.add(setInterval(updateCountdown, 60000));
    const carousel = root.querySelector('#home-carousel');
    let current = 0,
        scrollFrame = false;
    function updateCarousel() {
        const cards = [...carousel.querySelectorAll('[data-slide]')];
        const edge = carousel.getBoundingClientRect().left;
        current = cards.length
            ? cards.reduce(
                  (best, card, i) =>
                      Math.abs(card.getBoundingClientRect().left - edge) <
                      Math.abs(cards[best].getBoundingClientRect().left - edge)
                          ? i
                          : best,
                  0
              )
            : 0;
        root.querySelector('#home-carousel-count').textContent = cards.length
            ? `${current + 1} / ${cards.length}`
            : '0 / 0';
        root.querySelector('#home-dots').innerHTML = cards
            .map(
                (_, i) =>
                    html`<button
                        type="button"
                        data-home-dot="${i}"
                        class="${i === current ? 'active' : ''}"
                        aria-label="${copy('home.slide', { count: i + 1 })}"
                        ${i === current ? 'aria-current="true"' : ''}
                    ></button>`
            )
            .join('');
        root.querySelector('[data-home-prev]').disabled = !cards.length || current === 0;
        root.querySelector('[data-home-next]').disabled =
            !cards.length || carousel.scrollLeft >= carousel.scrollWidth - carousel.clientWidth - 2;
    }
    const go = (index) => {
        const card = carousel.querySelector(`[data-slide="${index}"]`);
        if (card)
            carousel.scrollTo({
                left: card.offsetLeft - carousel.querySelector('[data-slide]').offsetLeft,
                behavior: reduce.matches ? 'instant' : 'smooth'
            });
    };
    carousel.addEventListener(
        'scroll',
        () => {
            if (!scrollFrame) {
                scrollFrame = true;
                schedule(() => {
                    scrollFrame = false;
                    updateCarousel();
                });
            }
        },
        { passive: true, signal }
    );
    carousel.addEventListener(
        'keydown',
        (e) => {
            if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
                e.preventDefault();
                go(current + (e.key === 'ArrowRight' ? 1 : -1));
            }
        },
        { signal }
    );
    updateCarousel();
    root.addEventListener(
        'click',
        async (e) => {
            const role = e.target.closest('[data-home-role]');
            if (role) await window.EP.task(role, () => setRole(role.dataset.homeRole));
            const filter = e.target.closest('[data-home-category]');
            if (filter) {
                c.state.homeCategory = filter.dataset.homeCategory;
                root.querySelectorAll('[data-home-category]').forEach((b) =>
                    b.setAttribute('aria-pressed', String(b === filter))
                );
                carousel.innerHTML = sessionCards(c, c.state.homeCategory);
                carousel.scrollLeft = 0;
                updateCarousel();
            }
            if (e.target.closest('[data-home-next]')) go(current + 1);
            if (e.target.closest('[data-home-prev]')) go(current - 1);
            const dot = e.target.closest('[data-home-dot]');
            if (dot) go(Number(dot.dataset.homeDot));
            const motion = e.target.closest('[data-home-motion]');
            if (motion) {
                const paused = root.dataset.motionPaused !== 'true';
                root.dataset.motionPaused = String(paused);
                motion.setAttribute('aria-pressed', String(paused));
                motion.textContent = t(paused ? 'home.motion.resume' : 'home.motion.pause');
            }
            if (e.target.closest('[data-home-theme]'))
                settings({
                    theme: document.documentElement.dataset.appearance === 'dark' ? 'light' : 'dark'
                });
            if (e.target.closest('[data-home-privacy]'))
                U.modal(t('home.footer.privacy'), html`<p>${copy('home.footer.privacyText')}</p>`);
            const save = e.target.closest('[data-home-save]');
            if (save) {
                if (!c.user) {
                    U.toast(t('home.save.guest'), 'info');
                    roleDialog();
                } else if (c.user.role !== 'attendee') {
                    U.toast(t('home.save.role'), 'info');
                    roleDialog();
                } else
                    location.href =
                        routeURL('A2') + '?id=' + encodeURIComponent(save.dataset.homeSave);
            }
            const faqLink = e.target.closest('a[href^="#faq-"]');
            if (faqLink) root.querySelector(faqLink.getAttribute('href'))?.setAttribute('open', '');
        },
        { signal }
    );
    root.addEventListener(
        'change',
        (e) => {
            if (e.target.id === 'home-language') settings({ language: e.target.value });
        },
        { signal }
    );
    let scrollPending = false;
    function onScroll() {
        document.querySelector('.app-header')?.classList.toggle('is-scrolled', scrollY > 16);
        const sections = [...root.querySelectorAll('[data-home-section]')];
        const section =
            sections.filter((el) => el.getBoundingClientRect().top <= 160).at(-1) || sections[0];
        if (section) updateActiveLinks(section.id);
        if (!reduce.matches) {
            const visual = root.querySelector('.home-hero-visual');
            visual?.style.setProperty('--parallax', Math.min(24, scrollY * 0.035) + 'px');
        }
    }
    window.addEventListener(
        'scroll',
        () => {
            if (!scrollPending) {
                scrollPending = true;
                schedule(() => {
                    scrollPending = false;
                    onScroll();
                });
            }
        },
        { passive: true, signal }
    );
    window.addEventListener('resize', updateCarousel, { signal });
    const faqHandler = (e) => {
        const details = e.target;
        if (!details.matches('.home-faq-item')) return;
        const answer = details.querySelector('.home-faq-answer');
        if (details.open && !reduce.matches)
            answer.animate(
                [
                    { opacity: 0, transform: 'translateY(-6px)' },
                    { opacity: 1, transform: 'translateY(0)' }
                ],
                { duration: 240, easing: 'cubic-bezier(0.4,0,0.2,1)' }
            );
    };
    root.addEventListener('toggle', faqHandler, { capture: true, signal });
    onScroll();
    cleanup = () => {
        controller.abort();
        observer.disconnect();
        timers.forEach(clearInterval);
        frames.forEach(cancelAnimationFrame);
    };
}
