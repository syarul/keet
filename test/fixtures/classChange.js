var Keet = require('../../')

var init = function(cb) {
  var ctx = this
  var keet = function() {
    return new Keet(ctx)
  }

  this.app = keet().link('app', '{{state}}')
  this.state = keet()
  	.template('div', 'State')
  	.set({
  		value: 'state',
  		'attr-class': 'just-a-class'
  	})

  this.app.compose(function(){
  	ctx.state.set('attr-class', 'set-to-new-class')
  	cb()
  })
}

module.exports = function(t) {
  var closed = new init(function(){
  	var e = document.getElementById('State')
  	t.ok(e.getAttribute('class') === 'set-to-new-class', 'attribute change')
  })
}