import { getId } from '../../utils'

const DOCUMENT_FRAGMENT_TYPE = 11
// storage for model state
let cache = {}

function removeProtoModel (node, id) {
  let p = node.getElementById(id)
  if (p) p.childNodes[1].remove()
}

function genModelList (node, model, reconcile) {
  let modelList
  let i
  let listClone
  let parentNode
  let list
  let listArg
  let mLength

  cache[model] = cache[model] || {}

  // check if the model use filtering
  listArg = this[model] && this[model].enableFiltering ? 'listFilter' : 'list'

  if (!cache[model][listArg]) {
    cache[model][listArg] = node.nextSibling.cloneNode(true)
    node.nextSibling.remove()
    // also remove from pristine nodes / conditional cache store
    removeProtoModel(this.__pristineFragment__, node.parentNode.id)
  }

  // exit on initial conditional setup
  if (!reconcile) return

  list = cache[model][listArg]

  if (this[model] !== undefined && this[model].hasOwnProperty(listArg)) {

    parentNode = node.parentNode.nodeType === DOCUMENT_FRAGMENT_TYPE ? getId(this.el) : node.parentNode

    // set model to dirty when parent node no visible
    // NOTE: parent container need id
    if(node.parentNode.id && !getId(node.parentNode.id)) {
      this[model].dirty = true
    }

    modelList = this[model][listArg]

    if (!this[model].dirty) {
      parentNode.setAttribute('pristine-model', '')
      return
    }

    i = 0

    mLength = modelList.length

    while (i < mLength) {
      listClone = list.cloneNode(true)
      reconcile.call(this, listClone, null, modelList[i])
      listClone.setAttribute('kdata-id', modelList[i]['kdata-id'])
      parentNode.insertBefore(listClone, parentNode.lastChild)
      i++
    }
    this[model].dirty = false
  }
}

export default genModelList
