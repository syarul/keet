var Keet = require('../../')
var log = console.log.bind(console)

module.exports = function(t) {
  document.getElementById('app').innerHTML = ''
  ev2 = function(evt, r) {
    t.ok(r === '', 'k-click event without argument [global]')
  }

  app2 = new Keet
  app2.link('app', '{{state2}}')

  state2 = new Keet
  state2.template('div').set('<button id="clickMe2" k-click="ev2()">CLICK ME!</button>')

  app2.compose(function(c) {
    var v = document.getElementById('clickMe2')
    v.click()
  })
}