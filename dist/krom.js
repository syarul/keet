(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Krom = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

/** 
 * Krom.js v0.5.1 (Alpha) version: https://github.com/syarul/krom
 * A data-driven view, OO, pure js without new paradigm shift
 *
 * <<<<<<<<<<<<<<<<<<<<<<<<<<<<<< Krom.js >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
 *
 * Copyright 2017, Shahrul Nizam Selamat
 * Released under the MIT License.
 */

module.exports = Krom

/**
 * Krom constructor, each component is an instance of Krom
 * @param {string} - element tag name, set the default template for this Instance, i.e "div" 
 * @returns {constructor}
 */
function Krom(tagName) {
  var ctx = this, childs, child, childAttr, regc, injc, 
    kStr, kRegc, kInjc, kAttr

  this.obs = {}
  this.ctor = {}

  this.ctor.doc = (function() {
    return typeof document == 'object' ? true : false
  }())

  this.ctor.attr = {}
  this.ctor.tags = {}
  this.ctor.css = {}
  this.ctor.ops = {}

  var camelCase = function(s) {
    var rx = /\-([a-z])/g
    if (s === s.toUpperCase()) s = s.toLowerCase()
    return s.replace(rx, function(a, b) {
      return b.toUpperCase()
    })
  }

  this.ctor.uid = (function() { return (Math.random()*0x10000000000000).toString(32)}())

  if(typeof tagName === 'string') this.tmpl = '<'+tagName+' k-link="'+this.ctor.uid+'"'+'></'+tagName+'>'

  var getId = function(id, childUid) { 
    var ret = document.getElementById(id)
    if(!ret && childUid){
      ret = document.querySelector('[k-link="'+childUid+'"]')
    }
    return ret
  }

  var testEval = function(ev) {
    try { return eval(ev) } catch (e) { return false }
  }

  var _processTags = function(str, kData) {
    var childs = str.match(/{{([^{}]+)}}/g, '$1')
    if(childs){
      childs.forEach(function(c){
        regc = c.replace(/{{([^{}]+)}}/g, '$1')
        // skip tags which not being declared yet
        child = testEval(regc) ? eval(regc) : false
        if(child){
          // handle child tag
          childAttr = {
            el: child._linkElem,
            state: child.obs._state_,
            preserveAttr: child.ctor.preserveAttr,
            uid: child.ctor.uid
          }
          ctx.ctor.tags[regc] = childAttr
          // inject value into child template
          if(child.tmpl) injc = child.tmpl.replace(/></, '>'+child.obs._state_.value+'<')
          // if template does not exist return value as parameter
          else injc = child.obs._state_ ? child.obs._state_.value : ''
          str = str.replace('{{'+regc+'}}', injc)
          if(child.obs._state_ && child.obs._state_['k-data']){
            str = kDataProcesseor(str, child.obs._state_['k-data'])
          }
        }
      })
    }
    // process k-data
    if(kData) str = kDataProcesseor(str, kData)
    if (ctx.ctor.d !== str) {
      // store this string @id
      ctx.ctor.d = str
      return str
    } else {
      return false
    }
  }

  // process k-data
  var kDataProcesseor = function(str, kData) {
    kStr = str.match(/{{([^{}]+)}}/g, '$1')
    if(kStr){
      kStr.forEach(function(c){
        kRegc = c.replace(/{{([^{}]+)}}/g, '$1')
        for (kAttr in kData){
          if(kAttr === kRegc) str = str.replace('{{'+kRegc+'}}', kData[kRegc])
        }
      })
    }
    return str
  }

  var insertAfter = function(newNode, referenceNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
  }

  var clone = function(v) {
    var o = {}
    o.copy = v
    return o.copy
  }

  var applyAttrib = function(selector, state, preserveAttr, uid) {
    var cty, attr, ts, type, a, d
    for (attr in state) {
      ts = new RegExp('-')
      if (attr.match(ts)) {
        type = attr.split('-')
        if (type[0] === 'attr' && ctx.ctor.attr[type[1]] !== state[attr]) {
          // store attr
          ctx.ctor.attr[type[1]] = {
            selector: selector,
            attr: state[attr]
          }
          getId(selector, uid).setAttribute(type[1], state[attr])
        } else if (type[0] === 'css') {
          cty = camelCase(attr.substring(4))
          if (ctx.ctor.css[cty] !== state[attr]) {
            // store css
            ctx.ctor.css[cty] = {
              selector: selector,
              css: state[attr]
            }
            getId(selector, uid).style[cty] = state[attr]
          }
        } else if (type[0] === 'attr' && preserveAttr) {
          getId(selector, uid).setAttribute(type[1], state[attr])
        }
      }
    }
    // preserve attributes from store if parent mutated
    if (preserveAttr) {
      a = ctx.ctor.attr
      for (attr in a) {
        if (typeof a[attr] !== 'function') {
          getId(a[attr].selector, uid).setAttribute(attr, a[attr].attr)
        }
      }
      d = ctx.ctor.css
      for (attr in d) {
        if (typeof d[attr] !== 'function') {
          getId(d[attr].selector, uid).style[attr] = d[attr].css
        }
      }
    }
  }

  var _triggerElem = function() {
    var state = ctx.obs._state_, el = ctx._linkElem, processStr,
      ele = getId(el), childTags = ctx.ctor.tags, attr, tempDiv, 
      childLen, tempDivChildLen, i, j, len, c
    if (ele) {
      // process each {{instance}} before parsing to html
      processStr = _processTags(state.value, state['k-data'])
      // parsing string to DOM only when necessary
      if(ctx.ctor.ops.preserve === true && ele.hasChildNodes()) {
        if(ctx.ctor.ops.type === 'remove'){
          ele.removeChild(ele.childNodes[ctx.ctor.ops.index])
        }else if(ctx.ctor.ops.type === 'update'){
          tempDiv = document.createElement('div')
          tempDiv.innerHTML = ctx.ctor.ops.node
          ele.replaceChild(tempDiv.childNodes[0], ele.childNodes[ctx.ctor.ops.index])
        }else if(ctx.ctor.ops.type === 'unshift'){
          tempDiv = document.createElement('div')
          tempDiv.innerHTML = ctx.ctor.ops.node
          for(i=tempDiv.childNodes.length-1;i>-1;i--){
            ele.insertBefore(tempDiv.childNodes[i], ele.firstChild)
          }
        }else if(ctx.ctor.ops.type === 'slice'){
          tempDiv = document.createElement('div')
          tempDiv.innerHTML = ctx.ctor.ops.node
          ele.innerHTML = ''
          tempDivChildLen = clone(tempDiv.childNodes.length)
          for(i=0;i<tempDivChildLen;i++){
            ele.appendChild(tempDiv.childNodes[0])
          }
        }else if(ctx.ctor.ops.type === 'splice'){
          tempDiv = document.createElement('div')
          tempDiv.innerHTML = ctx.ctor.ops.node
          childLen = clone(ele.childNodes.length)
          tempDivChildLen = clone(tempDiv.childNodes.length)
          if(ctx.ctor.ops.count && ctx.ctor.ops.count > 0){
            for(i=ctx.ctor.ops.index;i<childLen+1;i++){
              len = ctx.ctor.ops.index+ctx.ctor.ops.count
              if(i < len){
                ele.removeChild(ele.childNodes[ctx.ctor.ops.index])
                if(i === len-1 && tempDivChildLen > 0){
                  c = ctx.ctor.ops.index - 1
                  for(j=ctx.ctor.ops.index;j<tempDivChildLen+ctx.ctor.ops.index;j++){
                    insertAfter(tempDiv.childNodes[0], ele.childNodes[c])
                    c++
                  }
                }
              }
            }
          }
        } else {
          tempDiv = document.createElement('div')
          tempDiv.innerHTML = ctx.ctor.ops.node
          ele.appendChild(tempDiv.childNodes[0])
        }
        tempDiv = null
      }
      else if (processStr && state.value.length) ele.innerHTML = processStr
      else if (!processStr && state.value.length < 1) ele.innerHTML = ''
      // attributes class and style
      applyAttrib(el, state)
      // if child ctor exist apply the attributes to child tags
      for (attr in childTags) applyAttrib(childTags[attr].el, childTags[attr].state, childTags[attr].preserveAttr, childTags[attr].uid)
    }
  }

  var _registerElem = function() {
    var reg = ctx.ctor.register, evReg
    // if this is registered, called this Instance.prototype.compose
    evReg = testEval(reg) ? eval(reg) : false
    if(evReg && typeof evReg.__proto__.compose === 'function') {
      evReg.compose()
    }
  }

  Object.defineProperty(this.obs, '_state_', {
    __proto__: null,
    writeable: true,
    get: function() {
      return this._
    },
    set: function(value) {
      this._ = value
      if (ctx._linkElem) _triggerElem()
      if (ctx.ctor.register) _registerElem()
    }
  })

  if (!Object.prototype.watch) {
    Object.defineProperty(Object.prototype, 'watch', {
      enumerable: false,
      configurable: true,
      writable: false,
      value: function(prop, handler) {
        var oldval = this[prop],
          newval = oldval,
          getter = function() {
            return newval
          },
          setter = function(val) {
            oldval = newval
            return newval = handler.call(this, prop, oldval, val)
          }
        if (delete this[prop]) {
          Object.defineProperty(this, prop, {
            get: getter,
            set: setter,
            enumerable: true,
            configurable: true
          })
        }
      }
    })
  }
  // object.unwatch
  if (!Object.prototype.unwatch) {
    Object.defineProperty(Object.prototype, "unwatch", {
      enumerable: false,
      configurable: true,
      writable: false,
      value: function(prop) {
        var val = this[prop] 
        delete this[prop] 
        this[prop] = val
      }
    })
  }
}
/**
 * Register this component instance as a child of a parent component i.e.
 * Updates on child are automatically updated to parent whenever the child called ```set/compose/link```.
 * **Be carefull using this**, since mutation is not control anymore. If you want to have control over 
 * DOM mutation use ```Krom.prototype.compose``` instead. 
 * @param {string} - the parent component instance declared variable name. 
 * @returns {context}
 */
Krom.prototype.register = function(instance) {
  if (typeof instance === 'string') this.ctor.register = instance
  else throw ('supply argument is not a string.')
  return this
}
/**
 * Unregister this component instance from a parent component. Update on child component will not notify the parent automatically until parent 
 * called ```set/compose/link```
 * @returns {context}
 */
Krom.prototype.unreg = function() {
  this.ctor.register = null
  return this
}
/**
 * Wrap this component instance in a template i.e ```<div id="wrapper"></div>```. If the template has an id, it'll register that as well.
 * @param {string} - the template string. 
 * @returns {context}
 */
Krom.prototype.template = function(str) {
  // virtual templating wrapper
  var r = str.match(/id="([^"]+)/)
  this.tmpl = str
    // apply id from string if it has one
  if (r) this.link(r[1])
  return this
}
/**
 * Reevaluate the state of this component instance, if value changed from last update to DOM, update it again. If a **function** is supplied,
 * return the result from it instead.
 * @param {function} - ***optional*** function with ```this``` context as argument
 * @returns {context}
 */
