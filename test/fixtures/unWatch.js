var Keet = require('../../')
var log = console.log.bind(console)

var init = function() {
  var ctx = this
  var keet = function() {
    return new Keet(ctx)
  }

  var updateState = function(index, oldVal, newVal){
    ctx.state.set(newVal)
  }

  this.obj = {
    watched: 'initial'
  }
  this.app = keet().link('app', '{{state}}')
  this.state = keet()
  	.template('div', 'State')
  	.set(this.obj.watched)
    .watch(this.obj, updateState)
}

var init2 = function() {
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

exports.unWatchObj = function(t) {
  var c = new init
  c.app.compose(true, function(){
    c.obj.watched = 'after'
    var v = document.getElementById('State')
    var f = v.firstChild.nodeValue
    c.state.unWatch(c.obj)
    c.obj.watched = 'later'
    t.ok(f === v.firstChild.nodeValue, 'unwatch object')
  })

}

exports.unWatchArray = function(t) {
  var c = new init2
  c.app.compose(true, function() {
    c.state.unWatch()
    c.arr.push({view: 3, text:'this view 3'})
    c.arr.pop()
    c.arr.shift()
    c.arr.unshift({view: 9, text:'this view 9'})
    c.arr.slice(1, 2)
    c.arr.splice(0)
    var v = document.getElementById('viewList')
    t.ok(v.childNodes.length === 3 && v.childNodes[0].firstChild.nodeValue === 'this view 0', 'unwatch array')
  })
}