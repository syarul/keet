const loopChilds = function(arr, elem) {
  for (var child = elem.firstChild; child !== null; child = child.nextSibling) {
    arr.push(child)
    if (child.hasChildNodes()) {
      loopChilds(arr, child)
    }
  }
}
const insertAfter = function(newNode, referenceNode, parentNode) {
  referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling)
}

const nodeUpdate = function(newNode, oldNode, watcher2) {
  if(!newNode) return false
  var oAttr = newNode.attributes
  var output = {};
  if(oAttr){
    for(var i = oAttr.length - 1; i >= 0; i--) {
       output[oAttr[i].name] = oAttr[i].value
    }
  }
  for (var iAttr in output) {
    if(oldNode.attributes[iAttr] && oldNode.attributes[iAttr].name === iAttr && oldNode.attributes[iAttr].value != output[iAttr]){
      oldNode.setAttribute(iAttr, output[iAttr])
    }
  }
  if(oldNode.textContent  === '' && newNode.textContent){
    oldNode.textContent = newNode.textContent
  }
  if(watcher2 && oldNode.textContent != newNode.textContent){
    oldNode.textContent = newNode.textContent
  }
  if(oldNode.type == 'checkbox' && !oldNode.checked && newNode.checked){
    oldNode.checked = true
  }
  if(oldNode.type == 'checkbox' && oldNode.checked && !newNode.checked){
    oldNode.checked = false
  }
  output = {}
}

const nodeUpdateHTML = function(newNode, oldNode) {
  if(!newNode) return false
  if(newNode.nodeValue !== oldNode.nodeValue)
      oldNode.nodeValue = newNode.nodeValue
}

const updateElem = function(oldElem, newElem, watcher2){
  var oldArr = [], newArr = []
  oldArr.push(oldElem)
  newArr.push(newElem)
  loopChilds(oldArr, oldElem)
  loopChilds(newArr, newElem)
  oldArr.forEach(function(ele, idx, arr) {
    if (ele.nodeType === 1 && ele.hasAttributes()) {
      nodeUpdate(newArr[idx], ele, watcher2)
    } else if (ele.nodeType === 3) {
      nodeUpdateHTML(newArr[idx], ele)
    }
    if(idx === arr.length - 1){
      oldArr.splice(0)
      newArr.splice(0)
    }
  })
}

export {
  loopChilds,
  insertAfter,
  nodeUpdate,
  nodeUpdateHTML,
  updateElem
}