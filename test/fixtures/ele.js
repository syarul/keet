var Keet = require('../../')
var log = console.log.bind(console)

var init = function() {
  var ctx = this
  var keet = function() {
    return new Keet(ctx)
  }

  var v = {
	'checked': true
  }

  this.app = keet().link('app', '{{state}}')
  this.state = keet().template('input', 'test-check')
	.set({
		'attr-type': 'checkbox',
		'el-checked': true
	})
	
}

var init2 = function() {
  var ctx = this
  var keet = function() {
    return new Keet(ctx)
  }

  this.app = keet().link('app', '{{state}}')
  this.state = keet().template('div', 'test-clean')
	.set('somestring')
	
}

exports.ele = function(t) {
  var c = new init
  c.app.compose(function() {
    c.state.set({'el-checked': false })
    var v = document.getElementById('test-check')
    t.ok(!v.checked, 'checkbox check')
  })
}

exports.empty = function(t) {
  var c = new init2
  c.app.compose(function() {
    c.state.set('')
    var v = document.getElementById('test-clean')
    t.ok(v.nodeValue === null, 'empty field')
  })
}