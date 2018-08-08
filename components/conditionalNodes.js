var conditionalNodesRawStart = /\{\{\?([^{}]+)\}\}/g
var conditionalNodesRawEnd = /\{\{\/([^{}]+)\}\}/g
var DOCUMENT_TEXT_TYPE = 3
module.exports = function (node, conditional, tmplHandler) {
  var entryNode
  var currentNode
  var isGen
  var frag = document.createDocumentFragment()
  while(node){
    currentNode = node
    node = node.nextSibling
    if(currentNode.nodeType === DOCUMENT_TEXT_TYPE){
      if(currentNode.nodeValue.match(conditionalNodesRawStart)){
        entryNode = currentNode
      } else if(currentNode.nodeValue.match(conditionalNodesRawEnd)){
        currentNode.remove()
        // star generating the conditional nodes range, if not yet
        if(!isGen){
          isGen = true
          tmplHandler(this, null, null, null, frag)
        }
        if(this[conditional]){
          entryNode.parentNode.insertBefore(frag, entryNode)
        }
        entryNode.remove()
        node = null
      }
    } else {
      var cNode = currentNode.cloneNode(true)
      frag.appendChild(cNode)
      currentNode.remove()
    }
  }

}