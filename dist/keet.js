(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Keet = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var cat = function() {
    return [].slice.call(arguments).join('')
  }

if (typeof exports !== 'undefined') {
  if (typeof module !== 'undefined' && module.exports) {
    exports = module.exports = cat
  }
  exports.cat = cat
}
},{}],2:[function(require,module,exports){
var copy = function(argv) {
  var clone = function(v) {
    var o = {}
    if(typeof v !== 'object'){
      o.copy = v
      return o.copy
    } else {
      for(var attr in v){
        o[attr] = v[attr]
      }
      return o
    }
  }
  return Array.isArray(argv) ? argv.map(function(v) {
    return v
  }) : clone(argv)
}

if (typeof exports !== 'undefined') {
  if (typeof module !== 'undefined' && module.exports) {
    exports = module.exports = copy
  }
  exports.copy = copy
}
},{}],3:[function(require,module,exports){
/** 
 * Keet.js v2.0 Alpha release: https://github.com/syarul/keet
 * an API for web application
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

function Keet(tagName, context) {
  var ctx = this
  ,   argv = [].slice.call(arguments)
  ,   context = argv.filter(function(c) { return typeof c === 'object'})[0]
  ,   isDoc = (function() {
        return typeof document == 'object' ? true : false
      }())
  ,   getId = function(id) {
        var ret        
        if (isDoc) {
            ret = document.getElementById(id)
        } else {
            throw ('Not a document object model.')
        }
        return ret
      }
  ,   testEval = function(ev) {
        try { return eval(ev) } 
        catch (e) { return false }
      }
  ,   camelCase = function(s) {
        var rx = /\-([a-z])/g
        return s.replace(rx, function(a, b) {
          return b.toUpperCase()
        })
      }
  ,   guid = function(){
        return (Math.round(Math.random()*0x1000000)).toString(32)
      }
  ,   genElement = function(child){
        var tempDiv = document.createElement('div')
        var cloneChild = copy(child)
        delete cloneChild.template
        delete cloneChild.tag
        delete cloneChild.click
        delete cloneChild.style
        delete cloneChild.bind
        for(var attr in cloneChild){
          if(typeof cloneChild[attr] === 'function'){
            delete cloneChild[attr]
          }
        }
        var s = tag(child.tag, child.template ? child.template : '', cloneChild, child.style)
        tempDiv.innerHTML = s
        if(child.tag === 'input'){
          if (child.click) tempDiv.childNodes[0].click()
          if (child.bind){
            ctx.bind(child.bind.type, child.bind.fn)
          }
          if (child.checked) tempDiv.childNodes[0].checked = 'checked'
          else if(child.checked === false)
            tempDiv.childNodes[0].checked = false
        }
        process_k_click(tempDiv)
        return tempDiv.childNodes[0]
      }
  ,   parseStr = function(appObj, watch){
        var str = appObj.template ? appObj.template : ''
        ,   childs = str.match(/{{([^{}]+)}}/g, '$1')
        ,   regc
        ,   child
        ,   tempDiv
        ,   elemArr = []
        if(childs){

          if(Array.isArray(appObj.list)) {
              var arrProps = str.match(/{{([^{}]+)}}/g, '$1'), tmplStr = '', tmpl
              appObj.list.forEach(function(r) {
                tmpl = str
                arrProps.forEach(function(s) {
                  var rep = s.replace(/{{([^{}]+)}}/g, '$1')
                  tmpl = tmpl.replace(/{{([^{}]+)}}/, r[rep])
                })
                tempDiv = document.createElement('div')
                tempDiv.innerHTML = tmpl
                process_k_click(tempDiv)
                elemArr.push(tempDiv.childNodes[0])
              })
              watcher3(appObj.list)
          } else {
            childs.forEach(function(c, index){
              regc = c.replace(/{{([^{}]+)}}/g, '$1')
              // skip tags which not being declared yet
              if(context){
                // check closure object
                child = context[regc] ? context[regc] : false
              } else {
                // check if current  objectr has prop
                child = appObj[regc]
                // check global object
                if(!child) child = testEval(regc) ? eval(regc) : false
              }
              if(child && typeof child === 'object'){
                var newElement = genElement(child)
                elemArr.push(newElement)
              } else if(!child){
                tempDiv = document.createElement('div')
                tempDiv.innerHTML = c
                elemArr.push(tempDiv.childNodes[0])
              }

              // watch object state
              if(watch && child) {
                watcher(child, index)
              }
            })
          }

        } else {
          tempDiv = document.createElement('div')
          tempDiv.innerHTML = str
          elemArr.push(tempDiv.childNodes[0])
          watcher2(appObj)
        }
        return elemArr
  }
  ,   process_k_click = function(kNode){
        var listKnodeChild = []
        if(kNode.hasChildNodes()){
          loopChilds(listKnodeChild, kNode)
          listKnodeChild.forEach(function(c, i){
            if(c.nodeType === 1 && c.hasAttributes()){
              var kStringSingle = c.getAttribute('k-click')
              var KStringDouble = c.getAttribute('k-double-click')
              var kString = KStringDouble || kStringSingle
              var isDouble = KStringDouble ? true : false
              if(kString){
                var kFn = kString.split('(')
                var kClick
                if(kFn){
                  kClick = testEval(ctx.base[kFn[0]]) ? eval(ctx.base[kFn[0]]) : false
                  if(typeof kClick === 'function') processClickEvt(c, kClick, kFn, isDouble)
                }
                
              }
            }
          })
        }
        listKnodeChild = []
  }
  ,   processClickEvt = function(c, kClick, kFn, isDouble) {
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

  /**
  * render component to DOM
  */

  this.render = function(){
    var ele = getId(ctx.el)
    if(context) ctx.base = context
    var elArr = parseStr(ctx.base, true)
    for (var i = 0; i < elArr.length; i++) {
      ele.appendChild(elArr[i])
    }

  }

  this.update = function(appObj){
    var ele = getId(ctx.el)
    var elArr = parseStr(appObj, true)
    for (var i = 0; i < elArr.length; i++) {
      ele.replaceChild(elArr[i], ele.childNodes[i])
    }
  }

  this.bind = function(type, fn){
    var ele = getId(ctx.el)
    ele.addEventListener(type, ctx.base ? fn.bind(ctx.base) : fn, false)
  }

  var watcher = function(instance, index){
    var obj, attr, ele, copyInstance, newElem
    for (attr in instance){
      instance.watch(attr, function(idx, o, n) {
        instance.unwatch(attr)
        obj = {}
        obj[idx] = n
        ele = getId(ctx.el)
        if(idx !== 'click'){
          copyInstance = copy(instance)
          Object.assign(copyInstance, obj)
          newElem = genElement(copyInstance)
          updateElem(ele.childNodes[index], newElem)
        } else {
          ele.childNodes[index].click()
        }
        watcher(instance, index)
      })
    }
  }

  var watcher2 = function(instance){
    var obj, attr, ele, copyInstance, newElem
    for (attr in instance){
      instance.watch(attr, function(idx, o, n) {
        instance.unwatch(attr)
        obj = {}
        obj[idx] = n
        ele = getId(ctx.el)
        if(idx !== 'click'){
          copyInstance = copy(instance)
          Object.assign(copyInstance, obj)
          newElem = genElement(copyInstance)
          updateElem(ele, newElem)
        } else {
          ele.click()
        }
        watcher2(instance)
      })
    }
  }

  var watcher3 = function(instance){
    var pristineLen = copy(instance), opsList, op, query
    
    opsList = function() { return ['push', 'pop', 'shift', 'unshift', 'splice', 'update'] }

    op = opsList()

    query = function(ops, argvs) {
      op = []
      if(ops === 'push')
        arrProtoPush(argvs[0])
      else if(ops === 'pop')
        arrProtoPop()
      else if(ops === 'shift')
        arrProtoShift()
      else if(ops === 'unshift')
        arrProtoUnShift.apply(null, argvs)
      else if(ops === 'splice')
        arrProtoSplice.apply(null, argvs)
      else
        arrProtoUpdate.apply(null, argvs)
      op = opsList()
      pristineLen = copy(instance)
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
  }

  var arrProtoPush = function(newObj){
    var ele = getId(ctx.el)
    ele.appendChild(genTemplate(newObj))
  }

  var arrProtoPop = function(){
    var ele = getId(ctx.el)
    if(ele.childNodes.length) {
      ele.removeChild(ele.lastChild)
    }
  }

  var arrProtoShift = function(){
    var ele = getId(ctx.el)
    if(ele.childNodes.length) {
      ele.removeChild(ele.firstChild)
    }
  }

  var arrProtoUnShift = function(){
    var argv = [].slice.call(arguments)
    var ele = getId(ctx.el)
    var i = argv.length - 1
    while(i > -1) {
      ele.insertBefore(genTemplate(argv[i]), ele.firstChild)
      i--
    }
  }

  var arrProtoSplice = function(){
    var ele = getId(ctx.el)
    ,   childLen
    ,   len
    ,   i
    ,   j
    ,   k
    ,   c
    ,   tempDivChildLen
    ,   tempDiv
    ,   argv = [].slice.call(arguments)
    ,   start = [].shift.call(argv)
    ,   count
    if(typeof argv[0] === 'number'){
      count = [].shift.call(argv)
    }

    tempDiv = document.createElement('div')
    if(argv.length){
      i = 0
      while(i < argv.length){
        tempDiv.appendChild(genTemplate(argv[i]))
        i++
      }
    }

    childLen = copy(ele.childNodes.length)
    tempDivChildLen = copy(tempDiv.childNodes.length)
    if (count && count > 0) {
      for (i = start; i < childLen + 1; i++) {
        len = start + count
        if (i < len) {
          ele.removeChild(ele.childNodes[start])
          if (i === len - 1 && tempDivChildLen > 0) {
            c = start - 1
            for (j = start; j < tempDivChildLen + start; j++) {
              insertAfter(tempDiv.childNodes[0], ele.childNodes[c], ele)
              c++
            }
          }
        }
      }
    } else if (argv.length) {
      c = start - 1
      for (k = start; k < tempDivChildLen + start; k++) {
        insertAfter(tempDiv.childNodes[0], ele.childNodes[c], ele)
        c++
      }
    }
  }

  var arrProtoUpdate = function(){
    var argv = [].slice.call(arguments)
    ,   ele = getId(ctx.el)
    ,   index = [].shift.call(argv)
    updateElem(ele.childNodes[index], genTemplate(argv[0]))
  }

  var genTemplate = function(obj){
    var arrProps = ctx.base.template.match(/{{([^{}]+)}}/g, '$1'),  tmpl, tempDiv, ele
    tmpl = ctx.base.template
    arrProps.forEach(function(s) {
      var rep = s.replace(/{{([^{}]+)}}/g, '$1')
      tmpl = tmpl.replace(/{{([^{}]+)}}/, obj[rep])
    })
    tempDiv = document.createElement('div')
    tempDiv.innerHTML = tmpl
    return tempDiv.childNodes[0]
  }

  var loopChilds = function(arr, elem) {
    for (var child = elem.firstChild; child !== null; child = child.nextSibling) {
      arr.push(child)
      if (child.hasChildNodes()) {
        loopChilds(arr, child)
      }
    }
  }

  var insertAfter = function(newNode, referenceNode, parentNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling)
  }

  var nodeUpdate = function(newNode, oldNode) {
    var oAttr = newNode.attributes
    var output = {};
    for(var i = oAttr.length - 1; i >= 0; i--) {
       output[oAttr[i].name] = oAttr[i].value
    }
    for (var iAttr in output) {
      if(oldNode.attributes[iAttr] && oldNode.attributes[iAttr].name === iAttr && oldNode.attributes[iAttr].value != output[iAttr]){
        if(iAttr === 'click') oldNode.click()
        else oldNode.setAttribute(iAttr, output[iAttr])
      }
    }
    output = {}
  }

  var nodeUpdateHTML = function(newNode, oldNode) {
    if(newNode.nodeValue !== oldNode.nodeValue)
        oldNode.nodeValue = newNode.nodeValue
  }

  var updateElem = function(oldElem, newElem){
    var oldArr = [], newArr = []
    oldArr.push(oldElem)
    newArr.push(newElem)
    loopChilds(oldArr, oldElem)
    loopChilds(newArr, newElem)
    if(oldArr.length !== newArr.length){
      // if nodeList length is different, replace the HTMLString
      oldElem.innerHTML = newElem.innerHTML
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

  if(!Array.prototype.update){
    Object.defineProperty(Array.prototype, 'update', {
        enumerable: false,
        writable: true,
        value: function(index, value) { 
          this[index] = value
        }
    })
  }
}

Keet.prototype.link = function(id, value) {
  var argv = [].slice.call(arguments)

  this.el = argv[0]
  if (argv.length === 2){
    if(!argv[1].tag){
      argv[1].tag = document.getElementById(id).tagName.toLowerCase()
    }
    this.base = argv[1]
  }
  this.render()
  return this
}

Keet.prototype.compose = function(instance) {
  this.update(instance)
  return this
}
},{"./cat":1,"./copy":2}]},{},[3])(3)
});