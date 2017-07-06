/** 
 * Keet.js v1.3.1 Beta release: https://github.com/syarul/keet
 * A flexible view layer for the web
 *
 * <<<<<<<<<<<<<<<<<<<<<<<<<<<<<< Keet.js >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
 *
 * Copyright 2017, Shahrul Nizam Selamat
 * Released under the MIT License.
 */
'use strict'
var cat = require('./cat')
var copy = require('./copy')

module.exports = Keet
/**
 * Keet constructor, each component is an instance of Keet
 * @param {string} - ***optional*** element tag name, set the default template for this Instance, i.e 'div'
 * @param {object} - ***optional*** if using Keet inside a closure declare the context of said closure
 * @returns {constructor}
 */
function Keet(tagName, context) {
  var cargv = [].slice.call(arguments), ctx = this, child, childAttr, 
    regc, injc, kStr, kRegc, kAttr, ret, l, tg,
    context = cargv.filter(function(c) { return typeof c === 'object'})[0],
    getId = function(id, uid) {
      if(ctx.ctor.doc) {
        ret = document.getElementById(id)
        if (!ret && uid) ret = document.querySelector(cat('[k-link="', uid, '"]'))
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
      return s.replace(rx, function(a, b) {
        return b.toUpperCase()
      })
    },
    guid = function(){
      return (Math.round(Math.random()*0x1000000)).toString(32)
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
  this.isNode = function() {
    var node = getId(ctx.el, ctx.ctor.uid)
    if (node && typeof node == 'object' && node.nodeType === 1) {
      node = null
      return true
    }
  }
  this.refNode =  function(){
    return getId(ctx.el, ctx.ctor.uid)
  }

  this.ctor.tags = {}
  this.ctor.ops = {}

  this.ctor.uid = guid()

  tg = cargv.filter(function(c) { return typeof c === 'string' && c !== 'debug' })[0]
  if (tg) this.ctor.tmpl = ['<', tg, ' k-link="', this.ctor.uid, '"', '>', '</', tg, '>']

  var _processTags = function(str, kData) {
    var childs = str.match(/{{([^{}]+)}}/g, '$1'), idx, ctmpl
    if(childs){
      childs.forEach(function(c){
        regc = c.replace(/{{([^{}]+)}}/g, '$1')
        // skip tags which not being declared yet
        if(context){
          child = context[regc] ? context[regc] : false
        } else {
          child = testEval(regc) ? eval(regc) : false
        }
        if(child){
          childAttr = {
            el: child.el,
            state: child.obs._state_,
            preserveAttr: child.ctor.preserveAttr,
            uid: child.ctor.uid,
            operator: child.ctor.vDomLoaded
          }

          ctx.ctor.tags[regc] = childAttr
          // inject value into child template
          if(child.ctor.tmpl) {
            ctmpl = copy(child.ctor.tmpl)
            idx =  ctmpl.indexOf('>')
            if(~idx) {
              ctmpl.splice(idx+1, 0, child.obs._state_.value)
              injc = cat.apply(null, ctmpl)
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

  var insertAfter = function(newNode, referenceNode, parentNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling)
  }

  var loopChilds = function(arr, elem) {
    for (var child = elem.firstChild; child !== null; child = child.nextSibling) {
      arr.push(child)
      if (child.hasChildNodes()) {
        loopChilds(arr, child)
      }
    }
  }

  var applyAttrib = function(selector, state, preserveAttr, uid) {
    var cty, attr, ts, type, a, d, gid, prev
    for (attr in state) {
      ts = new RegExp('-')
      if (attr.match(ts)) {
        type = attr.split(/-(.+)/)

        if(type[0] === 'attr' && !ctx.ctor.attr) ctx.ctor.attr = {}
        if(type[0] === 'css' && !ctx.ctor.css) ctx.ctor.css = {}
        if(type[0] === 'el' && !ctx.ctor.el) ctx.ctor.el = {}

        if (type[0] === 'attr') {
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
        } else if(type[0] === 'el') {
          ctx.ctor.el[type[1]] = {
            selector: selector,
            el: state[attr]
          }
          gid = getId(selector, uid)
          if(gid){
            if(typeof gid[type[1]] === 'boolean' || typeof gid[type[1]] === 'string'){
              gid[type[1]] = state[attr]
            } else if(typeof gid[type[1]] === 'function' && state[attr]){
              gid[type[1]]()
            }
          }
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
    //k-click
    if(state && state.value) {
      // setTimeout(function(){

        var kNode = getId(selector, uid)

        var listKnodeChild = []

        if(kNode && kNode.hasChildNodes()){
          loopChilds(listKnodeChild, kNode)
          listKnodeChild.forEach(function(c, i){
            if(c.nodeType === 1 && c.hasAttributes()){
              var kStringSingle = c.getAttribute('k-click')
              var KStringDouble = c.getAttribute('k-double-click')
              var kString = KStringDouble || kStringSingle
              var isDouble = KStringDouble ? true : false
              if(kString){
                var m = kString.match(/\(([^()]+)\)/g)
                var kFn = kString.split('(')
                var kClick
                if(m){  
                  if(kFn){
                    if(context) kClick = testEval(context[kFn[0]]) ? eval(context[kFn[0]]) : false
                    else kClick = testEval(kFn[0]) ? eval(kFn[0]) : false

                    if(typeof kClick === 'function') processClickEvt(c, kClick, kFn, isDouble)
                  }
                } else {
                  if(context) kClick = testEval(context[kFn[0]]) ? eval(context[kFn[0]]) : false
                  else kClick = testEval(kFn[0]) ? eval(kFn[0]) : false
                  if(typeof kClick === 'function') processClickEvt(c, kClick, kFn, isDouble)
                }
              }
            }
          })
        }
        listKnodeChild = []

      // })
    }
  }

  var processClickEvt = function(c, kClick, kFn, isDouble) {
    var click = isDouble ? 'dblclick' : 'click'
    var rem = isDouble ? 'k-double-click' : 'k-click'
    c.removeAttribute(rem)
    c.addEventListener(click, function(evt){
      var argv = []
      argv.push(evt)
      if(kFn) {
        var v = kFn[1].slice(0, -1).split(',')
        if(v) v.forEach(function(v){ argv.push(v) })
      }
      return kClick.apply(c, argv)
    })
  }

  var nodeUpdate = function(newNode, oldNode) {
    var oAttr = newNode.attributes
    var output = {};
    for(var i = oAttr.length - 1; i >= 0; i--) {
       output[oAttr[i].name] = oAttr[i].value
    }
    for (var iAttr in output) {
      if(oldNode.attributes[iAttr] && oldNode.attributes[iAttr].name === iAttr && oldNode.attributes[iAttr].value != output[iAttr]){
        oldNode.setAttribute(iAttr, output[iAttr])
      }
    }
    output = {}
  }

  var nodeUpdateHTML = function(newNode, oldNode) {
    if(newNode.nodeValue !== oldNode.nodeValue)
        oldNode.nodeValue = newNode.nodeValue
  }

  var updateElem = function(oldElem, newElem, fallbackHTMLstring){
    var oldArr = [], newArr = []

    //push the elements
    oldArr.push(oldElem)
    newArr.push(newElem)
    // now push the childs
    loopChilds(oldArr, oldElem)
    loopChilds(newArr, newElem)
    if(oldArr.length !== newArr.length){
      // if nodeList length is different, use the HTMLString
      oldElem.innerHTML = fallbackHTMLstring
      return false
    }

    oldArr.forEach(function(ele, idx, arr) {
      if (ele.nodeType === 1 && ele.hasAttributes()) {
        nodeUpdate(newArr[idx], ele)
      } else if (ele.nodeType === 3) {
        nodeUpdateHTML(newArr[idx], ele)
      }
      if(idx === arr.length - 1){
        oldArr.splice(0)
        newArr.splice(0)
      }
    })
  }

  var eventedElem = function(elem, selector, value, eventObj){
    var e = elem.querySelector(cat('[', selector, '="', value, '"]'))
    if(e){
      for(var attr in eventObj){
        if(typeof e[attr] === 'function' && eventObj[attr]) e[attr]()
        else if(typeof e[attr] === 'boolean' || typeof e[attr] === 'string') e[attr] = eventObj[attr]
      }
    }
  }

  var _triggerElem = function() {
    var state = ctx.obs._state_, el = ctx.el, uid = ctx.ctor.uid, 
      processStr, ele = getId(el, uid), childTags = ctx.ctor.tags, attr, tempDiv, 
      childLen, tempDivChildLen, i, j, k, len, c
    if (ele) {
      // process each {{instance}} before parsing to html
      if(state.value)
        processStr = _processTags(state.value, state['k-data'])
      // parsing string to DOM only when necessary
      if(ctx.ctor.ops.preserve === true && ele.hasChildNodes()) {
        if(ctx.ctor.ops.type === 'remove'){
          ele.removeChild(ele.childNodes[ctx.ctor.ops.index])
        }else if(ctx.ctor.ops.type === 'evented'){
          eventedElem(ele.childNodes[ctx.ctor.ops.index], ctx.ctor.ops.selector, ctx.ctor.ops.value, ctx.ctor.ops.eventObj)
        }else if(ctx.ctor.ops.type === 'update'){
        
          tempDiv = document.createElement('div')
          tempDiv.innerHTML = ctx.ctor.ops.node

          updateElem(ele.childNodes[ctx.ctor.ops.index], tempDiv.childNodes[0])

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
          tempDivChildLen = copy(tempDiv.childNodes.length)
          for(i=0;i<tempDivChildLen;i++){
            ele.appendChild(tempDiv.childNodes[0])
          }
        }else if(ctx.ctor.ops.type === 'splice'){
          tempDiv = document.createElement('div')
          tempDiv.innerHTML = ctx.ctor.ops.node
          childLen = copy(ele.childNodes.length)
          tempDivChildLen = copy(tempDiv.childNodes.length)
          if(ctx.ctor.ops.count && ctx.ctor.ops.count > 0){
            for(i=ctx.ctor.ops.index;i<childLen+1;i++){
              len = ctx.ctor.ops.index+ctx.ctor.ops.count
              if(i < len){
                ele.removeChild(ele.childNodes[ctx.ctor.ops.index])
                if(i === len-1 && tempDivChildLen > 0){
                  c = ctx.ctor.ops.index - 1
                  for(j=ctx.ctor.ops.index;j<tempDivChildLen+ctx.ctor.ops.index;j++){
                    insertAfter(tempDiv.childNodes[0], ele.childNodes[c], ele)
                    c++
                  }
                }
              }
            }
          } else if(ctx.ctor.ops.nodeLen) {
            c = ctx.ctor.ops.index - 1
            for(k=ctx.ctor.ops.index;k<tempDivChildLen+ctx.ctor.ops.index;k++){
              insertAfter(tempDiv.childNodes[0], ele.childNodes[c], ele)
              c++
            }
          }
        } else {
          tempDiv = document.createElement('div')
          tempDiv.innerHTML = ctx.ctor.ops.node
          ele.appendChild(tempDiv.childNodes[0])
        }
        tempDiv = null
      } else if (processStr && state.value.length) {
        if(ele.hasChildNodes() && ele.childNodes[0].nodeType === 1){
          tempDiv = document.createElement('div')
          tempDiv.innerHTML = processStr
          updateElem(ele, tempDiv, processStr)
          tempDiv = null
        } else {
          ele.innerHTML = processStr
        }
      }
      else if (!processStr && state.value === '') {
        ele.innerHTML = ''
      }
      else if (!processStr && state.value && state.value.length > 1) {
        tempDiv = document.createElement('div')
        tempDiv.innerHTML = ctx.ctor.d
        updateElem(ele, tempDiv, ctx.ctor.d)
      } else if(!processStr && !state.value) {
        //
      }
      // attributes class and style
      applyAttrib(el, state, uid)
      // if child ctor exist apply the attributes to child tags
      for (attr in childTags) applyAttrib(childTags[attr].el, childTags[attr].state, childTags[attr].preserveAttr, childTags[attr].uid)
      ele = null
    }
  }

  var _registerElem = function() {
    var regList = ctx.ctor.register, evReg
    var reg = regList.filter(function(f){
      return typeof f === 'string'
    })[0]
    var force = regList.filter(function(f){
      return typeof f === 'boolean'
    })[0]
    var fn = regList.filter(function(f){
      return typeof f === 'function'
    })[0]
    // if this is registered, called this Instance.prototype.compose
    if(context){
      evReg = context[reg] ? context[reg] : false
    } else {
      evReg = testEval(reg) ? eval(reg) : false
    }
    if(evReg && typeof evReg.__proto__.compose === 'function') {
      evReg.compose(force, fn)
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
  if(!Array.prototype.assign){
    Object.defineProperty(Array.prototype, 'assign', {
        enumerable: false,
        writable: true,
        value: function(index, value) { 
          this[index] = value
        }
    })
  }
}
/**
 * Register this component instance as a child of a parent component i.e.
 * Updates on child are automatically updated to parent whenever the child called ```set/compose/link```.
 * If you want to have control over DOM mutation use ```Keet.prototype.compose``` instead. 
 * @param {string} - the parent component instance declared variable name.
 * @param {boolean} - ***optional*** force node render, if the node non-existent, apply false to the callback function
 * @param {function} - ***optional*** run a callback function after this component loaded and assign this particular dom selector as arguments
 * @returns {context}
 */
Keet.prototype.register = function(instance, force, fn) {
  var argv = [].slice.call(arguments)
  if (typeof instance === 'string') this.ctor.register = argv
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
 * @param {boolean} - ***optional*** voided: feature is removed
 * @param {function} - ***optional*** run a callback function after this component loaded and assign this particular dom selector as arguments
 * @returns {context}
 */
Keet.prototype.compose = function(force, fn) {
  // compose with a function
  // also as callee for setter
  var argv = [].slice.call(arguments),
    c = this.obs._state_, ctx = this, elem
  force = argv.filter(function(f) { return typeof f === 'boolean'})[0]
  fn = argv.filter(function(f) { return typeof f === 'function'})[0]

  // run child operator which assign to vDomLoaded
  function childFn(){
    for(var attr in ctx.ctor.tags){
      if(typeof ctx.ctor.tags[attr].operator === 'function') ctx.ctor.tags[attr].operator()
    }
  }

  elem = this.isNode()
  if(elem){
    this.obs._state_ = c
    if(fn) fn(this.refNode())
    childFn()
  } else {
    throw 'element does not exist'
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
 * Add callback function after component initialize
 * @param {function} - the function to associate with the callback event
 * @returns {context}
 */
Keet.prototype.vDomLoaded = function(cb) {
  if(typeof cb === 'function') {
    this.ctor.vDomLoaded = cb
  }
  return this
}
/**
 * Link this component instance to an attribute ```id```. If value is supplied, notify update to DOM.
 * @param {string} - the id string
 * @param {object|string} - ***optional*** value to parse into DOM
 * @returns {context}
 */
Keet.prototype.link = function(id, value) {
  var argv = [].slice.call(arguments), kLink
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
  } else {
    throw('component already declared')
  }
  return this
}
/**
 * Observe this array for changes, once recieved make update to component. Operation supported are
 * assignment, push, pop, shift, unshift, slice, splice and assign(is a wrapper for standard array assignment).
 * @param {object} - ***optional*** watch a different array instead
 * @param {function} - ***optional*** execute a function once the dom has updated
 * @returns {context}
 */
Keet.prototype.watch = function(instance, fn) {
  var ctx = this, argv, event, pristineLen = copy(this.ctor.arrayProto), 
  opsList, op, query, instance = instance || this.ctor.arrayProto
  if(!Array.isArray(instance)) {
    argv = [].slice.call(arguments)
    this.watchObj.apply(this, argv)
    return this
  }
  opsList = function() { return ['push', 'pop', 'shift', 'unshift', 'slice', 'splice', 'assign'] }

  op = opsList()

  var change = function(){
    if (typeof fn === 'function') fn(ctx.refNode())
  }

  query = function(ops, argvs) {
    op = []
    if(ops === 'push')
      ctx.insert(argvs[0])
    else if(ops === 'pop')
      ctx.remove(instance.length)
    else if(ops === 'shift')
      ctx.remove(0)
    else if(ops === 'unshift')
      ctx.unshift.apply(ctx, argvs)
    else if(ops === 'slice')
      ctx.slice.apply(ctx, argvs)
    else if(ops === 'splice')
      ctx.splice.apply(ctx, argvs)
    else
      ctx.update.apply(ctx, argvs)
    op = opsList()
    change()
  }

  op.forEach(function(f, i, r){
    instance[f] = function() {
      if(op.length > 0) {
        var fargv = [].slice.call(arguments)
        Array.prototype[f].apply(this, fargv)
        //propagate splice with single arguments
        if(fargv.length === 1 && f === 'splice')
          fargv.push(pristineLen.length - fargv[0])
        query(f, fargv)
      }
    }
  })

  return this
}
/**
 * Observe an object for changes in properties, once recieved delegate to a function callback
 * @param {object} - obj to watch
 * @param {function | string} - the function call once observe property changed, arguments pass to the 
 * function; (1st) the property attribute, (2nd) old value, (3rd) new value. If it a string it pass to Keet.prototype.set
 * @param {string} - the instance property to watch
 * @returns {context}
 */
Keet.prototype.watchObj = function(instance, set, prop) {
  var ctx = this, attr
  if(Array.isArray(instance)) {
    throw('Wrong type of operation, use Keet.prototype.watch instead.')
  }
  // watch for changes in the obj
  for (attr in instance){
    instance.watch(attr, function(idx, o, n) {
      instance.unwatch(attr)
      if(typeof set === 'function') {
        instance[attr] = n
        set.apply(ctx, arguments)
        ctx.watchObj(instance, set)
      } else if(typeof set === 'string' && prop && typeof prop === 'string') {
        instance[attr] = n
        ctx.set(set, instance[prop])
        ctx.watchObj(instance, set, prop)
      } else {
        throw('Not a function.')
      }
    })
  }
  return this
}
/**
 * Watch an object attributes and make update to components once a value changed
 * @param {object} - the object instance to watch
 * @returns {context}
 */
Keet.prototype.watchDistict = function(instance, value) {
  var ctx = this, cp, attr, obj
  if(typeof instance === 'object'){
    if (!this.obs._state_) {
      cp = copy(instance)
      if(value) cp['value'] = value
      this.set(cp)
    }
    // watch for changes in the obj
    for (attr in instance){
      instance.watch(attr, function(idx, o, n) {
        instance.unwatch(attr)
        obj = {}
        obj[idx] = n
        ctx.set(obj)
        ctx.watchDistict(instance)
      })
    }
  }
  return this
}
/**
 * Unwatch an object or array
 * @param {object} - obj/array to unwatch
 * @returns {context}
 */
Keet.prototype.unWatch = function(instance) {
  var attr, instance = instance || this.ctor.arrayProto
  if(Array.isArray(instance)) {
    delete instance.push
    delete instance.pop
    delete instance.shift
    delete instance.unshift
    delete instance.slice
    delete instance.splice
    delete instance.assign
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
  this.ctor.arrayPristine = copy(array)
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
 * Event selector for child elements
 * @param {number} - the index target for event
 * @param {string} - the selector
 * @param {string} - the selector value
 * @param {object} - the event object to assigned, i.e ```{ click: true }```, which will trigger click event
 * @returns {context}
 */
Keet.prototype.evented = function(index, selector, value, eventObj) {
  var arr = this.ctor.arrayProto, str = this.ctor.tmplString, fnArr
  if(Array.isArray(arr)){
    if(typeof index === 'number')
    this.ctor.ops = {
      preserve: true,
      type: 'evented',
      index: index,
      selector: selector,
      value: value,
      eventObj: eventObj
    }
    this.array(arr, str)
  } else {
    throw('object reference not created from array.')
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
    arrPris = copy(this.ctor.arrayPristine),
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
    arr = copy(arrPris)
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
  var arr = copy(this.ctor.arrayPristine),
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
  var arr = copy(this.ctor.arrayPristine),
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
  var arr = copy(this.ctor.arrayPristine),
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
      arr = [].concat.apply([], arr)
    } else if(argv.length === 0 && count) {
      arr.splice(start, count)
      arr = [].concat.apply([], arr)
    } else if(argv.length > 0 && !count){
      arr.splice(start, 0, argv)
      arr = [].concat.apply([], arr)
    }
    this.ctor.ops = {
      preserve: true,
      type: 'splice',
      index: start,
      count: count,
      node: argv,
      nodeLen: argv.length,
      pristinelen: this.ctor.arrayPristine.length
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
 * Event listener bindings, add an event listener to an input or any type event with a lookup to an id, subsequently notify the listener of the changes
 * @param {string} - the id of the event
 * @param {object | function} - the listener, a component instance or a function, if it a function second argument is the event
 * @param {string} - the type of this event listener
 * @returns {context}
 */
Keet.prototype.bindListener = function(inputId, listener, type) {
  var ctx = this
  var e = document.getElementById(inputId)
  type = type || 'input'
  if(!ctx.ctor.ev) ctx.ctor.ev = {}
  if(e){
    var str = cat(inputId, '-', type)
    ctx.ctor.ev[str] = function(evt) {
      if (typeof listener.__proto__.set === 'function') {
        evt.preventDefault()
        listener.set(e.value)
      } else if (typeof listener === 'function') {
        listener(e.value, evt)
      }
    }
    e.addEventListener(type, ctx.ctor.ev[str])
  } else throw('Element does not exist')
  return this
}
/**
 * Remove event listener bindings
 * @param {string} - the id of the event
 * @param {string} - the type of this bind event listener
 * @returns {context}
 */
Keet.prototype.removeListener = function(inputId, type) {
  var ctx = this
  var e = document.getElementById(inputId)
  type = type || 'input'
  if(e){
    var str = cat(inputId, '-', type)
    e.removeEventListener(type, ctx.ctor.ev[str], false)
    delete ctx.ctor.ev[str]
  } else throw('Element does not exist')
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