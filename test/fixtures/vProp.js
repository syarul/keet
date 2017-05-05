var Keet = require('../../')

var init = function() {
  var ctx = this
  var keet = function() {
    return new Keet(ctx)
  }

  this.app = keet().link('app', '{{state}}')
  this.state = keet().template('div')
    .set('value', 'set vProp')
}

module.exports = function(t) {
  var closed = new init
  closed.app.compose(true, function(c) {
    t.ok(c.childNodes[0].firstChild.nodeValue === 'set vProp', 'setter')
  })
}