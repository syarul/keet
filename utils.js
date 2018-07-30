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

/**
 * @private
 * @description
 * Simple html template literals MODIFIED from : http://2ality.com/2015/01/template-strings-html.html
 * by Dr. Axel Rauschmayer
 * no checking for wrapping in root element
 * no strict checking
 * remove spacing / indentation
 * keep all spacing within html tags 
 */
exports.html = function () {
  var literalSections = [].shift.call(arguments)
  var raw = literalSections.raw
  // remove spacing, indentation
  var trim = raw[raw.length-1]
  trim = trim.split(/\n+/)
  trim = trim.map(function(t){
    return t.trim()
  }).join('')
  var result = ''
  var substs = [].slice.call(arguments) || []
  substs.forEach(function(subst, i) {
      var lit = raw[i]
      if (Array.isArray(subst)) {
          subst = subst.join('')
      }
      if (lit.endsWith('$')) {
          subst = htmlEscape(subst)
          lit = lit.slice(0, -1)
      }
      result += lit
      result += subst
  });
  result += trim // (A)
  return result
}
