import { getId } from '../../../utils'

const DOCUMENT_ELEMENT_TYPE = 1

const re = /{{([^{}]+)}}/g
const modelRaw = /\{\{model:([^{}]+)\}\}/g

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
let c
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

  for (i = nodeAttributes.length; i--;) {
    a = nodeAttributes[i]
    name = a.localName
    ns = a.nodeValue
    if (/^k-/.test(name)) {
      evtName = name.replace(/^k-/, '')
      handler = ns.match(/[a-zA-Z]+(?![^(]*\))/)[0]
      c = this[handler]
      if (c !== undefined && typeof c === 'function') {
        h = ns.match(/\(([^{}]+)\)/)
        handlerArgs = h ? h[1] : ''
        argv = handlerArgs.split(',').filter(function (f) {
          return f !== ''
        })
      
        // if node is the rootNode for model, we wrap the eventListener and
        // rebuild the arguments by appending id/className util rootNode.
        if (node.hasChildNodes() && node.firstChild.nodeType !== DOCUMENT_ELEMENT_TYPE && node.firstChild.nodeValue.match(modelRaw)) {
          rep = node.firstChild.nodeValue.replace(re, '$1').trim()
          rep = rep.replace('model:', '')
          model = this[rep]

          function fn(e) {
            e.stopPropagation()
            if (e.target !== e.currentTarget) {
              t = lookupParentNode(node, e.target)
              c.apply(this, [model.list[getIndex(t)], e.target, e])
            }
          }
          if(!getId(node.id)) node.addEventListener(evtName, fn.bind(this), false)
        } else {
          if(!getId(node.id)) node.addEventListener(evtName, c.bind.apply(c.bind(this), [node].concat(argv)), false)
        }
      }
    }
  }
}