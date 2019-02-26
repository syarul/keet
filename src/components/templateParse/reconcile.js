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

  while (i < nodeAttributes.length) {
    a = nodeAttributes[i]
    name = a.localName
    value = a.nodeValue
    if (/^on/.test(name)) {
      evtName = name.replace(/^on/, '')
      node.removeAttribute(a.name)
      let tempFn
      // use eval to reassign function strings
      // additionally bound the context to the component context instead of the DOM itself
      try {
        eval(`tempFn = ${value}`)
      } catch(e){
        // on failed silently skip
        tempFn = function (){}
      }
      console.log(value)
      // deal with es2015 transpiling context
      window._this2 = this || null
      node.addEventListener(evtName, tempFn.bind(this), false)
    }
    i++
  }
}

let events
let c
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
          events = testEventNode.call(this, currentNode)
        }
      }
      recon.call(this, currentNode.firstChild)
    }
  }
}

// instance, addState, model
function reconcile () {
  recon.apply(this, arguments)
}

export default reconcile
