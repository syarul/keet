import { getId } from '../utils'

const DOCUMENT_ELEMENT_TYPE = 1

function isEqual (oldNode, newNode) {
  return (
    isPristine(oldNode, newNode) ||
    compare(oldNode, newNode) ||
    oldNode.isEqualNode(newNode)
  )
}

function compare (oldNode, newNode) {
  return isIgnored(oldNode) && isIgnored(newNode)
}

function isIgnored (node) {
  return node.getAttribute('data-ignore') != null
}

function arbiter (oldNode, newNode) {
  if (oldNode.nodeName !== 'INPUT') return
  if (oldNode.checked !== newNode.checked) {
    oldNode.checked = newNode.checked
  }
  // added method to check explicit node value and compare them
  if (oldNode.value !== newNode.value) {
    oldNode.value = newNode.value
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
      // add new attributes
      if (!oldNode.hasAttribute(attr)) {
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
      // exit on equal and newNode having no children
      if (isEqual(oldNode, newNode) && !newNode.firstChild) {
        return
      // diff children on equal and subsequently exit current execution
      } else  if (isEqual(oldNode, newNode) && newNode.firstChild) {
        diff(oldNode.firstChild, newNode.firstChild, oldNode)
        return
      }
      if (oldNode.nodeName === newNode.nodeName) {
        if (oldNode.hasAttribute('key') && newNode.hasAttribute('key')) {
          oldNode.parentNode.replaceChild(newNode, oldNode)
        } else {
          setAttr(oldNode, newNode)
          diff(oldNode.firstChild, newNode.firstChild, oldNode)
        }
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

function addExtra (count, oldParentNode, newStore) {
  let index
  while (count > 0) {
    count--
    index = getIndex(newStore, count)
    oldParentNode.appendChild(newStore[index])
  }
}

let checkNew
let checkOld

function diff (oldNode, newNode, oldParentNode) {
  let count = 0
  let newStore = []

  while (newNode) {
    count++
    checkNew = newNode
    newNode = newNode.nextSibling
    newStore.push(checkNew)
  }

  let index

  if (!oldNode) {
    // if oldNode is null process newNode
    addExtra(count, oldParentNode, newStore)
  } else {
    while (oldNode) {
      count--
      checkOld = oldNode
      oldNode = oldNode.nextSibling
      index = getIndex(newStore, count)
      if (checkOld && newStore[index]) {
        patch(checkOld, newStore[index])
      } else if (checkOld && !newStore[index]) {
        oldParentNode.removeChild(checkOld)
      }
      if (oldNode === null) {
        addExtra(count, oldParentNode, newStore)
      }
    }
  }
}

function isPristine (oldNode, newNode) {
  // only setup attributes, but ignore all children changes
  if (oldNode) setAttr(oldNode, newNode)
  return newNode.hasAttribute('pristine-model')
}

function diffNodes (node) {
  // let node = getId(this.el) || document.querySelector(`[k-data="${this.__ref__.id}"]`)
  // console.log(node)
  // console.log(node.cloneNode(true), this.vnode.cloneNode(true))
  if (node && !this.__ref__.IS_STUB) {
    diff(node.firstChild, this.vnode, node)
  } else if (node && !isPristine(null, this.vnode)) {
    diff(node.firstChild, this.vnode.firstChild, node)
  }
}

export default diffNodes
