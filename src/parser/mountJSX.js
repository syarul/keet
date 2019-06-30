import { isFunction, isObject, isArray, assign } from 'lodash'
import {
  styleToStr,
  switchCase,
  componentChildRender
} from './extra'

const processAttr = (attr, value) => {
  return [
    attr === 'style' && isObject(value),
    attr.match(/^on/) && isFunction(value),
    attr === 'className'
  ].indexOf(true)
}

const attrCases = {
  // style as js object also resolve camelcase naming
  style: function (el, attr, value) {
    el.setAttribute(attr, styleToStr(value))
  },
  // inline eventListener conversion to scoped listener
  inline: function (el, attr, value) {
    el.removeAttribute(attr)
    el.addEventListener(attr.replace(/^on/, '').toLowerCase(), value.bind(this), false)
  },
  // convert react className to standard class
  className: function (el, attr, value) {
    el.removeAttribute(attr)
    el.setAttribute('class', value)
  },
  // default attributes assignment
  default: function (el, attr, value) {
    el.setAttribute(attr, value)
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
    child.map(c => el.appendChild(render.call(this, c)))
  },
  _function: componentChildRender,
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
  if (typeof virtualNode === 'string') {
    return document.createTextNode(virtualNode)
  }

  console.log(arguments)

  const element = document.createElement(virtualNode.elementName)

  const { guid } = virtualNode

  Object.keys(virtualNode.attributes || {}).forEach(attr => {
    const argv = [
      attr,
      virtualNode.attributes[attr]
    ]

    switchCase(attrCases, 'default')(
      processAttr(...argv)
    ).apply(this, [element, ...argv])
  });

  (virtualNode.children || []).forEach(child => {
    const argv = [
      child,
      element,
      render,
      guid
    ]

    switchCase(childCases, 'default')(
      processChild(...argv)
    ).apply(this, argv)
  })

  return element
}

function mountJSX () {
  this.vnode = render.apply(this, arguments)
}

export default mountJSX
