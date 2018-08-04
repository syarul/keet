var ternaryOps = require('./ternaryOps')
var createModel = require('../utils').createModel

module.exports = function (node, model, tmplHandler) {
  var modelList
  var mLength
  var i
  var listClone
  var parentNode

  var list = node.nextSibling.cloneNode(true)
  // remove the first prototype node 
  node.nextSibling.remove()

  if(this[model] !== undefined && this[model].hasOwnProperty('list')){
    parentNode = node.parentNode
    node.remove() // remove the text for model start tag
    parentNode.firstChild.remove() // also remove the text tag for modelEnd
    modelList = this[model].list
    mLength = modelList.length
    i = 0
    while(i < mLength){
      listClone = list.cloneNode(true)
      tmplHandler(this, null, listClone, modelList[i])
      parentNode.insertBefore(listClone, null)
      i++
    } 
  }
}
