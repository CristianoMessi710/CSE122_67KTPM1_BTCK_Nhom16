/* Authentication is a frontend mock. Use only sample information and demo passwords. */
(async () => {
    'use strict';
    const $ = (id) => document.getElementById(id),
        page = document.body.dataset.page;
    const field = (id, label, type = 'text', extra = '') =>
        `<div class="field"><label for="${id}">${label} *</label><input class="input" id="${id}" name="${id}" type="${type}" required ${extra} aria-describedby="${id}-error"><span class="form-error" id="${id}-error"></span></div>`;
    const password = (id, label) =>
        `<div class="field"><label for="${id}">${label} *</label><div class="password-row"><input class="input" id="${id}" type="password" required minlength="8" autocomplete="${page === 'login' ? 'current-password' : 'new-password'}" aria-describedby="${id}-error"><button class="btn secondary" type="button" data-show="${id}" aria-label="Hiện mật khẩu">Hiện</button></div><span class="form-error" id="${id}-error"></span></div>`;
    function error(id, msg) {
        $(id + '-error').textContent = msg;
        $(id).setAttribute('aria-invalid', !!msg);
        return !msg;
    }
    const validEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
    async function hash(s) {
        const b = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s));
        return [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, '0')).join('');
    }
    function credentials() {
        return JSON.parse(sessionStorage.getItem('eventpulse_mockCredentials') || '{}');
    }
    function bindShow() {
        document.querySelectorAll('[data-show]').forEach(
            (b) =>
                (b.onclick = () => {
                    const input = $(b.dataset.show);
                    input.type = input.type === 'password' ? 'text' : 'password';
                    b.textContent = input.type === 'password' ? 'Hiện' : 'Ẩn';
                    b.setAttribute('aria-label', input.type === 'password' ? 'Hiện mật khẩu' : 'Ẩn mật khẩu');
                    b.setAttribute('aria-label', b.textContent + ' mật khẩu');
                })
        );
    }
    try {
        await EP.init();
        if (page === 'login' || page === 'register' || page === 'forgot') {
            const title = {
                login: 'Đăng nhập',
                register: 'Tạo tài khoản',
                forgot: 'Quên mật khẩu'
            }[page];
            EP.shell(title);
            document.querySelector('main').innerHTML =
                `<section class="auth-wrap card"><h1>${title}</h1><p class="muted">${page === 'forgot' ? 'Nhận liên kết đặt lại mật khẩu qua email giả lập.' : 'Chào mừng bạn đến với EventPulse.'}</p><form id="account-form" class="stack" novalidate>${page === 'register' ? field('name', 'Họ và tên', 'text', 'autocomplete="name" maxlength="80"') : ''}${field('email', 'Email', 'email', 'autocomplete="email" maxlength="160"')}${page !== 'forgot' ? password('password', 'Mật khẩu') : ''}${page === 'register' ? `<label class="field">Độ mạnh mật khẩu<progress id="strength" max="4" value="0"></progress><span id="strength-label" class="form-help">Ít nhất 8 ký tự.</span></label>${password('confirm', 'Xác nhận mật khẩu')}<div class="field"><label for="role">Vai trò</label><select id="role" class="select"><option value="attendee">Người tham dự</option><option value="speaker">Diễn giả</option></select></div>` : ''}<button id="submit" class="btn" type="submit">${title}</button><div id="result" class="status-line" role="status"></div></form><div class="auth-links inline-note"><a href="${EP.url('login.html')}">Đăng nhập</a><a href="${EP.url('register.html')}">Đăng ký</a><a href="${EP.url('forgot-password.html')}">Quên mật khẩu</a></div><p class="form-help inline-note">Prototype: chỉ dùng dữ liệu giả. Tài khoản mẫu: minhanh@example.com / Demo@123. Tài khoản tự đăng ký dùng mật khẩu đã nhập trong cùng phiên trình duyệt; ở phiên mới dùng Demo@123 (xác thực mock).</p><button class="btn ghost" data-switch-role>Vào chế độ demo vai trò</button></section>`;
            bindShow();
            function validate() {
                let ok = true;
                const email = $('email').value.trim().toLowerCase();
                ok = error('email', validEmail(email) ? '' : 'Email không đúng định dạng.') && ok;
                if (page === 'register') {
                    ok =
                        error(
                            'name',
                            $('name').value.trim().length >= 2 ? '' : 'Nhập ít nhất 2 ký tự.'
                        ) && ok;
                    if (validEmail(email))
                        ok =
                            error(
                                'email',
                                EP.store.get('users').some((u) => u.email?.toLowerCase() === email)
                                    ? 'Email đã được sử dụng.'
                                    : ''
                            ) && ok;
                }
                if (page !== 'forgot')
                    ok =
                        error(
                            'password',
                            $('password').value.length >= 8 ? '' : 'Mật khẩu cần ít nhất 8 ký tự.'
                        ) && ok;
                if (page === 'register')
                    ok =
                        error(
                            'confirm',
                            $('confirm').value === $('password').value
                                ? ''
                                : 'Mật khẩu xác nhận chưa khớp.'
                        ) && ok;
                return ok;
            }
            if (page === 'register')
                document.querySelectorAll('input').forEach(
                    (i) =>
                        (i.oninput = () => {
                            validate();
                            const s = $('password').value;
                            const n = [
                                s.length >= 8,
                                /[a-z]/.test(s) && /[A-Z]/.test(s),
                                /\d/.test(s),
                                /[^a-zA-Z0-9]/.test(s)
                            ].filter(Boolean).length;
                            $('strength').value = n;
                            $('strength-label').textContent = [
                                'Chưa nhập',
                                'Yếu',
                                'Trung bình',
                                'Khá',
                                'Mạnh'
                            ][n];
                        })
                );
            let cooldown = 0,
                timer;
            function countdown() {
                clearInterval(timer);
                const tick = () => {
                    const left = Math.max(0, Math.ceil((cooldown - Date.now()) / 1000));
                    $('submit').disabled = left > 0;
                    $('submit').textContent = left
                        ? 'Gửi lại sau ' + left + ' giây'
                        : 'Gửi liên kết đặt lại';
                    if (!left) clearInterval(timer);
                };
                tick();
                timer = setInterval(tick, 1000);
            }
            if (page === 'forgot') {
                cooldown = Number(sessionStorage.getItem('eventpulse_resetCooldown') || 0);
                countdown();
            }
            $('account-form').onsubmit = (e) => {
                e.preventDefault();
                if (!validate() || cooldown > Date.now()) return;
                EP.task($('submit'), async () => {
                    const email = $('email').value.trim().toLowerCase(),
                        users = EP.store.get('users'),
                        u = users.find((x) => x.email?.toLowerCase() === email);
                    if (page === 'login') {
                        if (
                            !u ||
                            u.status !== 'active' ||
                            (await hash($('password').value)) !==
                                (credentials()[u.id] || (await hash('Demo@123')))
                        )
                            throw Error(
                                'Email hoặc mật khẩu không đúng, hoặc tài khoản không hoạt động.'
                            );
                        EP.store.set('currentUser', u);
                        $('result').textContent = 'Đăng nhập thành công. Đang chuyển trang…';
                        await EP.delay(250);
                        location.href = EP.routeFor(u.role);
                    } else if (page === 'register') {
                        if (u) throw Error('Email đã tồn tại.');
                        const now = new Date().toISOString();
                        const item = {
                            id: EP.uid('USR'),
                            fullName: $('name').value.trim(),
                            email,
                            role: $('role').value,
                            status: 'active',
                            avatar: '',
                            phone: '',
                            interests: [],
                            bio: '',
                            expertise: [],
                            createdAt: now,
                            updatedAt: now
                        };
                        const c = credentials();
                        c[item.id] = await hash($('password').value);
                        sessionStorage.setItem('eventpulse_mockCredentials', JSON.stringify(c));
                        EP.commit({ users: [...users, item], currentUser: item });
                        $('result').textContent = 'Tạo tài khoản thành công.';
                        await EP.delay(250);
                        location.href = EP.routeFor(item.role);
                    } else {
                        if (!u) throw Error('Email không tồn tại trong hệ thống.');
                        EP.store.set(
                            'users',
                            users.map((x) =>
                                x.id === u.id
                                    ? { ...x, passwordResetRequestedAt: new Date().toISOString() }
                                    : x
                            )
                        );
                        cooldown = Date.now() + 30000;
                        sessionStorage.setItem('eventpulse_resetCooldown', cooldown);
                        $('result').textContent =
                            'Đã gửi liên kết đặt lại (email giả lập). Không có email thật được gửi.';
                        setTimeout(countdown, 0);
                    }
                });
            };
        } else if (page === 'profile') {
            const u = await EP.guard(['attendee', 'organizer', 'admin']);
            if (!u) return;
            EP.shell('Hồ sơ cá nhân');
            let avatar = u.avatar || '';
            document.querySelector('main').innerHTML =
                `<div class="page-head"><div><h1>Hồ sơ cá nhân</h1><p>Cập nhật thông tin và sở thích của bạn.</p></div></div><form id="profile-form" class="card stack" novalidate><div class="row"><img class="big-avatar" id="avatar-preview" alt="Ảnh đại diện" ${avatar ? `src="${EP.esc(EP.safeImage(avatar))}"` : 'hidden'}><div class="field"><label for="avatar-file">Ảnh đại diện PNG JPG WEBP tối đa 1 MB</label><input id="avatar-file" type="file" accept="image/png,image/jpeg,image/webp"><button class="btn ghost" type="button" id="remove-avatar">Xóa ảnh</button><span id="avatar-error" class="form-error"></span></div></div><div class="form-grid">${field('name', 'Họ và tên', 'text', 'maxlength="80"')}${field('email', 'Email', 'email')}<div class="field"><label for="phone">Số điện thoại</label><input class="input" id="phone" type="tel"><span id="phone-error" class="form-error"></span></div><div class="field"><label for="interests">Sở thích cách nhau bằng dấu phẩy</label><input class="input" id="interests" placeholder="ai, web-development"></div><div class="field full"><label for="bio">Giới thiệu</label><textarea id="bio" maxlength="500"></textarea></div></div><div class="actions"><button id="save-profile" class="btn">Lưu thay đổi</button><button id="cancel-profile" type="button" class="btn secondary">Hủy thay đổi</button></div><div id="result" role="status"></div></form>`;
            function fill() {
                const x = EP.currentUser();
                $('name').value = x.fullName || '';
                $('email').value = x.email || '';
                $('phone').value = x.phone || '';
                $('interests').value = (x.interests || []).join(', ');
                $('bio').value = x.bio || '';
                avatar = x.avatar || '';
                $('avatar-preview').hidden = !avatar;
                if (avatar) $('avatar-preview').src = EP.safeImage(avatar);
                else $('avatar-preview').removeAttribute('src');
                $('avatar-file').value = '';
            }
            fill();
            $('cancel-profile').onclick = () => {
                fill();
                EP.toast('Đã hoàn tác thay đổi chưa lưu.');
            };
            $('remove-avatar').onclick = () => {
                avatar = '';
                $('avatar-preview').hidden = true;
                $('avatar-file').value = '';
            };
            $('avatar-file').onchange = () => {
                const f = $('avatar-file').files[0];
                if (!f) return;
                if (
                    !['image/png', 'image/jpeg', 'image/webp'].includes(f.type) ||
                    f.size > 1024 * 1024
                ) {
                    $('avatar-error').textContent = 'Chọn ảnh PNG/JPG/WEBP không quá 1 MB.';
                    return;
                }
                const r = new FileReader();
                r.onload = () => {
                    avatar = r.result;
                    $('avatar-preview').src = avatar;
                    $('avatar-preview').hidden = false;
                    $('avatar-error').textContent = '';
                };
                r.onerror = () => {
                    $('avatar-error').textContent = 'Không đọc được ảnh.';
                };
                r.readAsDataURL(f);
            };
            $('profile-form').onsubmit = (e) => {
                e.preventDefault();
                let ok = true;
                ok =
                    error(
                        'name',
                        $('name').value.trim().length >= 2 ? '' : 'Họ tên cần ít nhất 2 ký tự.'
                    ) && ok;
                const email = $('email').value.trim().toLowerCase();
                ok =
                    error(
                        'email',
                        !validEmail(email)
                            ? 'Email không hợp lệ.'
                            : EP.store
                                    .get('users')
                                    .some((x) => x.id !== u.id && x.email?.toLowerCase() === email)
                              ? 'Email đã tồn tại.'
                              : ''
                    ) && ok;
                ok =
                    error(
                        'phone',
                        !$('phone').value || /^\+?[\d\s-]{9,15}$/.test($('phone').value)
                            ? ''
                            : 'Số điện thoại không hợp lệ.'
                    ) && ok;
                if (!ok) return;
                EP.task($('save-profile'), () => {
                    const next = {
                        ...EP.currentUser(),
                        fullName: $('name').value.trim(),
                        email,
                        phone: $('phone').value.trim(),
                        interests: $('interests')
                            .value.split(',')
                            .map((s) => s.trim())
                            .filter(Boolean),
                        bio: $('bio').value.trim(),
                        avatar,
                        updatedAt: new Date().toISOString()
                    };
                    EP.persist(
                        {
                            users: EP.store.get('users').map((x) => (x.id === u.id ? next : x)),
                            currentUser: next
                        },
                        EP.notification(
                            'Đã cập nhật hồ sơ',
                            'Thông tin cá nhân đã được lưu.',
                            'system',
                            'user',
                            u.id
                        )
                    );
                    $('result').textContent = 'Đã cập nhật thành công.';
                    EP.shell('Hồ sơ cá nhân');
                    EP.toast('Đã lưu hồ sơ.', 'success');
                });
            };
        }
        EP.footer();
    } catch (e) {
        EP.errorPanel(e);
    }
})();
