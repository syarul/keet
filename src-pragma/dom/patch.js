const DOCUMENT_ELEMENT_TYPE = 1

function isEqual(oldNode, newNode) {
    return (arbiter(oldNode, newNode) || oldNode.isEqualNode(newNode))
}

function arbiter(oldNode, newNode) {
    if (oldNode.nodeName !== 'INPUT') return
    if (oldNode.checked !== newNode.checked) {
        oldNode.checked = newNode.checked
    }
    if (oldNode.value !== newNode.value) {
        oldNode.value = newNode.value
    }
}

function setAttr(oldNode, newNode) {
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
        if (newNode.attributes[attr] && oldNode.attributes[attr]) {} else {
            oldNode.removeAttribute(attr)
        }
    }
}

function patch(oldNode, newNode) {
    console.log(oldNode, newNode)
    if (oldNode.nodeType === newNode.nodeType) {
        if (oldNode.nodeType === DOCUMENT_ELEMENT_TYPE) {
            if (isEqual(oldNode, newNode)) return
            if (oldNode.nodeName === newNode.nodeName) {
                if (oldNode.hasAttribute('key') && newNode.hasAttribute('key')) {
                    oldNode.parentNode.replaceChild(newNode, oldNode)
                } else {
                    setAttr(oldNode, newNode)
                    diff(oldNode.firstChild, newNode.firstChild, oldNode)
                }
            } else {
                if (newNode.nodeName !== 'IGNORE-ELEMENT') {
                    oldNode.parentNode.replaceChild(newNode, oldNode)
                } else {
                    if (!newNode.hasAttribute('ignore-attr')) {
                        setAttr(oldNode, newNode)
                    }
                    diff(oldNode.firstChild, newNode.firstChild, oldNode)
                }
            }
        } else {
            if (oldNode.nodeValue !== newNode.nodeValue) {
                oldNode.nodeValue = newNode.nodeValue
            }
        }
    } else {
        if (newNode.nodeName !== 'IGNORE-ELEMENT') {
            oldNode.parentNode.replaceChild(newNode, oldNode)
        } else {
            if (oldNode.nodeType === DOCUMENT_ELEMENT_TYPE) {
                if (!newNode.hasAttribute('ignore-attr')) {
                    setAttr(oldNode, newNode)
                }
                diff(oldNode.firstChild, newNode.firstChild, oldNode)
            }
        }
    }
}

function getIndex(store, count) {
    return store.length - count - 1
}

function addExtra(count, oldParentNode, newStore) {
    let index
    while (count > 0) {
        count--
        index = getIndex(newStore, count)
        oldParentNode.appendChild(newStore[index])
    }
}

let checkNew
let checkOld

function diff(oldNode, newNode, oldParentNode) {
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

function patcher(node, update) {
    diff(node.firstChild, update.firstChild, update)
}

export default patcher