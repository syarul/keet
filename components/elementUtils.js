
var loopChilds = function (arr, elem) {
  if (!elem) return false
  for (var child = elem.firstChild; child !== null; child = child.nextSibling) {
    arr.push(child)
    if (child.hasChildNodes()) {
      loopChilds(arr, child)
    }
  }
}

exports.loopChilds = loopChilds

var nodeUpdate = function (newNode, oldNode) {
  if (!newNode) return
  // diff current newNodes and oldNodes, and make update
  // if nodes is not of same length throw an error
  // todo: create another component with the effected state(s)
  if (newNode.length !== oldNode.length){
    throw new Error('Nodes is not of same length, detach effected node as another component')
  }
  var oAttr = newNode.attributes
  var output = {}

  for (var i = oAttr.length - 1; i >= 0; i--) {
    output[oAttr[i].name] = oAttr[i].value
  }
  for (var iAttr in output) {
    if (oldNode.attributes[iAttr] && oldNode.attributes[iAttr].name === iAttr && oldNode.attributes[iAttr].value !== output[iAttr]) {
      oldNode.setAttribute(iAttr, output[iAttr])
    }
  }
  if (oldNode.textContent === '' && newNode.textContent) {
    oldNode.textContent = newNode.textContent
  }
  if (oldNode.type === 'checkbox' && !oldNode.checked && newNode.checked) {
    oldNode.checked = true
  }
  if (oldNode.type === 'checkbox' && oldNode.checked && !newNode.checked) {
    oldNode.checked = false
  }
  output = {}
}

var nodeUpdateHTML = function (newNode, oldNode) {
  if (!newNode) return
  if (newNode.nodeValue !== oldNode.nodeValue) { oldNode.nodeValue = newNode.nodeValue }
}

exports.updateElem = function (oldElem, newElem, ignoreNodes) {
  var oldArr = []
  var newArr = []
  oldArr.push(oldElem)
  newArr.push(newElem)
  loopChilds(oldArr, oldElem, ignoreNodes)
  loopChilds(newArr, newElem, ignoreNodes)
  oldArr.map(function (ele, idx, arr) {
    if (ele && ele.nodeType === 1 && ele.hasAttributes()) {
      nodeUpdate(newArr[idx], ele)
    } else if (ele && ele.nodeType === 3) {
      nodeUpdateHTML(newArr[idx], ele)
    }
    if (idx === arr.length - 1) {
      oldArr.splice(0)
      newArr.splice(0)
    }
  })
}
