var ternaryOps = require('./ternaryOps')
var createModel = require('../utils').createModel
var assert = require('../utils').assert
var genModelTemplate = require('./genModelTemplate')

module.exports = function (node, model, tmplHandler) {
  var modelList
  var mLength
  var i
  var listClone
  var parentNode

  var list = node.nextSibling.cloneNode(true)
  var str = list.outerHTML

  // check if browser support createRange
  var range
  if(typeof document.createRange === 'function'){
    range = document.createRange()
  }

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
      if(range){
        var m = genModelTemplate(str, modelList[i])
        var documentFragment = range.createContextualFragment(m)
        parentNode.insertBefore(documentFragment, null)
        console.log(parentNode)
      } else {
        // fallback to regular node generation handler
        listClone = list.cloneNode(true)
        tmplHandler(this, null, listClone, modelList[i]) 
      }
      i++
    }
  } else {
    assert(false, 'Model "'+model+'" does not exist.')
  }
}
