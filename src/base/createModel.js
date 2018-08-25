import { minId } from '../../utils'

/**
 * @module keet/createModel
 * @example
 * import { createModel } from 'keet'
 *
 * class myModel extends createModel {
 *   contructor() {
 *     super()
 *     // props 
 *   }
 *   // new extended method
 *   myMethod(...args){
 *     this.list = args 
 *   }
 * }
 *
 * const MyModel = new myModel()
 */

// check two objects properties attribute kdata-id and return the value equality
const notEqual = function (a, b) {
  return a['kdata-id'] !== b['kdata-id']
}

let async = {}

// We otimize component lifeCycle triggering by trottling the model batch updates
const inform = function (...args) {
  if (async[this.mId]) clearTimeout(async[this.mId])
  async[this.mId] = setTimeout(() =>
    this.exec && typeof this.exec === 'function' && this.exec.apply(null, args)
    , 0)
}

/**
 * The model constructor, use with template literal having
 * ```{{model:<myModel>}}<myModelTemplateString>{{/model:<myModel>}}```
 * @alias module:keet/createModel
 * @param {*} enableFiltering - any truthy value 
 *
 */
export default class createModel {
  constructor (enableFiltering) {
    this.mId = this.indentity

    async[this.mId] = null
    // if enableFiltering is assigned a value, model generation will
    // use `listFilter` instead of `list`
    this.enableFiltering = enableFiltering || null

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
        this.dirty = true
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
   * Subscribe to the model changes, the function callback first argument
   * is the ```model.list``` and the second argument is ```model.listFilter```
   * @param {Function} fn - the function callback for the subscribe
   */
  subscribe (fn) {
    this.exec = fn
  }

  /**
   * Add new object to the model list
   * @param {Object} obj - new object to add into the model list
   */
  add (obj) {
    this.list = this.list.concat({ ...obj, 'kdata-id': minId() })
  }

  /**
   * Update existing object in the model list
   * @param {Object} updateObj - the updated properties
   */
  update (updateObj) {
    this.list = this.list.map(obj =>
      notEqual(obj, updateObj) ? obj : updateObj
    )
  }

  /**
   * Filter the model data by selected properties, constructor
   * instantiation should be apply with boolean true as argument
   * to enable filtering
   * @param {standard} prop - property of the object
   * @param {standard} value - property value
   */
  filter (prop, value) {
    this.prop = prop
    this.value = value
    this.list = this.list
  }

  /**
 * Removed existing object in the model list
 * @param {Object} destroyObj - the object ref to remove from the model
 */
  destroy (destroyObj) {
    this.list = this.list.filter(obj => {
      return notEqual(obj, destroyObj)
    })
  }
}