/* global it describe before beforeEach */
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

    const click = new Event('click', { bubbles: true, cancelable: true })
    const toggle = getId('toggle')
    toggle.dispatchEvent(click)

    await new Promise(resolve => {
      app.componentDidUpdate = function () {
        assert.equal(getId('app').innerHTML, '<button id="toggle">toggle</button><div id="1">one</div><!-- {{?show}} --><!-- {{/show}} --><div id="3">three</div>')
        resolve(true)
      }
    })
  })

  // conditional-nodes

  it('counter', async () => {
    const app = await require('../examples/counter').default

    await new Promise(resolve => {
      app.componentDidUpdate = function () {
        const counter = getId('counter')
        assert.equal(counter.innerHTML, '1')
        resolve(true)
      }
    })
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

    await new Promise(resolve => {
      app.componentDidUpdate = function () {
        assert.equal(getId('app').innerHTML, 'state other')
        resolve(true)
      }
    })
  })

  // model-perf

  // model-simple

  // model-with-events

  it('model', async () => {
    const app = await require('../examples/model').default

    await new Promise(resolve => {
      app.componentDidUpdate = function () {
        let list = getId('list').childNodes
        assert.equal(
          list[0].nodeValue === ' {{model:task}} ' &&
          list[1].innerHTML === 'sleep<input type="checkbox" checked="">' &&
          list[2].innerHTML === 'jog<input type="checkbox" checked="">' &&
          list[3].innerHTML === 'walk<input type="checkbox">' &&
          list[4].innerHTML === 'swim<input type="checkbox" checked="">' &&
          list[5].nodeValue === ' {{/model:task}} '
          , true)
        resolve(true)
      }
    })
  })

  it('multi state', async () => {
    const app = await require('../examples/multi-state').default

    await new Promise(resolve => {
      app.componentDidUpdate = function () {
        assert.equal(getId('app').innerHTML, 'I say: horray horray horray!')
        resolve(true)
      }
    })
  })

  it('no node found err', async () => {
    try {
      await require('../examples/no_node_found_err')
    } catch (err) {
      assert.equal(err instanceof Error, true)
    }
  })

  it('object literals', async () => {
    const app = await require('../examples/object-literals').default

    await new Promise(resolve => {
      app.componentDidUpdate = function () {
        assert.equal(getId('app').innerHTML, '<span>bar</span><span> state : keet</span><span> age : 12</span>')
        resolve(true)
      }
    })
  })

  // other

  it('sub component states', async () => {
    const app = await require('../examples/sub-component-states').default
    const { sub } = await require('../examples/sub-component-states')

    await new Promise(resolve => {
      sub.componentDidUpdate = function () {
        assert.equal(getId('sub').innerHTML, 'this is a sub-component with a state:bar')
        resolve(true)
      }
    })
  })

  // sub-component_err_not_assigned

  // sub-component_with_event

  // sub-multi-component

  // svg-hex-loader

  it('svg model', async () => {
    const app = await require('../examples/svg-model').default
    let list = getId('list').childNodes
    assert.equal(
      list[0].nodeValue === ' {{model:svgModel}} ' &&
      list[1].innerHTML === '<svg width="100" height="100"><circle cx="50" cy="50" r="5" stroke="red" stroke-width="4" fill="yellow"></circle></svg>' &&
      list[2].innerHTML === '<svg width="100" height="100"><circle cx="50" cy="50" r="15" stroke="blue" stroke-width="4" fill="yellow"></circle></svg>' &&
      list[3].innerHTML === '<svg width="100" height="100"><circle cx="50" cy="50" r="25" stroke="green" stroke-width="4" fill="yellow"></circle></svg>' &&
      list[4].nodeValue === ' {{/model:svgModel}} '
      , true)
  })

  // svg

  it('ternary', async () => {
    const app = await require('../examples/ternary').default
    assert.equal(getId('app').innerHTML, 'Hello Keet')
  })

})
