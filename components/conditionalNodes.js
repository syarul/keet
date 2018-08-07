var DOCUMENT_COMMENT_TYPE = 8
var c = {}
module.exports = function (node, conditional, tmplHandler, protoBuild) {
  var entryNode
  var currentNode
  var start = '^condt:'+conditional
  var re = new RegExp(start)
  var end = '^\/condt:'+conditional
  var reEnd = new RegExp(end)
  while(node){
    currentNode = node
    node = node.nextSibling
    if(currentNode.nodeType === DOCUMENT_COMMENT_TYPE && currentNode.nodeValue.match(re)){
      entryNode = currentNode
    } else if(currentNode.nodeType === DOCUMENT_COMMENT_TYPE && currentNode.nodeValue.match(reEnd)){
      // stop the loop
      node = null
      // generate prototype conditional fragment
      if(protoBuild) tmplHandler(this, null, null, null, null, c[conditional])

      if(!protoBuild && this[conditional]){
        entryNode.parentNode.insertBefore(c[conditional].cloneNode(true), entryNode)
      }
    } else {
      // store
      if(!c[conditional]){
        c[conditional] = document.createDocumentFragment()
        c[conditional].appendChild(currentNode.cloneNode(true))
        currentNode.remove()
      }
    }
  }
}
