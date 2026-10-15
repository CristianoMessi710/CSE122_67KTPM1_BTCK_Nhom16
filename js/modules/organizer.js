import * as U from '../ui.js';
import { conflicts, validateAssignment, suggestRoom, alertRecipients, live } from '../domain.js';
import { uid } from '../storage.js';
import { delay } from '../api.js';
const {
    esc,
    icon,
    btn,
    link,
    badge,
    kpis,
    empty,
    notice,
    search,
    filter,
    field,
    table,
    cell,
    date,
    time,
    options
} = U;
const categories = {
    'web-development': 'Web Development',
    ai: 'AI & Machine Learning',
    'product-design': 'Product & Design',
    'data-analytics': 'Data & Analytics'
};
const byId = (c, id) => c.data.sessions.find((s) => s.id === id);
const speakers = (c, s) =>
    s.speakerIds.map((id) => c.person(id)?.fullName || 'Chưa có diễn giả').join(', ');
const sessionStats = (c) =>
    kpis([
        [c.data.sessions.length, 'Tổng số phiên', 'calendar'],
        [c.data.sessions.filter((s) => s.status === 'published').length, 'Đã xác nhận', 'check'],
        [c.data.sessions.filter((s) => s.status === 'pending').length, 'Chờ duyệt', 'clock'],
        [c.data.sessions.filter((s) => s.status === 'completed').length, 'Đã hoàn thành', 'grid']
    ]);
