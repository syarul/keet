import { assert, getId, checkNodeAvailability } from '../utils'
import genModelTemplate from './genModelTemplate'

const re = /{{([^{}]+)}}/g

// diffing two array of objects, including object properties differences
const diff = (fst, sec) =>
  fst.filter(obj =>
    !sec.some(inr => {
      let predicate = true
      for (let attr in inr) {
        if (obj[attr] !== inr[attr]) {
          predicate = false
        }
      }
      return predicate
    })
  )

// check if browser support createRange
let range
if (typeof document.createRange === 'function') {
  range = document.createRange()
}

// storage for model state
let cache = {}

export default function (node, model, tmplHandler) {
  let modelList
  let mLength
  let i
  let listClone
  let parentNode
  let m
  let documentFragment
  let updateOfNew
  let diffOfOld
  let pNode
  let ref
  let equalLength
  let child
  let list
  let str
  let oldModel
  let p

  cache[model] = cache[model] || {}

  if (!cache[model].list) {
    cache[model].list = node.nextSibling.cloneNode(true)
  }
  list = cache[model].list

  if (!cache[model].str) {
    cache[model].str = node.nextSibling.cloneNode(true).outerHTML
  }
  str = cache[model].str

  if (!cache[model].ref) {
    if (list.hasAttribute('id') && list.id.match(re)) {
      cache[model].ref = list.id.replace(re, '$1')
      // remove the first prototype node
      node.nextSibling.remove()
      // also remove from pristine node
      p = this.__pristineFragment__.getElementById(list.id)
      if (p) p.remove()
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

      const diffModel = function (...args) {
        pNode = args.pop()
        // check if both models are equally in length
        equalLength = oldModel.length === modelList.length

        // do properties update
        if (equalLength) {
          updateOfNew.map(obj => {
            child = pNode.querySelector(`[id="${obj[ref]}"]`)
            m = genModelTemplate(str, obj)
            documentFragment = range.createContextualFragment(m)
            pNode.replaceChild(documentFragment, child)
          })
        // add new objects
        } else if (updateOfNew.length > 0 && diffOfOld.length === 0) {
          updateOfNew.map((obj) => {
            m = genModelTemplate(str, obj)
            documentFragment = range.createContextualFragment(m)
            pNode.insertBefore(documentFragment, pNode.lastChild)
          })
        // destroy selected objects
        } else if (updateOfNew.length === 0 && diffOfOld.length > 0) {
          diffOfOld.map(obj => {
            child = pNode.querySelector(`[id="${obj[ref]}"]`)
            pNode.removeChild(child)
          })
        }
        // replace oldModel after diffing
        cache[model].oldModel = JSON.parse(JSON.stringify(modelList))
      }

      // check existing parentNode in the DOM
      if (parentNode.hasAttribute('id')) {
        pNode = getId(parentNode.id)

        if (pNode) {
          diffModel.call(this, null, null, pNode)
        } else {
          checkNodeAvailability({ el: parentNode.id }, model, diffModel.bind(this), function () {
            // we cleanup cache on failed search
            cache[model].oldModel = []
          })
        }
      }
    }
  } else {
    assert(false, 'Model "' + model + '" does not exist.')
  }
}
