var Keet = require('../../')
var log = console.log.bind(console)

var init = function() {
  var ctx = this
  var keet = function() {
    return new Keet(ctx)
  }

  this.arr = [
    {view: 0, text:'this view 0'},
    {view: 1, text:'this view 1'},
    {view: 2, text:'this view 2'}
  ]

  this.app = keet().link('app', '{{state}}')
  this.state = keet().template('ul', 'viewList')
    .array(this.arr, '<li>{{text}}</li>')
}

module.exports = function(t) {
  var c = new init
  c.app.compose(true, function() {
    var v = document.getElementById('viewList')
    c.state.slice(function(res){
      return res.map(function(f){
        f.text = 'this view has changed'
        return f
      })
    }, 1, 2)
    t.ok(v.childNodes[0].firstChild.nodeValue=== 'this view has changed', 'slice with function')
  })
}