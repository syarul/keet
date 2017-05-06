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
    .watch()
}

exports.spliceSingle = function(t) {
  var c = new init
  c.app.compose(true, function(el) {
    c.arr.splice(1)
    var v = document.getElementById('viewList')
    t.ok(v.childNodes.length === 1, 'splice without count without elements addition')
  })
}

exports.spliceNoAdd = function(t) {
  var c = new init
  c.app.compose(true, function(el) {
    c.arr.splice(2, 0)
    var v = document.getElementById('viewList')
    t.ok(v.childNodes.length === 3, 'splice with count 0 without elements addition')
  })
}

exports.spliceAdd = function(t) {
  var c = new init
  c.app.compose(true, function(el) {
    var add = {
      view: 11, 
      text:'this view 11 has changed'
    }
    c.arr.splice(1, 0, add, add)
    var v = document.getElementById('viewList')
    t.ok(v.childNodes.length === 5 && v.childNodes[1].firstChild.nodeValue === 'this view 11 has changed', 'splice with count 0 with elements addition')
  })
}