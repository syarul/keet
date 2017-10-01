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
    .watch(null, function(el){
      console.log(el)
      // t.ok(true, 'awww')
    })

  // this.app.compose()
}

// module.exports = function(t) {

  var res = null

  var c = new init

  // closed.app.compose(true)

  // log(c)

  c.app.compose(true, function(el) {
    var c11 = {
      view: 11, 
      text:'this view 11 has changed'
    }
    // log(c.arr)
    c.arr.splice(2, 0, c11, c11)
    // c.arr.splice(2)
    // var vv = document.getElementById('viewList')
    // res = vv.childNodes.length
    // console.log(closed.arr)
    // console.log('v.childNodes.length '+res)
    // console.log(closed.arr)
    // setTimeout(function(){
      // var v = document.getElementById('viewList')
      // console.log('v.childNodes.value '+v.childNodes[].firstChild.nodeValue)
      // console.log('v.childNodes.length '+v.childNodes.length)
    // }, 100)
    // t.ok(true, 'aw')
  })

// }