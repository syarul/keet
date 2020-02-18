import keetRenderer from './renderer'
import { composite } from '../src-pragma/utils'

function pureFunction(props, fn, KeetRenderer) {

  this.render = props => {
    return fn(props)
  }

  this.forceRender = (nextProps, handler) => {

  	props = nextProps || props

    handler = handler || function() {}

    composite.call(this)

    this.__composite__
      .then(KeetRenderer.emit.bind(KeetRenderer, 'event-rendered'))
      .then(handler)

    this._resolve(this.render(props))

  }

  return this.render(props)

}

function walk (node) {
  console.log(node)
  const { elementName, attributes, children } = node

  if (typeof elementName === 'function') {
  	return walk(elementName(attributes))
    // return walk(new pureFunction(attributes, elementName, keetRenderer))
  }

  if (children && children.length) {
    const _children = children.map(child => {
      const { elementName, attributes } = child
      if (typeof elementName === 'function') {
      	return walk(elementName(attributes))
        // return walk(new pureFunction(attributes, elementName, keetRenderer))
      }
      return child
    })

    return {
      elementName,
      attributes,
      children: _children
    }
  }

  return node
}

let map = []

function useState(value) {
  console.log(map)
  if(!map.length) map.push(value)
  return map.length === 2 ? map[1] : map[0]
}

function setState(args){
	map.push(args)
	if(map.length > 2) {
		map.shift()
	}
	console.log(map)
	keetRenderer.emit.call(keetRenderer, 'event-rendered')
}

export {
	walk as default,
	setState,
	useState
}
