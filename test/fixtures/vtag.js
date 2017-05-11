var Keet = require('../../')
var log = console.log.bind(console)

var init = function() {
  document.getElementById('app').innerHTML = ''
  var ctx = this
  var keet = function(tag) {
    return new Keet(ctx)
  }

  this.app = keet().link('app', '{{test}}')
  this.test = keet().template('div', 'testTag')
    .set('initial')

}

var init2 = function(cb) {
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

exports.vtag1 = function(t) {
  var c = new init
  c.app.compose(function() { 
      var v = document.getElementById('testTag')
      t.ok(v.firstChild.nodeValue === 'initial', 'compose not force')
  })
}

exports.vdomloaded = function(t) {
  var cc = new init2(function(n){
    t.ok(n = 1234567890, 'vdom loaded event')
  })
  cc.app.compose()
}