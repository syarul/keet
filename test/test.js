const assert = require('assert')
const { JSDOM } = require('jsdom')

const Keet = require('../keet').default

const { getId, testEval } = require('../components/utils')

const tag = require('../components/tag').default
const copy = require('../components/copy').default
const classList = require('../classList').default

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
        this.greeting = ''
      }
      greet(){
        this.greeting = 'world'
      }
      componentDidMount(){
        this.greet()
        assert.equal(document.querySelector('#hw').childNodes[0].nodeValue, 'hello world')
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

    app.mount(instance).link('app')

  })

  it('will mount', function () {
    
    class App extends Keet {
      constructor(){
        super()
      }
      componentWillMount(){
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
    
    class App extends Keet {
      constructor(){
        super()
      }
    }

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
    
    class App extends Keet {
      constructor(){
        super()
      }
    }

    const app = new App()

    const instance = {
      hello: {
        tag: 'div',
        template: 'hello'
      }
    }

    let [ a, b ] = [ 0 , 0 ]

    const fn = [ function(){ a = 1 }, function(){ b =  2 }, 'not-a-function' ]

    app.mount(instance).link('app').cluster(...fn)

    assert.equal(a + b , 3)

  })

  it('handle click event', function () {

    class App extends Keet {
      constructor(){
        super()
      }
      clickHandler(evt){
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

  it('copy array', function () {
    
    let arr = [ 1, 2, 3 ]

    let cp = copy(arr)

    cp[0] = 2, cp[1] = 4, cp[2] = 6 

    assert.equal(arr.join(''), '123')
  })

  it('evaluation string', function(){
    class App extends Keet {
      constructor(){
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
    app.mount(instance).link('app')
    assert.equal(document.querySelector('#surname').childNodes[0].nodeValue, 'john')

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
          app.mount(instance).link('app')
        })
    }
    process.prependOnceListener('uncaughtException', cb)
    test()

  })

  it('evaluation string', function(){
    class App extends Keet {
      constructor(){
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
    assert.equal(document.querySelector('#app').innerHTML, 'do me')
  })

  it('classes', function(){
    class App extends Keet {
      constructor(){
        super()
        this.classes = new classList
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
  })

  it('checkbox unchecked', function(){
    class App extends Keet {
      constructor() {
        super()
      }
    }

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
  })

  it('checkbox checked', function(){
    class App extends Keet {
      constructor() {
        super()
      }
    }

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
  })

  it('state not assigned', function(){
    class App extends Keet {
      constructor(){
        super()
      }
    }
    const app = new App()
    const instance = {
      child: {
        template: '{{foo}}'
      } 
    }
    app.mount(instance).link('app')
    assert.equal(document.querySelector('#app').innerHTML, '{{foo}}')
  })

  it('parsing template without handlerbar value', function(){
    class App extends Keet {
      constructor() {
        super()
      }
    }

    const app = new App()

    const instance = { 
      template: '<span id="test">no handler to handle</span>',
      list: [
        { id: 'surname', name: 'john' }
      ]
    }
    app.mount(instance).link('app')
    assert.equal(document.querySelector('#test'), null)

  })

  it('ignore handler when is not a function', function(){
    class App extends Keet {
      constructor() {
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
  })

  it('handler with argument', function(next){
    class App extends Keet {
      constructor() {
        super()
      }
      clickHandler(sec, evt){
        assert.equal(sec, 'harder')
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

  //testEval

  it('eval undefined', function(){
    assert.equal(testEval('vsome'), false)
  })

  it('toggle display', function(){
    class App extends Keet {
      constructor() {
        super()
        this.display = 'none'
      }
      change(state){
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

  })

  it('static style', function(){
    class App extends Keet {
      constructor() {
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

  })

  it('toggle display without state', function(){
    class App extends Keet {
      constructor() {
        super()
      }
    }

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

  })

  it('has classes', function(){
    class App extends Keet {
      constructor() {
        super()
      }
    }

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

  })

  it('has classes state not assigned', function(){
    class App extends Keet {
      constructor() {
        super()
      }
    }

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

  })

  it('parsing as template', function(){
    class App extends Keet {
      constructor() {
        super()
        this.apply = 'value'
      }
      change(res){
        this.apply = res
      }
    }

    const app = new App()

    const instance = { 'template': 'just a {{apply}}' }
    app.mount(instance).link('app')
    app.change('another')
    assert.equal(document.querySelector('#app').childNodes[0].nodeValue, 'just a value')
  })

  it('parsing as style', function(){
    class App extends Keet {
      constructor() {
        super()
        this.apply = 'value'
      }
      change(res){
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

    app.mount(instance).link('app')

    app.list.shift()

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
        {me: 'juan'},
        {me: 'ruan'}
      ]
    }

    app.mount(instance).link('app')

    app.list.pop()

    assert.equal(document.querySelectorAll('SPAN').length, 2)

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

    app.mount(instance).link('app')

    app.list[0] = { me : 'susan'}

    assert.equal(document.querySelector('SPAN').childNodes[0].nodeValue, 'susan')

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

    app.mount(instance).link('app')

    app.list.unshift({me: 'foo'})

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

    app.mount(instance).link('app')

    app.list.push({me: 'foo'})

    let els = document.querySelectorAll('SPAN')

    assert.equal(els[els.length - 1].innerHTML == 'foo' && els.length == 4, true)

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

    app.mount(instance).link('app')

    app.list.splice(1, 0, {me: 'awile'})

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

    app.mount(instance).link('app')

    app.list.splice(1, 0)

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

    app.mount(instance).link('app')

    app.list.splice(1)

    let els = document.querySelectorAll('SPAN')

    assert.equal(els.length == 1 && els[0].innerHTML == 'john', true)

  })

  it('array push on empty list', function(){


    class App extends Keet {
      constructor() {
        super()
      }
    }

    const app = new App()

    const instance = {
      template: '<span>{{me}}</span>',
      list: []
    }

    app.mount(instance).link('app')

    app.list.push({ me: 'some'})

    let els = document.querySelectorAll('SPAN')

    assert.equal(els.length == 1 && els[0].innerHTML == 'some', true)

  })

  it('operation on already empty list', function(){


    class App extends Keet {
      constructor() {
        super()
      }
    }

    const app = new App()

    const instance = {
      template: '<span>{{me}}</span>',
      list: [
        { me: 'foo'},
        { me: 'bar'}
      ]
    }

    app.mount(instance).link('app')

    app.list.pop()
    app.list.pop()
    app.list.pop()

    let els = document.querySelectorAll('SPAN')

    assert.equal(els.length == 0, true)

  })

  it('nodeValue empty string', function(){


    class App extends Keet {
      constructor() {
        super()
        this.str = ''
      }
      mod(str){
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

  })

  it('node no attr', function(){


    class App extends Keet {
      constructor() {
        super()
      }
    }

    const app = new App()

    const instance = {
      ugh: {
        tag: 'div'
      }
    }

    document.querySelector('#app').innerHTML = ''

    app.mount(instance).link('app')

    assert.equal(document.querySelector('#app').childNodes[0].nodeValue, null)

  })

  it('checkbox checked programmatically', function(){
    class App extends Keet {
      constructor(...args) {
        super()
        this.ch = false
        this.args = args
      }
      change(bool){
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

    // document.querySelector('#app').childNodes[0].dispatchEvent(clickCheckbox)

  })

  it('checkbox checked programmatically falsish', function(){
    class App extends Keet {
      constructor(...args) {
        super()
        this.ch = true
        this.args = args
      }
      change(bool){
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

    // document.querySelector('#app').childNodes[0].dispatchEvent(clickCheckbox)

  })

  it('undeclared args', function(){
    class App extends Keet {
      constructor(...args) {
        super()
        this.args = args
      }
      change(bool){
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

  })

  it('undeclared args', function(){
    class App extends Keet {
      constructor() {
        super()
        this.ch = true
      }
      change(bool){
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

  })

})