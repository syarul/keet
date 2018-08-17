import { minId } from '../../utils'

const conditionalNodesRawStart = /\{\{\?([^{}]+)\}\}/g
const conditionalNodesRawEnd = /\{\{\/([^{}]+)\}\}/g
const DOCUMENT_ELEMENT_TYPE = 1
const DOCUMENT_COMMENT_TYPE = 8

let cache = {}

// rebuild the node structure
function catchNode(node, start){
  let cNode
  while(node){
    cNode = node
    node = node.nextSibling 
    if(cNode && cNode.nodeType === DOCUMENT_ELEMENT_TYPE){
      if(cNode.isEqualNode(start)){
        cNode.remove()
        start = start.nextSibling
      } else {
        catchNode(cNode.firstChild, start)
      }
    } else if(cNode.isEqualNode(start)){
      cNode.remove()
      start = start.nextSibling
    }
  }
}

function resolveConditionalNodes (node, updateStateList, conditional, tmplHandler, setup) {
  let currentNode
  let cNode
  let fetchFrag
  let frag = document.createDocumentFragment()
  // l(setup, cache)
  if(setup === 'initial' && !cache.hasOwnProperty(conditional)){
    cNode = node
    while (cNode) {
      currentNode = cNode
      cNode = cNode.nextSibling
      if (currentNode.nodeType !== DOCUMENT_ELEMENT_TYPE && currentNode.nodeValue.match(conditionalNodesRawEnd)) {
        // l(currentNode.nextSibling)
        
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
        tmplHandler(this, null, null, null, fetchFrag, 'initial')

        // update current if conditional is truthy
        if (this[conditional]) {
          currentNode.parentNode.insertBefore(fetchFrag, currentNode)
        }

      } else if (currentNode.nodeType !== DOCUMENT_COMMENT_TYPE) {
        frag.appendChild(currentNode)
      }
    }
  } else {
    // l(node.nextSibling, cache[conditional].frag.firstChild)
    if(node.nextSibling.isEqualNode(cache[conditional].frag.firstChild)) return
    // if(setup === 'initial') {
      // l('finish parsing conditional states, begin parsing other states')
      // l(this.base.cloneNode(true))
    // } else {
      // l(node)
      fetchFrag = cache[conditional].frag.cloneNode(true)
      // tmplHandler(this, null, null, null, fetchFrag, 'update')
      if (this[conditional]) {
        node.parentNode.insertBefore(fetchFrag, node.nextSibling)
      }
    // }
  }
}

export default resolveConditionalNodes