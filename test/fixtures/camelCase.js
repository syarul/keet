var Keet = require('../../')
var log = console.log.bind(console)

var init = function(cb) {
  var ctx = this
  var keet = function() {
    return new Keet(ctx)
  }

  this.app = keet().link('app', '{{state}}')
  this.state = keet()
  	.template('div', 'viewState')
  	.set({
  		value: 'abcd',
  		'css-background-color': 'red'
  	})
}

module.exports = function(t) {
  var c = new init
  c.app.compose(function() {
    var v = document.getElementById('viewState')
    t.ok(v.style.backgroundColor === 'red', 'camelCase')
  })
}