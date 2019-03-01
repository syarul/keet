const minId = () => (Math.random() * 1 * 1e17).toString(36)

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
    target.IS_STUB = true
  }
}

export {
  assert,
  getId,
  minId,
  childLike
}