Krom.prototype.compose = function(fn) {
  // compose with a function
  // also as callee for setter
  var c = this.obs._state_, res
  if (typeof fn === 'function') {
    res = fn(this)
    this.obs._state_ = res.obs._state_
  } else {
    this.obs._state_ = c
  }
  return this
}
/**
 * Persist this instance state attributes and style regardless parent instance mutation
 * @param {boolean} - ***optional*** undo the persistance changes
 * @returns {context}
 */
Krom.prototype.preserveAttributes = function(argv) {
  this.ctor.preserveAttr = argv ? false : true
  return this
}
/**
 * Link this component instance to an attribute ```id```. If value is supplied, notify update to DOM.
 * @param {string} - the id string
 * @param {object|string} - ***optional*** value to parse into DOM
 * @param {string} - ***optional*** if specified this is the value instead, while previous argument is the attribute
 * @returns {context}
 */
Krom.prototype.link = function(id, value, vProp) {
  if (this.ctor.doc) {
    this._linkElem = id
    if (this.tmpl) {
      var r = this.tmpl.match(/id="([^"]+)/)
      this.tmpl = !r ? this.tmpl.replace(/></, ' id="'+id+'"><') : this.tmpl
    }
  } else {
    throw ('linking failed, not a document object model.')
  }

  if (value) this.set(value)
  else if (vProp) this.set(value, vProp)
  return this
}
/**
 * Observe this array for changes, once recieved make update to component. Operation supported are
 * assignment, push, pop, shift, unshift, slice, splice.
 * @param {object} - ***optional*** watch a different array instead
 * @returns {context}
 */
