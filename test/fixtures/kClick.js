var Keet = require('../../')
var log = console.log.bind(console)

var init = function(cb) {
  var ctx = this
  var keet = function() {
    return new Keet(ctx)
  }

  this.ev = function(evt, idx) {
    cb(idx)
  }

  this.app = keet().link('app', '{{state}}')

  this.state = keet().template('div').set('<button id="clickMe" k-click="ev(1)">CLICK ME!</button>')
}

var init2 = function(cb) {
  var ctx = this
  var keet = function() {
    return new Keet(ctx)
  }

  this.ev = function(evt, idx) {
    cb(idx)
  }

  this.app = keet().link('app', '{{state}}')

  this.state = keet().template('div').set('<button id="clickMe" k-click="ev()">CLICK ME!</button>')
}

exports.kclick1 = function(t) {
  var c = new init(function(r){
    t.ok(r === '1', 'k-click event with argument')
  })
  c.app.compose(function(c) {
      var v = document.getElementById('clickMe')
      v.click()
  })
}

exports.kclick2 = function(t) {
  var c = new init2(function(r){
    t.ok(r === '', 'k-click event without arguments')
  })
  c.app.compose(function(c) {
      var v = document.getElementById('clickMe')
      v.click()
  })
}

exports.kClickGlob1 = function(t) {
  ev = function(evt, r){
    t.ok(r === '1', 'k-click event with argument [global]')
  }

  app = new Keet
  app.link('app', '{{state}}')

  state = new Keet
  state.template('div').set('<button id="clickMe" k-click="ev(1)">CLICK ME!</button>')

  app.compose(function(c) {
      var v = document.getElementById('clickMe')
      v.click()
  })
}