import { locale } from '../i18n.js';
(() => {
    'use strict';
    const EP = window.EventPulse || {};
    if (typeof EP.ensureSeed === 'function') EP.ensureSeed();

    const USER_ID = window.EP.currentUser().id;
    const $ = (s) => document.querySelector(s);

    function buildFromShared() {
        const sessions = EP.getSessionsForSpeaker(USER_ID),
            agendas = window.EP.store.get('agendas');
        return sessions.map((s) => {
            const records = agendas.filter((a) => a.sessionId === s.id && a.status === 'saved');
            const saves = records.length,
                registered = Number(s.registeredCount || 0);
            const days = [...new Set(records.map((a) => a.addedAt.slice(0, 10)))].sort();
            const points = days.map(
                (day) => records.filter((a) => a.addedAt.slice(0, 10) <= day).length
            );
            return {
                id: s.id,
                title: s.title,
                saves,
                forecast: Math.round(registered * 0.95 + saves * 2),
                confidence: saves >= 3 ? 82 : 58,
                points: points.length ? points : [0],
                days: days.length ? days : ['Chưa có'],
                insufficient: !saves && !registered,
                reasons: [
                    [
                        'Dữ liệu hiện tại',
                        registered + ' lượt đăng ký và ' + saves + ' lượt lưu lịch.'
                    ],
                    [
                        'Độ tin cậy',
                        saves >= 3
                            ? 'Có ít nhất ba lượt lưu lịch.'
                            : 'Mẫu ít; AI chưa chắc chắn, cần kiểm tra thủ công.'
                    ],
                    [
                        'Mô hình mô phỏng',
                        'Dự kiến = 95% lượt đăng ký + 2 lần lượt lưu. Không phải số người tham dự thực tế.'
                    ]
                ]
            };
        });
    }

    let DATA = buildFromShared();
    let cur = DATA[0];
    let firstRun = true;
    function state(id) {
        ['loading', 'error', 'empty', 'app'].forEach((x) => {
            const el = $('#' + x);
            if (el) el.hidden = true;
        });
        const el = $('#' + id);
        if (el) el.hidden = false;
    }

    function level(n) {
        return n >= 100
            ? ['Cao', 'Nhu cầu dự kiến nổi bật']
            : n >= 60
              ? ['Trung bình', 'Có tín hiệu quan tâm ổn định']
              : ['Đang tăng', 'Tiếp tục theo dõi'];
    }

    function renderSelect() {
        $('#session').innerHTML = DATA.map(
            (x) => '<option value="' + x.id + '">' + x.title + '</option>'
        ).join('');
        if (cur) $('#session').value = cur.id;
    }

    function render() {
        const [l, h] = level(cur.saves);
        $('#saves').textContent = cur.saves;
        $('#forecast').textContent = cur.forecast;
        $('#level').textContent = l;
        $('#hint').textContent = h;
        $('#confidence').textContent = cur.confidence + '%';
        $('#updated').textContent = new Date().toLocaleString(locale());
        const max = Math.max(1, ...cur.points);
        $('#chart').innerHTML = cur.points
            .map(
                (v, i) =>
                    '<div class="barwrap"><div class="bar" style="height:' +
                    Math.max(7, (v / max) * 82) +
                    '%"><b>' +
                    v +
                    '</b></div><span class="date">' +
                    (cur.days[i] || '—') +
                    '</span></div>'
            )
            .join('');
        $('#reasons').innerHTML = cur.reasons
            .map((r) => '<div class="reason"><b>' + r[0] + '</b><span>' + r[1] + '</span></div>')
            .join('');
        $('#rows').innerHTML = cur.points
            .map(
                (v, i) =>
                    '<tr><td>' +
                    (cur.days[i] || '—') +
                    '</td><td>' +
                    v +
                    '</td><td>' +
                    Math.round(v * 0.72) +
                    '</td><td>' +
                    cur.forecast +
                    '</td></tr>'
            )
            .join('');
    }

    function run() {
        state('loading');
        setTimeout(() => {
            try {
                if (
                    sessionStorage.getItem('eventpulse_testFailAI') === '1' ||
                    (firstRun && new URLSearchParams(location.search).get('state') === 'ai-error')
                ) {
                    firstRun = false;
                    sessionStorage.removeItem('eventpulse_testFailAI');
                    throw Error('Không thể xử lý yêu cầu lúc này.');
                }
                DATA = buildFromShared();
                if (!DATA.length) return state('empty');
                cur = DATA.find((x) => x.id === cur?.id) || DATA[0];
                renderSelect();
                render();
                state('app');
            } catch (e) {
                state('error');
            }
        }, 600);
    }

    $('#session').onchange = (e) => {
        cur = DATA.find((x) => x.id === e.target.value) || DATA[0];
        render();
    };
    $('#refresh').onclick = () => {
        run();
        setTimeout(() => {
            const n = $('#notice');
            if (!n) return;
            n.hidden = false;
            n.textContent = '✓ Đã làm mới dự báo từ sessions/agendas chung.';
            setTimeout(() => (n.hidden = true), 2200);
        }, 650);
    };
    $('#retry').onclick = run;
    $('#explain').onclick = () => {
        cur.reasons = cur.reasons.slice().reverse();
        render();
        const n = $('#notice');
        if (n) {
            n.hidden = false;
            n.textContent = '✓ Đã làm mới phần giải thích.';
            setTimeout(() => (n.hidden = true), 2200);
        }
    };

    function wireNote() {
        if (!cur) return;
        const saved = window.EP.store.get('sessions').find((s) => s.id === cur.id);
        $('#forecastNote').value = saved?.forecastNote || '';
        $('#acceptForecast').disabled = cur.insufficient;
        $('#forecastDecision').textContent = cur.insufficient
            ? 'Không đủ dữ liệu để đưa ra dự báo. Bạn có thể dùng ghi chú thủ công hoặc bỏ qua.'
            : cur.confidence < 70
              ? 'AI chưa chắc chắn về kết quả này. Kiểm tra số liệu trước khi chấp nhận.'
              : saved?.forecastDecision === 'accepted'
                ? 'Bạn đã lưu ghi chú chuẩn bị.'
                : '';
        $('#acceptForecast').onclick = async () => {
            if (
                !(await window.EP.confirm(
                    'Lưu dự báo và ghi chú',
                    'Lưu ghi chú chuẩn bị cho phiên này?'
                ))
            )
                return;
            window.EP.task($('#acceptForecast'), () => {
                const sessions = window.EP.store.get('sessions');
                const next = sessions.map((s) =>
                    s.id === cur.id
                        ? {
                              ...s,
                              forecastNote: $('#forecastNote').value.trim(),
                              forecastDecision: 'accepted',
                              updatedAt: new Date().toISOString()
                          }
                        : s
                );
                window.EP.persist(
                    { sessions: next },
                    window.EP.notification(
                        'Đã lưu ghi chú chuẩn bị',
                        cur.title,
                        'system',
                        'session',
                        cur.id
                    )
                );
                window.EP.toast('Đã lưu ghi chú.');
            });
        };
        $('#dismissForecast').onclick = () => (location.href = 'speaker-my-session.html');
        let manual = $('#manual-note');
        if (!manual) {
            manual = document.createElement('button');
            manual.id = 'manual-note';
            manual.type = 'button';
            manual.className = 'btn btn-secondary';
            manual.textContent = 'Lưu ghi chú thủ công';
            $('#dismissForecast').after(manual);
        }
        manual.onclick = async () => {
            if (!$('#forecastNote').value.trim()) {
                window.EP.toast('Nhập ghi chú trước khi lưu.', 'error');
                return;
            }
            if (!(await window.EP.confirm('Lưu ghi chú', 'Lưu nội dung bạn tự nhập?'))) return;
            window.EP.task(manual, () => {
                window.EP.persist(
                    {
                        sessions: window.EP.store
                            .get('sessions')
                            .map((s) =>
                                s.id === cur.id
                                    ? { ...s, forecastNote: $('#forecastNote').value.trim() }
                                    : s
                            )
                    },
                    window.EP.notification('Đã lưu ghi chú', cur.title)
                );
                window.EP.toast('Đã lưu.');
            });
        };
    }
    const _render = render;
    render = function () {
        _render();
        if (cur.insufficient) {
            $('#forecast').textContent = '—';
            $('#confidence').textContent = '—';
        }
        wireNote();
    };

    run();
})();
