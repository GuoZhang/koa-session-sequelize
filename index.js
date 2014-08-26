/**
 * @constructor
 */
var SequelizeStore = function (Session) {
  this.Session = Session;
};

/**
 * Load data
 */

// for koa-sess
SequelizeStore.prototype.get = function *(sid, parse) {
  try {
    var data = yield this.Session.find({ id: sid });
    if (data && data.id) {
      if (parse === false) return data.blob;
      return JSON.parse(data.blob);
    } else {
      return null;
    }
  } catch (err) {
    console.error(err.stack);
    return null;
  }
};

// for koa-session-store
SequelizeStore.prototype.load = function *(sid) {
  return yield this.get(sid, false);
};

/**
 * Save data
 */
SequelizeStore.prototype.set = SequelizeStore.prototype.save = function *(sid, blob) {
  try {
    if (typeof blob === 'object') blob = JSON.stringify(blob);
    var data = {
      id: sid,
      blob: blob
    };
    var affectedRows = yield this.Session.update(data, { id: sid });
    if (affectedRows == 0) { // no affected rows => assume the record not exists
      yield this.Session.build(data).save();
    }
  } catch (err) {
    console.error(err.stack);
  }
};

/**
 * Remove data
 */
SequelizeStore.prototype.destroy = SequelizeStore.prototype.remove = function *(sid) {
  try {
    yield this.Session.destroy({ id: sid });
  } catch (err) {
    console.error(err.stack);
  }
};

/**
 * Create a Sequelize store
 */
exports.create = function (sequelize, options) {
  options = options || {};
  options.expires = options.expires || 60 * 60 * 24 * 14; // 2 weeks
  options.table = options.table || 'sessions';
  options.model = options.model || 'Session';  // model name

  var Session = sequelize.import('koa-session-sequelize-' + options.model, function (sequelize, DataTypes) {
    return sequelize.define(options.model, {
        id: { type: DataTypes.STRING, allowNull: false, autoIncrement:false, primaryKey: true },
        blob: { type: DataTypes.STRING, allowNull: true }
      }, {
        tableName: options.table
    });
  });
  
  return new SequelizeStore(Session);
};
