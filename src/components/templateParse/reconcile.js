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
  let handler
  let evtStore = []
  let obs
  let args

  while (i < nodeAttributes.length) {
    a = nodeAttributes[i]
    name = a.localName
    value = a.nodeValue
    if (/^k-/.test(name)) {
      evtName = name.replace(/^k-/, '')
      handler = value.match(/[a-zA-Z]+(?![^(]*\))/)[0]
      args = value.match(/\(([^{}]+)\)/)
      args = args ? args[1] : ''
      obs = {}
      obs[evtName] = handler
      if (args) obs[args] = true
      obs['isModel'] = false
      evtStore.push(obs)
      if (node.hasChildNodes() && node.firstChild.nodeType !== DOCUMENT_ELEMENT_TYPE && node.firstChild.nodeValue.match(modelRaw)) {
        obs['isModel'] = true
      }
    }
    i++
  }
  return evtStore
}

let events
let c
let currentNode

function recon (node, addState, model) {
  while (node) {
    currentNode = node
    node = node.nextSibling
    if (currentNode.nodeType === DOCUMENT_ELEMENT_TYPE) {
      if (currentNode.hasAttributes()) {
        inspectAttributes.call(this, currentNode, addState, model)

        // to take advantage of caching always assigned id to the node
        // we only assign eventListener on first mount to DOM or when the node is not available on DOM
        if (!getId(currentNode.id)) {
          events = testEventNode.call(this, currentNode)
          if (events.length) {
            events.map(e => {
              !e.isModel ? addEvent.call(this, currentNode, e) : addEventModel.call(this, currentNode, e)
              currentNode.removeAttribute(`k-${Object.keys(e)[0]}`)
            })
          }
        }
      }
      recon.call(this, currentNode.firstChild, addState, model)
    } else if (currentNode.nodeType === DOCUMENT_COMMENT_TYPE && currentNode.nodeValue.match(conditionalNodesRawStart)) {
      c = currentNode.nodeValue.trim().match(reConditional)
      c = c && c[0]
      if (this[c]) {
        conditionalNodes.call(this, currentNode, c, 'conditional-set', reconcile, addState)
      }
    } else if (currentNode.nodeType === DOCUMENT_COMMENT_TYPE && currentNode.nodeValue.match(re) && !currentNode.nodeValue.match(conditionalNodesRawStart)) {
      replaceCommentBlock.call(this, currentNode.nodeValue, currentNode, reconcile)
    } else {
      replaceHandleBars.call(this, currentNode.nodeValue, currentNode, addState, null, model)
    }
  }
}

function reconcile (instance, addState, model) {
  recon.call(this, instance, addState, model)
}

export default reconcile
