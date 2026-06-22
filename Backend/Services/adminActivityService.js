const { EventEmitter } = require('node:events');

const activityBus = new EventEmitter();
activityBus.setMaxListeners(100);

const publishAdminActivity = (event) => {
  activityBus.emit('activity', {
    ...event,
    emittedAt: new Date().toISOString(),
  });
};

module.exports = { activityBus, publishAdminActivity };
