const getId = id => document.getElementById(id)

/**
 * @private
 * @description
 * Confirm that a value is truthy, throws an error message otherwise.
 *
 * @param {*} val - the val to test.
 * @param {string} msg - the error message on failure.
 * @throws {Error}
 */
const assert = (val, msg) => {
  if (!val) throw new Error('(keet) ' + msg)
}

/**
 * @private
 * @decorator
 * Add checking for child component
 */
const childLike = function () {
  return function (target) {
    if (target.__ref__) target.__ref__.IS_STUB = true
  }
}

/**
 * @private
 * @decorator
 * Add internal pub/sub to component
 */
const activatePubsub = function () {
  return function (target) {

    /**
     * Another component can subscribe to changes on this component.
     * This is the subscribe method
     * @param {String} register - the callback function identifier name
     * @param {Function} fn - the callback function for the subscribe
     */
    target.prototype.subscribe = function (register, fn) {
      assert(isFunction(fn), 'Second argument is not a function.')
      this.__ref__.exec = this.__ref__.exec[register] = fn
      return register
    }

    /**
     * Another component can subscribe to changes on this component.
     * This is the unsubscribe method
     * @param {Integer} register - the register index identifier
     */
    target.prototype.unsubscribe = function (register) {
      delete this.__ref__.exec[register]
    }

    /**
     * Another component can subscribe to changes on this component.
     * This is the publish method
     * @param {...*} value - one or more parameters to publish to subscribers
     */
    target.prototype.publish = function () {
      const register = [].shift.call(arguments)
      isFunction(this.__ref__.exec[register]) && this.__ref__.exec[register].apply(null, arguments)
    }
  }
}

function isEqualWith(a, b, c){
  return isFunction(c) && c(a, b)
}

function customizer(o, n) {
  for(let i in n) {
    if(o[i] !== n[i]){
      return false
    }
  }
  return true
}

function uniqueId (f) {
  return (f ? f : '') + (Math.random() * 1e17).toString(36).slice(0, 4)
}

function isObject(o) { return typeof o === 'object' }
function isBoolean(o) { return typeof o === 'boolean' }
function isString(o) { return typeof o === 'string' }
function isFunction(o) { return typeof o === 'function' }
function isElement(o) { return o instanceof Element }
function isArray(o) { return o instanceof Array }
function isNumber(o) { return typeof o === 'number' }

export {
  assert,
  getId,
  childLike,
  activatePubsub,
  isEqualWith,
  customizer,
  isObject,
  isBoolean,
  isString,
  isFunction,
  isElement,
  uniqueId,
  isArray,
  isNumber
}
