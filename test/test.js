const assert = require('assert')
const { JSDOM } = require('jsdom')

const Keet = require('../')
const tag = require('../tag')
const fs = require('fs')
const pkg = fs.readFileSync('package.json', 'utf8')

const ver = JSON.parse(pkg).version

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
      global.Event = window.Event

      const MutationObserver = require('mutation-observer')

      global.MutationObserver = window.MutationObserver = MutationObserver
      global.log = console.log.bind(console)
    }
  )

  it('has document', function () {
    var div = document.createElement('div')
    assert.equal(div.nodeName, 'DIV')
  })

  it('write text content', function () {
    
    class App extends Keet {
      constructor(){
        super()
      }
    }

    const app = new App()

    const instance = {
      template: '{{hello}}',
      hello: {
        tag: 'div',
        id: 'hello',
        template: 'hello world'
      }
    }

    app.mount(instance).link('app')

    assert.equal(document.querySelector('#hello').childNodes[0].nodeValue, 'hello world')
  })

  it('handle click event', function () {

    class App extends Keet {
      constructor(){
        super()
      }
    }

    const app = new App()

    const instance = {
      template: '{{clicker}}',
      clicker: {
        tag: 'button',
        'k-click': 'clickHandler()'
      },
      clickHandler: function(evt){
        assert.equal(evt.type, 'click')
      }
    }

    app.mount(instance).flush('app').link('app')

    const click = new Event('click', {
      'bubbles': true,
      'cancelable': true
    })

    app.vdom().childNodes[0].dispatchEvent(click)

  })

  it('tag input type', function () {
    const t = tag('input', null, { checked: true, type: 'checkbox'})
    assert.equal(t, '<input type="checkbox" checked></input>')

  })

  it('tag class', function () {
    const t = tag('div', null, { class: ['mean', 'more']})
    assert.equal(t, '<div class="mean more"></div>')
  })

  it('tag arguments length not meet', function () {
    const t = tag('div', null)
    assert.equal(t, '<div></div>')
  })

  it('tag with style', function () {
    const t = tag('div', 'hello', null, { display: 'block', 'font-style': 'italic' })
    assert.equal(t, '<div style="display:block;font-style:italic;">hello</div>')
  })

  it('construct', function () {
    const app = new Keet('div', {
      template: '{{hello}}{{non}}',
      hello: {
        tag: 'span',
        template: 'hello keet!'
      }
    })
    app.flush('app').link('app')
    assert.equal(document.querySelector('SPAN').childNodes[0].nodeValue, 'hello keet!')
  })

  it('evaluation false', function(){
    class App extends Keet {
      constructor(){
        super()
      }
    }
    const app = new App()
    const instance = {
      template: '{{do}}{{me}}'
    }
    app.mount(instance).flush('app').link('app')
    assert.equal(document.querySelector('#app').innerHTML, '{{do}}{{me}}')
  })

  it('ignore function prop', function(){
    class App extends Keet {
      constructor() {
        super()
      }
    }
    const app = new App()
    const instance = {
      template: '{{example}}',
      example: {
        tag: 'div',
        id: 'example',
        functionAttr: function(){
          return 'none'
        }
      }
    }
    app.mount(instance).flush('app').link('app')
    var output = [], oAttr = document.querySelector('#example').attributes
    if(oAttr){
      for(var i = oAttr.length - 1; i >= 0; i--) {
        let c = {}
        c.name = oAttr[i].name
        c.value = oAttr[i].value
        output.push(c)
      }
    }
    let res = output.filter(f => f.name == 'functionAttr')
    assert.equal(res.length, 0)
  })

  it('checkbox unchecked', function(){
    class App extends Keet {
      constructor() {
        super()
      }
    }

    const app = new App()

    const instance = {
      template: '{{example}}',
      example: {
        tag: 'input',
        id: 'inputExample',
        checked: false,
        type: 'checkbox'
      }
    }

    app.mount(instance).flush('app').link('app')
    assert.equal(document.querySelector('#inputExample').checked, false)
  })

  it('checkbox checked', function(){
    class App extends Keet {
      constructor() {
        super()
      }
    }

    const app = new App()

    const instance = {
      template: '{{example}}',
      example: {
        tag: 'input',
        id: 'inputExample',
        checked: true,
        type: 'checkbox'
      }
    }

    app.mount(instance).flush('app').link('app')
    assert.equal(document.querySelector('#inputExample').checked, true)
  })

  it('error parsing type of non-object', function(next){
    class App extends Keet {
      constructor() {
        super()
      }
    }

    const app = new App()

    function cb(err) {
        assert.equal(err instanceof Error, true)
        next()
    }
    function test(){
        process.nextTick(() => {
          const instance = 'just a string'
          app.mount(instance).flush('app').link('app')
        })
    }
    process.prependOnceListener('uncaughtException', cb)
    test()

  })

  it('parsing just template', function(){
    class App extends Keet {
      constructor() {
        super()
      }
    }

    const app = new App()

    const instance = { template: 'just a string' }
    app.mount(instance).flush('app').link('app')
    assert.equal(document.querySelector('#app').childNodes[0].nodeValue, 'just a string')
  })

  it('parsing array list', function(){
    class App extends Keet {
      constructor() {
        super()
      }
    }

    const app = new App()

    const instance = { 
      template: '<span id={{id}}>{{name}}</span>',
      list: [
        { id: 'surname', name: 'john' }
      ]
    }
    app.mount(instance).flush('app').link('app')
    assert.equal(document.querySelector('#surname').childNodes[0].nodeValue, 'john')

  })

  it('error parsing child as string', function(next){
    class App extends Keet {
      constructor() {
        super()
      }
    }

    const app = new App()

    function cb(err) {
        assert.equal(err instanceof Error, true)
        next()
    }
    function test(){
        process.nextTick(() => {
          const instance = { 
            template: '{{a}}',
            a: 'test' 
          }
          app.mount(instance).flush('app').link('app')
        })
    }
    process.prependOnceListener('uncaughtException', cb)
    test()
  })

  it('ignore handler when is not a function', function(){
    class App extends Keet {
      constructor() {
        super()
      }
    }

    const app = new App()

    const instance = {
      template: '{{me}}',
      me: {
        tag: 'button',
        'k-click': 'clickHandler2()'
      },
      clickHandler2: true
    }
    app.mount(instance).flush('app').link('app')
  })

  it('handler with argument', function(next){
    class App extends Keet {
      constructor() {
        super()
      }
    }

    const app = new App()

    const instance = {
      template: '{{me}}',
      me: {
        tag: 'button',
        'k-click': 'clickHandler2(test,harder)'
      },
      clickHandler2: function(evt, sec, third){
        assert.equal(third, 'harder')
        next()
      }
    }
    app.mount(instance).flush('app').link('app')

    const click = new Event('click', {
      'bubbles': true,
      'cancelable': true
    })

    app.vdom().childNodes[0].dispatchEvent(click)

  })

  it('vdom removed', function(){
    class App extends Keet {
      constructor() {
        super()
      }
    }

    const app = new App()

    const instance = {
      template: '{{me}}',
      me: {
        tag: 'div',
        id: 'test'
      }
    }

    app.mount(instance).flush('app').link('app')

    const instance2 = { template: 'test' }

    const test = new App()

    test.mount(instance2).link('test')

    app.vdom().childNodes[0].remove()

    assert.equal(test.vdom(), undefined)

  })

  it('flush default', function(){
    class App extends Keet {
      constructor() {
        super()
      }
    }

    const app = new App()

    const instance = {
      template: '{{me}}',
      me: {
        tag: 'div',
        id: 'test'
      }
    }

    app.mount(instance).link('app')

    app.flush()

    assert.equal(app.vdom().innerHTML, '')

  })

  it('return undefined on not found declared dom', function(){
    class App extends Keet {
      constructor() {
        super()
      }
    }

    const app = new App()

    const instance = {
      template: '{{me}}',
      me: {
        tag: 'div',
        id: 'test'
      }
    }

    app.mount(instance).link('app')


    app.el = 'wrong-dom-id'

    app.flush()

    assert.equal(app.vdom(), undefined)

  })

  it('won\'t render on not found declared dom', function(next){
    class App extends Keet {
      constructor() {
        super()
      }
    }

    const app = new App()

    const instance = {
      template: '{{me}}',
      me: {
        tag: 'div',
        id: 'test'
      }
    }

    app.mount(instance)

    app.el = 'not-a-dom-id'

    function cb(err) {
      assert.equal(err instanceof Error, true)
      next()
    }

    function test(){
        process.nextTick(() => {
          app.render()
        })
    }

    process.prependOnceListener('uncaughtException', cb)
    test()
  })

  it('register listener', function(next){
    class App extends Keet {
      constructor() {
        super()
      }
    }

    const app = new App()

    const instance = {
      template: '{{me}}',
      me: {
        tag: 'div',
        id: 'test'
      }
    }

    window._loaded = function(el){
      assert.equal(el, 'app')
      window._loaded = null
      next()
    }

    app.mount(instance).flush('app').link('app')

  })


  it('array shift', function(){


    class App extends Keet {
      constructor() {
        super()
      }
    }

    const app = new App()

    const instance = {
      template: '<span>{{me}}</span>',
      list: [
        {me: 'john'},
        {me: 'juan'}
      ]
    }

    app.mount(instance).flush('app').link('app')

    instance.list.shift()

    assert.equal(document.querySelector('SPAN').childNodes[0].nodeValue, 'juan')

  })

  it('array pop', function(){


    class App extends Keet {
      constructor() {
        super()
      }
    }

    const app = new App()

    const instance = {
      template: '<span>{{me}}</span>',
      list: [
        {me: 'john'},
        {me: 'juan'}
      ]
    }

    app.mount(instance).flush('app').link('app')

    instance.list.pop()

    assert.equal(document.querySelector('SPAN').childNodes[0].nodeValue, 'john')

  })

  it('array update', function(){


    class App extends Keet {
      constructor() {
        super()
      }
    }

    const app = new App()

    const instance = {
      template: '<span>{{me}}</span>',
      list: [
        {me: 'john'},
        {me: 'juan'}
      ]
    }

    app.mount(instance).flush('app').link('app')

    instance.list.update(0, { me : 'susan'})

    assert.equal(document.querySelector('SPAN').childNodes[0].nodeValue, 'susan')

  })

  it('array splice', function(){


    class App extends Keet {
      constructor() {
        super()
      }
    }

    const app = new App()

    const instance = {
      template: '<span>{{me}}</span>',
      list: [
        {me: 'john'},
        {me: 'juan'},
        {me: 'susan'}
      ]
    }

    app.mount(instance).flush('app').link('app')

    instance.list.splice(1, 1, {me: 'awile'})

    // assert.equal(document.querySelector('SPAN').childNodes[1].nodeValue, 'awile')

  })

})