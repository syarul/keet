var assert = require('../utils').assert
var getId = require('../utils').getId
var genModelTemplate = require('./genModelTemplate')

var re = /{{([^{}]+)}}/g

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

var oldModel

module.exports = function (node, model, tmplHandler) {
  var modelList
  var mLength
  var i
  var listClone
  var parentNode
  var m
  var documentFragment
  var list = node.nextSibling.cloneNode(true)
  var str = list.outerHTML
  var updateOfNew
  var diffOfOld
  var pNode
  var ref
  var equalLength
  var child

  if (list.hasAttribute('id') && list.id.match(re)) {
    ref = list.id.replace(re, '$1')
  }

  // check if browser support createRange
  var range
  if (typeof document.createRange === 'function') {
    range = document.createRange()
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

    // check difference old currentModel and the oldModel
    // skip if it a new model
    if (!oldModel) {
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

      // check existing parentNode in DOM
      if (parentNode.hasAttribute('id')) {
        pNode = getId(parentNode.id)

        // check if both models are equally length
        equalLength = oldModel.length === modelList.length

        // doUpdate
        if (equalLength) {
          updateOfNew.map(function (obj) {
            child = pNode.querySelector('[id="' + obj[ref] + '"]')
            m = genModelTemplate(str, obj)
            documentFragment = range.createContextualFragment(m)
            pNode.replaceChild(documentFragment, child)
          })
        } else if (updateOfNew.length > 0 && diffOfOld.length === 0) {
          updateOfNew.map(function (obj) {
            m = genModelTemplate(str, obj)
            documentFragment = range.createContextualFragment(m)
            pNode.insertBefore(documentFragment, null)
          })
        } else if (updateOfNew.length === 0 && diffOfOld.length > 0) {
          diffOfOld.map(function (obj) {
            child = pNode.querySelector('[id="' + obj[ref] + '"]')
            pNode.removeChild(child)
          })
        }
      }
      oldModel = JSON.parse(JSON.stringify(modelList))
    }
  } else {
    assert(false, 'Model "' + model + '" does not exist.')
  }
}
