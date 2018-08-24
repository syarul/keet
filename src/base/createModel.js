import { minId } from '../../utils'

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
  if (async[this.mId]) clearTimeout(async[this.mId])
  async[this.mId] = setTimeout(() =>
    this.exec && typeof this.exec === 'function' && this.exec.apply(null, args)
    , 0)
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
    this.list = this.list
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
    this.list = this.list.filter(obj => {
      return notEqual(obj, destroyObj)
    })
  }
}