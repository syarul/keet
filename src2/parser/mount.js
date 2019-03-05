import { isFunction, isObject, isString, isNumber, isArray, isBoolean } from '../utils'
import {
  styleToStr,
  objAttrToStr,
  switchCase,
  componentConstructorRender
} from './construct'

import { resolveVnode } from '../v'

const processAttr = (attr, value) => {
  return [
    attr === 'style' && isObject(value),
    attr.match(/^on/) && isFunction(value),
    attr === 'className',
    attr === 'value',
    attr !== 'style' && isObject(value)
  ].indexOf(true)
}

const attrCases = {
  // style as js object also resolve camelcase naming
  style: function (el, attr, value) {
    el.setAttribute(attr, styleToStr(value))
  },
  // inline eventListener conversion to scoped listener, lowercase naming
  inline: function (el, attr, value) {
    el.addEventListener(attr.replace(/^on/, '').toLowerCase(), value.bind(this), false)
  },
  // convert react className to standard class
  className: function (el, attr, value) {
    el.setAttribute('class', value)
  },
  // pass value to element value instead as attribute
  value: function (el, attr, value) {
    el.value = value
  },
  _object: function (el, attr, value) {
    objAttrToStr(value) ? el.setAttribute(attr, objAttrToStr(value)) : null
  },
  // default attributes assignment
  default: function (el, attr, value) {
    value !== (undefined||null||false) ? isBoolean(value) ?  el.setAttribute(attr, '') : el.setAttribute(attr, value) : null
  }
}

const processChild = child => {
  return [
    isArray(child),
    child.elementName && isFunction(child.elementName),
    child.elementName && isObject(child.elementName)
  ].indexOf(true)
}

const childCases = {
  // child is array of nodes
  _array: function (child, el) {
    child.map((c, i) => componentConstructorRender.call(this, c, el, null, i))
      .map(async elem => {
        let e = await elem
        el.appendChild(e)
      })

  },
  _function: componentConstructorRender,
  // component from object
  _object: function (child, el) {
    el.appendChild(render.call(this, child.elementName))
  },
  // default render operation
  default: function (child, el) {
    el.appendChild(render.call(this, child))
  }
}

/**
 * @private
 * @description
 * Mount a virtualNode
 *
 * @param {String|Object} virtualNode - the transform code
 */
function render (virtualNode) {
  // console.log(virtualNode)
  if (isString(virtualNode) || isNumber(virtualNode)) {
    return document.createTextNode(virtualNode)
  } /*else if(isBoolean(virtualNode)) {
    return document.createTextNode('')
  } /*else if(isObject(virtualNode) && virtualNode.elementName === 'button') {
    console.trace(virtualNode)
    // console.log()
    return document.createTextNode('') //componentConstructorRender
  }*/

  const element = document.createElement(virtualNode.elementName)

  Object.keys(virtualNode.attributes || {}).forEach(attr => {
    const argv = [
      attr,
      virtualNode.attributes[attr]
    ]

    switchCase(attrCases, 'default')(
      processAttr(...argv)
    ).apply(this, [element, ...argv])
  });

  (virtualNode.children || []).forEach((child, index) => {

    if(child === (undefined || null)) return false
    // if(child.elementName && child.elementName === 'li' && child.elementName === 'li'){
      // console.log(child)
    // }
    const argv = [
      child,
      element,
      render
    ]

    switchCase(childCases, 'default')(
      processChild(...argv)
    ).apply(this, argv)
  })

  return element
}

function mount () {
  this.vnode = render.apply(this, arguments)
  console.log(this.vnode)
}

export default mount
