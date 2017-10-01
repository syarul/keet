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
  var c = new init(function(el){
    t.ok(el.childNodes[2].firstChild.nodeValue === 'this view 2', 'slice with arg 0')
  })
  c.app.compose(true, function() {
    c.arr.slice(0)
  })
}

exports.sliceArgv1 = function(t) {
  var c = new init(function(el){
    t.ok(el.childNodes[0].firstChild.nodeValue === 'this view 1', 'slice with arg 1')
  })
  c.app.compose(true, function() {
    c.arr.slice(1)
  })
}

exports.sliceArgv2 = function(t) {
  var c = new init(function(el){
    t.ok(el.childNodes[0].firstChild.nodeValue === 'this view 1' && el.childNodes.length === 1, 'slice with 2 args')
  })
  c.app.compose(true, function() {
    c.arr.slice(1, 2)
  })
}