Krom.prototype.watch = function(instance) {
  var ctx = this
  instance = instance || this.ctor.arrayProto
  if(!Array.isArray(instance)) {
    this.watchObj(instance)
    return this
  }
  var opsList = function() { return ['push', 'pop', 'shift', 'unshift', 'slice', 'splice'] }
  var op = opsList(), 
    ev = {}
    ev._ = 'noArrayProto'
    ev.change = function(cb) {
      if(cb) cb(this)
    }
  Object.defineProperty(ev, 'state', {
    __proto__: null,
    writeable: true,
    get: function() {
      return this._
    },
    set: function(value) {
      this._ = value
      this.change()
    }
  })
  var query = function(ops, argvs) {
    op = []
    if(ops === 'push') {
      ctx.insert(argvs[0])
      op = opsList()
      ev.state = 'push'
    } else if(ops === 'pop') {
      var i = instance.length
      ctx.remove(i)
      op = opsList()
      ev.state = 'pop'
    } else if(ops === 'shift') {
      ctx.remove(0)
      op = opsList()
      ev.state = 'shift'
    } else if(ops === 'unshift') {
      ctx.unshift.apply(ctx, argvs)
      op = opsList()
      ev.state = 'unshift'
    } else if(ops === 'slice') {
      ctx.slice.apply(ctx, argvs)
      op = opsList()
      ev.state = 'slice'
    } else if(ops === 'splice') {
      ctx.splice.apply(ctx, argvs)
      op = opsList()
      ev.state = 'splice'
    } 
  }
  op.forEach(function(f){
    instance[f] = function() {
      if(op.length > 0) {
        Array.prototype[f].apply(this, arguments);
        query(f, arguments)
      }
    }
  })
  // watch array.prototype operation first before dealing with update event
  var event = new Promise(function(resolve, reject){
      this.change(function(res){
        resolve(res)
      })
  }.bind(ev))
  // watch for changes in the array, if event is not assignment, do unwatch on the array
  instance.forEach(function(r, i) {
    instance.watch(i, function(idx, o, n) {
      instance.unwatch(i)
      event.then(function(ev) {
        if (ev._ === 'noArrayProto') {
          ctx.update(idx, n)
        }
        ctx.watch(instance)
      })
    })
  })
  return this
}
/**
 * Observe an object for changes in properties, once recieved delegate to a function callback
 * @param {object} - obj to watch
 * @param {function} - the function call once observe property changed
 * @returns {context}
 */
