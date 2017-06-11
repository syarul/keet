var Keet = require('../../')

var init = function() {
  var ctx = this
  var keet = function(tag) {
    return tag ? new Keet(tag, ctx) : new Keet(ctx)
  }

  this.app = keet().link('app', '{{state}}{{next}}')
  this.state = keet('div').set('test')
  this.next = keet().template('span', 'nextState').set('test next')
}

module.exports = function(t) {
  var c = new init
  c.app.compose(function() {
    c.state.link('nextState', 'new')
    t.ok(c.state.ctor.tmpl[3] === 'nextState', 'link')
  })
}