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
      clickHandler2: function(sec, third, evt){
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

    console.warn = function(){}

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

  it('array update shift +1', function(){


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

    instance.list.update(0, { me : 'susan'}, 1)

    assert.equal(document.querySelectorAll('SPAN')[1].childNodes[0].nodeValue, 'susan')

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

    let els = document.querySelectorAll('SPAN')

    assert.equal(els[1].innerHTML, 'awile')

  })

  it('array splice without removal', function(){


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

    instance.list.splice(1, 0, {me: 'awile'})

    let els = document.querySelectorAll('SPAN')

    assert.equal(els[1].innerHTML == 'awile' && els.length == 4, true)

  })

  it('array splice ignore', function(){


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

    instance.list.splice(1, 0)

    let els = document.querySelectorAll('SPAN')

    assert.equal(els.length == 3, true)

  })

  it('array splice single argument', function(){


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

    instance.list.splice(1)

    let els = document.querySelectorAll('SPAN')

    assert.equal(els.length == 1 && els[0].innerHTML == 'john', true)

  })

  it('array unshift', function(){


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

    instance.list.unshift({me: 'foo'})

    let els = document.querySelectorAll('SPAN')

    assert.equal(els[0].innerHTML == 'foo' && els.length == 4, true)

  })

  it('array push', function(){


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

    instance.list.push({me: 'mofoo'})

    let els = document.querySelectorAll('SPAN')

    assert.equal(els[els.length - 1].innerHTML == 'mofoo' && els.length == 4, true)

  })

  it('update child id', function(){
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

    instance.me.id = 'mutate'

    let el = document.querySelector('#mutate')

    assert.equal(el.nodeType, 1)

  })

  it('update child nodeValue', function(){
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
        id: 'me', // must have id for change to happen
        template: ''
      }
    }

    app.mount(instance).flush('app').link('app')

    instance.me.template = 'mofoo'

    assert.equal(document.querySelector('#me').childNodes[0].nodeValue, 'mofoo')

  })

  it('ignore update when supplied same value', function(){
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
        template: 'aw'
      }
    }

    app.mount(instance).flush('app').link('app')

    instance.me.template = 'aw'

    assert.equal(document.querySelector('#app').childNodes[0].childNodes[0].nodeValue, 'aw')

  })

  it('watcher 2', function(){
    class App extends Keet {
      constructor() {
        super()
      }
    }

    const app = new App()

    const instance = {
      template: 'test'
    }

    app.mount(instance).flush('app').link('app')

    instance.template = 'foo'

    assert.equal(document.querySelector('#app').innerHTML, 'foo')

  })

  it('compose new object', function(next){
    class App extends Keet {
      constructor() {
        super()
      }
    }

    const app = new App()

    const instance = {
      template: 'test'
    }

    app.mount(instance).flush('app').link('app')

    const instance2 = {
      template: '{{wo}}{{wu}}',
      wo: {
        tag: 'span',
        template: 'hello'
      },
      wu: {
        tag: 'span',
        template: ' world'
      }
    }

    window._update = function(){
      assert.equal(document.querySelector('#app').innerHTML, '<span>hello</span><span> world</span>')
      window._update = null
      next()
    }

    app.compose(instance2)


  })

  it('compose new object', function(){
    class App extends Keet {
      constructor() {
        super()
      }
    }

    const app = new App()

    const instance = {
      template: 'test'
    }

    app.mount(instance).flush('app').link('app')

    const instance2 = {
      template: '{{wo}}{{wu}}',
      wo: {
        tag: 'span',
        template: 'hello'
      },
      wu: {
        tag: 'span',
        template: ' world'
      }
    }

    app.compose(instance2)

    assert.equal(document.querySelector('#app').innerHTML, '<span>hello</span><span> world</span>')

  })

  it('link with arguments', function(){
    class App extends Keet {
      constructor() {
        super()
      }
    }

    const app = new App()

    const instance = {
      template: 'test'
    }

    app.flush('app').link('app', instance)

    assert.equal(document.querySelector('#app').innerHTML, 'test')

  })

  it('cluster', function(next){
    class App extends Keet {
      constructor() {
        super()
      }
    }

    const app = new App()

    const instance = {
      template: 'test'
    }

    function fn(){
      assert.equal(document.querySelector('#app').innerHTML, 'test')
      next()
    }

    app.mount(instance).flush('app').link('app').cluster(fn)

  })

  it('ignore cluster arguments not of function', function(){
    class App extends Keet {
      constructor() {
        super()
      }
    }

    const app = new App()

    const instance = {
      template: 'test'
    }

    const fn = ''

    app.mount(instance).flush('app').link('app').cluster(fn)

    assert.equal(document.querySelector('#app').innerHTML, 'test')

  })

  it('get list', function(){
    class App extends Keet {
      constructor() {
        super()
      }
    }

    const app = new App()

    const instance = {
      template: '<span>{{name}}</span>',
      list: [
        {name: 'joe'}
      ]
    }

    app.mount(instance).flush('app').link('app')

    assert.equal(Array.isArray(app.list()), true)

  })

  it('get not a list', function(){
    class App extends Keet {
      constructor() {
        super()
      }
    }

    const app = new App()

    const instance = {
      template: '<span>{{name}}</span>'
    }

    app.mount(instance).flush('app').link('app')

    assert.equal(app.list().length, 0)

  })

  it('add class', function(){
    class App extends Keet {
      constructor() {
        super()
      }
    }

    const app = new App()

    const instance = {
      template: '{{wo}}',
      wo: {
        tag: 'span',
        class: ['do', 'me'],
        template: 'hello'
      }
    }

    app.mount(instance).flush('app').link('app')

    app.addClass('wo', 'sup')

    assert.equal(document.querySelector('#app').innerHTML, '<span class="do me sup">hello</span>')

  })

  it('remove class', function(){
    class App extends Keet {
      constructor() {
        super()
      }
    }

    const app = new App()

    const instance = {
      template: '{{wo}}',
      wo: {
        tag: 'span',
        class: ['do', 'me'],
        template: 'hello'
      }
    }

    app.mount(instance).flush('app').link('app')

    app.removeClass('wo', 'me')

    assert.equal(document.querySelector('#app').innerHTML, '<span class="do">hello</span>')

  })

  it('not remove class', function(){
    class App extends Keet {
      constructor() {
        super()
      }
    }

    const app = new App()

    const instance = {
      template: '{{wo}}',
      wo: {
        tag: 'span',
        class: ['do', 'me'],
        template: 'hello'
      }
    }

    app.mount(instance).flush('app').link('app')

    app.removeClass('wo', 'mee')

    assert.equal(document.querySelector('#app').innerHTML, '<span class="do me">hello</span>')

  })

  it('swap class', function(){
    class App extends Keet {
      constructor() {
        super()
      }
    }

    const app = new App()

    const instance = {
      template: '{{wo}}',
      wo: {
        tag: 'span',
        class: ['do'],
        template: 'hello'
      }
    }

    app.mount(instance).flush('app').link('app')

    app.swapClass('wo', true, ['me', 'do'])

    assert.equal(document.querySelector('#app').innerHTML, '<span class="me">hello</span>')

  })

  it('swap class reverse', function(){
    class App extends Keet {
      constructor() {
        super()
      }
    }

    const app = new App()

    const instance = {
      template: '{{wo}}',
      wo: {
        tag: 'span',
        class: ['me'],
        template: 'hello'
      }
    }

    app.mount(instance).flush('app').link('app')

    app.swapClass('wo', false, ['me', 'do'])

    assert.equal(document.querySelector('#app').innerHTML, '<span class="do">hello</span>')

  })

  it('not swap class', function(){
    class App extends Keet {
      constructor() {
        super()
      }
    }

    const app = new App()

    const instance = {
      template: '{{wo}}',
      wo: {
        tag: 'span',
        class: ['do'],
        template: 'hello'
      }
    }

    app.mount(instance).flush('app').link('app')

    app.swapClass('wo', false, ['some', 'do'])

    assert.equal(document.querySelector('#app').innerHTML, '<span class="do">hello</span>')

  })

  it('swap attributes', function(){
    class App extends Keet {
      constructor() {
        super()
      }
    }

    const app = new App()

    const instance = {
      template: '{{wo}}',
      wo: {
        tag: 'span',
        id: 'hello',
        template: 'hello'
      }
    }

    app.mount(instance).flush('app').link('app')

    app.swapAttr('wo', true, ['hello', 'do'], 'id')

    assert.equal(document.querySelector('#app').innerHTML, '<span id="do">hello</span>')

  })

  it('swap attributes reverse', function(){
    class App extends Keet {
      constructor() {
        super()
      }
    }

    const app = new App()

    const instance = {
      template: '{{wo}}',
      wo: {
        tag: 'span',
        id: 'do',
        template: 'hello'
      }
    }

    app.mount(instance).flush('app').link('app')

    app.swapAttr('wo', false, ['hello', 'do'], 'id')

    assert.equal(document.querySelector('#app').innerHTML, '<span id="hello">hello</span>')

  })

  it('set attribute', function(){
    class App extends Keet {
      constructor() {
        super()
      }
    }

    const app = new App()

    const instance = {
      template: '{{wo}}',
      wo: {
        tag: 'span',
        id: 'do',
        template: 'hello'
      }
    }

    app.mount(instance).flush('app').link('app')

    app.setAttr('wo', 'id', 'foo')

    assert.equal(document.querySelector('#app').innerHTML, '<span id="foo">hello</span>')

  })

  it('toggle display', function(){
    class App extends Keet {
      constructor() {
        super()
      }
    }

    const app = new App()

    const instance = {
      template: '{{wo}}',
      wo: {
        tag: 'span',
        style: {
          display: 'none'
        },
        template: 'hello'
      }
    }

    app.mount(instance).flush('app').link('app')

    app.toggle('wo', 'block')

    assert.equal(document.querySelector('#app').innerHTML, '<span style="display:block;">hello</span>')

  })

  it('get display', function(){
    class App extends Keet {
      constructor() {
        super()
      }
    }

    const app = new App()

    const instance = {
      template: '{{wo}}',
      wo: {
        tag: 'span',
        style: {
          display: 'none'
        },
        template: 'hello'
      }
    }

    app.mount(instance).flush('app').link('app')

    app.getDisplay('wo')

    assert.equal(app.getDisplay('wo'), 'none')

  })

  it('content update', function(){
    class App extends Keet {
      constructor() {
        super()
      }
    }

    const app = new App()

    const instance = {
      template: '{{wo}}',
      wo: {
        tag: 'span',
        template: 'hello'
      }
    }

    app.mount(instance).flush('app').link('app')

    app.contentUpdate('wo', 'hello wold')

    assert.equal(document.querySelector('#app').innerHTML, '<span>hello wold</span>')

  })

  it('checkbox checked', function(){
    class App extends Keet {
      constructor() {
        super()
      }
    }

    const app = new App()

    const instance = {
      template: '{{wo}}',
      wo: {
        tag: 'input',
        type: 'checkbox',
        checked: '',
        'k-click': 'clickHandler()'
      },
      clickHandler: function(evt){
        assert.equal(app.vdom().childNodes[0].checked, true)
      }
    }

    app.mount(instance).flush('app').link('app')

    const clickCheckbox = new Event('click', {
      'bubbles': true,
      'cancelable': true
    })

    app.vdom().childNodes[0].dispatchEvent(clickCheckbox)

  })

  it('checkbox unchecked', function(){
    class App extends Keet {
      constructor() {
        super()
      }
    }

    const app = new App()

    const instance = {
      template: '{{wo}}',
      wo: {
        tag: 'input',
        type: 'checkbox',
        checked: 'checked',
        'k-click': 'clickHandler()'
      },
      clickHandler: function(evt){
        assert.equal(app.vdom().childNodes[0].checked, false)
      }
    }

    app.mount(instance).flush('app').link('app')

    const clickCheckbox = new Event('click', {
      'bubbles': true,
      'cancelable': true
    })

    app.vdom().childNodes[0].dispatchEvent(clickCheckbox)

  })

  it('checkbox checked from instance prop', function(){
    class App extends Keet {
      constructor() {
        super()
      }
    }

    const app = new App()

    const instance = {
      template: '{{wo}}',
      wo: {
        tag: 'input',
        type: 'checkbox',
        checked: ''
      }
    }

    app.mount(instance).flush('app').link('app')

    instance.wo.checked = 'checked'

    assert.equal(app.vdom().childNodes[0].checked, true)

  })

  it('checkbox unchecked from instance prop', function(){
    class App extends Keet {
      constructor() {
        super()
      }
    }

    const app = new App()

    const instance = {
      template: '{{wo}}',
      wo: {
        tag: 'input',
        type: 'checkbox',
        checked: 'checked'
      }
    }

    app.mount(instance).flush('app').link('app')

    instance.wo.checked = ''

    assert.equal(app.vdom().childNodes[0].checked, false)

  })

  

  /*it('no new dom', function () {

    class App extends Keet {
      constructor(){
        super()
      }
    }

    const app = new App()

    let hexesIns

    const hexesFn = () => {

      let hexes = new App()

      hexesIns = {
        template: '{{h}}{{g}}',
        h: {
          tag: 'div',
          id: 'h'
        },
        g: {
          tag: 'div',
          id: 'g'
        }
      }

      hexes.mount(hexesIns).link('loader')
    } 

    let instance = {
      template: '{{loader}}{{dashboard}}',
      loader: {
        tag: 'div',
        id: 'loader',
        class: '["show"]',
      },
      dashboard: {
        tag: 'div',
        id: 'dashboard',
        class: '["hidden"]',
      }
    }

    app.mount(instance).flush('app').link('app').cluster(hexesFn)

    hexesIns.template = '{{h}}'

    app.swapClass('loader', false, ['show', 'hidden'])
    app.swapClass('dashboard', true, ['show', 'hidden'])

    // log(app.vdom().childNodes[0].id)

  })*/

})