Krom.prototype.watchObj = function(instance, fn) {
  var attr
  if(Array.isArray(instance)) {
    throw('Wrong type of operation, use Krom.prototype.watch instead.')
    return this
  }
  // watch for changes in the obj
  for (attr in instance){
    instance.watch(attr, function(idx, o, n) {
      if(typeof fn === 'function') {
        fn(idx, o, n)
      } else {
        throw('Not a function.')
      }
    })
  }
  return this
}
/**
 * Unwatch an object or array
 * @param {object} - obj/array to unwatch
 * @returns {context}
 */
Krom.prototype.unWatch = function(instance) {
  var attr
  if(Array.isArray(instance)) {
    instance.forEach(function(r, i) {
      instance.unwatch(i)
    })
  } else {
    for (attr in instance){
        instance.unwatch(attr)
    }
  }
  return this
}
/**
 * Set value for this component instance from an array of objects
 * @param {object} - instance of the array
 * @param {string} - the template string i.e ```<li>{{index}} name:{{name}} age:{{age}}</li>```. Each handlebar is the reference to attribute in the ***array*** objects
 * @param {boolean} - this value assign programmatically by this other prototypes, avoid declaring this parameter
 * @returns {context}
 */
Krom.prototype.array = function(array, templateString, isAppend) {
  var ctx = this, tmplStr = '', arrProps, tmpl, rep
  this.ctor.arrayProto = array
  this.ctor.arrayPristine = array.map(function(a) { return a })
  this.ctor.tmplString = templateString
  arrProps = templateString.match(/{{([^{}]+)}}/g, '$1')
  array.forEach(function(r, i) {
    tmpl = templateString
    arrProps.forEach(function(s) {
      rep = s.replace(/{{([^{}]+)}}/g, '$1')
      tmpl = tmpl.replace(/{{([^{}]+)}}/, r[rep])
    })
    tmplStr += tmpl
  })
  if(isAppend){
    this.ctor.ops.node = tmplStr
  } else {
    this.set(tmplStr)
  }
  return this
}
/**
 * Update a particular index of the array.
 * @param {number} - the index target for replacement
 * @param {object} - the new replacement object
 * @param {function} - ***optional*** delegate the result array to a **function**, the return result is used instead
 * @returns {context}
 */
