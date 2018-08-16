import replaceHandleBars from './replaceHandleBars'
import replaceCommentBlock from './replaceCommentBlock'
import addEvent from './addEvent'

const DOCUMENT_ELEMENT_TYPE = 1
const DOCUMENT_COMMENT_TYPE = 8
const re = /{{([^{}]+)}}/g

function templateParse (ctx, updateStateList, modelInstance, modelObject, conditional, type) {
  
  let currentNode
  let fragment
  let instance
  let nodeAttributes
  let i = 0
  let a
  let ns
  let name

  type = type || null

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
    nodeAttributes = node.attributes
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

  const check = node => {
    while (node) {
      currentNode = node
      if(type === 'setup') node = node.nextSibling
      if (currentNode.nodeType === DOCUMENT_ELEMENT_TYPE) {
        if (currentNode.hasAttributes()) {
          addEvent.call(ctx, currentNode)
          inspectAttributes(currentNode)
        }
        check(currentNode.firstChild)
      } else if (currentNode.nodeValue.match(re)) {
        if (currentNode.nodeType === DOCUMENT_COMMENT_TYPE) {
          // l('do', conditional, modelInstance, currentNode)
          // l(setup, currentNode)
          replaceCommentBlock.call(ctx, currentNode.nodeValue, currentNode, ins, updateStateList, templateParse, type)
          // break
        } else {
          replaceHandleBars.call(ctx, currentNode.nodeValue, currentNode, ins, updateStateList, templateParse)
        }
      }
      if(type!== 'setup') node = node.nextSibling
    }
  }
  // l(instance, type)
  check(instance)
}

export default templateParse
