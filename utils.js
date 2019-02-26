const genId = () => {
  const rd = () => (Math.random() * 1 * 1e17).toString(36)
  return `KDATA-${rd()}-${rd()}`
}

const minId = () => (Math.random() * 1 * 1e17).toString(36)

const getId = id => document.getElementById(id)

/**
 * @private
 * @description
 * Check a node availability in 100ms, if not found silenty skip the event
 * or execute a callback
 *
 * @param {string} id - the node id
 * @param {function} callback - the function to execute on success
 * @param {function} notFound - the function to execute on failed
 */
const checkNodeAvailability = (component, componentName, callback, notFound) => {
  let ele = getId(component.el)
  let found = false
  let t
  function find () {
    ele = getId(component.el)
    if (ele) {
      clearInterval(t)
      found = true
      callback(component, componentName, ele)
    }
  }
  function fail () {
    clearInterval(t)
    if (!found && notFound && typeof notFound === 'function') notFound()
  }
  if (ele) return ele
  else {
    t = setInterval(find, 0)
    // ignore finding the node after sometimes
    setTimeout(fail, 5)
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
const assert = (val, msg) => {
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
const html = function(...args) {
  // console.log(this)
  // console.log(args)
  const literals = args.shift()
  // console.log(literals.raw)
  const substs = args.slice()
  // console.log(substs)
  let result = literals.raw.reduce((acc, lit, i) => acc + substs[i - 1] + lit)
  // remove spacing, indentation from every line
  // console.log(result)
  result = result.split(/\n+/)
  // console.log(result)
  result = result.map(t => t.trim()).join('')
  return result
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
  html,
  assert,
  checkNodeAvailability,
  genId,
  getId,
  minId,
  childLike
}