Krom.prototype.update = function(index, obj, fn) {
  var arr = this.ctor.arrayProto, 
    str = this.ctor.tmplString, i, attr, value, idx
  if(Array.isArray(arr)){
    if(typeof index === 'number')
      arr[index] = obj
    this.ctor.ops = {
      preserve: true,
      type: 'update',
      index: index,
      node: ''
    }
    if(typeof fn === 'function') {
      arr = fn(arr)
      this.ctor.ops.preserve = false
    } else {
      this.array([obj], str, true)
    }
    this.array(arr, str)
  } else {
    throw('object reference not created from array.')
  }
  return this
}
/**
 * Remove a particular index from the array. Behavior is like ```Array.prototype.slice```
 * @param {number | obj} - the index for removal, if object is used like {index: someNumber},
 * Krom will map to look for the valid index
 * @param {function} - ***optional*** delegate the result array to a **function**, the return result is used instead
 * @returns {context}
 */
Krom.prototype.remove = function(idx, fn) {
  var arr = this.ctor.arrayProto, 
  arrPris = this.ctor.arrayPristine.map(function(f) { return f }),
    str = this.ctor.tmplString, index, key
  if(Array.isArray(arr)){
    if (typeof idx === 'object') {
      key = Object.keys(idx)[0]
      index = arrPris.map(function(f) {
        return f[key]
      }).indexOf(idx[key])
      if(~index){ arrPris.splice(index, 1) }
    } else {
      index = arrPris[idx]
      if(index) arrPris.splice(idx, 1)
    }
    this.ctor.ops = {
      preserve: true,
      type: 'remove',
      index: index
    }
    if(typeof fn === 'function') {
      arr = fn(arr)
      this.ctor.ops.preserve = false
    } 
    this.array(arrPris, str)
  } else {
    throw('object reference not created from array.')
  }
  return this
}
/**
 * Add a new object into the array. Behavior is like ```Array.prototype.push```
 * @param {object} - the object reference
 * @param {function} - ***optional*** delegate the result array to a **function**, the return result is used instead
 * @returns {context}
 */
Krom.prototype.insert = function(obj, fn) {
  var arr = this.ctor.arrayProto, str = this.ctor.tmplString
  if(Array.isArray(arr)){
    arr.push(obj)
    this.ctor.ops = {
      preserve: true,
      type: 'append',
      index: null,
      node: ''
    }
    if(typeof fn === 'function') {
      arr = fn(arr)
      this.ctor.ops.preserve = false
    } else {
      this.array([obj], str, true)
    }
    this.array(arr, str)
  } else {
    throw('object reference not created from array.')
  }
  return this
}
/**
 * Add one ore more objects at the begining of the array. Behavior is like ```Array.prototype.unshift```
 * @param {function} - ***optional*** delegate the result array to a **function**, the return result is used instead
 * @param {...object} - [obj1[, ...[, objN]]], one or more of the objects
 * @returns {context}
 */
Krom.prototype.unshift = function(fn, obj) {
  var arr = this.ctor.arrayPristine.map(function(f) { return f }),
    str = this.ctor.tmplString, ctxFn, argv
  if(typeof arguments[0] === 'function'){
    ctxFn = [].shift.call(arguments)
  }
  if(Array.isArray(arr)){
    argv = Array.prototype.slice.call(arguments)
    arr.unshift(argv)
    arr = [].concat.apply([], arr)
    this.ctor.ops = {
      preserve: true,
      type: 'unshift',
      index: null,
      node: ''
    }
    if(ctxFn) {
      arr = ctxFn(arr)
      this.ctor.ops.preserve = false
    } else {
      this.array(argv, str, true)
    }
    this.array(arr, str)
  } else {
    throw('object reference not created from array.')
  }
  return this
}
/**
 * Make shallow copy of current array, update DOM with the sliced. Behavior is like ```Array.prototype.slice```
 * @param {function} - ***optional*** delegate the result array to a **function**, the return result is used instead
 * @param {number} - zero-based index at which to begin extraction
 * @param {number} - ***optional*** zero-based index at which to end extraction
 * @returns {context}
 */
