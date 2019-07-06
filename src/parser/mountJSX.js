import {
  vTreeChildRenderer,
  activeComponents
} from './extra'

import { assign } from 'lodash'

import { h } from 'virtual-dom'
import VText from 'virtual-dom/vnode/vtext'

/**
 * @private
 * @description
 * Recursive render virtual DOM Tree
 *
 * @param {String|Object} virtualNode - transformed jsx
 */

async function vTreeRenderer (virtualNode) {

  if(virtualNode === null || (typeof virtualNode === 'boolean' && !virtualNode)) 
    return
  else if(typeof virtualNode === 'string' || typeof virtualNode === 'number') 
    return new VText(virtualNode)
  else if(typeof virtualNode.elementName === 'function')
    return await vTreeChildRenderer.call(this, virtualNode, vTreeRenderer)

  const { elementName, attributes, children } = virtualNode

  Object.keys(attributes || {}).forEach(attr => {
    // handle camelCase React eventListener
    if(typeof attributes[attr] === 'function'){
      const oldAttr = attr
      attributes[attr.toLowerCase()] = attributes[attr]
      delete attributes[oldAttr]
    // handle React className
    } else if(attr === 'className'){
      const oldAttr = attr
      attributes['class'] = attributes[attr]
      delete attributes[oldAttr]
    }
  })

  const CHILD_VTREES = [];

  (children || []).forEach(child => CHILD_VTREES.push(vTreeRenderer.call(this, child)))

  const childVtree = await Promise.all(CHILD_VTREES)

  return h(elementName, attributes, childVtree)
}

function mountJSX (virtualNode) {
  vTreeRenderer.call(this, virtualNode).then(vtree => {
    console.log(vtree)
    this.vtree = vtree
    this.isRender(this)
  })
}

export default mountJSX
