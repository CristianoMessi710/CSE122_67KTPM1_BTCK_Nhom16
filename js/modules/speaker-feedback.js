/** SP6 extracted from SV2 overview, now reads attendee feedback entities. */
const main = document.querySelector('main'),
    E = window.EP;
main.innerHTML =
    '<div class="page-header"><div><h1>Phản hồi phiên</h1><p>Đánh giá từ người tham dự các phiên của bạn.</p></div><a class="btn btn-secondary" href="speaker-my-session.html">Phiên của tôi</a></div><label class="field">Chọn phiên<select id="feedback-session"></select></label><div id="feedback-summary"></div><div id="feedback-results" class="stack"></div>';
const select = document.getElementById('feedback-session');
function draw() {
    const sessions = E.store
            .get('sessions')
            .filter((s) => s.speakerIds.includes(E.currentUser().id)),
        chosen = select.value;
    select.innerHTML =
        '<option value="">Tất cả phiên</option>' +
        sessions.map((s) => `<option value="${E.esc(s.id)}">${E.esc(s.title)}</option>`).join('');
    select.value = chosen;
    const data = E.store
        .get('feedback')
        .filter(
            (f) =>
                f.status === 'published' &&
                sessions.some((s) => s.id === f.sessionId) &&
                (!chosen || f.sessionId === chosen)
        )
        .sort(
            (a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt)
        );
    const avg = data.length
        ? (data.reduce((n, f) => n + f.rating, 0) / data.length).toFixed(1)
        : '—';
    document.getElementById('feedback-summary').innerHTML =
        `<section class="card"><h2>${avg} / 5 · ${data.length} phản hồi</h2>${[5, 4, 3, 2, 1]
            .map((n) => {
                const count = data.filter((f) => f.rating === n).length;
                return `<div class="rating-distribution"><label>${n} sao · ${count}</label><progress value="${count}" max="${Math.max(1, data.length)}" aria-label="${n} sao"></progress></div>`;
            })
            .join('')}</section>`;
    document.getElementById('feedback-results').innerHTML = data.length
        ? data
              .map(
                  (f) =>
                      `<article class="card"><h3>${E.esc(sessions.find((s) => s.id === f.sessionId)?.title)}</h3><p>${f.rating}/5 sao · ${new Date(f.updatedAt || f.createdAt).toLocaleString('vi-VN')}</p><p>${E.esc(f.comment)}</p></article>`
              )
              .join('')
        : '<section class="empty-state">Chưa có phản hồi cho các phiên đã chọn.</section>';
}
select.onchange = draw;
window.addEventListener('storage', draw);
draw();
