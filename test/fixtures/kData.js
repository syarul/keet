var Keet = require('../../')

var init = function(cb) {

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

    cb()
  }, 0)
}

module.exports = function(t) {
  new init(function(){
    var v = document.getElementById('app')
    t.ok(v.firstChild.nodeValue === 'My name is Doloro Sit Amet', 'custom data')
  })
}