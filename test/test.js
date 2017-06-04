var test = require('tape')
var fixtures = require('./fixtures')

test('Keet.js', function(t) {

  if (!document) throw 'not a document object model'
  var vDom = document.createElement('div')
  vDom.setAttribute('id', 'app')
  document.body.appendChild(vDom)

  var vDom2 = document.createElement('div')
  vDom2.setAttribute('id', 'app2')
  document.body.appendChild(vDom2)

  var plan = 0

  for(var key in fixtures){
    if(typeof fixtures[key] === 'object'){
      plan += Object.keys(fixtures[key]).length
    } else {
      plan += 1
    }
  }

  t.plan(plan)

  for(var key in fixtures){
    var fixture = fixtures[key]
    if(typeof fixture === 'function'){
      fixture(t)
    } else {
      for(var iKey in fixture){
        var innerFixture = fixture[iKey]
        innerFixture(t)
      }
    }
  }
})