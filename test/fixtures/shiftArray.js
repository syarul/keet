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
    {view: 2, text:'this view 2'},
    {view: 3, text:'this view 3'},
    {view: 4, text:'this view 4'}
  ]

  this.app = keet().link('app', '{{state}}')
  this.state = keet().template('ul', 'viewList')
    .array(this.arr, '<li>{{text}}</li>')
    .watch(null, cb)
}

exports.shift = function(t) {
  document.getElementById('app').innerHTML = ''
  var res = null
  var c = new init(function(){
    t.ok(res === 'this view 1', 'shift')
  })

  c.app.compose(true, function() {
    c.arr.shift()
    var v = document.getElementById('viewList')
    res = v.childNodes[0].firstChild.nodeValue
  })
}

exports.pop = function(t) {
  document.getElementById('app').innerHTML = ''
  var res = null
  var c = new init(function(){
    t.ok(res === 'this view 3', 'pop')
  })

  c.app.compose(true, function() {
    c.arr.pop()
    var v = document.getElementById('viewList')
    res = v.childNodes[v.childNodes.length - 1].firstChild.nodeValue
  })
}