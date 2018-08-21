import updateState from './updateState'
import conditionalNodes from '../conditionalNodes'

const DOCUMENT_ELEMENT_TYPE = 1
const DOCUMENT_COMMENT_TYPE = 8
const conditionalNodesRawStart = /\{\{\?([^{}]+)\}\}/g
const reConditional = /([^{?])(.*?)(?=\}\})/g

let conditional
let currentNode
let state
let nodes

function check (node) {
  while (node) {
    currentNode = node
    node = node.nextSibling
    if (currentNode.nodeType === DOCUMENT_ELEMENT_TYPE) {
      check.call(this, currentNode.firstChild)
    } else if (currentNode.nodeType === DOCUMENT_COMMENT_TYPE && currentNode.nodeValue.match(conditionalNodesRawStart)) {
      conditional = currentNode.nodeValue.trim().match(reConditional)
      state = state.concat(conditional)
      nodes = nodes.concat(currentNode)
    }
  }
}

function conditionalCache (addState) {
  state = []
  nodes = []
  check.call(this, this.base.firstChild)
  let i = state.length
  while (i > 0) {
    i--
    updateState(state[i], addState.bind(this))
    conditionalNodes.call(this, nodes[i], state[i], 'initial')
  }
}

export default conditionalCache