function sessionList(c) {
    let all = c.state.state === 'empty' ? [] : c.data.sessions;
    const q = (c.state.q || '').toLocaleLowerCase('vi');
    return all
        .filter(
            (s) =>
                (!q || (s.title + ' ' + speakers(c, s)).toLocaleLowerCase('vi').includes(q)) &&
                (!c.state.status || s.status === c.state.status) &&
                (!c.state.room || s.roomId === c.state.room) &&
                (!c.state.day || s.startTime.startsWith(c.state.day))
        )
        .sort((a, b) => a.startTime.localeCompare(b.startTime));
}
function sessionTable(c, list) {
    return table(
        [
            '<input type="checkbox" aria-label="Chọn tất cả phiên" data-action="select-all">',
            'Phiên / Diễn giả',
            'Ngày & giờ',
            'Phòng',
            'Đăng ký',
            'Trạng thái',
            ''
        ],
        list.map(
            (s) =>
                `<tr class="${c.state.detail === s.id ? 'selected' : ''}">${cell('', `<input type="checkbox" data-select="${s.id}" aria-label="Chọn ${esc(s.title)}" ${c.state.selected.has(s.id) ? 'checked' : ''}>`)}${cell('Phiên', `<strong>${esc(s.title)}</strong><small>${esc(speakers(c, s))}</small>`, 'title-cell')}${cell('Thời gian', `${date(s.startTime)}<br><small>${time(s.startTime)} – ${time(s.endTime)}</small>`)}${cell('Phòng', esc(c.room(s.roomId)?.name || 'Chưa gán'))}${cell('Đăng ký', `${s.registeredCount} / ${s.capacity}`)}${cell('Trạng thái', badge(s.status))}${cell('', `<div class="actions">${btn('Xem', 'view-session', 'small', `data-id="${s.id}"`)}${link('Duyệt', c.url('O3', '?id=' + s.id), 'small subtle')}</div>`, 'actions-cell')}</tr>`
        )
    );
}
function detail(c, s) {
    return `<section class="panel"><div class="panel-title"><h3>Chi tiết phiên</h3>${badge(s.status)}</div><h3>${esc(s.title)}</h3><span class="tag">${esc(categories[s.category] || s.category)}</span><dl class="detail-list"><dt>Diễn giả</dt><dd>${esc(speakers(c, s))}</dd><dt>Ngày</dt><dd>${date(s.startTime)}</dd><dt>Thời gian</dt><dd>${time(s.startTime)} – ${time(s.endTime)}</dd><dt>Phòng</dt><dd>${esc(c.room(s.roomId)?.name || 'Chưa gán')}</dd><dt>Sức chứa</dt><dd>${s.capacity} người</dd><dt>Đã đăng ký</dt><dd>${s.registeredCount} người</dd></dl><p class="muted" style="font-size:14px">${esc(s.description)}</p>${s.rejectionReason ? notice('Lý do từ chối', s.rejectionReason, 'error') : ''}<div class="actions">${link('Gán phòng / Duyệt', c.url('O3', '?id=' + s.id), 'primary')}</div></section>`;
}
function assignment(c, s) {
    return `<section class="panel"><h3>Phân công phòng & thời gian</h3><form data-form="assignment" data-id="${s.id}" novalidate>${field(
        'roomId',
        'Phòng *',
        s.roomId,
        'text',
        c.data.rooms
            .filter((r) => !['disabled', 'maintenance'].includes(r.status))
            .map((r) => [r.id, `${r.name} · ${r.capacity} chỗ`])
    )}<div class="form-grid">${field('startTime', 'Bắt đầu *', s.startTime.slice(0, 16), 'datetime-local')}${field('endTime', 'Kết thúc *', s.endTime.slice(0, 16), 'datetime-local')}</div>${field('capacity', 'Sức chứa *', s.capacity, 'number')}<div id="availability"></div><p class="muted"><small>Khả dụng được kiểm tra lại trước khi lưu. Khung giờ phải nằm trong ngày diễn ra sự kiện.</small></p><div class="actions"><button class="btn primary" type="submit" name="intent" value="approve">Lưu & duyệt phiên</button><button class="btn" type="submit" name="intent" value="assign">Lưu phân công</button>${btn('Từ chối', 'reject-session', 'danger', `data-id="${s.id}"`)}</div></form></section>`;
}
function roomForm(c, r = {}) {
    return `<section class="panel" id="room-form"><h3>${r.id ? 'Chỉnh sửa phòng' : 'Thêm phòng mới'}</h3><form data-form="room" data-id="${r.id || ''}" novalidate>${field('name', 'Tên phòng *', r.name || '')}${field('capacity', 'Sức chứa *', r.capacity || '', 'number')}${field('location', 'Vị trí *', r.location || '')}${field('status', 'Trạng thái *', r.status || 'available', 'text', ['available', 'occupied', 'maintenance', 'disabled'])}<div class="field"><label>Thiết bị</label>${[
        ['projector', 'Máy chiếu'],
        ['microphone', 'Microphone'],
        ['speakers', 'Loa'],
        ['wifi', 'Wi-Fi'],
        ['recording', 'Thiết bị ghi hình']
    ]
        .map(
            ([v, l]) =>
                `<label class="check-label"><input name="facilities" type="checkbox" value="${v}" ${r.facilities?.includes(v) ? 'checked' : ''}>${l}</label>`
        )
        .join(
            ''
        )}</div><div class="actions">${btn('Hủy', 'cancel-room')}<button type="submit" class="btn primary">Lưu phòng</button></div></form></section>`;
}
function alertForm(c, a = {}) {
    return `<section class="panel" id="alert-form"><h3>${a.id ? 'Chỉnh sửa cảnh báo' : 'Soạn cảnh báo'}</h3><form data-form="alert" data-id="${a.id || ''}" novalidate>${field('title', 'Tiêu đề *', a.title || '')}<div class="form-grid">${field('severity', 'Mức độ *', a.severity || 'info', 'text', ['info', 'warning', 'urgent'])}${field(
        'target',
        'Đối tượng *',
        a.target || 'all',
        'text',
        [
            ['all', 'Tất cả'],
            ['attendees', 'Người tham dự'],
            ['speakers', 'Diễn giả'],
            ['organizers', 'Ban tổ chức']
        ]
    )}</div>${field('sessionId', 'Nhóm người liên quan đến phiên', a.sessionId || '', 'text', [['', 'Toàn bộ nhóm vai trò'], ...c.data.sessions.map((s) => [s.id, s.title])])}<div class="field"><label for="alert-editor">Nội dung *</label><div class="editor-toolbar">${btn('<b>B</b>', 'format', 'small', 'data-command="bold" aria-label="In đậm"')}${btn('<i>I</i>', 'format', 'small', 'data-command="italic" aria-label="In nghiêng"')}${btn('• Danh sách', 'format', 'small', 'data-command="insertUnorderedList"')}</div><div id="alert-editor" class="editor" contenteditable="true" role="textbox" aria-multiline="true" aria-label="Nội dung cảnh báo">${safeRich(a.message || '')}</div><span class="field-error" data-error="message" aria-live="polite"></span></div>${field(
        'mode',
        'Chế độ gửi',
        a.status === 'scheduled' ? 'scheduled' : 'now',
        'text',
        [
            ['now', 'Gửi ngay'],
            ['scheduled', 'Lên lịch']
        ]
    )}${field('scheduledAt', 'Thời điểm gửi (nếu lên lịch)', a.scheduledAt?.slice(0, 16) || '', 'datetime-local')}<div class="actions"><button class="btn" type="submit" name="intent" value="draft">Lưu nháp</button><button class="btn primary" type="submit" name="intent" value="send">${a.status === 'published' ? 'Cập nhật cảnh báo' : 'Gửi / Lên lịch'}</button></div><p><small>Lên lịch được xử lý khi bản demo đang mở hoặc khi mở lại ứng dụng.</small></p></form></section>`;
}
/** Allow formatting only; never persist active HTML or URL attributes. */
export function safeRich(html) {
    const t = document.createElement('template');
    t.innerHTML = html;
    for (const el of [...t.content.querySelectorAll('*')]) {
        if (!['B', 'STRONG', 'I', 'EM', 'UL', 'OL', 'LI', 'P', 'BR', 'DIV'].includes(el.tagName)) {
            el.replaceWith(document.createTextNode(el.textContent));
            continue;
        }
        for (const a of [...el.attributes]) el.removeAttribute(a.name);
    }
    return t.innerHTML;
}
export function organizerRender(c) {
    const { data: d, state: s } = c;
    if (c.screen === 'O1') {
        const clashes = conflicts(d.sessions);
        const rooms = d.rooms.filter((r) => !['disabled', 'maintenance'].includes(r.status));
        const activeSessions = d.sessions.filter(live);
        const averageCapacity = activeSessions.length
            ? Math.round(
                  (activeSessions.reduce(
                      (a, s) => a + (s.capacity ? s.registeredCount / s.capacity : 0),
                      0
                  ) /
                      activeSessions.length) *
                      100
              )
            : 0;
        return (
            c.head(link(icon('calendar') + ' Quản lý phiên', c.url('O2'), 'primary')) +
            kpis([
                [d.sessions.length, 'Tổng số phiên', 'calendar'],
                [rooms.length, 'Phòng hoạt động', 'room'],
                [clashes.length, 'Xung đột lịch', 'alert'],
                [averageCapacity + '%', 'Tỉ lệ lấp đầy trung bình', 'chart']
            ]) +
            (s.state === 'empty'
                ? empty(
                      'Chưa có dữ liệu sự kiện',
                      'Bắt đầu bằng việc thêm phòng tổ chức.',
                      link('Quản lý phòng', c.url('O4'), 'primary')
                  )
                : `<div class="split"><div><section class="panel"><div class="panel-title"><h2>Tình trạng chương trình</h2>${link('Xem tất cả', c.url('O2'), 'small')}</div>${U.barChart(['published', 'pending', 'rejected', 'completed'].map((st) => [U.labels[st], d.sessions.filter((x) => x.status === st).length, d.sessions.length]))}</section><section class="panel"><div class="panel-title"><h2>Phiên sắp diễn ra</h2>${badge('info', '20–21 tháng 10')}</div><div class="timeline">${d.sessions
                      .filter(live)
                      .sort((a, b) => a.startTime.localeCompare(b.startTime))
                      .slice(0, 4)
                      .map(
                          (x) =>
                              `<div class="timeline-item"><small>${date(x.startTime)} · ${time(x.startTime)}</small><a href="${c.url('O3', '?id=' + x.id)}"><strong>${esc(x.title)}</strong></a><small>${esc(c.room(x.roomId)?.name)} · ${esc(speakers(c, x))}</small></div>`
                      )
                      .join(
                          ''
                      )}</div></section></div><aside><section class="panel"><h3>Cần bạn xử lý</h3>${notice(`${d.sessions.filter((x) => x.status === 'pending').length} phiên chờ duyệt`, 'Kiểm tra nội dung và phân công phòng trước khi duyệt.', 'warning')}${link('Duyệt phiên', c.url('O2', '?status=pending'), 'subtle')}${clashes.length ? notice(`${clashes.length} xung đột lịch`, 'Có các phiên được xếp cùng phòng trong khung giờ giao nhau.', 'error') : notice('Lịch trình hợp lệ', 'Không có xung đột phòng hiện tại.', 'success')}${link('Kiểm tra xung đột', c.url('O5'))}</section><section class="panel ai-panel"><h3>${icon('spark')} Điều phối chương trình</h3><p class="muted">Kiểm tra lịch toàn sự kiện và xem đề xuất đổi phòng trước khi áp dụng.</p>${link('Mở trợ lý xung đột', c.url('O5'), 'primary')}</section></aside></div>`)
        );
    }
    if (c.screen === 'O2') {
        const list = sessionList(c),
            selected = byId(c, s.detail) || list[0];
        return (
            c.head(link(icon('spark') + ' Kiểm tra xung đột', c.url('O5'))) +
            sessionStats(c) +
            `<div class="split"><section><div class="filters">${search(s.q, 'Tìm phiên hoặc diễn giả…')}${filter(
                'day',
                [...new Set(d.sessions.map((x) => x.startTime.slice(0, 10)))].map((x) => [
                    x,
                    date(x)
                ]),
                s.day,
                'Tất cả ngày'
            )}${filter(
                'room',
                d.rooms.map((r) => [r.id, r.name]),
                s.room,
                'Tất cả phòng'
            )}${filter('status', ['pending', 'published', 'rejected', 'completed'], s.status, 'Tất cả trạng thái')}</div><div class="bulk"><span><b id="selected-count">${s.selected.size}</b> đã chọn</span>${btn('Duyệt đã chọn', 'bulk-approve', 'small subtle')}${btn('Từ chối đã chọn', 'bulk-reject', 'small danger')}</div>${list.length ? `<div class="panel" style="padding:8px">${sessionTable(c, list)}</div>` : empty('Không có phiên khớp bộ lọc', 'Thử thay đổi từ khóa hoặc trạng thái.', btn('Xóa bộ lọc', 'clear-filters'))}${conflicts(d.sessions).length ? notice('Xung đột lịch trình', 'Có phiên trùng phòng/giờ. Mở “Kiểm tra xung đột” để xử lý.', 'warning') : ''}</section><aside>${selected ? detail(c, selected) : ''}</aside></div>`
        );
    }
    if (c.screen === 'O3') {
        const session = byId(c, s.id);
        if (!session)
            return (
                c.head() +
                empty(
                    'Không tìm thấy phiên',
                    'Phiên có thể đã bị xóa hoặc đường dẫn không hợp lệ.',
                    link('Danh sách phiên', c.url('O2'), 'primary')
                )
            );
        return (
            c.head(link(icon('back') + ' Danh sách phiên', c.url('O2'))) +
            `<div class="split wide"><div>${detail(c, session)}${conflicts(d.sessions).some((pair) => pair.some((x) => x.id === session.id)) ? notice('Phát hiện trùng phòng', 'Hãy chọn phòng/giờ khác hoặc mở trợ lý xung đột.', 'warning') + link('Xem phương án AI', c.url('O5', '?id=' + session.id), 'subtle') : ''}</div><aside>${assignment(c, session)}</aside></div>`
        );
    }
    if (c.screen === 'O4') {
        const list = (s.state === 'empty' ? [] : d.rooms).filter(
            (r) =>
                (!s.q || r.name.toLowerCase().includes(s.q.toLowerCase())) &&
                (!s.status || r.status === s.status)
        );
        const selected = d.rooms.find((r) => r.id === s.roomId) || list[0];
        return (
            c.head(btn(icon('plus') + ' Thêm phòng', 'new-room', 'primary')) +
            kpis([
                [d.rooms.length, 'Tổng số phòng', 'room'],
                [
                    d.rooms.filter((r) => !['disabled', 'maintenance'].includes(r.status)).length,
                    'Đang hoạt động',
                    'check'
                ],
                [
                    d.rooms.filter((r) => d.sessions.some((x) => live(x) && x.roomId === r.id))
                        .length,
                    'Có lịch sử dụng',
                    'clock'
                ],
                [
                    d.rooms
                        .filter((r) => r.status !== 'disabled')
                        .reduce((a, r) => a + r.capacity, 0),
                    'Tổng sức chứa',
                    'users'
                ]
            ]) +
            `<div class="split"><section><div class="filters">${search(s.q, 'Tìm kiếm phòng…')}${filter('status', ['available', 'occupied', 'maintenance', 'disabled'], s.status, 'Tất cả trạng thái')}</div>${list.map((r) => `<article class="room-card ${selected?.id === r.id ? 'selected' : ''}"><div class="room-icon">${icon('room')}</div><div class="info"><h3>${esc(r.name)}</h3><p>${esc(r.location)} · ${r.capacity} người</p>${badge(r.status)}<div style="margin-top:12px">${r.facilities.map((x) => `<span class="tag">${esc(x)}</span>`).join(' ')}</div></div><div class="actions">${btn('Xem lịch', 'view-room', 'small', `data-id="${r.id}"`)}${btn('Chỉnh sửa', 'edit-room', 'small', `data-id="${r.id}"`)}${r.status !== 'disabled' ? btn('Lưu trữ', 'archive-room', 'small danger', `data-id="${r.id}"`) : ''}</div></article>`).join('') || empty('Chưa có phòng phù hợp', 'Thêm phòng hoặc xóa bộ lọc.', btn('Thêm phòng', 'new-room', 'primary'))}</section><aside>${
                selected
                    ? `<section class="panel"><h3>${esc(selected.name)} · Lịch sử dụng</h3><p class="muted">${esc(selected.location)} · ${selected.capacity} chỗ</p><div class="timeline">${
                          d.sessions
                              .filter((x) => x.roomId === selected.id && live(x))
                              .sort((a, b) => a.startTime.localeCompare(b.startTime))
                              .map(
                                  (x) =>
                                      `<div class="timeline-item"><small>${date(x.startTime)} · ${time(x.startTime)}–${time(x.endTime)}</small><a href="${c.url('O3', '?id=' + x.id)}">${esc(x.title)}</a></div>`
                              )
                              .join('') || '<p class="muted">Phòng chưa có lịch sử dụng.</p>'
                      }</div></section>`
                    : ''
            }${s.editRoom !== undefined ? roomForm(c, d.rooms.find((r) => r.id === s.editRoom) || {}) : `<section class="panel"><h3>Quản lý cơ sở vật chất</h3><p class="muted">Chọn phòng để xem lịch sử dụng hoặc chỉnh sửa thông tin.</p>${btn(icon('plus') + ' Thêm phòng', 'new-room', 'primary')}</section>`}</aside></div>`
        );
    }
    if (c.screen === 'O5') {
        const pairs = conflicts(d.sessions);
        return (
            c.head(btn(icon('spark') + ' Quét toàn bộ lịch', 'scan', 'primary')) +
            `<div class="notice"><div>${icon('spark')}</div><div><strong>AI Conflict Resolver</strong><p>Đề xuất dựa trên lịch phòng và sức chứa hiện tại. Chỉ thay đổi lịch khi bạn xác nhận.</p></div></div>` +
            (s.scanning
                ? U.loading('Đang phân tích lịch trình…')
                : s.aiError
                  ? empty(
                        'Không thể xử lý yêu cầu lúc này',
                        'Thử lại hoặc điều chỉnh phòng và thời gian thủ công.',
                        btn('Thử lại', 'scan', 'primary') + link('Xử lý thủ công', c.url('O2'))
                    )
                  : !pairs.length || s.state === 'empty'
                    ? empty(
                          'Không phát hiện xung đột',
                          'Các phiên đang có phòng và khung giờ không giao nhau.',
                          link('Về tổng quan', c.url('O1'), 'primary')
                      )
                    : pairs
                          .map(([a, b], i) => {
                              const room = s.scanned ? suggestRoom(b, d.sessions, d.rooms) : null;
                              return `<section class="panel" style="margin-bottom:20px"><div class="panel-title"><h3>${icon('alert')} Xung đột ${i + 1} · ${esc(c.room(a.roomId)?.name)}</h3>${badge('rejected', s.ignored?.includes(b.id) ? 'Đã biết · Xử lý sau' : 'Cần xử lý')}</div><div class="conflict-pair">${[a, b].map((x) => `<div><h3>${esc(x.title)}</h3><p class="muted">${esc(speakers(c, x))}</p><div class="status-line">${icon('clock')}${date(x.startTime)} · ${time(x.startTime)}–${time(x.endTime)}</div></div>`).join('')}</div>${s.scanned ? `<div class="notice"><div>${icon('spark')}</div><div><strong>${room ? 'Đề xuất chuyển “' + esc(b.title) + '” sang ' + esc(room.name) : 'Chưa có phòng thay thế phù hợp'}</strong><p>${room ? `Phòng có ${room.capacity} chỗ, đủ sức chứa và không có phiên khác trong khung giờ này. Giữ nguyên thời gian và diễn giả.` : 'Không có phòng trống đáp ứng sức chứa. Bạn có thể đổi giờ thủ công.'}</p></div></div><div class="actions">${room ? btn('Áp dụng đề xuất', 'apply-conflict', 'primary', `data-id="${b.id}" data-room="${room.id}"`) : ''}${link('Chỉnh tay phòng / giờ', c.url('O3', '?id=' + b.id))}${btn('Đã biết, xử lý sau', 'ignore-conflict', '', `data-id="${b.id}"`)}${btn('Tạo lại', 'scan', 'subtle')}</div>` : `<div class="actions" style="margin-top:18px">${btn('Phân tích phương án', 'scan', 'primary')}${link('Chỉnh thủ công', c.url('O3', '?id=' + b.id))}</div>`}</section>`;
                          })
                          .join(''))
        );
    }
    if (c.screen === 'O6') {
        const list = (s.state === 'empty' ? [] : d.eventAlerts).filter(
            (a) =>
                (!s.q || a.title.toLowerCase().includes(s.q.toLowerCase())) &&
                (!s.status || s.status === a.status)
        );
        const selected = d.eventAlerts.find((a) => a.id === s.alertId) || list[0];
        return (
            c.head(btn(icon('plus') + ' Tạo cảnh báo', 'new-alert', 'primary')) +
            kpis([
                [d.eventAlerts.length, 'Tổng cảnh báo', 'bell'],
                [d.eventAlerts.filter((a) => a.status === 'published').length, 'Đã gửi', 'mail'],
                [
                    d.eventAlerts.filter((a) => a.status === 'scheduled').length,
                    'Đã lên lịch',
                    'clock'
                ],
                [d.eventAlerts.filter((a) => a.status === 'draft').length, 'Bản nháp', 'grid']
            ]) +
            `<div class="split wide"><section><div class="filters">${search(s.q, 'Tìm cảnh báo…')}${filter('status', ['published', 'scheduled', 'draft', 'archived'], s.status, 'Tất cả trạng thái')}</div>${list.map((a) => `<article class="alert-card ${selected?.id === a.id ? 'selected' : ''}"><div class="room-icon">${icon('bell')}</div><div class="info"><h3>${esc(a.title)}</h3><p>${esc(a.message.replace(/<[^>]*>/g, '')).slice(0, 160)}</p><div class="actions">${badge(a.status)}${badge(a.severity)}<small>${date(a.scheduledAt || a.createdAt)} · ${time(a.scheduledAt || a.createdAt)}</small></div></div><div class="actions">${btn('Xem', 'view-alert', 'small', `data-id="${a.id}"`)}${btn('Sửa', 'edit-alert', 'small', `data-id="${a.id}"`)}${a.status !== 'archived' ? btn(a.status === 'published' ? 'Thu hồi' : 'Xóa', 'archive-alert', 'small danger', `data-id="${a.id}"`) : ''}</div></article>`).join('') || empty('Chưa có cảnh báo nào', 'Soạn cảnh báo để cập nhật cho người tham dự.', btn('Soạn cảnh báo', 'new-alert', 'primary'))}</section><aside>${selected && s.editAlert === undefined ? `<section class="panel"><h3>Chi tiết cảnh báo</h3><h3>${esc(selected.title)}</h3>${badge(selected.status)}<div style="font-size:14px;margin-top:16px">${safeRich(selected.message)}</div><dl class="detail-list"><dt>Đối tượng</dt><dd>${esc(selected.target)}</dd><dt>Đã gửi đến</dt><dd>${selected.recipientIds?.length || 0} người</dd><dt>Thời gian</dt><dd>${date(selected.sentAt || selected.scheduledAt || selected.createdAt)}</dd></dl>${btn('Chỉnh sửa', 'edit-alert', '', `data-id="${selected.id}"`)}</section>` : ''}${s.editAlert !== undefined ? alertForm(c, d.eventAlerts.find((a) => a.id === s.editAlert) || {}) : `<section class="panel"><h3>Thông báo kịp thời</h3><p class="muted">Chọn vai trò hoặc nhóm người liên quan đến một phiên.</p>${btn('Soạn cảnh báo', 'new-alert', 'primary')}</section>`}</aside></div>`
        );
    }
    return '';
}
async function rejectDialog(c, ids) {
    U.modal(
        ids.length > 1 ? 'Từ chối các phiên đã chọn' : 'Từ chối phiên',
        `<form data-form="reject" data-ids="${ids.join(',')}" novalidate>${field('reason', 'Lý do từ chối *', '', 'textarea')}<div class="modal-actions">${btn('Hủy', 'close')}<button class="btn danger" type="submit">Xác nhận từ chối</button></div></form>`
    );
}
export async function organizerAction(c, a, t) {
    const id = t.dataset.id,
        s = c.state,
        d = c.data;
    if (a === 'view-session') {
        s.detail = id;
        c.render();
    }
    if (a === 'reject-session') {
        if (byId(c, id)?.status !== 'pending') {
            U.toast('Chỉ có thể từ chối phiên đang chờ duyệt.', true);
            return;
        }
        await rejectDialog(c, [id]);
    }
    if (a === 'bulk-reject' || a === 'bulk-approve') {
        const ids = [...s.selected];
        if (!ids.length) {
            U.toast('Hãy chọn ít nhất một phiên.', true);
            return;
        }
        if (ids.some((id) => byId(c, id)?.status !== 'pending')) {
            U.toast('Chỉ xử lý hàng loạt các phiên đang chờ duyệt.', true);
            return;
        }
        if (a === 'bulk-reject') {
            await rejectDialog(c, ids);
            return;
        }
        for (const id of ids) {
            const errors = validateAssignment(byId(c, id), d.sessions, d.rooms);
            if (Object.keys(errors).length) {
                U.toast(
                    'Chưa thể duyệt: ' + byId(c, id).title + '. ' + Object.values(errors)[0],
                    true
                );
                return;
            }
        }
        if (
            !(await U.confirm(
                'Duyệt phiên đã chọn',
                `Xác nhận duyệt ${ids.length} phiên có phòng và lịch hợp lệ?`,
                'Duyệt phiên'
            ))
        )
            return;
        const updated = d.sessions.map((x) =>
            ids.includes(x.id)
                ? {
                      ...x,
                      status: 'published',
                      reviewStatus: 'approved',
                      history: [
                          ...(x.history || []),
                          {
                              status: 'approved',
                              at: new Date().toISOString(),
                              note: 'Ban tổ chức đã duyệt.'
                          }
                      ],
                      rejectionReason: '',
                      updatedAt: new Date().toISOString()
                  }
                : x
        );
        const notifications = ids.flatMap((id) =>
            c.notification(
                'Phiên đã được duyệt',
                byId(c, id).title,
                byId(c, id).speakerIds,
                'schedule-change',
                'session',
                id
            )
        );
        await c.save({ sessions: updated }, 'Đã duyệt các phiên.', notifications);
        s.selected.clear();
        c.render();
    }
    if (a === 'new-room' || a === 'edit-room') {
        s.editRoom = a === 'new-room' ? '' : id;
        s.roomId = id;
        c.render();
        document
            .getElementById('room-form')
            ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    if (a === 'view-room') {
        s.roomId = id;
        c.render();
    }
    if (a === 'cancel-room') {
        delete s.editRoom;
        c.render();
    }
    if (a === 'archive-room') {
        if (d.sessions.some((x) => live(x) && x.roomId === id)) {
            U.toast(
                'Phòng còn phiên đang sử dụng. Chuyển các phiên sang phòng khác trước khi lưu trữ.',
                true
            );
            return;
        }
        if (
            await U.confirm(
                'Lưu trữ phòng',
                'Phòng sẽ không còn được chọn khi phân công phiên. Dữ liệu lịch sử được giữ lại.',
                'Lưu trữ'
            )
        ) {
            await c.save(
                { rooms: d.rooms.map((r) => (r.id === id ? { ...r, status: 'disabled' } : r)) },
                'Đã lưu trữ phòng.',
                c.notification('Đã lưu trữ phòng', c.room(id).name)
            );
            c.render();
        }
    }
    if (a === 'scan') {
        s.scanning = true;
        s.aiError = false;
        c.render();
        await delay(800);
        s.scanning = false;
        s.scanned = true;
        s.aiError = s.state === 'ai-error';
        if (s.aiError) s.state = '';
        c.render();
    }
    if (a === 'apply-conflict') {
        const session = byId(c, id);
        const changed = { ...session, roomId: t.dataset.room, updatedAt: new Date().toISOString() };
        const errors = validateAssignment(changed, d.sessions, d.rooms);
        if (Object.keys(errors).length) {
            U.toast(Object.values(errors)[0], true);
            return;
        }
        if (
            !(await U.confirm(
                'Áp dụng phương án',
                `Chuyển “${session.title}” sang ${c.room(t.dataset.room).name}, giữ nguyên thời gian?`,
                'Áp dụng'
            ))
        )
            return;
        const ids = [
            ...new Set([
                ...session.speakerIds,
                ...d.agendas
                    .filter((x) => x.sessionId === id && x.status === 'saved')
                    .map((x) => x.userId)
            ])
        ];
        await c.save(
            { sessions: d.sessions.map((x) => (x.id === id ? changed : x)) },
            'Đã áp dụng phương án xử lý.',
            c.notification(
                'Thay đổi phòng',
                session.title + ' chuyển sang ' + c.room(t.dataset.room).name,
                ids,
                'schedule-change',
                'session',
                id
            )
        );
        sessionStorage.removeItem('eventpulse_pendingAssignment');
        c.render();
    }
    if (a === 'ignore-conflict') {
        sessionStorage.removeItem('eventpulse_pendingAssignment');
        s.ignored = [...(s.ignored || []), id];
        U.toast('Đã ghi nhận. Lịch chưa thay đổi.');
        c.render();
    }
    if (a === 'new-alert' || a === 'edit-alert') {
        s.editAlert = a === 'new-alert' ? '' : id;
        c.render();
        document
            .getElementById('alert-form')
            ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    if (a === 'view-alert') {
        s.alertId = id;
        delete s.editAlert;
        c.render();
    }
    if (a === 'format') {
        document.getElementById('alert-editor')?.focus();
        document.execCommand(t.dataset.command, false);
    }
    if (a === 'archive-alert') {
        const alert = d.eventAlerts.find((x) => x.id === id);
        if (
            await U.confirm(
                alert.status === 'published' ? 'Thu hồi cảnh báo' : 'Xóa cảnh báo',
                'Cảnh báo sẽ được lưu trữ và gỡ khỏi danh sách thông báo của người nhận.',
                'Xác nhận'
            )
        ) {
            const filtered = d.notifications.filter(
                (n) => !(n.relatedEntityType === 'eventAlert' && n.relatedEntityId === id)
            );
            await c.save(
                {
                    eventAlerts: d.eventAlerts.map((x) =>
                        x.id === id ? { ...x, status: 'archived' } : x
                    ),
                    notifications: filtered
                },
                'Đã thu hồi / lưu trữ cảnh báo.'
            );
            c.render();
        }
    }
}
export async function organizerSubmit(c, f) {
    const v = Object.fromEntries(new FormData(f)),
        d = c.data,
        id = f.dataset.id;
    let errors = {};
    if (f.dataset.form === 'assignment') {
        const original = byId(c, id);
        if (!original) throw Error('Phiên không tồn tại');
        const s = { ...original, ...v, capacity: +v.capacity };
        errors = validateAssignment(s, d.sessions, d.rooms);
        const event = d.events.find((e) => e.id === s.eventId);
        if (
            event &&
            (s.startTime.slice(0, 10) < event.startDate || s.endTime.slice(0, 10) > event.endDate)
        )
            errors.startTime = 'Thời gian phải nằm trong ngày tổ chức sự kiện.';
        if (['completed', 'cancelled', 'archived'].includes(original.status))
            errors.startTime = 'Không thể thay đổi phiên đã hoàn thành, hủy hoặc lưu trữ.';
        if (U.showErrors(f, errors)) {
            if (errors.roomId && s.roomId)
                sessionStorage.setItem('eventpulse_pendingAssignment', JSON.stringify(s));
            document.getElementById('availability').innerHTML = errors.roomId
                ? notice('Phòng chưa khả dụng', errors.roomId, 'error') +
                  link('Mở trợ lý xung đột', c.url('O5', '?id=' + id), 'subtle')
                : '';
            return;
        }
        const intent = f.dataset.intent || 'approve';
        s.status = intent === 'assign' ? original.status : 'published';
        s.rejectionReason = s.status === 'published' ? '' : s.rejectionReason;
        s.reviewStatus =
            s.status === 'published'
                ? 'approved'
                : s.status === 'rejected'
                  ? 'rejected'
                  : 'pending';
        s.history = [
            ...(s.history || []),
            {
                status: s.reviewStatus,
                at: new Date().toISOString(),
                note: 'Ban tổ chức cập nhật lịch và trạng thái.'
            }
        ];
        s.updatedAt = new Date().toISOString();
        const people = [
            ...new Set([
                ...s.speakerIds,
                ...d.agendas
                    .filter((a) => a.sessionId === id && a.status === 'saved')
                    .map((a) => a.userId)
            ])
        ];
        await c.save(
            { sessions: d.sessions.map((x) => (x.id === id ? s : x)) },
            'Đã lưu phân công phiên.',
            c.notification(
                'Lịch phiên đã cập nhật',
                s.title,
                people,
                'schedule-change',
                'session',
                id
            )
        );
        c.render();
    }
    if (f.dataset.form === 'reject') {
        const ids = f.dataset.ids.split(',');
        if (v.reason.trim().length < 5) errors.reason = 'Nhập lý do từ chối ít nhất 5 ký tự.';
        if (U.showErrors(f, errors)) return;
        const notifications = ids.flatMap((id) =>
            c.notification(
                'Phiên bị từ chối',
                byId(c, id).title + ': ' + v.reason,
                byId(c, id).speakerIds,
                'system',
                'session',
                id
            )
        );
        await c.save(
            {
                sessions: d.sessions.map((x) =>
                    ids.includes(x.id)
                        ? {
                              ...x,
                              status: 'rejected',
                              reviewStatus: 'rejected',
                              reviewNote: v.reason.trim(),
                              history: [
                                  ...(x.history || []),
                                  {
                                      status: 'rejected',
                                      at: new Date().toISOString(),
                                      note: v.reason.trim()
                                  }
                              ],
                              rejectionReason: v.reason.trim(),
                              updatedAt: new Date().toISOString()
                          }
                        : x
                )
            },
            'Đã từ chối phiên.',
            notifications
        );
        c.state.selected.clear();
        U.close();
        c.render();
    }
    if (f.dataset.form === 'room') {
        if (!v.name.trim()) errors.name = 'Vui lòng nhập tên phòng.';
        if (
            d.rooms.some(
                (r) => r.id !== id && r.name.trim().toLowerCase() === v.name.trim().toLowerCase()
            )
        )
            errors.name = 'Tên phòng đã tồn tại.';
        if (!Number.isInteger(+v.capacity) || +v.capacity <= 0)
            errors.capacity = 'Sức chứa phải là số nguyên lớn hơn 0.';
        if (!v.location.trim()) errors.location = 'Vui lòng nhập vị trí.';
        const assigned = d.sessions.filter((s) => s.roomId === id && live(s));
        if (assigned.some((s) => s.capacity > +v.capacity || s.registeredCount > +v.capacity))
            errors.capacity = 'Không thể giảm sức chứa dưới sức chứa của phiên đã phân công.';
        if (['disabled', 'maintenance'].includes(v.status) && assigned.length)
            errors.status = 'Chuyển các phiên sang phòng khác trước khi ngừng sử dụng phòng.';
        if (U.showErrors(f, errors)) return;
        const r = {
            ...(d.rooms.find((r) => r.id === id) || {}),
            ...v,
            id: id || uid('ROM'),
            eventId: 'EVT001',
            name: v.name.trim(),
            capacity: +v.capacity,
            facilities: new FormData(f).getAll('facilities')
        };
        await c.save(
            { rooms: id ? d.rooms.map((x) => (x.id === id ? r : x)) : [...d.rooms, r] },
            'Đã lưu phòng.',
            c.notification('Đã lưu phòng', r.name)
        );
        delete c.state.editRoom;
        c.state.roomId = r.id;
        c.render();
    }
    if (f.dataset.form === 'alert') {
        const intent = f.dataset.intent || 'send';
        const editor = f.querySelector('#alert-editor');
        const message = safeRich(editor.innerHTML);
        if (!v.title.trim()) errors.title = 'Vui lòng nhập tiêu đề.';
        if (!editor.textContent.trim()) errors.message = 'Vui lòng nhập nội dung.';
        if (
            intent === 'send' &&
            v.mode === 'scheduled' &&
            (!v.scheduledAt || new Date(v.scheduledAt) <= new Date())
        )
            errors.scheduledAt = 'Thời điểm gửi phải trong tương lai.';
        if (U.showErrors(f, errors)) return;
        const old = d.eventAlerts.find((x) => x.id === id);
        const alert = {
            ...old,
            id: id || uid('ALT'),
            eventId: 'EVT001',
            createdBy: c.user.id,
            title: v.title.trim(),
            message,
            severity: v.severity,
            target: v.target,
            sessionId: v.sessionId || null,
            status:
                intent === 'draft' ? 'draft' : v.mode === 'scheduled' ? 'scheduled' : 'published',
            scheduledAt: v.mode === 'scheduled' ? v.scheduledAt : null,
            sentAt: null,
            createdAt: old?.createdAt || new Date().toISOString(),
            recipientIds: []
        };
        const recipients = alertRecipients(alert, d);
        if (alert.status === 'published' && !recipients.length) {
            U.toast('Không có người nhận phù hợp. Hãy thay đổi nhóm nhận.', true);
            return;
        }
        if (alert.status === 'published') {
            alert.sentAt = new Date().toISOString();
            alert.recipientIds = recipients;
        }
        const notifications = d.notifications.filter(
            (n) => !(n.relatedEntityType === 'eventAlert' && n.relatedEntityId === alert.id)
        );
        await c.save(
            {
                eventAlerts: id
                    ? d.eventAlerts.map((x) => (x.id === id ? alert : x))
                    : [alert, ...d.eventAlerts],
                notifications
            },
            alert.status === 'draft'
                ? 'Đã lưu bản nháp.'
                : alert.status === 'scheduled'
                  ? 'Đã lên lịch cảnh báo.'
                  : 'Đã gửi cảnh báo.',
            alert.status === 'published'
                ? c.notification(
                      alert.title,
                      editor.textContent,
                      recipients,
                      'schedule-change',
                      'eventAlert',
                      alert.id
                  )
                : []
        );
        delete c.state.editAlert;
        c.state.alertId = alert.id;
        c.render();
    }
}
