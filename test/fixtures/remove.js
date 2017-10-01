var Keet = require('../../')
var log = console.log.bind(console)

var init = function(cb) {
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

exports.rem1 = function(t) {
  var c = new init
  c.app.compose(function() {
    c.state.remove(0)
    var v = document.getElementById('viewList')
    var res = v.childNodes[0].firstChild.nodeValue
    t.ok(res === 'this view 1' && v.childNodes.length === 2, 'remove by index')
  })
}

exports.rem2 = function(t) {
  var c = new init
  c.app.compose(function() {
    c.state.remove({text: 'this view 1'})
    var v = document.getElementById('viewList')
    var res = v.childNodes[1].firstChild.nodeValue
    t.ok(res === 'this view 2' && v.childNodes.length === 2, 'remove by property')
  })
}

exports.rem3 = function(t) {
  var c = new init
  c.app.compose(function() {
    c.state.remove(0, function(res){
      return res.map(function(f, i){
        f.text = 'this view has changed '+ i
        return f
      })
    })
    var v = document.getElementById('viewList')
    var res = v.childNodes[0].firstChild.nodeValue
    t.ok(res === 'this view has changed 0' && v.childNodes.length === 2, 'remove modify by function')
  })
}