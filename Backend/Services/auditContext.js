const { AsyncLocalStorage } = require('node:async_hooks');

const storage = new AsyncLocalStorage();

const auditContextMiddleware = (req, res, next) => {
  storage.run({ req }, next);
};

const getAuditContext = () => {
  const req = storage.getStore()?.req;
  if (!req) return {};

  return {
    actor_id: req.user?.id_usuario || null,
    actor_tipo: req.user?.rol || 'SISTEMA',
    ip: req.ip || req.socket?.remoteAddress || null,
    user_agent: req.headers?.['user-agent'] || null,
  };
};

module.exports = { auditContextMiddleware, getAuditContext };
