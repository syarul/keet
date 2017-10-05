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
      listKnodeChild.forEach(function(c, i) {
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
    var ele = getId(component)
    if(ele) ele.innerHTML = ''
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJjYXQuanMiLCJjb3B5LmpzIiwiaW5kZXguanMiLCJ0YWcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BtQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgY2F0ID0gZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gW10uc2xpY2UuY2FsbChhcmd1bWVudHMpLmpvaW4oJycpXHJcbiAgfVxyXG5cclxuaWYgKHR5cGVvZiBleHBvcnRzICE9PSAndW5kZWZpbmVkJykge1xyXG4gIGlmICh0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyAmJiBtb2R1bGUuZXhwb3J0cykge1xyXG4gICAgZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gY2F0XHJcbiAgfVxyXG4gIGV4cG9ydHMuY2F0ID0gY2F0XHJcbn0iLCJ2YXIgY29weSA9IGZ1bmN0aW9uKGFyZ3YpIHtcclxuICB2YXIgY2xvbmUgPSBmdW5jdGlvbih2KSB7XHJcbiAgICB2YXIgbyA9IHt9XHJcbiAgICBpZih0eXBlb2YgdiAhPT0gJ29iamVjdCcpe1xyXG4gICAgICBvLmNvcHkgPSB2XHJcbiAgICAgIHJldHVybiBvLmNvcHlcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGZvcih2YXIgYXR0ciBpbiB2KXtcclxuICAgICAgICBvW2F0dHJdID0gdlthdHRyXVxyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBvXHJcbiAgICB9XHJcbiAgfVxyXG4gIHJldHVybiBBcnJheS5pc0FycmF5KGFyZ3YpID8gYXJndi5tYXAoZnVuY3Rpb24odikge1xyXG4gICAgcmV0dXJuIHZcclxuICB9KSA6IGNsb25lKGFyZ3YpXHJcbn1cclxuXHJcbmlmICh0eXBlb2YgZXhwb3J0cyAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuICBpZiAodHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgJiYgbW9kdWxlLmV4cG9ydHMpIHtcclxuICAgIGV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IGNvcHlcclxuICB9XHJcbiAgZXhwb3J0cy5jb3B5ID0gY29weVxyXG59IiwiLyoqIFxyXG4gKiBLZWV0LmpzIHYyLjAuOCBBbHBoYSByZWxlYXNlOiBodHRwczovL2dpdGh1Yi5jb20vc3lhcnVsL2tlZXRcclxuICogYW4gQVBJIGZvciB3ZWIgYXBwbGljYXRpb25cclxuICpcclxuICogPDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8IEtlZXQuanMgPj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+XHJcbiAqXHJcbiAqIENvcHlyaWdodCAyMDE3LCBTaGFocnVsIE5pemFtIFNlbGFtYXRcclxuICogUmVsZWFzZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlLlxyXG4gKi9cclxuJ3VzZSBzdHJpY3QnXHJcbnZhciBjYXQgPSByZXF1aXJlKCcuL2NhdCcpXHJcbnZhciBjb3B5ID0gcmVxdWlyZSgnLi9jb3B5JylcclxudmFyIHRhZyA9IHJlcXVpcmUoJy4vdGFnJylcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gS2VldFxyXG5cclxuZnVuY3Rpb24gS2VldCh0YWdOYW1lLCBjb250ZXh0KSB7XHJcbiAgdmFyIGN0eCA9IHRoaXNcclxuICAsICAgYXJndiA9IFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzKVxyXG4gICwgICBjb250ZXh0ID0gYXJndi5maWx0ZXIoZnVuY3Rpb24oYykgeyByZXR1cm4gdHlwZW9mIGMgPT09ICdvYmplY3QnfSlbMF1cclxuICAsICAgaXNEb2MgPSAoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIHR5cGVvZiBkb2N1bWVudCA9PSAnb2JqZWN0JyA/IHRydWUgOiBmYWxzZVxyXG4gICAgICB9KCkpXHJcbiAgLCAgIGdldElkID0gZnVuY3Rpb24oaWQpIHtcclxuICAgICAgICB2YXIgcmV0ICAgICAgICBcclxuICAgICAgICBpZiAoaXNEb2MpIHtcclxuICAgICAgICAgICAgcmV0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhyb3cgKCdOb3QgYSBkb2N1bWVudCBvYmplY3QgbW9kZWwuJylcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJldFxyXG4gICAgICB9XHJcbiAgLCAgIHRlc3RFdmFsID0gZnVuY3Rpb24oZXYpIHtcclxuICAgICAgICB0cnkgeyByZXR1cm4gZXZhbChldikgfSBcclxuICAgICAgICBjYXRjaCAoZSkgeyByZXR1cm4gZmFsc2UgfVxyXG4gICAgICB9XHJcbiAgLCAgIGNhbWVsQ2FzZSA9IGZ1bmN0aW9uKHMpIHtcclxuICAgICAgICB2YXIgcnggPSAvXFwtKFthLXpdKS9nXHJcbiAgICAgICAgcmV0dXJuIHMucmVwbGFjZShyeCwgZnVuY3Rpb24oYSwgYikge1xyXG4gICAgICAgICAgcmV0dXJuIGIudG9VcHBlckNhc2UoKVxyXG4gICAgICAgIH0pXHJcbiAgICAgIH1cclxuICAsICAgZ3VpZCA9IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgcmV0dXJuIChNYXRoLnJvdW5kKE1hdGgucmFuZG9tKCkqMHgxMDAwMDAwKSkudG9TdHJpbmcoMzIpXHJcbiAgICAgIH1cclxuICAsICAgZ2VuRWxlbWVudCA9IGZ1bmN0aW9uKGNoaWxkKXtcclxuICAgICAgICB2YXIgdGVtcERpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXHJcbiAgICAgICAgdmFyIGNsb25lQ2hpbGQgPSBjb3B5KGNoaWxkKVxyXG4gICAgICAgIGRlbGV0ZSBjbG9uZUNoaWxkLnRlbXBsYXRlXHJcbiAgICAgICAgZGVsZXRlIGNsb25lQ2hpbGQudGFnXHJcbiAgICAgICAgZGVsZXRlIGNsb25lQ2hpbGQuY2xpY2tcclxuICAgICAgICBkZWxldGUgY2xvbmVDaGlsZC5zdHlsZVxyXG4gICAgICAgIGRlbGV0ZSBjbG9uZUNoaWxkLl9fcmVmX19cclxuICAgICAgICBmb3IodmFyIGF0dHIgaW4gY2xvbmVDaGlsZCl7XHJcbiAgICAgICAgICBpZih0eXBlb2YgY2xvbmVDaGlsZFthdHRyXSA9PT0gJ2Z1bmN0aW9uJyl7XHJcbiAgICAgICAgICAgIGRlbGV0ZSBjbG9uZUNoaWxkW2F0dHJdXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBzID0gdGFnKGNoaWxkLnRhZywgY2hpbGQudGVtcGxhdGUgPyBjaGlsZC50ZW1wbGF0ZSA6ICcnLCBjbG9uZUNoaWxkLCBjaGlsZC5zdHlsZSlcclxuICAgICAgICB0ZW1wRGl2LmlubmVySFRNTCA9IHNcclxuICAgICAgICBpZihjaGlsZC50YWcgPT09ICdpbnB1dCcpe1xyXG4gICAgICAgICAgaWYgKGNoaWxkLmNsaWNrKSB0ZW1wRGl2LmNoaWxkTm9kZXNbMF0uY2xpY2soKVxyXG4gICAgICAgICAgaWYgKGNoaWxkLmNoZWNrZWQpIHRlbXBEaXYuY2hpbGROb2Rlc1swXS5jaGVja2VkID0gJ2NoZWNrZWQnXHJcbiAgICAgICAgICBlbHNlIGlmKGNoaWxkLmNoZWNrZWQgPT09IGZhbHNlKVxyXG4gICAgICAgICAgICB0ZW1wRGl2LmNoaWxkTm9kZXNbMF0uY2hlY2tlZCA9IGZhbHNlXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb2Nlc3NfZXZlbnQodGVtcERpdilcclxuICAgICAgICByZXR1cm4gdGVtcERpdi5jaGlsZE5vZGVzWzBdXHJcbiAgICAgIH1cclxuICAsICAgcGFyc2VTdHIgPSBmdW5jdGlvbihhcHBPYmosIHdhdGNoKXtcclxuICAgICAgICB2YXIgc3RyID0gYXBwT2JqLnRlbXBsYXRlID8gYXBwT2JqLnRlbXBsYXRlIDogJydcclxuICAgICAgICAsICAgY2hpbGRzID0gc3RyLm1hdGNoKC97eyhbXnt9XSspfX0vZywgJyQxJylcclxuICAgICAgICAsICAgcmVnY1xyXG4gICAgICAgICwgICBjaGlsZFxyXG4gICAgICAgICwgICB0ZW1wRGl2XHJcbiAgICAgICAgLCAgIGVsZW1BcnIgPSBbXVxyXG4gICAgICAgIGlmKGNoaWxkcyl7XHJcblxyXG4gICAgICAgICAgaWYoQXJyYXkuaXNBcnJheShhcHBPYmoubGlzdCkpIHtcclxuICAgICAgICAgICAgICB2YXIgYXJyUHJvcHMgPSBzdHIubWF0Y2goL3t7KFtee31dKyl9fS9nLCAnJDEnKSwgdG1wbFN0ciA9ICcnLCB0bXBsXHJcbiAgICAgICAgICAgICAgYXBwT2JqLmxpc3QuZm9yRWFjaChmdW5jdGlvbihyKSB7XHJcbiAgICAgICAgICAgICAgICB0bXBsID0gc3RyXHJcbiAgICAgICAgICAgICAgICBhcnJQcm9wcy5mb3JFYWNoKGZ1bmN0aW9uKHMpIHtcclxuICAgICAgICAgICAgICAgICAgdmFyIHJlcCA9IHMucmVwbGFjZSgve3soW157fV0rKX19L2csICckMScpXHJcbiAgICAgICAgICAgICAgICAgIHRtcGwgPSB0bXBsLnJlcGxhY2UoL3t7KFtee31dKyl9fS8sIHJbcmVwXSlcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICB0ZW1wRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcclxuICAgICAgICAgICAgICAgIHRlbXBEaXYuaW5uZXJIVE1MID0gdG1wbFxyXG4gICAgICAgICAgICAgICAgcHJvY2Vzc19ldmVudCh0ZW1wRGl2KVxyXG4gICAgICAgICAgICAgICAgZWxlbUFyci5wdXNoKHRlbXBEaXYuY2hpbGROb2Rlc1swXSlcclxuICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgIHdhdGNoZXIzKGFwcE9iai5saXN0KVxyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY2hpbGRzLmZvckVhY2goZnVuY3Rpb24oYywgaW5kZXgpe1xyXG4gICAgICAgICAgICAgIHJlZ2MgPSBjLnJlcGxhY2UoL3t7KFtee31dKyl9fS9nLCAnJDEnKVxyXG4gICAgICAgICAgICAgIC8vIHNraXAgdGFncyB3aGljaCBub3QgYmVpbmcgZGVjbGFyZWQgeWV0XHJcbiAgICAgICAgICAgICAgaWYoY29udGV4dCl7XHJcbiAgICAgICAgICAgICAgICAvLyBjaGVjayBjbG9zdXJlIG9iamVjdFxyXG4gICAgICAgICAgICAgICAgY2hpbGQgPSBjb250ZXh0W3JlZ2NdID8gY29udGV4dFtyZWdjXSA6IGZhbHNlXHJcbiAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIC8vIGNoZWNrIGlmIGN1cnJlbnQgIG9iamVjdHIgaGFzIHByb3BcclxuICAgICAgICAgICAgICAgIGNoaWxkID0gYXBwT2JqW3JlZ2NdXHJcbiAgICAgICAgICAgICAgICAvLyBjaGVjayBnbG9iYWwgb2JqZWN0XHJcbiAgICAgICAgICAgICAgICBpZighY2hpbGQpIGNoaWxkID0gdGVzdEV2YWwocmVnYykgPyBldmFsKHJlZ2MpIDogZmFsc2VcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgaWYoY2hpbGQgJiYgdHlwZW9mIGNoaWxkID09PSAnb2JqZWN0Jyl7XHJcbiAgICAgICAgICAgICAgICB2YXIgbmV3RWxlbWVudCA9IGdlbkVsZW1lbnQoY2hpbGQpXHJcbiAgICAgICAgICAgICAgICBlbGVtQXJyLnB1c2gobmV3RWxlbWVudClcclxuICAgICAgICAgICAgICB9IGVsc2UgaWYoIWNoaWxkKXtcclxuICAgICAgICAgICAgICAgIHRlbXBEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxyXG4gICAgICAgICAgICAgICAgdGVtcERpdi5pbm5lckhUTUwgPSBjXHJcbiAgICAgICAgICAgICAgICBlbGVtQXJyLnB1c2godGVtcERpdi5jaGlsZE5vZGVzWzBdKVxyXG4gICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgLy8gd2F0Y2ggb2JqZWN0IHN0YXRlXHJcbiAgICAgICAgICAgICAgaWYod2F0Y2ggJiYgY2hpbGQpIHtcclxuICAgICAgICAgICAgICAgIHdhdGNoZXIoY2hpbGQsIGluZGV4KVxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHRlbXBEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxyXG4gICAgICAgICAgdGVtcERpdi5pbm5lckhUTUwgPSBzdHJcclxuICAgICAgICAgIHByb2Nlc3NfZXZlbnQodGVtcERpdilcclxuICAgICAgICAgIGVsZW1BcnIucHVzaCh0ZW1wRGl2LmNoaWxkTm9kZXNbMF0pXHJcbiAgICAgICAgICB3YXRjaGVyMihhcHBPYmopXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBlbGVtQXJyXHJcbiAgfVxyXG5cclxuICB2YXIgcHJvY2Vzc19ldmVudCA9IGZ1bmN0aW9uKGtOb2RlKSB7XHJcbiAgICB2YXIgbGlzdEtub2RlQ2hpbGQgPSBbXSwgaGFzaywgZXZ0TmFtZSwgZXZ0aGFuZGxlciwgaGFuZGxlciwgaXNIYW5kbGVyLCBhcmd2LCBpLCBhdHRzLCB2LCByZW0gPSBbXVxyXG4gICAgaWYgKGtOb2RlLmhhc0NoaWxkTm9kZXMoKSkge1xyXG4gICAgICBsb29wQ2hpbGRzKGxpc3RLbm9kZUNoaWxkLCBrTm9kZSlcclxuICAgICAgbGlzdEtub2RlQ2hpbGQuZm9yRWFjaChmdW5jdGlvbihjLCBpKSB7XHJcbiAgICAgICAgaWYgKGMubm9kZVR5cGUgPT09IDEgJiYgYy5oYXNBdHRyaWJ1dGVzKCkpIHtcclxuICAgICAgICAgIGkgPSAwXHJcbiAgICAgICAgICBmdW5jdGlvbiBuZXh0KCl7XHJcbiAgICAgICAgICAgIGF0dHMgPSBjLmF0dHJpYnV0ZXNcclxuICAgICAgICAgICAgaWYoaSA8IGF0dHMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgaGFzayA9IC9eay0vLnRlc3QoYXR0c1tpXS5ub2RlTmFtZSlcclxuICAgICAgICAgICAgICBpZihoYXNrKXtcclxuICAgICAgICAgICAgICAgIGV2dE5hbWUgPSBhdHRzW2ldLm5vZGVOYW1lLnNwbGl0KCctJylbMV1cclxuICAgICAgICAgICAgICAgIGV2dGhhbmRsZXIgPSBhdHRzW2ldLm5vZGVWYWx1ZVxyXG4gICAgICAgICAgICAgICAgaGFuZGxlciA9IGV2dGhhbmRsZXIuc3BsaXQoJygnKVxyXG4gICAgICAgICAgICAgICAgaXNIYW5kbGVyID0gdGVzdEV2YWwoY3R4LmJhc2VbaGFuZGxlclswXV0pID8gZXZhbChjdHguYmFzZVtoYW5kbGVyWzBdXSkgOiBmYWxzZVxyXG4gICAgICAgICAgICAgICAgaWYodHlwZW9mIGlzSGFuZGxlciA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgICAgICAgICAgICByZW0ucHVzaChhdHRzW2ldLm5vZGVOYW1lKVxyXG4gICAgICAgICAgICAgICAgICBjLmFkZEV2ZW50TGlzdGVuZXIoZXZ0TmFtZSwgZnVuY3Rpb24oZXZ0KXtcclxuICAgICAgICAgICAgICAgICAgICBhcmd2ID0gW11cclxuICAgICAgICAgICAgICAgICAgICBhcmd2LnB1c2goZXZ0KVxyXG4gICAgICAgICAgICAgICAgICAgIHYgPSBoYW5kbGVyWzFdLnNsaWNlKDAsIC0xKS5zcGxpdCgnLCcpXHJcbiAgICAgICAgICAgICAgICAgICAgaWYodikgdi5mb3JFYWNoKGZ1bmN0aW9uKHYpeyBhcmd2LnB1c2godikgfSlcclxuICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICBpc0hhbmRsZXIuYXBwbHkoYywgYXJndilcclxuICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgaSsrXHJcbiAgICAgICAgICAgICAgbmV4dCgpXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgcmVtLm1hcChmdW5jdGlvbihmKXsgYy5yZW1vdmVBdHRyaWJ1dGUoZikgfSlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgbmV4dCgpXHJcbiAgICAgICAgfVxyXG4gICAgICB9KVxyXG4gICAgfVxyXG4gICAgbGlzdEtub2RlQ2hpbGQgPSBbXVxyXG4gIH1cclxuXHJcbiAgdGhpcy52ZG9tID0gZnVuY3Rpb24oKXtcclxuICAgIHZhciBlbGUgPSBnZXRJZChjdHguZWwpXHJcbiAgICBpZihlbGUpIHJldHVybiBlbGVcclxuICB9XHJcblxyXG4gIHRoaXMuZmx1c2ggPSBmdW5jdGlvbihjb21wb25lbnQpe1xyXG4gICAgdmFyIGVsZSA9IGdldElkKGNvbXBvbmVudClcclxuICAgIGlmKGVsZSkgZWxlLmlubmVySFRNTCA9ICcnXHJcbiAgfVxyXG5cclxuICAvKipcclxuICAqIHJlbmRlciBjb21wb25lbnQgdG8gRE9NXHJcbiAgKi9cclxuXHJcbiAgdGhpcy5yZW5kZXIgPSBmdW5jdGlvbigpe1xyXG4gICAgdmFyIGVsZSA9IGdldElkKGN0eC5lbClcclxuICAgIGlmKCFlbGUpe1xyXG4gICAgICBjb25zb2xlLndhcm4oJ2Vycm9yOiBjYW5ub3QgZmluZCBET00gd2l0aCBpZDogJytjdHguZWwrJyBza2lwIHJlbmRlcmluZy4uJylcclxuICAgICAgcmV0dXJuIGZhbHNlXHJcbiAgICB9XHJcbiAgICBpZihjb250ZXh0KSBjdHguYmFzZSA9IGNvbnRleHRcclxuICAgIHZhciBlbEFyciA9IHBhcnNlU3RyKGN0eC5iYXNlLCB0cnVlKVxyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBlbEFyci5sZW5ndGg7IGkrKykge1xyXG4gICAgICBlbGUuYXBwZW5kQ2hpbGQoZWxBcnJbaV0pXHJcblxyXG4gICAgICBpZihpID09PSBlbEFyci5sZW5ndGggLSAxKXtcclxuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdfbG9hZGVkJywgd2luZG93Ll9sb2FkZWQgJiYgdHlwZW9mIHdpbmRvdy5fbG9hZGVkID09PSAnZnVuY3Rpb24nID8gd2luZG93Ll9sb2FkZWQoY3R4LmVsKSA6IG51bGwsIGZhbHNlKVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gIH1cclxuXHJcbiAgdGhpcy51cGRhdGUgPSBmdW5jdGlvbihhcHBPYmope1xyXG4gICAgdmFyIGVsZSA9IGdldElkKGN0eC5lbClcclxuICAgIHZhciBlbEFyciA9IHBhcnNlU3RyKGFwcE9iaiwgdHJ1ZSlcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZWxBcnIubGVuZ3RoOyBpKyspIHtcclxuICAgICAgZWxlLnJlcGxhY2VDaGlsZChlbEFycltpXSwgZWxlLmNoaWxkTm9kZXNbaV0pXHJcbiAgICAgIGlmKGkgPT09IGVsQXJyLmxlbmd0aCAtIDEpe1xyXG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ191cGRhdGUnLCB3aW5kb3cuX3VwZGF0ZSAmJiB0eXBlb2Ygd2luZG93Ll91cGRhdGUgPT09ICdmdW5jdGlvbicgPyB3aW5kb3cuX3VwZGF0ZShjdHguZWwpIDogbnVsbCwgZmFsc2UpXHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIHZhciB3YXRjaGVyID0gZnVuY3Rpb24oaW5zdGFuY2UsIGluZGV4KXtcclxuICAgIHZhciBvYmosIGF0dHIsIGVsZSwgY29weUluc3RhbmNlLCBuZXdFbGVtXHJcbiAgICBmb3IgKGF0dHIgaW4gaW5zdGFuY2Upe1xyXG4gICAgICBpbnN0YW5jZS53YXRjaChhdHRyLCBmdW5jdGlvbihpZHgsIG8sIG4pIHtcclxuICAgICAgICBpbnN0YW5jZS51bndhdGNoKGF0dHIpXHJcbiAgICAgICAgb2JqID0ge31cclxuICAgICAgICBvYmpbaWR4XSA9IG5cclxuICAgICAgICBlbGUgPSBnZXRJZChjdHguZWwpXHJcbiAgICAgICAgaWYoaWR4ICE9PSAnY2xpY2snKXtcclxuICAgICAgICAgIGNvcHlJbnN0YW5jZSA9IGNvcHkoaW5zdGFuY2UpXHJcbiAgICAgICAgICBPYmplY3QuYXNzaWduKGNvcHlJbnN0YW5jZSwgb2JqKVxyXG4gICAgICAgICAgbmV3RWxlbSA9IGdlbkVsZW1lbnQoY29weUluc3RhbmNlKVxyXG4gICAgICAgICAgdXBkYXRlRWxlbShlbGUuY2hpbGROb2Rlc1tpbmRleF0sIG5ld0VsZW0pXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGVsZS5jaGlsZE5vZGVzW2luZGV4XS5jbGljaygpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHdhdGNoZXIoaW5zdGFuY2UsIGluZGV4KVxyXG4gICAgICB9KVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgdmFyIHdhdGNoZXIyID0gZnVuY3Rpb24oaW5zdGFuY2Upe1xyXG4gICAgdmFyIG9iaiwgYXR0ciwgZWxlLCBjb3B5SW5zdGFuY2UsIG5ld0VsZW1cclxuICAgIGZvciAoYXR0ciBpbiBpbnN0YW5jZSl7XHJcbiAgICAgIGluc3RhbmNlLndhdGNoKGF0dHIsIGZ1bmN0aW9uKGlkeCwgbywgbikge1xyXG4gICAgICAgIGluc3RhbmNlLnVud2F0Y2goYXR0cilcclxuICAgICAgICBvYmogPSB7fVxyXG4gICAgICAgIG9ialtpZHhdID0gblxyXG4gICAgICAgIGVsZSA9IGdldElkKGN0eC5lbClcclxuICAgICAgICBpZihpZHggIT09ICdjbGljaycpe1xyXG4gICAgICAgICAgY29weUluc3RhbmNlID0gY29weShpbnN0YW5jZSlcclxuICAgICAgICAgIE9iamVjdC5hc3NpZ24oY29weUluc3RhbmNlLCBvYmopXHJcbiAgICAgICAgICBuZXdFbGVtID0gZ2VuRWxlbWVudChjb3B5SW5zdGFuY2UpXHJcbiAgICAgICAgICB1cGRhdGVFbGVtKGVsZSwgbmV3RWxlbSlcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgZWxlLmNsaWNrKClcclxuICAgICAgICB9XHJcbiAgICAgICAgd2F0Y2hlcjIoaW5zdGFuY2UpXHJcbiAgICAgIH0pXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICB2YXIgd2F0Y2hlcjMgPSBmdW5jdGlvbihpbnN0YW5jZSl7XHJcbiAgICB2YXIgcHJpc3RpbmVMZW4gPSBjb3B5KGluc3RhbmNlKSwgb3BzTGlzdCwgb3AsIHF1ZXJ5XHJcbiAgICBcclxuICAgIG9wc0xpc3QgPSBmdW5jdGlvbigpIHsgcmV0dXJuIFsncHVzaCcsICdwb3AnLCAnc2hpZnQnLCAndW5zaGlmdCcsICdzcGxpY2UnLCAndXBkYXRlJ10gfVxyXG5cclxuICAgIG9wID0gb3BzTGlzdCgpXHJcblxyXG4gICAgcXVlcnkgPSBmdW5jdGlvbihvcHMsIGFyZ3ZzKSB7XHJcbiAgICAgIG9wID0gW11cclxuICAgICAgaWYob3BzID09PSAncHVzaCcpXHJcbiAgICAgICAgYXJyUHJvdG9QdXNoKGFyZ3ZzWzBdKVxyXG4gICAgICBlbHNlIGlmKG9wcyA9PT0gJ3BvcCcpXHJcbiAgICAgICAgYXJyUHJvdG9Qb3AoKVxyXG4gICAgICBlbHNlIGlmKG9wcyA9PT0gJ3NoaWZ0JylcclxuICAgICAgICBhcnJQcm90b1NoaWZ0KClcclxuICAgICAgZWxzZSBpZihvcHMgPT09ICd1bnNoaWZ0JylcclxuICAgICAgICBhcnJQcm90b1VuU2hpZnQuYXBwbHkobnVsbCwgYXJndnMpXHJcbiAgICAgIGVsc2UgaWYob3BzID09PSAnc3BsaWNlJylcclxuICAgICAgICBhcnJQcm90b1NwbGljZS5hcHBseShudWxsLCBhcmd2cylcclxuICAgICAgZWxzZVxyXG4gICAgICAgIGFyclByb3RvVXBkYXRlLmFwcGx5KG51bGwsIGFyZ3ZzKVxyXG4gICAgICBvcCA9IG9wc0xpc3QoKVxyXG4gICAgICBwcmlzdGluZUxlbiA9IGNvcHkoaW5zdGFuY2UpXHJcbiAgICB9XHJcblxyXG4gICAgb3AuZm9yRWFjaChmdW5jdGlvbihmLCBpLCByKXtcclxuICAgICAgaW5zdGFuY2VbZl0gPSBmdW5jdGlvbigpIHtcclxuICAgICAgICBpZihvcC5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICB2YXIgZmFyZ3YgPSBbXS5zbGljZS5jYWxsKGFyZ3VtZW50cylcclxuICAgICAgICAgIGlmKCFwcmlzdGluZUxlbltmYXJndlswXV0pIHJldHVybiBmYWxzZVxyXG4gICAgICAgICAgaWYoZiA9PT0gJ3VwZGF0ZScpXHJcbiAgICAgICAgICAgIGZhcmd2WzFdID0gT2JqZWN0LmFzc2lnbihwcmlzdGluZUxlbltmYXJndlswXV0sIGZhcmd2WzFdKVxyXG4gICAgICAgICAgQXJyYXkucHJvdG90eXBlW2ZdLmFwcGx5KHRoaXMsIGZhcmd2KVxyXG4gICAgICAgICAgLy9wcm9wYWdhdGUgc3BsaWNlIHdpdGggc2luZ2xlIGFyZ3VtZW50c1xyXG4gICAgICAgICAgaWYoZmFyZ3YubGVuZ3RoID09PSAxICYmIGYgPT09ICdzcGxpY2UnKVxyXG4gICAgICAgICAgICBmYXJndi5wdXNoKHByaXN0aW5lTGVuLmxlbmd0aCAtIGZhcmd2WzBdKVxyXG4gICAgICAgICAgcXVlcnkoZiwgZmFyZ3YpXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9KVxyXG4gIH1cclxuXHJcbiAgdmFyIGFyclByb3RvUHVzaCA9IGZ1bmN0aW9uKG5ld09iail7XHJcbiAgICB2YXIgZWxlID0gZ2V0SWQoY3R4LmVsKVxyXG4gICAgZWxlLmFwcGVuZENoaWxkKGdlblRlbXBsYXRlKG5ld09iaikpXHJcbiAgfVxyXG5cclxuICB2YXIgYXJyUHJvdG9Qb3AgPSBmdW5jdGlvbigpe1xyXG4gICAgdmFyIGVsZSA9IGdldElkKGN0eC5lbClcclxuICAgIGlmKGVsZS5jaGlsZE5vZGVzLmxlbmd0aCkge1xyXG4gICAgICBlbGUucmVtb3ZlQ2hpbGQoZWxlLmxhc3RDaGlsZClcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHZhciBhcnJQcm90b1NoaWZ0ID0gZnVuY3Rpb24oKXtcclxuICAgIHZhciBlbGUgPSBnZXRJZChjdHguZWwpXHJcbiAgICBpZihlbGUuY2hpbGROb2Rlcy5sZW5ndGgpIHtcclxuICAgICAgZWxlLnJlbW92ZUNoaWxkKGVsZS5maXJzdENoaWxkKVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgdmFyIGFyclByb3RvVW5TaGlmdCA9IGZ1bmN0aW9uKCl7XHJcbiAgICB2YXIgYXJndiA9IFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzKVxyXG4gICAgdmFyIGVsZSA9IGdldElkKGN0eC5lbClcclxuICAgIHZhciBpID0gYXJndi5sZW5ndGggLSAxXHJcbiAgICB3aGlsZShpID4gLTEpIHtcclxuICAgICAgZWxlLmluc2VydEJlZm9yZShnZW5UZW1wbGF0ZShhcmd2W2ldKSwgZWxlLmZpcnN0Q2hpbGQpXHJcbiAgICAgIGktLVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgdmFyIGFyclByb3RvU3BsaWNlID0gZnVuY3Rpb24oKXtcclxuICAgIHZhciBlbGUgPSBnZXRJZChjdHguZWwpXHJcbiAgICAsICAgY2hpbGRMZW5cclxuICAgICwgICBsZW5cclxuICAgICwgICBpXHJcbiAgICAsICAgalxyXG4gICAgLCAgIGtcclxuICAgICwgICBjXHJcbiAgICAsICAgdGVtcERpdkNoaWxkTGVuXHJcbiAgICAsICAgdGVtcERpdlxyXG4gICAgLCAgIGFyZ3YgPSBbXS5zbGljZS5jYWxsKGFyZ3VtZW50cylcclxuICAgICwgICBzdGFydCA9IFtdLnNoaWZ0LmNhbGwoYXJndilcclxuICAgICwgICBjb3VudFxyXG4gICAgaWYodHlwZW9mIGFyZ3ZbMF0gPT09ICdudW1iZXInKXtcclxuICAgICAgY291bnQgPSBbXS5zaGlmdC5jYWxsKGFyZ3YpXHJcbiAgICB9XHJcblxyXG4gICAgdGVtcERpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXHJcbiAgICBpZihhcmd2Lmxlbmd0aCl7XHJcbiAgICAgIGkgPSAwXHJcbiAgICAgIHdoaWxlKGkgPCBhcmd2Lmxlbmd0aCl7XHJcbiAgICAgICAgdGVtcERpdi5hcHBlbmRDaGlsZChnZW5UZW1wbGF0ZShhcmd2W2ldKSlcclxuICAgICAgICBpKytcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGNoaWxkTGVuID0gY29weShlbGUuY2hpbGROb2Rlcy5sZW5ndGgpXHJcbiAgICB0ZW1wRGl2Q2hpbGRMZW4gPSBjb3B5KHRlbXBEaXYuY2hpbGROb2Rlcy5sZW5ndGgpXHJcbiAgICBpZiAoY291bnQgJiYgY291bnQgPiAwKSB7XHJcbiAgICAgIGZvciAoaSA9IHN0YXJ0OyBpIDwgY2hpbGRMZW4gKyAxOyBpKyspIHtcclxuICAgICAgICBsZW4gPSBzdGFydCArIGNvdW50XHJcbiAgICAgICAgaWYgKGkgPCBsZW4pIHtcclxuICAgICAgICAgIGVsZS5yZW1vdmVDaGlsZChlbGUuY2hpbGROb2Rlc1tzdGFydF0pXHJcbiAgICAgICAgICBpZiAoaSA9PT0gbGVuIC0gMSAmJiB0ZW1wRGl2Q2hpbGRMZW4gPiAwKSB7XHJcbiAgICAgICAgICAgIGMgPSBzdGFydCAtIDFcclxuICAgICAgICAgICAgZm9yIChqID0gc3RhcnQ7IGogPCB0ZW1wRGl2Q2hpbGRMZW4gKyBzdGFydDsgaisrKSB7XHJcbiAgICAgICAgICAgICAgaW5zZXJ0QWZ0ZXIodGVtcERpdi5jaGlsZE5vZGVzWzBdLCBlbGUuY2hpbGROb2Rlc1tjXSwgZWxlKVxyXG4gICAgICAgICAgICAgIGMrK1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9IGVsc2UgaWYgKGFyZ3YubGVuZ3RoKSB7XHJcbiAgICAgIGMgPSBzdGFydCAtIDFcclxuICAgICAgZm9yIChrID0gc3RhcnQ7IGsgPCB0ZW1wRGl2Q2hpbGRMZW4gKyBzdGFydDsgaysrKSB7XHJcbiAgICAgICAgaW5zZXJ0QWZ0ZXIodGVtcERpdi5jaGlsZE5vZGVzWzBdLCBlbGUuY2hpbGROb2Rlc1tjXSwgZWxlKVxyXG4gICAgICAgIGMrK1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICB2YXIgYXJyUHJvdG9VcGRhdGUgPSBmdW5jdGlvbigpe1xyXG4gICAgdmFyIGFyZ3YgPSBbXS5zbGljZS5jYWxsKGFyZ3VtZW50cylcclxuICAgICwgICBlbGUgPSBnZXRJZChjdHguZWwpXHJcbiAgICAsICAgaW5kZXggPSBbXS5zaGlmdC5jYWxsKGFyZ3YpXHJcbiAgICB1cGRhdGVFbGVtKGVsZS5jaGlsZE5vZGVzW2luZGV4XSwgZ2VuVGVtcGxhdGUoYXJndlswXSkpXHJcbiAgfVxyXG5cclxuICB2YXIgZ2VuVGVtcGxhdGUgPSBmdW5jdGlvbihvYmope1xyXG4gICAgdmFyIGFyclByb3BzID0gY3R4LmJhc2UudGVtcGxhdGUubWF0Y2goL3t7KFtee31dKyl9fS9nLCAnJDEnKSwgIHRtcGwsIHRlbXBEaXYsIGVsZVxyXG4gICAgdG1wbCA9IGN0eC5iYXNlLnRlbXBsYXRlXHJcbiAgICBhcnJQcm9wcy5mb3JFYWNoKGZ1bmN0aW9uKHMpIHtcclxuICAgICAgdmFyIHJlcCA9IHMucmVwbGFjZSgve3soW157fV0rKX19L2csICckMScpXHJcbiAgICAgIHRtcGwgPSB0bXBsLnJlcGxhY2UoL3t7KFtee31dKyl9fS8sIG9ialtyZXBdKVxyXG4gICAgfSlcclxuICAgIHRlbXBEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxyXG4gICAgdGVtcERpdi5pbm5lckhUTUwgPSB0bXBsXHJcbiAgICByZXR1cm4gdGVtcERpdi5jaGlsZE5vZGVzWzBdXHJcbiAgfVxyXG5cclxuICB2YXIgbG9vcENoaWxkcyA9IGZ1bmN0aW9uKGFyciwgZWxlbSkge1xyXG4gICAgZm9yICh2YXIgY2hpbGQgPSBlbGVtLmZpcnN0Q2hpbGQ7IGNoaWxkICE9PSBudWxsOyBjaGlsZCA9IGNoaWxkLm5leHRTaWJsaW5nKSB7XHJcbiAgICAgIGFyci5wdXNoKGNoaWxkKVxyXG4gICAgICBpZiAoY2hpbGQuaGFzQ2hpbGROb2RlcygpKSB7XHJcbiAgICAgICAgbG9vcENoaWxkcyhhcnIsIGNoaWxkKVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICB2YXIgaW5zZXJ0QWZ0ZXIgPSBmdW5jdGlvbihuZXdOb2RlLCByZWZlcmVuY2VOb2RlLCBwYXJlbnROb2RlKSB7XHJcbiAgICByZWZlcmVuY2VOb2RlLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKG5ld05vZGUsIHJlZmVyZW5jZU5vZGUubmV4dFNpYmxpbmcpXHJcbiAgfVxyXG5cclxuICB2YXIgbm9kZVVwZGF0ZSA9IGZ1bmN0aW9uKG5ld05vZGUsIG9sZE5vZGUpIHtcclxuICAgIGlmKCFuZXdOb2RlKSByZXR1cm4gZmFsc2VcclxuICAgIHZhciBvQXR0ciA9IG5ld05vZGUuYXR0cmlidXRlc1xyXG4gICAgdmFyIG91dHB1dCA9IHt9O1xyXG5cclxuICAgIGZvcih2YXIgaSA9IG9BdHRyLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XHJcbiAgICAgICBvdXRwdXRbb0F0dHJbaV0ubmFtZV0gPSBvQXR0cltpXS52YWx1ZVxyXG4gICAgfVxyXG4gICAgZm9yICh2YXIgaUF0dHIgaW4gb3V0cHV0KSB7XHJcbiAgICAgIGlmKG9sZE5vZGUuYXR0cmlidXRlc1tpQXR0cl0gJiYgb2xkTm9kZS5hdHRyaWJ1dGVzW2lBdHRyXS5uYW1lID09PSBpQXR0ciAmJiBvbGROb2RlLmF0dHJpYnV0ZXNbaUF0dHJdLnZhbHVlICE9IG91dHB1dFtpQXR0cl0pe1xyXG4gICAgICAgIGlmKGlBdHRyID09PSAnY2xpY2snKSBvbGROb2RlLmNsaWNrKClcclxuICAgICAgICBlbHNlIG9sZE5vZGUuc2V0QXR0cmlidXRlKGlBdHRyLCBvdXRwdXRbaUF0dHJdKVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBpZihvbGROb2RlLnRleHRDb250ZW50ICA9PT0gXCJcIiAmJiBuZXdOb2RlLnRleHRDb250ZW50ICl7XHJcbiAgICAgIG9sZE5vZGUudGV4dENvbnRlbnQgPSBuZXdOb2RlLnRleHRDb250ZW50XHJcbiAgICB9XHJcbiAgICBvdXRwdXQgPSB7fVxyXG4gIH1cclxuXHJcbiAgdmFyIG5vZGVVcGRhdGVIVE1MID0gZnVuY3Rpb24obmV3Tm9kZSwgb2xkTm9kZSkge1xyXG4gICAgaWYoIW5ld05vZGUpIHJldHVybiBmYWxzZVxyXG4gICAgaWYobmV3Tm9kZS5ub2RlVmFsdWUgIT09IG9sZE5vZGUubm9kZVZhbHVlKVxyXG4gICAgICAgIG9sZE5vZGUubm9kZVZhbHVlID0gbmV3Tm9kZS5ub2RlVmFsdWVcclxuICB9XHJcblxyXG4gIHZhciB1cGRhdGVFbGVtID0gZnVuY3Rpb24ob2xkRWxlbSwgbmV3RWxlbSl7XHJcbiAgICB2YXIgb2xkQXJyID0gW10sIG5ld0FyciA9IFtdXHJcbiAgICBvbGRBcnIucHVzaChvbGRFbGVtKVxyXG4gICAgbmV3QXJyLnB1c2gobmV3RWxlbSlcclxuICAgIGxvb3BDaGlsZHMob2xkQXJyLCBvbGRFbGVtKVxyXG4gICAgbG9vcENoaWxkcyhuZXdBcnIsIG5ld0VsZW0pXHJcbiAgICBvbGRBcnIuZm9yRWFjaChmdW5jdGlvbihlbGUsIGlkeCwgYXJyKSB7XHJcbiAgICAgIGlmIChlbGUubm9kZVR5cGUgPT09IDEgJiYgZWxlLmhhc0F0dHJpYnV0ZXMoKSkge1xyXG4gICAgICAgIG5vZGVVcGRhdGUobmV3QXJyW2lkeF0sIGVsZSlcclxuICAgICAgfSBlbHNlIGlmIChlbGUubm9kZVR5cGUgPT09IDMpIHtcclxuICAgICAgICBub2RlVXBkYXRlSFRNTChuZXdBcnJbaWR4XSwgZWxlKVxyXG4gICAgICB9XHJcbiAgICAgIGlmKGlkeCA9PT0gYXJyLmxlbmd0aCAtIDEpe1xyXG4gICAgICAgIG9sZEFyci5zcGxpY2UoMClcclxuICAgICAgICBuZXdBcnIuc3BsaWNlKDApXHJcbiAgICAgIH1cclxuICAgIH0pXHJcbiAgfVxyXG4gIFxyXG4gIGlmICghT2JqZWN0LnByb3RvdHlwZS53YXRjaCkge1xyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KE9iamVjdC5wcm90b3R5cGUsICd3YXRjaCcsIHtcclxuICAgICAgZW51bWVyYWJsZTogZmFsc2UsXHJcbiAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcclxuICAgICAgd3JpdGFibGU6IGZhbHNlLFxyXG4gICAgICB2YWx1ZTogZnVuY3Rpb24ocHJvcCwgaGFuZGxlcikge1xyXG4gICAgICAgIHZhciBvbGR2YWwgPSB0aGlzW3Byb3BdLFxyXG4gICAgICAgICAgbmV3dmFsID0gb2xkdmFsLFxyXG4gICAgICAgICAgZ2V0dGVyID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBuZXd2YWxcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBzZXR0ZXIgPSBmdW5jdGlvbih2YWwpIHtcclxuICAgICAgICAgICAgb2xkdmFsID0gbmV3dmFsXHJcbiAgICAgICAgICAgIHJldHVybiBuZXd2YWwgPSBoYW5kbGVyLmNhbGwodGhpcywgcHJvcCwgb2xkdmFsLCB2YWwpXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgaWYgKGRlbGV0ZSB0aGlzW3Byb3BdKSB7XHJcbiAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgcHJvcCwge1xyXG4gICAgICAgICAgICBnZXQ6IGdldHRlcixcclxuICAgICAgICAgICAgc2V0OiBzZXR0ZXIsXHJcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgICAgICAgfSlcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0pXHJcbiAgfVxyXG5cclxuICBpZiAoIU9iamVjdC5wcm90b3R5cGUudW53YXRjaCkge1xyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KE9iamVjdC5wcm90b3R5cGUsICd1bndhdGNoJywge1xyXG4gICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcclxuICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxyXG4gICAgICB3cml0YWJsZTogZmFsc2UsXHJcbiAgICAgIHZhbHVlOiBmdW5jdGlvbihwcm9wKSB7XHJcbiAgICAgICAgdmFyIHZhbCA9IHRoaXNbcHJvcF0gXHJcbiAgICAgICAgZGVsZXRlIHRoaXNbcHJvcF0gXHJcbiAgICAgICAgdGhpc1twcm9wXSA9IHZhbFxyXG4gICAgICB9XHJcbiAgICB9KVxyXG4gIH1cclxuXHJcbiAgaWYoIUFycmF5LnByb3RvdHlwZS51cGRhdGUpe1xyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KEFycmF5LnByb3RvdHlwZSwgJ3VwZGF0ZScsIHtcclxuICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcclxuICAgICAgICB3cml0YWJsZTogdHJ1ZSxcclxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24oaW5kZXgsIHZhbHVlKSB7IFxyXG4gICAgICAgICAgdGhpc1tpbmRleF0gPSB2YWx1ZVxyXG4gICAgICAgIH1cclxuICAgIH0pXHJcbiAgfVxyXG59XHJcblxyXG5LZWV0LnByb3RvdHlwZS5saW5rID0gZnVuY3Rpb24oaWQsIHZhbHVlKSB7XHJcbiAgdmFyIGFyZ3YgPSBbXS5zbGljZS5jYWxsKGFyZ3VtZW50cylcclxuXHJcbiAgdGhpcy5lbCA9IGFyZ3ZbMF1cclxuICBpZiAoYXJndi5sZW5ndGggPT09IDIpe1xyXG4gICAgaWYoIWFyZ3ZbMV0udGFnKXtcclxuICAgICAgYXJndlsxXS50YWcgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCkudGFnTmFtZS50b0xvd2VyQ2FzZSgpXHJcbiAgICB9XHJcbiAgICB0aGlzLmJhc2UgPSBhcmd2WzFdXHJcbiAgfVxyXG4gIHRoaXMucmVuZGVyKClcclxuICByZXR1cm4gdGhpc1xyXG59XHJcblxyXG5LZWV0LnByb3RvdHlwZS5jb21wb3NlID0gZnVuY3Rpb24oaW5zdGFuY2UpIHtcclxuICB0aGlzLnVwZGF0ZShpbnN0YW5jZSlcclxuICByZXR1cm4gdGhpc1xyXG59XHJcblxyXG5LZWV0LnByb3RvdHlwZS5tb3VudCA9IGZ1bmN0aW9uKGluc3RhbmNlKSB7XHJcbiAgdGhpcy5iYXNlID0gaW5zdGFuY2VcclxuICByZXR1cm4gdGhpc1xyXG59XHJcblxyXG5LZWV0LnByb3RvdHlwZS5jbHVzdGVyID0gZnVuY3Rpb24oKSB7XHJcbiAgdmFyIGFyZ3MgPSBbXS5zbGljZS5jYWxsKGFyZ3VtZW50cylcclxuICBhcmdzLm1hcChmdW5jdGlvbihmbil7XHJcbiAgICBpZih0eXBlb2YgZm4gPT09ICdmdW5jdGlvbicpIGZuKClcclxuICB9KVxyXG4gIHJldHVybiB0aGlzXHJcbn1cclxuXHJcbktlZXQucHJvdG90eXBlLmxpc3QgPSBmdW5jdGlvbigpe1xyXG4gIHJldHVybiB0aGlzLmJhc2UgJiYgdGhpcy5iYXNlLmxpc3QgfHwgW11cclxufVxyXG5cclxuS2VldC5wcm90b3R5cGUuZ2V0QmFzZSA9IGZ1bmN0aW9uKGNoaWxkLCBhdHRyaWJ1dGUsIG5ld1Byb3ApIHtcclxuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDIgJiYgdGhpcy5iYXNlKVxyXG4gICAgdGhpcy5iYXNlW2NoaWxkXVthdHRyaWJ1dGVdID0gbmV3UHJvcFxyXG4gIGVsc2VcclxuICAgIHJldHVybiB0aGlzLmJhc2VbY2hpbGRdW2F0dHJpYnV0ZV1cclxufVxyXG5cclxuS2VldC5wcm90b3R5cGUuYWRkQ2xhc3MgPSBmdW5jdGlvbihjaGlsZCwgbmV3Q2xhc3MpIHtcclxuICB2YXIgYiA9IHRoaXMuZ2V0QmFzZShjaGlsZCwgJ2NsYXNzJylcclxuXHJcbiAgdmFyIGlzQXJyID0gZnVuY3Rpb24oKSB7XHJcbiAgICBiLnB1c2gobmV3Q2xhc3MpXHJcbiAgICB0aGlzLmdldEJhc2UoY2hpbGQsICdjbGFzcycsIGIpXHJcbiAgfVxyXG5cclxuICByZXR1cm4gQXJyYXkuaXNBcnJheShiKSAmJiBpc0FycigpXHJcbn1cclxuXHJcbktlZXQucHJvdG90eXBlLnJlbW92ZUNsYXNzID0gZnVuY3Rpb24oY2hpbGQsIG9sZENsYXNzKSB7XHJcbiAgdmFyIGIgPSB0aGlzLmdldEJhc2UoY2hpbGQsICdjbGFzcycpXHJcblxyXG4gIHZhciBoSWR4ID0gZnVuY3Rpb24oaWR4KSB7XHJcbiAgICBiLnNwbGljZShpZHgsIDEpXHJcbiAgICB0aGlzLmdldEJhc2UoY2hpbGQsICdjbGFzcycsIGIpXHJcbiAgfVxyXG5cclxuICB2YXIgaXNBcnIgPSBmdW5jdGlvbigpIHtcclxuICAgIHZhciBpZHggPSBiLmluZGV4T2Yob2xkQ2xhc3MpXHJcbiAgICBpZiAofmlkeCkgaElkeChpZHgpXHJcbiAgfVxyXG5cclxuICByZXR1cm4gQXJyYXkuaXNBcnJheShiKSAmJiBpc0FycigpXHJcbn1cclxuXHJcbktlZXQucHJvdG90eXBlLnN3YXBDbGFzcyA9IGZ1bmN0aW9uKGNoaWxkLCBjb25kaXRpb24sIGNsYXNzZXNBcnJheSkge1xyXG4gIHZhciBiID0gdGhpcy5nZXRCYXNlKGNoaWxkLCAnY2xhc3MnKVxyXG5cclxuICBpZiAoY29uZGl0aW9uKSBjbGFzc2VzQXJyYXkucmV2ZXJzZSgpXHJcblxyXG4gIHZhciBoSWR4ID0gZnVuY3Rpb24oaWR4KSB7XHJcbiAgICBiLnNwbGljZShpZHgsIDEsIGNsYXNzZXNBcnJheVsxXSlcclxuICAgIHRoaXMuZ2V0QmFzZShjaGlsZCwgJ2NsYXNzJywgYilcclxuICB9XHJcblxyXG4gIHZhciBpc0FyciA9IGZ1bmN0aW9uKCkge1xyXG4gICAgdmFyIGlkeCA9IGIuaW5kZXhPZihjbGFzc2VzQXJyYXlbMF0pXHJcbiAgICBpZiAofmlkeCkgaElkeChpZHgpXHJcbiAgfVxyXG5cclxuICByZXR1cm4gQXJyYXkuaXNBcnJheShiKSAmJiBpc0FycigpXHJcbn1cclxuXHJcbktlZXQucHJvdG90eXBlLnN3YXBBdHRyID0gZnVuY3Rpb24oY2hpbGQsIGNvbmRpdGlvbiwgcHJvcGVydHlBcnJheSwgYXR0cmlidXRlKSB7XHJcbiAgaWYgKGNvbmRpdGlvbikgcHJvcGVydHlBcnJheS5yZXZlcnNlKClcclxuICB0aGlzLmdldEJhc2UoY2hpbGQsIGF0dHJpYnV0ZSwgcHJvcGVydHlBcnJheVswXSlcclxufVxyXG5cclxuS2VldC5wcm90b3R5cGUuc2V0QXR0ciA9IGZ1bmN0aW9uKGNoaWxkLCBhdHRyaWJ1dGUsIG5ld1Byb3BlcnR5KSB7XHJcbiAgdGhpcy5nZXRCYXNlKGNoaWxkLCBhdHRyaWJ1dGUsIG5ld1Byb3BlcnR5KVxyXG59XHJcblxyXG5LZWV0LnByb3RvdHlwZS50b2dnbGUgPSBmdW5jdGlvbihjaGlsZCwgZGlzcGxheSkge1xyXG4gIHZhciBzdHlsID0gdGhpcy5iYXNlW2NoaWxkXS5zdHlsZVxyXG4gIE9iamVjdC5hc3NpZ24oc3R5bCwgeyBkaXNwbGF5OiBkaXNwbGF5IH0pXHJcbiAgdGhpcy5iYXNlW2NoaWxkXS5zdHlsZSA9IHN0eWxcclxufVxyXG5cclxuS2VldC5wcm90b3R5cGUuY29udGVudFVwZGF0ZSA9IGZ1bmN0aW9uKGNoaWxkLCBjb250ZW50KSB7XHJcbiAgdGhpcy5iYXNlW2NoaWxkXS50ZW1wbGF0ZSA9IGNvbnRlbnRcclxufSIsInZhciB0YWcgPSBmdW5jdGlvbigpIHtcclxuICBmdW5jdGlvbiBrdGFnKHRhZywgdmFsdWUsIGF0dHJpYnV0ZXMsIHN0eWxlcykge1xyXG4gICAgdmFyIGF0dHIsIGlkeCwgdGUsIGEgPSBbXS5zbGljZS5jYWxsKGFyZ3VtZW50cyksXHJcbiAgICAgIHJldCA9IFsnPCcsIGFbMF0sICc+JywgYVsxXSwgJzwvJywgYVswXSwgJz4nXVxyXG4gICAgaWYgKGEubGVuZ3RoID4gMiAmJiB0eXBlb2YgYVsyXSA9PT0gJ29iamVjdCcpIHtcclxuICAgICAgZm9yIChhdHRyIGluIGFbMl0pIHtcclxuICAgICAgICBpZih0eXBlb2YgYVsyXVthdHRyXSA9PT0gJ2Jvb2xlYW4nICYmIGFbMl1bYXR0cl0pXHJcbiAgICAgICAgICByZXQuc3BsaWNlKDIsIDAsICcgJywgYXR0cilcclxuICAgICAgICBlbHNlIGlmKGF0dHIgPT09ICdjbGFzcycgJiYgQXJyYXkuaXNBcnJheShhWzJdW2F0dHJdKSlcclxuICAgICAgICAgIHJldC5zcGxpY2UoMiwgMCwgJyAnLCBhdHRyLCAnPVwiJywgYVsyXVthdHRyXS5qb2luKCcgJykudHJpbSgpLCAnXCInKVxyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgIHJldC5zcGxpY2UoMiwgMCwgJyAnLCBhdHRyLCAnPVwiJywgYVsyXVthdHRyXSwgJ1wiJylcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgaWYgKGEubGVuZ3RoID4gMyAmJiB0eXBlb2YgYVszXSA9PT0gJ29iamVjdCcpIHtcclxuICAgICAgaWR4ID0gcmV0LmluZGV4T2YoJz4nKVxyXG4gICAgICBpZiAofmlkeCkge1xyXG4gICAgICAgIHRlID0gW2lkeCwgMCwgJyBzdHlsZT1cIiddXHJcbiAgICAgICAgZm9yIChhdHRyIGluIGFbM10pIHtcclxuICAgICAgICAgIHRlLnB1c2goYXR0cilcclxuICAgICAgICAgIHRlLnB1c2goJzonKVxyXG4gICAgICAgICAgdGUucHVzaChhWzNdW2F0dHJdKVxyXG4gICAgICAgICAgdGUucHVzaCgnOycpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRlLnB1c2goJ1wiJylcclxuICAgICAgICByZXQuc3BsaWNlLmFwcGx5KHJldCwgdGUpXHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiByZXRcclxuICB9XHJcbiAgdmFyIGFyZ3MgPSBbXS5zbGljZS5jYWxsKGFyZ3VtZW50cyksXHJcbiAgICBhcnIgPSBrdGFnLmFwcGx5KG51bGwsIGFyZ3MpXHJcbiAgcmV0dXJuIGFyci5qb2luKCcnKVxyXG59XHJcblxyXG5pZiAodHlwZW9mIGV4cG9ydHMgIT09ICd1bmRlZmluZWQnKSB7XHJcbiAgaWYgKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnICYmIG1vZHVsZS5leHBvcnRzKSB7XHJcbiAgICBleHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSB0YWdcclxuICB9XHJcbiAgZXhwb3J0cy50YWcgPSB0YWdcclxufSJdfQ==
