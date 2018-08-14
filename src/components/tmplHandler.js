import strInterpreter from './strInterpreter'
import ternaryOps from './ternaryOps'
import { getId } from '../../utils'
import genModelList from './genModelList'
import conditionalNodes from './conditionalNodes'
import componentParse from './componentParse'

const DOCUMENT_ELEMENT_TYPE = 1
const re = /{{([^{}]+)}}/g
const model = /^model:/g
const modelRaw = /\{\{model:([^{}]+)\}\}/g
const conditionalRe = /^\?/g
const component = /^component:([^{}]+)/g

const tmplhandler = (ctx, updateStateList, modelInstance, modelObject, conditional) => {
  let currentNode
  let ln
  let props
  let rep
  let fragment
  let instance
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
  let tnr
  let modelRep
  let conditionalRep
  let fn
  let isObjectNotation
  let name
  let p

  if (modelObject) {
    instance = modelInstance
  } else if (conditional) {
    instance = conditional.firstChild
  } else {
    fragment = ctx.base
    instance = fragment.firstChild
  }

  let ins = modelObject || ctx

  const updateState = state => {
    if (typeof updateStateList === 'function') {
      updateStateList(state)
    }
  }

  const valAssign = (node, value, replace, withTo) => {
    value = value.replace(replace, withTo)
    if (node) node.nodeValue = value
  }

  const replaceHandleBars = (value, node) => {
    props = value.match(re)
    ln = props.length
    while (ln) {
      ln--
      rep = props[ln].replace(re, '$1')
      tnr = ternaryOps.call(ins, rep)
      isObjectNotation = strInterpreter(rep)
      if (isObjectNotation) {
        updateState(rep)
        valAssign(node, value, '{{' + rep + '}}', ins[isObjectNotation[0]][isObjectNotation[1]])
      } else {
        if (tnr) {
          updateState(tnr.state)
          valAssign(node, value, '{{' + rep + '}}', tnr.value)
        } else {
          if (rep.match(model)) {
            modelRep = rep.replace('model:', '')
            genModelList.call(ctx, node, modelRep, tmplhandler)
          } else if (rep.match(conditionalRe)) {
            conditionalRep = rep.replace('?', '')
            if (ins[conditionalRep] !== undefined) {
              updateState(conditionalRep)
              conditionalNodes.call(ctx, node, conditionalRep, tmplhandler)
            }
          } else if (rep.match(component)) {
            componentParse.call(ctx, rep, node)
          } else {
            if (ins[rep] !== undefined) {
              updateState(rep)
              valAssign(node, value, '{{' + rep + '}}', ins[rep])
            }
          }
        }
      }
    }
  }

  const inspectAttributes = node => {
    nodeAttributes = node.attributes
    for (i = nodeAttributes.length; i--;) {
      a = nodeAttributes[i]
      name = a.localName
      ns = a.nodeValue
      if (re.test(name)) {
        node.removeAttribute(name)
        name = replaceHandleBars(name)
        node.setAttribute(name, ns)
      } else if (re.test(ns)) {
        ns = replaceHandleBars(ns)
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

  // check if node is visible on DOM and has attribute evt-node
  const lookUpEvtNode = node =>
    !!(node.hasAttribute('id') && getId(node.id) && node.hasAttribute('evt-node'))

  const addEvent = node => {
    nodeAttributes = node.attributes

    if (lookUpEvtNode(node)) {
      // skip addding event for node that already has event
      // to allow skipping adding event the node must include `id`/
    } else {
      // only add event when node does not has one
      for (i = nodeAttributes.length; i--;) {
        a = nodeAttributes[i]
        name = a.localName
        ns = a.nodeValue
        if (/^k-/.test(name)) {
          evtName = name.replace(/^k-/, '')
          handler = ns.match(/[a-zA-Z]+(?![^(]*\))/)[0]
          c = ctx[handler]
          if (c !== undefined && typeof c === 'function') {
            h = ns.match(/\(([^{}]+)\)/)
            handlerArgs = h ? h[1] : ''
            argv = handlerArgs.split(',').filter(function (f) {
              return f !== ''
            })
            fn = e => {
              e.stopPropagation()
              if (e.target !== e.currentTarget) {
                c.apply(ctx, [e.target, e])
              }
            }
            // if node is the rootNode for model, we wrap the eventListener and
            // rebuild the arguments by appending id/className util rootNode.
            if (node.hasChildNodes() && node.firstChild.nodeType !== DOCUMENT_ELEMENT_TYPE && node.firstChild.nodeValue.match(modelRaw)) {
              node.setAttribute('is-model-event-set', '')
              node.addEventListener(evtName, fn, false)
            } else {
              node.addEventListener(evtName, c.bind.apply(c.bind(ctx), [node].concat(argv)), false)
            }
            if (!node.hasAttribute('evt-node')) {
              node.setAttribute('evt-node', '')
              if (node.hasAttribute('id')) {
                p = ctx.__pristineFragment__.getElementById(node.id)
                p.setAttribute('evt-node', '')
              }
            }
          }
        }
      }
    }
  }

  const check = node => {
    while (node) {
      currentNode = node
      if (currentNode.nodeType === DOCUMENT_ELEMENT_TYPE) {
        if (currentNode.hasAttributes()) {
          addEvent(currentNode)
          inspectAttributes(currentNode)
        }
        check(currentNode.firstChild)
      } else if (currentNode.nodeValue.match(re)) {
        replaceHandleBars(currentNode.nodeValue, currentNode)
      }
      node = node.nextSibling
    }
  }

  check(instance)
}

export default tmplhandler
