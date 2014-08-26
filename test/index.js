
var Sequelize = require('sequelize'),
    sequelize = new Sequelize('test', 'username', '***', {
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false
    });

require('./session-store')(sequelize, 'koa-session-store', {
    table: 'sessions',
    model: 'KoaSessionStore' });

require('./session-store')(sequelize, 'koa-generic-session', {
    table: 'gsessions',
    model: 'KoaGenericSessionStore' });
