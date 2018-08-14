const conditionalNodesRawStart = /\{\{\?([^{}]+)\}\}/g
const conditionalNodesRawEnd = /\{\{\/([^{}]+)\}\}/g
const DOCUMENT_ELEMENT_TYPE = 1
export default function (node, conditional, tmplHandler) {
  const frag = document.createDocumentFragment()
  let entryNode
  let currentNode
  let isGen
  let cNode
  while (node) {
    currentNode = node
    node = node.nextSibling
    if (currentNode.nodeType !== DOCUMENT_ELEMENT_TYPE) {
      if (currentNode.nodeValue.match(conditionalNodesRawStart)) {
        entryNode = currentNode
      } else if (currentNode.nodeValue.match(conditionalNodesRawEnd)) {
        currentNode.remove()
        // star generating the conditional nodes range, if not yet
        if (!isGen) {
          isGen = true
          tmplHandler(this, null, null, null, frag)
        }
        if (this[conditional]) {
          entryNode.parentNode.insertBefore(frag, entryNode)
        }
        entryNode.remove()
        node = null
      }
    } else {
      cNode = currentNode.cloneNode(true)
      frag.appendChild(cNode)
      currentNode.remove()
    }
  }
}
