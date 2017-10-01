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

module.exports = function(t) {
  var c = new init
  c.app.compose(function() {
    function cell(idx){
      return {
        view: idx, 
        text:'this view '+idx
      }
    }
    c.state.unshift(function(arr){
      return arr.map(function(f, i){
        f.text = 'this view changed ' + i
        return f
      })
    }, cell(3), cell(4), cell(5))
    var v = document.getElementById('viewList')
    t.ok(v.childNodes[2].firstChild.nodeValue === 'this view changed 2' && v.childNodes[5].firstChild.nodeValue === 'this view changed 5', 'unshift with function')
  })
}