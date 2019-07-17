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
 * Add internal pub/sub to component
 */
const eventHooks = function() {

    return function(target) {

        /**
         * Returns a reference to the eventName reg, so the chained function is called
         * @param {string} reg - the identifier eventName
         * @param {function} fn - the function to chained
         */
        target.prototype.on = function(reg, fn) {
            assert(typeof fn === 'function', 'Second argument is not a function.')
            this.__ref__ = this.__ref__ || {}
            this.__ref__[reg] = fn
            return reg
        }

        /**
         * Removes the specified listener from the listener array for the event named reg
         * @param {string} register - the register index identifier
         */
        target.prototype.removeListener = function(reg) {
            delete this.__ref__[reg]
        }

        /**
         * Synchronously calls a listener registered for the event named reg
         * @param {string} reg - the event name
         * @param {...*} value - one or more parameters to emit to listener
         */
        target.prototype.emit = function() {
            const reg = [].shift.call(arguments)
            typeof this.__ref__[reg] === 'function' && this.__ref__[reg].apply(null, arguments)
        }
    }
}

const assign = function() {
    return Object.assign.apply(this, arguments)
}

const isNode = function(vnode) {
    return typeof vnode === 'object' &&
        vnode.hasOwnProperty('elementName') &&
        vnode.hasOwnProperty('attributes') &&
        vnode.hasOwnProperty('children')
}

const isFunc = function(vnode) {
    return typeof vnode === 'function'
}

const isObj = function(vnode) {
    return typeof vnode === 'object' && typeof vnode !== 'function'
}

const isArr = function(vnode) {
    return typeof vnode === 'object' &&
        Array.isArray(vnode)
}

const getProto = function(_object, _constructor) {
    if(!_object) return false
    return Object.getPrototypeOf(Object.getPrototypeOf(_object).constructor) === _constructor
}

const getShallowProto = function(_object, _constructor) {
    if(!_object) return false
    return Object.getPrototypeOf(_object).constructor === _constructor
}

const composite = function() {
    this.__composite__ = new Promise(function(resolve) {
        this._resolve = resolve
    }.bind(this))
}

export {
    assert,
    eventHooks,
    assign,
    isNode,
    isFunc,
    isObj,
    isArr,
    getProto,
    getShallowProto,
    composite
}