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
 * Keet.js v2.0.8 Alpha release: https://github.com/syarul/keet
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
var tag = require('./tag')

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
        delete cloneChild.__ref__
        for(var attr in cloneChild){
          if(typeof cloneChild[attr] === 'function'){
            delete cloneChild[attr]
          }
        }
        var s = tag(child.tag, child.template ? child.template : '', cloneChild, child.style)
        tempDiv.innerHTML = s
        if(child.tag === 'input'){
          if (child.click) tempDiv.childNodes[0].click()
          if (child.checked) tempDiv.childNodes[0].checked = 'checked'
          else if(child.checked === false)
            tempDiv.childNodes[0].checked = false
        }
        process_event(tempDiv)
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
                process_event(tempDiv)
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
          process_event(tempDiv)
          elemArr.push(tempDiv.childNodes[0])
          watcher2(appObj)
        }
        return elemArr
  }

  var process_event = function(kNode) {
    var listKnodeChild = [], hask, evtName, evthandler, handler, isHandler, argv, i, atts, v, rem = []
    if (kNode.hasChildNodes()) {
      loopChilds(listKnodeChild, kNode)
      listKnodeChild.forEach(function(c) {
        if (c.nodeType === 1 && c.hasAttributes()) {
          i = 0
          function next(){
            atts = c.attributes
            if(i < atts.length) {
              hask = /^k-/.test(atts[i].nodeName)
              if(hask){
                evtName = atts[i].nodeName.split('-')[1]
                evthandler = atts[i].nodeValue
                handler = evthandler.split('(')
                isHandler = testEval(ctx.base[handler[0]]) ? eval(ctx.base[handler[0]]) : false
                if(typeof isHandler === 'function') {
                  rem.push(atts[i].nodeName)
                  c.addEventListener(evtName, function(evt){
                    argv = []
                    argv.push(evt)
                    v = handler[1].slice(0, -1).split(',')
                    if(v) v.forEach(function(v){ argv.push(v) })
                    
                    isHandler.apply(c, argv)
                  })
                }
              }
              i++
              next()
            } else {
              rem.map(function(f){ c.removeAttribute(f) })
            }
          }
          next()
        }
      })
    }
    listKnodeChild = []
  }

  this.vdom = function(){
    var ele = getId(ctx.el)
    if(ele) return ele
  }

  this.flush = function(component){
    var ele = getId(component) || getId(ctx.el)
    if(ele) ele.innerHTML = ''
    return this
  }

  /**
  * render component to DOM
  */

  this.render = function(){
    var ele = getId(ctx.el)
    if(!ele){
      console.warn('error: cannot find DOM with id: '+ctx.el+' skip rendering..')
      return false
    }
    if(context) ctx.base = context
    var elArr = parseStr(ctx.base, true)
    for (var i = 0; i < elArr.length; i++) {
      ele.appendChild(elArr[i])

      if(i === elArr.length - 1){
        document.addEventListener('_loaded', window._loaded && typeof window._loaded === 'function' ? window._loaded(ctx.el) : null, false)
      }
    }

  }

  this.update = function(appObj){
    var ele = getId(ctx.el)
    var elArr = parseStr(appObj, true)
    for (var i = 0; i < elArr.length; i++) {
      ele.replaceChild(elArr[i], ele.childNodes[i])
      if(i === elArr.length - 1){
        document.addEventListener('_update', window._update && typeof window._update === 'function' ? window._update(ctx.el) : null, false)
      }
    }
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
          if(!pristineLen[fargv[0]]) return false
          if(f === 'update')
            fargv[1] = Object.assign(pristineLen[fargv[0]], fargv[1])
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
    if(!newNode) return false
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
    if(oldNode.textContent  === "" && newNode.textContent ){
      oldNode.textContent = newNode.textContent
    }
    output = {}
  }

  var nodeUpdateHTML = function(newNode, oldNode) {
    if(!newNode) return false
    if(newNode.nodeValue !== oldNode.nodeValue)
        oldNode.nodeValue = newNode.nodeValue
  }

  var updateElem = function(oldElem, newElem){
    var oldArr = [], newArr = []
    oldArr.push(oldElem)
    newArr.push(newElem)
    loopChilds(oldArr, oldElem)
    loopChilds(newArr, newElem)
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

Keet.prototype.mount = function(instance) {
  this.base = instance
  return this
}

Keet.prototype.cluster = function() {
  var args = [].slice.call(arguments)
  args.map(function(fn){
    if(typeof fn === 'function') fn()
  })
  return this
}

Keet.prototype.list = function(){
  return this.base && this.base.list || []
}

Keet.prototype.getBase = function(child, attribute, newProp) {
  if (arguments.length > 2 && this.base)
    this.base[child][attribute] = newProp
  else
    return this.base[child][attribute]
}

Keet.prototype.addClass = function(child, newClass) {
  var b = this.getBase(child, 'class')

  var isArr = function() {
    b.push(newClass)
    this.getBase(child, 'class', b)
  }

  return Array.isArray(b) && isArr()
}

Keet.prototype.removeClass = function(child, oldClass) {
  var b = this.getBase(child, 'class')

  var hIdx = function(idx) {
    b.splice(idx, 1)
    this.getBase(child, 'class', b)
  }

  var isArr = function() {
    var idx = b.indexOf(oldClass)
    if (~idx) hIdx(idx)
  }

  return Array.isArray(b) && isArr()
}

Keet.prototype.swapClass = function(child, condition, classesArray) {
  var b = this.getBase(child, 'class')

  if (condition) classesArray.reverse()

  var hIdx = function(idx) {
    b.splice(idx, 1, classesArray[1])
    this.getBase(child, 'class', b)
  }

  var isArr = function() {
    var idx = b.indexOf(classesArray[0])
    if (~idx) hIdx(idx)
  }

  return Array.isArray(b) && isArr()
}

Keet.prototype.swapAttr = function(child, condition, propertyArray, attribute) {
  if (condition) propertyArray.reverse()
  this.getBase(child, attribute, propertyArray[0])
}

Keet.prototype.setAttr = function(child, attribute, newProperty) {
  this.getBase(child, attribute, newProperty)
}

Keet.prototype.toggle = function(child, display) {
  var styl = this.base[child].style
  Object.assign(styl, { display: display })
  this.base[child].style = styl
}

Keet.prototype.contentUpdate = function(child, content) {
  this.base[child].template = content
}
},{"./cat":1,"./copy":2,"./tag":4}],4:[function(require,module,exports){
var tag = function() {
  function ktag(tag, value, attributes, styles) {
    var attr, idx, te, a = [].slice.call(arguments),
      ret = ['<', a[0], '>', a[1], '</', a[0], '>']
    if (a.length > 2 && typeof a[2] === 'object') {
      for (attr in a[2]) {
        if(typeof a[2][attr] === 'boolean' && a[2][attr])
          ret.splice(2, 0, ' ', attr)
        else if(attr === 'class' && Array.isArray(a[2][attr]))
          ret.splice(2, 0, ' ', attr, '="', a[2][attr].join(' ').trim(), '"')
        else
          ret.splice(2, 0, ' ', attr, '="', a[2][attr], '"')
      }
    }
    if (a.length > 3 && typeof a[3] === 'object') {
      idx = ret.indexOf('>')
      if (~idx) {
        te = [idx, 0, ' style="']
        for (attr in a[3]) {
          te.push(attr)
          te.push(':')
          te.push(a[3][attr])
          te.push(';')
        }
        te.push('"')
        ret.splice.apply(ret, te)
      }
    }
    return ret
  }
  var args = [].slice.call(arguments),
    arr = ktag.apply(null, args)
  return arr.join('')
}

if (typeof exports !== 'undefined') {
  if (typeof module !== 'undefined' && module.exports) {
    exports = module.exports = tag
  }
  exports.tag = tag
}
},{}]},{},[3])(3)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJjYXQuanMiLCJjb3B5LmpzIiwiaW5kZXguanMiLCJ0YWcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcm1CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciBjYXQgPSBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiBbXS5zbGljZS5jYWxsKGFyZ3VtZW50cykuam9pbignJylcclxuICB9XHJcblxyXG5pZiAodHlwZW9mIGV4cG9ydHMgIT09ICd1bmRlZmluZWQnKSB7XHJcbiAgaWYgKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnICYmIG1vZHVsZS5leHBvcnRzKSB7XHJcbiAgICBleHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSBjYXRcclxuICB9XHJcbiAgZXhwb3J0cy5jYXQgPSBjYXRcclxufSIsInZhciBjb3B5ID0gZnVuY3Rpb24oYXJndikge1xyXG4gIHZhciBjbG9uZSA9IGZ1bmN0aW9uKHYpIHtcclxuICAgIHZhciBvID0ge31cclxuICAgIGlmKHR5cGVvZiB2ICE9PSAnb2JqZWN0Jyl7XHJcbiAgICAgIG8uY29weSA9IHZcclxuICAgICAgcmV0dXJuIG8uY29weVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgZm9yKHZhciBhdHRyIGluIHYpe1xyXG4gICAgICAgIG9bYXR0cl0gPSB2W2F0dHJdXHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIG9cclxuICAgIH1cclxuICB9XHJcbiAgcmV0dXJuIEFycmF5LmlzQXJyYXkoYXJndikgPyBhcmd2Lm1hcChmdW5jdGlvbih2KSB7XHJcbiAgICByZXR1cm4gdlxyXG4gIH0pIDogY2xvbmUoYXJndilcclxufVxyXG5cclxuaWYgKHR5cGVvZiBleHBvcnRzICE9PSAndW5kZWZpbmVkJykge1xyXG4gIGlmICh0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyAmJiBtb2R1bGUuZXhwb3J0cykge1xyXG4gICAgZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gY29weVxyXG4gIH1cclxuICBleHBvcnRzLmNvcHkgPSBjb3B5XHJcbn0iLCIvKiogXHJcbiAqIEtlZXQuanMgdjIuMC44IEFscGhhIHJlbGVhc2U6IGh0dHBzOi8vZ2l0aHViLmNvbS9zeWFydWwva2VldFxyXG4gKiBhbiBBUEkgZm9yIHdlYiBhcHBsaWNhdGlvblxyXG4gKlxyXG4gKiA8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDwgS2VldC5qcyA+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj5cclxuICpcclxuICogQ29weXJpZ2h0IDIwMTcsIFNoYWhydWwgTml6YW0gU2VsYW1hdFxyXG4gKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UuXHJcbiAqL1xyXG4ndXNlIHN0cmljdCdcclxudmFyIGNhdCA9IHJlcXVpcmUoJy4vY2F0JylcclxudmFyIGNvcHkgPSByZXF1aXJlKCcuL2NvcHknKVxyXG52YXIgdGFnID0gcmVxdWlyZSgnLi90YWcnKVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBLZWV0XHJcblxyXG5mdW5jdGlvbiBLZWV0KHRhZ05hbWUsIGNvbnRleHQpIHtcclxuICB2YXIgY3R4ID0gdGhpc1xyXG4gICwgICBhcmd2ID0gW10uc2xpY2UuY2FsbChhcmd1bWVudHMpXHJcbiAgLCAgIGNvbnRleHQgPSBhcmd2LmZpbHRlcihmdW5jdGlvbihjKSB7IHJldHVybiB0eXBlb2YgYyA9PT0gJ29iamVjdCd9KVswXVxyXG4gICwgICBpc0RvYyA9IChmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4gdHlwZW9mIGRvY3VtZW50ID09ICdvYmplY3QnID8gdHJ1ZSA6IGZhbHNlXHJcbiAgICAgIH0oKSlcclxuICAsICAgZ2V0SWQgPSBmdW5jdGlvbihpZCkge1xyXG4gICAgICAgIHZhciByZXQgICAgICAgIFxyXG4gICAgICAgIGlmIChpc0RvYykge1xyXG4gICAgICAgICAgICByZXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZClcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aHJvdyAoJ05vdCBhIGRvY3VtZW50IG9iamVjdCBtb2RlbC4nKVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmV0XHJcbiAgICAgIH1cclxuICAsICAgdGVzdEV2YWwgPSBmdW5jdGlvbihldikge1xyXG4gICAgICAgIHRyeSB7IHJldHVybiBldmFsKGV2KSB9IFxyXG4gICAgICAgIGNhdGNoIChlKSB7IHJldHVybiBmYWxzZSB9XHJcbiAgICAgIH1cclxuICAsICAgY2FtZWxDYXNlID0gZnVuY3Rpb24ocykge1xyXG4gICAgICAgIHZhciByeCA9IC9cXC0oW2Etel0pL2dcclxuICAgICAgICByZXR1cm4gcy5yZXBsYWNlKHJ4LCBmdW5jdGlvbihhLCBiKSB7XHJcbiAgICAgICAgICByZXR1cm4gYi50b1VwcGVyQ2FzZSgpXHJcbiAgICAgICAgfSlcclxuICAgICAgfVxyXG4gICwgICBndWlkID0gZnVuY3Rpb24oKXtcclxuICAgICAgICByZXR1cm4gKE1hdGgucm91bmQoTWF0aC5yYW5kb20oKSoweDEwMDAwMDApKS50b1N0cmluZygzMilcclxuICAgICAgfVxyXG4gICwgICBnZW5FbGVtZW50ID0gZnVuY3Rpb24oY2hpbGQpe1xyXG4gICAgICAgIHZhciB0ZW1wRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcclxuICAgICAgICB2YXIgY2xvbmVDaGlsZCA9IGNvcHkoY2hpbGQpXHJcbiAgICAgICAgZGVsZXRlIGNsb25lQ2hpbGQudGVtcGxhdGVcclxuICAgICAgICBkZWxldGUgY2xvbmVDaGlsZC50YWdcclxuICAgICAgICBkZWxldGUgY2xvbmVDaGlsZC5jbGlja1xyXG4gICAgICAgIGRlbGV0ZSBjbG9uZUNoaWxkLnN0eWxlXHJcbiAgICAgICAgZGVsZXRlIGNsb25lQ2hpbGQuX19yZWZfX1xyXG4gICAgICAgIGZvcih2YXIgYXR0ciBpbiBjbG9uZUNoaWxkKXtcclxuICAgICAgICAgIGlmKHR5cGVvZiBjbG9uZUNoaWxkW2F0dHJdID09PSAnZnVuY3Rpb24nKXtcclxuICAgICAgICAgICAgZGVsZXRlIGNsb25lQ2hpbGRbYXR0cl1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIHMgPSB0YWcoY2hpbGQudGFnLCBjaGlsZC50ZW1wbGF0ZSA/IGNoaWxkLnRlbXBsYXRlIDogJycsIGNsb25lQ2hpbGQsIGNoaWxkLnN0eWxlKVxyXG4gICAgICAgIHRlbXBEaXYuaW5uZXJIVE1MID0gc1xyXG4gICAgICAgIGlmKGNoaWxkLnRhZyA9PT0gJ2lucHV0Jyl7XHJcbiAgICAgICAgICBpZiAoY2hpbGQuY2xpY2spIHRlbXBEaXYuY2hpbGROb2Rlc1swXS5jbGljaygpXHJcbiAgICAgICAgICBpZiAoY2hpbGQuY2hlY2tlZCkgdGVtcERpdi5jaGlsZE5vZGVzWzBdLmNoZWNrZWQgPSAnY2hlY2tlZCdcclxuICAgICAgICAgIGVsc2UgaWYoY2hpbGQuY2hlY2tlZCA9PT0gZmFsc2UpXHJcbiAgICAgICAgICAgIHRlbXBEaXYuY2hpbGROb2Rlc1swXS5jaGVja2VkID0gZmFsc2VcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvY2Vzc19ldmVudCh0ZW1wRGl2KVxyXG4gICAgICAgIHJldHVybiB0ZW1wRGl2LmNoaWxkTm9kZXNbMF1cclxuICAgICAgfVxyXG4gICwgICBwYXJzZVN0ciA9IGZ1bmN0aW9uKGFwcE9iaiwgd2F0Y2gpe1xyXG4gICAgICAgIHZhciBzdHIgPSBhcHBPYmoudGVtcGxhdGUgPyBhcHBPYmoudGVtcGxhdGUgOiAnJ1xyXG4gICAgICAgICwgICBjaGlsZHMgPSBzdHIubWF0Y2goL3t7KFtee31dKyl9fS9nLCAnJDEnKVxyXG4gICAgICAgICwgICByZWdjXHJcbiAgICAgICAgLCAgIGNoaWxkXHJcbiAgICAgICAgLCAgIHRlbXBEaXZcclxuICAgICAgICAsICAgZWxlbUFyciA9IFtdXHJcbiAgICAgICAgaWYoY2hpbGRzKXtcclxuXHJcbiAgICAgICAgICBpZihBcnJheS5pc0FycmF5KGFwcE9iai5saXN0KSkge1xyXG4gICAgICAgICAgICAgIHZhciBhcnJQcm9wcyA9IHN0ci5tYXRjaCgve3soW157fV0rKX19L2csICckMScpLCB0bXBsU3RyID0gJycsIHRtcGxcclxuICAgICAgICAgICAgICBhcHBPYmoubGlzdC5mb3JFYWNoKGZ1bmN0aW9uKHIpIHtcclxuICAgICAgICAgICAgICAgIHRtcGwgPSBzdHJcclxuICAgICAgICAgICAgICAgIGFyclByb3BzLmZvckVhY2goZnVuY3Rpb24ocykge1xyXG4gICAgICAgICAgICAgICAgICB2YXIgcmVwID0gcy5yZXBsYWNlKC97eyhbXnt9XSspfX0vZywgJyQxJylcclxuICAgICAgICAgICAgICAgICAgdG1wbCA9IHRtcGwucmVwbGFjZSgve3soW157fV0rKX19LywgcltyZXBdKVxyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIHRlbXBEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxyXG4gICAgICAgICAgICAgICAgdGVtcERpdi5pbm5lckhUTUwgPSB0bXBsXHJcbiAgICAgICAgICAgICAgICBwcm9jZXNzX2V2ZW50KHRlbXBEaXYpXHJcbiAgICAgICAgICAgICAgICBlbGVtQXJyLnB1c2godGVtcERpdi5jaGlsZE5vZGVzWzBdKVxyXG4gICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgd2F0Y2hlcjMoYXBwT2JqLmxpc3QpXHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjaGlsZHMuZm9yRWFjaChmdW5jdGlvbihjLCBpbmRleCl7XHJcbiAgICAgICAgICAgICAgcmVnYyA9IGMucmVwbGFjZSgve3soW157fV0rKX19L2csICckMScpXHJcbiAgICAgICAgICAgICAgLy8gc2tpcCB0YWdzIHdoaWNoIG5vdCBiZWluZyBkZWNsYXJlZCB5ZXRcclxuICAgICAgICAgICAgICBpZihjb250ZXh0KXtcclxuICAgICAgICAgICAgICAgIC8vIGNoZWNrIGNsb3N1cmUgb2JqZWN0XHJcbiAgICAgICAgICAgICAgICBjaGlsZCA9IGNvbnRleHRbcmVnY10gPyBjb250ZXh0W3JlZ2NdIDogZmFsc2VcclxuICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgLy8gY2hlY2sgaWYgY3VycmVudCAgb2JqZWN0ciBoYXMgcHJvcFxyXG4gICAgICAgICAgICAgICAgY2hpbGQgPSBhcHBPYmpbcmVnY11cclxuICAgICAgICAgICAgICAgIC8vIGNoZWNrIGdsb2JhbCBvYmplY3RcclxuICAgICAgICAgICAgICAgIGlmKCFjaGlsZCkgY2hpbGQgPSB0ZXN0RXZhbChyZWdjKSA/IGV2YWwocmVnYykgOiBmYWxzZVxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICBpZihjaGlsZCAmJiB0eXBlb2YgY2hpbGQgPT09ICdvYmplY3QnKXtcclxuICAgICAgICAgICAgICAgIHZhciBuZXdFbGVtZW50ID0gZ2VuRWxlbWVudChjaGlsZClcclxuICAgICAgICAgICAgICAgIGVsZW1BcnIucHVzaChuZXdFbGVtZW50KVxyXG4gICAgICAgICAgICAgIH0gZWxzZSBpZighY2hpbGQpe1xyXG4gICAgICAgICAgICAgICAgdGVtcERpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXHJcbiAgICAgICAgICAgICAgICB0ZW1wRGl2LmlubmVySFRNTCA9IGNcclxuICAgICAgICAgICAgICAgIGVsZW1BcnIucHVzaCh0ZW1wRGl2LmNoaWxkTm9kZXNbMF0pXHJcbiAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAvLyB3YXRjaCBvYmplY3Qgc3RhdGVcclxuICAgICAgICAgICAgICBpZih3YXRjaCAmJiBjaGlsZCkge1xyXG4gICAgICAgICAgICAgICAgd2F0Y2hlcihjaGlsZCwgaW5kZXgpXHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgdGVtcERpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXHJcbiAgICAgICAgICB0ZW1wRGl2LmlubmVySFRNTCA9IHN0clxyXG4gICAgICAgICAgcHJvY2Vzc19ldmVudCh0ZW1wRGl2KVxyXG4gICAgICAgICAgZWxlbUFyci5wdXNoKHRlbXBEaXYuY2hpbGROb2Rlc1swXSlcclxuICAgICAgICAgIHdhdGNoZXIyKGFwcE9iailcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGVsZW1BcnJcclxuICB9XHJcblxyXG4gIHZhciBwcm9jZXNzX2V2ZW50ID0gZnVuY3Rpb24oa05vZGUpIHtcclxuICAgIHZhciBsaXN0S25vZGVDaGlsZCA9IFtdLCBoYXNrLCBldnROYW1lLCBldnRoYW5kbGVyLCBoYW5kbGVyLCBpc0hhbmRsZXIsIGFyZ3YsIGksIGF0dHMsIHYsIHJlbSA9IFtdXHJcbiAgICBpZiAoa05vZGUuaGFzQ2hpbGROb2RlcygpKSB7XHJcbiAgICAgIGxvb3BDaGlsZHMobGlzdEtub2RlQ2hpbGQsIGtOb2RlKVxyXG4gICAgICBsaXN0S25vZGVDaGlsZC5mb3JFYWNoKGZ1bmN0aW9uKGMpIHtcclxuICAgICAgICBpZiAoYy5ub2RlVHlwZSA9PT0gMSAmJiBjLmhhc0F0dHJpYnV0ZXMoKSkge1xyXG4gICAgICAgICAgaSA9IDBcclxuICAgICAgICAgIGZ1bmN0aW9uIG5leHQoKXtcclxuICAgICAgICAgICAgYXR0cyA9IGMuYXR0cmlidXRlc1xyXG4gICAgICAgICAgICBpZihpIDwgYXR0cy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICBoYXNrID0gL15rLS8udGVzdChhdHRzW2ldLm5vZGVOYW1lKVxyXG4gICAgICAgICAgICAgIGlmKGhhc2spe1xyXG4gICAgICAgICAgICAgICAgZXZ0TmFtZSA9IGF0dHNbaV0ubm9kZU5hbWUuc3BsaXQoJy0nKVsxXVxyXG4gICAgICAgICAgICAgICAgZXZ0aGFuZGxlciA9IGF0dHNbaV0ubm9kZVZhbHVlXHJcbiAgICAgICAgICAgICAgICBoYW5kbGVyID0gZXZ0aGFuZGxlci5zcGxpdCgnKCcpXHJcbiAgICAgICAgICAgICAgICBpc0hhbmRsZXIgPSB0ZXN0RXZhbChjdHguYmFzZVtoYW5kbGVyWzBdXSkgPyBldmFsKGN0eC5iYXNlW2hhbmRsZXJbMF1dKSA6IGZhbHNlXHJcbiAgICAgICAgICAgICAgICBpZih0eXBlb2YgaXNIYW5kbGVyID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgICAgICAgICAgIHJlbS5wdXNoKGF0dHNbaV0ubm9kZU5hbWUpXHJcbiAgICAgICAgICAgICAgICAgIGMuYWRkRXZlbnRMaXN0ZW5lcihldnROYW1lLCBmdW5jdGlvbihldnQpe1xyXG4gICAgICAgICAgICAgICAgICAgIGFyZ3YgPSBbXVxyXG4gICAgICAgICAgICAgICAgICAgIGFyZ3YucHVzaChldnQpXHJcbiAgICAgICAgICAgICAgICAgICAgdiA9IGhhbmRsZXJbMV0uc2xpY2UoMCwgLTEpLnNwbGl0KCcsJylcclxuICAgICAgICAgICAgICAgICAgICBpZih2KSB2LmZvckVhY2goZnVuY3Rpb24odil7IGFyZ3YucHVzaCh2KSB9KVxyXG4gICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIGlzSGFuZGxlci5hcHBseShjLCBhcmd2KVxyXG4gICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICBpKytcclxuICAgICAgICAgICAgICBuZXh0KClcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICByZW0ubWFwKGZ1bmN0aW9uKGYpeyBjLnJlbW92ZUF0dHJpYnV0ZShmKSB9KVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBuZXh0KClcclxuICAgICAgICB9XHJcbiAgICAgIH0pXHJcbiAgICB9XHJcbiAgICBsaXN0S25vZGVDaGlsZCA9IFtdXHJcbiAgfVxyXG5cclxuICB0aGlzLnZkb20gPSBmdW5jdGlvbigpe1xyXG4gICAgdmFyIGVsZSA9IGdldElkKGN0eC5lbClcclxuICAgIGlmKGVsZSkgcmV0dXJuIGVsZVxyXG4gIH1cclxuXHJcbiAgdGhpcy5mbHVzaCA9IGZ1bmN0aW9uKGNvbXBvbmVudCl7XHJcbiAgICB2YXIgZWxlID0gZ2V0SWQoY29tcG9uZW50KSB8fCBnZXRJZChjdHguZWwpXHJcbiAgICBpZihlbGUpIGVsZS5pbm5lckhUTUwgPSAnJ1xyXG4gICAgcmV0dXJuIHRoaXNcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICogcmVuZGVyIGNvbXBvbmVudCB0byBET01cclxuICAqL1xyXG5cclxuICB0aGlzLnJlbmRlciA9IGZ1bmN0aW9uKCl7XHJcbiAgICB2YXIgZWxlID0gZ2V0SWQoY3R4LmVsKVxyXG4gICAgaWYoIWVsZSl7XHJcbiAgICAgIGNvbnNvbGUud2FybignZXJyb3I6IGNhbm5vdCBmaW5kIERPTSB3aXRoIGlkOiAnK2N0eC5lbCsnIHNraXAgcmVuZGVyaW5nLi4nKVxyXG4gICAgICByZXR1cm4gZmFsc2VcclxuICAgIH1cclxuICAgIGlmKGNvbnRleHQpIGN0eC5iYXNlID0gY29udGV4dFxyXG4gICAgdmFyIGVsQXJyID0gcGFyc2VTdHIoY3R4LmJhc2UsIHRydWUpXHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGVsQXJyLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIGVsZS5hcHBlbmRDaGlsZChlbEFycltpXSlcclxuXHJcbiAgICAgIGlmKGkgPT09IGVsQXJyLmxlbmd0aCAtIDEpe1xyXG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ19sb2FkZWQnLCB3aW5kb3cuX2xvYWRlZCAmJiB0eXBlb2Ygd2luZG93Ll9sb2FkZWQgPT09ICdmdW5jdGlvbicgPyB3aW5kb3cuX2xvYWRlZChjdHguZWwpIDogbnVsbCwgZmFsc2UpXHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgfVxyXG5cclxuICB0aGlzLnVwZGF0ZSA9IGZ1bmN0aW9uKGFwcE9iail7XHJcbiAgICB2YXIgZWxlID0gZ2V0SWQoY3R4LmVsKVxyXG4gICAgdmFyIGVsQXJyID0gcGFyc2VTdHIoYXBwT2JqLCB0cnVlKVxyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBlbEFyci5sZW5ndGg7IGkrKykge1xyXG4gICAgICBlbGUucmVwbGFjZUNoaWxkKGVsQXJyW2ldLCBlbGUuY2hpbGROb2Rlc1tpXSlcclxuICAgICAgaWYoaSA9PT0gZWxBcnIubGVuZ3RoIC0gMSl7XHJcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignX3VwZGF0ZScsIHdpbmRvdy5fdXBkYXRlICYmIHR5cGVvZiB3aW5kb3cuX3VwZGF0ZSA9PT0gJ2Z1bmN0aW9uJyA/IHdpbmRvdy5fdXBkYXRlKGN0eC5lbCkgOiBudWxsLCBmYWxzZSlcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgdmFyIHdhdGNoZXIgPSBmdW5jdGlvbihpbnN0YW5jZSwgaW5kZXgpe1xyXG4gICAgdmFyIG9iaiwgYXR0ciwgZWxlLCBjb3B5SW5zdGFuY2UsIG5ld0VsZW1cclxuICAgIGZvciAoYXR0ciBpbiBpbnN0YW5jZSl7XHJcbiAgICAgIGluc3RhbmNlLndhdGNoKGF0dHIsIGZ1bmN0aW9uKGlkeCwgbywgbikge1xyXG4gICAgICAgIGluc3RhbmNlLnVud2F0Y2goYXR0cilcclxuICAgICAgICBvYmogPSB7fVxyXG4gICAgICAgIG9ialtpZHhdID0gblxyXG4gICAgICAgIGVsZSA9IGdldElkKGN0eC5lbClcclxuICAgICAgICBpZihpZHggIT09ICdjbGljaycpe1xyXG4gICAgICAgICAgY29weUluc3RhbmNlID0gY29weShpbnN0YW5jZSlcclxuICAgICAgICAgIE9iamVjdC5hc3NpZ24oY29weUluc3RhbmNlLCBvYmopXHJcbiAgICAgICAgICBuZXdFbGVtID0gZ2VuRWxlbWVudChjb3B5SW5zdGFuY2UpXHJcbiAgICAgICAgICB1cGRhdGVFbGVtKGVsZS5jaGlsZE5vZGVzW2luZGV4XSwgbmV3RWxlbSlcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgZWxlLmNoaWxkTm9kZXNbaW5kZXhdLmNsaWNrKClcclxuICAgICAgICB9XHJcbiAgICAgICAgd2F0Y2hlcihpbnN0YW5jZSwgaW5kZXgpXHJcbiAgICAgIH0pXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICB2YXIgd2F0Y2hlcjIgPSBmdW5jdGlvbihpbnN0YW5jZSl7XHJcbiAgICB2YXIgb2JqLCBhdHRyLCBlbGUsIGNvcHlJbnN0YW5jZSwgbmV3RWxlbVxyXG4gICAgZm9yIChhdHRyIGluIGluc3RhbmNlKXtcclxuICAgICAgaW5zdGFuY2Uud2F0Y2goYXR0ciwgZnVuY3Rpb24oaWR4LCBvLCBuKSB7XHJcbiAgICAgICAgaW5zdGFuY2UudW53YXRjaChhdHRyKVxyXG4gICAgICAgIG9iaiA9IHt9XHJcbiAgICAgICAgb2JqW2lkeF0gPSBuXHJcbiAgICAgICAgZWxlID0gZ2V0SWQoY3R4LmVsKVxyXG4gICAgICAgIGlmKGlkeCAhPT0gJ2NsaWNrJyl7XHJcbiAgICAgICAgICBjb3B5SW5zdGFuY2UgPSBjb3B5KGluc3RhbmNlKVxyXG4gICAgICAgICAgT2JqZWN0LmFzc2lnbihjb3B5SW5zdGFuY2UsIG9iailcclxuICAgICAgICAgIG5ld0VsZW0gPSBnZW5FbGVtZW50KGNvcHlJbnN0YW5jZSlcclxuICAgICAgICAgIHVwZGF0ZUVsZW0oZWxlLCBuZXdFbGVtKVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBlbGUuY2xpY2soKVxyXG4gICAgICAgIH1cclxuICAgICAgICB3YXRjaGVyMihpbnN0YW5jZSlcclxuICAgICAgfSlcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHZhciB3YXRjaGVyMyA9IGZ1bmN0aW9uKGluc3RhbmNlKXtcclxuICAgIHZhciBwcmlzdGluZUxlbiA9IGNvcHkoaW5zdGFuY2UpLCBvcHNMaXN0LCBvcCwgcXVlcnlcclxuICAgIFxyXG4gICAgb3BzTGlzdCA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gWydwdXNoJywgJ3BvcCcsICdzaGlmdCcsICd1bnNoaWZ0JywgJ3NwbGljZScsICd1cGRhdGUnXSB9XHJcblxyXG4gICAgb3AgPSBvcHNMaXN0KClcclxuXHJcbiAgICBxdWVyeSA9IGZ1bmN0aW9uKG9wcywgYXJndnMpIHtcclxuICAgICAgb3AgPSBbXVxyXG4gICAgICBpZihvcHMgPT09ICdwdXNoJylcclxuICAgICAgICBhcnJQcm90b1B1c2goYXJndnNbMF0pXHJcbiAgICAgIGVsc2UgaWYob3BzID09PSAncG9wJylcclxuICAgICAgICBhcnJQcm90b1BvcCgpXHJcbiAgICAgIGVsc2UgaWYob3BzID09PSAnc2hpZnQnKVxyXG4gICAgICAgIGFyclByb3RvU2hpZnQoKVxyXG4gICAgICBlbHNlIGlmKG9wcyA9PT0gJ3Vuc2hpZnQnKVxyXG4gICAgICAgIGFyclByb3RvVW5TaGlmdC5hcHBseShudWxsLCBhcmd2cylcclxuICAgICAgZWxzZSBpZihvcHMgPT09ICdzcGxpY2UnKVxyXG4gICAgICAgIGFyclByb3RvU3BsaWNlLmFwcGx5KG51bGwsIGFyZ3ZzKVxyXG4gICAgICBlbHNlXHJcbiAgICAgICAgYXJyUHJvdG9VcGRhdGUuYXBwbHkobnVsbCwgYXJndnMpXHJcbiAgICAgIG9wID0gb3BzTGlzdCgpXHJcbiAgICAgIHByaXN0aW5lTGVuID0gY29weShpbnN0YW5jZSlcclxuICAgIH1cclxuXHJcbiAgICBvcC5mb3JFYWNoKGZ1bmN0aW9uKGYsIGksIHIpe1xyXG4gICAgICBpbnN0YW5jZVtmXSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGlmKG9wLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgIHZhciBmYXJndiA9IFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzKVxyXG4gICAgICAgICAgaWYoIXByaXN0aW5lTGVuW2Zhcmd2WzBdXSkgcmV0dXJuIGZhbHNlXHJcbiAgICAgICAgICBpZihmID09PSAndXBkYXRlJylcclxuICAgICAgICAgICAgZmFyZ3ZbMV0gPSBPYmplY3QuYXNzaWduKHByaXN0aW5lTGVuW2Zhcmd2WzBdXSwgZmFyZ3ZbMV0pXHJcbiAgICAgICAgICBBcnJheS5wcm90b3R5cGVbZl0uYXBwbHkodGhpcywgZmFyZ3YpXHJcbiAgICAgICAgICAvL3Byb3BhZ2F0ZSBzcGxpY2Ugd2l0aCBzaW5nbGUgYXJndW1lbnRzXHJcbiAgICAgICAgICBpZihmYXJndi5sZW5ndGggPT09IDEgJiYgZiA9PT0gJ3NwbGljZScpXHJcbiAgICAgICAgICAgIGZhcmd2LnB1c2gocHJpc3RpbmVMZW4ubGVuZ3RoIC0gZmFyZ3ZbMF0pXHJcbiAgICAgICAgICBxdWVyeShmLCBmYXJndilcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0pXHJcbiAgfVxyXG5cclxuICB2YXIgYXJyUHJvdG9QdXNoID0gZnVuY3Rpb24obmV3T2JqKXtcclxuICAgIHZhciBlbGUgPSBnZXRJZChjdHguZWwpXHJcbiAgICBlbGUuYXBwZW5kQ2hpbGQoZ2VuVGVtcGxhdGUobmV3T2JqKSlcclxuICB9XHJcblxyXG4gIHZhciBhcnJQcm90b1BvcCA9IGZ1bmN0aW9uKCl7XHJcbiAgICB2YXIgZWxlID0gZ2V0SWQoY3R4LmVsKVxyXG4gICAgaWYoZWxlLmNoaWxkTm9kZXMubGVuZ3RoKSB7XHJcbiAgICAgIGVsZS5yZW1vdmVDaGlsZChlbGUubGFzdENoaWxkKVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgdmFyIGFyclByb3RvU2hpZnQgPSBmdW5jdGlvbigpe1xyXG4gICAgdmFyIGVsZSA9IGdldElkKGN0eC5lbClcclxuICAgIGlmKGVsZS5jaGlsZE5vZGVzLmxlbmd0aCkge1xyXG4gICAgICBlbGUucmVtb3ZlQ2hpbGQoZWxlLmZpcnN0Q2hpbGQpXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICB2YXIgYXJyUHJvdG9VblNoaWZ0ID0gZnVuY3Rpb24oKXtcclxuICAgIHZhciBhcmd2ID0gW10uc2xpY2UuY2FsbChhcmd1bWVudHMpXHJcbiAgICB2YXIgZWxlID0gZ2V0SWQoY3R4LmVsKVxyXG4gICAgdmFyIGkgPSBhcmd2Lmxlbmd0aCAtIDFcclxuICAgIHdoaWxlKGkgPiAtMSkge1xyXG4gICAgICBlbGUuaW5zZXJ0QmVmb3JlKGdlblRlbXBsYXRlKGFyZ3ZbaV0pLCBlbGUuZmlyc3RDaGlsZClcclxuICAgICAgaS0tXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICB2YXIgYXJyUHJvdG9TcGxpY2UgPSBmdW5jdGlvbigpe1xyXG4gICAgdmFyIGVsZSA9IGdldElkKGN0eC5lbClcclxuICAgICwgICBjaGlsZExlblxyXG4gICAgLCAgIGxlblxyXG4gICAgLCAgIGlcclxuICAgICwgICBqXHJcbiAgICAsICAga1xyXG4gICAgLCAgIGNcclxuICAgICwgICB0ZW1wRGl2Q2hpbGRMZW5cclxuICAgICwgICB0ZW1wRGl2XHJcbiAgICAsICAgYXJndiA9IFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzKVxyXG4gICAgLCAgIHN0YXJ0ID0gW10uc2hpZnQuY2FsbChhcmd2KVxyXG4gICAgLCAgIGNvdW50XHJcbiAgICBpZih0eXBlb2YgYXJndlswXSA9PT0gJ251bWJlcicpe1xyXG4gICAgICBjb3VudCA9IFtdLnNoaWZ0LmNhbGwoYXJndilcclxuICAgIH1cclxuXHJcbiAgICB0ZW1wRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcclxuICAgIGlmKGFyZ3YubGVuZ3RoKXtcclxuICAgICAgaSA9IDBcclxuICAgICAgd2hpbGUoaSA8IGFyZ3YubGVuZ3RoKXtcclxuICAgICAgICB0ZW1wRGl2LmFwcGVuZENoaWxkKGdlblRlbXBsYXRlKGFyZ3ZbaV0pKVxyXG4gICAgICAgIGkrK1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgY2hpbGRMZW4gPSBjb3B5KGVsZS5jaGlsZE5vZGVzLmxlbmd0aClcclxuICAgIHRlbXBEaXZDaGlsZExlbiA9IGNvcHkodGVtcERpdi5jaGlsZE5vZGVzLmxlbmd0aClcclxuICAgIGlmIChjb3VudCAmJiBjb3VudCA+IDApIHtcclxuICAgICAgZm9yIChpID0gc3RhcnQ7IGkgPCBjaGlsZExlbiArIDE7IGkrKykge1xyXG4gICAgICAgIGxlbiA9IHN0YXJ0ICsgY291bnRcclxuICAgICAgICBpZiAoaSA8IGxlbikge1xyXG4gICAgICAgICAgZWxlLnJlbW92ZUNoaWxkKGVsZS5jaGlsZE5vZGVzW3N0YXJ0XSlcclxuICAgICAgICAgIGlmIChpID09PSBsZW4gLSAxICYmIHRlbXBEaXZDaGlsZExlbiA+IDApIHtcclxuICAgICAgICAgICAgYyA9IHN0YXJ0IC0gMVxyXG4gICAgICAgICAgICBmb3IgKGogPSBzdGFydDsgaiA8IHRlbXBEaXZDaGlsZExlbiArIHN0YXJ0OyBqKyspIHtcclxuICAgICAgICAgICAgICBpbnNlcnRBZnRlcih0ZW1wRGl2LmNoaWxkTm9kZXNbMF0sIGVsZS5jaGlsZE5vZGVzW2NdLCBlbGUpXHJcbiAgICAgICAgICAgICAgYysrXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSBpZiAoYXJndi5sZW5ndGgpIHtcclxuICAgICAgYyA9IHN0YXJ0IC0gMVxyXG4gICAgICBmb3IgKGsgPSBzdGFydDsgayA8IHRlbXBEaXZDaGlsZExlbiArIHN0YXJ0OyBrKyspIHtcclxuICAgICAgICBpbnNlcnRBZnRlcih0ZW1wRGl2LmNoaWxkTm9kZXNbMF0sIGVsZS5jaGlsZE5vZGVzW2NdLCBlbGUpXHJcbiAgICAgICAgYysrXHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIHZhciBhcnJQcm90b1VwZGF0ZSA9IGZ1bmN0aW9uKCl7XHJcbiAgICB2YXIgYXJndiA9IFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzKVxyXG4gICAgLCAgIGVsZSA9IGdldElkKGN0eC5lbClcclxuICAgICwgICBpbmRleCA9IFtdLnNoaWZ0LmNhbGwoYXJndilcclxuICAgIHVwZGF0ZUVsZW0oZWxlLmNoaWxkTm9kZXNbaW5kZXhdLCBnZW5UZW1wbGF0ZShhcmd2WzBdKSlcclxuICB9XHJcblxyXG4gIHZhciBnZW5UZW1wbGF0ZSA9IGZ1bmN0aW9uKG9iail7XHJcbiAgICB2YXIgYXJyUHJvcHMgPSBjdHguYmFzZS50ZW1wbGF0ZS5tYXRjaCgve3soW157fV0rKX19L2csICckMScpLCAgdG1wbCwgdGVtcERpdiwgZWxlXHJcbiAgICB0bXBsID0gY3R4LmJhc2UudGVtcGxhdGVcclxuICAgIGFyclByb3BzLmZvckVhY2goZnVuY3Rpb24ocykge1xyXG4gICAgICB2YXIgcmVwID0gcy5yZXBsYWNlKC97eyhbXnt9XSspfX0vZywgJyQxJylcclxuICAgICAgdG1wbCA9IHRtcGwucmVwbGFjZSgve3soW157fV0rKX19Lywgb2JqW3JlcF0pXHJcbiAgICB9KVxyXG4gICAgdGVtcERpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXHJcbiAgICB0ZW1wRGl2LmlubmVySFRNTCA9IHRtcGxcclxuICAgIHJldHVybiB0ZW1wRGl2LmNoaWxkTm9kZXNbMF1cclxuICB9XHJcblxyXG4gIHZhciBsb29wQ2hpbGRzID0gZnVuY3Rpb24oYXJyLCBlbGVtKSB7XHJcbiAgICBmb3IgKHZhciBjaGlsZCA9IGVsZW0uZmlyc3RDaGlsZDsgY2hpbGQgIT09IG51bGw7IGNoaWxkID0gY2hpbGQubmV4dFNpYmxpbmcpIHtcclxuICAgICAgYXJyLnB1c2goY2hpbGQpXHJcbiAgICAgIGlmIChjaGlsZC5oYXNDaGlsZE5vZGVzKCkpIHtcclxuICAgICAgICBsb29wQ2hpbGRzKGFyciwgY2hpbGQpXHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIHZhciBpbnNlcnRBZnRlciA9IGZ1bmN0aW9uKG5ld05vZGUsIHJlZmVyZW5jZU5vZGUsIHBhcmVudE5vZGUpIHtcclxuICAgIHJlZmVyZW5jZU5vZGUucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUobmV3Tm9kZSwgcmVmZXJlbmNlTm9kZS5uZXh0U2libGluZylcclxuICB9XHJcblxyXG4gIHZhciBub2RlVXBkYXRlID0gZnVuY3Rpb24obmV3Tm9kZSwgb2xkTm9kZSkge1xyXG4gICAgaWYoIW5ld05vZGUpIHJldHVybiBmYWxzZVxyXG4gICAgdmFyIG9BdHRyID0gbmV3Tm9kZS5hdHRyaWJ1dGVzXHJcbiAgICB2YXIgb3V0cHV0ID0ge307XHJcblxyXG4gICAgZm9yKHZhciBpID0gb0F0dHIubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcclxuICAgICAgIG91dHB1dFtvQXR0cltpXS5uYW1lXSA9IG9BdHRyW2ldLnZhbHVlXHJcbiAgICB9XHJcbiAgICBmb3IgKHZhciBpQXR0ciBpbiBvdXRwdXQpIHtcclxuICAgICAgaWYob2xkTm9kZS5hdHRyaWJ1dGVzW2lBdHRyXSAmJiBvbGROb2RlLmF0dHJpYnV0ZXNbaUF0dHJdLm5hbWUgPT09IGlBdHRyICYmIG9sZE5vZGUuYXR0cmlidXRlc1tpQXR0cl0udmFsdWUgIT0gb3V0cHV0W2lBdHRyXSl7XHJcbiAgICAgICAgaWYoaUF0dHIgPT09ICdjbGljaycpIG9sZE5vZGUuY2xpY2soKVxyXG4gICAgICAgIGVsc2Ugb2xkTm9kZS5zZXRBdHRyaWJ1dGUoaUF0dHIsIG91dHB1dFtpQXR0cl0pXHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIGlmKG9sZE5vZGUudGV4dENvbnRlbnQgID09PSBcIlwiICYmIG5ld05vZGUudGV4dENvbnRlbnQgKXtcclxuICAgICAgb2xkTm9kZS50ZXh0Q29udGVudCA9IG5ld05vZGUudGV4dENvbnRlbnRcclxuICAgIH1cclxuICAgIG91dHB1dCA9IHt9XHJcbiAgfVxyXG5cclxuICB2YXIgbm9kZVVwZGF0ZUhUTUwgPSBmdW5jdGlvbihuZXdOb2RlLCBvbGROb2RlKSB7XHJcbiAgICBpZighbmV3Tm9kZSkgcmV0dXJuIGZhbHNlXHJcbiAgICBpZihuZXdOb2RlLm5vZGVWYWx1ZSAhPT0gb2xkTm9kZS5ub2RlVmFsdWUpXHJcbiAgICAgICAgb2xkTm9kZS5ub2RlVmFsdWUgPSBuZXdOb2RlLm5vZGVWYWx1ZVxyXG4gIH1cclxuXHJcbiAgdmFyIHVwZGF0ZUVsZW0gPSBmdW5jdGlvbihvbGRFbGVtLCBuZXdFbGVtKXtcclxuICAgIHZhciBvbGRBcnIgPSBbXSwgbmV3QXJyID0gW11cclxuICAgIG9sZEFyci5wdXNoKG9sZEVsZW0pXHJcbiAgICBuZXdBcnIucHVzaChuZXdFbGVtKVxyXG4gICAgbG9vcENoaWxkcyhvbGRBcnIsIG9sZEVsZW0pXHJcbiAgICBsb29wQ2hpbGRzKG5ld0FyciwgbmV3RWxlbSlcclxuICAgIG9sZEFyci5mb3JFYWNoKGZ1bmN0aW9uKGVsZSwgaWR4LCBhcnIpIHtcclxuICAgICAgaWYgKGVsZS5ub2RlVHlwZSA9PT0gMSAmJiBlbGUuaGFzQXR0cmlidXRlcygpKSB7XHJcbiAgICAgICAgbm9kZVVwZGF0ZShuZXdBcnJbaWR4XSwgZWxlKVxyXG4gICAgICB9IGVsc2UgaWYgKGVsZS5ub2RlVHlwZSA9PT0gMykge1xyXG4gICAgICAgIG5vZGVVcGRhdGVIVE1MKG5ld0FycltpZHhdLCBlbGUpXHJcbiAgICAgIH1cclxuICAgICAgaWYoaWR4ID09PSBhcnIubGVuZ3RoIC0gMSl7XHJcbiAgICAgICAgb2xkQXJyLnNwbGljZSgwKVxyXG4gICAgICAgIG5ld0Fyci5zcGxpY2UoMClcclxuICAgICAgfVxyXG4gICAgfSlcclxuICB9XHJcbiAgXHJcbiAgaWYgKCFPYmplY3QucHJvdG90eXBlLndhdGNoKSB7XHJcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoT2JqZWN0LnByb3RvdHlwZSwgJ3dhdGNoJywge1xyXG4gICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcclxuICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxyXG4gICAgICB3cml0YWJsZTogZmFsc2UsXHJcbiAgICAgIHZhbHVlOiBmdW5jdGlvbihwcm9wLCBoYW5kbGVyKSB7XHJcbiAgICAgICAgdmFyIG9sZHZhbCA9IHRoaXNbcHJvcF0sXHJcbiAgICAgICAgICBuZXd2YWwgPSBvbGR2YWwsXHJcbiAgICAgICAgICBnZXR0ZXIgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgcmV0dXJuIG5ld3ZhbFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIHNldHRlciA9IGZ1bmN0aW9uKHZhbCkge1xyXG4gICAgICAgICAgICBvbGR2YWwgPSBuZXd2YWxcclxuICAgICAgICAgICAgcmV0dXJuIG5ld3ZhbCA9IGhhbmRsZXIuY2FsbCh0aGlzLCBwcm9wLCBvbGR2YWwsIHZhbClcclxuICAgICAgICAgIH1cclxuICAgICAgICBpZiAoZGVsZXRlIHRoaXNbcHJvcF0pIHtcclxuICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCBwcm9wLCB7XHJcbiAgICAgICAgICAgIGdldDogZ2V0dGVyLFxyXG4gICAgICAgICAgICBzZXQ6IHNldHRlcixcclxuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSlcclxuICB9XHJcblxyXG4gIGlmICghT2JqZWN0LnByb3RvdHlwZS51bndhdGNoKSB7XHJcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoT2JqZWN0LnByb3RvdHlwZSwgJ3Vud2F0Y2gnLCB7XHJcbiAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxyXG4gICAgICBjb25maWd1cmFibGU6IHRydWUsXHJcbiAgICAgIHdyaXRhYmxlOiBmYWxzZSxcclxuICAgICAgdmFsdWU6IGZ1bmN0aW9uKHByb3ApIHtcclxuICAgICAgICB2YXIgdmFsID0gdGhpc1twcm9wXSBcclxuICAgICAgICBkZWxldGUgdGhpc1twcm9wXSBcclxuICAgICAgICB0aGlzW3Byb3BdID0gdmFsXHJcbiAgICAgIH1cclxuICAgIH0pXHJcbiAgfVxyXG5cclxuICBpZighQXJyYXkucHJvdG90eXBlLnVwZGF0ZSl7XHJcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoQXJyYXkucHJvdG90eXBlLCAndXBkYXRlJywge1xyXG4gICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxyXG4gICAgICAgIHdyaXRhYmxlOiB0cnVlLFxyXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbihpbmRleCwgdmFsdWUpIHsgXHJcbiAgICAgICAgICB0aGlzW2luZGV4XSA9IHZhbHVlXHJcbiAgICAgICAgfVxyXG4gICAgfSlcclxuICB9XHJcbn1cclxuXHJcbktlZXQucHJvdG90eXBlLmxpbmsgPSBmdW5jdGlvbihpZCwgdmFsdWUpIHtcclxuICB2YXIgYXJndiA9IFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzKVxyXG5cclxuICB0aGlzLmVsID0gYXJndlswXVxyXG4gIGlmIChhcmd2Lmxlbmd0aCA9PT0gMil7XHJcbiAgICBpZighYXJndlsxXS50YWcpe1xyXG4gICAgICBhcmd2WzFdLnRhZyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKS50YWdOYW1lLnRvTG93ZXJDYXNlKClcclxuICAgIH1cclxuICAgIHRoaXMuYmFzZSA9IGFyZ3ZbMV1cclxuICB9XHJcbiAgdGhpcy5yZW5kZXIoKVxyXG4gIHJldHVybiB0aGlzXHJcbn1cclxuXHJcbktlZXQucHJvdG90eXBlLmNvbXBvc2UgPSBmdW5jdGlvbihpbnN0YW5jZSkge1xyXG4gIHRoaXMudXBkYXRlKGluc3RhbmNlKVxyXG4gIHJldHVybiB0aGlzXHJcbn1cclxuXHJcbktlZXQucHJvdG90eXBlLm1vdW50ID0gZnVuY3Rpb24oaW5zdGFuY2UpIHtcclxuICB0aGlzLmJhc2UgPSBpbnN0YW5jZVxyXG4gIHJldHVybiB0aGlzXHJcbn1cclxuXHJcbktlZXQucHJvdG90eXBlLmNsdXN0ZXIgPSBmdW5jdGlvbigpIHtcclxuICB2YXIgYXJncyA9IFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzKVxyXG4gIGFyZ3MubWFwKGZ1bmN0aW9uKGZuKXtcclxuICAgIGlmKHR5cGVvZiBmbiA9PT0gJ2Z1bmN0aW9uJykgZm4oKVxyXG4gIH0pXHJcbiAgcmV0dXJuIHRoaXNcclxufVxyXG5cclxuS2VldC5wcm90b3R5cGUubGlzdCA9IGZ1bmN0aW9uKCl7XHJcbiAgcmV0dXJuIHRoaXMuYmFzZSAmJiB0aGlzLmJhc2UubGlzdCB8fCBbXVxyXG59XHJcblxyXG5LZWV0LnByb3RvdHlwZS5nZXRCYXNlID0gZnVuY3Rpb24oY2hpbGQsIGF0dHJpYnV0ZSwgbmV3UHJvcCkge1xyXG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMiAmJiB0aGlzLmJhc2UpXHJcbiAgICB0aGlzLmJhc2VbY2hpbGRdW2F0dHJpYnV0ZV0gPSBuZXdQcm9wXHJcbiAgZWxzZVxyXG4gICAgcmV0dXJuIHRoaXMuYmFzZVtjaGlsZF1bYXR0cmlidXRlXVxyXG59XHJcblxyXG5LZWV0LnByb3RvdHlwZS5hZGRDbGFzcyA9IGZ1bmN0aW9uKGNoaWxkLCBuZXdDbGFzcykge1xyXG4gIHZhciBiID0gdGhpcy5nZXRCYXNlKGNoaWxkLCAnY2xhc3MnKVxyXG5cclxuICB2YXIgaXNBcnIgPSBmdW5jdGlvbigpIHtcclxuICAgIGIucHVzaChuZXdDbGFzcylcclxuICAgIHRoaXMuZ2V0QmFzZShjaGlsZCwgJ2NsYXNzJywgYilcclxuICB9XHJcblxyXG4gIHJldHVybiBBcnJheS5pc0FycmF5KGIpICYmIGlzQXJyKClcclxufVxyXG5cclxuS2VldC5wcm90b3R5cGUucmVtb3ZlQ2xhc3MgPSBmdW5jdGlvbihjaGlsZCwgb2xkQ2xhc3MpIHtcclxuICB2YXIgYiA9IHRoaXMuZ2V0QmFzZShjaGlsZCwgJ2NsYXNzJylcclxuXHJcbiAgdmFyIGhJZHggPSBmdW5jdGlvbihpZHgpIHtcclxuICAgIGIuc3BsaWNlKGlkeCwgMSlcclxuICAgIHRoaXMuZ2V0QmFzZShjaGlsZCwgJ2NsYXNzJywgYilcclxuICB9XHJcblxyXG4gIHZhciBpc0FyciA9IGZ1bmN0aW9uKCkge1xyXG4gICAgdmFyIGlkeCA9IGIuaW5kZXhPZihvbGRDbGFzcylcclxuICAgIGlmICh+aWR4KSBoSWR4KGlkeClcclxuICB9XHJcblxyXG4gIHJldHVybiBBcnJheS5pc0FycmF5KGIpICYmIGlzQXJyKClcclxufVxyXG5cclxuS2VldC5wcm90b3R5cGUuc3dhcENsYXNzID0gZnVuY3Rpb24oY2hpbGQsIGNvbmRpdGlvbiwgY2xhc3Nlc0FycmF5KSB7XHJcbiAgdmFyIGIgPSB0aGlzLmdldEJhc2UoY2hpbGQsICdjbGFzcycpXHJcblxyXG4gIGlmIChjb25kaXRpb24pIGNsYXNzZXNBcnJheS5yZXZlcnNlKClcclxuXHJcbiAgdmFyIGhJZHggPSBmdW5jdGlvbihpZHgpIHtcclxuICAgIGIuc3BsaWNlKGlkeCwgMSwgY2xhc3Nlc0FycmF5WzFdKVxyXG4gICAgdGhpcy5nZXRCYXNlKGNoaWxkLCAnY2xhc3MnLCBiKVxyXG4gIH1cclxuXHJcbiAgdmFyIGlzQXJyID0gZnVuY3Rpb24oKSB7XHJcbiAgICB2YXIgaWR4ID0gYi5pbmRleE9mKGNsYXNzZXNBcnJheVswXSlcclxuICAgIGlmICh+aWR4KSBoSWR4KGlkeClcclxuICB9XHJcblxyXG4gIHJldHVybiBBcnJheS5pc0FycmF5KGIpICYmIGlzQXJyKClcclxufVxyXG5cclxuS2VldC5wcm90b3R5cGUuc3dhcEF0dHIgPSBmdW5jdGlvbihjaGlsZCwgY29uZGl0aW9uLCBwcm9wZXJ0eUFycmF5LCBhdHRyaWJ1dGUpIHtcclxuICBpZiAoY29uZGl0aW9uKSBwcm9wZXJ0eUFycmF5LnJldmVyc2UoKVxyXG4gIHRoaXMuZ2V0QmFzZShjaGlsZCwgYXR0cmlidXRlLCBwcm9wZXJ0eUFycmF5WzBdKVxyXG59XHJcblxyXG5LZWV0LnByb3RvdHlwZS5zZXRBdHRyID0gZnVuY3Rpb24oY2hpbGQsIGF0dHJpYnV0ZSwgbmV3UHJvcGVydHkpIHtcclxuICB0aGlzLmdldEJhc2UoY2hpbGQsIGF0dHJpYnV0ZSwgbmV3UHJvcGVydHkpXHJcbn1cclxuXHJcbktlZXQucHJvdG90eXBlLnRvZ2dsZSA9IGZ1bmN0aW9uKGNoaWxkLCBkaXNwbGF5KSB7XHJcbiAgdmFyIHN0eWwgPSB0aGlzLmJhc2VbY2hpbGRdLnN0eWxlXHJcbiAgT2JqZWN0LmFzc2lnbihzdHlsLCB7IGRpc3BsYXk6IGRpc3BsYXkgfSlcclxuICB0aGlzLmJhc2VbY2hpbGRdLnN0eWxlID0gc3R5bFxyXG59XHJcblxyXG5LZWV0LnByb3RvdHlwZS5jb250ZW50VXBkYXRlID0gZnVuY3Rpb24oY2hpbGQsIGNvbnRlbnQpIHtcclxuICB0aGlzLmJhc2VbY2hpbGRdLnRlbXBsYXRlID0gY29udGVudFxyXG59IiwidmFyIHRhZyA9IGZ1bmN0aW9uKCkge1xyXG4gIGZ1bmN0aW9uIGt0YWcodGFnLCB2YWx1ZSwgYXR0cmlidXRlcywgc3R5bGVzKSB7XHJcbiAgICB2YXIgYXR0ciwgaWR4LCB0ZSwgYSA9IFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzKSxcclxuICAgICAgcmV0ID0gWyc8JywgYVswXSwgJz4nLCBhWzFdLCAnPC8nLCBhWzBdLCAnPiddXHJcbiAgICBpZiAoYS5sZW5ndGggPiAyICYmIHR5cGVvZiBhWzJdID09PSAnb2JqZWN0Jykge1xyXG4gICAgICBmb3IgKGF0dHIgaW4gYVsyXSkge1xyXG4gICAgICAgIGlmKHR5cGVvZiBhWzJdW2F0dHJdID09PSAnYm9vbGVhbicgJiYgYVsyXVthdHRyXSlcclxuICAgICAgICAgIHJldC5zcGxpY2UoMiwgMCwgJyAnLCBhdHRyKVxyXG4gICAgICAgIGVsc2UgaWYoYXR0ciA9PT0gJ2NsYXNzJyAmJiBBcnJheS5pc0FycmF5KGFbMl1bYXR0cl0pKVxyXG4gICAgICAgICAgcmV0LnNwbGljZSgyLCAwLCAnICcsIGF0dHIsICc9XCInLCBhWzJdW2F0dHJdLmpvaW4oJyAnKS50cmltKCksICdcIicpXHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgcmV0LnNwbGljZSgyLCAwLCAnICcsIGF0dHIsICc9XCInLCBhWzJdW2F0dHJdLCAnXCInKVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBpZiAoYS5sZW5ndGggPiAzICYmIHR5cGVvZiBhWzNdID09PSAnb2JqZWN0Jykge1xyXG4gICAgICBpZHggPSByZXQuaW5kZXhPZignPicpXHJcbiAgICAgIGlmICh+aWR4KSB7XHJcbiAgICAgICAgdGUgPSBbaWR4LCAwLCAnIHN0eWxlPVwiJ11cclxuICAgICAgICBmb3IgKGF0dHIgaW4gYVszXSkge1xyXG4gICAgICAgICAgdGUucHVzaChhdHRyKVxyXG4gICAgICAgICAgdGUucHVzaCgnOicpXHJcbiAgICAgICAgICB0ZS5wdXNoKGFbM11bYXR0cl0pXHJcbiAgICAgICAgICB0ZS5wdXNoKCc7JylcclxuICAgICAgICB9XHJcbiAgICAgICAgdGUucHVzaCgnXCInKVxyXG4gICAgICAgIHJldC5zcGxpY2UuYXBwbHkocmV0LCB0ZSlcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJldFxyXG4gIH1cclxuICB2YXIgYXJncyA9IFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzKSxcclxuICAgIGFyciA9IGt0YWcuYXBwbHkobnVsbCwgYXJncylcclxuICByZXR1cm4gYXJyLmpvaW4oJycpXHJcbn1cclxuXHJcbmlmICh0eXBlb2YgZXhwb3J0cyAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuICBpZiAodHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgJiYgbW9kdWxlLmV4cG9ydHMpIHtcclxuICAgIGV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IHRhZ1xyXG4gIH1cclxuICBleHBvcnRzLnRhZyA9IHRhZ1xyXG59Il19
