'use strict'
/**
 * Keetjs v3.5.0 Alpha release: https://github.com/keetjs/keet.js
 * Minimalist view layer for the web
 *
 * <<<<<<<<<<<<<<<<<<<<<<<<<<<<<< Keetjs >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
 *
 * Copyright 2018, Shahrul Nizam Selamat
 * Released under the MIT License.
 */

var getId = require('./components/utils').getId
var genId = require('./components/utils').genId
var selector = require('./components/utils').selector
var parseStr = require('./components/parseStr')
var genTemplate = require('./components/genTemplate')
var setDOM = require('set-dom')

var next = function (i, ele, els) {
  var self = this
  if (i < els.length) {
    if (!ele.childNodes[i]) ele.appendChild(els[i])
    i++
    next.apply(this, [ i, ele, els ])
  } else {
    var watchObject = function (obj) {
      return new Proxy(obj, {
        set: function (target, key, value) {
          target[key] = value
          self.base[key] = target[key]
          return true
        },
        deleteProperty: function (target, key) {
          var id = target[key]['keet-id']
          var el = selector(id)
          el && el.remove()
          delete self.base[key]
          return true
        }
      })
    }
    if (typeof this.base === 'object') { this.baseProxy = watchObject(this.base) }

    // component lifeCycle after mounting
    if (this.componentDidMount && typeof this.componentDidMount === 'function') {
      this.componentDidMount()
    }
  }
}

function Keet () {
  this.base = {}
  Object.defineProperty(this, '__stateList__', {
    enumerable: false,
    writable: true
  })
}

Keet.prototype.mount = function (instance) {
  // Before we begin to parse an instance, do a rundown checks
  // to clean up backtick string which usually has line spacing
  if (typeof instance === 'object') {
    Object.keys(instance).map(function (key) {
      if (typeof instance[key] === 'string') {
        instance[key] = instance[key].trim().replace(/\s+/g, ' ')
      } else if (typeof instance[key] === 'object' && typeof instance[key]['template'] === 'string') {
        instance[key]['template'] = instance[key]['template'].trim().replace(/\s+/g, ' ')
      }
    })
  } else if (typeof instance === 'string') {
    instance = instance.trim().replace(/\s+/g, ' ')
  }
  this.base = instance
  return this
}

Keet.prototype.flush = function (instance) {
  // Custom method to clean up the component DOM tree
  // usefull if we need to do clean up rerender
  var ele = getId(this.el)
  if (ele) ele.innerHTML = ''
  return this
}

Keet.prototype.link = function (id) {
  // The target DOM where the rendering will took place.
  // We could also apply lifeCycle method before the
  // render happen
  this.el = id
  if (this.componentWillMount && typeof this.componentWillMount === 'function') {
    this.componentWillMount()
  }
  this.render()
  return this
}

Keet.prototype.render = function () {
  // Render this component to the target DOM
  var ele = getId(this.el)
  var els = parseStr.apply(this, this.args)
  if (ele) {
    next.apply(this, [ 0, ele, els ])
  }
  return this
}

Keet.prototype.cluster = function () {
  // Chain method to run external function(s), this basically serve
  // as initializer for all child components within the instance tree
  var args = [].slice.call(arguments)
  if (args.length > 0) {
    args.map(function (f) {
      if (typeof f === 'function') f()
    })
  }
}

Keet.prototype.add = function (obj) {
  // Method to add a new object to component model
  var ele = getId(this.el)
  obj['keet-id'] = genId()
  this.base.model = this.base.model.concat(obj)
  ele.appendChild(genTemplate.call(this, obj))
}

Keet.prototype.destroy = function (id, attr) {
  // Method to destroy a submodel of a component
  this.base.model = this.base.model.filter(function (obj, index) {
    if (id === obj[attr]) {
      var node = selector(obj['keet-id'])
      if (node) node.remove()
    } else { return obj }
  })
}

Keet.prototype.update = function (id, attr, newAttr) {
  // Method to update a submodel of a component
  var self = this
  this.base.model = this.base.model.map(function (obj, idx, model) {
    if (id === obj[attr]) {
      if (newAttr && typeof newAttr === 'object') {
        Object.assign(obj, newAttr)
      }
      var node = selector(obj['keet-id'])
      if (node) setDOM(node, genTemplate.call(self, obj))
    }
    return obj
  })
}

module.exports = Keet
