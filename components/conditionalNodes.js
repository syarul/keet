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
        // if(!isGen){
          // isGen = true
        // }
        if(this[conditional]){
          tmplHandler(this, null, null, null, frag, this[conditional])
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
  
  // var self = this
  // this.__stateList__.map(function (state) {
  //   if (!self[state]) {
  //     var f = '\\{\\{\\?' + state + '\\}\\}'
  //     var b = '\\{\\{\\/' + state + '\\}\\}'
  //     // var regx = '(?<=' + f + ')(.*?)(?=' + b + ')'
  //     // ** old browser does not support positive look behind **
  //     var regx = '(' + f + ')(.*?)(?=' + b + ')'
  //     var re = new RegExp(regx)
  //     var isConditional = re.test(string)
  //     var match = string.match(re)
  //     if (isConditional && match) {
  //       string = string.replace(match[2], '')
  //     }
  //   }
  //   string = string.replace('{{?' + state + '}}', '')
  //   string = string.replace('{{/' + state + '}}', '')
  // })
  // return string
}
