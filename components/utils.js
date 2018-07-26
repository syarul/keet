var getId = function (id) {
  return document.getElementById(id)
}

exports.getId = getId

exports.genId = function () {
  return (Math.round(Math.random() * 0x1 * 1e12)).toString(32)
}

exports.selector = function (id) {
  return document.querySelector('[keet-id="' + id + '"]')
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

exports.checkNodeAvailabity = function(obj, genTemplate, callback) {
  var ele
  var checked = false
  var id = this.el
  var self = this
  var t = setInterval(function() {
    ele = getId(id)
    if (ele) {
      clearInterval(t)
      checked = true
      callback.call(self, ele, obj, genTemplate)
    }
  }, 0)
  setTimeout(function() {
    if (!checked) {
      clearInterval(t)
      throw new Error('Unable to find html entity with id ' + id + '.')
    }
  }, 500)
}

exports.available = function(ele, obj, genTemplate){
  ele.appendChild(genTemplate.call(this, obj))
}

exports.fn = function(f) {
 return typeof f === 'function'
}

exports.testEvent = function(tmpl) {
  return / k-/.test(tmpl)
}