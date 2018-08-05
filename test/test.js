const assert = require('assert')
const { JSDOM } = require('jsdom')

const { serializeDocument } = require('jsdom/lib/old-api')

const { getId } = require('../utils')

const fs = require('fs')

const pkg = fs.readFileSync('package.json', 'utf8')

const ver = JSON.parse(pkg).version

const describe = global.describe // standard
const it = global.it // standard
const before = global.before

let Event
let XMLSerializer

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

    function XMLSerializer () {}

    XMLSerializer.prototype.serializeToString = function (node) {
      return serializeDocument(node)
    }

    global.XMLSerializer = XMLSerializer

    Event = window.Event
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

  it('no node found', function () {
    try {
      require('../examples/no_node_found_err')
    } catch(err){
      assert.equal(err instanceof Error, true)
    }
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

  // it('render sub-component', function () {
  //   require('../examples/sub-component')
  //   assert.equal(getId('sub').innerHTML, 'this is a sub-component')
  //   clear()
  // })

  // it('render sub multi component', function () {
  //   require('../examples/sub-multi-component')
  //   assert.equal(getId('container').innerHTML, '<div id="sub">this is a sub-component</div><div id="sub">this is a sub-component</div><div id="sub">this is a sub-component</div>')
  //   clear()
  // })

  // it('sub-component event handling', function () {
  //   require('../examples/sub-component_with_event')
  //   // batch pool has started since
  //   assert.equal(getId('sub-button').innerHTML, 'value: bar')
  //   clear()
  // })

  it('event not declared', function () {
    require('../examples/event_not_declared')
    // batch pool has started since
    assert.equal(getId('counter').innerHTML, '0')
    clear()
  })

  // it('sub-component not assigned', function (next) {
  //   require('../examples/sub-component_err_not_assigned')
  //   // batch pool has initiated, so we have to check outside of the event loop
  //   setTimeout(() => {
  //     assert.equal(getId('container').innerHTML, '{{component:subc}}')
  //     clear()
  //     next()
  //   })
  // })

  // it('sub-component async', function (next) {
  //   require('../examples/sub-component_async')
  //   // batch pool has initiated, so we have to check outside of the event loop
  //   setTimeout(() => {
  //     assert.equal(getId('container').innerHTML, '<div id="sub">this is a sub-component</div>')
  //     clear()
  //     next()
  //   }, 200)
  // })

  it('cluster function', function () {
    const { a, b } = require('../examples/cluster')
    assert.equal(a + b, 3)
    clear()
  })

  it('event click', function (next) {
    require('../examples/counter')
    const counter = getId('counter')
    // batch pool has initiated, so we have to check outside of the event loop
    setTimeout(() => {
      assert.equal(counter.innerHTML, '1')
      clear()
      next()
    })
  })

  it('batch-pool 1 million updates', function (next) {
    require('../examples/batch-pool')
    // batch pool has initiated, so we have to check outside of the event loop
    setTimeout(() => {
      assert.equal(getId('container').innerHTML, '1')
      clear()
      next()
    })
  })

  it('object notation', function (next) {
    require('../examples/object-literals')
    // batch pool has initiated, so we have to check outside of the event loop
    setTimeout(() => {
      assert.equal(getId('app').innerHTML, '<span>bar</span><span> state : keet</span><span> age : 12</span>')
      clear()
      next()
    })
  })

  it('multi state of the same name', function (next) {
    require('../examples/multi-state')
    // batch pool has initiated, so we have to check outside of the event loop
    setTimeout(() => {
      assert.equal(getId('app').innerHTML, 'I say: horray horray horray!')
      clear()
      next()
    })
  })

  it('multi state of the same name changed', function (next) {
    require('../examples/multi-state-diff')
    // batch pool has initiated, so we have to check outside of the event loop
    setTimeout(() => {
      assert.equal(getId('app').innerHTML, 'I say: horray horray horray horrayyy!')
      clear()
      next()
    })
  })

  it('model list', function (next) {
    require('../examples/model')
    // batch pool has initiated, so we have to check outside of the event loop
    setTimeout(() => {
      assert.equal(getId('list').innerHTML, '<li id="0">sleep<input type="checkbox" checked=""></li><li id="1">jog<input type="checkbox" checked=""></li><li id="2">walk<input type="checkbox"></li><li id="3">swim<input type="checkbox" checked=""></li>')
      clear()
      next()
    })
  })

  it('model not declared', function (next) {
    require('../examples/model_not_declared')
    // batch pool has initiated, so we have to check outside of the event loop
    setTimeout(() => {
      assert.equal(getId('list').innerHTML, '<li id="{{id}}">{{taskName}}<input type="checkbox"></li>')
      clear()
      next()
    })
  })

  it('model not in template literals', function (next) {
    require('../examples/model_not_in_template_literals')
    // batch pool has initiated, so we have to check outside of the event loop
    setTimeout(() => {
      assert.equal(getId('list').innerHTML, '<li id="{{id}}">{{taskName}}<input type="checkbox"></li>')
      clear()
      next()
    })
  })

  it('render html entities', function (next) {
    require('../examples/html-entities')
    // batch pool has initiated, so we have to check outside of the event loop
    setTimeout(() => {
      assert.equal(getId('app').innerHTML, 'Hello World')
      clear()
      next()
    })
  })

  it('render html entities with NodeType 1', function (next) {
    require('../examples/html-entities_nodeType_1')
    // batch pool has initiated, so we have to check outside of the event loop
    setTimeout(() => {
      assert.equal(getId('app').innerHTML, '<div>Hello World</div>')
      clear()
      next()
    })
  })

  it('failed mount unknown element', function () {
    try {
      require('../examples/html-entities_err_nodeType')
    } catch (err) {
      assert.equal(err instanceof Error, true)
    }
  })

  it('render conditional nodes', function (next) {
    require('../examples/conditional-nodes')
    // batch pool has initiated, so we have to check outside of the event loop
    setTimeout(() => {
      assert.equal(getId('app').innerHTML, '<button>toggle</button><div id="1">one</div><div id="3">three</div>')
      clear()
      next()
    })
  })
})
