var test = require('tape')

var keet = require('../')

var helloTest = require('./fixtures/hello')
var closureTest = require('./fixtures/closure')
var traversalBaseTest = require('./fixtures/traversal')
var inputBindingTest = require('./fixtures/inputBinding')
var customDataTest = require('./fixtures/kData')
var classChangeTest = require('./fixtures/classChange')

var log = console.log.bind(console)

function genVDOM() {
  if (!document) throw 'not a document object model'
  var vDom = document.createElement('div')
  vDom.setAttribute('id', 'app')
  document.body.appendChild(vDom)
}

function clearVDOM() {
  if (!document) throw 'not a document object model'
  document.getElementById('app').innerHTML = ''
}

test('Keet.js', function(t) {

  genVDOM()

  t.plan(6)

  ///////////

  helloTest(t)

  clearVDOM()

  closureTest(t)

  clearVDOM()

  traversalBaseTest(t)

  clearVDOM()

  inputBindingTest(t)

  clearVDOM()

  customDataTest(t)

  clearVDOM()

  classChangeTest(t)

})