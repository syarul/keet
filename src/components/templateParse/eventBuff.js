import { getId } from '../../../utils'
import { addEvent, addEventModel } from './addEvent'

const DOCUMENT_ELEMENT_TYPE = 1
const modelRaw = /\{\{model:([^{}]+)\}\}/g

// let cacheEvents = []

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
  // if (evtStore.length && !node.hasAttribute('evt-data')) {
  //   let rd = minId()
  //   node.setAttribute('evt-data', rd)
  //   cacheEvents[rd] = evtStore
  // }
  return evtStore
}

let events
let currentNode

function addEvt (node) {
  while (node) {
    currentNode = node
    node = node.nextSibling
    if (currentNode.nodeType === DOCUMENT_ELEMENT_TYPE) {
      if (currentNode.hasAttributes() && !getId(currentNode.id)) {
        events = testEventNode.call(this, currentNode)
        if (events.length) {
          events.map(e =>
            !e.isModel ? addEvent.call(this, currentNode, e) : addEventModel.call(this, currentNode, e)
          )
        }
      }
      addEvt.call(this, currentNode.firstChild)
    }
  }
}

function eventBuff (instance) {
  addEvt.call(this, instance)
}

export default eventBuff
