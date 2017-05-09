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
  var v = null
  var c = new init(function(el){
    t.ok(v === 3, 'array with callback')
  })
  c.app.compose(true, function() {
    c.arr[1] = {view: 11, text:'this view 11'}
    v = document.getElementById('viewList').childNodes.length
  })
}