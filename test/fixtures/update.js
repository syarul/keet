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

exports.update1 = function(t) {
  var c = new init
  c.app.compose(function() {
    c.state.update(1, {view: 7, text:'this view 7'})
    var v = document.getElementById('viewList')
    t.ok(v.childNodes[1].firstChild.nodeValue === 'this view 7', 'update')
  })
}

exports.updateFn = function(t) {
  var c = new init
  c.app.compose(function() {
    c.state.update(1, {view: 7, text:'this view 7'}, function(res){
      return res.map(function(f, i){
        f.text = 'this view has changed '+ i
        return f
      })
    })
    var v = document.getElementById('viewList')
    t.ok(v.childNodes[1].firstChild.nodeValue === 'this view has changed 1', 'update with function')
  })
}