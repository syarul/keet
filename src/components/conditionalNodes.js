const conditionalNodesRawEnd = /\{\{\/([^{}]+)\}\}/g
const DOCUMENT_ELEMENT_TYPE = 1
const DOCUMENT_COMMENT_TYPE = 8

let cache = {}

// rebuild the node structure
function catchNode (node, start) {
  let cNode
  while (node) {
    cNode = node
    node = node.nextSibling
    if (cNode && cNode.nodeType === DOCUMENT_ELEMENT_TYPE) {
      if (cNode.isEqualNode(start)) {
        cNode.remove()
        start = start.nextSibling
      } else {
        catchNode(cNode.firstChild, start)
      }
    } else if (cNode.isEqualNode(start)) {
      cNode.remove()
      start = start.nextSibling
    }
  }
}

function resolveConditionalNodes (node, conditional, setup, runner) {
  let currentNode
  let cNode
  let fetchFrag
  let frag = document.createDocumentFragment()
  if (setup === 'initial' && !cache.hasOwnProperty(conditional)) {
    cNode = node
    while (cNode) {
      currentNode = cNode
      cNode = cNode.nextSibling
      if (currentNode.nodeType !== DOCUMENT_ELEMENT_TYPE && currentNode.nodeValue.match(conditionalNodesRawEnd)) {
        cNode = null
        cache[conditional] = cache[conditional] || {}
        // clean up pristine node
        catchNode(this.__pristineFragment__.firstChild, frag.firstChild)
        // since we work backward no need to check fragment recursive conditional states
        cache[conditional].frag = frag
      } else if (currentNode.nodeType !== DOCUMENT_COMMENT_TYPE) {
        frag.appendChild(currentNode)
      }
    }
  } else if (setup === 'conditional-set') {
    if (node.nextSibling.isEqualNode(cache[conditional].frag.firstChild)) return
    fetchFrag = cache[conditional].frag.cloneNode(true)
    runner.call(this, fetchFrag.firstChild)
    node.parentNode.insertBefore(fetchFrag, node.nextSibling)
  }
}

export {
  resolveConditionalNodes as default,
  cache
}
