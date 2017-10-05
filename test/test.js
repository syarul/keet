const assert = require('assert')
const { JSDOM } = require('jsdom')

const Keet = require('../')

describe('mocha tests', function () {

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

})