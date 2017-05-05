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

  var res = null

  var closed = new init(function(){
    console.log('res'+res)
    t.ok(true/*res === 'this view 1 has changed'*/, 'array splice without count')
  })

  closed.app.compose(true, function(c) {
    var v = document.getElementById('viewList')
    closed.arr.splice(1, 0)
    res = v.childNodes.length
    // console.log(closed.arr)
    console.log('v.childNodes.length '+res)
    // console.log('v.childNodes.value '+v.childNodes[0].firstChild.nodeValue)
    t.ok(true, 'aw')
  })
}