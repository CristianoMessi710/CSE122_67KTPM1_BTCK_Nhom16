(() => {
    'use strict';

    const EP = window.EventPulse || {};
    if (typeof EP.ensureSeed === 'function') EP.ensureSeed();

    const STORAGE_KEY = 'eventpulse_materials';
    const SESSION_KEY = 'eventpulse_sessions';
    const USER_ID = window.EP.currentUser().id;
    const SESSION_ID =
        new URLSearchParams(location.search).get('id') ||
        window.EventPulse.getSessionsForSpeaker(USER_ID)[0]?.id;
    const MAX_SIZE = 20 * 1024 * 1024;
    const ALLOWED = [
        'pdf',
        'ppt',
        'pptx',
        'doc',
        'docx',
        'xls',
        'xlsx',
        'zip',
        'txt',
        'png',
        'jpg',
        'jpeg'
    ];

    const $ = (s) => document.querySelector(s);
    let session = null;
    let materials = [];
    let pendingDeleteId = null;

    function escapeHtml(value) {
        return String(value ?? '').replace(
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

    function loadSession() {
        session = window.EP.store
            .get('sessions')
            .find((s) => s.id === SESSION_ID && s.speakerIds.includes(USER_ID));
        if (!session) throw Error('Bạn chưa có phiên hoặc không có quyền quản lý tài liệu.');
    }

    function loadMaterials() {
        materials = window.EP.store
            .get('materials')
            .filter((x) => x.sessionId === SESSION_ID && x.status !== 'removed')
            .map((x) => ({
                ...x,
                speakerId: x.uploadedBy,
                size: x.fileSize,
                url: x.fileUrl,
                kind: x.type === 'link' ? 'link' : 'file'
            }));
    }

    function persist() {
        const all = window.EP.store.get('materials').filter((x) => x.sessionId !== SESSION_ID);
        const normalized = materials.map((m) => ({
            id: m.id,
            sessionId: SESSION_ID,
            uploadedBy: USER_ID,
            title: m.fileName,
            fileName: m.fileName,
            fileSize: m.size || 0,
            fileUrl: m.url || '',
            type: m.kind === 'link' ? 'link' : 'document',
            mockFile: m.kind !== 'link',
            status: 'available',
            uploadedAt: m.uploadedAt
        }));
        window.EP.persist(
            { materials: [...all, ...normalized] },
            window.EP.notification(
                'Tài liệu phiên đã cập nhật',
                session.title,
                'system',
                'session',
                SESSION_ID
            )
        );
    }

    function formatSize(bytes) {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
        return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
    }

    function formatDate(value) {
        return new Date(value).toLocaleString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    function ext(name) {
        return (name.split('.').pop() || 'FILE').toUpperCase().slice(0, 5);
    }

    function showToast(message, error = false) {
        window.EP.toast(message, error ? 'error' : 'success');
    }

    function render() {
        $('#sessionInfo').textContent = `${session.id} · ${session.title}`;
        $('#sessionTitle').textContent = session.title || '—';
        $('#sessionId').textContent = session.id || '—';

        const status = session.reviewStatus || session.status || 'pending';
        const labels = {
            pending: 'Chờ duyệt',
            approved: 'Đã duyệt',
            rejected: 'Từ chối',
            published: 'Đã duyệt'
        };
        const badge = $('#statusBadge');
        badge.textContent = labels[status] || status;
        badge.className = 'status-badge ' + (status === 'published' ? 'approved' : status);

        $('#materialCount').textContent = `${materials.length} tài liệu`;
        $('#sideCount').textContent = materials.length;

        const list = $('#materialList');
        $('#emptyState').hidden = materials.length !== 0;

        if (!materials.length) {
            list.innerHTML = '';
            return;
        }

        list.innerHTML = materials
            .map((m) => {
                const isLink = m.kind === 'link' || (m.type || '').includes('link');
                const icon = isLink ? 'URL' : escapeHtml(ext(m.fileName));
                const meta = isLink
                    ? `Link · ${formatDate(m.uploadedAt)}`
                    : `${formatSize(m.size)} · Upload ${formatDate(m.uploadedAt)}`;
                const nameHtml =
                    isLink && m.url
                        ? `<a class="material-name" href="${escapeHtml(m.url)}" target="_blank" rel="noopener" title="${escapeHtml(m.url)}">${escapeHtml(m.fileName)}</a>`
                        : `<div class="material-name" title="${escapeHtml(m.fileName)}">${escapeHtml(m.fileName)}</div>`;
                return `
      <article class="material-item">
        <div class="file-icon">${icon}</div>
        <div class="material-info">
          ${nameHtml}
          <div class="material-meta">${meta}</div>
        </div>
        <div class="material-actions">
          <button class="icon-btn" aria-label="Chỉnh sửa tài liệu" data-edit="${m.id}">${window.EP.icon('edit')}</button><button class="icon-btn" title="Xem thông tin" data-info="${m.id}">i</button>
          <button class="icon-btn delete" title="Xoá tài liệu" data-delete="${m.id}">×</button>
        </div>
      </article>`;
            })
            .join('');

        list.querySelectorAll('[data-edit]').forEach(
            (b) => (b.onclick = () => editMaterial(b.dataset.edit))
        );
        list.querySelectorAll('[data-info]').forEach((btn) => {
            btn.onclick = () => {
                const m = materials.find((x) => x.id === btn.dataset.info);
                if (m) showToast(`${m.fileName} · ${formatSize(m.size)}`);
            };
        });
        list.querySelectorAll('[data-delete]').forEach((btn) => {
            btn.onclick = () => openDelete(btn.dataset.delete);
        });
    }

    function openDelete(id) {
        const m = materials.find((x) => x.id === id);
        if (!m) return;
        pendingDeleteId = id;
        $('#deleteFileName').textContent = m.fileName;
        $('#deleteModal').hidden = false;
    }

    function closeDelete() {
        pendingDeleteId = null;
        $('#deleteModal').hidden = true;
    }

    function deleteMaterial() {
        if (!pendingDeleteId) return;
        const target = materials.find((x) => x.id === pendingDeleteId);
        const backup = structuredClone(materials);
        materials = materials.filter((x) => x.id !== pendingDeleteId);
        try {
            persist();
        } catch (e) {
            materials = backup;
            showToast(e.message, true);
            return;
        }
        closeDelete();
        render();
        showToast(`Đã xoá ${target?.fileName || 'tài liệu'}.`);
    }

    function validateFile(file) {
        const extension = (file.name.split('.').pop() || '').toLowerCase();
        if (!ALLOWED.includes(extension)) {
            showToast(`File .${extension || 'không xác định'} không được hỗ trợ.`, true);
            return false;
        }
        if (file.size > MAX_SIZE) {
            showToast(`${file.name} vượt quá giới hạn 20MB.`, true);
            return false;
        }
        return true;
    }

    function makeId() {
        return (
            'MAT' +
            Date.now().toString(36).toUpperCase() +
            Math.random().toString(36).slice(2, 6).toUpperCase()
        );
    }

    function uploadFiles(fileList) {
        const files = [...fileList].filter(validateFile);
        if (!files.length) return;

        let index = 0;
        const next = () => {
            if (index >= files.length) {
                $('#uploadProgress').hidden = true;
                render();
                $('#successText').textContent =
                    `${files.length} tài liệu đã được thêm vào session.`;
                $('#successModal').hidden = false;
                return;
            }

            const file = files[index++];
            $('#uploadProgress').hidden = false;
            $('#progressName').textContent = file.name;
            $('#progressPercent').textContent = '0%';
            $('#progressBar').style.width = '0%';

            let percent = 0;
            const timer = setInterval(() => {
                percent += Math.floor(Math.random() * 20) + 10;
                if (percent >= 100) percent = 100;
                $('#progressPercent').textContent = percent + '%';
                $('#progressBar').style.width = percent + '%';

                if (percent === 100) {
                    clearInterval(timer);
                    setTimeout(() => {
                        materials.push({
                            id: makeId(),
                            sessionId: SESSION_ID,
                            speakerId: USER_ID,
                            fileName: file.name,
                            size: file.size,
                            type: file.type || 'application/octet-stream',
                            uploadedAt: new Date().toISOString()
                        });
                        try {
                            persist();
                            next();
                        } catch (e) {
                            materials.pop();
                            $('#uploadProgress').hidden = true;
                            showToast(e.message, true);
                        }
                    }, 160);
                }
            }, 110);
        };
        next();
    }

    function boot() {
        $('#loadingState').hidden = false;
        $('#errorState').hidden = true;
        $('#app').hidden = true;

        setTimeout(() => {
            try {
                loadSession();
                loadMaterials();
                render();
                $('#loadingState').hidden = true;
                $('#app').hidden = false;
            } catch (error) {
                $('#loadingState').hidden = true;
                $('#errorState').hidden = false;
                $('#errorMessage').textContent = error.message;
            }
        }, 500);
    }

    $('#chooseBtn').onclick = () => $('#fileInput').click();
    $('#emptyChooseBtn').onclick = () => $('#fileInput').click();
    $('#fileInput').onchange = (e) => {
        uploadFiles(e.target.files);
        e.target.value = '';
    };

    const drop = $('#dropZone');
    ['dragenter', 'dragover'].forEach((type) =>
        drop.addEventListener(type, (e) => {
            e.preventDefault();
            e.stopPropagation();
            drop.classList.add('dragover');
        })
    );
    ['dragleave', 'drop'].forEach((type) =>
        drop.addEventListener(type, (e) => {
            e.preventDefault();
            e.stopPropagation();
            drop.classList.remove('dragover');
        })
    );
    drop.addEventListener('drop', (e) => uploadFiles(e.dataTransfer.files));

    $('#cancelDelete').onclick = closeDelete;
    $('#confirmDelete').onclick = deleteMaterial;
    $('#successClose').onclick = () => {
        $('#successModal').hidden = true;
        $('#fileInput').focus();
    };
    $('#retryBtn').onclick = boot;
    $('#backBtn').onclick = () => (location.href = './speaker-my-session.html');

    [$('#deleteModal'), $('#successModal')].forEach((modal) => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal && modal === $('#deleteModal')) closeDelete();
        });
    });

    const addRefBtn = $('#addRefBtn');
    if (addRefBtn) {
        addRefBtn.onclick = () => {
            const url = ($('#refLinkInput')?.value || '').trim();
            const title = ($('#refTitleInput')?.value || '').trim();
            if (!url) {
                showToast('Vui lòng nhập URL.', true);
                return;
            }
            try {
                const u = new URL(url);
                if (!['http:', 'https:'].includes(u.protocol)) throw new Error('protocol');
            } catch {
                showToast('URL không hợp lệ.', true);
                return;
            }
            materials.push({
                id: makeId(),
                sessionId: SESSION_ID,
                speakerId: USER_ID,
                fileName: title || url,
                url,
                kind: 'link',
                size: 0,
                type: 'text/uri-list',
                uploadedAt: new Date().toISOString()
            });
            try {
                persist();
            } catch (e) {
                materials.pop();
                showToast(e.message, true);
                return;
            }
            if ($('#refLinkInput')) $('#refLinkInput').value = '';
            if ($('#refTitleInput')) $('#refTitleInput').value = '';
            render();
            showToast('Đã thêm link tham khảo.');
        };
    }

    function editMaterial(id) {
        const m = materials.find((x) => x.id === id);
        if (!m) return;
        const d = document.getElementById('dialog');
        d.innerHTML =
            '<h2>Chỉnh sửa tài liệu</h2><form id="material-edit"><label>Tên tài liệu<input id="material-name" required maxlength="160"></label><label>URL (đối với liên kết)<input id="material-url" type="url"></label><p id="material-error" class="field-error"></p><div class="actions"><button type="button" class="btn btn-secondary" data-action="close">Hủy</button><button class="btn btn-primary">Lưu</button></div></form>';
        $('#material-name').value = m.fileName;
        $('#material-url').value = m.url || '';
        $('#material-url').disabled = m.kind !== 'link';
        d.showModal();
        $('#material-edit').onsubmit = (e) => {
            e.preventDefault();
            const name = $('#material-name').value.trim(),
                url = $('#material-url').value.trim();
            if (!name || (m.kind === 'link' && !/^https?:\/\//.test(url))) {
                $('#material-error').textContent = 'Nhập tên và URL http/https hợp lệ.';
                return;
            }
            const old = { ...m };
            Object.assign(m, { fileName: name, url });
            try {
                persist();
                d.close();
                render();
                showToast('Đã cập nhật tài liệu.');
            } catch (err) {
                Object.assign(m, old);
                $('#material-error').textContent = err.message;
            }
        };
    }
    const pick = document.createElement('label');
    pick.className = 'field';
    pick.textContent = 'Chọn phiên';
    const select = document.createElement('select');
    select.innerHTML = window.EventPulse.getSessionsForSpeaker(USER_ID)
        .map((s) => '<option value="' + escapeHtml(s.id) + '">' + escapeHtml(s.title) + '</option>')
        .join('');
    select.value = SESSION_ID;
    select.onchange = () =>
        (location.href = 'speaker-session-materials.html?id=' + encodeURIComponent(select.value));
    pick.append(select);
    document.querySelector('main').prepend(pick);
    boot();
})();
