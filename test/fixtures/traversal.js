var Keet = require('../../')
var util = require('../util')
var log = console.log.bind(console)

var init = function() {

  var ctx = this

  var keet = function() {
    return new Keet(ctx)
  }

  this.status = 'initial'

  this.handleClick = function(ev, i) {
    ctx.status = i
  }

  this.app = keet().link('app', '{{state}}')

  this.state = keet()
    .template('div', 'traversalContainer')
    .set({
      value: util.cat(
        '<div>',
          'aaaa',
          '<span>',
            'bbbb',
            '<p id="dod" k-click="handleClick({{val}})">cccc</p>',
          '</span>',
        '</div>'
      ),
      'k-data': {
        val: 'later'
      }
    })
}

module.exports = function(t) {

  var trv = new init

  trv.app.compose(true, function(c) {

    trv.state.compose(true, function(el) {
      var v = document.getElementById('dod')
      v.click()
      if (trv.status === 'later')
        t.ok(true, 'dom traversal, onclick event')
      else
        t.ok(false, 'dom traversal, onclick event')

    })

  })
}