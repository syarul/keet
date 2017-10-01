var Keet = require('../../')
var cat = require('../../cat')

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
      value: cat(
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
  var c = new init
  c.app.compose(function() {

    c.state.compose(function() {
      var v = document.getElementById('dod')
      v.click()
      t.ok(c.status === 'later', 'dom traversal, onclick event')
    })

  })
}