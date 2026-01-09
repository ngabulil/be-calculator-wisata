const { AuditLog } = require('../models/logs/index'); 

const AUDIT_METHODS = new Set(['POST', 'PUT', 'DELETE']);
const SENSITIVE_KEYS = new Set([
  'password',
  'token',
  'accessToken',
  'refreshToken',
  'authorization',
]);

function sanitize(obj) {
  if (!obj || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(sanitize);

  const out = {};
  for (const [k, v] of Object.entries(obj)) {
    if (SENSITIVE_KEYS.has(k)) {
      out[k] = '***';
    } else if (v && typeof v === 'object') {
      out[k] = sanitize(v);
    } else {
      out[k] = v;
    }
  }
  return out;
}

function getIp(req) {
  // Kalau di balik proxy (nginx), pastikan app.set('trust proxy', 1)
  const xff = req.headers['x-forwarded-for'];
  if (typeof xff === 'string' && xff.length > 0) return xff.split(',')[0].trim();
  return req.ip;
}

function auditLogMiddleware(options = {}) {
  const { skipPaths = [], onlySuccess = false } = options;

  return (req, res, next) => {
    if (!AUDIT_METHODS.has(req.method)) return next();

    const path = req.originalUrl || req.path || '';
    if (skipPaths.some((p) => path.startsWith(p))) return next();

    const startedAt = Date.now();

    // Simpan error message kalau kamu punya error handler yang set res.locals.auditErrorMessage
    // (lihat catatan di bawah)
    res.on('finish', async () => {
      try {
        if (onlySuccess && res.statusCode >= 400) return;

        await AuditLog.create({
          admin_id: req.admin?.id ?? req.user?.id ?? null, // sesuaikan: auth kamu set apa?
          action: req.method,
          path,
          status_code: res.statusCode,
          ip: getIp(req),
          user_agent: req.headers['user-agent'] ?? null,
          body: sanitize(req.body ?? null),

          // optional: durasi/notes (kalau mau)
          message: res.locals?.auditMessage
            ?? (res.statusCode >= 400 ? 'Request failed' : null),

          // kalau mau simpan durasi tapi kolomnya belum ada:
          // message: `durationMs=${Date.now() - startedAt}`,
        });
      } catch (err) {
        // jangan mengganggu response user
        console.error('AUDIT LOG ERROR:', err);
      }
    });

    next();
  };
}

module.exports = auditLogMiddleware;