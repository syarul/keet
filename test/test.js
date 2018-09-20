/* global it describe before */
const assert = require('assert')
const { JSDOM } = require('jsdom')

const { getId } = require('../utils')

const fs = require('fs')

const pkg = fs.readFileSync('package.json', 'utf8')

const ver = JSON.parse(pkg).version

let Event

// remove UnhandledPromiseRejectionWarning
process.on('unhandledRejection', () => {})

describe(`keet.js v-${ver} test`, () => {
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
  })

  beforeEach(() => {
    document.getElementById('app').innerHTML = ''
    // clear global pool
    window.__keetGlobalComponentRef__ = []
  })

  it('has document', () => {
    const div = document.createElement('div')
    assert.equal(div.nodeName, 'DIV')
  })

  it('attributes with handlebars', async () => {
    await require('../examples/attributes-with-handlebars')
    assert.equal(getId('app').innerHTML, '<div id="foo" bar="">foo</div>')
  })

  // batch-pool

  it('componentDidMount', async () => {
    const app = await require('../examples/componentDidMount').default
    assert.equal(app.isMounted, true)
  })

  it('conditional nodes extra', async () => {
    const app = await require('../examples/conditional-nodes-extra').default
    assert.equal(getId('list').childNodes.length === 4 && getId('list').childNodes[1].innerHTML === ' John - 21 ', true)

    app.componentDidUpdate = function () {
      assert.equal(getId('app').childNodes.length, 5)
    }

    const click = new Event('click', { bubbles: true, cancelable: true })
    const toggle = getId('toggle')
    toggle.dispatchEvent(click)
  })

  // conditional-nodes

  it('counter', async () => {
    const app = await require('../examples/counter').default

    app.componentDidUpdate = function () {
      const counter = getId('counter')
      assert.equal(counter.innerHTML, '1')
    }
  })

  it('err mount non string', async () => {
    try {
      await require('../examples/err_mount_non_string')
    } catch (err) {
      assert.equal(err instanceof Error, true)
    }
  })

  // event_not_declared

  it('function state', async () => {
    await require('../examples/function-state')
    assert.equal(getId('app').innerHTML, 'Total of: 1 + 1 = 2')
  })

  it('hello world', async () => {
    await require('../examples/hello')
    assert.equal(getId('app').innerHTML, 'Hello World')
  })

  it('html entities', async () => {
    await require('../examples/html-entities')
    assert.equal(getId('app').innerHTML, 'Hello World')
  })

  it('html entities err nodeType', async () => {
    try {
      await require('../examples/html-entities_err_nodeType')
    } catch (err) {
      assert.equal(err instanceof Error, true)
    }
  })

  // html-entities_nodeType_1

  it('pubsub', async () => {
    const app = await require('../examples/main').default

    app.componentDidUpdate = function () {
      assert.equal(getId('app').innerHTML, 'state other')
    }
  })

  // model-perf

  // model-simple

  // model-with-events

  it('model', async () => {
    const app = await require('../examples/model').default
    // console.log(getId('app').innerHTML)
    app.componentDidUpdate = function () {
      // console.log(getId('app').innerHTML)
      assert.equal(getId('list').childNodes.length, 6)
    }
  })

  /* it('no node found err', async () => {
    try {
      await require('../examples/no_node_found_err')
    } catch (err) {
      assert.equal(err instanceof Error, true)
    }
  }) */

  /*
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

  it('render sub multi component', function () {
    require('../examples/sub-multi-component')

    let r = '<div id="sub" data-ignore="">this is a sub-component</div>'

    r = `${r}${r}${r}`

    assert.equal(getId('container').innerHTML, r)
    clear()
  })

  it('sub-component event handling', function (next) {
    require('../examples/sub-component_with_event')
    // batch pool has started since
    setTimeout(() => {
      assert.equal(getId('sub-button').innerHTML, 'value: bar')
      clear()
      next()
    })
  })

  it('event not declared', function () {
    require('../examples/event_not_declared')
    // batch pool has started since
    assert.equal(getId('counter').innerHTML, '0')
    clear()
  })

  it('sub-component not assigned', function () {
    // batch pool has initiated, so we have to check outside of the event loop
    try {
      require('../examples/sub-component_err_not_assigned')
    } catch (err) {
      assert.equal(err instanceof Error, true)
    }
    clear()
  })

  it('sub-component async', function (next) {
    require('../examples/sub-component_async')
    // batch pool has initiated, so we have to check outside of the event loop
    setTimeout(() => {
      assert.equal(getId('container').innerHTML, '<div id="sub" data-ignore="">this is a sub-component</div>')
      clear()
      next()
    }, 200)
  })

  it('batch-pool 1 million updates', function (next) {
    require('../examples/batch-pool')

    function getCount(){
      return getId('container').innerHTML
    }

    let t = setInterval(() => {
      if(getCount() === '1'){
        clearInterval(t)
        clear()
        next()
      }
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
      assert.equal(getId('list').childNodes.length, 7)
      clear()
      next()
    }, 100)
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
      assert.equal(getId('app').childNodes.length, 5)
      clear()
      next()
    })
  })

  it('model perf test', function () {
    require('../examples/model-perf')
    clear()
  }) */
})
