const assert = require('assert')
const { JSDOM } = require('jsdom')

const { getId } = require('../components/utils')

const fs = require('fs')

const pkg = fs.readFileSync('package.json', 'utf8')

const ver = JSON.parse(pkg).version

const describe = global.describe // standard
const it = global.it // standard
const before = global.before

let Event

describe(`keet.js v-${ver} test`, function () {
  before(() => {
    const dom = new JSDOM(`
      <!DOCTYPE html>
        <html>
        <meta http-equiv="content-type" content="text/html; charset=utf-8">
        <head>
        </head>
        <body>
          <div id="app"></div>
        </body>
      </html>`)

    global.document = dom.window.document

    const window = dom.window

    global.window = window
    Event = window.Event
    global.log = console.log.bind(console)
  })

  var clear = function () {
    document.getElementById('app').innerHTML = ''
  }

  it('has document', function () {
    var div = document.createElement('div')
    assert.equal(div.nodeName, 'DIV')
  })

  it('hello world', function () {
    require('../examples/hello')
    assert.equal(getId('app').innerHTML, 'Hello World')
    clear()
  })

  it('cluster function', function () {
    const { a, b } = require('../examples/cluster')
    assert.equal(a + b, 3)
    clear()
  })

  it('event click', function (next) {
    require('../examples/counter')
    const counter = getId('counter')
    setTimeout(() => { 
      assert.equal(counter.innerHTML, '1')
      clear()
      next()
    })
  })

})
