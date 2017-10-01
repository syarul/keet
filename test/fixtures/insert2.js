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
    var v = document.getElementById('viewList')
    c.state.insert({view: 5, text:'this view 5'}, function(res){
      return res.map(function(f, i){
        f.view = i 
        f.text = 'this view has changed '+i
        return f
      })
    })
    res = v.childNodes[3].firstChild.nodeValue
    t.ok(res === 'this view has changed 3', 'insert with function')
  })
}