(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Keet = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/** 
 * Keet.js v0.5.7 (Alpha) version: https://github.com/syarul/keet
 * A data-driven view, OO, pure js without new paradigm shift
 *
 * <<<<<<<<<<<<<<<<<<<<<<<<<<<<<< Keet.js >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
 *
 * Copyright 2017, Shahrul Nizam Selamat
 * Released under the MIT License.
 */
'use strict'
module.exports = Keet
/**
 * Keet constructor, each component is an instance of Keet
 * @param {string} - ***optional*** element tag name, set the default template for this Instance, i.e 'div'
 * @param {boolean | string} - ***optional*** set to run in debug mode, boolean true or string 'debug'
 * @param {object} - ***optional*** if using Keet inside a closure declare the context of said closure
 * @returns {constructor}
 */
function Keet(tagName, debug, context) {
  var cargv = [].slice.call(arguments), ctx = this, child, childAttr, 
    regc, injc, kStr, kRegc, kAttr, ret, l, tg,
    log = cargv.filter(function(c) {
      if(typeof c === 'boolean' && c) return c
      else if(typeof c === 'string' && c === 'debug') return c
    })[0],
    context = cargv.filter(function(c) { return typeof c === 'object'})[0],
    getId = function(id, uid) {
      if(ctx.ctor.doc) {
        ret = document.getElementById(id)
        if (!ret && uid) ret = document.querySelector(ctx.cat('[k-link="', uid, '"]'))
      } else {
        throw('Not a document object model.')
      }
      return ret
    },
    testEval = function(ev) {
      try { return eval(ev) } 
      catch (e) { return false }
    },
    camelCase = function(s) {
      var rx = /\-([a-z])/g
      if (s === s.toUpperCase()) s = s.toLowerCase()
      return s.replace(rx, function(a, b) {
        return b.toUpperCase()
      })
    },
    eleConstruct = function() {
      var args = [].slice.call(arguments), arr = ctx.tag.apply(null, args)
      log('tag result => \n'+JSON.stringify(arr, null, 2))
      return arr.join('')
    }
  if(log && typeof window === 'object' && !window.log){
    window.log = console.log.bind(console)
    log = console.log.bind(console)
  } else if (log && typeof window === 'object' && window.log){
    log = console.log.bind(console)
  } else {
    log = function(){}
  }
  this.obs = {}
  this.ctor = {}
  Object.defineProperty(this, 'obs', {
    enumerable: false,
    configurable: false,
    writable: false
  })
  Object.defineProperty(this, 'ctor', {
    enumerable: false,
    configurable: false,
    writable: false
  })
  this.ctor.doc = (function() {
    return typeof document == 'object' ? true : false
  }())
  // helpers functions
  this.cat = function() { return [].slice.call(arguments).join('') }
  this.copy = function(argv) {
    return Array.isArray(argv) ? argv.map( function(v) { return v }) : argv
  }
  this.tag = function() {
    var args = [].slice.call(arguments), arr = ctx.ktag.apply(null, args)
    return arr.join('')
  }
  this.loaded = function(cb) {
    if(ctx.ctor.doc && !ctx.ctor.loaded) {
      document.addEventListener('DOMContentLoaded', function(ev) {
        l = ['content loaded ->', 'el:', ctx.el]
        if(!ctx.el) l.splice(1, 2, 'k-link:', ctx.ctor.uid)
        log.apply(null, l)
        ctx.ctor.loaded = true
        if(typeof cb === 'function') cb()
        else throw('Not a function.')
      })
    } else {
      cb()
    }
  }
  this.isNode = function() {
    var node = getId(ctx.el, ctx.ctor.uid)
    if (node && typeof node == 'object' && node.nodeType === 1) {
      node = null
      return true
    } else {
      return false
    }
  }
  this.ctor.attr = {}
  this.ctor.tags = {}
  this.ctor.css = {}
  this.ctor.ops = {}

  this.ctor.uid = (function() { return (Math.round(Math.random()*0x1000000)).toString(32) }())

  tg = cargv.filter(function(c) { return typeof c === 'string' && c !== 'debug' })[0]
  if (tg) this.ctor.tmpl = ['<', tg, ' k-link="', this.ctor.uid, '"', '>', '</', tg, '>']

  var insOf = function(i) {
    return i instanceof Object ? true : false
  }

  var _processTags = function(str, kData) {
    var childs = str.match(/{{([^{}]+)}}/g, '$1'), idx, ctmpl
    if(childs){
      childs.forEach(function(c){
        regc = c.replace(/{{([^{}]+)}}/g, '$1')
        // skip tags which not being declared yet
        if(context){
          child = context[regc] ? context[regc] : false
          log('evaluating context child:', context, '->', insOf(child))
        } else {
          child = testEval(regc) ? eval(regc) : false
          log('evaluating child:', regc, '->', insOf(child))
        }
        if(child){
          // handle child tag
          childAttr = {
            el: child.el,
            state: child.obs._state_,
            preserveAttr: child.ctor.preserveAttr,
            uid: child.ctor.uid
          }
          ctx.ctor.tags[regc] = childAttr
          // inject value into child template
          if(child.ctor.tmpl) {
            ctmpl = ctx.copy(child.ctor.tmpl)
            idx =  ctmpl.indexOf('>')
            if(~idx) {
              ctmpl.splice(idx+1, 0, child.obs._state_.value)
              injc = ctx.cat.apply(null, ctmpl)
            }
          }
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
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling)
  }

  var clone = function(v) {
    var o = {}
    o.copy = v
    return o.copy
  }

  var applyAttrib = function(selector, state, preserveAttr, uid) {
    var cty, attr, ts, type, a, d, gid, prev
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
          gid = getId(selector, uid)
          if(gid) gid.setAttribute(type[1], state[attr])
        } else if (type[0] === 'css') {
          cty = camelCase(attr.substring(4))
          if (ctx.ctor.css[cty] !== state[attr]) {
            // store css
            ctx.ctor.css[cty] = {
              selector: selector,
              css: state[attr]
            }
            gid = getId(selector, uid)
            if(gid) gid.style[cty] = state[attr]
          }
        } else if (type[0] === 'attr' && preserveAttr) {
          gid = getId(selector, uid)
          if(gid) gid.setAttribute(type[1], state[attr])
        }
      }
    }
    // preserve attributes from store if parent mutated
    if (preserveAttr) {
      a = ctx.ctor.attr
      for (attr in a) {
        if (typeof a[attr] !== 'function') {
          prev = getId(a[attr].selector, uid)
          if(prev) {
            prev.setAttribute(attr, a[attr].attr)
          }
        }
      }
      d = ctx.ctor.css
      for (attr in d) {
        if (typeof d[attr] !== 'function') {
          prev = getId(d[attr].selector, uid)
          if(prev) prev.style[attr] = d[attr].css
        }
      }
    }
  }

  var _triggerElem = function() {
    var state = ctx.obs._state_, el = ctx.el, uid = ctx.ctor.uid, 
      processStr, ele = getId(el, uid), childTags = ctx.ctor.tags, attr, tempDiv, 
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
      applyAttrib(el, state, uid)
      // if child ctor exist apply the attributes to child tags
      for (attr in childTags) applyAttrib(childTags[attr].el, childTags[attr].state, childTags[attr].preserveAttr, childTags[attr].uid)
      ele = null
    }
  }

  var _registerElem = function() {
    var reg = ctx.ctor.register, evReg
    // if this is registered, called this Instance.prototype.compose
    if(context){
      evReg = context[reg] ? context[reg] : false
      log('evaluating context register:', reg, '->', insOf(evReg))
    } else {
      evReg = testEval(reg) ? eval(reg) : false
      log('evaluating register:', reg, '->', insOf(evReg))
    }
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
      if (ctx.el || ctx.ctor.uid) _triggerElem()
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
    Object.defineProperty(Object.prototype, 'unwatch', {
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
 * DOM mutation use ```Keet.prototype.compose``` instead. 
 * @param {string} - the parent component instance declared variable name. 
 * @returns {context}
 */
Keet.prototype.register = function(instance) {
  if (typeof instance === 'string') this.ctor.register = instance
  else throw ('Argument is not a string.')
  return this
}
/**
 * Unregister this component instance from a parent component. Update on child component will not notify the parent automatically until parent 
 * called ```set/compose/link```
 * @returns {context}
 */
Keet.prototype.unreg = function() {
  this.ctor.register = null
  return this
}
/**
 * Wrap this component instance in a template i.e ```<div id="wrapper"></div>```. If the template has an id, it'll register that as well.
 * @param {string} - the template tagName
 * @param {string} - ***optional*** the template id
 * @returns {context}
 */
Keet.prototype.template = function(tag, id) {
  var vtag = ['<', tag, '>', '</', tag, '>']
  if(id) {
    vtag.splice(2, 0, ' id="', id, '"')
    this.link(id) // apply id from string if it has one
  }
  this.ctor.tmpl = vtag
  return this
}
/**
 * Reevaluate the state of this component instance, if value changed from last update to DOM, update it again.
 * @param {boolean} - ***optional*** force node render, if the node non-existent, apply false to the callback function
 * @param {function} - ***optional*** run a callback function after this component loaded
 * @returns {context}
 */
Keet.prototype.compose = function(force, fn) {
  // compose with a function
  // also as callee for setter
  var argv = [].slice.call(arguments),
    c = this.obs._state_, ctx = this, elem
  force = argv.filter(function(f) { return typeof f === 'boolean'})[0]
  fn = argv.filter(function(f) { return typeof f === 'function'})[0]
  if(force) {
    elem = this.isNode()
    if(elem){
      this.obs._state_ = c
      if(fn) fn(true)
    } else {
      if(fn) fn(false)
    }
  } else {
    this.loaded(function(){
      ctx.obs._state_ = c
      if(fn) fn()
    }) 
  }
  return this
}
/**
 * Persist this instance state attributes and style regardless parent instance mutation
 * @param {boolean} - ***optional*** undo the persistance changes
 * @returns {context}
 */
Keet.prototype.preserveAttributes = function(argv) {
  this.ctor.preserveAttr = argv ? false : true
  return this
}
/**
 * Link this component instance to an attribute ```id```. If value is supplied, notify update to DOM.
 * @param {string} - ***optional*** element tagName, if declared wrap this value inside this tag, 
 * 1st dropped if arguments length is less than 3
 * @param {string} - the id string
 * @param {object|string} - ***optional*** value to parse into DOM
 * @returns {context}
 */
Keet.prototype.link = function(tag, id, value) {
  var argv = [].slice.call(arguments), kLink, vtag
  if (argv.length === 1) this.el = argv[0]
  else if (argv.length === 2 && !this.ctor.tmpl) {
    this.el = argv[0]
    this.set(argv[1])
  } else if (argv.length === 2 && this.ctor.tmpl) {
    kLink = this.ctor.tmpl.indexOf(' k-link="')
    if(~kLink) {
      this.ctor.tmpl.splice(kLink, 2, ' id="', argv[0])
    }
    this.el = argv[0]
    this.set(argv[1])
  } else if (argv.length > 2 && typeof tag === 'string' && (typeof value === 'string' || typeof value === 'number')) {
    this.el = id
    vtag = this.cat('<', tag, '>', value, '</', tag, '>')
    this.set(vtag)
  }
  return this
}
/**
 * Observe this array for changes, once recieved make update to component. Operation supported are
 * assignment, push, pop, shift, unshift, slice, splice.
 * @param {object} - ***optional*** watch a different array instead
 * @returns {context}
 */
Keet.prototype.watch = function(instance) {
  var ctx = this, argv, event
  instance = instance || this.ctor.arrayProto
  if(!Array.isArray(instance)) {
    argv = [].slice.call(arguments)
    this.watchObj.apply(this, argv)
    return this
  }
  var opsList = function() { return ['push', 'pop', 'shift', 'unshift', 'slice', 'splice'] }
  var op = opsList(), ev = {}
  ev._ = 'noArrayProto'
  ev.change = function(cb) {
    if (cb) cb(this)
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
        Array.prototype[f].apply(this, arguments)
        query(f, arguments)
      }
    }
  })
  // watch array.prototype operation first before dealing with update event
  event = new Promise(function(resolve){
    this.change(function(res) {
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
 * @param {function} - the function call once observe property changed, arguments pass to the 
 * function; (1st) the property attribute, (2nd) old value, (3rd) new value 
 * @returns {context}
 */
Keet.prototype.watchObj = function(instance, fn) {
  var attr
  if(Array.isArray(instance)) {
    throw('Wrong type of operation, use Keet.prototype.watch instead.')
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
Keet.prototype.unWatch = function(instance) {
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
 * @param {boolean} - this value assign programmatically by other prototypes, avoid declaring this parameter
 * @returns {context}
 */
Keet.prototype.array = function(array, templateString, isAppend) {
  var tmplStr = '', arrProps, tmpl, rep
  this.ctor.arrayProto = array
  this.ctor.arrayPristine = this.copy(array)
  this.ctor.tmplString = templateString
  arrProps = templateString.match(/{{([^{}]+)}}/g, '$1')
  array.forEach(function(r) {
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
 * @param {function} - ***optional*** delegate the result array to a **function**, if returned, the return result is used instead
 * @returns {context}
 */
Keet.prototype.update = function(index, obj, fn) {
  var arr = this.ctor.arrayProto, str = this.ctor.tmplString, fnArr
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
      fnArr = fn(arr)
      if(fnArr && Array.isArray(fnArr)) { 
        this.ctor.ops.preserve = false
        arr = fnArr
      }
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
 * Keet will map to look for the valid index
 * @param {function} - ***optional*** delegate the result array to a **function**, if returned, the return result is used instead
 * @returns {context}
 */
Keet.prototype.remove = function(idx, fn) {
  var arr = this.ctor.arrayProto, 
    arrPris = this.copy(this.ctor.arrayPristine),
    str = this.ctor.tmplString, index, key, fnArr
  if(Array.isArray(arr)){
    this.ctor.ops = {
      preserve: true,
      type: 'remove'
    }
    if (typeof idx === 'object') {
      key = Object.keys(idx)[0]
      index = arrPris.map(function(f) {
        return f[key]
      }).indexOf(idx[key])
      if(~index){ 
        arrPris.splice(index, 1)
        this.ctor.ops.index = index
      }
    } else {
      index = arrPris[idx]
      if(index){ 
        arrPris.splice(idx, 1)
        this.ctor.ops.index = idx
      }
    }
    arr = this.copy(arrPris)
    if(typeof fn === 'function') {
      fnArr = fn(arr)
      if(fnArr && Array.isArray(fnArr)) { 
        this.ctor.ops.preserve = false
        arr = fnArr
      }
    }
    this.array(arr, str)
  } else {
    throw('object reference not created from array.')
  }
  return this
}
/**
 * Add a new object into the array. Behavior is like ```Array.prototype.push```
 * @param {object} - the object reference
 * @param {function} - ***optional*** delegate the result array to a **function**, if returned, the return result is used instead
 * @returns {context}
 */
Keet.prototype.insert = function(obj, fn) {
  var arr = this.ctor.arrayProto, str = this.ctor.tmplString, fnArr
  if(Array.isArray(arr)){
    arr.push(obj)
    this.ctor.ops = {
      preserve: true,
      type: 'append',
      index: null,
      node: ''
    }
    if(typeof fn === 'function') {
      fnArr = fn(arr)
      if(fnArr && Array.isArray(fnArr)) { 
        this.ctor.ops.preserve = false
        arr = fnArr
      }
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
 * @param {function} - ***optional*** delegate the result array to a **function**, if returned, the return result is used instead
 * @param {...object} - [obj1[, ...[, objN]]], one or more of the objects
 * @returns {context}
 */
Keet.prototype.unshift = function(fn, obj) {
  var arr = this.copy(this.ctor.arrayPristine),
    str = this.ctor.tmplString, ctxFn, argv, fnArr
  if(typeof arguments[0] === 'function'){
    ctxFn = [].shift.call(arguments)
  }
  if(Array.isArray(arr)){
    argv = [].slice.call(arguments)
    arr.unshift(argv)
    arr = [].concat.apply([], arr)
    this.ctor.ops = {
      preserve: true,
      type: 'unshift',
      index: null,
      node: ''
    }
    if(ctxFn && typeof ctxFn === 'function') {
      fnArr = ctxFn(arr)
      if(fnArr && Array.isArray(fnArr)) { 
        this.ctor.ops.preserve = false
        arr = fnArr
      }
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
 * @param {function} - ***optional*** delegate the result array to a **function**, if returned, the return result is used instead
 * @param {number} - zero-based index at which to begin extraction
 * @param {number} - ***optional*** zero-based index at which to end extraction
 * @returns {context}
 */
Keet.prototype.slice = function(fn, start, end) {
  var arr = this.copy(this.ctor.arrayPristine),
    str = this.ctor.tmplString, ctxFn, argv, fnArr
  if(typeof arguments[0] === 'function'){
    ctxFn = [].shift.call(arguments)
  }
  if(Array.isArray(arr)){
    argv = [].slice.call(arguments)
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
    if(ctxFn && typeof ctxFn === 'function') {
      fnArr = ctxFn(arr)
      if(fnArr && Array.isArray(fnArr)) { 
        this.ctor.ops.preserve = false
        arr = fnArr
      }
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
 * @param {function} - ***optional*** delegate the result array to a **function**, if returned, the result is used instead
 * @param {number} - index at which to start changing the array
 * @param {number} - ***optional*** integer indicating the number of old array elements to remove
 * @param {...object} - one or more objects to insert into the array
 * @returns {context}
 */
Keet.prototype.splice = function(fn, start, count, obj) {
  var arr = this.copy(this.ctor.arrayPristine),
    str = this.ctor.tmplString, ctxFn, objs, argv, fnArr
  argv = [].slice.call(arguments)
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
    if(ctxFn && typeof ctxFn === 'function') {
      fnArr = ctxFn(arr)
      if(fnArr && Array.isArray(fnArr)) { 
        this.ctor.ops.preserve = false
        arr = fnArr
      }
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
 * @param {object | function} - the listener, a component instance or a function
 * @param {string} - the type of this bind event listener
 * @returns {context}
 */
Keet.prototype.bindListener = function(inputId, listener, type) {
  var ctx = this
  this.loaded(function(){
    var e = document.getElementById(inputId)
    type = type || 'input'
    if(e){
      e.addEventListener(type, function() {
        if (typeof listener.__proto__.set === 'function') {
          listener.set(e.value)
        } else if (typeof listener === 'function') {
          listener(e.value)
        } else {
          return e.value
        }
      })
    } else throw('Element does not exist')
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
Keet.prototype.set = function(value, vProp) {
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
/**
 * Helpers to create elements without writing brackets i.e ```app.tag('a', 'link', {id: 'imgLink', href: 'http://somelink.com'}, {color: 'red'})``` 
 * which will yeild ```<a href="http://somelink.com" id="imgLink" style="color:red">link</a>```, **this is not chainable prototype**, 
 * to use use call the helpers function of Keet.
 * @param {string} - the element tag name reference
 * @param {string | number} - the inner html value
 * @param {object} - ***optional*** if specified, write properties and values as attributes, omit as ```null/undefined``` if need next arg
 * @param {object} - ***optional*** if specified, write properties and values as style
 * @returns {array}
 */
Keet.prototype.ktag = function(tag, value, attributes, styles) {
  var attr, idx, te, a = [].slice.call(arguments),
    ret = ['<', a[0], '>', a[1],'</', a[0], '>']
  if(a.length > 2 && typeof a[2] === 'object') {
    for(attr in a[2]){
      ret.splice(2, 0, ' ', attr, '="', a[2][attr], '"')
    }
  }
  if(a.length > 3 && typeof a[3] === 'object') {
    idx = ret.indexOf('>')
    if(~idx){
      te = [idx, 0, ' style="']
      for(attr in a[3]){
        te.push(attr)
        te.push(':')
        te.push(a[3][attr])
      }
      te.push('"')
      ret.splice.apply(ret, te)
    }
  }
  return ret
}
},{}]},{},[1])(1)
});