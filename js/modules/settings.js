(() => {
    'use strict';
    const EP = window.EventPulse || {};
    const $ = (s) => document.querySelector(s);

    const toast = (msg, isError) => window.EP.toast(msg, isError ? 'error' : 'success');
    const setStatus = (msg) => {
        const el = $('#saveStatus');
        if (!el) return;
        el.textContent = msg;
        setTimeout(() => {
            el.textContent = '✓ Đã tự động lưu';
        }, 1500);
    };

    function loadForm() {
        const s = typeof EP.getSettings === 'function' ? EP.getSettings() : {};
        if ($('#name')) $('#name').value = s.name || '';
        if ($('#language')) $('#language').value = s.language || 'vi';
        if ($('#autosave')) $('#autosave').checked = !!s.autosave;
        if ($('#reminder')) $('#reminder').checked = !!s.reminder;
        if ($('#role')) $('#role').value = s.role || 'all';
        document.documentElement.dataset.appearance = s.theme || 'light';
        document
            .querySelectorAll('.theme')
            .forEach((x) => x.classList.toggle('active', x.dataset.theme === (s.theme || 'light')));
    }

    function savePatch(patch) {
        try {
            if (typeof EP.setSettings !== 'function') throw new Error('Settings API unavailable');
            if (patch.name) {
                const u = window.EP.currentUser(),
                    next = { ...u, fullName: patch.name.trim() };
                window.EP.persist(
                    {
                        users: window.EP.store.get('users').map((x) => (x.id === u.id ? next : x)),
                        currentUser: next
                    },
                    window.EP.notification('Đã cập nhật tài khoản', next.fullName)
                );
            }
            EP.setSettings(patch);
            setStatus('✓ Đã tự động lưu');
            toast('Đã lưu thay đổi');
            if (typeof EP.applyI18nNav === 'function') EP.applyI18nNav();
            if (typeof EP.applyRoleNav === 'function') EP.applyRoleNav();
            return true;
        } catch (e) {
            toast('Lỗi lưu: ' + (e.message || 'không xác định'), true);
            setStatus('✕ Lỗi lưu');
            return false;
        }
    }

    document.querySelectorAll('.nav-item').forEach((btn) =>
        btn.addEventListener('click', () => {
            document.querySelectorAll('.nav-item').forEach((x) => x.classList.remove('active'));
            btn.classList.add('active');
            const target = document.getElementById(btn.dataset.target);
            if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        })
    );

    document.querySelectorAll('.theme').forEach((btn) =>
        btn.addEventListener('click', () => {
            document.querySelectorAll('.theme').forEach((x) => x.classList.remove('active'));
            btn.classList.add('active');
            savePatch({ theme: btn.dataset.theme });
        })
    );

    ['autosave', 'reminder', 'language', 'name', 'role'].forEach((id) => {
        const el = $('#' + id);
        if (!el) return;
        el.addEventListener('change', () => {
            if (id === 'name' && el.value.trim().length < 2) {
                toast('Tên chưa hợp lệ', true);
                return;
            }
            const patch = {};
            if (el.type === 'checkbox') patch[id] = el.checked;
            else patch[id] = el.value;
            savePatch(patch);
        });
    });

    const form = $('#passwordForm');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const current = $('#currentPassword').value;
            const newPass = $('#newPassword').value;
            const confirm = $('#confirmPassword').value;
            const msg = $('#passwordMessage');
            if (!current || !newPass || !confirm) {
                msg.textContent = 'Vui lòng nhập đầy đủ thông tin.';
                msg.style.color = 'var(--error)';
                return;
            }
            if (newPass.length < 8) {
                msg.textContent = 'Mật khẩu mới phải có ít nhất 8 ký tự.';
                msg.style.color = 'var(--error)';
                return;
            }
            if (newPass !== confirm) {
                msg.textContent = 'Mật khẩu xác nhận không khớp.';
                msg.style.color = 'var(--error)';
                return;
            }
            const hash = async (s) =>
                Array.from(
                    new Uint8Array(
                        await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s))
                    ),
                    (b) => b.toString(16).padStart(2, '0')
                ).join('');
            const map = JSON.parse(sessionStorage.getItem('eventpulse_mockCredentials') || '{}'),
                id = window.EP.currentUser().id;
            if ((await hash(current)) !== (map[id] || (await hash('Demo@123')))) {
                msg.textContent = 'Mật khẩu hiện tại chưa đúng.';
                return;
            }
            map[id] = await hash(newPass);
            sessionStorage.setItem('eventpulse_mockCredentials', JSON.stringify(map));
            msg.textContent = 'Đổi mật khẩu thành công (mock trong phiên trình duyệt).';
            msg.style.color = 'var(--success)';
            e.target.reset();
            toast('Đã cập nhật mật khẩu');
        });
    }

    const u = window.EP.currentUser();
    document.querySelector('.profile-row strong').textContent = u.fullName;
    document.querySelector('.profile-row span').textContent = window.EP.roles[u.role];
    document.querySelector('#account input[disabled]').value = u.email;
    document.querySelector('.profile-row .big-avatar').textContent = u.fullName
        .split(' ')
        .slice(-2)
        .map((w) => w[0])
        .join('');
    loadForm();
})();
