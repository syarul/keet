var Keet = require('../../')

var init = function() {
  var ctx = this
  var keet = function() {
    return new Keet(ctx)
  }

  this.app = keet().link('app', '{{container}}')

  this.container = keet().template('span', 'con').set({
      value: '{{inner}}',
      'attr-class': 'initial'
    })

  var count = 0

  this.doMe = function() {
    count++
    if(count % 2 === 0)
      ctx.container.set('attr-class', 'modulo')
    else
      ctx.container.set('attr-class', 'after')
  }

  this.inner = keet().template('div').set('<button id="clickMe">CLICK ME!</button>')
}

exports.addListener = function(t) {
  var closed = new init
  closed.app.compose(function(c) {
    closed.container.compose(function(){

      closed.container.bindListener('clickMe', closed.doMe, 'click')

      var v = document.getElementById('clickMe').click()

      var r = document.getElementById('con').classList.contains('after')

      t.ok(r, 'bind listener')

    })
  })
}

exports.removeListener = function(t) {
  var closed = new init
  closed.app.compose(function(c) {
    closed.container.compose(function(){

      closed.container.bindListener('clickMe', closed.doMe, 'click')

      var v = document.getElementById('clickMe')

      v.click()

      var r = document.getElementById('con')

      if(r.classList.contains('after')){
        closed.container.removeListener('clickMe', 'click')
        v.click()
        t.ok(!r.classList.contains('modulo'), 'remove listener')
      }


    })
  })
}

exports.extraListener = function(t) {
  var closed = new init
  closed.app.compose(function(c) {
    closed.container.compose(function(){

      closed.container.bindListener('clickMe', closed.doMe, 'click')

      var v = document.getElementById('clickMe')

      v.click()

      var r = document.getElementById('con')

      if(r.classList.contains('after')){

        v.click()
        t.ok(r.classList.contains('modulo'), 'extra listener test')
      }


    })
  })
}