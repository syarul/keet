import { getId } from '../../../utils'

const DOCUMENT_ELEMENT_TYPE = 1
const DOCUMENT_COMMENT_TYPE = 8
const modelRawStart = /\{\{model:([^{}]+)\}\}/g

function isEqual (oldNode, newNode) {
  return (
    (isIgnored(oldNode) && isIgnored(newNode)) ||
    oldNode.isEqualNode(newNode)
  )
}

function isIgnored (node) {
  return node.getAttribute('data-ignore') != null
}

function arbiter (oldNode, newNode) {
  if (oldNode.nodeName !== 'INPUT') return
  if (oldNode.checked !== newNode.checked) {
    oldNode.checked = newNode.checked
  }
}

function setAttr (oldNode, newNode) {
  let oAttr = newNode.attributes
  let output = {}
  let i = 0
  while (i < oAttr.length) {
    output[oAttr[i].name] = oAttr[i].value
    i++
  }
  let iAttr = oldNode.attributes
  let input = {}
  let j = 0
  while (j < iAttr.length) {
    input[iAttr[j].name] = iAttr[j].value
    j++
  }
  for (let attr in output) {
    if (oldNode.attributes[attr] && oldNode.attributes[attr].name === attr && oldNode.attributes[attr].value !== output[attr]) {
      oldNode.setAttribute(attr, output[attr])
    } else {
      // add new attributes as long is not part of k-<eventListener>
      if (!oldNode.hasAttribute(attr) && !/^k-/.test(attr)) {
        oldNode.setAttribute(attr, output[attr])
      }
    }
  }
  for (let attr in input) {
    // if attributes does not exist on the new node we removed it from the old node
    if (newNode.attributes[attr] && oldNode.attributes[attr]) {
    } else {
      oldNode.removeAttribute(attr)
    }
  }
}

function patch (oldNode, newNode) {
  if (oldNode.nodeType === newNode.nodeType) {
    if (oldNode.nodeType === DOCUMENT_ELEMENT_TYPE) {
      arbiter(oldNode, newNode)
      if (isEqual(oldNode, newNode)) return
      diff(oldNode.firstChild, newNode.firstChild)
      if (oldNode.nodeName === newNode.nodeName) {
        setAttr(oldNode, newNode)
      } else {
        oldNode.parentNode.replaceChild(newNode, oldNode)
      }
    } else {
      if (oldNode.nodeValue !== newNode.nodeValue) {
        oldNode.nodeValue = newNode.nodeValue
      }
    }
  } else {
    oldNode.parentNode.replaceChild(newNode, oldNode)
  }
}

function getIndex (store, count) {
  return store.length - count - 1
}

let checkNew
let checkOld

function diff (oldNode, newNode, ignoreNextSibling) {
  let count = 0
  let newStore = []
  while (newNode) {
    count++
    checkNew = newNode
    newNode = ignoreNextSibling ? null : newNode.nextSibling
    newStore.push(checkNew)
  }
  let index
  let oldParentNode = oldNode && oldNode.parentNode
  while (oldNode) {
    count--
    checkOld = oldNode
    oldNode = ignoreNextSibling ? null : oldNode.nextSibling
    index = getIndex(newStore, count)
    if (checkOld && newStore[index]) {
      patch(checkOld, newStore[index])
    } else if (checkOld && !newStore[index]) {
      oldParentNode.removeChild(checkOld)
    }
    if (oldNode === null) {
      while (count > 0) {
        count--
        index = getIndex(newStore, count)
        oldParentNode.appendChild(newStore[index])
      }
    }
  }
}

function childIsModel (node) {
  let range
  if (typeof document.createRange === 'function') {
    range = document.createRange()
  }
  return !range ? range : node.nodeType === DOCUMENT_COMMENT_TYPE && node.nodeValue.match(modelRawStart) !== null
}

function diffNodes (instance) {
  let base = getId(this.el)
  if (base && !this.IS_STUB) {
    diff(base.firstChild, instance)
  } else if (base && !childIsModel(base.firstChild)) {
    diff(base.firstChild, instance.firstChild)
  }
}

function diffModelNodes (oldModel, newModel, ignoreNextSibling) {
  diff(oldModel, newModel, ignoreNextSibling)
}

export {
  diffNodes as default,
  diffModelNodes
}
