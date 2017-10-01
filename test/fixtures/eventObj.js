var Keet = require('../../')
var log = console.log.bind(console)

var init = function(cb) {
	
	var keet = () => new Keet(this)

	this.completeAll = function(){
		cb(true)
	}

	this.base = {
		'attr-type': 'checkbox',
		'attr-k-click': 'completeAll()',
		'el-click': false
	}

	this.app = keet().link('app', '{{test}}')

	this.test = keet().template('input', 'test-check')
	.watchDistict(this.base, 'click me!')
	
	this.app.compose()
}

module.exports = function(t) {
  var c = new init(function(e){
  	t.ok(e, 'event click with object')
  })
  c.app.compose(function(){
    c.base['el-click'] = true
  })
}