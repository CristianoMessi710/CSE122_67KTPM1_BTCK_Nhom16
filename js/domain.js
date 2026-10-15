export const live = (s) => ['approved', 'published', 'pending'].includes(s.status);
export const overlaps = (a, b) =>
    new Date(a.startTime) < new Date(b.endTime) && new Date(a.endTime) > new Date(b.startTime);
export function conflicts(sessions) {
    const result = [];
    const all = sessions.filter(live);
    for (let i = 0; i < all.length; i++)
        for (let j = i + 1; j < all.length; j++)
            if (all[i].roomId && all[i].roomId === all[j].roomId && overlaps(all[i], all[j]))
                result.push([all[i], all[j]]);
    return result;
}
export function validateAssignment(s, sessions, rooms) {
    const errors = {};
    const room = rooms.find((r) => r.id === s.roomId);
    if (!room || room.eventId !== s.eventId || ['disabled', 'maintenance'].includes(room.status))
        errors.roomId = 'Chọn phòng đang hoạt động.';
    if (!s.startTime || !s.endTime || !(new Date(s.startTime) < new Date(s.endTime)))
        errors.endTime = 'Giờ kết thúc phải sau giờ bắt đầu.';
    if (
        !Number.isInteger(+s.capacity) ||
        +s.capacity <= 0 ||
        (room && +s.capacity > room.capacity) ||
        +s.capacity < s.registeredCount
    )
        errors.capacity = 'Sức chứa phải đủ cho người đăng ký và không vượt quá phòng.';
    const clash = sessions.find(
        (x) => x.id !== s.id && live(x) && x.roomId === s.roomId && overlaps(s, x)
    );
    if (clash) errors.roomId = 'Phòng trùng lịch với “' + clash.title + '”.';
    return errors;
}
export function suggestRoom(s, sessions, rooms) {
    return rooms.find(
        (r) =>
            r.eventId === s.eventId &&
            !['disabled', 'maintenance'].includes(r.status) &&
            r.capacity >= Math.max(s.registeredCount || 0, s.capacity || 0) &&
            !sessions.some((x) => x.id !== s.id && live(x) && x.roomId === r.id && overlaps(s, x))
    );
}
export function alertRecipients(a, d) {
    const role = { attendees: 'attendee', speakers: 'speaker', organizers: 'organizer' }[a.target];
    return d.users
        .filter(
            (u) =>
                u.status === 'active' &&
                (!role || u.role === role) &&
                (!a.sessionId ||
                    d.sessions.find((s) => s.id === a.sessionId)?.speakerIds.includes(u.id) ||
                    d.agendas.some(
                        (x) =>
                            x.sessionId === a.sessionId && x.userId === u.id && x.status === 'saved'
                    ))
        )
        .map((u) => u.id);
}
export function forecast(s, d) {
    const saves = d.agendas.filter((a) => a.sessionId === s.id && a.status === 'saved').length;
    if (!saves && !s.registeredCount)
        return { status: 'insufficientData', reason: 'Phiên chưa có lượt đăng ký hoặc lưu lịch.' };
    const expected = Math.round(s.registeredCount * 0.95 + saves * 2);
    const confidence = saves >= 3 ? 0.82 : 0.58;
    return {
        status: 'success',
        expected,
        confidence,
        reason: `Dựa trên ${s.registeredCount} lượt đăng ký và ${saves} lượt lưu lịch. Đây là dự báo mô phỏng, không phải số tham dự thực tế.`
    };
}
