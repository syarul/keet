var Keet = require('../../')
var util = require('../util')
var log = console.log.bind(console)

var init = function() {

  var ctx = this

  var keet = function() {
    return new Keet(ctx)
  }

  this.app = keet().link('app')
    .set({
      value:'{{who}} {{me}}',
      'k-data': {
        who: 'My name is'
      },
      'css-display': 'inline-flex'
    })

  this.me = keet().register('app', true, function(ele){
    ele.style.width = 'auto'
    ele.style.margin = '0 0 0 0'
  }).set({
    value: '{{just}} {{my}} {{name}}',
    'k-data': {
      just: 'Shahrul',
      my: 'Nizam',
      name: 'Selamat'
    }
  })

  setTimeout(function() {
    ctx.me.set({
      'k-data': {
        just: 'Doloro',
        my: 'Sit',
        name: 'Amet'
      }
    })
  }, 1000)
}

module.exports = function(t) {

  new init

  setTimeout(function(){
    var v = document.getElementById('app')
    t.ok(v.firstChild.nodeValue === 'My name is Doloro Sit Amet', 'custom data')
  }, 1100)
}