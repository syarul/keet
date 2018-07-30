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

  var cb = function(err, done) {
    assert.equal(err instanceof Error, true)
    done()
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

  it('mount not string', function () {
    try {
      require('../examples/err_mount_non_string')
    } catch (err) {
      assert.equal(err instanceof Error, true)
    }
  })

  it('flush', function () {
    require('../examples/flush')
    const app = getId('app')
    assert.equal(app.innerHTML, '')
  })

  it('componentWillMount', function () {
    const app = require('../examples/link').default
    assert.equal(app.isWillMount, true)
    clear()
  })

  it('componentDidMount', function () {
    const app = require('../examples/componentDidMount').default
    assert.equal(app.isMounted, true)
    clear()
  })

  it('failed link', function () {
    try {
      require('../examples/err_link_no_parameter')
    } catch (err) {
      assert.equal(err instanceof Error, true)
    }
  })

  it('render sub-component', function () {
    require('../examples/sub-component')
    assert.equal(getId('sub').innerHTML, 'this is a sub-component')
    clear()
  })

  it('sub-component event handling', function () {
    require('../examples/sub-component_with_event')
    // batch pool has started since
    assert.equal(getId('sub-button').innerHTML, 'value: bar')
    clear()
  })

  it('sub-component not assigned', function (next) {
    require('../examples/sub-component_err_not_assigned')
    // batch pool has initated, so we have to check outside of the event loop
    setTimeout(() => {
      assert.equal(getId('container').innerHTML, '{{component:subc}}')
      clear()
      next()
    })
  })

  it('cluster function', function () {
    const { a, b } = require('../examples/cluster')
    assert.equal(a + b, 3)
    clear()
  })

  it('event click', function (next) {
    require('../examples/counter')
    const counter = getId('counter')
    // batch pool has initated, so we have to check outside of the event loop
    setTimeout(() => {
      assert.equal(counter.innerHTML, '1')
      clear()
      next()
    })
  })

  it('batch-pool 1 million updates', function (next) {
    require('../examples/batch-pool')
    // batch pool has initated, so we have to check outside of the event loop
    setTimeout(() => {
      assert.equal(getId('container').innerHTML, '1')
      clear()
      next()
    })
  })

})
