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
  document.getElementById('app').innerHTML = ''
  var c = new init(function(){
    t.ok(true, 'register')
  })
}

exports.register2 = function(t) {
  document.getElementById('app').innerHTML = ''
  var cc = new init
  cc.test.unreg()
  cc.app.compose(function(){
    t.ok(cc.test.ctor.register === null, 'unregister')
  })
}

exports.reg3 = function(t) {
  document.getElementById('app').innerHTML = ''
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