const DOCUMENT_TEXT_TYPE = 3
const DOCUMENT_ELEMENT_TYPE = 1

// clean up nodes
function clear (node) {
  let f
  while (node) {
    f = node
    node = node.nextSibling
    if (f.nodeType === DOCUMENT_ELEMENT_TYPE) {
      clear(f.firstChild)
    } else if (f.nodeType === DOCUMENT_TEXT_TYPE && f.nodeValue === ' ') {
      f.remove()
    }
  }
}

export default clear
