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

module.exports = function(t) {
  var c = new init(function(el){
    var v = el.childNodes
    t.ok(v.length === 3 && v[1].firstChild.nodeValue === 'this view 11', 'array with callback')
  })
  c.app.compose(function() {
    c.arr.assign(1, {view: 11, text:'this view 11'})
  })
}