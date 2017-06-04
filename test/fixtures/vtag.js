var Keet = require('../../')
var log = console.log.bind(console)

var init = function() {
  var ctx = this
  var keet = function(tag) {
    return new Keet(ctx)
  }

  this.app = keet().link('app2', '{{test}}')
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

  this.app = keet().link('app2', '{{test}}')
  this.test = keet().template('div', 'testTag')
    .set('initial')
    .vDomLoaded(fn)

}

exports.vtag1 = function(t) {
  document.getElementById('app').innerHTML = ''
  var cx = new init
  cx.app.compose(function() { 
      var v = document.getElementById('testTag')
      t.ok(v.firstChild.nodeValue === 'initial', 'compose not force')
  })

}

exports.vdomloaded = function(t) {
  document.getElementById('app2').innerHTML = ''
  var ccx = new init2(function(n){
    t.ok(n = 1234567890, 'vdom loaded event')
  })
  ccx.app.compose()
}