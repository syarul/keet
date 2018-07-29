var getId = function (id) {
  return document.getElementById(id)
}

exports.getId = getId

exports.genId = function () {
  return (Math.round(Math.random() * 0x1 * 1e12)).toString(32)
}

var loopChilds = function (arr, elem) {
  for (var child = elem.firstChild; child !== null; child = child.nextSibling) {
    arr.push(child)
    if (child.hasChildNodes()) {
      loopChilds(arr, child)
    }
  }
}

exports.loopChilds = loopChilds

exports.testEvent = function (tmpl) {
  return / k-/.test(tmpl)
}

exports.checkNodeAvailability = function (id, callback) {
  var ele
  var checked = false
  var t = setInterval(function () {
    ele = getId(id)
    if (ele) {
      clearInterval(t)
      checked = true
      callback()
    }
  }, 0)
  setTimeout(function () {
    if (!checked) {
      clearInterval(t)
      // throw new Error('Unable to find html entity with id ' + id + '.')
    }
  }, 50)
}
