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
const childLike = function() {
    return function(target) {
        if (target.__ref__) target.__ref__.IS_STUB = true
    }
}

/**
 * @private
 * @decorator
 * Add internal pub/sub to component
 */
const eventHooks = function() {
    return function(target) {

        /**
         * Another component can subscribe to changes on this component.
         * This is the subscribe method
         * @param {String} register - the callback function identifier name
         * @param {Function} fn - the callback function for the subscribe
         */
        target.prototype.sub = function(reg, fn) {
            assert(typeof fn === 'function', 'Second argument is not a function.')
            this.__ref__ = this.__ref__ || {}
            this.__ref__[reg] = fn
            return reg
        }

        /**
         * Another component can subscribe to changes on this component.
         * This is the unsubscribe method
         * @param {Integer} register - the register index identifier
         */
        target.prototype.unsub = function(reg) {
            delete this.__ref__[reg]
        }

        /**
         * Another component can subscribe to changes on this component.
         * This is the publish method
         * @param {...*} value - one or more parameters to publish to subscribers
         */
        target.prototype.pub = function() {
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

const isArr = function(vnode) {
    return typeof vnode === 'object' &&
        Array.isArray(vnode)
}

const getProto = function(_object, _constructor) {
    return Object.getPrototypeOf(Object.getPrototypeOf(_object).constructor) === _constructor
}

const composite = function() {
    this.__composite__ = new Promise(function(resolve) {
        this._resolve = resolve
    }.bind(this))
}

export {
    assert,
    getId,
    childLike,
    eventHooks,
    assign,
    isNode,
    isFunc,
    isArr,
    getProto,
    composite
}