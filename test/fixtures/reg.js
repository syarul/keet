var Keet = require('../../')
var log = console.log.bind(console)

var init = function(cb) {
  var ctx = this
  var keet = function(tag) {
    return new Keet(ctx)
  }

  this.app = keet().link('app', '{{test}}')
  this.test = keet().register('app', true, cb)
    .template('div', 'testTag')
    .set('initial')

}

exports.register1 = function(t) {
  var c = new init(function(){
    t.ok(true, 'register')
  })
}

exports.register2 = function(t) {
  var c = new init
  c.test.unreg()
  c.app.compose(function(){
    t.ok(c.test.ctor.register === null, 'unregister')
  })
}

exports.reg3 = function(t) {
  fn = function() {
    t.ok(true, 'global register')
  }

  app = new Keet
  app.link('app', '{{test}}')
  test = new Keet
  test.register('app', true, fn)
    .template('div', 'testTag')
    .set('initial')
}