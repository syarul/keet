var ternaryOps = require('./ternaryOps')
var createModel = require('../utils').createModel
var assert = require('../utils').assert

var DOCUMENT_TEXT_TYPE = 3
var modelRawStart = /^\{\{model:([^{}]+)\}\}/g
var modelRawEnd = /^\{\{\/model:([^{}]+)\}\}/g

module.exports = function (node, model, tmplHandler) {
  var modelList
  var mLength
  var i
  var listClone
  var list

  var currentNode
  var entryNode

  while(node){
    currentNode = node
    node = node.nextSibling
    if(currentNode.nodeType === DOCUMENT_TEXT_TYPE){
      if(currentNode.nodeValue.match(modelRawStart)){
        entryNode = currentNode
        list = entryNode.nextSibling.cloneNode(true)
      } else if(currentNode.nodeValue.match(modelRawEnd)){
        currentNode.remove()
        // star generating the model nodes range, if not yet
        // apply conditional hash sum check before doing this
        if(this[model] !== undefined && this[model].hasOwnProperty('list')){
            modelList = this[model].list
            mLength = modelList.length
            i = 0
            while(i < mLength){
              listClone = list.cloneNode(true)
              tmplHandler(this, null, listClone, modelList[i])
              entryNode.parentNode.insertBefore(listClone, null)
              i++
            } 
        }
        entryNode.nextSibling.remove()
        entryNode.remove()

        node = null
      }
    }
  }

  // var list = node.nextSibling.cloneNode(true)
  // // remove the first prototype node 
  // node.nextSibling.remove()

  // if(this[model] !== undefined && this[model].hasOwnProperty('list')){
  //   parentNode = node.parentNode
  //   if(node.nextSibling){
  //     node.nextSibling.remove() // remove the text tag for modelEnd
  //   } else {
  //     assert(false, 'Model "{{/model:'+model+'}}" enclosing tag does not exist.')
  //   }
  //   node.remove() // remove the text for model start tag
    
  //   modelList = this[model].list
  //   mLength = modelList.length
  //   i = 0
  //   while(i < mLength){
  //     listClone = list.cloneNode(true)
  //     tmplHandler(this, null, listClone, modelList[i])
  //     parentNode.insertBefore(listClone, null)
  //     i++
  //   } 
  // } else {
  //   assert(false, 'Model "'+model+'" does not exist.')
  // }
}
