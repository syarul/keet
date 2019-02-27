import replaceCommentBlock from './replaceCommentBlock'
import inspectAttributes from './inspectAttributes'
import replaceHandleBars from './replaceHandleBars'
import conditionalNodes from '../conditionalNodes'

import { getId } from '../../../utils'
import { addEvent, addEventModel } from './addEvent'

const conditionalNodesRawStart = /\{\{\?([^{}]+)\}\}/g
const reConditional = /([^{?])(.*?)(?=\}\})/g
const re = /{{([^{}]+)}}/g
const modelRaw = /\{\{model:([^{}]+)\}\}/g

const DOCUMENT_ELEMENT_TYPE = 1
const DOCUMENT_COMMENT_TYPE = 8

function testEventNode (node) {
  let nodeAttributes = node.attributes
  let i = 0
  let a
  let name
  let value
  let evtName
  let idx
  let tempFn

  while (i < nodeAttributes.length) {
    a = nodeAttributes[i]
    name = a.localName
    value = a.nodeValue
    if (/^on/.test(name)) {
      evtName = name.replace(/^on/, '')
      node.removeAttribute(a.name)
      idx = this.__refEvents__.map(r => r.id).indexOf(value)
      if(~idx){
        tempFn = this.__refEvents__[idx].expression
        this.__refEvents__.splice(idx, 1)
      } else {
        // dirty method *** NOT RECOMMENDED ***
        // use eval to reassign function strings
        try {
          eval(`tempFn = ${value}`)
        } catch(e){
          // on failed silently skip
          tempFn = function (){}
        }
        // deal with es2015 transpiling context
        window._this2 = this || null
      }
      // additionally bound to the component context instead of the Element itself
      node.addEventListener(evtName, tempFn.bind(this), false)
    }
    i++
  }
}

function removeEventNode (node) {
  let nodeAttributes = node.attributes
  let i = 0
  let a
  let name

  while (i < nodeAttributes.length) {
    a = nodeAttributes[i]
    name = a.localName
    if (/^on/.test(name)) {
      node.removeAttribute(a.name)
    }
    i++
  }
  this.__refEvents__ = []
}

let currentNode

function recon (node) {
  while (node) {
    currentNode = node
    node = node.nextSibling
    if (currentNode.nodeType === DOCUMENT_ELEMENT_TYPE) {
      if (currentNode.hasAttributes()) {
        // to take advantage of caching always assigned id to the node
        // we only assign eventListener on first mount to DOM or when the node is not available on DOM
        if (!getId(currentNode.id)) {
          testEventNode.call(this, currentNode)
        } else {
          removeEventNode.call(this, currentNode)
        }
      }
      recon.call(this, currentNode.firstChild)
    }
  }
}

function reconcile () {
  recon.apply(this, arguments)
}

export default reconcile
