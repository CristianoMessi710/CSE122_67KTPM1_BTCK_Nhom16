/* SV1 attendee screens. LocalStorage entities follow EventPulse DATA_SCHEMA. */
(() => {
    'use strict';
    const $ = (id) => document.getElementById(id),
        esc = EP.esc,
        page = document.body.dataset.page;
    const params = new URLSearchParams(location.search);
    let initialAIFailure = params.get('state') === 'ai-error';
    function shouldFailAI() {
        const fail = initialAIFailure || sessionStorage.getItem('eventpulse_testFailAI') === '1';
        initialAIFailure = false;
        sessionStorage.removeItem('eventpulse_testFailAI');
        return fail;
    }
    const date = (v) => new Date(v).toLocaleDateString('vi-VN');
    const time = (v) =>
        new Date(v).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    const range = (s) => time(s.startTime) + ' – ' + time(s.endTime);
    const localDay = (v) => {
        const d = new Date(v);
        return [
            d.getFullYear(),
            String(d.getMonth() + 1).padStart(2, '0'),
            String(d.getDate()).padStart(2, '0')
        ].join('-');
    };
    const uid = () => EP.currentUser().id;
    const sessions = () => EP.store.get('sessions');
    const byId = (id) => sessions().find((s) => s.id === id);
    const agendas = () =>
        EP.store.get('agendas').filter((a) => a.userId === uid() && a.status === 'saved');
    const agendaSessions = () =>
        agendas()
            .map((a) => byId(a.sessionId))
            .filter(Boolean);
    const speaker = (s) => EP.store.get('users').find((u) => u.id === s.speakerIds?.[0]);
    const room = (s) => EP.store.get('rooms').find((r) => r.id === s.roomId);
    const event = (s) => EP.store.get('events').find((e) => e.id === s.eventId);
    const conflicts = (s, exclude = []) =>
        agendaSessions().filter(
            (a) => a.id !== s.id && !exclude.includes(a.id) && EP.overlap(a, s)
        );
    const cat = (c) =>
        ({
            'web-development': 'Web Development',
            ai: 'AI & Machine Learning',
            'product-design': 'Product & Design',
            cybersecurity: 'Cybersecurity',
            'data-analytics': 'Data & Analytics'
        })[c] || c;
    const remaining = (s) => Math.max(0, Number(s.capacity || 0) - Number(s.registeredCount || 0));
    const available = (s) =>
        s && s.status === 'published' && new Date(s.endTime) > new Date() && remaining(s) > 0;
    const link = (name, query = '') => EP.url('pages/attendee/attendee-' + name + '.html' + query);
    function heading(title, sub, active) {
        EP.shell(title, active);
        document.querySelector('main').innerHTML =
            `<div class="page-head"><div><h1>${title}</h1><p>${sub}</p></div></div>`;
        EP.footer();
        return document.querySelector('main');
    }
    function state(message, href, label = 'Quay lại Catalog') {
        return `<section class="card empty"><h2>${esc(message)}</h2>${href ? `<a class="btn secondary" href="${href}">${label}</a>` : ''}</section>`;
    }
    function card(s) {
        const saved = agendas().some((a) => a.sessionId === s.id);
        return `<article class="card session-card"><span class="badge ${remaining(s) ? 'success' : 'error'}">${remaining(s) ? 'Còn ' + remaining(s) + ' chỗ' : 'Hết chỗ'}</span><div class="session-icon">◈</div><span class="small">${esc(cat(s.category))}</span><h2>${esc(s.title)}</h2><div class="session-meta"><span>${esc(speaker(s)?.fullName || 'Đang cập nhật')}</span><span>${date(s.startTime)} · ${range(s)}</span><span>${esc(room(s)?.name || 'Chưa xếp phòng')}</span></div><div class="session-actions"><a class="btn secondary" href="${link('session-detail', '?id=' + encodeURIComponent(s.id))}">Chi tiết</a><button class="btn" data-add="${esc(s.id)}" ${saved || !available(s) ? 'disabled' : ''}>${saved ? 'Đã lưu' : available(s) ? 'Thêm vào agenda' : 'Không thể đăng ký'}</button></div></article>`;
    }
    function saveAgenda(id, removeId = '') {
        const s = byId(id);
        if (!available(s)) throw Error('Session không còn mở đăng ký hoặc đã hết chỗ.');
        if (agendas().some((a) => a.sessionId === id)) throw Error('Session đã có trong agenda.');
        if (conflicts(s, removeId ? [removeId] : []).length)
            throw Error('Lịch đã thay đổi. Session này vẫn trùng giờ. Hãy chọn lại.');
        let all = EP.store.get('agendas');
        if (removeId)
            all = all.map((a) =>
                a.userId === uid() && a.sessionId === removeId && a.status === 'saved'
                    ? { ...a, status: 'removed' }
                    : a
            );
        all.push({
            id: EP.uid('AGD'),
            userId: uid(),
            eventId: s.eventId,
            sessionId: s.id,
            status: 'saved',
            addedAt: new Date().toISOString()
        });
        EP.persist(
            { agendas: all },
            EP.notification('Đã cập nhật agenda', s.title, 'system', 'session', s.id)
        );
    }
    async function add(id, button) {
        await EP.task(button, async () => {
            const s = byId(id);
            if (!available(s)) throw Error('Phiên không còn nhận đăng ký.');
            const c = conflicts(s);
            if (c.length) {
                location.href = link(
                    'schedule-conflict',
                    '?session=' +
                        encodeURIComponent(id) +
                        '&conflict=' +
                        encodeURIComponent(c[0].id)
                );
                return;
            }
            if (!(await EP.confirm('Thêm vào agenda', s.title))) return;
            saveAgenda(id);
            EP.toast('Đã thêm vào agenda.', 'success');
            location.href = link('my-agenda');
        });
    }
    function bindAdd() {
        document
            .querySelectorAll('[data-add]')
            .forEach((b) => (b.onclick = () => add(b.dataset.add, b)));
    }
    function catalog() {
        const main = heading(
            'Khám phá các phiên sự kiện',
            'Tìm theo diễn giả, chủ đề, giờ và phòng.',
            'catalog'
        );
        main.insertAdjacentHTML(
            'beforeend',
            `<section class="hero"><h2>Chọn phiên phù hợp với bạn</h2><p>Xây dựng lịch cá nhân và nhận gợi ý theo sở thích.</p><div class="actions"><a class="btn" href="${link('recommendations')}">Gợi ý cho bạn</a><a class="btn btn-secondary" href="${link('my-ticket')}">Vé của tôi</a><a class="btn btn-secondary" href="${link('session-feedback')}">Đánh giá phiên</a></div></section><section class="card inline-note"><div class="toolbar"><label class="field">Tìm kiếm<input id="q" class="input" placeholder="Tên phiên hoặc diễn giả"></label><label class="field">Chủ đề<select id="category" class="select"><option value="">Tất cả</option>${[...new Set(sessions().map((s) => s.category))].map((c) => `<option value="${esc(c)}">${esc(cat(c))}</option>`).join('')}</select></label><label class="field">Ngày<select id="day" class="select"><option value="">Tất cả</option>${[
                ...new Set(sessions().map((s) => localDay(s.startTime)))
            ]
                .sort()
                .map((d) => `<option>${d}</option>`)
                .join(
                    ''
                )}</select></label><label class="field">Khung giờ<select id="slot" class="select"><option value="">Tất cả</option><option value="morning">Sáng trước 12 giờ</option><option value="afternoon">Chiều từ 12 đến 18 giờ</option><option value="evening">Tối từ 18 giờ</option></select></label><label class="field">Phòng<select id="room" class="select"><option value="">Tất cả</option>${EP.store
                .get('rooms')
                .map((r) => `<option value="${esc(r.id)}">${esc(r.name)}</option>`)
                .join(
                    ''
                )}</select></label><label class="field">Sắp xếp<select id="sort" class="select"><option value="time">Thời gian</option><option value="title">Tên A–Z</option><option value="capacity">Chỗ còn lại</option></select></label></div><div class="actions inline-note"><button class="btn secondary" id="clear">Xóa bộ lọc</button><button class="btn ghost" id="view" aria-pressed="false">Dạng danh sách</button></div></section><p id="count" class="inline-note" role="status"></p><div id="results" class="session-grid"></div>`
        );
        function draw() {
            const q = $('q').value.trim().toLowerCase();
            let list = sessions()
                .filter((s) => s.status === 'published' || s.status === 'completed')
                .filter((s) => {
                    const h = new Date(s.startTime).getHours();
                    return (
                        (!q ||
                            [s.title, speaker(s)?.fullName].join(' ').toLowerCase().includes(q)) &&
                        (!$('category').value || s.category === $('category').value) &&
                        (!$('room').value || s.roomId === $('room').value) &&
                        (!$('day').value || localDay(s.startTime) === $('day').value) &&
                        (!$('slot').value ||
                            ($('slot').value === 'morning'
                                ? h < 12
                                : $('slot').value === 'afternoon'
                                  ? h >= 12 && h < 18
                                  : h >= 18))
                    );
                });
            list.sort((a, b) =>
                $('sort').value === 'title'
                    ? a.title.localeCompare(b.title, 'vi')
                    : $('sort').value === 'capacity'
                      ? remaining(b) - remaining(a)
                      : new Date(a.startTime) - new Date(b.startTime)
            );
            $('count').textContent = list.length + ' phiên';
            $('results').innerHTML = list.length
                ? list.map(card).join('')
                : state('Không có session khớp bộ lọc');
            bindAdd();
        }
        let timer;
        $('q').oninput = () => {
            clearTimeout(timer);
            timer = setTimeout(draw, 250);
        };
        ['category', 'room', 'day', 'slot', 'sort'].forEach((k) => ($(k).onchange = draw));
        $('clear').onclick = () => {
            ['q', 'category', 'room', 'day', 'slot'].forEach((k) => ($(k).value = ''));
            draw();
        };
        $('view').onclick = () => {
            const v = $('results').classList.toggle('session-list-view');
            $('view').setAttribute('aria-pressed', v);
            $('view').textContent = v ? 'Dạng thẻ' : 'Dạng danh sách';
        };
        window.addEventListener('storage', draw);
        draw();
        main.insertAdjacentHTML(
            'beforeend',
            '<section id="speakers" class="card inline-note"><h2>Diễn giả</h2><div class="grid grid-3">' +
                EP.store
                    .get('users')
                    .filter((u) => u.role === 'speaker' && u.status === 'active')
                    .map(
                        (u) =>
                            '<article><h3>' +
                            esc(u.fullName) +
                            '</h3><p>' +
                            esc(u.bio || 'Thông tin đang cập nhật.') +
                            '</p></article>'
                    )
                    .join('') +
                '</div></section>'
        );
    }
    function detail() {
        const id = params.get('id'),
            s = byId(id),
            main = heading('Chi tiết session', 'Thông tin phiên và tình trạng đăng ký.', 'catalog');
        if (!s || !['published', 'completed'].includes(s.status)) {
            main.insertAdjacentHTML(
                'beforeend',
                state(
                    s ? 'Session đã bị hủy hoặc chưa công bố.' : 'Không tìm thấy session.',
                    link('session-catalog')
                )
            );
            return;
        }
        main.insertAdjacentHTML(
            'beforeend',
            `<div class="detail-grid"><section class="card"><span class="badge info">${esc(cat(s.category))}</span><h2 class="inline-note">${esc(s.title)}</h2><p>${date(s.startTime)} · ${range(s)} · ${esc(room(s)?.name || 'Chưa xếp phòng')}</p><div class="tabs" role="tablist" aria-label="Thông tin session">${[
                ['description', 'Mô tả'],
                ['speaker', 'Diễn giả'],
                ['materials', 'Tài liệu']
            ]
                .map(
                    ([k, t], i) =>
                        `<button class="btn secondary" role="tab" id="tab-${k}" aria-controls="panel-${k}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}">${t}</button>`
                )
                .join(
                    ''
                )}</div><div id="panel-description" class="tab-panel" role="tabpanel" aria-labelledby="tab-description"><p>${esc(s.description)}</p>${s.objectives ? `<h3>Mục tiêu</h3><p>${esc(s.objectives)}</p>` : ''}</div><div id="panel-speaker" class="tab-panel" role="tabpanel" aria-labelledby="tab-speaker" hidden>${(
                s.speakerIds || []
            )
                .map((id) => {
                    const u = EP.store.get('users').find((x) => x.id === id);
                    return `<h3>${esc(u?.fullName || id)}</h3><p>${esc(u?.bio || 'Thông tin đang cập nhật.')}</p>`;
                })
                .join(
                    ''
                )}</div><div id="panel-materials" class="tab-panel" role="tabpanel" aria-labelledby="tab-materials" hidden></div></section><aside class="card stack"><h2>Đăng ký phiên</h2><p id="capacity" role="status"></p><button id="detail-add" class="btn">Thêm vào agenda</button><a class="btn secondary" href="${link('my-agenda')}">Xem My Agenda</a><a href="${link('session-catalog')}">Quay lại Catalog</a></aside></div>`
        );
        const mats = EP.store
            .get('materials')
            .filter((m) => m.sessionId === id && m.status === 'available');
        $('panel-materials').innerHTML = mats.length
            ? mats
                  .map(
                      (m) =>
                          `<article class="state"><strong>${esc(m.title || m.fileName)}</strong>${m.fileUrl && /^(https?:\/\/|assets\/)/.test(m.fileUrl) ? `<p><a href="${esc(m.fileUrl.startsWith('assets/') ? EP.url(m.fileUrl) : m.fileUrl)}" target="_blank" rel="noopener">Mở tài liệu</a></p>` : '<p>Tài liệu đang được cập nhật.</p>'}</article>`
                  )
                  .join('')
            : '<p>Chưa có tài liệu cho session này.</p>';
        const tabs = [...document.querySelectorAll('[role=tab]')];
        const select = (i) =>
            tabs.forEach((b, j) => {
                b.setAttribute('aria-selected', i === j);
                b.tabIndex = i === j ? 0 : -1;
                $(b.getAttribute('aria-controls')).hidden = i !== j;
            });
        tabs.forEach((b, i) => {
            b.onclick = () => select(i);
            b.onkeydown = (e) => {
                if (['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) {
                    e.preventDefault();
                    const n =
                        e.key === 'Home'
                            ? 0
                            : e.key === 'End'
                              ? tabs.length - 1
                              : (i + (e.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
                    select(n);
                    tabs[n].focus();
                }
            };
        });
        function refresh() {
            const fresh = byId(id),
                saved = agendas().some((a) => a.sessionId === id);
            $('capacity').textContent =
                fresh && ['published', 'completed'].includes(fresh.status)
                    ? remaining(fresh) + ' / ' + fresh.capacity + ' chỗ còn lại'
                    : 'Phiên không còn công bố.';
            $('detail-add').disabled = saved || !available(fresh);
            $('detail-add').textContent = saved ? 'Đã có trong agenda' : 'Thêm vào agenda';
        }
        $('detail-add').onclick = (e) => add(id, e.currentTarget);
        window.addEventListener('storage', refresh);
        setInterval(refresh, 3000);
        refresh();
    }
    function agenda() {
        const main = heading(
            'Lịch trình của tôi',
            'Timeline theo ngày. Kéo thả hoặc dùng nút lên/xuống để đổi thứ tự hiển thị; thời gian phiên không thay đổi.',
            'agenda'
        );
        main.insertAdjacentHTML(
            'beforeend',
            `<div class="actions no-print"><a class="btn" href="${link('session-catalog')}">Thêm session</a><a class="btn secondary" href="${link('recommendations')}">Gợi ý AI</a><button class="btn secondary" id="print">In / Xuất PDF</button><button class="btn ghost" id="chronological">Sắp theo giờ</button></div><div class="detail-grid inline-note"><section id="timeline"></section><aside class="card"><h2>Tổng quan lịch</h2><div id="metrics" class="metrics"></div></aside></div>`
        );
        function orderList() {
            const all = agendaSessions(),
                order = EP.store.get('agendaOrder', {})[uid()] || [];
            return all.sort(
                (a, b) =>
                    localDay(a.startTime).localeCompare(localDay(b.startTime)) ||
                    (order.includes(a.id) && order.includes(b.id)
                        ? order.indexOf(a.id) - order.indexOf(b.id)
                        : new Date(a.startTime) - new Date(b.startTime))
            );
        }
        function reorder(from, to) {
            const list = orderList();
            const a = list.find((x) => x.id === from),
                b = list.find((x) => x.id === to);
            if (!a || !b || localDay(a.startTime) !== localDay(b.startTime))
                throw Error('Chỉ đổi thứ tự trong cùng ngày.');
            const ids = list.map((s) => s.id),
                i = ids.indexOf(from),
                j = ids.indexOf(to);
            ids.splice(i, 1);
            ids.splice(j, 0, from);
            EP.persist(
                { agendaOrder: { ...EP.store.get('agendaOrder', {}), [uid()]: ids } },
                EP.notification('Đã sắp xếp agenda', 'Thứ tự hiển thị đã được cập nhật.')
            );
            draw();
        }
        let dragged = '';
        function draw() {
            const list = orderList(),
                days = [...new Set(list.map((s) => localDay(s.startTime)))];
            const pairs = [];
            list.forEach((s, i) =>
                list.slice(i + 1).forEach((t) => {
                    if (EP.overlap(s, t)) pairs.push([s, t]);
                })
            );
            const hours = list.reduce(
                (sum, s) => sum + (new Date(s.endTime) - new Date(s.startTime)) / 3600000,
                0
            );
            $('metrics').innerHTML = [
                ['Phiên', list.length],
                ['Giờ phiên', Math.round(hours * 10) / 10],
                ['Ngày', days.length],
                ['Xung đột', pairs.length]
            ]
                .map(([a, b]) => `<div class="kpi">${a}<strong>${b}</strong></div>`)
                .join('');
            $('timeline').innerHTML = list.length
                ? days
                      .map(
                          (d) =>
                              `<h2 class="day-title">${date(d + 'T12:00:00')}</h2><div class="timeline-day">${list
                                  .filter((s) => localDay(s.startTime) === d)
                                  .map((s, i, arr) => {
                                      const c = conflicts(s);
                                      return `<article class="card agenda-card" draggable="true" data-drag="${esc(s.id)}"><p class="agenda-time">${range(s)}</p><h3>${esc(s.title)}</h3><p>${esc(room(s)?.name || 'Chưa xếp phòng')}</p>${c.length ? `<div class="state warning"><p>Trùng với ${esc(c.map((x) => x.title).join(', '))}</p><a class="btn secondary" href="${link('schedule-conflict', '?session=' + encodeURIComponent(s.id) + '&conflict=' + encodeURIComponent(c[0].id))}">Xử lý xung đột</a></div>` : ''}<div class="agenda-controls inline-note"><a class="btn secondary" href="${link('session-detail', '?id=' + encodeURIComponent(s.id))}">Chi tiết</a><button class="btn danger" data-remove="${esc(s.id)}">Bỏ khỏi lịch</button><button class="btn ghost" data-move="${esc(s.id)}" data-to="${esc(arr[i - 1]?.id || '')}" ${i === 0 ? 'disabled' : ''} aria-label="Đưa phiên lên">↑</button><button class="btn ghost" data-move="${esc(s.id)}" data-to="${esc(arr[i + 1]?.id || '')}" ${i === arr.length - 1 ? 'disabled' : ''} aria-label="Đưa phiên xuống">↓</button></div></article>`;
                                  })
                                  .join('')}</div>`
                      )
                      .join('')
                : state('Agenda đang trống', link('session-catalog'), 'Khám phá session');
            document.querySelectorAll('[data-remove]').forEach(
                (b) =>
                    (b.onclick = async () => {
                        const s = byId(b.dataset.remove);
                        if (!(await EP.confirm('Bỏ khỏi lịch', s.title))) return;
                        EP.task(b, () => {
                            EP.persist(
                                {
                                    agendas: EP.store
                                        .get('agendas')
                                        .map((a) =>
                                            a.userId === uid() &&
                                            a.sessionId === s.id &&
                                            a.status === 'saved'
                                                ? { ...a, status: 'removed' }
                                                : a
                                        )
                                },
                                EP.notification(
                                    'Đã cập nhật agenda',
                                    s.title + ' đã được bỏ khỏi lịch.'
                                )
                            );
                            draw();
                            EP.toast('Đã cập nhật agenda.', 'success');
                        });
                    })
            );
            document
                .querySelectorAll('[data-move]')
                .forEach(
                    (b) =>
                        (b.onclick = () => EP.task(b, () => reorder(b.dataset.move, b.dataset.to)))
                );
            document.querySelectorAll('[data-drag]').forEach((el) => {
                el.ondragstart = (e) => {
                    dragged = el.dataset.drag;
                    e.dataTransfer.setData('text/plain', dragged);
                    el.classList.add('dragging');
                };
                el.ondragend = () => el.classList.remove('dragging');
                el.ondragover = (e) => e.preventDefault();
                el.ondrop = (e) => {
                    e.preventDefault();
                    try {
                        reorder(dragged, el.dataset.drag);
                    } catch (err) {
                        EP.inlineError(err);
                    }
                };
            });
        }
        $('print').onclick = () => window.print();
        $('chronological').onclick = (e) =>
            EP.task(e.currentTarget, () => {
                EP.store.set('agendaOrder', { ...EP.store.get('agendaOrder', {}), [uid()]: [] });
                draw();
                EP.toast('Đã sắp theo giờ.');
            });
        window.addEventListener('storage', draw);
        draw();
    }
    function hasAttended(s) {
        return EP.store
            .get('userTickets')
            .some(
                (t) =>
                    t.userId === uid() &&
                    t.eventId === s.eventId &&
                    t.status === 'checkedIn' &&
                    t.checkedInAt &&
                    new Date(t.checkedInAt) <= new Date(s.endTime)
            );
    }
    function eligible(s) {
        return (
            s &&
            ['published', 'completed'].includes(s.status) &&
            new Date(s.endTime) <= new Date() &&
            hasAttended(s)
        );
    }
    function feedback() {
        const main = heading(
            'Phản hồi session',
            'Đánh giá các phiên đã kết thúc tại sự kiện bạn đã check-in.',
            'feedback'
        );
        const list = sessions().filter(eligible),
            id = params.get('id') || list[0]?.id,
            s = byId(id);
        if (!s || !eligible(s)) {
            main.insertAdjacentHTML(
                'beforeend',
                state(
                    params.get('id')
                        ? 'Phiên chưa kết thúc hoặc bạn chưa có check-in hợp lệ.'
                        : 'Chưa có session đủ điều kiện đánh giá.',
                    link('my-ticket'),
                    'Xem vé và check-in'
                )
            );
            return;
        }
        const all = EP.store.get('feedback'),
            old = all.find(
                (f) => f.userId === uid() && f.sessionId === s.id && f.status !== 'hidden'
            );
        main.insertAdjacentHTML(
            'beforeend',
            `<label class="field no-print">Chọn session<select class="select" id="feedback-session">${list.map((x) => `<option value="${esc(x.id)}" ${x.id === s.id ? 'selected' : ''}>${esc(x.title)}</option>`).join('')}</select></label><div class="grid grid-2 inline-note"><form id="feedback-form" class="card stack" novalidate><h2>${esc(s.title)}</h2><fieldset><legend>Đánh giá sao *</legend><div class="rating" role="group" aria-label="Chọn số sao">${[1, 2, 3, 4, 5].map((n) => `<button type="button" data-rating="${n}" aria-pressed="false" aria-label="${n} sao">★</button>`).join('')}</div><p id="rating-error" class="form-error"></p></fieldset><label class="field" for="comment">Nhận xét * từ 10 đến 500 ký tự<textarea id="comment" minlength="10" maxlength="500" required>${esc(old?.comment || '')}</textarea></label><p id="comment-error" class="form-error"></p><span id="comment-count" class="small"></span><button class="btn" id="feedback-submit">${old ? 'Cập nhật đánh giá' : 'Gửi đánh giá'}</button></form><aside class="card"><h2>Đánh giá của bạn</h2>${old ? `<p>${old.rating}/5 sao</p><p>${esc(old.comment)}</p><button id="feedback-delete" class="btn danger">Xóa đánh giá</button>` : '<p>Bạn chưa đánh giá phiên này.</p>'}</aside></div>`
        );
        let rating = old?.rating || 0;
        const setRating = (n) => {
            rating = n;
            document.querySelectorAll('[data-rating]').forEach((b) => {
                b.classList.toggle('selected', +b.dataset.rating <= n);
                b.setAttribute('aria-pressed', +b.dataset.rating === n);
            });
        };
        setRating(rating);
        document
            .querySelectorAll('[data-rating]')
            .forEach((b) => (b.onclick = () => setRating(+b.dataset.rating)));
        const count = () => {
            $('comment-count').textContent = $('comment').value.length + '/500';
        };
        $('comment').oninput = count;
        count();
        $('feedback-session').onchange = () =>
            (location.href = link(
                'session-feedback',
                '?id=' + encodeURIComponent($('feedback-session').value)
            ));
        $('feedback-form').onsubmit = async (e) => {
            e.preventDefault();
            const comment = $('comment').value.trim();
            $('rating-error').textContent = rating ? '' : 'Vui lòng chọn sao.';
            $('comment-error').textContent =
                comment.length >= 10 && comment.length <= 500
                    ? ''
                    : 'Nhận xét cần từ 10 đến 500 ký tự.';
            if (!rating || comment.length < 10 || comment.length > 500) return;
            if (old && !(await EP.confirm('Cập nhật đánh giá', 'Lưu nội dung đánh giá mới?')))
                return;
            EP.task($('feedback-submit'), () => {
                if (!eligible(byId(id))) throw Error('Phiên không còn đủ điều kiện đánh giá.');
                const data = EP.store.get('feedback'),
                    existing = data.find((f) => f.userId === uid() && f.sessionId === s.id),
                    now = new Date().toISOString();
                const item = {
                    id: existing?.id || EP.uid('FDB'),
                    sessionId: s.id,
                    userId: uid(),
                    rating,
                    comment,
                    status: 'published',
                    createdAt: existing?.createdAt || now,
                    updatedAt: now
                };
                EP.persist(
                    {
                        feedback: existing
                            ? data.map((f) => (f.id === existing.id ? item : f))
                            : [...data, item]
                    },
                    EP.notification('Đã lưu đánh giá', s.title, 'feedback', 'feedback', item.id)
                );
                feedback();
                EP.toast('Đã lưu đánh giá.', 'success');
            });
        };
        if ($('feedback-delete'))
            $('feedback-delete').onclick = async (e) => {
                const b = e.currentTarget;
                if (!(await EP.confirm('Xóa đánh giá', 'Bạn chắc chắn muốn xóa đánh giá này?')))
                    return;
                EP.task(b, () => {
                    EP.persist(
                        {
                            feedback: EP.store
                                .get('feedback')
                                .filter((f) => !(f.userId === uid() && f.id === old.id))
                        },
                        EP.notification('Đã xóa đánh giá', s.title, 'feedback', 'feedback', old.id)
                    );
                    feedback();
                    EP.toast('Đã xóa đánh giá.');
                });
            };
    }
    function ticket() {
        const main = heading(
            'Vé của tôi',
            'Vé và trạng thái check-in được cập nhật từ dữ liệu dùng chung.',
            'ticket'
        );
        main.insertAdjacentHTML('beforeend', '<div id="ticket-content"></div>');
        let selected = params.get('id'),
            last = '';
        const valid = (t, e) =>
            ['valid', 'checkedIn'].includes(t.status) &&
            (!t.expiresAt || new Date(t.expiresAt) > new Date()) &&
            e &&
            new Date(e.endDate + 'T23:59:59') >= new Date() &&
            e.status !== 'cancelled';
        function draw(force = false) {
            const all = EP.store.get('userTickets').filter((t) => t.userId === uid()),
                events = EP.store.get('events'),
                types = EP.store.get('ticketTypes'),
                stamp = JSON.stringify([
                    all,
                    events,
                    types,
                    all.map((t) =>
                        valid(
                            t,
                            events.find((e) => e.id === t.eventId)
                        )
                    )
                ]);
            if (!force && last === stamp) return;
            last = stamp;
            const t = all.find((x) => x.id === selected) || all[0];
            if (!t) {
                $('ticket-content').innerHTML = state(
                    'Bạn chưa có vé.',
                    link('session-catalog'),
                    'Khám phá sự kiện'
                );
                return;
            }
            selected = t.id;
            const ev = events.find((e) => e.id === t.eventId),
                type = types.find((x) => x.id === t.ticketTypeId),
                ok = valid(t, ev),
                checked = t.status === 'checkedIn';
            $('ticket-content').innerHTML =
                `<label class="field">Chọn vé<select id="ticket-select" class="select">${all.map((x) => `<option value="${esc(x.id)}" ${x.id === t.id ? 'selected' : ''}>${esc(x.ticketCode)}</option>`).join('')}</select></label><div class="grid grid-2 inline-note"><section class="ticket-card"><strong>EventPulse</strong><h2 class="inline-note">${esc(ev?.name || 'Sự kiện chưa xác định')}</h2><p>${esc(type?.name || 'Loại vé chưa xác định')}</p><p>${esc(EP.currentUser().fullName)}</p><div class="ticket-code">${esc(t.ticketCode)}</div><p>${esc(ev?.startDate)} – ${esc(ev?.endDate)} · ${esc(ev?.location)}</p></section><section class="card stack"><canvas id="qr" class="ticket-qr" width="210" height="210" aria-label="Mã QR mô phỏng"></canvas><p class="small">QR mô phỏng; dùng mã vé khi check-in.</p><p role="status">${!ok ? 'Vé không hợp lệ, bị hủy hoặc đã hết hạn.' : checked ? 'Đã check-in lúc ' + new Date(t.checkedInAt).toLocaleString('vi-VN') : 'Chưa check-in'}</p><div class="actions"><button id="checkin" class="btn" ${!ok || checked ? 'disabled' : ''}>${checked ? 'Đã check-in' : 'Xác nhận check-in mock'}</button><button class="btn secondary" id="download-ticket" ${!ok ? 'disabled' : ''}>Tải vé PNG</button></div><a href="${link('session-feedback')}">Phản hồi các session đã tham dự</a></section></div>`;
            const canvas = $('qr'),
                ctx = canvas.getContext('2d');
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, 210, 210);
            ctx.fillStyle = '#1F1F2C';
            let seed = [...t.ticketCode].reduce((a, c) => a + c.charCodeAt(0), 0);
            for (let y = 0; y < 25; y++)
                for (let x = 0; x < 25; x++) {
                    seed = (seed * 1664525 + 1013904223) >>> 0;
                    if (seed % 3) ctx.fillRect(5 + x * 8, 5 + y * 8, 8, 8);
                }
            for (const [x, y] of [
                [5, 5],
                [149, 5],
                [5, 149]
            ]) {
                ctx.fillStyle = '#1F1F2C';
                ctx.fillRect(x, y, 56, 56);
                ctx.fillStyle = '#FFFFFF';
                ctx.fillRect(x + 8, y + 8, 40, 40);
                ctx.fillStyle = '#1F1F2C';
                ctx.fillRect(x + 16, y + 16, 24, 24);
            }
            $('ticket-select').onchange = () => {
                selected = $('ticket-select').value;
                draw(true);
            };
            $('checkin').onclick = (e) =>
                EP.task(e.currentTarget, () => {
                    const data = EP.store.get('userTickets'),
                        fresh = data.find((x) => x.id === t.id && x.userId === uid()),
                        ev = EP.store.get('events').find((x) => x.id === fresh?.eventId);
                    if (!fresh || !valid(fresh, ev) || fresh.status === 'checkedIn')
                        throw Error('Không thể check-in vé này.');
                    EP.persist(
                        {
                            userTickets: data.map((x) =>
                                x.id === fresh.id
                                    ? {
                                          ...x,
                                          status: 'checkedIn',
                                          checkedInAt: new Date().toISOString()
                                      }
                                    : x
                            )
                        },
                        EP.notification(
                            'Check-in thành công',
                            fresh.ticketCode,
                            'ticket',
                            'ticket',
                            fresh.id
                        )
                    );
                    draw(true);
                    EP.toast('Check-in thành công.', 'success');
                });
            $('download-ticket').onclick = () => {
                const out = document.createElement('canvas');
                out.width = 1000;
                out.height = 600;
                const c = out.getContext('2d');
                c.fillStyle = '#4F46FF';
                c.fillRect(0, 0, 1000, 600);
                c.fillStyle = '#FFFFFF';
                c.font = 'bold 28px Arial';
                c.fillText('EventPulse', 40, 60);
                c.font = '22px Arial';
                [
                    ev?.name,
                    type?.name,
                    EP.currentUser().fullName,
                    t.ticketCode,
                    ev?.startDate + ' – ' + ev?.endDate,
                    ev?.location
                ].forEach((v, i) => c.fillText(String(v || ''), 40, 120 + i * 55, 630));
                c.drawImage(canvas, 720, 150);
                c.font = '16px Arial';
                c.fillText('QR mock', 780, 390);
                const a = document.createElement('a');
                a.download = 'eventpulse-' + t.ticketCode + '.png';
                a.href = out.toDataURL('image/png');
                a.click();
            };
        }
        draw();
        window.addEventListener('storage', () => {
            try {
                draw(true);
            } catch (e) {
                EP.inlineError(e);
            }
        });
        setInterval(() => {
            try {
                draw();
            } catch (e) {
                EP.inlineError(e);
            }
        }, 5000);
    }
    // A4/A5 retain SV1 logic, as required by the integration ownership policy.
    async function recommendations() {
        const main = heading(
            'Gợi ý dành cho bạn',
            'AI mock theo sở thích và lịch hiện tại. Chỉ lưu sau khi bạn xác nhận.',
            'catalog'
        );
        main.insertAdjacentHTML(
            'beforeend',
            '<div id="ai" class="card ai-card" role="status">Đang phân tích…</div>'
        );
        let round = 0;
        async function run() {
            const box = $('ai');
            box.innerHTML = '<h2>Đang tạo đề xuất…</h2><div class="skeleton"></div>';
            await EP.delay(500);
            if (shouldFailAI()) {
                sessionStorage.removeItem('eventpulse_testFailAI');
                box.innerHTML =
                    '<h2>Không thể xử lý yêu cầu lúc này.</h2><button id="ai-retry" class="btn">Thử lại</button><a class="btn secondary" href="' +
                    link('session-catalog') +
                    '">Dùng thủ công</a>';
                $('ai-retry').onclick = run;
                return;
            }
            const interests = EP.currentUser().interests || [],
                history = agendaSessions().map((s) => s.category),
                topics = [...interests, ...history];
            let all = sessions().filter(
                (s) =>
                    available(s) &&
                    !agendas().some((a) => a.sessionId === s.id) &&
                    !conflicts(s).length
            );
            if (!topics.length || !all.length) {
                box.innerHTML =
                    state(
                        'Không đủ dữ liệu để đưa ra đề xuất.',
                        EP.url('profile.html'),
                        'Cập nhật sở thích'
                    ) +
                    `<a class="btn secondary" href="${link('session-catalog')}">Chọn thủ công</a>`;
                return;
            }
            const score = (s) =>
                [s.category, ...(s.tags || [])].filter((t) => topics.includes(t)).length;
            all.sort((a, b) => score(b) - score(a));
            const offset = round++ % all.length;
            all = [...all.slice(offset), ...all.slice(0, offset)].slice(0, 3);
            box.innerHTML = `<h2>Session đề xuất</h2><p>Bỏ chọn những phiên bạn không muốn lưu.</p>${all.map((s) => `<article class="card inline-note"><label><input type="checkbox" data-ai-id="${esc(s.id)}" checked> ${esc(s.title)}</label><p>${date(s.startTime)} · ${range(s)}</p><details><summary>Vì sao gợi ý này</summary><p>${score(s) ? 'Có chủ đề trùng với sở thích hoặc lịch đã lưu.' : 'Gợi ý khám phá chủ đề mới.'} Không trùng agenda hiện tại. Điểm mock ${Math.min(96, 70 + score(s) * 8)}%.</p></details></article>`).join('')}<div class="actions inline-note"><button id="ai-accept" class="btn">Lưu các phiên đã chọn</button><button id="ai-retry" class="btn secondary">Tạo lại</button><a class="btn ghost" href="${link('my-agenda')}">Bỏ qua</a></div>`;
            $('ai-retry').onclick = run;
            $('ai-accept').onclick = (e) =>
                EP.task(e.currentTarget, async () => {
                    const chosen = [...document.querySelectorAll('[data-ai-id]:checked')].map((b) =>
                        byId(b.dataset.aiId)
                    );
                    if (!chosen.length) throw Error('Chọn ít nhất một phiên.');
                    for (let i = 0; i < chosen.length; i++) {
                        if (
                            !available(chosen[i]) ||
                            conflicts(chosen[i]).length ||
                            agendas().some((a) => a.sessionId === chosen[i].id)
                        )
                            throw Error('Lịch hoặc trạng thái phiên đã thay đổi. Hãy tạo lại.');
                        if (chosen.slice(i + 1).some((s) => EP.overlap(s, chosen[i])))
                            throw Error(
                                'Các phiên được chọn trùng nhau. Bỏ chọn một phiên trước khi lưu.'
                            );
                    }
                    if (
                        !(await EP.confirm(
                            'Lưu gợi ý',
                            chosen.length + ' phiên sẽ được thêm vào agenda.'
                        ))
                    )
                        return;
                    for (const s of chosen) {
                        const fresh = byId(s.id);
                        if (
                            !available(fresh) ||
                            conflicts(fresh).length ||
                            agendas().some((a) => a.sessionId === s.id)
                        )
                            throw Error('Dữ liệu vừa thay đổi. Hãy tạo lại gợi ý.');
                    }
                    const added = chosen.map((s) => ({
                        id: EP.uid('AGD'),
                        userId: uid(),
                        eventId: s.eventId,
                        sessionId: s.id,
                        status: 'saved',
                        addedAt: new Date().toISOString()
                    }));
                    EP.persist(
                        { agendas: [...EP.store.get('agendas'), ...added] },
                        EP.notification(
                            'Đã lưu gợi ý',
                            chosen.length + ' phiên được thêm vào agenda.'
                        )
                    );
                    location.href = link('my-agenda');
                });
        }
        await run();
    }
    async function conflict() {
        const main = heading(
            'Xử lý xung đột lịch',
            'AI mock đề xuất phiên thay thế; bạn kiểm soát việc áp dụng.',
            'agenda'
        );
        main.insertAdjacentHTML('beforeend', '<div id="conflict-result" class="stack"></div>');
        async function run() {
            const box = $('conflict-result');
            box.innerHTML =
                '<div class="card"><h2>Đang phân tích xung đột…</h2><div class="skeleton"></div></div>';
            await EP.delay(450);
            const candidate = byId(params.get('session')),
                other = byId(params.get('conflict'));
            if (
                !candidate ||
                !other ||
                !EP.overlap(candidate, other) ||
                !agendas().some((a) => a.sessionId === other.id)
            ) {
                box.innerHTML = state(
                    'Không còn cặp xung đột hợp lệ. Hãy kiểm tra lại agenda.',
                    link('my-agenda'),
                    'Về My Agenda'
                );
                return;
            }
            const replacing = agendas().some((a) => a.sessionId === candidate.id);
            let alternatives = sessions().filter(
                (s) =>
                    s.id !== candidate.id &&
                    s.id !== other.id &&
                    s.eventId === candidate.eventId &&
                    available(s) &&
                    !agendas().some((a) => a.sessionId === s.id) &&
                    !conflicts(s, replacing ? [candidate.id] : []).length
            );
            alternatives.sort(
                (a, b) => (b.category === candidate.category) - (a.category === candidate.category)
            );
            const fail = shouldFailAI();
            if (fail) sessionStorage.removeItem('eventpulse_testFailAI');
            box.innerHTML = `<div class="grid grid-2"><article class="card"><h2>${esc(candidate.title)}</h2><p>${range(candidate)}</p></article><article class="card"><h2>${esc(other.title)}</h2><p>${range(other)}</p></article></div><section class="card ai-card"><h2>${fail ? 'Không thể xử lý yêu cầu lúc này.' : alternatives.length ? 'Chọn phiên thay thế' : 'Không có phiên thay thế phù hợp.'}</h2><p>${replacing ? 'Áp dụng sẽ bỏ phiên ' + esc(candidate.title) + ' và thêm phiên bạn chọn.' : 'Phiên mới chưa được lưu. Áp dụng sẽ thêm lựa chọn thay thế.'}</p>${fail ? '<p>Bạn có thể thử lại hoặc chọn thủ công từ các phiên hợp lệ dưới đây.</p>' : ''}${alternatives.map((s) => `<article class="card inline-note"><h3>${esc(s.title)}</h3><p>${range(s)} · ${esc(room(s)?.name || '')}</p><p>${s.category === candidate.category ? 'Cùng chủ đề.' : 'Chủ đề khác để bạn cân nhắc.'} Không trùng với các phiên giữ lại; còn ${remaining(s)} chỗ. Độ tin cậy mock ${s.category === candidate.category ? '89' : '72'}%.</p><button class="btn" data-alt="${esc(s.id)}">${fail ? 'Chọn thủ công' : 'Chấp nhận'}</button></article>`).join('')}<div class="actions inline-note"><button id="conflict-retry" class="btn secondary">Thử lại</button><a class="btn ghost" href="${link('my-agenda')}">Từ chối và giữ lịch</a><a class="btn ghost" href="${link('session-catalog')}">Xem Catalog</a></div></section>`;
            $('conflict-retry').onclick = run;
            document.querySelectorAll('[data-alt]').forEach(
                (b) =>
                    (b.onclick = () =>
                        EP.task(b, async () => {
                            if (
                                !(await EP.confirm(
                                    'Áp dụng phiên thay thế',
                                    byId(b.dataset.alt).title
                                ))
                            )
                                return;
                            saveAgenda(b.dataset.alt, replacing ? candidate.id : '');
                            location.href = link('my-agenda');
                        }))
            );
        }
        await run();
    }
    async function boot() {
        try {
            if (!(await EP.guard(['attendee']))) return;
            await EP.delay(150);
            await (
                { catalog, detail, agenda, feedback, ticket, recommendations, conflict }[page] ||
                (() => {
                    location.href = EP.url('404.html');
                })
            )();
        } catch (e) {
            EP.errorPanel(e, boot);
        }
    }
    boot();
})();
