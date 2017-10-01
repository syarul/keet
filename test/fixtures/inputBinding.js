var Keet = require('../../')

var init = function() {
  var ctx = this
  var keet = function() {
    return new Keet(ctx)
  }

  this.app = keet().link('app', '<h1>Keet: Input binding sample</h1>{{container}}')
  
  this.container = keet()
    .template('div', 'Container')
    .set({
      value: '<input type="text" id="Input"> {{change}}',
      'css-display': 'inline-flex'
    })

  this.change = keet()
    .template('p', 'Change')
    .set({
      'css-margin': '0 0 0 8px',
      value: 'before'
    })
}

module.exports = function(t) {
  var trv = new init
  trv.app.compose(function() {
    trv.container.compose(function() {
      trv.container.bindListener('Input', trv.change)

      var e = document.getElementById('Input')
      e.value = 'after'

      var event = new Event('input', {
        'bubbles': true,
        'cancelable': true
      })

      e.dispatchEvent(event)

      var c = document.getElementById('Change')
      t.ok(c.firstChild.nodeValue === 'after', 'input binding')

    })
  })
}