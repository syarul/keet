const genId = () => {
  const rd = () => (Math.random() * 1 * 1e17).toString(36)
  return `KDATA-${rd()}-${rd()}`
}

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
 * @description
 * Store expression and assign reference 
 *
 * @param {Object} expressions - array of expressions
 * @param {Object} literalsRaw - raw data array of literals
 */
const storeInlineEvt = function(expressions, literalsRaw) {
  literalsRaw.map((l, index) => {
    if(l.match(/\s+on/) && typeof expressions[index] === 'function'){
      let id = `evt-${minId()}`
      this.__refEvents__.push({
        id: id,
        expression: expressions[index]
      })
      expressions[index] = id
    }
  })
}

/**
 * @private
 * @description
 * Store component expression and assign reference 
 *
 * @param {Object} expressions - array of expressions
 * @param {Object} literalsRaw - raw data array of literals
 */
const storeComponentRef = function(args, literalsRaw) {
  // console.log(args, literalsRaw)
  return args.map(exp => {
    if(typeof exp === 'object' && exp.constructor && exp.constructor.prototype){
      if(typeof Object.getPrototypeOf(exp).constructor.prototype.autoRender !== 'function') 
        return exp
      let id = `co-${minId()}`
      this.__refCo__[id.toUpperCase()] = { exp }
      return id
    }
    return exp
  })
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
 * store inline eventListener if context available
 */
const html = function(...args) {
  const literals = args.shift()
  // console.log(args, literals)
  console.log(Object.getPrototypeOf(this)[])
  if(this !== undefined){
    storeInlineEvt.call(this, args, literals.raw)
    args = storeComponentRef.call(this, args, literals.raw)
  }
  const substs = args.slice()
  let result = literals.raw.reduce((acc, lit, i) => acc + substs[i - 1] + lit)
  // remove spacing, indentation from every line
  result = result.split(/\n+/)
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
  genId,
  getId,
  minId,
  childLike
}
