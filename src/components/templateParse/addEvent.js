import { getId } from '../../../utils'

const DOCUMENT_ELEMENT_TYPE = 1

const re = /{{([^{}]+)}}/g
const modelRaw = /\{\{model:([^{}]+)\}\}/g

function lookUpEvtNode (node) {
  // check if node is visible on DOM and has attribute evt-node
  if (node.hasAttribute('id') && getId(node.id) && node.hasAttribute('evt-node')) {
    return true
  }
  return false
}

function lookupParentNode(rootNode, node){
  let cNode
  while(node){
    cNode = node
    node = node.parentNode
    if(cNode.nodeType === DOCUMENT_ELEMENT_TYPE && cNode.hasAttribute('kdata-id')){
      return cNode.getAttribute('kdata-id')
    }
    if(cNode.isEqualNode(rootNode)){
      node = null
    }
  }
}

let nodeAttributes
let i = 0
let a
let ns
let evtName
let h
let handlerArgs
let argv
let handler
let fn
let name
let p
let model
let rep
let t

const getIndex = id => model.list.map(m => m['kdata-id']).indexOf(id)

export default function (node) {

  nodeAttributes = node.attributes
  // l(node)
  if (lookUpEvtNode(node)) {
    // skip addding event for node that already has event
    // to allow skipping adding event the node must include `id`
  } else {
    // only add event when node does not has one
    for (i = nodeAttributes.length; i--;) {
      a = nodeAttributes[i]
      name = a.localName
      ns = a.nodeValue
      if (/^k-/.test(name)) {
        evtName = name.replace(/^k-/, '')
        handler = ns.match(/[a-zA-Z]+(?![^(]*\))/)[0]
        let c = this[handler]
        // l(node)
        if(handler === 'clearCompleted'){
          // tr(1)
          // l(getId(node.id))
        }
        if (this[handler] !== undefined && typeof this[handler] === 'function') {
          h = ns.match(/\(([^{}]+)\)/)
          handlerArgs = h ? h[1] : ''
          argv = handlerArgs.split(',').filter(function (f) {
            return f !== ''
          })
          
          // if node is the rootNode for model, we wrap the eventListener and
          // rebuild the arguments by appending id/className util rootNode.
          if (node.hasChildNodes() && node.firstChild.nodeType !== DOCUMENT_ELEMENT_TYPE && node.firstChild.nodeValue.match(modelRaw)) {
            // rep = node.firstChild.nodeValue.replace(re, '$1').trim()
            // rep = rep.replace('model:', '')
            // model = this[rep]
            // function fn(e) {
            //   e.stopPropagation()
            //   if (e.target !== e.currentTarget) {
            //     t = lookupParentNode(node, e.target)
            //     // l(e.currentTarget, e.target)
            //     // l(handler)
            //     l(this[handler])
            //     this[handler].apply(this, [model.list[getIndex(t)], e.target, e])
            //   }
            // }
            // node.addEventListener(evtName, fn.bind(this), false)
          } else {
            // l(node, handler)
            node.addEventListener(evtName, c.bind.apply(c.bind(this), [node].concat(argv)), false)
          }

          // if(!node.hasAttribute('evt-node')){
          //   node.setAttribute('evt-node', '')
          //   if (node.hasAttribute('id')) {
          //     p = this.__pristineFragment__.getElementById(node.id)
          //     if(p) p.setAttribute('evt-node', '')
          //   }
          // }

        }
      }
    }
  }
}
