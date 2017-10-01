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

exports.spliceCountNoAdd = function(t) {
  var c = new init(function(el){
    t.ok(el.childNodes[1].firstChild.nodeValue === 'this view 2', 'splice with count without elements addition')
  })
  c.app.compose(function() {
    c.arr.splice(1, 1)
  })
}

exports.spliceCountWithAdd = function(t) {
  var c = new init(function(el){
    t.ok(el.childNodes[1].firstChild.nodeValue === 'this view 11 has changed', 'splice with count with elements addition')
  })
  var add = {
      view: 11, 
      text:'this view 11 has changed'
    }
  c.app.compose(function() {
    c.arr.splice(1, 1, add)
  })
}