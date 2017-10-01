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
    t.ok(el.childNodes.length === 6 && el.childNodes[2].firstChild.nodeValue === 'this view 5', 'unshift')
  })
  c.app.compose(function() {
    function cell(idx){
      return {
        view: idx, 
        text:'this view '+idx
      }
    }
    c.arr.unshift(cell(3), cell(4), cell(5))
  })
}