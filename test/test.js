var test = require('tape')
var fixtures = require('./fixtures')

function clearVDOM() {
  if (!document) throw 'not a document object model'
  document.getElementById('app').innerHTML = ''
}


// var a = [1,2,3]

// a.splice(0)

// console.log(a)

test('Keet.js', function(t) {

  if (!document) throw 'not a document object model'
  var vDom = document.createElement('div')
  vDom.setAttribute('id', 'app')
  document.body.appendChild(vDom)

  var plan = 0

  for(var key in fixtures){
    if(typeof fixtures[key] === 'object'){
      plan += Object.keys(fixtures[key]).length
    } else {
      plan += 1
    }
  }

  // console.log(plan, Object.keys(fixtures).length)

  t.plan(plan)

  for(var key in fixtures){
    var fixture = fixtures[key]
    if(typeof fixture === 'function'){
      console.log(key)
      fixture(t)
      clearVDOM()
    } else {
      for(var iKey in fixture){
        var innerFixture = fixture[iKey]
        innerFixture(t)
        clearVDOM()
      }
    }
  }
})