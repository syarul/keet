import replaceHandleBars from './replaceHandleBars'
import replaceCommentBlock from './replaceCommentBlock'
import { addEvent, addEventModel } from './addEvent'
import { getId } from '../../../utils'

const DOCUMENT_ELEMENT_TYPE = 1
const DOCUMENT_COMMENT_TYPE = 8
const re = /{{([^{}]+)}}/g
const modelRaw = /\{\{model:([^{}]+)\}\}/g

function templateParse (ctx, updateStateList, modelInstance, modelObject, conditional, type) {
  let currentNode
  let fragment
  let instance

  if (modelObject) {
    instance = modelInstance
  } else if (conditional) {
    instance = conditional.firstChild
  } else {
    fragment = ctx.base
    instance = fragment.firstChild
  }

  let ins = modelObject || ctx

  const inspectAttributes = node => {
    let nodeAttributes = node.attributes
    let i = 0
    let a
    let ns
    let name

    for (i = nodeAttributes.length; i--;) {
      a = nodeAttributes[i]
      name = a.localName
      ns = a.nodeValue
      if (re.test(name)) {
        node.removeAttribute(name)
        name = replaceHandleBars(name, node, ins, null, null, true)
        node.setAttribute(name, ns)
      } else if (re.test(ns)) {
        ns = replaceHandleBars(ns, node, ins, null, null, true)
        if (ns === '') {
          node.removeAttribute(name)
        } else {
          if (name === 'checked') {
            node.setAttribute(name, '')
          } else {
            node.setAttribute(name, ns)
          }
        }
      }
    }
  }

  const testEventNode = node => {
    let nodeAttributes = node.attributes
    let i = 0
    let a 
    let name 
    let value
    let evtName
    let handler
    let evtStore = []
    let obs
    
    while(i < nodeAttributes.length){
      a = nodeAttributes[i]
      name = a.localName
      value = a.nodeValue
      if (/^k-/.test(name)) {
        evtName = name.replace(/^k-/, '')
        handler = value.match(/[a-zA-Z]+(?![^(]*\))/)[0]
        obs = {}
        obs[evtName] = handler
        obs['isModel'] = false
        evtStore.push(obs)
      }
      i++
    }
    if (obs && node.hasChildNodes() && node.firstChild.nodeType !== DOCUMENT_ELEMENT_TYPE && node.firstChild.nodeValue.match(modelRaw)) {
      obs['isModel'] = true
    }
    return evtStore
  }

  let events

  const addEvt = (node, type) => {
    while (node) {
      currentNode = node
      node = node.nextSibling
      if (currentNode.nodeType === DOCUMENT_ELEMENT_TYPE) {
        if (currentNode.hasAttributes() && !getId(currentNode.id)) {
          events = testEventNode(currentNode)
          if(events.length){
            events.map(e =>
              !e.isModel ? addEvent.call(ctx, currentNode, e) : addEventModel.call(ctx, currentNode, e)
            )
          }
        }
        addEvt(currentNode.firstChild, type)
      } 
    }
  }

  const check = (node, type) => {
    while (node) {
      currentNode = node
      node = node.nextSibling
      if (currentNode.nodeType === DOCUMENT_ELEMENT_TYPE) {
        if (type === 'update' && currentNode.hasAttributes()) {
          inspectAttributes(currentNode)
        }
        check(currentNode.firstChild, type)
      } else if (currentNode.nodeValue.match(re)) {
        if (currentNode.nodeType === DOCUMENT_COMMENT_TYPE) {
          replaceCommentBlock.call(ctx, currentNode.nodeValue, currentNode, ins, updateStateList, templateParse, type)
        } else if(type === 'update'){
          replaceHandleBars.call(ctx, currentNode.nodeValue, currentNode, ins, updateStateList, templateParse)
        }
      }
    }
  }

  if(type === 'initial' || type === 'update') {
    check(instance, type)
  } else if (type === 'event'){
    addEvt(instance, type)
  }

}

export default templateParse
