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
const html = (...args) => {
  const literals = args.shift()
  const substs = args.slice()

  let result = literals.raw.reduce((acc, lit, i) => acc + substs[i - 1] + lit)
  // remove spacing, indentation from every line
  result = result.split(/\n+/)
  result = result.map(t => t.trim()).join('')
  return result
}

const notEqual = function (a, b) {
  return a['kdata-id'] !== b['kdata-id']
}

let async = {}

/**
 * @private
 * @description
 * We otimize component lifeCycle triggering by
 * trottling the model batch updates
 *
 */
const inform = function (...args) {
  if(async[this.mId]) clearTimeout(async[this.mId])
  async[this.mId] = setTimeout(() =>
    this.exec && typeof this.exec === 'function' && this.exec.apply(null, args)
  )
}

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
class createModel {
  constructor (enableFiltering) {

    this.mId = this.indentity

    async[this.mId] = null
    // if enableFiltering is assigned a value, model generation will
    // use `listFilter` instead of `list`
    this.enableFiltering = enableFiltering || null

    this.exec = null

    this.model = []

    // Register callback listener of any changes
    Object.defineProperty(this, 'list', {
      enumerable: false,
      configurable: true,
      get: function () {
        return this.model
      },
      set: function (val) {
        this.model = val
        inform.call(this, this.model, this.listFilter)
      }
    })

    // Register callback listener of any changes with filter
    Object.defineProperty(this, 'listFilter', {
      enumerable: false,
      configurable: true,
      get: function () {
        return !this.prop ? this.model : this.model.filter(obj => obj[this.prop] === this.value)
      }
    })
  }

  // set identity for this model
  static get indentity () {
    return minId()
  }

  /**
   * @private
   * @description
   * Subscribe to the model changes (add/update/destroy)
   *
   * @param {Object} model - the model including all prototypes
   *
   */
  subscribe (fn) {
    this.exec = fn
  }

  /**
   * @private
   * @description
   * Add new object to the model list
   *
   * @param {Object} obj - new object to add into the model list
   *
   */
  add (obj) {
    this.list = this.list.concat({ ...obj, 'kdata-id': minId() })
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
  update (updateObj) {
    this.list = this.list.map(obj =>
      notEqual(obj, updateObj) ? obj : updateObj
    )
  }

  /**
   * @private
   * @description
   * Filter the model data by selected properties, constructor
   * instantiation should be apply with boolean true as argument
   * to enable filtering
   * @param {String} prop - property of the object
   * @param {String|Boolean|Interger} value - property value
   *
   */
  filter (prop, value) {
    this.prop = prop
    this.value = value
    this.list = this.list.map(obj => obj)
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
  destroy (destroyObj) {
    this.list = this.list.filter(obj =>
      notEqual(obj, destroyObj)
    )
  }
}

export {
  createModel,
  html,
  assert,
  checkNodeAvailability,
  genId,
  getId,
  minId
}
