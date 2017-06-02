var Keet = require('../../')
var log = console.log.bind(console)

var init = function(cb) {
  var ctx = this
  var keet = function(tag) {
    return new Keet(ctx)
  }

  var fn = function() {
    cb(1234567890)
  }

  this.app = keet().link('app', '{{test}}')
  this.test = keet().template('div', 'testTag')
    .set('initial')
    .vDomLoaded(fn)

}

exports.vdomloaded = function(t) {
  document.getElementById('app').innerHTML = ''
  var cc = new init(function(n){
    t.ok(n = 1234567890, 'vdom loaded event')
  })
  cc.app.compose()
}