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
  var res = null
  var c = new init
  c.app.compose(function() {
    c.state.splice(function(arr){
      arr = arr.map(function(f, i){
        var n = {}
        n.view = i + 10
        n.text = 'this view '+( i + 10)
        return n
      })
      return arr
    }, 1, 1)
    var v = document.getElementById('viewList')
    res = v.childNodes[1].firstChild.nodeValue
    t.ok(res === 'this view 11', 'splice with function')
  })
}