# koa-session-sequelize

sequelizejs based koa session middleware

sequelize storage layer for [koa-session-store](https://github.com/hiddentao/koa-session-store) or [koa-generic-session](https://github.com/koajs/generic-session).  


## Installation

```
npm install koa-session-sequelize
```

## Usage

This store requires either [koa-session-store](https://github.com/hiddentao/koa-session-store) or [koa-generic-session](https://github.com/koajs/generic-session).

```
var session = require('koa-session-store'); // or you can use 'koa-generic-session'
var Sequelize = require('sequelize');


var koa = require('koa');

// instantiation Sequelize see [Sequelize API Reference](https://github.com/sequelize/sequelize/wiki/API-Reference) for more detail
var sequelize = new Sequelize('test', 'username', '***', {  // instantiation
  dialect: 'sqlite',
  storage: ':memory:'
});

var sequelizeStore = require('koa-session-sequelize');

var app = koa();

app.keys = ['some secret key'];  // needed for cookie-signing

app.use(session({
  store: sequelizeStore.create({
    table: 'sessions',   // table to store sessions (optional, default to 'sessions')
    model: 'Session'     // model to represent session (optional, default to 'Session')
  })
}));

app.use(function *() {
  var n = this.session.views || 0;
  this.session.views = ++n;
  this.body = n + ' views';
});

app.listen(3000, function () {
  console.log('listening on port 3000');
});
```

You can specify model name, collection name, and expiration time (in seconds):


## Other Relevant Modules

* [koa-generic-session](https://github.com/koajs/generic-session)
* [koa-session-store](https://github.com/hiddentao/koa-session-store)  

## Tests

From root directory:

```
npm install && npm test
```

Tests will be run with in-memory sqlite database.

## License

The MIT License (MIT)

Copyright (c) 2014 Brian Zhang < [gzhang.82@gmail.com](mailto:gzhang.82@gmail.com) >

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
