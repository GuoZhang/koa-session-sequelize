'use strict';

module.exports = function (sequelize, sessionLibrary, options) {

  var koa = require('koa'),
      app = koa(),
      SequelizeStore = require('../'),
      route = require('koa-route'),
      request = require('co-supertest'),
      session = require(sessionLibrary),
      should = require('should');

  app.keys = ['some secret key'];
  app.use(session({
    store: SequelizeStore.create(sequelize, options)
  }));

  var count = 0;

  app.use(route.get('/create', function *() {
    this.session.count = count;
    this.session.count++;
    this.status = 204;
  }));
  app.use(route.get('/read', function *() {
    this.status = 204;
  }));
  app.use(route.get('/update', function *() {
    this.session.count++;
    this.status = 204;
  }));
  app.use(route.get('/destroy', function *() {
    this.session = null;
    this.status = 204;
  }));

  var agent = request.agent(app.listen()),
      Session = sequelize.model(options.model),
      sessionId = null;

  describe('koa-session-sequelize for ' + sessionLibrary, function () {
    before(function *() {
      yield sequelize.sync({ force: true });
    });

    describe('Initial state', function () {
      it('Should not have any session documents', function *() {
        let session = yield Session.find({});
        should.equal(session, null);
      });
    });
    describe('Create', function () {
      it('Should 204', function *() {
        yield agent.get('/create')
                   .expect(204)
                   .end();
      });
      it('Should create session document (count value should be 1)', function *() {
        let session = yield Session.find({}),
            sessionId = session.id;

        sessionId.should.not.equal(null);
        JSON.parse(session.blob).count.should.equal(1);
      });
    });
    describe('Read', function () {
      it('Should 204', function *() {
        yield agent.get('/read')
                   .expect(204)
                   .end();
      });
      it('Should not change session document (count value should be 1)', function *() {
        let session = yield Session.find({ id: sessionId });
        session.should.not.equal(null);

        JSON.parse(session.blob).count.should.equal(1);
      });
    });
    describe('Update', function () {
      it('Should 204', function *() {
        yield agent.get('/update')
                   .expect(204)
                   .end();
      });
      it('Should update session document (count value should be 2)', function *() {
        let session = yield Session.find({ id: sessionId });

        JSON.parse(session.blob).count.should.equal(2);
      });
    });
    describe('Destroy', function () {
      it('Should 204', function *() {
        yield agent.get('/destroy')
                   .expect(204)
                   .end();
      });
      it('Should delete session document', function *() {
        let session = yield Session.find({ id: sessionId });
      
        should.equal(session, null);
      });
    });
    describe('Read', function () {
      it('Should 204', function *() {
        yield agent.get('/read')
                   .expect(204)
                   .end();
      });
      it('Should not find a session document', function *() {
        let session = yield Session.find({});

        should.equal(session, null);
      });
    });
  });
};
