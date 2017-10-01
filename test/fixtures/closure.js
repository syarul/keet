var Keet = require('../../')

var init = function() {
  var ctx = this
  var keet = function() {
    return new Keet(ctx)
  }

  this.app = keet().link('app', '{{state}}')
  this.state = keet().template('div').set('a view constructed in a closure')
}

module.exports = function(t) {
  var closed = new init
  closed.app.compose(function(c) {
    t.ok(c.childNodes[0].firstChild.nodeValue === 'a view constructed in a closure', 'closure')
  })
}