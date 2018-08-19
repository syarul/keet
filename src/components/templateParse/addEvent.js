const DOCUMENT_ELEMENT_TYPE = 1
const re = /{{([^{}]+)}}/g

function lookupParentNode (rootNode, node) {
  let cNode
  while (node) {
    cNode = node
    node = node.parentNode
    if (cNode.nodeType === DOCUMENT_ELEMENT_TYPE && cNode.hasAttribute('kdata-id')) {
      return { id: cNode.getAttribute('kdata-id'), node: cNode }
    }
    if (cNode.isEqualNode(rootNode)) {
      node = null
    }
  }
}

const getIndex = (id, model) => model.list.map(m => m['kdata-id']).indexOf(id)

function addEvent (node, evtData) {
  delete evtData.isModel
  let evtName = Object.keys(evtData)[0]
  let handler = evtData[evtName]
  if (this[handler] !== undefined && typeof this[handler] === 'function') {
    node.addEventListener(evtName, this[handler].bind(this), !!evtData['useCapture'])
  }
}

function fn (model, handler, node, e) {
  e.stopPropagation()
  if (e.target !== e.currentTarget) {
    let t = lookupParentNode(node, e.target)
    this[handler](model.list[getIndex(t.id, model)], e.target, t.node, e)
  }
}

function addEventModel (node, evtData) {
  delete evtData.isModel
  let evtName = Object.keys(evtData)[0]
  let handler = evtData[evtName]
  if (this[handler] !== undefined && typeof this[handler] === 'function') {
    let rep = node.firstChild.nodeValue.replace(re, '$1').trim()
    rep = rep.replace('model:', '')
    let model = this[rep]
    node.addEventListener(evtName, fn.bind(this, model, handler, node), !!evtData['useCapture'])
  }
}

export {
  addEvent,
  addEventModel
}
