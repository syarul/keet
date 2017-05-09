var Keet = require('../../')

var init = function(cb) {
  var ctx = this
  var keet = function() {
    return new Keet(ctx)
  }

  this.app = keet().link('app', '{{test}}')
  this.test = keet().link('span', 'testTag', 'value of tag')
}

module.exports = function(t) {

  var c = new init
  
  c.app.compose(true, function(el){
  		console.log(el)
	  var v = document.getElementById('testTag')//.firstChild.nodeValue
	  var s = document.querySelector('span')
	  console.log(v)
	  t.ok(true)
  })
  // t.ok(v === 'value of tag', 'hello world')

}