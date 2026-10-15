/** Progressive UI enhancements; never changes business entities. */
import { icon } from './ui.js';
import { initializeIndicators } from './navigation.js';
function enhance() {
    document.querySelectorAll('select').forEach((select) => {
        if (select.parentElement.classList.contains('select-shell')) return;
        const shell = document.createElement('span');
        shell.className = 'select-shell';
        select.before(shell);
        shell.append(select);
    });
    document.querySelectorAll('.search > span').forEach((el) => {
        if (el.textContent.trim() === '⌕') el.outerHTML = icon('search');
    });
    document.querySelectorAll('.room-card, .alert-card, .session-card').forEach((el, index) => {
        if (el.dataset.motionReady) return;
        el.dataset.motionReady = 'true';
        el.style.setProperty('--stagger-delay', Math.min(index, 7) * 45 + 'ms');
        el.classList.add('reveal-card');
    });
    document.querySelectorAll('.tabs').forEach((tabs) => {
        const active = tabs.querySelector('.active, [aria-selected="true"]');
        if (!active) return;
        tabs.style.setProperty('--indicator-x', active.offsetLeft + 'px');
        tabs.style.setProperty('--indicator-width', active.offsetWidth + 'px');
    });

    initializeIndicators();
    document
        .querySelectorAll(
            'input:not([aria-label]),select:not([aria-label]),textarea:not([aria-label])'
        )
        .forEach((el) => {
            if (!el.closest('label') && !document.querySelector('label[for="' + el.id + '"]'))
                el.setAttribute(
                    'aria-label',
                    el.placeholder || el.name || el.id || 'Trường nhập liệu'
                );
        });
    document.querySelectorAll('button').forEach((b) => {
        if (!b.getAttribute('aria-label') && ['×', '↑', '↓', 'i'].includes(b.textContent.trim()))
            b.setAttribute(
                'aria-label',
                { '×': 'Đóng', '↑': 'Đưa lên', '↓': 'Đưa xuống', i: 'Thông tin' }[
                    b.textContent.trim()
                ]
            );
    });
    // Improve the existing SV2 overlay accessibility without replacing its event handlers.
    document.querySelectorAll('.modal-layer,.modal-backdrop').forEach((el) => {
        el.setAttribute('role', 'dialog');
        el.setAttribute('aria-modal', 'true');
        if (!el.getAttribute('aria-label'))
            el.setAttribute('aria-label', el.querySelector('h2')?.textContent || 'Hộp thoại');
    });
    document.querySelectorAll('table:not(.data-table)').forEach((table) => {
        const heads = [...table.querySelectorAll('thead th')].map((x) => x.textContent);
        table.classList.add('data-table');
        table
            .querySelectorAll('tbody tr')
            .forEach((row) =>
                row.querySelectorAll('td').forEach((td, i) => (td.dataset.label = heads[i] || ''))
            );
    });
    document
        .querySelectorAll('.btn.primary,.button.primary')
        .forEach((el) => el.classList.add('btn-primary'));
    document.querySelectorAll('.button').forEach((el) => el.classList.add('btn'));
    document
        .querySelectorAll('.btn.secondary,.btn.ghost')
        .forEach((el) =>
            el.classList.add(el.classList.contains('ghost') ? 'btn-ghost' : 'btn-secondary')
        );
    document.querySelectorAll('.btn.danger').forEach((el) => el.classList.add('btn-danger'));
}
let timer;
const observer = new MutationObserver(() => {
    clearTimeout(timer);
    timer = setTimeout(() => {
        observer.disconnect();
        enhance();
        observer.observe(document.body, { childList: true, subtree: true });
    }, 30);
});
enhance();
observer.observe(document.body, { childList: true, subtree: true });
window.addEventListener('resize', enhance);
document.addEventListener('keydown', (e) => {
    const overlay = [...document.querySelectorAll('.modal-layer,.modal-backdrop')].find(
        (x) => !x.hidden
    );
    if (!overlay) return;
    if (e.key === 'Escape') {
        overlay.hidden = true;
        return;
    }
    if (e.key === 'Tab') {
        const items = [...overlay.querySelectorAll('button,a,input,select,textarea')].filter(
            (x) => !x.disabled && !x.hidden
        );
        if (!items.length) return;
        const first = items[0],
            last = items.at(-1);
        if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
        }
    }
});

document.addEventListener('click', () => requestAnimationFrame(enhance));
