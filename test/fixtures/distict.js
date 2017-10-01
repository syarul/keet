var Keet = require('../../')
var log = console.log.bind(console)

var init = function(cb) {

  var ctx = this
  var keet = function() {
    return new Keet(ctx)
  }

  this.obj = {
    'attr-type': 'checkbox',
    'el-checked': false,
    'css-display': 'block'
  }

  this.app = keet().link('app', '{{test}}')

  this.test = keet().template('input', 'test-check')
    .watchDistict(this.obj)
}

module.exports = function(t) {
  var c = new init
  c.app.compose(function() {
    c.obj['el-checked'] = true
    var v = document.getElementById('test-check')
    t.ok(v.checked, 'watch distict object changed')
  })
}