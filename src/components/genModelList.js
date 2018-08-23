import { getId, checkNodeAvailability } from '../../utils'
import genModelTemplate from './genModelTemplate'
import { cache as conditionalCache } from './conditionalNodes'
import { diffModelNodes } from './templateParse/diffNodes'

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
let m
let documentFragment

function render (str, obj) {
  m = genModelTemplate.call(this, str, obj)
  documentFragment = range.createContextualFragment(m)
  documentFragment.firstChild.setAttribute('kdata-id', obj['kdata-id'])
}

function removeProtoModel (node, id, after) {
  let p = node.getElementById(id)
  if (p) p.childNodes[1].remove()
  else if (!after) {
    Object.keys(conditionalCache).map(cache =>
      removeProtoModel(conditionalCache[cache].frag, id, true)
    )
  }
}

function getIndex (model, modelList){
  // let curIndex
  // modelList.some((m, index) => {
  //   curIndex = index
  //   return m['kdata-id'] === model['kdata-id']
  // })
  let curIndex = modelList.map(m => m['kdata-id']).indexOf(model['kdata-id'])
  return curIndex + 1
}

function genModelList (node, model, reconcile) {
  // let perf = performance.now()
  let type
  let modelList
  let i
  let listClone
  let parentNode
  let updateOfNew
  let diffOfOld
  let pNode
  let equalLength
  let child
  let list
  let str
  let oldModel
  let listArg
  let idx
  let beforeNode
  let f

  cache[model] = cache[model] || {}

  // check if the model use filtering
  listArg = this[model] && this[model].enableFiltering ? 'listFilter' : 'list'

  if (!cache[model][listArg]) {
    cache[model][listArg] = node.nextSibling.cloneNode(true)
  }
  list = cache[model][listArg]

  if (!cache[model].str) {
    cache[model].str = node.nextSibling.cloneNode(true).outerHTML
    // remove the first prototype node
    node.nextSibling.remove()
    // also remove from pristine nodes / conditional cache store
    removeProtoModel(this.__pristineFragment__, node.parentNode.id)
  }
  str = cache[model].str

  if (this[model] !== undefined && this[model].hasOwnProperty(listArg)) {
    parentNode = node.parentNode

    if (range && !parentNode.hasAttribute('data-ignore')) {
      parentNode.setAttribute('data-ignore', '')
    }

    modelList = this[model][listArg]

    oldModel = cache[model].oldModel || []

    // check if current browser doesn't support createRange()
    if (!range) {
      i = 0
      while (i < modelList.length) {
        // fallback to regular node generation handler
        listClone = list.cloneNode(true)
        reconcile.call(this, listClone, null, modelList[i])
        listClone.setAttribute('kdata-id', modelList[i]['kdata-id'])
        parentNode.insertBefore(listClone, parentNode.lastChild)
        i++
      }
    } else {

      updateOfNew = diff(modelList, oldModel)
      
      // ignore diffing oldModel when length is the same
      if(modelList.length !== oldModel.length){
        diffOfOld = diff(oldModel, modelList)
      }
      // l('diffing', performance.now() - perf)
      const diffModel = function (...args) {
        pNode = args.pop()
        // check if both models are equally in length
        equalLength = oldModel.length === modelList.length

        // l(oldModel, modelList)

        if (equalLength && pNode.childNodes.length !== 2) {
          type = 'replace equal'
          i = 0

          // let ttEnd = 0
          // let ttEnd2 = 0
          while (i < updateOfNew.length) {

            // let tt = performance.now()
            let idx = getIndex(updateOfNew[i], modelList)
            // ttEnd += performance.now() - tt
            // l(idx, modelList)

            // if (updateOfNew[i]['kdata-id'] === diffOfOld[i]['kdata-id']) {
              // equal node element id
              // child = pNode.querySelector(`[kdata-id="${updateOfNew[i]['kdata-id']}"]`)
            // } else {
            //   // replace if it doesn't share the same id
            //   child = pNode.querySelector(`[kdata-id="${diffOfOld[i]['kdata-id']}"]`)
            // }
            child = pNode.childNodes[idx]
            let nextSibling = child.nextSibling
            child.remove()
            // l(child)
            if (child) {
              // let tt2 = performance.now()
              render.call(this, str, updateOfNew[i])
              pNode.insertBefore(documentFragment, nextSibling)
              // pNode.replaceChild(documentFragment, child)
              // diffModelNodes(child, documentFragment.firstChild, true)
              // ttEnd2 += performance.now() - tt2
            }
            i++
          }
          // l('>>>>>> getIndex',ttEnd)
          // l('>>>>>> render',ttEnd2)
        // add new objects
        } else if (updateOfNew.length > 0 && diffOfOld.length === 0) {
          type = 'add'
          i = 0
          while (i < updateOfNew.length) {
            render.call(this, str, updateOfNew[i])
            if (updateOfNew[i]['kdata-id'] === modelList[modelList.length - 1]['kdata-id']) {
              beforeNode = pNode.lastChild
            } else {
              idx = modelList.map(m => m['kdata-id']).indexOf(updateOfNew[i]['kdata-id'])
              beforeNode = pNode.childNodes[idx].nextSibling
            }
            pNode.insertBefore(documentFragment, beforeNode)
            i++
          }
        // destroy selected objects
        } else if (updateOfNew.length === 0 && diffOfOld.length > 0) {
          i = 0
          while (i < diffOfOld.length) {
            child = pNode.querySelector(`[kdata-id="${diffOfOld[i]['kdata-id']}"]`)
            if (child) {
              pNode.removeChild(child)
            }
            i++
          }
        } else if (updateOfNew.length > 0 && diffOfOld.length > 0) {
          // if both differences has length we remove the old children and replace it with the new ones
          type = 'replace not equal'
          i = 0
          while (i < diffOfOld.length) {
            child = pNode.querySelector(`[kdata-id="${diffOfOld[i]['kdata-id']}"]`)
            if (child) {
              pNode.removeChild(child)
            }
            i++
            if (i === diffOfOld.length) {
              f = 0
              while (f < updateOfNew.length) {
                render.call(this, str, updateOfNew[f])
                pNode.insertBefore(documentFragment, pNode.lastChild)
                f++
              }
            }
          }
        } else {
          type = 'complete replace'
          i = 0
          while (i < modelList.length) {
            render.call(this, str, modelList[i])
            pNode.insertBefore(documentFragment, pNode.lastChild)
            i++
          }
        }
        // replace oldModel after diffing
        cache[model].oldModel = JSON.parse(JSON.stringify(modelList))
        // l(type, performance.now() - perf)
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
  }
}

export default genModelList
