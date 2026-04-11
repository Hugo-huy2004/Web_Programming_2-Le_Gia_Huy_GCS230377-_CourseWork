export function sendError(res, statusCode, message) {
    return res.status(statusCode).json({ ok: false, message });
}

export function sendSuccess(res, statusCode, payload = {}) {
    return res.status(statusCode).json({ ok: true, ...payload });
}