(() => {
    const USER_ID = window.EP.currentUser().id;
    const EP = window.EventPulse || {};

    const $ = (s) => document.querySelector(s);
    let sessions = null;
    let editId = null;

    const statusLabel = { pending: 'Chờ duyệt', approved: 'Đã duyệt', rejected: 'Từ chối' };

    function escapeHTML(v) {
        return String(v ?? '').replace(
            /[&<>"']/g,
            (c) =>
                ({
                    '&': '&amp;',
                    '<': '&lt;',
                    '>': '&gt;',
                    '"': '&quot;',
                    "'": '&#039;'
                })[c]
        );
    }

    /** Only this speaker's sessions — full store is seeded via shared.js */
    function getData() {
        if (typeof EP.ensureSeed === 'function') EP.ensureSeed();
        if (typeof EP.getSessionsForSpeaker === 'function') {
            return EP.getSessionsForSpeaker(USER_ID).map((x) => ({ ...x }));
        }
        const raw = localStorage.getItem('eventpulse_sessions');
        const all = raw ? JSON.parse(raw) : [];
        return all.filter((s) => s.speakerIds?.includes(USER_ID));
    }

    /**
     * CRITICAL FIX: merge only USR102 sessions back into full list.
     * Never overwrite other speakers' sessions.
     */
    function save() {
        if (typeof EP.mergeSpeakerSessions === 'function') {
            EP.mergeSpeakerSessions(USER_ID, sessions);
            return;
        }
        const KEY = 'eventpulse_sessions';
        let all = [];
        try {
            all = JSON.parse(localStorage.getItem(KEY) || '[]');
        } catch {}
        const others = all.filter(
            (s) => !(Array.isArray(s.speakerIds) && s.speakerIds.includes(USER_ID))
        );
        localStorage.setItem(KEY, JSON.stringify([...others, ...sessions]));
    }

    function formatDate(v) {
        return new Date(v).toLocaleString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    function showToast(text) {
        window.EP.toast(text);
    }

    function pushNotification(title, message) {
        window.EP.persist({}, window.EP.notification(title, message, 'system', 'session'));
    }

    function updateCounts() {
        $('#countAll').textContent = sessions.length;
        $('#countPending').textContent = sessions.filter(
            (s) => s.reviewStatus === 'pending'
        ).length;
        $('#countApproved').textContent = sessions.filter(
            (s) => s.reviewStatus === 'approved'
        ).length;
        $('#countRejected').textContent = sessions.filter(
            (s) => s.reviewStatus === 'rejected'
        ).length;
    }

    function render() {
        updateCounts();
        const q = $('#searchInput').value.trim().toLowerCase();
        const f = $('#statusFilter').value;

        const list = sessions.filter((s) => {
            const text = `${s.title} ${s.category} ${s.description}`.toLowerCase();
            return (f === 'all' || s.reviewStatus === f) && (!q || text.includes(q));
        });

        $('#empty').hidden = list.length !== 0;
        $('#sessionList').innerHTML = list
            .map(
                (s) => `
      <article class="session-card">
        <div class="session-card-head">
          <span class="badge ${s.reviewStatus}">${statusLabel[s.reviewStatus]}</span>
          <span class="meta">${escapeHTML(s.category)}</span>
        </div>
        <div class="session-card-body">
          <h3>${escapeHTML(s.title)}</h3>
          <div class="meta">
            <span>${window.EP.icon('clock')} ${formatDate(s.startTime)} - ${new Date(s.endTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</span>
            <span>${window.EP.icon('pin')} ${escapeHTML(window.EP.store.get('rooms').find((r) => r.id === s.roomId)?.name || 'Chưa xếp phòng')}</span>
          </div>
          <p class="desc">${escapeHTML(s.description)}</p>
          <div class="note">${escapeHTML(s.reviewNote || 'Chưa có ghi chú.')}</div>
          <div class="actions">
            <button class="btn ghost mini" data-detail="${s.id}">Xem chi tiết</button>
            ${s.reviewStatus === 'rejected' ? `<button class="btn ghost mini" data-edit="${s.id}">Sửa nhanh</button>` : ''}
            <a class="btn ghost mini" href="./speaker-session-detail.html?id=${s.id}">Chỉnh sửa</a>
            <a class="btn ghost mini" href="./speaker-session-materials.html?id=${s.id}">Tài liệu</a>
          </div>
        </div>
      </article>
    `
            )
            .join('');

        document
            .querySelectorAll('[data-detail]')
            .forEach((b) => (b.onclick = () => showDetail(b.dataset.detail)));
        document
            .querySelectorAll('[data-edit]')
            .forEach((b) => (b.onclick = () => openEdit(b.dataset.edit)));
    }

    function run() {
        $('#loading').hidden = false;
        $('#error').hidden = true;
        $('#empty').hidden = true;
        $('#sessionList').innerHTML = '';
        setTimeout(() => {
            try {
                sessions = getData();
                $('#loading').hidden = true;
                render();
            } catch (e) {
                $('#loading').hidden = true;
                $('#error').hidden = false;
                $('#errorText').textContent = e.message;
            }
        }, 450);
    }

    function showDetail(id) {
        const s = sessions.find((x) => x.id === id);
        if (!s) return;

        $('#modalContent').innerHTML = `
      <span class="badge ${s.reviewStatus}">${statusLabel[s.reviewStatus]}</span>
      <h2>${escapeHTML(s.title)}</h2>
      <div class="detail-row"><b class="detail-label">Chủ đề</b><span>${escapeHTML(s.category)}</span></div>
      <div class="detail-row"><b class="detail-label">Thời gian</b><span>${formatDate(s.startTime)} → ${formatDate(s.endTime)}</span></div>
      <div class="detail-row"><b class="detail-label">Phòng</b><span>${escapeHTML(window.EP.store.get('rooms').find((r) => r.id === s.roomId)?.name || 'Chưa xếp phòng')}</span></div>
      <div class="detail-row"><b class="detail-label">Mô tả</b><span>${escapeHTML(s.description)}</span></div>
      <div class="history">
        <b>Lịch sử trạng thái</b>
        <p>Đề xuất: ${formatDate(s.createdAt)}</p>
        <p>Hiện tại: ${statusLabel[s.reviewStatus]}</p>
        <p>${escapeHTML(s.reviewNote || '')}</p>
      </div>
    `;
        $('#modal').hidden = false;
    }

    function resetForm() {
        ['title', 'category', 'startTime', 'endTime', 'room', 'description'].forEach(
            (id) => ($('#' + id).value = '')
        );
        $('#descriptionCount').textContent = '0';
        document.querySelectorAll('.field-error').forEach((e) => (e.textContent = ''));
    }

    function openCreate() {
        editId = null;
        resetForm();
        $('#formHeading').textContent = 'Đề xuất session mới';
        $('#formModal').hidden = false;
    }

    function openEdit(id) {
        const s = sessions.find((x) => x.id === id);
        if (!s || s.reviewStatus !== 'rejected') return;
        editId = id;
        $('#title').value = s.title;
        $('#category').value = s.category;
        $('#startTime').value = s.startTime.slice(0, 16);
        $('#endTime').value = s.endTime.slice(0, 16);
        $('#room').value = s.roomId || '';
        $('#description').value = s.description;
        $('#descriptionCount').textContent = s.description.length;
        $('#formHeading').textContent = 'Sửa đề xuất session';
        $('#formModal').hidden = false;
    }

    function error(id, msg) {
        $('#' + id).textContent = msg;
    }

    function validate() {
        document.querySelectorAll('.field-error').forEach((e) => (e.textContent = ''));
        let ok = true;
        const title = $('#title').value.trim();
        const cat = $('#category').value.trim();
        const start = $('#startTime').value;
        const end = $('#endTime').value;
        const desc = $('#description').value.trim();

        if (!title) {
            error('titleError', 'Vui lòng nhập tên session.');
            ok = false;
        }
        if (!cat) {
            error('categoryError', 'Vui lòng nhập chủ đề.');
            ok = false;
        }
        if (!start) {
            error('startError', 'Vui lòng chọn thời gian bắt đầu.');
            ok = false;
        }
        if (!end) {
            error('endError', 'Vui lòng chọn thời gian kết thúc.');
            ok = false;
        }
        if (start && end && new Date(end) <= new Date(start)) {
            error('endError', 'Thời gian kết thúc phải sau bắt đầu.');
            ok = false;
        }
        if (desc.length < 20) {
            error('descriptionError', 'Mô tả cần ít nhất 20 ký tự.');
            ok = false;
        }
        return ok;
    }

    $('#sessionForm').onsubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        const backup = structuredClone(sessions);
        const submit = e.submitter;
        submit.disabled = true;
        submit.textContent = 'Đang gửi…';
        try {
            await window.EP.delay(300);
            const payload = {
                title: $('#title').value.trim(),
                category: $('#category').value.trim(),
                startTime: $('#startTime').value + ':00',
                endTime: $('#endTime').value + ':00',
                roomId: '',
                description: $('#description').value.trim(),
                updatedAt: new Date().toISOString()
            };

            if (editId) {
                const i = sessions.findIndex((s) => s.id === editId);
                sessions[i] = {
                    ...sessions[i],
                    ...payload,
                    status: 'pending',
                    reviewStatus: 'pending',
                    reviewNote: 'Đã cập nhật. Đang chờ ban tổ chức duyệt.'
                };
            } else {
                sessions.unshift({
                    id: 'SES' + Date.now(),
                    eventId: 'EVT001',
                    ...payload,
                    speakerIds: [USER_ID],
                    capacity: 100,
                    registeredCount: 0,
                    objectives: '',
                    tags: [],
                    history: [
                        {
                            status: 'pending',
                            at: new Date().toISOString(),
                            note: 'Đề xuất phiên mới.'
                        }
                    ],
                    status: 'pending',
                    reviewStatus: 'pending',
                    reviewNote: 'Đang chờ ban tổ chức xem xét.',
                    createdAt: new Date().toISOString()
                });
            }

            save();
            showToast('Đã gửi đề xuất — chờ ban tổ chức duyệt.');
            $('#formModal').hidden = true;
            render();
        } catch (error) {
            sessions = backup;
            window.EP.inlineError(error);
            window.EP.toast(error.message, 'error');
        } finally {
            submit.disabled = false;
            submit.textContent = 'Gửi đề xuất';
        }
    };

    $('#description').oninput = (e) => ($('#descriptionCount').textContent = e.target.value.length);
    $('#btnCreate').onclick = openCreate;
    $('#btnEmptyCreate').onclick = openCreate;
    $('#btnReload').onclick = run;
    $('#btnRetry').onclick = run;
    $('#searchInput').oninput = render;
    $('#statusFilter').onchange = render;

    document.querySelector('[data-close]').onclick = () => ($('#modal').hidden = true);
    document
        .querySelectorAll('[data-form-close]')
        .forEach((b) => (b.onclick = () => ($('#formModal').hidden = true)));
    $('#modal').onclick = (e) => {
        if (e.target === $('#modal')) $('#modal').hidden = true;
    };
    $('#formModal').onclick = (e) => {
        if (e.target === $('#formModal')) $('#formModal').hidden = true;
    };

    window.addEventListener('storage', run);
    run();
})();
