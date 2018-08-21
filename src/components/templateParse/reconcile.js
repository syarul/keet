import replaceCommentBlock from './replaceCommentBlock'
import inspectAttributes from './inspectAttributes'
import replaceHandleBars from './replaceHandleBars'

const DOCUMENT_ELEMENT_TYPE = 1
const DOCUMENT_COMMENT_TYPE = 8
const re = /{{([^{}]+)}}/g

let currentNode

function recon (node, addState) {
  while (node) {
    currentNode = node
    node = node.nextSibling
    if (currentNode.nodeType === DOCUMENT_ELEMENT_TYPE) {
      if (currentNode.hasAttributes()) {
        inspectAttributes.call(this, currentNode, addState)
      }
      recon.call(this, currentNode.firstChild, addState)
    } else if (currentNode.nodeValue.match(re)) {
      if (currentNode.nodeType === DOCUMENT_COMMENT_TYPE) {
        replaceCommentBlock.call(this, currentNode.nodeValue, currentNode)
      } else {
        replaceHandleBars.call(this, currentNode.nodeValue, currentNode, addState)
      }
    }
  }
}

function reconcile (instance, addState) {
  recon.call(this, instance, addState)
}

export default reconcile
