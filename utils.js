var getId = function (id) {
  return document.getElementById(id)
}

exports.getId = getId

exports.testEvent = function (tmpl) {
  return / k-/.test(tmpl)
}

/**
 * @private
 * @description
 * Check a node availability in 250ms, if not found silenty skip the event
 *
 * @param {string} id - the node id
 * @param {function} callback - the function to execute once the node is found
 */
exports.checkNodeAvailability = function (component, componentName, callback, notFound) {
  var ele = getId(component.el)
  var found = false
  if (ele) return ele
  else {
    var t = setInterval(function () {
      ele = getId(component.el)
      if (ele) {
        clearInterval(t)
        found = true
        callback(component, componentName, ele)
      }
    }, 0)
    // silently ignore finding the node after sometimes
    setTimeout(function () {
      clearInterval(t)
      if (!found && notFound && typeof notFound === 'function') notFound()
    }, 250)
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
 * include handling ${} in the literals
 */
exports.html = function html () {
  var literals = [].shift.call(arguments)
  var substs = [].slice.call(arguments)

  var result = literals.raw.reduce(function (acc, lit, i) {
    return acc + substs[i - 1] + lit
  })
  // remove spacing, indentation from every line
  result = result.split(/\n+/)
  result = result.map(function (t) {
    return t.trim()
  }).join('')
  return result
}

/**
 * @private
 * @description
 * trottle function calls
 *
 * @param {Function} fn - function to trottle
 * @param {Number} delay - time delay before function get executed
 */

function trottle(fn, delay) {
  var timer = null;
  return function () {
    var context = this, args = arguments;
    clearTimeout(timer);
    timer = setTimeout(function () {
      fn.apply(context, args);
    }, delay);
  };
};

exports.trottle = trottle

/**
 * @private
 * @description
 * Copy with modification from preact-todomvc. Model constructor with
 * registering callback listener in Object.defineProperty. Any modification
 * to ```this.list``` instance will subsequently inform all registered listener.
 *
 * {{model:<myModel>}}<myModelTemplateString>{{/model:<myModel>}}
 *
 */
function createModel () {
  var model = []
  var onChanges = []

  var inform = function () {
    // console.log(onChanges)
    for (var i = onChanges.length; i--;) {
      onChanges[i](model)
    }
  }

/**
 * @private
 * @description
 * Register callback listener of any changes
 */
  Object.defineProperty(this, 'list', {
    enumerable: false,
    configurable: true,
    get: function () {
      return model
    },
    set: function (val) {
      model = val
      inform()
    }
  })

/**
 * @private
 * @description
 * Subscribe to the model changes (add/update/destroy)
 *
 * @param {Object} model - the model including all prototypes
 *
 */
  this.subscribe = function (fn) {
    onChanges.push(fn)
  }

/**
 * @private
 * @description
 * Add new object to the model list
 *
 * @param {Object} obj - new object to add into the model list
 *
 */
  this.add = function (obj) {
    this.list = this.list.concat(obj)
  }

/**
 * @private
 * @description
 * Update existing object in the model list
 *
 * @param {String} lookupId - lookup id property name of the object
 * @param {Object} updateObj - the updated properties
 *
 */
  this.update = function (lookupId, updateObj) {
    this.list = this.list.map(function (obj) {
      return obj[lookupId] !== updateObj[lookupId] ? obj : Object.assign(obj, updateObj)
    })
  }

/**
 * @private
 * @description
 * Removed existing object in the model list
 *
 * @param {String} lookupId - lookup id property name of the object
 * @param {String} objId - unique identifier of the lookup id
 *
 */
  this.destroy = function (lookupId, objId) {
    this.list = this.list.filter(function (obj) {
      return obj[lookupId] !== objId
    })
  }
}

exports.createModel = createModel
