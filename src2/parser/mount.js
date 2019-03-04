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
    attr === 'value'
  ].indexOf(true)
}

const attrCases = {
  // style as js object also resolve camelcase naming
  style: function (el, attr, value) {
    el.setAttribute(attr, styleToStr(value))
  },
  // inline eventListener conversion to scoped listener
  inline: function (el, attr, value) {
    el.addEventListener(attr.replace(/^on/, ''), value.bind(this), false)
  },
  // convert react className to standard class
  className: function (el, attr, value) {
    el.setAttribute('class', value)
  },
  // pass value to element value instead as attribute
  value: function (el, attr, value) {
    el.value = value
  },
  // default attributes assignment
  default: function (el, attr, value) {
    if(isObject(value)) {
      objAttrToStr(value) ? el.setAttribute(attr, objAttrToStr(value)) : null
    } else {
      value ? isBoolean(value) ?  el.setAttribute(attr, '') : el.setAttribute(attr, value) : null
    }
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

    child.map(c => {
      // console.log(c)
      // if(isArray(c)) {
      //   console.log(c)
      //   childCases._array.call(this, c)
      // } else {
      //   switchCase(childCases, 'default')(
      //     processChild(c)
      //   ).call(this, c, el)
      // }
      if(isFunction(c.elementName)){
        let elemFn = c.elementName
        return new elemFn(c.attributes)
      }
    }).map(elem => {
      // console.log(elem)
      resolveVnode(elem).then(e => {
        el.appendChild(e)
      })
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
  if (isString(virtualNode) || isNumber(virtualNode)) {
    return document.createTextNode(virtualNode)
  } else if(isBoolean(virtualNode)) {
    return document.createTextNode('')
  } else if(isObject(virtualNode) && isFunction(virtualNode.elementName)) {
    // console.trace(virtualNode)
    return document.createTextNode('') //componentConstructorRender
  }

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
      render,
      index
    ]

    switchCase(childCases, 'default')(
      processChild(...argv)
    ).apply(this, argv)
  })

  return element
}

function mount () {
  this.vnode = render.apply(this, arguments)
  // console.log(this.state)
}

export default mount
