var assert = require('../utils').assert
var getId = require('../utils').getId
var checkNodeAvailability = require('../utils').checkNodeAvailability
var genModelTemplate = require('./genModelTemplate')
// var morph = require('set-dom')

var re = /{{([^{}]+)}}/g

// diffing two array of objects, including object properties differences
function diff (fst, sec) {
  return fst.filter(function (obj) {
    return !sec.some(function (inr) {
      var predicate = true
      for (var attr in inr) {
        if (obj[attr] !== inr[attr]) {
          predicate = false
        }
      }
      return predicate
    })
  })
}

// check if browser support createRange
var range
if (typeof document.createRange === 'function') {
  range = document.createRange()
}

// storage for model state
var cache = {}

module.exports = function (node, model, tmplHandler) {
  
  var modelList
  var mLength
  var i
  var listClone
  var parentNode
  var m
  var documentFragment
  var updateOfNew
  var diffOfOld
  var pNode
  var ref
  var equalLength
  var child
  var list
  var str
  var oldModel
  var p

  cache[model] = cache[model] || {}

  if(!cache[model].list){
    cache[model].list = node.nextSibling.cloneNode(true)
  }
  list = cache[model].list

  if(!cache[model].str){
    cache[model].str = node.nextSibling.cloneNode(true).outerHTML
  }
  str = cache[model].str

  if(!cache[model].ref){
    if (list.hasAttribute('id') && list.id.match(re)) {
      cache[model].ref = list.id.replace(re, '$1')
      // remove the first prototype node
      node.nextSibling.remove()
      // also remove from pristine node
      p = this.__pristineFragment__.getElementById(list.id)
      if(p) p.remove()
    }
  }
  ref = cache[model].ref
  
  if (this[model] !== undefined && this[model].hasOwnProperty('list')) {

    parentNode = node.parentNode

    if (range && !parentNode.hasAttribute('data-ignore')) {
      parentNode.setAttribute('data-ignore', '')
    }

    modelList = this[model].list

    oldModel = cache[model].oldModel || []

    // check if current browser doesn't support createRange()
    if (!range) {
      i = 0
      while (i < mLength) {
        // fallback to regular node generation handler
        listClone = list.cloneNode(true)
        tmplHandler(this, null, listClone, modelList[i])
        i++
      }
    } else {
      updateOfNew = diff(modelList, oldModel)
      diffOfOld = diff(oldModel, modelList)

      function diffModel() {
        pNode =[].pop.call(arguments)
        // check if both models are equally in length
        equalLength = oldModel.length === modelList.length

        // do properties update
        if (equalLength) {
          updateOfNew.map(function (obj) {
            child = pNode.querySelector('[id="' + obj[ref] + '"]')
            m = genModelTemplate(str, obj)
            documentFragment = range.createContextualFragment(m)
            // morph(child, documentFragment.firstChild)
            pNode.replaceChild(documentFragment, child)
          })
        // add new objects
        } else if (updateOfNew.length > 0 && diffOfOld.length === 0) {
          updateOfNew.map(function (obj) {
            m = genModelTemplate(str, obj)
            documentFragment = range.createContextualFragment(m)
            pNode.insertBefore(documentFragment, pNode.lastChild)
          })
        // destroy selected objects
        } else if (updateOfNew.length === 0 && diffOfOld.length > 0) {
          diffOfOld.map(function (obj) {
            child = pNode.querySelector('[id="' + obj[ref] + '"]')
            pNode.removeChild(child)
          })
        }

        // replace oldModel after diffing
        cache[model].oldModel = JSON.parse(JSON.stringify(modelList))
      }

      // check existing parentNode in the DOM
      if (parentNode.hasAttribute('id')) {
        pNode = getId(parentNode.id)

        if(pNode){
          diffModel.call(this, null, null, pNode)
        } else {
          checkNodeAvailability({ el: parentNode.id }, model, diffModel.bind(this))
        }
      }
      
    }
  } else {
    assert(false, 'Model "' + model + '" does not exist.')
  }
}
