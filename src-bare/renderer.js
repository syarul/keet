import walk from './walk'
/**
 * @private
 * @decorator
 * Add internal pub/sub to component
 */
function eventHooks () {
  return function (target) {
    /**
    * Returns a reference to the eventName reg, so the chained function is called
    * @param {string} reg - the identifier eventName
    * @param {function} fn - the function to chained
    */
    target.prototype.on = function (reg, fn) {
      if(typeof fn !== 'function') throw new Error('Second argument is not a function.')
      this.__ref__ = this.__ref__ || {}
      this.__ref__[reg] = fn
      return reg
    }

    /**
    * Removes the specified listener from the listener array for the event named reg
    * @param {string} register - the register index identifier
    */
    target.prototype.removeListener = function (reg) {
      delete this.__ref__[reg]
    }

    /**
    * Synchronously calls a listener registered for the event named reg
    * @param {string} reg - the event name
    * @param {...*} value - one or more parameters to emit to listener
    */
    target.prototype.emit = function () {
      const reg = [].shift.call(arguments)
      typeof this.__ref__[reg] === 'function' && this.__ref__[reg].apply(null, arguments)
    }
  }
}

function camelCase (s, o) {
  return `${s.replace(/([A-Z]+)/g, '-$1').toLowerCase()}:${o[s]};`
}

function styleToStr (obj) {
  let style = ''
  for (let attr in obj) {
    style += camelCase(attr, obj)
  }
  return style
}

function classes (el, attr, value) {
  if (typeof value === 'object') {
    el.setAttribute('class', Object.keys(value)
      .filter(c => value[c])
      .map(c => c)
      .join(' ')
    )
  } else {
    el.setAttribute('class', value)
  }
}

function evt (el, attr, value) {
  el.removeAttribute(attr)
  el.addEventListener(attr.replace(/^on/, '').toLowerCase(), () => {
  	value && value()
  }, false)
}

function parseAttr (el, attr, value) {
  if (typeof value === 'function' && attr.match(/^on/)) {
    return evt.apply(null, arguments)
  } else if (attr === 'className' || attr === 'class') {
    return classes.apply(null, arguments)
  } else if (attr === 'style' && typeof value === 'object') {
    return el.setAttribute(attr, styleToStr(value))
  } else if (typeof value === 'boolean') {
    return value && el.setAttribute(attr, '')
  } else {
    return el.setAttribute(attr, value)
  }
}

function createEl (vtree, fragment) {
  fragment = fragment || document.createDocumentFragment()

  if (vtree === null) return fragment

  const { elementName, attributes, children } = vtree || {}

  let node = null

  if (typeof vtree === 'object') {
    node = document.createElement(elementName)

    attributes && Object.keys(attributes).map(attr => {
      parseAttr(node, attr, attributes[attr])
    })
  } else {
  	console.log(vtree)
    node = document.createTextNode(vtree)
  }

  if (children && children.length) {
    children.map(child => createEl(child, node))
  }

  fragment.appendChild(node)

  return fragment
}

@eventHooks()
class Renderer {
  
  render (App, props, rootNode) {

  	const vtree = (<App {...props} />)

    console.log(vtree)
    const el = createEl(vtree)
    rootNode.appendChild(el)

    this.on('event-rendered', () => {

        console.log('event-rendered')

        let nvtree = (<App {...props} />)
  		console.log(nvtree)
        
    })
  }

  rerender() {
  	let node = walk(this.__vtree__)
  	console.log(node)
  }
}

const keetRenderer = new Renderer()

export default keetRenderer
