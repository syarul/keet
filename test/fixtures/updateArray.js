var Keet = require('../../')
var log = console.log.bind(console)

var init = function() {
  var ctx = this
  var keet = function() {
    return new Keet(ctx)
  }

  this.arr = [
    {
      view: 0,
      vstate: 'some',
      text: 'this view 0'
    }, {
      view: 1,
      vstate: 'dosome',
      text: 'this view 1'
    }
  ]

  this.app = keet().link('app', '{{state}}')
  this.state = keet().template('ul', 'viewList')
    .array(this.arr, '<li vstate="{{vstate}}">{{text}}</li>')
}

module.exports = function(t) {
  var res = null, res2 = null
  var c = new init
  c.app.compose(function() {
    c.state.update(0, {
      view: 22,
      vstate: 'another',
      text: 'this view 22'
    })
    var v = document.getElementById('viewList')
    res = v.childNodes[0].firstChild.nodeValue
    res2 = v.childNodes[0].getAttribute('vstate')

    t.ok(res === 'this view 22' && res2 === 'another', 'node update')
  })
}