import { translateText } from '../i18n.js';
function ticketValid(ticket, data) {
    const event = data.events.find((e) => e.id === ticket?.eventId);
    return (
        ticket?.status === 'valid' &&
        !!event &&
        event.status !== 'cancelled' &&
        (!ticket.expiresAt || new Date(ticket.expiresAt) > new Date()) &&
        new Date(event.endDate + 'T23:59:59') >= new Date()
    );
}
import * as U from '../ui.js';
import { forecast } from '../domain.js';
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
    money
} = U;
const match = (v, q) =>
    String(v)
        .toLocaleLowerCase('vi')
        .includes((q || '').toLocaleLowerCase('vi'));
function ticketForm(t = {}) {
    return `<section class="panel" id="ticket-form"><h3>${t.id ? 'Chỉnh sửa loại vé' : 'Tạo loại vé'}</h3><form data-form="ticket" data-id="${t.id || ''}" novalidate>${field('name', 'Tên loại vé *', t.name || '')}<div class="form-grid">${field('price', 'Giá vé (VND) *', t.price ?? '', 'number')}${field('quantity', 'Số lượng *', t.quantity || '', 'number')}${field('saleStart', 'Bắt đầu bán *', t.saleStart?.slice(0, 16) || '', 'datetime-local')}${field('saleEnd', 'Kết thúc bán *', t.saleEnd?.slice(0, 16) || '', 'datetime-local')}</div>${field('description', 'Mô tả', t.description || '', 'textarea')}${field('status', 'Trạng thái', t.status || 'draft', 'text', ['draft', 'active', 'inactive', 'soldOut', 'archived'])}<div class="actions">${btn('Hủy', 'cancel-ticket')}<button class="btn primary" type="submit">Lưu loại vé</button></div></form></section>`;
}
function userForm(u = {}) {
    return `<section class="panel" id="user-form"><h3>${u.id ? 'Chỉnh sửa người dùng' : 'Thêm người dùng'}</h3><form data-form="user" data-id="${u.id || ''}" novalidate>${field('fullName', 'Họ và tên *', u.fullName || '')}${field('email', 'Email *', u.email || '', 'email')}${field('phone', 'Số điện thoại', u.phone || '', 'tel')}<div class="form-grid">${field('role', 'Vai trò *', u.role || 'attendee', 'text', ['attendee', 'speaker', 'organizer', 'admin'])}${field('status', 'Trạng thái *', u.status || 'active', 'text', ['active', 'pending', 'locked', 'disabled'])}</div><div class="actions">${btn('Hủy', 'cancel-user')}<button class="btn primary" type="submit">Lưu người dùng</button></div></form></section>`;
}
function ticketDetail(c, t) {
    return `<section class="panel"><h3>Chi tiết loại vé</h3><h2>${esc(t.name)}</h2>${badge(t.status)}<dl class="detail-list"><dt>Giá vé</dt><dd><strong>${money(t.price)}</strong></dd><dt>Số lượng</dt><dd>${t.quantity}</dd><dt>Đã bán</dt><dd>${t.soldCount}</dd><dt>Còn lại</dt><dd>${Math.max(0, t.quantity - t.soldCount)}</dd><dt>Bắt đầu bán</dt><dd>${date(t.saleStart)}</dd><dt>Kết thúc</dt><dd>${date(t.saleEnd)}</dd><dt>Doanh thu</dt><dd>${money(t.soldCount * t.price)}</dd></dl><div class="actions">${btn('Chỉnh sửa', 'edit-ticket', '', `data-id="${t.id}"`)}${btn(t.status === 'active' ? 'Ngừng bán' : 'Mở bán', 'toggle-ticket', 'subtle', `data-id="${t.id}"`)}${btn('Lưu trữ', 'archive-ticket', 'danger', `data-id="${t.id}"`)}</div></section>`;
}
function userDetail(c, u) {
    return `<section class="panel"><h3>Chi tiết người dùng</h3><div class="actions"><span class="avatar">${esc(U.initials(u.fullName))}</span><div><strong>${esc(u.fullName)}</strong><br><small>${esc(u.email)}</small></div></div><dl class="detail-list"><dt>Vai trò</dt><dd>${badge(u.role)}</dd><dt>Điện thoại</dt><dd>${esc(u.phone || 'Chưa cập nhật')}</dd><dt>Tham gia</dt><dd>${date(u.createdAt)}</dd><dt>Trạng thái</dt><dd>${badge(u.status)}</dd></dl><div class="actions">${btn('Chỉnh sửa', 'edit-user', '', `data-id="${u.id}"`)}${btn(u.status === 'locked' ? 'Mở khóa' : 'Khóa tài khoản', 'lock-user', 'danger', `data-id="${u.id}"`)}</div></section>`;
}
export function analyticsData(c) {
    const s = c.state,
        d = c.data;
    const start = s.from ? new Date(s.from + 'T00:00:00').getTime() : -Infinity,
        end = s.to ? new Date(s.to + 'T23:59:59').getTime() : Infinity;
    const within = (v) => {
        const t = new Date(v).getTime();
        return t >= start && t <= end;
    };
    const purchases = d.userTickets.filter((t) => within(t.createdAt));
    const checked = d.userTickets.filter((t) => t.status === 'checkedIn' && within(t.checkedInAt));
    const sessions = d.sessions.filter(
        (x) => (!s.category || x.category === s.category) && (!s.room || x.roomId === s.room)
    );
    return { purchases, checked, sessions, range: !!(s.from || s.to), within };
}
function analytics(c) {
    document.querySelector('main').id = 'analytics';
    const { data: d, state: s } = c,
        a = analyticsData(c);
    const sold = a.range
        ? a.purchases.filter((t) => t.status !== 'cancelled').length
        : d.ticketTypes.reduce((n, t) => n + t.soldCount, 0);
    const eligible = d.userTickets.filter((t) => !['cancelled', 'expired'].includes(t.status));
    const rate = eligible.length ? Math.round((a.checked.length / eligible.length) * 100) : 0;
    const selected =
        d.sessions.find((x) => x.id === s.insightId) ||
        [...a.sessions].sort((x, y) => y.registeredCount - x.registeredCount)[0];
    const f = selected ? forecast(selected, d) : null;
    const days = [...new Set(a.purchases.map((t) => t.createdAt.slice(0, 10)))].sort();
    const vals = days.map(
        (day) =>
            a.purchases.filter((t) => t.createdAt.startsWith(day) && t.status !== 'cancelled')
                .length
    );
    const max = Math.max(1, ...vals);
    const points = vals
        .map((v, i) => `${40 + (i * 400) / Math.max(1, vals.length - 1)},${155 - (v / max) * 110}`)
        .join(' ');
    return (
        c.head(btn(icon('download') + ' Xuất báo cáo', 'export', 'primary')) +
        kpis([
            [
                d.users.filter((u) => u.role === 'attendee' && a.within(u.createdAt)).length,
                'Người tham dự đăng ký',
                'users'
            ],
            [sold, a.range ? 'Vé mẫu trong khoảng' : 'Tổng vé đã bán', 'ticket'],
            [rate + '%', 'Check-in / vé hợp lệ mẫu', 'check'],
            [a.sessions.length, 'Tổng số phiên', 'calendar']
        ]) +
        `<div class="filters analytics-filters"><div class="field" style="margin:0"><label for="filter-from">Từ ngày</label><input id="filter-from" type="date" data-filter="from" value="${esc(s.from || '')}"></div><div class="field" style="margin:0"><label for="filter-to">Đến ngày</label><input id="filter-to" type="date" data-filter="to" value="${esc(s.to || '')}"></div>${filter('category', [...new Set(d.sessions.map((x) => x.category))], s.category, 'Tất cả chủ đề')}${filter(
            'room',
            d.rooms.map((r) => [r.id, r.name]),
            s.room,
            'Tất cả phòng'
        )}${btn('Xóa bộ lọc', 'clear-filters', 'small')}</div>${s.from && s.to && s.from > s.to ? notice('Khoảng ngày không hợp lệ', 'Ngày kết thúc phải bằng hoặc sau ngày bắt đầu.', 'error') : ''}${
            s.state === 'empty'
                ? empty(
                      'Chưa có dữ liệu phân tích',
                      'Số liệu sẽ xuất hiện khi sự kiện có người đăng ký.'
                  )
                : `<div class="split"><div><div class="chart-grid"><section class="panel"><h3>Vé đăng ký theo ngày</h3><p><small>Số liệu từ vé cá nhân mẫu, không phải tổng vé phát hành.</small></p>${days.length ? `<svg class="line-chart" role="img" aria-label="Biểu đồ vé đăng ký theo ngày" viewBox="0 0 480 205"><path d="M40 40h400 M40 95h400 M40 155h400" stroke="var(--border)" fill="none"/><polyline points="${points}" stroke="var(--primary)" stroke-width="3" fill="none"/>${vals.map((v, i) => `<circle cx="${40 + (i * 400) / Math.max(1, vals.length - 1)}" cy="${155 - (v / max) * 110}" r="5" fill="#4F46FF" tabindex="0"><title>${days[i]}: ${v} vé</title></circle>`).join('')}<text x="40" y="190">${days[0].slice(5)}</text><text x="400" y="190">${days.at(-1).slice(5)}</text><text x="8" y="50">${max}</text><text x="8" y="160">0</text></svg>` : empty('Chưa có vé trong khoảng ngày')}</section><section class="panel"><h3>Phân bổ loại vé</h3><p><small>Tổng vé đã bán của toàn sự kiện.</small></p>${ticketDonut(d.ticketTypes)}<div class="legend">${d.ticketTypes.map((t, i) => `<span><i style="background:${['#4F46FF', 'var(--info)', 'var(--success)', 'var(--warning)'][i % 4]}"></i>${esc(t.name)}</span>`).join('')}</div></section></div><section class="panel"><div class="panel-title"><h3>Hiệu suất phiên</h3><small>Dữ liệu hiện tại</small></div>${
                      a.sessions.length
                          ? table(
                                ['Phiên', 'Đăng ký', 'Lưu lịch', 'Sức chứa', 'Tỉ lệ'],
                                a.sessions.map(
                                    (x) =>
                                        `<tr>${cell('Phiên', `<strong>${esc(x.title)}</strong><small>${esc(x.category)}</small>`, 'title-cell')}${cell('Đăng ký', x.registeredCount)}${cell('Lưu lịch', d.agendas.filter((a) => a.sessionId === x.id && a.status === 'saved').length)}${cell('Sức chứa', x.capacity)}${cell('Tỉ lệ', `${Math.round((x.registeredCount / x.capacity) * 100)}%`)}</tr>`
                                )
                            )
                          : empty('Không có phiên phù hợp')
                  }</section><section class="panel"><h3>Chủ đề được quan tâm</h3>${U.barChart([...new Set(a.sessions.map((x) => x.category))].map((cat) => [cat, a.sessions.filter((x) => x.category === cat).reduce((n, x) => n + x.registeredCount, 0), a.sessions.reduce((n, x) => n + x.registeredCount, 0)]))}</section></div><aside><section class="panel ai-panel"><h3>${icon('spark')} AI Interest Forecast</h3><p class="muted" style="font-size:14px">Dự báo mức độ quan tâm và nguy cơ quá tải.</p>${filter(
                      'insightId',
                      a.sessions.map((x) => [x.id, x.title]),
                      selected?.id,
                      'Chọn phiên'
                  )}${s.aiLoading ? U.loading('Đang tổng hợp dự báo…') : s.aiError ? notice('Không thể xử lý yêu cầu', 'Thử lại hoặc xem số liệu thủ công.', 'error') : f?.status === 'success' ? `<hr class="divider"><h3>${esc(selected.title)}</h3>${badge(f.expected > selected.capacity ? 'rejected' : 'pending', f.expected > selected.capacity ? 'Nguy cơ quá tải' : 'Cần theo dõi')}<dl class="detail-list"><dt>Dự kiến</dt><dd><strong>${f.expected} người</strong></dd><dt>Sức chứa</dt><dd>${selected.capacity} người</dd><dt>Tin cậy</dt><dd>${Math.round(f.confidence * 100)}%</dd></dl><p style="font-size:14px">${esc(f.reason)}</p>${f.confidence < 0.7 ? notice('Độ tin cậy thấp', 'AI chưa chắc chắn về kết quả này. Hãy kiểm tra thủ công trước khi quyết định.', 'warning') : ''}` : empty('Chưa đủ dữ liệu dự báo', f?.reason || 'Chọn phiên để xem dự báo.')}<div class="actions">${btn('Thử lại', 'forecast', 'small subtle')}${btn('Ghi nhận', 'accept-insight', 'small')}${btn('Bỏ qua', 'skip-insight', 'small')}${btn('Xem thủ công', 'manual-insight', 'small')}</div>${s.insightMessage ? notice('Quyết định của bạn', s.insightMessage, 'success') : ''}<p><small>AI không tự thay đổi phòng, thời gian hoặc dữ liệu phiên.</small></p></section><section class="panel"><h3>Chất lượng phản hồi</h3><h2>${d.feedback.length ? (d.feedback.reduce((n, f) => n + f.rating, 0) / d.feedback.length).toFixed(1) : '—'} <small>/ 5 sao</small></h2><p class="muted">Từ ${d.feedback.length} phản hồi trong dữ liệu mẫu.</p></section></aside></div>`
        }`
    );
}
function ticketDonut(types) {
    const colors = ['#4F46FF', 'var(--info)', 'var(--success)', 'var(--warning)'];
    const total = types.reduce((n, t) => n + t.soldCount, 0);
    let start = 0;
    const stops = types.map((t, i) => {
        const end = start + (total ? (t.soldCount / total) * 100 : 0);
        const str = `${colors[i % 4]} ${start}% ${end}%`;
        start = end;
        return str;
    });
    return `<div class="donut" style="background:${total ? 'conic-gradient(' + stops.join(',') + ')' : 'var(--border)'}"><strong>${total}</strong></div>`;
}
export function adminRender(c) {
    const d = c.data,
        s = c.state;
    if (c.screen === 'AD1') {
        const list = (s.state === 'empty' ? [] : d.ticketTypes).filter(
            (t) => match(t.name, s.q) && (!s.status || s.status === t.status)
        );
        const selected = d.ticketTypes.find((t) => t.id === s.ticketId) || list[0];
        return (
            c.head(btn(icon('plus') + ' Tạo loại vé', 'new-ticket', 'primary')) +
            kpis([
                [d.ticketTypes.length, 'Loại vé', 'ticket'],
                [d.ticketTypes.reduce((n, t) => n + t.quantity, 0), 'Tổng số vé', 'users'],
                [d.ticketTypes.reduce((n, t) => n + t.soldCount, 0), 'Đã bán', 'check'],
                [
                    d.ticketTypes.reduce((n, t) => n + t.quantity - t.soldCount, 0),
                    'Còn lại',
                    'clock'
                ]
            ]) +
            `<div class="split"><div><div class="filters">${search(s.q, 'Tìm kiếm loại vé…')}${filter('status', ['draft', 'active', 'soldOut', 'inactive', 'archived'], s.status, 'Tất cả trạng thái')}</div><section class="panel" style="padding:8px">${
                list.length
                    ? table(
                          ['Loại vé', 'Giá vé', 'Đã bán / Tổng', 'Trạng thái', ''],
                          list.map(
                              (t) =>
                                  `<tr>${cell('Loại vé', `<strong>${esc(t.name)}</strong>`, 'title-cell')}${cell('Giá', money(t.price))}${cell('Đã bán', `<div style="min-width:95px">${t.soldCount} / ${t.quantity}<div class="progress"><span style="width:${Math.min(100, (t.soldCount / t.quantity) * 100)}%"></span></div></div>`)}${cell('Trạng thái', badge(t.status))}${cell('', `<div class="actions">${btn('Xem', 'view-ticket', 'small', `data-id="${t.id}"`)}${btn('Sửa', 'edit-ticket', 'small', `data-id="${t.id}"`)}</div>`, 'actions-cell')}</tr>`
                          )
                      )
                    : empty(
                          'Chưa có loại vé phù hợp',
                          'Tạo loại vé đầu tiên hoặc xóa bộ lọc.',
                          btn('Tạo loại vé', 'new-ticket', 'primary')
                      )
            }</section>${s.editTicket !== undefined ? ticketForm(d.ticketTypes.find((t) => t.id === s.editTicket) || {}) : ''}</div><aside>${selected ? ticketDetail(c, selected) : ''}<section class="panel"><h3>Đón người tham dự</h3><p class="muted">Tra cứu mã vé và xác nhận check-in tại sự kiện.</p>${link('Quản lý check-in', c.url('AD4'), 'subtle')}</section></aside></div>`
        );
    }
    if (c.screen === 'AD2') {
        const list = (s.state === 'empty' ? [] : d.users).filter(
            (u) =>
                match(u.fullName + ' ' + u.email, s.q) &&
                (!s.role || u.role === s.role) &&
                (!s.status || u.status === s.status)
        );
        const selected = d.users.find((u) => u.id === s.userId) || list[0];
        return (
            c.head(btn(icon('plus') + ' Thêm người dùng', 'new-user', 'primary')) +
            kpis([
                [d.users.length, 'Tổng người dùng', 'users'],
                [d.users.filter((u) => u.status === 'active').length, 'Đang hoạt động', 'check'],
                [d.users.filter((u) => u.role === 'speaker').length, 'Diễn giả', 'users'],
                [d.users.filter((u) => u.role === 'admin').length, 'Quản trị viên', 'shield']
            ]) +
            `<div class="split"><div><div class="filters">${search(s.q, 'Tìm tên hoặc email…')}${filter('role', ['attendee', 'speaker', 'organizer', 'admin'], s.role, 'Tất cả vai trò')}${filter('status', ['active', 'pending', 'locked', 'disabled'], s.status, 'Tất cả trạng thái')}</div><div class="bulk"><span><b id="selected-count">${s.selected.size}</b> đã chọn</span>${btn('Khóa đã chọn', 'bulk-lock', 'small danger')}</div><section class="panel" style="padding:8px">${
                list.length
                    ? table(
                          [
                              '<input type="checkbox" aria-label="Chọn tất cả người dùng" data-action="select-all">',
                              'Người dùng',
                              'Vai trò',
                              'Trạng thái',
                              ''
                          ],
                          list.map(
                              (u) =>
                                  `<tr>${cell('', `<input type="checkbox" data-select="${u.id}" aria-label="Chọn ${esc(u.fullName)}" ${s.selected.has(u.id) ? 'checked' : ''}>`)}${cell('Người dùng', `<div class="actions"><span class="avatar">${esc(U.initials(u.fullName))}</span><div><strong>${esc(u.fullName)}</strong><small>${esc(u.email)}</small></div></div>`, 'title-cell')}${cell('Vai trò', badge(u.role))}${cell('Trạng thái', badge(u.status))}${cell('', `<div class="actions">${btn('Xem', 'view-user', 'small', `data-id="${u.id}"`)}${btn('Sửa', 'edit-user', 'small', `data-id="${u.id}"`)}</div>`, 'actions-cell')}</tr>`
                          )
                      )
                    : empty(
                          'Không tìm thấy người dùng phù hợp',
                          'Thử tìm tên khác hoặc xóa bộ lọc.',
                          btn('Xóa bộ lọc', 'clear-filters')
                      )
            }</section>${s.editUser !== undefined ? userForm(d.users.find((u) => u.id === s.editUser) || {}) : ''}</div><aside>${selected ? userDetail(c, selected) : ''}</aside></div>`
        );
    }
    if (c.screen === 'AD3') return analytics(c);
    if (c.screen === 'AD4') {
        const list = d.userTickets.filter((t) =>
            match(t.ticketCode + ' ' + c.person(t.userId)?.fullName, s.q)
        );
        const result = d.userTickets.find((t) => t.id === s.checkTicket);
        const history = (s.state === 'empty' ? [] : d.userTickets)
            .filter((t) => t.status === 'checkedIn')
            .sort((a, b) => (b.checkedInAt || '').localeCompare(a.checkedInAt || ''));
        return (
            c.head(link('Quản lý loại vé', c.url('AD1'))) +
            kpis([
                [d.userTickets.length, 'Vé cá nhân mẫu', 'ticket'],
                [history.length, 'Đã check-in', 'check'],
                [
                    d.userTickets.filter((t) => t.status === 'valid').length,
                    'Chưa check-in',
                    'clock'
                ],
                [
                    d.userTickets.filter((t) => ['cancelled', 'expired'].includes(t.status)).length,
                    'Không hợp lệ',
                    'alert'
                ]
            ]) +
            `<div class="split wide"><div><section class="panel"><h2>Tra cứu vé</h2><div class="filters">${search(s.q, 'Nhập mã vé hoặc tên người tham dự…')}${btn('Quét mã (mock)', 'scan-ticket', 'subtle')}</div>${s.scanning ? U.loading('Đang đọc mã vé…') : s.q ? (list.length ? list.map((t) => `<div class="alert-card"><div class="info"><h3>${esc(c.person(t.userId)?.fullName)}</h3><p>${esc(t.ticketCode)}</p>${badge(t.status)}</div>${btn('Kiểm tra', 'view-checkin', 'small', `data-id="${t.id}"`)}</div>`).join('') : notice('Vé không hợp lệ', 'Không tìm thấy mã vé hoặc tên người tham dự.', 'error')) : '<p class="muted">Nhập mã vé để kiểm tra. Mã mẫu: <strong>EP26-001-A7K2</strong></p>'}</section><section class="panel"><h3>Lịch sử check-in</h3>${
                history.length
                    ? table(
                          ['Người tham dự', 'Mã vé', 'Thời gian'],
                          history.map(
                              (t) =>
                                  `<tr>${cell('Người tham dự', `<strong>${esc(c.person(t.userId)?.fullName)}</strong>`, 'title-cell')}${cell('Mã vé', esc(t.ticketCode))}${cell('Thời gian', date(t.checkedInAt) + ' · ' + time(t.checkedInAt))}</tr>`
                          )
                      )
                    : empty(
                          'Chưa có lượt check-in nào',
                          'Tra cứu vé và xác nhận người tham dự đầu tiên.'
                      )
            }</section></div><aside><section class="panel"><h3>Thông tin vé</h3>${result ? `<div class="checkin-result"><span class="avatar">${esc(U.initials(c.person(result.userId)?.fullName || '?'))}</span><h3>${esc(c.person(result.userId)?.fullName)}</h3><p>${esc(result.ticketCode)}</p>${badge(result.status)}</div><dl class="detail-list"><dt>Loại vé</dt><dd>${esc(d.ticketTypes.find((t) => t.id === result.ticketTypeId)?.name || '—')}</dd><dt>Sự kiện</dt><dd>${esc(d.events.find((e) => e.id === result.eventId)?.name || 'Sự kiện')}</dd></dl>${ticketValid(result, d) ? btn(icon('check') + ' Xác nhận check-in', 'confirm-checkin', 'primary', `data-id="${result.id}"`) : notice(result.status === 'checkedIn' ? 'Vé đã check-in' : 'Vé không hợp lệ', result.status === 'checkedIn' ? 'Không thể check-in cùng một vé lần thứ hai.' : 'Vé đã hủy hoặc hết hạn.', 'warning')}` : empty('Chưa chọn vé', 'Chọn một kết quả tra cứu để kiểm tra.')}</section></aside></div>`
        );
    }
    return '';
}
export async function adminAction(c, a, t) {
    const id = t.dataset.id,
        d = c.data,
        s = c.state;
    if (a === 'new-ticket' || a === 'edit-ticket') {
        s.editTicket = a === 'new-ticket' ? '' : id;
        c.render();
        document
            .getElementById('ticket-form')
            ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    if (a === 'cancel-ticket') {
        delete s.editTicket;
        c.render();
    }
    if (a === 'view-ticket') {
        s.ticketId = id;
        c.render();
    }
    if (a === 'toggle-ticket' || a === 'archive-ticket') {
        const ticket = d.ticketTypes.find((t) => t.id === id);
        const status =
            a === 'archive-ticket'
                ? 'archived'
                : ticket.status === 'active'
                  ? 'inactive'
                  : 'active';
        if (status === 'active' && ticket.quantity <= ticket.soldCount) {
            U.toast('Vé đã bán hết. Tăng số lượng trước khi mở bán.', true);
            return;
        }
        if (
            await U.confirm(
                status === 'archived' ? 'Lưu trữ loại vé' : 'Đổi trạng thái bán',
                `${ticket.name}: ${U.labels[status]}. Vé đã phát hành vẫn được giữ nguyên.`,
                'Xác nhận'
            )
        ) {
            await c.save(
                { ticketTypes: d.ticketTypes.map((t) => (t.id === id ? { ...t, status } : t)) },
                'Đã cập nhật loại vé.',
                c.notification('Đã cập nhật loại vé', ticket.name)
            );
            c.render();
        }
    }
    if (a === 'new-user' || a === 'edit-user') {
        s.editUser = a === 'new-user' ? '' : id;
        c.render();
        document
            .getElementById('user-form')
            ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    if (a === 'cancel-user') {
        delete s.editUser;
        c.render();
    }
    if (a === 'view-user') {
        s.userId = id;
        c.render();
    }
    if (a === 'lock-user' || a === 'bulk-lock') {
        const ids = a === 'bulk-lock' ? [...s.selected] : [id];
        if (!ids.length) {
            U.toast('Chọn người dùng để khóa.', true);
            return;
        }
        if (ids.includes(c.user.id)) {
            U.toast('Không thể khóa tài khoản đang sử dụng.', true);
            return;
        }
        const unlock = a === 'lock-user' && d.users.find((u) => u.id === id).status === 'locked';
        if (
            !(await U.confirm(
                unlock ? 'Mở khóa tài khoản' : 'Khóa tài khoản',
                `Thay đổi trạng thái ${ids.length} tài khoản đã chọn?`,
                unlock ? 'Mở khóa' : 'Khóa tài khoản'
            ))
        )
            return;
        await c.save(
            {
                users: d.users.map((u) =>
                    ids.includes(u.id)
                        ? {
                              ...u,
                              status: unlock ? 'active' : 'locked',
                              updatedAt: new Date().toISOString()
                          }
                        : u
                )
            },
            'Đã cập nhật tài khoản.',
            c.notification(
                'Tài khoản đã được cập nhật',
                'Trạng thái tài khoản của bạn vừa thay đổi.',
                ids
            )
        );
        s.selected.clear();
        c.render();
    }
    if (a === 'forecast') {
        s.aiLoading = true;
        s.aiError = false;
        c.render();
        await delay(700);
        s.aiLoading = false;
        s.aiError = s.state === 'ai-error';
        s.state = '';
        c.render();
    }
    if (a === 'accept-insight' || a === 'skip-insight' || a === 'manual-insight') {
        s.insightMessage =
            a === 'accept-insight'
                ? 'Đã ghi nhận dự báo. Chưa thay đổi dữ liệu phiên.'
                : a === 'skip-insight'
                  ? 'Đã bỏ qua dự báo. Dữ liệu được giữ nguyên.'
                  : 'Xem bảng hiệu suất phiên để kiểm tra lượt đăng ký và sức chứa.';
        c.render();
        if (a === 'manual-insight')
            document.querySelector('.data-table')?.scrollIntoView({ behavior: 'smooth' });
    }
    if (a === 'export') {
        if (s.from && s.to && s.from > s.to) {
            U.toast('Khoảng ngày không hợp lệ.', true);
            return;
        }
        const data = analyticsData(c);
        const csv = [
            ['Phiên', 'Đăng ký', 'Sức chứa', 'Lưu lịch'].map(translateText),
            ...data.sessions.map((x) => [
                x.title,
                x.registeredCount,
                x.capacity,
                d.agendas.filter((a) => a.sessionId === x.id && a.status === 'saved').length
            ])
        ]
            .map((row) =>
                row
                    .map(
                        (v) =>
                            '"' +
                            String(v)
                                .replace(/^([=+@-])/, '\t$1')
                                .replaceAll('"', '""') +
                            '"'
                    )
                    .join(',')
            )
            .join('\r\n');
        const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'EventPulse-analytics.csv';
        link.click();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
        U.toast('Đã xuất báo cáo mô phỏng CSV.');
    }
    if (a === 'scan-ticket') {
        U.modal(
            'Quét mã vé · mô phỏng',
            `<form data-form="scan-ticket">${field('code', 'Nội dung mã QR / mã vé *', '', 'text')}<p class="muted">Nhập mã mẫu EP26-001-A7K2 để mô phỏng nội dung quét.</p><div class="modal-actions">${btn('Hủy', 'close')}<button class="btn primary" type="submit">Quét mã</button></div></form>`
        );
    }
    if (a === 'view-checkin') {
        s.checkTicket = id;
        c.render();
    }
    if (a === 'confirm-checkin') {
        const ticket = d.userTickets.find((t) => t.id === id);
        if (!ticketValid(ticket, d)) {
            U.toast('Vé không còn hợp lệ để check-in.', true);
            return;
        }
        if (
            !(await U.confirm(
                'Xác nhận check-in',
                `Xác nhận ${c.person(ticket.userId)?.fullName} đã đến sự kiện?`,
                'Check-in'
            ))
        )
            return;
        await c.save(
            {
                userTickets: d.userTickets.map((t) =>
                    t.id === id
                        ? { ...t, status: 'checkedIn', checkedInAt: new Date().toISOString() }
                        : t
                )
            },
            'Check-in thành công.',
            c.notification(
                'Check-in thành công',
                'Chào mừng bạn đến với EventPulse.',
                [ticket.userId],
                'ticket',
                'userTicket',
                id
            )
        );
        c.render();
    }
}
export async function adminSubmit(c, f) {
    const v = Object.fromEntries(new FormData(f)),
        id = f.dataset.id,
        d = c.data;
    let errors = {};
    if (f.dataset.form === 'ticket') {
        const old = d.ticketTypes.find((t) => t.id === id);
        if (!v.name.trim()) errors.name = 'Vui lòng nhập tên loại vé.';
        if (
            d.ticketTypes.some(
                (t) => t.id !== id && t.name.trim().toLowerCase() === v.name.trim().toLowerCase()
            )
        )
            errors.name = 'Tên loại vé đã tồn tại.';
        if (v.price === '' || !Number.isFinite(+v.price) || +v.price < 0)
            errors.price = 'Giá vé phải lớn hơn hoặc bằng 0.';
        if (
            !Number.isInteger(+v.quantity) ||
            +v.quantity <= 0 ||
            +v.quantity < (old?.soldCount || 0)
        )
            errors.quantity = 'Số lượng phải là số nguyên dương và không ít hơn số vé đã bán.';
        if (!v.saleStart) errors.saleStart = 'Chọn thời điểm bắt đầu bán.';
        if (!v.saleEnd || new Date(v.saleEnd) <= new Date(v.saleStart))
            errors.saleEnd = 'Kết thúc bán phải sau thời điểm bắt đầu.';
        if (U.showErrors(f, errors)) return;
        const ticket = {
            ...old,
            ...v,
            id: id || uid('TKT'),
            eventId: 'EVT001',
            name: v.name.trim(),
            price: +v.price,
            quantity: +v.quantity,
            currency: 'VND',
            soldCount: old?.soldCount || 0
        };
        if (ticket.soldCount === ticket.quantity && ticket.status === 'active')
            ticket.status = 'soldOut';
        await c.save(
            {
                ticketTypes: id
                    ? d.ticketTypes.map((t) => (t.id === id ? ticket : t))
                    : [...d.ticketTypes, ticket]
            },
            'Đã lưu loại vé.',
            c.notification('Đã lưu loại vé', ticket.name)
        );
        delete c.state.editTicket;
        c.state.ticketId = ticket.id;
        c.render();
    }
    if (f.dataset.form === 'user') {
        const old = d.users.find((u) => u.id === id);
        if (v.fullName.trim().length < 2) errors.fullName = 'Nhập họ tên ít nhất 2 ký tự.';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email)) errors.email = 'Email không hợp lệ.';
        if (
            d.users.some(
                (u) => u.id !== id && u.email.toLowerCase() === v.email.trim().toLowerCase()
            )
        )
            errors.email = 'Email đã được sử dụng.';
        if (v.phone && !/^\+?[\d\s-]{9,15}$/.test(v.phone))
            errors.phone = 'Số điện thoại không hợp lệ.';
        if (id === c.user.id && (v.role !== 'admin' || v.status !== 'active'))
            errors.role = 'Không thể tự thay đổi quyền hoặc khóa tài khoản đang sử dụng.';
        if (U.showErrors(f, errors)) return;
        if (
            old &&
            (old.role !== v.role || old.status !== v.status) &&
            !(await U.confirm(
                'Xác nhận thay đổi quyền',
                `${old.fullName}: ${U.labels[v.role]} · ${U.labels[v.status]}.`,
                'Xác nhận'
            ))
        )
            return;
        const user = {
            ...old,
            ...v,
            id: id || uid('USR'),
            fullName: v.fullName.trim(),
            email: v.email.trim().toLowerCase(),
            avatar: old?.avatar || '',
            interests: old?.interests || [],
            bio: old?.bio || '',
            expertise: old?.expertise || [],
            createdAt: old?.createdAt || new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        await c.save(
            { users: id ? d.users.map((u) => (u.id === id ? user : u)) : [...d.users, user] },
            'Đã lưu người dùng.',
            c.notification(
                'Thông tin tài khoản cập nhật',
                'Vai trò và thông tin tài khoản của bạn đã được cập nhật.',
                [user.id]
            )
        );
        delete c.state.editUser;
        c.state.userId = user.id;
        c.render();
    }
    if (f.dataset.form === 'scan-ticket') {
        const code = v.code.trim();
        const ticket = d.userTickets.find((t) => t.ticketCode.toLowerCase() === code.toLowerCase());
        if (!ticket) {
            U.showErrors(f, { code: 'Không tìm thấy mã vé này.' });
            return;
        }
        U.close();
        c.state.scanning = true;
        c.render();
        await delay(600);
        c.state.scanning = false;
        c.state.q = code;
        c.state.checkTicket = ticket.id;
        c.render();
    }
}
