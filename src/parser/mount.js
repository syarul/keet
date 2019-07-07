import {
  styleToStr,
  vTreeChildRenderer,
  activeComponents
} from './extra'

async function wrapperVtTree (element, exec) {
  let renderChild = await exev 
}

/**
 * @private
 * @description
 * Recursive render virtual DOM Tree
 *
 * @param {String|Object} virtualNode - transformed jsx
 */

async function walkVTree (virtualNode, guid) {
  // console.log(arguments)
  if(virtualNode === null || (typeof virtualNode === 'boolean' && !virtualNode)) 
    return
  else if(typeof virtualNode === 'string' || typeof virtualNode === 'number') 
    return document.createTextNode(virtualNode)

  guid = guid || virtualNode.guid

  const { elementName, attributes, children } = virtualNode

  if(typeof virtualNode.elementName === 'function') {
    // console.log(virtualNode)
    return await vTreeChildRenderer.call(this, virtualNode, walkVTree)
  } else if(Array.isArray(virtualNode)){

    let INNER_VTREES = []

    // virtualNode.map((vNode, cIdx) => {
    //   if(typeof vNode.elementName === 'function'){
    //     INNER_VTREES.push(vTreeChildRenderer.call(this, vNode, walkVTree, `${vNode.guid}-${cIdx}`))
    //   } else {
    //     INNER_VTREES.push(walkVTree.call(this, vNode, `${vNode.guid}-${cIdx}`))
    //   }
    // })

    virtualNode.map(vNode => {
      if(typeof vNode.elementName === 'function'){
        INNER_VTREES.push(vTreeChildRenderer.call(this, vNode, walkVTree, null, true))
      } else {
        INNER_VTREES.push(walkVTree.call(this, vNode))
      }
    })
    
    return await Promise.all(INNER_VTREES)
  }

  const el = document.createElement(elementName)

  Object.keys(attributes || {}).forEach(attr => {
    // handle camelCase React eventListener
    if(typeof attributes[attr] === 'function' && attr.match(/^on/)){
      el.removeAttribute(attr)
      el.addEventListener(attr.replace(/^on/, '').toLowerCase(), attributes[attr].bind(this), false)
    // handle React className
    } else if(attr === 'className' || attr === 'class'){
      if(typeof attributes.class === 'object'){
        el.setAttribute('class', Object.keys(attributes.class)
          .filter(c => attributes.class[c])
          .map(c => c)
          .join(' ')
        )
      } else {
        el.setAttribute('class', attributes[attr])
      }
    } else if(attr === 'style' && typeof attributes[attr] === 'object'){
      el.setAttribute(attr, styleToStr(attributes[attr]))
    } else if(typeof attributes[attr] === 'boolean'){
      attributes[attr] && el.setAttribute(attr, '')
    } else {
      el.setAttribute(attr, attributes[attr])
    }
  })

  const CHILD_VTREES = [];


  (children || []).forEach(child => {
    if(child === null || typeof child === 'boolean' && !child) return
    CHILD_VTREES.push(walkVTree.call(this, child))
  })

  let childVnodes = await Promise.all(CHILD_VTREES)

  childVnodes.map(vnode => { 
    if(Array.isArray(vnode)){
      // console.log(vnode)
      vnode.map(v => el.appendChild(v))
    } else {
      el.appendChild(vnode)
    }
  })

  // console.log(virtualNode)

  return el
}

function mount (virtualNode) {
  walkVTree.call(this, virtualNode).then(vnode => {
    this.vnode = vnode
    this.mergeComponent(this)
  })
}

export default mount
