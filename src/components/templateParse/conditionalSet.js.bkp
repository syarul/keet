import conditionalNodes from '../conditionalNodes'

const DOCUMENT_ELEMENT_TYPE = 1
const DOCUMENT_COMMENT_TYPE = 8
const conditionalNodesRawStart = /\{\{\?([^{}]+)\}\}/g
const reConditional = /([^{?])(.*?)(?=\}\})/g

let c
let currentNode

function check (node) {
  while (node) {
    currentNode = node
    node = node.nextSibling
    if (currentNode.nodeType === DOCUMENT_ELEMENT_TYPE) {
      check.call(this, currentNode.firstChild)
    } else if (currentNode.nodeType === DOCUMENT_COMMENT_TYPE && currentNode.nodeValue.match(conditionalNodesRawStart)) {
      c = currentNode.nodeValue.trim().match(reConditional)
      c = c && c[0]
      if (this[c]) {
        conditionalNodes.call(this, currentNode, c, 'conditional-set', conditionalSet)
      }
    }
  }
}

function conditionalSet (instance) {
  check.call(this, instance)
}

export default conditionalSet
