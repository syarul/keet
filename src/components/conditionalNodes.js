import genModelList from './genModelList'

const conditionalNodesRawEnd = /\{\{\/([^{}]+)\}\}/g
const modelRaw = /\{\{model:([^{}]+)\}\}/g
const re = /([^{{model:])(.*?)(?=\}\})/g
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

function checkHasModel (conditional, node) {
  let cNode
  while (node) {
    cNode = node
    node = node.nextSibling
    if (cNode.nodeType === DOCUMENT_ELEMENT_TYPE) {
      checkHasModel.call(this, conditional, cNode.firstChild)
    } else if (cNode.nodeType === DOCUMENT_COMMENT_TYPE && cNode.nodeValue.match(modelRaw)) {
      let model = cNode.nodeValue.trim().match(re)
      if (model.length) {
        cache[conditional].models = cache[conditional].models || []
        cache[conditional].models = cache[conditional].models.concat(model)
        // cache the model without propagating DOM changes
        genModelList.call(this, cNode, model, null)
      }
    }
  }
}

function resolveConditionalNodes (node, conditional, setup, runner, addState) {
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
        // check if nodes has model(s)
        checkHasModel.call(this, conditional, frag.firstChild)
        cache[conditional].frag = frag
      } else if (currentNode.nodeType !== DOCUMENT_COMMENT_TYPE) {
        frag.appendChild(currentNode)
      }
    }
  } else if (setup === 'conditional-set') {
    if (node.nextSibling.isEqualNode(cache[conditional].frag.firstChild)) return
    fetchFrag = cache[conditional].frag.cloneNode(true)
    // if cache has model(s), mark all as dirty, since all were removed from DOM
    // on last iteration
    if (cache[conditional].models && cache[conditional].models.length) {
      cache[conditional].models.map(model => {
        this[model].dirty = true
      })
    }
    runner.call(this, fetchFrag.firstChild, addState)
    node.parentNode.insertBefore(fetchFrag, node.nextSibling)
  }
}

export {
  resolveConditionalNodes as default,
  cache
}
