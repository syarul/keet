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

/**
 * @private
 * @description
 * Check a node availability in 50ms, if not found silenty skip the event
 *
 * @param {string} id - the node id
 * @param {function} callback - the function to execute once the node is found
 */
exports.checkNodeAvailability = function (component, componentName, callback) {
  var checked = false
  var ele = getId(component.el)

  if(ele) return ele
  else {
    var t = setInterval(function () {
      ele = getId(component.el)
      if (ele) {
        clearInterval(t)
        checked = true
        callback(component, componentName, ele)
      }
    }, 0)
    setTimeout(function () {
      if (!checked) {
        clearInterval(t)
      }
    }, 50)
  }

}

/**
 * @private
 * @description
 * Confirm that a value is truthy, throws an error message otherwise.
 *
 * @param {*} val - the val to test.
 * @param {string} msg - the error message on failure.
 * @throws {Error}
 */
exports.assert = function (val, msg) {
  if (!val) throw new Error('(keet) ' + msg)
}
