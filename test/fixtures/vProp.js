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
  var c = new init
  c.app.compose(function(e) {
    t.ok(e.childNodes[0].firstChild.nodeValue === 'set vProp', 'setter')
  })
}