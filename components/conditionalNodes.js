var DOCUMENT_COMMENT_TYPE = 8
var c = {}
module.exports = function (node, conditional, tmplHandler, protoBuild) {
  var entryNode
  var currentNode
  var start = '^\\{\\{\\?'+conditional+'\\}\\}'
  var re = new RegExp(start)
  var end = '^\\{\\{\\/'+conditional+'\\}\\}'
  var reEnd = new RegExp(end)
  var shouldUpdate = false
  if(!c[conditional]) c[conditional] = {}
  if(!protoBuild){
    if(c[conditional].state !== this[conditional]) shouldUpdate = true
    c[conditional].state = this[conditional]
  } else{
    c[conditional].state = false
  }
  // console.log(shouldUpdate)
  // while(node){
  //   currentNode = node
  //   node = node.nextSibling
  //   if(currentNode.nodeType === DOCUMENT_COMMENT_TYPE && currentNode.nodeValue.match(re)){
  //     entryNode = currentNode
  //   } else if(currentNode.nodeType === DOCUMENT_COMMENT_TYPE && currentNode.nodeValue.match(reEnd)){
  //     // stop the loop
  //     // generate prototype conditional fragment
  //     if(protoBuild) {
  //       node = null
  //       tmplHandler(this, null, null, null, null, frag)
  //     }

  //     // update if needed
  //     if(this[conditional]){
  //       var cFrag = frag.cloneNode(true) 
  //       tmplHandler(this, null, null, null, null, cFrag)
  //       entryNode.parentNode.insertBefore(cFrag, entryNode.nextSibling)
  //     }
  //   } else {
  //     if(protoBuild){
  //       frag.appendChild(currentNode.cloneNode(true))
  //       currentNode.remove()
  //     }
  //   }
  // }

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

      // update if needed
      if(shouldUpdate){
        if(!protoBuild && this[conditional]){
          console.log(entryNode)
          var f = c[conditional].frag.cloneNode(true)
          console.log(f)
          entryNode.parentNode.insertBefore(f, entryNode)
        } /*else if(!protoBuild && !this[conditional]){
          var rem = currentNode.previousSibling
          var cRem
          while(rem){
            cRem = rem
            rem = rem.previousSibling
            if(cRem === DOCUMENT_COMMENT_TYPE && currentNode.nodeValue.match(re)){
              rem = null
            } else {
              cRem.remove()
            }
          }
        }*/
      }
    } else {
      // store
      if(!c[conditional].frag){
        c[conditional].frag = document.createDocumentFragment()
        c[conditional].frag.appendChild(currentNode.cloneNode(true))
        currentNode.remove()
      }
    }
  }
  // console.log(shouldUpdate, c)
}
