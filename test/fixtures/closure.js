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

  closed.app.compose(true, function(c) {
    if (c.hasChildNodes() && c.childNodes[0].nodeType === 1) {
      var ctext = 'a view constructed in a closure'
      t.ok(c.childNodes[0].firstChild.nodeValue === ctext, 'closure')
    } else {
      t.ok(false, 'closure')
    }
  })
}