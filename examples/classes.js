import Keet from 'keet'
import ClassList from '@keet/classList'

/**
 * classes follow the standard element classList methods
 * https://developer.mozilla.org/en-US/docs/Web/API/Element/classList
*/

class App extends Keet {
  constructor () {
    super()
    this.classList = new ClassList()
    this.classList.add('main', 'after')
    this.parseClassList = JSON.stringify(this.classList)
  }
  _add () {
    // add( String [, String] )
    this.classList.add('next')
    this.parseClassList = JSON.stringify(this.classList)
  }
  _rem () {
    // remove( String [, String] )
    this.classList.remove('next')
    this.parseClassList = JSON.stringify(this.classList)
  }
  _item () {
    // item( Number )
    let c = this.classList.item(1)
    this.parseClassList = c
  }
  _toggle () {
    // toggle( String [, force] )
    this.classList.toggle('main')
    this.parseClassList = JSON.stringify(this.classList)
  }
  _contains () {
    // contains( String )
    let c = this.classList.contains('next')
    this.parseClassList = c
  }
  _replace () {
    // replace( oldClass, newClass )
    this.classList.replace('main', 'foo')
    this.parseClassList = JSON.stringify(this.classList)
  }
}

const app = new App()

const vmodel = {
  header: {
    template: `
      <h1>My Class Store</h1>
      <p>How to manipulate classes, follow the standard element classList methods</p>
    `
  },
  add: {
    tag: 'button',
    'k-click': '_add()',
    template: 'add(next)'
  },
  remove: {
    tag: 'button',
    'k-click': '_rem()',
    template: 'remove(next)'
  },
  item: {
    tag: 'button',
    'k-click': '_item()',
    template: 'item(1)'
  },
  toggle: {
    tag: 'button',
    'k-click': '_toggle()',
    template: 'toggle(main)'
  },
  contains: {
    tag: 'button',
    'k-click': '_contains()',
    template: 'contains(next)'
  },
  replace: {
    tag: 'button',
    'k-click': '_replace()',
    template: 'replace(main, foo)'
  },
  showcase: {
    tag: 'button',
    class: '{{classList}}',
    style: {
      background: '#bbbbbb'
    },
    template: '{{parseClassList}}'
  }
}

app.mount(vmodel).link('app')
