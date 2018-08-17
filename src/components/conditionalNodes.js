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

function resolveConditionalNodes (node, updateStateList, conditional, templateParse, setup) {
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
        cache[conditional] = cache[conditional] || {}

        // clean up pristine node
        catchNode(this.__pristineFragment__.firstChild, frag.firstChild)
        // also clean up cache for recursive handlers
        Object.keys(cache).map(c =>
          c !== conditional && catchNode(cache[c].frag.firstChild, frag.firstChild)
        )

        cache[conditional].frag = frag
        fetchFrag = cache[conditional].frag.cloneNode(true)

        // resolve recursive conditional handlers as well
        templateParse(this, null, null, null, fetchFrag, 'initial')

        // update current if conditional is truthy
        if (this[conditional]) {
          currentNode.parentNode.insertBefore(fetchFrag, currentNode)
        }
      } else if (currentNode.nodeType !== DOCUMENT_COMMENT_TYPE) {
        frag.appendChild(currentNode)
      }
    }
  } else {
    if (node.nextSibling.isEqualNode(cache[conditional].frag.firstChild)) return
    fetchFrag = cache[conditional].frag.cloneNode(true)
    if (this[conditional]) {
      node.parentNode.insertBefore(fetchFrag, node.nextSibling)
    } else {
      templateParse(this, null, null, null, fetchFrag, 'update')
    }
  }
}

export default resolveConditionalNodes