Krom.prototype.slice = function(fn, start, end) {
  var arr = this.ctor.arrayPristine.map(function(f) { return f }),
    str = this.ctor.tmplString, ctxFn, argv
  if(typeof arguments[0] === 'function'){
    ctxFn = [].shift.call(arguments)
  }
  if(Array.isArray(arr)){
    argv = Array.prototype.slice.call(arguments)
    if(argv.length == 2)
      arr = arr.slice(argv[0], argv[1])
    else
      arr = arr.slice(argv[0])
    this.ctor.ops = {
      preserve: true,
      type: 'slice',
      index: null,
      node: ''
    }
    if(ctxFn) {
      arr = ctxFn(arr)
      this.ctor.ops.preserve = false
    } else {
      this.array(arr, str, true)
    }
    this.array(arr, str)
  } else {
    throw('object reference not created from array.')
  }
  return this
}
/**
 * Removing existing elements and/or adding new elements. Behavior is like ```Array.prototype.splice```
 * @param {function} - ***optional*** delegate the result array to a **function**, the return result is used instead
 * @param {number} - index at which to start changing the array
 * @param {number} - ***optional*** integer indicating the number of old array elements to remove
 * @param {...object} - one or more objects to insert into the array
 * @returns {context}
 */
Krom.prototype.splice = function(fn, start, count, obj) {
  var arr = this.ctor.arrayPristine.map(function(f) { return f }),
    str = this.ctor.tmplString, ctxFn, objs, argv
  argv = Array.prototype.slice.call(arguments)
  if(typeof arguments[0] === 'function'){
    ctxFn = [].shift.call(argv)
  }
  start = [].shift.call(argv)
  if(typeof argv[0] === 'number'){
    count = [].shift.call(argv)
  }
  if(Array.isArray(arr)){
    if(argv.length > 0 && count) {
      arr.splice(start, count, argv)
      arr = [].concat.apply(  [], arr)
    } else if(!count){
      arr.splice(start)
    }
    this.ctor.ops = {
      preserve: true,
      type: 'splice',
      index: start,
      count: count,
      node: argv
    }
    if(ctxFn) {
      arr = ctxFn(arr)
      this.ctor.ops.preserve = false
    } else {
      if(argv.length > 0) this.array(argv, str, true)
    }
    this.array(arr, str)
  } else {
    throw('object reference not created from array.')
  }
  return this
}
/**
 * Input bindings, add an event listener to an input with a lookup to an id, subsequently notify the listener of the changes
 * @param {string} - the id of the input
 * @param {object} - the listener, a component instance
 * @param {string} - the type of this bind event listener
 * @returns {context}
 */
Krom.prototype.bindListener = function(inputId, listener, type) {
  var e = document.getElementById(inputId)
  type = type || 'input'
  e.addEventListener(type, function() {
    listener.set(e.value)
  })
  return this
}
/**
 * Setter for component instance, takes value as ```string```, ```object``` or ```number```. If supplied with a secondary argument the first argument is the 
 * attributes reference in type of either ```value/attributes/css```, to apply as DOM attributes use ```attr-[attributesName]``` i.e 
 * ```{attr-href: 'http://somelink.com'}```, to apply as style use ```css-[cssStyleProperty]``` i.e ```{css-background-color: 'grey'}```
 * @param {object|string} - a value can be an object, string or number
 * @param {string} - ***optional*** if specified, this is the property instead, while previous argument is the attribute
 * @returns {context}
 */
Krom.prototype.set = function(value, vProp) {
  var obj, assign
  if (vProp) {
    obj = {}
    obj[value] = vProp
    if (!this.obs._state_) {
      this.obs._state_ = obj
    } else {
      assign = Object.assign(this.obs._state_, obj)
      this.obs._state_ = assign
    }
  } else {
    if (!this.obs._state_ && typeof value !== 'object') {
      obj = {}
      obj.value = value
      this.obs._state_ = obj
    } else if (!this.obs._state_ && typeof value === 'object') {
      this.obs._state_ = value
    } else if (typeof value === 'object') {
      assign = Object.assign(this.obs._state_, value)
      this.obs._state_ = assign
    } else {
      this.obs._state_ = { value: value }
    }
  }
  return this
}
},{}]},{},[1])(1)
});