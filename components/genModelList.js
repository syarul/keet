var assert = require('../utils').assert
var getId = require('../utils').getId
var checkNodeAvailability = require('../utils').checkNodeAvailability
var genModelTemplate = require('./genModelTemplate')

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
  var list = node.nextSibling.cloneNode(true)
  var str = list.outerHTML
  var oldModel

  if (list.hasAttribute('id') && list.id.match(re)) {
    ref = list.id.replace(re, '$1')
  }

  // remove the first prototype node
  node.nextSibling.remove()

  if (this[model] !== undefined && this[model].hasOwnProperty('list')) {
    parentNode = node.parentNode

    if (!parentNode.hasAttribute('data-ignore')) {
      parentNode.setAttribute('data-ignore', '')
    }

    if (node.nextSibling) {
      node.nextSibling.remove() // remove the text tag for modelEnd
    } else {
      assert(false, 'Model "{{/model:' + model + '}}" enclosing tag does not exist.')
    }
    node.remove() // remove the text for model start tag

    modelList = this[model].list

    this['__'+model+'__'] = this['__'+model+'__'] || []

    oldModel = this['__'+model+'__']

    // check difference old currentModel and the oldModel
    // skip if it a new model
    // check also if current browser doesn't support createRange()
    if (!oldModel || !range) {
      oldModel = JSON.parse(JSON.stringify(modelList))

      mLength = modelList.length

      i = 0

      while (i < mLength) {
        if (range) {
          m = genModelTemplate(str, modelList[i])
          documentFragment = range.createContextualFragment(m)
          parentNode.insertBefore(documentFragment, null)
        } else {
          // fallback to regular node generation handler
          listClone = list.cloneNode(true)
          tmplHandler(this, null, listClone, modelList[i])
        }
        i++
      }
    } else {

      updateOfNew = diff(modelList, oldModel)
      diffOfOld = diff(oldModel, modelList)

      function diffModel(c, cx, pNode) {
        // pNode =[].pop.call(arguments)
        // check if both models are equally in length
        equalLength = oldModel.length === modelList.length

        // do properties update
        if (equalLength) {
          // console.log(new Date() - window.time)
          console.time('up')
          updateOfNew.map(function (obj) {
            child = pNode.querySelector('[id="' + obj[ref] + '"]')
            m = genModelTemplate(str, obj)
            documentFragment = range.createContextualFragment(m)
            pNode.replaceChild(documentFragment, child)
          })
          console.timeEnd('up')
        // add new objects
        } else if (updateOfNew.length > 0 && diffOfOld.length === 0) {
          console.time('add')
          updateOfNew.map(function (obj) {
            m = genModelTemplate(str, obj)
            documentFragment = range.createContextualFragment(m)
            pNode.insertBefore(documentFragment, null)
          })
          console.timeEnd('add')
        // destroy selected objects
        } else if (updateOfNew.length === 0 && diffOfOld.length > 0) {
          console.time('des')
          diffOfOld.map(function (obj) {
            child = pNode.querySelector('[id="' + obj[ref] + '"]')
            pNode.removeChild(child)
          })
          console.timeEnd('des')
        }

        // replace oldModel after diffing
        this['__'+model+'__'] = JSON.parse(JSON.stringify(modelList))
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
