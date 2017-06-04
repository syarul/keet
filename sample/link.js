var init = function() {
  var ctx = this
  var keet = function(tag) {
    return tag ? new Keet(tag, ctx) : new Keet(ctx)
  }

  this.app = keet().link('app', '{{state}}{{next}}')
  this.state = keet('div').set('test')
  this.next = keet().template('span', 'nextState').set(' ,,,test next')

  this.app.compose(true, function(c) {
    closed.state.link('nextState', 'new')
  })
}


var closed = new init
