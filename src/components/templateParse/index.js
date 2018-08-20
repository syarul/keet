import replaceHandleBars from './replaceHandleBars'
import replaceCommentBlock from './replaceCommentBlock'
import { addEvent, addEventModel } from './addEvent'
import { getId, minId } from '../../../utils'

const DOCUMENT_ELEMENT_TYPE = 1
const DOCUMENT_COMMENT_TYPE = 8
const re = /{{([^{}]+)}}/g
const modelRaw = /\{\{model:([^{}]+)\}\}/g

let cacheEvents = []

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
        if (name === 'checked') {
          if (ns === '') {
            node.checked = false
          } else {
            node.checked = true
          }
          node.removeAttribute(name)
        } else {
          if (ns === '') {
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
    if(evtStore.length && !node.hasAttribute('evt-data')){
      let rd = minId()
      node.setAttribute('evt-data', rd)
      cacheEvents[rd] = evtStore
      // l(cacheEvents)
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
          events = testEventNode.call(ctx, currentNode)
          if (events.length) {
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
        } else if (type === 'update') {
          replaceHandleBars.call(ctx, currentNode.nodeValue, currentNode, ins, updateStateList, templateParse)
        }
      }
    }
  }

  function isEqual (oldNode, newNode) {
    return (
      (isIgnored(oldNode) && isIgnored(newNode)) || 
      oldNode.isEqualNode(newNode)
    )
  }

  function isIgnored (node) {
    return node.getAttribute('data-ignore') != null
  }

  function arbiter (oldNode, newNode){
    if(oldNode.nodeName !== 'INPUT') return
    if(oldNode.checked !== newNode.checked){
      oldNode.checked =  newNode.checked
    }
  }

  function setAttr(oldNode, newNode) {
    let oAttr = newNode.attributes
    let output = {}
    let i = 0
    while(i < oAttr.length){
      output[oAttr[i].name] = oAttr[i].value
      i++
    }
    let iAttr = oldNode.attributes
    let input = {}
    let j = 0
    while(j < iAttr.length){
      input[iAttr[j].name] = iAttr[j].value
      j++
    }
    for (let attr in output) {
      if (oldNode.attributes[attr] && oldNode.attributes[attr].name === attr && oldNode.attributes[attr].value !== output[attr]) {
        oldNode.setAttribute(attr, output[attr])
      } else {
        if(!oldNode.hasAttribute(attr)){
          oldNode.setAttribute(attr, output[attr])
        }
      }
    }
    for (let attr in input) {
      if (newNode.attributes[attr] && oldNode.attributes[attr]) {
      } else if(attr !== 'evt-data') {
        oldNode.removeAttribute(attr)
      }
    }
  }

  function patch(oldNode, newNode) {
    if(oldNode.nodeType === newNode.nodeType){
      if(oldNode.nodeType === DOCUMENT_ELEMENT_TYPE){
        arbiter(oldNode, newNode)
        if (isEqual(oldNode, newNode)) return
        diff(oldNode.firstChild, newNode.firstChild)
        if (oldNode.nodeName === newNode.nodeName) {
          setAttr(oldNode, newNode)
        } else {
          oldParentNode.replaceChild(newNode, oldNode)
        }
      } else {
        if (oldNode.nodeValue !== newNode.nodeValue) {
          oldNode.nodeValue = newNode.nodeValue
        }
      }
    } else {
      oldNode.parentNode.replaceChild(newNode, oldNode)
    }
  }

  function getIndex(store, count){
    return store.length - count - 1
  }

  let checkNew
  let checkOld

  function diff (oldNode, newNode) {
    let count = 0
    let newStore = []
    while (newNode) {
      count++
      checkNew = newNode
      newNode = newNode.nextSibling
      newStore.push(checkNew)
    }
    let index
    let oldParentNode = oldNode && oldNode.parentNode
    while (oldNode) {
      count--
      checkOld = oldNode
      oldNode = oldNode.nextSibling
      index = getIndex(newStore, count)
      if(checkOld && newStore[index]){
        patch(checkOld, newStore[index])
      } else if (checkOld && !newStore[index]) {
        oldParentNode.removeChild(checkOld)
      }
      if (oldNode === null) {
        while (count > 0) {
          count--
          index = getIndex(newStore, count)
          oldParentNode.appendChild(newStore[index])
        }
      }
    }
  }

  if (type === 'initial' || type === 'update') {
    check(instance, type)
  } else if (type === 'event') {
    addEvt(instance, type)
  } else if (type === 'diff') {
    diff(getId(ctx.el).firstChild, instance)
  }
  // l(type)
}

export default templateParse
