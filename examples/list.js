import Keet from '../keet'

import mythChars, { app as mythCharsApp } from './mythChars'

/**
 * usage on how to handle Array list operation
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/prototype
*/

class App extends Keet {
  constructor() {
    super()
  }
  /**
   * The pop() method removes the last element from an array and returns that element. 
   * This method changes the length of the array.
  */
  pop() {
    mythCharsApp.list.pop()
  }
  /**
   * The shift() method removes the first element from an array and returns that 
   * removed element. This method changes the length of the array.
  */
  shift() {
    mythCharsApp.list.shift()
  }
  /**
   * The unshift() method adds one or more elements to the beginning of an array and 
   * returns the new length of the array.
  */
  unshift() {
    mythCharsApp.list.unshift({ id: 'id3', name: 'Fire Phoenix' })
  }
  /**
   * The push() method adds one or more elements to the end of an array and returns 
   * the new length of the array.
  */
  push() {
    mythCharsApp.list.push({ id: 'id4', name: 'Black Dragon' })
  }
  /**
   * The splice() method changes the contents of an array by removing existing 
   * elements and/or adding new elements.
  */
  splice() {
    mythCharsApp.list.splice(1, 0, { id: 'id5', name: 'Hell Hound' })
  }
}

const vmodel = {
  header: {
    tag: 'h1',
    template: 'Array Operations'
  },
  pop: {
    tag: 'button',
    'k-click': 'pop()',
    template: 'pop()'
  },
  shift: {
    tag: 'button',
    'k-click': 'shift()',
    template: 'shift()'
  },
  unshift: {
    tag: 'button',
    'k-click': 'unshift()',
    template: 'unshift({ id: \'id3\', name: \'Fire Phoenix\' })'
  },
  push: {
    tag: 'button',
    'k-click': 'push()',
    template: 'push({ id: \'id4\', name: \'Black Dragon\' })'
  },
  splice: {
    tag: 'button',
    'k-click': 'splice()',
    template: 'splice(1, 0, { id: \'id5\', name: \'Hell Hound\' })'
  },
  container: {
  	tag: 'div',
  	style: {
    	'margin-top': '20px'
    },
  	id: 'container'
  }
}

const app = new App

app.mount(vmodel).link('app').cluster(mythChars)
