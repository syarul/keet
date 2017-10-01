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
    .array(this.arr, '<span><input type="checkbox" class="toggler"></input>{{text}}</span>')
    .set({
      'css-display': 'table-footer-group'
    })
}

exports.eventedArray1 = function(t) {
  var c = new init
  c.app.compose(function(){
    c.state.evented(0, 'class', 'toggler', {click: true})
    var el = document.getElementById('viewList')
    var v = el.childNodes[0]
    var vv = v.querySelector('[class="toggler"]')
    t.ok(vv.checked, 'evented array properties: clicked')
  })
}

exports.eventedArray2 = function(t) {
  var c = new init
  c.app.compose(function(){
    c.state.evented(0, 'class', 'toggler', {checked: true})
    var el = document.getElementById('viewList')
    var v = el.childNodes[0]
    var vv = v.querySelector('[class="toggler"]')
    t.ok(vv.checked, 'evented array properties: checked')
  })
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
    .array(this.arr, '<span><input type="text" class="toggler"></input>{{text}}</span>')
    .set({
      'css-display': 'table-footer-group'
    })
}

exports.eventedArray3 = function(t) {
  var c = new init2
  c.app.compose(function(){
    c.state.evented(0, 'class', 'toggler', {value: 'some'})
    var el = document.getElementById('viewList')
    var v = el.childNodes[0]
    var vv = v.querySelector('[class="toggler"]')
    t.ok(vv.value === 'some', 'evented array properties: value assignment')
  })
}