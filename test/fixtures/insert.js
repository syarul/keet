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

exports.insert1 = function(t) {

  var res = null

  var c = new init(function(){
    t.ok(res === 'this view 3', 'insert')
  })

  c.app.compose(true, function() {
    c.arr.push({view: 3, text:'this view 3'})
    var v = document.getElementById('viewList')
    res = v.childNodes[3].firstChild.nodeValue
  })
}

// exports.insertFn = function(t) {

//   var res = null

//   var c = new init/*(function(){
//     t.ok(res === 'this view has changed 3', 'insert with function')
//   })*/

//   c.app.compose(true, function() {
//     c.arr.push({view: 5, text:'this view 5'}, function(res){
//       return res.map(function(f){
//         f.view = i 
//         f.text = 'this view has changed '+i
//         return f
//       })
//     })
//     var v = document.getElementById('viewList')
//     res = v.childNodes[3].firstChild.nodeValue
//     log(res)
//     t.ok(res === 'this view has changed 3', 'insert with function')
//   })
// }