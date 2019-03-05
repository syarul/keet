const re = /{{([^{}]+)}}/g
const DOCUMENT_ELEMENT_TYPE = 1
const DOCUMENT_COMMENT_TYPE = 8

let currentNode

function dump(node) {
  while(node) {
  	currentNode = node
    node = node.nextSibling
    if (currentNode.nodeType === DOCUMENT_ELEMENT_TYPE) {
      dump.call(this, currentNode.firstChild)
    } else if (currentNode.nodeType === DOCUMENT_COMMENT_TYPE && currentNode.nodeValue.match(re)) {
      currentNode.remove()
    }
  }
}

function dumpster () {
  dump.apply(this, arguments)
}

export default dumpster