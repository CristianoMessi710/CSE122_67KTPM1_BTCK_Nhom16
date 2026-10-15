/** A persistent sliding indicator, shared by desktop and mobile navigation. */
const reducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
const storageKey = 'eventpulse_navigationIndicator';
const pending = (() => {
    try {
        const value = JSON.parse(sessionStorage.getItem(storageKey) || '{}');
        sessionStorage.removeItem(storageKey);
        return value;
    } catch {
        return {};
    }
})();
const initialized = new WeakSet();
const initializing = new WeakSet();
let scrollTarget = '',
    lockUntil = 0;
const navs = () => [...document.querySelectorAll('.app-header .nav, .bottom-nav')];
const links = (nav) => [...nav.querySelectorAll('a[data-nav-key]')];
function position(nav, link) {
    const parent = nav.getBoundingClientRect(),
        rect = link.getBoundingClientRect();
    return {
        left: rect.left - parent.left + nav.scrollLeft,
        width: rect.width,
        index: links(nav).indexOf(link),
        at: Date.now()
    };
}
function place(bar, value) {
    bar.style.width = value.width + 'px';
    bar.style.transform = `translateX(${value.left}px)`;
}
export function captureIndicators() {
    return Object.fromEntries(
        navs().map((nav) => {
            const bar = nav.querySelector('.nav-indicator'),
                rect = nav.getBoundingClientRect(),
                b = bar?.getBoundingClientRect();
            return [
                nav.dataset.navGroup,
                b ? { left: b.left - rect.left, width: b.width, at: Date.now() } : null
            ];
        })
    );
}
export function initializeIndicators(previous = {}) {
    for (const nav of navs()) {
        let bar = nav.querySelector('.nav-indicator');
        if (!bar) {
            bar = document.createElement('span');
            bar.className = 'nav-indicator';
            bar.setAttribute('aria-hidden', 'true');
            nav.append(bar);
        }
        const active = nav.querySelector('a.active');
        if (!active || !nav.getBoundingClientRect().width) {
            bar.style.opacity = '0';
            continue;
        }
        bar.style.opacity = '1';
        const next = position(nav, active);
        if (!initialized.has(nav)) {
            initialized.add(nav);
            initializing.add(nav);
            const old = previous[nav.dataset.navGroup] || pending[nav.dataset.navGroup];
            delete pending[nav.dataset.navGroup];
            bar.style.transition = 'none';
            place(
                bar,
                old && old.width && Date.now() - old.at < 15000 && !reducedMotion() ? old : next
            );
            // Two frames ensure the initial style is painted before starting the movement.
            requestAnimationFrame(() =>
                requestAnimationFrame(() => {
                    if (!bar.isConnected) return;
                    bar.style.transition = '';
                    bar.getBoundingClientRect();
                    initializing.delete(nav);
                    place(bar, position(nav, nav.querySelector('a.active') || active));
                })
            );
        } else if (!initializing.has(nav)) place(bar, next);
    }
}
export function updateActiveLinks(section) {
    const home = document.body.dataset.screen === 'S1';
    const sectionId = typeof section === 'string' ? section : location.hash.slice(1);
    if (home && scrollTarget && Date.now() < lockUntil && sectionId !== scrollTarget) return;
    for (const nav of navs()) {
        const items = links(nav);
        const match = items.find((link) => {
            const destination = new URL(link.href);
            return (
                destination.pathname === location.pathname &&
                destination.hash === (sectionId ? '#' + sectionId : '')
            );
        });
        if (!match && !(home && !sectionId)) continue;
        const selected = match || items[0];
        for (const link of items) {
            link.classList.toggle('active', link === selected);
            if (link === selected) link.setAttribute('aria-current', 'location');
            else link.removeAttribute('aria-current');
        }
    }
    initializeIndicators();
}
document.addEventListener(
    'click',
    (event) => {
        const link = event.target.closest('.app-header .nav a, .bottom-nav a');
        if (
            !link ||
            event.button !== 0 ||
            event.metaKey ||
            event.ctrlKey ||
            event.shiftKey ||
            event.altKey
        )
            return;
        const target = new URL(link.href);
        if (
            target.origin === location.origin &&
            target.pathname === location.pathname &&
            target.search === location.search &&
            target.hash
        ) {
            scrollTarget = target.hash.slice(1);
            lockUntil = Date.now() + 1500;
            updateActiveLinks(scrollTarget);
            return;
        }
        const values = {};
        for (const nav of navs()) {
            const active = nav.querySelector('a.active');
            if (active && nav.getBoundingClientRect().width)
                values[nav.dataset.navGroup] = position(nav, active);
        }
        try {
            sessionStorage.setItem(storageKey, JSON.stringify(values));
        } catch {
            /* Private storage can be unavailable. */
        }
    },
    true
);
window.addEventListener('resize', () => initializeIndicators());
window.addEventListener('ep:locale', () => initializeIndicators());
document.fonts?.ready.then(() => initializeIndicators());

for (const name of ['wheel', 'touchstart', 'scrollend'])
    window.addEventListener(
        name,
        () => {
            scrollTarget = '';
        },
        { passive: true }
    );
