import {
  styleToStr,
  switchCase,
  componentChildRender,
  activeComponents
} from './extra'

import { typeCheck } from '../utils'

import { assign } from 'lodash'

const processAttr = (attr, value) => {
  return [
    attr === 'style' && typeof value === 'object',
    attr.match(/^on/) && typeof value === 'function',
    attr === 'className' || attr === 'class',
    // attr === 'value',
    // attr === 'checked',
    typeof value === 'boolean',
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
    if(typeof value === 'object'){
      el.setAttribute('class', 
        Object.keys(value)
          .filter(c => value[c])
          .map(c => c)
          .join(' ')
      )
    } else {
      el.setAttribute('class', value)
    }
  },
  bool: function (el, attr, value) {
    value && el.setAttribute(attr, '')
  },
  // value: function (el, attr, value) {
  //   if(el.nodeName === 'INPUT') el.value = value
  // },
  // checked: function (el, attr, value) {
  //   if(el.nodeName === 'INPUT') el.checked = value
  // },
  // default attributes assignment
  default: function (el, attr, value) {
    el.setAttribute(attr, value)
  }
}

const processChild = child => {
  return [
    Array.isArray(child),
    child.elementName && typeof child.elementName === 'function',
    child.elementName && typeof child.elementName === 'object'
  ].indexOf(true)
}

const childCases = {
  // child is array of nodes
  _array: function (child, el, render) {
    child.map((c, cIdx) => {
      if(typeof c.elementName === 'function'){
        componentChildRender.call(this, c, el, render, `${c.guid}-${cIdx}`)
      } else {
        el.appendChild(render.call(this, c))
      }
    })
  },
  _function: componentChildRender,
  // component from object
  _object: function (child, el) {
    el.appendChild(render.call(this, child.elementName))
  },
  // default render operation
  default: function (child, el) {
    // console.log(child)
    el.appendChild(render.call(this, child))
    // console.log(el, r)
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
  // console.log(virtualNode, typeof virtualNode)
  if(virtualNode === null) 
    return
  else if(typeof virtualNode === 'string' || typeof virtualNode === 'number') 
    return document.createTextNode(virtualNode)
  else if(typeof virtualNode === 'boolean' && !virtualNode){
    return
  }

  const { guid, elementName } = virtualNode

  const element = document.createElement(elementName)

  // console.log(virtualNode, element)

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
    if(child === null || typeof child === 'boolean' && !child) return
    const argv = [
      child,
      element,
      render
    ]
    // console.log(child)
    switchCase(childCases, 'default')(
      processChild(...argv)
    ).apply(this, argv)
  })

  return element
}

function mountJSX (virtualNode) {
  console.log(activeComponents, this)
  if(activeComponents[this.guid]){
    const component = activeComponents[this.guid]
    assign(component.props, virtualNode.attributes)
    // component.batchUpdate()
  } else {
    this.vnode = render.call(this, virtualNode)
    this.vRendered(this)
  }
  // this.guid = this.guid || virtualNode.guid
  // virtualNode.guid = this.guid
  // console.log(virtualNode, this)
  // let t = new Date()
  // console.log(new Date() - t, virtualNode)
}

export default mountJSX
