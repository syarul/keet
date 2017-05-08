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
    .watch(null, cb)
}

exports.sliceArgv0 = function(t) {

  var res = null

  var c = new init(function(){
    t.ok(res === 'this view 2', 'slice with arg 0')
  })

  c.app.compose(true, function() {
    c.arr.slice(0)
    var v = document.getElementById('viewList')
    res = v.childNodes[2].firstChild.nodeValue
  })
}

exports.sliceArgv1 = function(t) {

  var res = null

  var c = new init(function(){
    t.ok(res === 'this view 1', 'slice with arg 1')
  })

  c.app.compose(true, function() {
    c.arr.slice(1)
    var v = document.getElementById('viewList')
    res = v.childNodes[0].firstChild.nodeValue
  })
}

exports.sliceArgv2 = function(t) {

  var res = {}

  var c = new init(function(){
    t.ok(res.node === 'this view 1' && res.len === 1, 'slice with 2 args')
  })

  c.app.compose(true, function() {
    c.arr.slice(1, 2)
    var v = document.getElementById('viewList')
    res.node = v.childNodes[0].firstChild.nodeValue
    res.len = v.childNodes.length
  })
}