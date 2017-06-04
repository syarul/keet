var Keet = require('../../')
var log = console.log.bind(console)

var init = function() {
  var ctx = this
  var keet = function() {
    return new Keet(ctx)
  }

  this.app = keet().link('app', '')
}

exports.noValue = function(t) {
  var c = new init
  var v = document.getElementById('app')
  t.ok(!v.firstChild, 'no value')
}

var init2 = function() {
  var ctx = this
  var keet = function(tag) {
    return tag ? new Keet(tag, ctx) : new Keet(ctx)
  }

  this.app = keet().link('app', '{{state}}')
  this.state = keet('span').set('initial')
}

exports.tag = function(t) {
  document.getElementById('app').innerHTML = ''
  var c = new init2
  c.app.compose(true, function() {
    var v = document.querySelector('span')
    t.ok(v.getAttribute('k-link') === c.state.ctor.uid, 'k-link attribute')
  })
}

var init3 = function() {
  document.getElementById('app').innerHTML = ''
  var ctx = this
  var keet = function() {
    return new Keet(ctx)
  }

  this.app = keet().link('app', '{{state}}')
  this.state = keet().template('span', 'someState')
    .preserveAttributes()
    .set({
      value: 'initial',
      'attr-some': 'someAttr',
      'attr-background-color': 'red'
    })
}

exports.attr = function(t) {
  document.getElementById('app').innerHTML = ''
  var cc = new init3
  cc.app.compose(true, function() {
    var v = document.querySelector('span')
    t.ok(v.getAttribute('some') === 'someAttr', 'custom attribute')
  })
}