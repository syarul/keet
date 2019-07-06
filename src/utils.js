import {
  isNumber,
  isString,
  isFunction,
  isObject,
  isArray,
  isNaN,
  isUndefined,
  isNull,
  isBoolean,
} from 'lodash'

const type = {
  str: isString,
  num: isNumber,
  func: isFunction,
  obj: isObject,
  ary: isArray,
  nan: isNaN,
  undef: isUndefined,
  null: isNull,
  bool: isBoolean
}

const typeCheck = value => {
  if(!isObject(value)) throw new Error('Wrong argument type')
  for(let attr in value){
    return type[attr](value[attr])
  }
  return false
}

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

export {
  typeCheck,
  assert,
  getId,
  childLike,
  activatePubsub
}
