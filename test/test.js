const assert = require('assert')
const { JSDOM } = require('jsdom')

const Keet = require('../keet')

const { getId } = require('../components/utils')

const tag = require('../components/tag')
const copy = require('../components/copy')
const ClassList = require('../classList')

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
    // console.log(document.getElementById('app'))
    document.getElementById('app').innerHTML = ''
  }

  it('has document', function () {
    var div = document.createElement('div')
    assert.equal(div.nodeName, 'DIV')
  })

  it('write text content', function () {
    class App extends Keet {
      constructor () {
        super()
        this.greeting = ''
      }
      greet () {
        this.greeting = 'world'
      }
      componentDidMount () {
        this.greet()
        assert.equal(document.querySelector('#hw').childNodes[0].nodeValue, 'hello world')
        clear()
      }
    }
    const app = new App()
    const instance = {
      hello: {
        tag: 'div',
        id: 'hw',
        template: 'hello {{greeting}}'
      }
    }
    app.mount(instance).link('app').cluster()
  })

  it('will mount', function () {
    class App extends Keet {
      componentWillMount () {
        assert.equal(document.querySelector('#hw2'), null)
      }
    }
    const app = new App()
    const instance = {
      hello: {
        tag: 'div',
        id: 'hw2',
        template: 'hello'
      }
    }
    app.mount(instance).link('app')
  })

  it('ignore render when DOM not found', function () {
    class App extends Keet {}
    const app = new App()
    const instance = {
      hello: {
        tag: 'div',
        template: 'hello'
      }
    }
    app.mount(instance).link('app-not-found')
    assert.equal(document.querySelector('#app-not-found'), null)
  })

  it('run clusters if function', function () {
    class App extends Keet {}
    const app = new App()
    const instance = {
      hello: {
        tag: 'div',
        template: 'hello'
      }
    }
    let [ a, b ] = [ 0, 0 ]
    const fn = [ function () { a = 1 }, function () { b = 2 }, 'not-a-function' ]
    app.mount(instance).link('app').cluster(...fn)
    assert.equal(a + b, 3)
  })

  it('handle click event', function () {
    class App extends Keet {
      clickHandler (evt) {
        assert.equal(evt.type, 'click')
      }
    }
    const app = new App()
    const instance = {
      clicker: {
        tag: 'button',
        'k-click': 'clickHandler()'
      }
    }
    app.mount(instance).link('app')
    const click = new Event('click', {
      'bubbles': true,
      'cancelable': true
    })
    getId('app').childNodes[0].dispatchEvent(click)
  })

  it('tag input type', function () {
    const t = tag('input', null, {
      checked: true,
      type: 'checkbox'
    })
    assert.equal(t, '<input type="checkbox" checked></input>')
  })

  it('tag class', function () {
    const t = tag('div', null, {
      class: ['mean', 'more']
    })
    assert.equal(t, '<div class="mean more"></div>')
  })

  it('tag arguments length not meet', function () {
    const t = tag('div', null)
    assert.equal(t, '<div></div>')
  })

  it('tag with style', function () {
    const t = tag('div', 'hello', null, {
      display: 'block',
      'font-style': 'italic'
    })
    assert.equal(t, '<div style="display:block;font-style:italic;">hello</div>')
  })

  it('copy array', function () {
    let arr = [ 1, 2, 3 ]
    let cp = copy(arr)
    cp[0] = 2
    cp[1] = 4
    cp[2] = 6
    assert.equal(arr.join(''), '123')
    clear()
  })

  it('evaluation string', function () {
    class App extends Keet {
      constructor () {
        super()
        this.do = 'a'
        this.me = 'favor'
      }
    }
    const app = new App()
    const instance = {
      template: '{{do}} {{me}}'
    }
    app.mount(instance).link('app')
    assert.equal(document.querySelector('#app').innerHTML, 'a favor')
    clear()
  })

  it('evaluation string 2', function () {
    class App extends Keet {
      constructor () {
        super()
        this.do = 'a'
        this.me = 'favor'
      }
    }
    const app = new App()
    const instance = {
      child: {
        template: 'do me'
      }
    }
    app.mount(instance).link('app')
    assert.equal(document.querySelector('#app').innerHTML, '<div>do me</div>')
    clear()
  })

  it('classes', function () {
    class App extends Keet {
      constructor () {
        super()
        this.classes = new ClassList()
        this.classes.add('foo', 'bar')
      }
    }
    const app = new App()
    const instance = {
      ch: {
        tag: 'div',
        class: '{{classes}}',
        id: 'ch',
        template: 'do me'
      }
    }
    app.mount(instance).link('app')
    assert.equal(document.querySelector('#ch').getAttribute('class'), 'foo bar')
    clear()
  })

  it('checkbox unchecked', function () {
    class App extends Keet {}
    const app = new App()
    const instance = {
      example: {
        tag: 'input',
        id: 'inputExample',
        checked: false,
        type: 'checkbox'
      }
    }

    app.mount(instance).link('app')
    assert.equal(document.querySelector('#inputExample').checked, false)
    clear()
  })

  it('checkbox checked', function () {
    class App extends Keet {}
    const app = new App()
    const instance = {
      example: {
        tag: 'input',
        id: 'inputExample',
        checked: true,
        type: 'checkbox'
      }
    }
    app.mount(instance).link('app')
    assert.equal(document.querySelector('#inputExample').checked, true)
    clear()
  })

  it('state not assigned', function () {
    class App extends Keet {}
    const app = new App()
    const instance = {
      template: '{{foo}}'
    }
    app.mount(instance).link('app')
    assert.equal(document.querySelector('#app').innerHTML, '{{foo}}')
    clear()
  })

  it('ignore handler when is not a function', function () {
    class App extends Keet {
      constructor () {
        super()
        this.clickHandler = true
      }
    }
    const app = new App()
    const instance = {
      me: {
        tag: 'button',
        'k-click': 'clickHandler()'
      }
    }
    app.mount(instance).link('app')
    clear()
  })

  it('handler with argument', function (next) {
    class App extends Keet {
      clickHandler (sec, evt) {
        assert.equal(sec, 'harder')
        clear()
        next()
      }
    }

    const app = new App()

    const instance = {
      me: {
        tag: 'button',
        'k-click': 'clickHandler(harder)'
      }
    }
    app.mount(instance).link('app')

    const click = new Event('click', {
      'bubbles': true,
      'cancelable': true
    })
    document.getElementById('app').childNodes[0].dispatchEvent(click)
  })

  it('toggle display', function () {
    class App extends Keet {
      constructor () {
        super()
        this.display = 'none'
      }
      change (state) {
        this.display = state
      }
    }
    const app = new App()
    const instance = {
      wo: {
        tag: 'span',
        style: {
          display: '{{display}}'
        },
        template: 'hello'
      }
    }
    app.mount(instance).link('app')
    app.change('block')
    assert.equal(document.querySelector('#app').childNodes[0].style.display, 'block')
    clear()
  })

  it('static style', function () {
    class App extends Keet {
      constructor () {
        super()
        this.display = 'none'
      }
    }
    const app = new App()
    const instance = {
      wo: {
        tag: 'span',
        style: {
          color: 'red'
        },
        template: 'hello'
      }
    }
    app.mount(instance).link('app')
    assert.equal(document.querySelector('#app').childNodes[0].style.color, 'red')
    clear()
  })

  it('toggle display without state', function () {
    class App extends Keet {}
    const app = new App()
    const instance = {
      wo: {
        tag: 'span',
        style: {
          background: '{{none}}'
        },
        template: 'hello'
      }
    }
    app.mount(instance).link('app')
    clear()
  })

  it('has classes', function () {
    class App extends Keet {}
    const app = new App()
    const instance = {
      wo: {
        tag: 'span',
        id: 'ch',
        class: 'foo bar',
        template: 'hello'
      }
    }
    app.mount(instance).link('app')
    assert.equal(document.querySelector('#ch').getAttribute('class'), 'foo bar')
    clear()
  })

  it('has classes state not assigned', function () {
    class App extends Keet {}
    const app = new App()
    const instance = {
      wo: {
        tag: 'span',
        class: 'foo {{bar}}',
        template: 'hello'
      }
    }

    app.mount(instance).link('app')
    assert.equal(document.querySelector('#app').childNodes[0].getAttribute('class'), 'foo {{bar}}')
    clear()
  })

  it('parsing as string', function () {
    class App extends Keet {
      constructor () {
        super()
        this.apply = 'value'
      }
      change (res) {
        this.apply = res
      }
    }
    const app = new App()
    const instance = { template: 'just a {{apply}}' }
    app.mount(instance).link('app')
    app.change('change')
    assert.equal(document.querySelector('#app').childNodes[0].nodeValue, 'just a change')
    clear()
  })

  it('parsing as style', function () {
    class App extends Keet {
      constructor () {
        super()
        this.apply = 'value'
      }
      change (res) {
        this.apply = res
      }
    }
    const app = new App()
    const instance = {
      test: {
        tag: 'div',
        style: {
          color: 'red'
        },
        template: 'duh'
      }
    }
    app.mount(instance).link('app')
    app.change('another')
    assert.equal(document.querySelector('#app').childNodes[0].getAttribute('style'), 'color:red;')
    clear()
  })

  it('nodeValue empty string', function () {
    class App extends Keet {
      constructor () {
        super()
        this.str = ''
      }
      mod (str) {
        this.str = str
      }
    }
    const app = new App()
    const instance = {
      ugh: {
        tag: 'div',
        template: '{{str}}'
      }
    }
    app.mount(instance).link('app')
    app.mod('test')
    assert.equal(document.querySelector('#app').childNodes[0].innerHTML, 'test')
    clear()
  })

  it('node no attr', function () {
    class App extends Keet {}
    const app = new App()
    const instance = {
      ugh: {
        tag: 'div'
      }
    }
    document.querySelector('#app').innerHTML = ''
    app.mount(instance).link('app')
    assert.equal(document.querySelector('#app').childNodes[0].nodeValue, null)
    clear()
  })

  it('checkbox checked programmatically', function () {
    class App extends Keet {
      constructor (...args) {
        super()
        this.ch = false
        this.args = args
      }
      change (bool) {
        this.ch = bool
      }
    }

    const app = new App('checked', 'toss')

    const instance = {
      wo: {
        tag: 'input',
        type: 'checkbox',
        id: 'testcheck',
        checked: '{{ch}}'
      }
    }
    app.mount(instance).link('app')
    app.change(true)
    assert.equal(document.querySelector('#testcheck').checked, true)
    clear()
  })

  it('checkbox checked programmatically falsish', function () {
    class App extends Keet {
      constructor (...args) {
        super()
        this.ch = true
        this.args = args
      }
      change (bool) {
        this.ch = bool
      }
    }
    const app = new App('checked', 'toss')
    const instance = {
      wo: {
        tag: 'input',
        type: 'checkbox',
        id: 'testcheck',
        checked: '{{ch}}'
      }
    }
    app.mount(instance).link('app')
    app.change(false)
    assert.equal(document.querySelector('#testcheck').checked, false)
    clear()
  })

  it('undeclared args', function () {
    class App extends Keet {
      constructor (...args) {
        super()
        this.args = args
      }
      change (bool) {
        this.ch = bool
      }
    }
    const app = new App('checked', 'toss')
    const instance = {
      wo: {
        tag: 'input',
        type: 'checkbox',
        id: 'testcheck',
        checked: '{{ch}}'
      }
    }
    app.mount(instance).link('app')
    app.change(true)
    clear()
  })

  it('undeclared args', function () {
    class App extends Keet {
      constructor () {
        super()
        this.ch = true
      }
      change (bool) {
        this.ch = bool
      }
    }
    const app = new App()
    const instance = {
      foo: {
        tag: 'div'
      }
    }
    app.mount(instance).link('app')
    app.change(true)
    clear()
  })

  it('ignore update nodeType 1', function () {
    const foo = () => {
      class App extends Keet {}
      let app = new App()
      let instance = {
        foo: {
          tag: 'div',
          template: 'foo'
        }
      }
      app.mount(instance).link('foo')
      return app
    }

    class App extends Keet {
      constructor () {
        super()
        this.swap = 'foo'
      }
      swapchild () {
        this.swap = 'bar'
      }
    }
    const app = new App()
    const instance = {
      foo: {
        tag: 'div',
        template: '<div id="{{swap}}"></div>'
      }
    }
    app.mount(instance).link('app').cluster(foo)
    app.swapchild()
    clear()
  })

  it('ignore update nodeType 3', function () {
    const foo = () => {
      class App extends Keet {}
      let app = new App()

      let instance = {
        foo: {
          tag: 'div',
          template: 'foo'
        }
      }
      app.mount(instance).link('foo')

      return app
    }

    class App extends Keet {
      constructor () {
        super()
        this.test = 'test!'
      }
      swapchild () {
        this.test = 'test2!'
      }
    }

    const app = new App()

    const instance = {
      foo: {
        tag: 'div',
        id: 'foo'
      }
    }

    app.mount(instance).link('app').cluster(foo)

    app.swapchild()
    clear()
  })

  it('force rerender dom', function () {
    class App extends Keet {}

    const app = new App()

    const instance = {
      foo: {
        tag: 'div',
        id: 'foo'
      }
    }

    app.mount(instance).link('app')
    app.base['bar'] = {
      tag: 'div',
      id: 'bar'
    }
    app.render(true)
    assert.equal(document.getElementById('app').childNodes.length, 2)
    clear()
  })

  it('mounting/unmounting node', function () {
    class App extends Keet {
      constructor () {
        super()
        this.active = 'block'
      }
      toggle () {
        this.active = this.active === 'block' ? 'none' : 'block'
      }
    }

    const app = new App()

    const vmodel = {
      header: {
        tag: 'h1',
        template: 'My Simple Toggler'
      },
      toggler: {
        tag: 'button',
        'k-click': 'toggle()',
        template: 'toggle'
      }
    }

    app.mount(vmodel).link('app')

    setTimeout(() => {
      app.baseProxy['showcase'] = {
        tag: 'button',
        style: {
          display: '{{active}}'
        },
        template: 'visible'
      }
    }, 1000)

    setTimeout(() => {
      delete app.baseProxy.showcase
      clear()
    }, 2000)
  })

  it('flush on non-exist node', function (next) {
    clear()
    class App extends Keet {}

    const app = new App()

    const vmodel = {
      foo: {
        tag: 'div',
        id: 'foo',
        template: 'foo'
      },
      bar: {
        tag: 'div',
        id: 'bar',
        template: 'bar'
      }
    }

    app.mount(vmodel).link('app')

    setTimeout(() => {
      app.el = 'non'
      app.flush()
      clear()
      next()
    }, 10)
  })

  it('model list add', function () {
    class App extends Keet {
      constructor (...args) {
        super()
        this.args = args
      }
    }
    const app = new App('checked')

    let model = []

    let len = 5

    for (let i = 0; i < len; i++) {
      model = model.concat({
        id: i,
        me: (Math.random() * 1e12).toString(32),
        checked: i % 2 !== 0
      })
    }

    const instance = {
      template: `
        <li id="{{id}}">{{me}}
          <input type="checkbox" checked="{{checked}}"></input>
        </li>`,
      model: model
    }

    app.mount(instance).link('app')

    app.add({
      id: model.length,
      me: 'test!',
      checked: false
    }, function(){})

    app.add({
      id: model.length,
      me: 'test2!',
      checked: false
    })

    clear()
  })

  /*it('model list add not available', function (next) {

    let newDiv = document.createElement('div')

    newDiv.id = 'not-available'

    document.getElementById('app').append(newDiv)

    class App extends Keet {
      constructor (...args) {
        super()
        this.args = args
      }
    }
    const app = new App('checked')

    let model = []

    let len = 5

    for (let i = 0; i < len; i++) {
      model = model.concat({
        id: i,
        me: (Math.random() * 1e12).toString(32),
        checked: i % 2 !== 0
      })
    }

    const instance = {
      template: `
        <li id="{{id}}">{{me}}
          <input type="checkbox" checked="{{checked}}"></input>
        </li>`,
      model: model
    }

    app.mount(instance).link('not-available')

    document.getElementById('not-available').remove()

    app.add({
      id: model.length,
      me: 'test!',
      checked: false
    })

    setTimeout(() => {
      document.getElementById('app').append(newDiv)
      setTimeout(() => {
        clear()
        next()
      }, 100)
    }, 100)

  })*/

  it('model list destroy', function () {
    class App extends Keet {
      constructor (...args) {
        super()
        this.args = args
      }
    }
    const app = new App('checked')

    let model = []

    let len = 5

    for (let i = 0; i < len; i++) {
      model = model.concat({
        id: i,
        me: (Math.random() * 1e12).toString(32),
        checked: i % 2 !== 0
      })
    }

    const instance = {
      template: `
        <li id="{{id}}">{{me}}
          <input type="checkbox" checked="{{checked}}"></input>
        </li>`,
      model: model
    }

    app.mount(instance).link('app')

    app.destroy(1, 'id', function(){})

    app.destroy(2, 'id')

    clear()
  })

  it('model list destroy no node found', function () {
    class App extends Keet {
      constructor (...args) {
        super()
        this.args = args
      }
    }
    const app = new App('checked')

    let model = []

    let len = 5

    for (let i = 0; i < len; i++) {
      model = model.concat({
        id: i,
        me: (Math.random() * 1e12).toString(32),
        checked: i % 2 !== 0
      })
    }

    const instance = {
      template: `
        <li id="{{id}}">{{me}}
          <input type="checkbox" checked="{{checked}}"></input>
        </li>`,
      model: model
    }

    app.mount(instance).link('app')

    let id = app.base.model[1].id
    document.getElementById(id).remove()
    app.destroy(1, 'id')

    clear()
  })

  it('model list update', function () {
    class App extends Keet {
      constructor (...args) {
        super()
        this.args = args
      }
      test (id) {
        //
      }
    }
    const app = new App('checked')

    let model = []

    let len = 5

    for (let i = 0; i < len; i++) {
      model = model.concat({
        id: i,
        me: (Math.random() * 1e12).toString(32),
        checked: i % 2 !== 0
      })
    }

    const instance = {
      template: `
        <li id="{{id}}">{{me}}
          <input k-click="test({{id}})" type="checkbox" checked="{{checked}}"></input>
        </li>`,
      model: model
    }

    app.mount(instance).link('app')

    app.update(0, 'id', {
      me: 'cool',
      checked: true
    }, function(){})

    clear()
  })

  it('model list update no node found', function () {
    class App extends Keet {
      constructor (...args) {
        super()
        this.args = args
      }
      test (id) {
        //
      }
    }
    const app = new App('checked')

    let model = []

    let len = 5

    for (let i = 0; i < len; i++) {
      model = model.concat({
        id: i,
        me: (Math.random() * 1e12).toString(32),
        checked: i % 2 !== 0
      })
    }

    const instance = {
      template: `
        <li id="{{id}}">{{me}}
          <input k-click="test({{id}})" type="checkbox" checked="{{checked}}"></input>
        </li>`,
      model: model
    }

    app.mount(instance).link('app')

    let id = app.base.model[0].id
    document.getElementById(id).remove()

    app.update(0, 'id', {
      me: 'cool',
      checked: true
    })

    clear()
  })

  it('model list update not assign arguments', function () {
    class App extends Keet {
      constructor (...args) {
        super()
        this.args = args
      }
    }
    const app = new App('checked')

    let model = []

    let len = 5

    for (let i = 0; i < len; i++) {
      model = model.concat({
        id: i,
        me: (Math.random() * 1e12).toString(32),
        checked: i % 2 !== 0
      })
    }

    const instance = {
      template: `
        <li id="{{id}}">{{me}}
          <input k-click="test({{id}})" type="checkbox" checked="{{checked}}"></input>
        </li>`,
      model: model
    }

    app.mount(instance).link('app')

    app.update(0, 'id')

    clear()
  })

  it('state with object notation', function () {
    class App extends Keet {
      constructor () {
        super()
        this.state = {
          name: 'john',
          age: 31
        }
      }
      change () {
        this.state.name = 'keet'
      }
    }

    const app = new App()

    const vmodel = {
      template: `
        <span>state : {{state.name}}</span>
      `
    }

    app.mount(vmodel).link('app')

    app.change()

    assert.equal(document.getElementById('app').childNodes[0].innerHTML, 'state : keet')

    clear()
  })

  it('render from string and add conditional render', function () {
    class App extends Keet {
      constructor () {
        super()
        this.state = false
      }
      change (state) {
        this.state = state
      }
    }

    const app = new App

    app.mount(`
      <div id="1">one</div>
      {{?state}}
      <div id="2">two</div>
      {{/state}}
      <div id="3">three</div>
    `).link('app')

    app.change(true)

    assert.equal(document.getElementById('app').childNodes[2].innerHTML === 'two', document.getElementById('app').childNodes.length === 5 )

    clear()
  })

  it('ignore render non string or object', function () {
    class App extends Keet {}

    const app = new App

    app.mount(true).link('app')

    assert.equal(document.getElementById('app').outerHTML, '<div id="app"></div>')

    clear()
  })

  it('flush dom node', function () {
    class App extends Keet {}

    const app = new App

    app.mount(`<div>hello</div>`).link('app').flush()

    assert.equal(document.getElementById('app').innerHTML, '')

  })

  it('ignore render on not found dom', function () {
    class App extends Keet {
      constructor(){
        super()
        this.state = 'hello'
      }
      change(state){
        this.state = state
      }
    }

    const app = new App

    app.mount(`<div id="temp">{{state}}</div>`).link('app')

    document.getElementById('app').remove()

    app.change('world')

    assert.equal(document.getElementById('app'), null)

  })

  it('proxy remove a child object', function () {

    let newApp = document.createElement('div')

    newApp.id = 'app'

    document.body.append(newApp)

    class App extends Keet {}

    const app = new App()

    const vmodel = {
      foo: {
        tag: 'div',
        id: 'foo',
        template: 'foo'
      },
      bar: {
        tag: 'div',
        id: 'bar',
        template: 'bar'
      }
    }

    app.mount(vmodel).link('app')

    delete app.baseProxy.bar

    assert.equal(document.getElementById('app').childNodes.length, 1)
  })


})
