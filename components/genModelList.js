var ternaryOps = require('./ternaryOps')
var createModel = require('../utils').createModel
var assert = require('../utils').assert

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
    if(node.nextSibling){
      node.nextSibling.remove() // remove the text tag for modelEnd
    } else {
      assert(false, 'Model "{{/model:'+model+'}}" enclosing tag does not exist.')
    }
    node.remove() // remove the text for model start tag
    
    modelList = this[model].list
    mLength = modelList.length
    i = 0
    while(i < mLength){
      listClone = list.cloneNode(true)
      tmplHandler(this, null, listClone, modelList[i])
      parentNode.insertBefore(listClone, null)
      i++
    } 
  } else {
    assert(false, 'Model "'+model+'" does not exist.')
  }
}
