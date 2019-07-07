import {
  vTreeChildRenderer,
  activeComponents
} from './extra'

import { h } from 'virtual-dom'
import createElement from 'virtual-dom/create-element'
import VText from 'virtual-dom/vnode/vtext'

// function SetValue(val) {
//     this.val = val
// }

// SetValue.prototype.hook = function (elem, propName, previous) {
//     var val = this.val
//     // check before set logic
//     if (previous === undefined ||
//         typeof previous !== "object" ||
//         getPrototype(previous) !== getPrototype(this) || 
//         val !== previous.val) {
//         elem[propName] = val
//     }
// }

// function getPrototype(value) {
//     if (Object.getPrototypeOf) {
//         return Object.getPrototypeOf(value)
//     } else if (value.__proto__) {
//         return value.__proto__
//     } else if (value.constructor) {
//         return value.constructor.prototype
//     }
// }

/**
 * @private
 * @description
 * Recursive render virtual DOM Tree
 *
 * @param {String|Object} virtualNode - transformed jsx
 */

async function walkVTree (virtualNode, guid) {
  if(virtualNode === null || (typeof virtualNode === 'boolean' && !virtualNode)) 
    return
  else if(typeof virtualNode === 'string' || typeof virtualNode === 'number') 
    return new VText(virtualNode)

  guid = guid || virtualNode.guid

  if(typeof virtualNode.elementName === 'function')
    return await vTreeChildRenderer.call(this, virtualNode, walkVTree)
  else if(Array.isArray(virtualNode)){

    let INNER_VTREES = []

    virtualNode.map((vNode, cIdx) => {
      if(typeof vNode.elementName === 'function'){
        INNER_VTREES.push(vTreeChildRenderer.call(this, vNode, walkVTree, `${vNode.guid}-${cIdx}`))
      } else {
        INNER_VTREES.push(walkVTree.call(this, vNode, `${vNode.guid}-${cIdx}`))
      }
    })
    
    return await Promise.all(INNER_VTREES)
  }

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

  let tagName = elementName

  // if(tagName === 'INPUT' && attributes && attributes.value){
  //   attributes.value = new SetValue(attributes.value)
  // }
  
  if(attributes && attributes.id){
    tagName += `#${attributes.id}`
  }

  if(attributes && attributes.class){
    let classes = ''
    if(typeof attributes.class === 'object'){
      classes = Object.keys(attributes.class)
        .filter(c => attributes.class[c])
        .map(c => c)
        .join('.')
    } else {
      classes = attributes.class.split(' ').join('.')
    }
    tagName += `.${classes}`
  }


  const CHILD_VTREES = [];

  (children || []).forEach(child => CHILD_VTREES.push(walkVTree.call(this, child)))

  const childVtree = await Promise.all(CHILD_VTREES)

  return h(tagName, attributes, childVtree)
}

function mount (virtualNode) {
  walkVTree.call(this, virtualNode).then(vtree => {
    this.vtree = vtree
    this.mergeComponent(this)
  })
}

export default mount
