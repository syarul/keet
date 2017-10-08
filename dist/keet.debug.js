(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Keet = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = function(argv) {
  var cop = function(v){
    var o = {}
    for(var attr in v){
      o[attr] = v[attr]
    }
    return o
  }
  var clone = function(v) {
    return typeof v == 'object' && cop(v)
  }
  return clone(argv)
}
},{}],2:[function(require,module,exports){
/** 
 * Keet.js v2.1.0 Alpha release: https://github.com/syarul/keet
 * an API for web application
 *
 * <<<<<<<<<<<<<<<<<<<<<<<<<<<<<< Keet.js >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
 *
 * Copyright 2017, Shahrul Nizam Selamat
 * Released under the MIT License.
 */
'use strict'
var copy = require('./copy')
var tag = require('./tag')

module.exports = Keet

function Keet(tagName, context) {
  var ctx = this
  ,   argv = [].slice.call(arguments)
  ,   context = argv.filter(function(c) {    
        return typeof c === 'object'
      })[0]
  ,   getId = function(id) {
        return document.getElementById(id)
      }
  ,   testEval = function(ev) {
        try { return eval(ev) } 
        catch (e) { return false }
      }
  ,   genElement = function(child){
        var tempDiv = document.createElement('div')
        var cloneChild = copy(child)
        delete cloneChild.template
        delete cloneChild.tag
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
          if (child.checked) 
            tempDiv.childNodes[0].checked = true
          else
            tempDiv.childNodes[0].removeAttribute('checked')
        }
        process_event(tempDiv)
        return tempDiv.childNodes[0]
      }
  ,   parseStr = function(appObj, watch){
        if(typeof appObj != 'object') throw new Error('instance is not an object')
        var str = appObj.template
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
                if(!child) child = testEval(regc)
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
              isHandler = testEval(ctx.base[handler[0]])
              if(typeof isHandler === 'function') {
                rem.push(atts[i].nodeName)
                c.addEventListener(evtName, function(evt){
                  argv = []
                  argv.push(evt)
                  v = handler[1].slice(0, -1).split(',').filter(function(f){
                    return f != ''
                  })
                  if(v.length) v.forEach(function(v){ argv.push(v) })
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
      throw new Error('cannot find DOM with id: '+ctx.el+' skip rendering..')
    }
    if(context) ctx.base = context
    var elArr = parseStr(ctx.base, true)
    for (var i = 0; i < elArr.length; i++) {
      ele.appendChild(elArr[i])

      if(i === elArr.length - 1){
        document.addEventListener('_loaded', window._loaded && typeof window._loaded === 'function' ? window._loaded(ctx.el) : null, false)

        if(typeof window.MutationObserver == 'function'){
          var observer = new MutationObserver(function(mutations){
            if(typeof ctx.componentOnUpdate == 'function') ctx.componentOnUpdate.apply(ctx, mutations)
          })

          var config = {
            attributes: true,
            childList: true,
            characterData: true,
            subtree: true
          }

          observer.observe(ele, config)
        }


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
    var obj, attr, attr2, ele, copyInstance, newElem
    for (attr in instance){
      instance.watch(attr, function(idx, o, n) {
        for (attr2 in instance){
          instance.unwatch(attr2)
        }
        obj = {}
        obj[idx] = n
        ele = getId(ctx.el)
        Object.assign(instance, obj)
        newElem = genElement(instance)
        updateElem(ele.childNodes[index], newElem)
        watcher(instance, index)
      })
    }
  }

  var watcher2 = function(instance){
    var obj, attr, attr2, ele, copyInstance, newElem
    for (attr in instance){
      instance.watch(attr, function(idx, o, n) {
        for (attr2 in instance){
          instance.unwatch(attr2)
        }
        obj = {}
        obj[idx] = n
        ele = getId(ctx.el)
        Object.assign(instance, obj)
        newElem = genElement(instance)
        updateElem(ele, newElem)
        watcher2(instance)
      })
    }
  }

  var watcher3 = function(instance){
    // console.log(instance)
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
          // if(!pristineLen[fargv[0]]) return false
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
    if(oAttr){
      for(var i = oAttr.length - 1; i >= 0; i--) {
         output[oAttr[i].name] = oAttr[i].value
      }
    }
    for (var iAttr in output) {
      if(oldNode.attributes[iAttr] && oldNode.attributes[iAttr].name === iAttr && oldNode.attributes[iAttr].value != output[iAttr]){
        oldNode.setAttribute(iAttr, output[iAttr])
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
},{"./copy":1,"./tag":3}],3:[function(require,module,exports){
module.exports = function() {
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
    return ret
  }
  var args = [].slice.call(arguments),
    arr = ktag.apply(null, args)
  return arr.join('')
}
},{}]},{},[2])(2)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJjb3B5LmpzIiwiaW5kZXguanMiLCJ0YWcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9sQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGFyZ3YpIHtcclxuICB2YXIgY29wID0gZnVuY3Rpb24odil7XHJcbiAgICB2YXIgbyA9IHt9XHJcbiAgICBmb3IodmFyIGF0dHIgaW4gdil7XHJcbiAgICAgIG9bYXR0cl0gPSB2W2F0dHJdXHJcbiAgICB9XHJcbiAgICByZXR1cm4gb1xyXG4gIH1cclxuICB2YXIgY2xvbmUgPSBmdW5jdGlvbih2KSB7XHJcbiAgICByZXR1cm4gdHlwZW9mIHYgPT0gJ29iamVjdCcgJiYgY29wKHYpXHJcbiAgfVxyXG4gIHJldHVybiBjbG9uZShhcmd2KVxyXG59IiwiLyoqIFxyXG4gKiBLZWV0LmpzIHYyLjEuMCBBbHBoYSByZWxlYXNlOiBodHRwczovL2dpdGh1Yi5jb20vc3lhcnVsL2tlZXRcclxuICogYW4gQVBJIGZvciB3ZWIgYXBwbGljYXRpb25cclxuICpcclxuICogPDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8IEtlZXQuanMgPj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+XHJcbiAqXHJcbiAqIENvcHlyaWdodCAyMDE3LCBTaGFocnVsIE5pemFtIFNlbGFtYXRcclxuICogUmVsZWFzZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlLlxyXG4gKi9cclxuJ3VzZSBzdHJpY3QnXHJcbnZhciBjb3B5ID0gcmVxdWlyZSgnLi9jb3B5JylcclxudmFyIHRhZyA9IHJlcXVpcmUoJy4vdGFnJylcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gS2VldFxyXG5cclxuZnVuY3Rpb24gS2VldCh0YWdOYW1lLCBjb250ZXh0KSB7XHJcbiAgdmFyIGN0eCA9IHRoaXNcclxuICAsICAgYXJndiA9IFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzKVxyXG4gICwgICBjb250ZXh0ID0gYXJndi5maWx0ZXIoZnVuY3Rpb24oYykgeyAgICBcclxuICAgICAgICByZXR1cm4gdHlwZW9mIGMgPT09ICdvYmplY3QnXHJcbiAgICAgIH0pWzBdXHJcbiAgLCAgIGdldElkID0gZnVuY3Rpb24oaWQpIHtcclxuICAgICAgICByZXR1cm4gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpXHJcbiAgICAgIH1cclxuICAsICAgdGVzdEV2YWwgPSBmdW5jdGlvbihldikge1xyXG4gICAgICAgIHRyeSB7IHJldHVybiBldmFsKGV2KSB9IFxyXG4gICAgICAgIGNhdGNoIChlKSB7IHJldHVybiBmYWxzZSB9XHJcbiAgICAgIH1cclxuICAsICAgZ2VuRWxlbWVudCA9IGZ1bmN0aW9uKGNoaWxkKXtcclxuICAgICAgICB2YXIgdGVtcERpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXHJcbiAgICAgICAgdmFyIGNsb25lQ2hpbGQgPSBjb3B5KGNoaWxkKVxyXG4gICAgICAgIGRlbGV0ZSBjbG9uZUNoaWxkLnRlbXBsYXRlXHJcbiAgICAgICAgZGVsZXRlIGNsb25lQ2hpbGQudGFnXHJcbiAgICAgICAgZGVsZXRlIGNsb25lQ2hpbGQuc3R5bGVcclxuICAgICAgICBkZWxldGUgY2xvbmVDaGlsZC5fX3JlZl9fXHJcbiAgICAgICAgZm9yKHZhciBhdHRyIGluIGNsb25lQ2hpbGQpe1xyXG4gICAgICAgICAgaWYodHlwZW9mIGNsb25lQ2hpbGRbYXR0cl0gPT09ICdmdW5jdGlvbicpe1xyXG4gICAgICAgICAgICBkZWxldGUgY2xvbmVDaGlsZFthdHRyXVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgcyA9IHRhZyhjaGlsZC50YWcsIGNoaWxkLnRlbXBsYXRlID8gY2hpbGQudGVtcGxhdGUgOiAnJywgY2xvbmVDaGlsZCwgY2hpbGQuc3R5bGUpXHJcbiAgICAgICAgdGVtcERpdi5pbm5lckhUTUwgPSBzXHJcbiAgICAgICAgaWYoY2hpbGQudGFnID09PSAnaW5wdXQnKXtcclxuICAgICAgICAgIGlmIChjaGlsZC5jaGVja2VkKSBcclxuICAgICAgICAgICAgdGVtcERpdi5jaGlsZE5vZGVzWzBdLmNoZWNrZWQgPSB0cnVlXHJcbiAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHRlbXBEaXYuY2hpbGROb2Rlc1swXS5yZW1vdmVBdHRyaWJ1dGUoJ2NoZWNrZWQnKVxyXG4gICAgICAgIH1cclxuICAgICAgICBwcm9jZXNzX2V2ZW50KHRlbXBEaXYpXHJcbiAgICAgICAgcmV0dXJuIHRlbXBEaXYuY2hpbGROb2Rlc1swXVxyXG4gICAgICB9XHJcbiAgLCAgIHBhcnNlU3RyID0gZnVuY3Rpb24oYXBwT2JqLCB3YXRjaCl7XHJcbiAgICAgICAgaWYodHlwZW9mIGFwcE9iaiAhPSAnb2JqZWN0JykgdGhyb3cgbmV3IEVycm9yKCdpbnN0YW5jZSBpcyBub3QgYW4gb2JqZWN0JylcclxuICAgICAgICB2YXIgc3RyID0gYXBwT2JqLnRlbXBsYXRlXHJcbiAgICAgICAgLCAgIGNoaWxkcyA9IHN0ci5tYXRjaCgve3soW157fV0rKX19L2csICckMScpXHJcbiAgICAgICAgLCAgIHJlZ2NcclxuICAgICAgICAsICAgY2hpbGRcclxuICAgICAgICAsICAgdGVtcERpdlxyXG4gICAgICAgICwgICBlbGVtQXJyID0gW11cclxuXHJcbiAgICAgICAgaWYoY2hpbGRzKXtcclxuXHJcbiAgICAgICAgICBpZihBcnJheS5pc0FycmF5KGFwcE9iai5saXN0KSkge1xyXG4gICAgICAgICAgICAgIHZhciBhcnJQcm9wcyA9IHN0ci5tYXRjaCgve3soW157fV0rKX19L2csICckMScpLCB0bXBsU3RyID0gJycsIHRtcGxcclxuICAgICAgICAgICAgICBhcHBPYmoubGlzdC5mb3JFYWNoKGZ1bmN0aW9uKHIpIHtcclxuICAgICAgICAgICAgICAgIHRtcGwgPSBzdHJcclxuICAgICAgICAgICAgICAgIGFyclByb3BzLmZvckVhY2goZnVuY3Rpb24ocykge1xyXG4gICAgICAgICAgICAgICAgICB2YXIgcmVwID0gcy5yZXBsYWNlKC97eyhbXnt9XSspfX0vZywgJyQxJylcclxuICAgICAgICAgICAgICAgICAgdG1wbCA9IHRtcGwucmVwbGFjZSgve3soW157fV0rKX19LywgcltyZXBdKVxyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIHRlbXBEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxyXG4gICAgICAgICAgICAgICAgdGVtcERpdi5pbm5lckhUTUwgPSB0bXBsXHJcbiAgICAgICAgICAgICAgICBwcm9jZXNzX2V2ZW50KHRlbXBEaXYpXHJcbiAgICAgICAgICAgICAgICBlbGVtQXJyLnB1c2godGVtcERpdi5jaGlsZE5vZGVzWzBdKVxyXG4gICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgd2F0Y2hlcjMoYXBwT2JqLmxpc3QpXHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjaGlsZHMuZm9yRWFjaChmdW5jdGlvbihjLCBpbmRleCl7XHJcbiAgICAgICAgICAgICAgcmVnYyA9IGMucmVwbGFjZSgve3soW157fV0rKX19L2csICckMScpXHJcbiAgICAgICAgICAgICAgLy8gc2tpcCB0YWdzIHdoaWNoIG5vdCBiZWluZyBkZWNsYXJlZCB5ZXRcclxuICAgICAgICAgICAgICBpZihjb250ZXh0KXtcclxuICAgICAgICAgICAgICAgIC8vIGNoZWNrIGNsb3N1cmUgb2JqZWN0XHJcbiAgICAgICAgICAgICAgICBjaGlsZCA9IGNvbnRleHRbcmVnY10gPyBjb250ZXh0W3JlZ2NdIDogZmFsc2VcclxuICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgLy8gY2hlY2sgaWYgY3VycmVudCAgb2JqZWN0ciBoYXMgcHJvcFxyXG4gICAgICAgICAgICAgICAgY2hpbGQgPSBhcHBPYmpbcmVnY11cclxuICAgICAgICAgICAgICAgIC8vIGNoZWNrIGdsb2JhbCBvYmplY3RcclxuICAgICAgICAgICAgICAgIGlmKCFjaGlsZCkgY2hpbGQgPSB0ZXN0RXZhbChyZWdjKVxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICBpZihjaGlsZCAmJiB0eXBlb2YgY2hpbGQgPT09ICdvYmplY3QnKXtcclxuICAgICAgICAgICAgICAgIHZhciBuZXdFbGVtZW50ID0gZ2VuRWxlbWVudChjaGlsZClcclxuICAgICAgICAgICAgICAgIGVsZW1BcnIucHVzaChuZXdFbGVtZW50KVxyXG4gICAgICAgICAgICAgIH0gZWxzZSBpZighY2hpbGQpe1xyXG4gICAgICAgICAgICAgICAgdGVtcERpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXHJcbiAgICAgICAgICAgICAgICB0ZW1wRGl2LmlubmVySFRNTCA9IGNcclxuICAgICAgICAgICAgICAgIGVsZW1BcnIucHVzaCh0ZW1wRGl2LmNoaWxkTm9kZXNbMF0pXHJcbiAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAvLyB3YXRjaCBvYmplY3Qgc3RhdGVcclxuICAgICAgICAgICAgICBpZih3YXRjaCAmJiBjaGlsZCkge1xyXG4gICAgICAgICAgICAgICAgd2F0Y2hlcihjaGlsZCwgaW5kZXgpXHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgdGVtcERpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXHJcbiAgICAgICAgICB0ZW1wRGl2LmlubmVySFRNTCA9IHN0clxyXG4gICAgICAgICAgcHJvY2Vzc19ldmVudCh0ZW1wRGl2KVxyXG4gICAgICAgICAgZWxlbUFyci5wdXNoKHRlbXBEaXYuY2hpbGROb2Rlc1swXSlcclxuICAgICAgICAgIHdhdGNoZXIyKGFwcE9iailcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGVsZW1BcnJcclxuICB9XHJcblxyXG4gIHZhciBwcm9jZXNzX2V2ZW50ID0gZnVuY3Rpb24oa05vZGUpIHtcclxuICAgIHZhciBsaXN0S25vZGVDaGlsZCA9IFtdLCBoYXNrLCBldnROYW1lLCBldnRoYW5kbGVyLCBoYW5kbGVyLCBpc0hhbmRsZXIsIGFyZ3YsIGksIGF0dHMsIHYsIHJlbSA9IFtdXHJcbiAgICBsb29wQ2hpbGRzKGxpc3RLbm9kZUNoaWxkLCBrTm9kZSlcclxuICAgIGxpc3RLbm9kZUNoaWxkLmZvckVhY2goZnVuY3Rpb24oYykge1xyXG4gICAgICBpZiAoYy5ub2RlVHlwZSA9PT0gMSAmJiBjLmhhc0F0dHJpYnV0ZXMoKSkge1xyXG4gICAgICAgIGkgPSAwXHJcbiAgICAgICAgZnVuY3Rpb24gbmV4dCgpe1xyXG4gICAgICAgICAgYXR0cyA9IGMuYXR0cmlidXRlc1xyXG4gICAgICAgICAgaWYoaSA8IGF0dHMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIGhhc2sgPSAvXmstLy50ZXN0KGF0dHNbaV0ubm9kZU5hbWUpXHJcbiAgICAgICAgICAgIGlmKGhhc2spe1xyXG4gICAgICAgICAgICAgIGV2dE5hbWUgPSBhdHRzW2ldLm5vZGVOYW1lLnNwbGl0KCctJylbMV1cclxuICAgICAgICAgICAgICBldnRoYW5kbGVyID0gYXR0c1tpXS5ub2RlVmFsdWVcclxuICAgICAgICAgICAgICBoYW5kbGVyID0gZXZ0aGFuZGxlci5zcGxpdCgnKCcpXHJcbiAgICAgICAgICAgICAgaXNIYW5kbGVyID0gdGVzdEV2YWwoY3R4LmJhc2VbaGFuZGxlclswXV0pXHJcbiAgICAgICAgICAgICAgaWYodHlwZW9mIGlzSGFuZGxlciA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgICAgICAgICAgcmVtLnB1c2goYXR0c1tpXS5ub2RlTmFtZSlcclxuICAgICAgICAgICAgICAgIGMuYWRkRXZlbnRMaXN0ZW5lcihldnROYW1lLCBmdW5jdGlvbihldnQpe1xyXG4gICAgICAgICAgICAgICAgICBhcmd2ID0gW11cclxuICAgICAgICAgICAgICAgICAgYXJndi5wdXNoKGV2dClcclxuICAgICAgICAgICAgICAgICAgdiA9IGhhbmRsZXJbMV0uc2xpY2UoMCwgLTEpLnNwbGl0KCcsJykuZmlsdGVyKGZ1bmN0aW9uKGYpe1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmICE9ICcnXHJcbiAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgIGlmKHYubGVuZ3RoKSB2LmZvckVhY2goZnVuY3Rpb24odil7IGFyZ3YucHVzaCh2KSB9KVxyXG4gICAgICAgICAgICAgICAgICBpc0hhbmRsZXIuYXBwbHkoYywgYXJndilcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGkrK1xyXG4gICAgICAgICAgICBuZXh0KClcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJlbS5tYXAoZnVuY3Rpb24oZil7IGMucmVtb3ZlQXR0cmlidXRlKGYpIH0pXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIG5leHQoKVxyXG4gICAgICB9XHJcbiAgICB9KVxyXG4gICAgbGlzdEtub2RlQ2hpbGQgPSBbXVxyXG4gIH1cclxuXHJcbiAgdGhpcy52ZG9tID0gZnVuY3Rpb24oKXtcclxuICAgIHZhciBlbGUgPSBnZXRJZChjdHguZWwpXHJcbiAgICBpZihlbGUpIHJldHVybiBlbGVcclxuICB9XHJcblxyXG4gIHRoaXMuZmx1c2ggPSBmdW5jdGlvbihjb21wb25lbnQpe1xyXG4gICAgdmFyIGVsZSA9IGdldElkKGNvbXBvbmVudCkgfHwgZ2V0SWQoY3R4LmVsKVxyXG4gICAgaWYoZWxlKSBlbGUuaW5uZXJIVE1MID0gJydcclxuICAgIHJldHVybiB0aGlzXHJcbiAgfVxyXG5cclxuICAvKipcclxuICAqIHJlbmRlciBjb21wb25lbnQgdG8gRE9NXHJcbiAgKi9cclxuXHJcbiAgdGhpcy5yZW5kZXIgPSBmdW5jdGlvbigpe1xyXG4gICAgdmFyIGVsZSA9IGdldElkKGN0eC5lbClcclxuICAgIGlmKCFlbGUpe1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2Nhbm5vdCBmaW5kIERPTSB3aXRoIGlkOiAnK2N0eC5lbCsnIHNraXAgcmVuZGVyaW5nLi4nKVxyXG4gICAgfVxyXG4gICAgaWYoY29udGV4dCkgY3R4LmJhc2UgPSBjb250ZXh0XHJcbiAgICB2YXIgZWxBcnIgPSBwYXJzZVN0cihjdHguYmFzZSwgdHJ1ZSlcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZWxBcnIubGVuZ3RoOyBpKyspIHtcclxuICAgICAgZWxlLmFwcGVuZENoaWxkKGVsQXJyW2ldKVxyXG5cclxuICAgICAgaWYoaSA9PT0gZWxBcnIubGVuZ3RoIC0gMSl7XHJcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignX2xvYWRlZCcsIHdpbmRvdy5fbG9hZGVkICYmIHR5cGVvZiB3aW5kb3cuX2xvYWRlZCA9PT0gJ2Z1bmN0aW9uJyA/IHdpbmRvdy5fbG9hZGVkKGN0eC5lbCkgOiBudWxsLCBmYWxzZSlcclxuXHJcbiAgICAgICAgaWYodHlwZW9mIHdpbmRvdy5NdXRhdGlvbk9ic2VydmVyID09ICdmdW5jdGlvbicpe1xyXG4gICAgICAgICAgdmFyIG9ic2VydmVyID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIoZnVuY3Rpb24obXV0YXRpb25zKXtcclxuICAgICAgICAgICAgaWYodHlwZW9mIGN0eC5jb21wb25lbnRPblVwZGF0ZSA9PSAnZnVuY3Rpb24nKSBjdHguY29tcG9uZW50T25VcGRhdGUuYXBwbHkoY3R4LCBtdXRhdGlvbnMpXHJcbiAgICAgICAgICB9KVxyXG5cclxuICAgICAgICAgIHZhciBjb25maWcgPSB7XHJcbiAgICAgICAgICAgIGF0dHJpYnV0ZXM6IHRydWUsXHJcbiAgICAgICAgICAgIGNoaWxkTGlzdDogdHJ1ZSxcclxuICAgICAgICAgICAgY2hhcmFjdGVyRGF0YTogdHJ1ZSxcclxuICAgICAgICAgICAgc3VidHJlZTogdHJ1ZVxyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIG9ic2VydmVyLm9ic2VydmUoZWxlLCBjb25maWcpXHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgfVxyXG5cclxuICB0aGlzLnVwZGF0ZSA9IGZ1bmN0aW9uKGFwcE9iail7XHJcbiAgICB2YXIgZWxlID0gZ2V0SWQoY3R4LmVsKVxyXG4gICAgdmFyIGVsQXJyID0gcGFyc2VTdHIoYXBwT2JqLCB0cnVlKVxyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBlbEFyci5sZW5ndGg7IGkrKykge1xyXG4gICAgICBlbGUucmVwbGFjZUNoaWxkKGVsQXJyW2ldLCBlbGUuY2hpbGROb2Rlc1tpXSlcclxuICAgICAgaWYoaSA9PT0gZWxBcnIubGVuZ3RoIC0gMSl7XHJcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignX3VwZGF0ZScsIHdpbmRvdy5fdXBkYXRlICYmIHR5cGVvZiB3aW5kb3cuX3VwZGF0ZSA9PT0gJ2Z1bmN0aW9uJyA/IHdpbmRvdy5fdXBkYXRlKGN0eC5lbCkgOiBudWxsLCBmYWxzZSlcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgdmFyIHdhdGNoZXIgPSBmdW5jdGlvbihpbnN0YW5jZSwgaW5kZXgpe1xyXG4gICAgdmFyIG9iaiwgYXR0ciwgYXR0cjIsIGVsZSwgY29weUluc3RhbmNlLCBuZXdFbGVtXHJcbiAgICBmb3IgKGF0dHIgaW4gaW5zdGFuY2Upe1xyXG4gICAgICBpbnN0YW5jZS53YXRjaChhdHRyLCBmdW5jdGlvbihpZHgsIG8sIG4pIHtcclxuICAgICAgICBmb3IgKGF0dHIyIGluIGluc3RhbmNlKXtcclxuICAgICAgICAgIGluc3RhbmNlLnVud2F0Y2goYXR0cjIpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIG9iaiA9IHt9XHJcbiAgICAgICAgb2JqW2lkeF0gPSBuXHJcbiAgICAgICAgZWxlID0gZ2V0SWQoY3R4LmVsKVxyXG4gICAgICAgIE9iamVjdC5hc3NpZ24oaW5zdGFuY2UsIG9iailcclxuICAgICAgICBuZXdFbGVtID0gZ2VuRWxlbWVudChpbnN0YW5jZSlcclxuICAgICAgICB1cGRhdGVFbGVtKGVsZS5jaGlsZE5vZGVzW2luZGV4XSwgbmV3RWxlbSlcclxuICAgICAgICB3YXRjaGVyKGluc3RhbmNlLCBpbmRleClcclxuICAgICAgfSlcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHZhciB3YXRjaGVyMiA9IGZ1bmN0aW9uKGluc3RhbmNlKXtcclxuICAgIHZhciBvYmosIGF0dHIsIGF0dHIyLCBlbGUsIGNvcHlJbnN0YW5jZSwgbmV3RWxlbVxyXG4gICAgZm9yIChhdHRyIGluIGluc3RhbmNlKXtcclxuICAgICAgaW5zdGFuY2Uud2F0Y2goYXR0ciwgZnVuY3Rpb24oaWR4LCBvLCBuKSB7XHJcbiAgICAgICAgZm9yIChhdHRyMiBpbiBpbnN0YW5jZSl7XHJcbiAgICAgICAgICBpbnN0YW5jZS51bndhdGNoKGF0dHIyKVxyXG4gICAgICAgIH1cclxuICAgICAgICBvYmogPSB7fVxyXG4gICAgICAgIG9ialtpZHhdID0gblxyXG4gICAgICAgIGVsZSA9IGdldElkKGN0eC5lbClcclxuICAgICAgICBPYmplY3QuYXNzaWduKGluc3RhbmNlLCBvYmopXHJcbiAgICAgICAgbmV3RWxlbSA9IGdlbkVsZW1lbnQoaW5zdGFuY2UpXHJcbiAgICAgICAgdXBkYXRlRWxlbShlbGUsIG5ld0VsZW0pXHJcbiAgICAgICAgd2F0Y2hlcjIoaW5zdGFuY2UpXHJcbiAgICAgIH0pXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICB2YXIgd2F0Y2hlcjMgPSBmdW5jdGlvbihpbnN0YW5jZSl7XHJcbiAgICAvLyBjb25zb2xlLmxvZyhpbnN0YW5jZSlcclxuICAgIHZhciBwcmlzdGluZUxlbiA9IGNvcHkoaW5zdGFuY2UpLCBvcHNMaXN0LCBvcCwgcXVlcnlcclxuICAgIFxyXG4gICAgb3BzTGlzdCA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gWydwdXNoJywgJ3BvcCcsICdzaGlmdCcsICd1bnNoaWZ0JywgJ3NwbGljZScsICd1cGRhdGUnXSB9XHJcblxyXG4gICAgb3AgPSBvcHNMaXN0KClcclxuXHJcbiAgICBxdWVyeSA9IGZ1bmN0aW9uKG9wcywgYXJndnMpIHtcclxuICAgICAgb3AgPSBbXVxyXG4gICAgICBpZihvcHMgPT09ICdwdXNoJylcclxuICAgICAgICBhcnJQcm90b1B1c2goYXJndnNbMF0pXHJcbiAgICAgIGVsc2UgaWYob3BzID09PSAncG9wJylcclxuICAgICAgICBhcnJQcm90b1BvcCgpXHJcbiAgICAgIGVsc2UgaWYob3BzID09PSAnc2hpZnQnKVxyXG4gICAgICAgIGFyclByb3RvU2hpZnQoKVxyXG4gICAgICBlbHNlIGlmKG9wcyA9PT0gJ3Vuc2hpZnQnKVxyXG4gICAgICAgIGFyclByb3RvVW5TaGlmdC5hcHBseShudWxsLCBhcmd2cylcclxuICAgICAgZWxzZSBpZihvcHMgPT09ICdzcGxpY2UnKVxyXG4gICAgICAgIGFyclByb3RvU3BsaWNlLmFwcGx5KG51bGwsIGFyZ3ZzKVxyXG4gICAgICBlbHNlXHJcbiAgICAgICAgYXJyUHJvdG9VcGRhdGUuYXBwbHkobnVsbCwgYXJndnMpXHJcbiAgICAgIG9wID0gb3BzTGlzdCgpXHJcbiAgICAgIHByaXN0aW5lTGVuID0gY29weShpbnN0YW5jZSlcclxuICAgIH1cclxuXHJcbiAgICBvcC5mb3JFYWNoKGZ1bmN0aW9uKGYsIGksIHIpe1xyXG4gICAgICBpbnN0YW5jZVtmXSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGlmKG9wLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgIHZhciBmYXJndiA9IFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzKVxyXG4gICAgICAgICAgLy8gaWYoIXByaXN0aW5lTGVuW2Zhcmd2WzBdXSkgcmV0dXJuIGZhbHNlXHJcbiAgICAgICAgICBpZihmID09PSAndXBkYXRlJylcclxuICAgICAgICAgICAgZmFyZ3ZbMV0gPSBPYmplY3QuYXNzaWduKHByaXN0aW5lTGVuW2Zhcmd2WzBdXSwgZmFyZ3ZbMV0pXHJcbiAgICAgICAgICBBcnJheS5wcm90b3R5cGVbZl0uYXBwbHkodGhpcywgZmFyZ3YpXHJcbiAgICAgICAgICAvL3Byb3BhZ2F0ZSBzcGxpY2Ugd2l0aCBzaW5nbGUgYXJndW1lbnRzXHJcbiAgICAgICAgICBpZihmYXJndi5sZW5ndGggPT09IDEgJiYgZiA9PT0gJ3NwbGljZScpXHJcbiAgICAgICAgICAgIGZhcmd2LnB1c2gocHJpc3RpbmVMZW4ubGVuZ3RoIC0gZmFyZ3ZbMF0pXHJcbiAgICAgICAgICBxdWVyeShmLCBmYXJndilcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0pXHJcbiAgfVxyXG5cclxuICB2YXIgYXJyUHJvdG9QdXNoID0gZnVuY3Rpb24obmV3T2JqKXtcclxuICAgIHZhciBlbGUgPSBnZXRJZChjdHguZWwpXHJcbiAgICBlbGUuYXBwZW5kQ2hpbGQoZ2VuVGVtcGxhdGUobmV3T2JqKSlcclxuICB9XHJcblxyXG4gIHZhciBhcnJQcm90b1BvcCA9IGZ1bmN0aW9uKCl7XHJcbiAgICB2YXIgZWxlID0gZ2V0SWQoY3R4LmVsKVxyXG4gICAgaWYoZWxlLmNoaWxkTm9kZXMubGVuZ3RoKSB7XHJcbiAgICAgIGVsZS5yZW1vdmVDaGlsZChlbGUubGFzdENoaWxkKVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgdmFyIGFyclByb3RvU2hpZnQgPSBmdW5jdGlvbigpe1xyXG4gICAgdmFyIGVsZSA9IGdldElkKGN0eC5lbClcclxuICAgIGlmKGVsZS5jaGlsZE5vZGVzLmxlbmd0aCkge1xyXG4gICAgICBlbGUucmVtb3ZlQ2hpbGQoZWxlLmZpcnN0Q2hpbGQpXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICB2YXIgYXJyUHJvdG9VblNoaWZ0ID0gZnVuY3Rpb24oKXtcclxuICAgIHZhciBhcmd2ID0gW10uc2xpY2UuY2FsbChhcmd1bWVudHMpXHJcbiAgICB2YXIgZWxlID0gZ2V0SWQoY3R4LmVsKVxyXG4gICAgdmFyIGkgPSBhcmd2Lmxlbmd0aCAtIDFcclxuICAgIHdoaWxlKGkgPiAtMSkge1xyXG4gICAgICBlbGUuaW5zZXJ0QmVmb3JlKGdlblRlbXBsYXRlKGFyZ3ZbaV0pLCBlbGUuZmlyc3RDaGlsZClcclxuICAgICAgaS0tXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICB2YXIgYXJyUHJvdG9TcGxpY2UgPSBmdW5jdGlvbigpe1xyXG4gICAgdmFyIGVsZSA9IGdldElkKGN0eC5lbClcclxuICAgICwgICBjaGlsZExlblxyXG4gICAgLCAgIGxlblxyXG4gICAgLCAgIGlcclxuICAgICwgICBqXHJcbiAgICAsICAga1xyXG4gICAgLCAgIGNcclxuICAgICwgICB0ZW1wRGl2Q2hpbGRMZW5cclxuICAgICwgICB0ZW1wRGl2XHJcbiAgICAsICAgYXJndiA9IFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzKVxyXG4gICAgLCAgIHN0YXJ0ID0gW10uc2hpZnQuY2FsbChhcmd2KVxyXG4gICAgLCAgIGNvdW50XHJcbiAgICBpZih0eXBlb2YgYXJndlswXSA9PT0gJ251bWJlcicpe1xyXG4gICAgICBjb3VudCA9IFtdLnNoaWZ0LmNhbGwoYXJndilcclxuICAgIH1cclxuXHJcbiAgICB0ZW1wRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcclxuICAgIGlmKGFyZ3YubGVuZ3RoKXtcclxuICAgICAgaSA9IDBcclxuICAgICAgd2hpbGUoaSA8IGFyZ3YubGVuZ3RoKXtcclxuICAgICAgICB0ZW1wRGl2LmFwcGVuZENoaWxkKGdlblRlbXBsYXRlKGFyZ3ZbaV0pKVxyXG4gICAgICAgIGkrK1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgY2hpbGRMZW4gPSBjb3B5KGVsZS5jaGlsZE5vZGVzLmxlbmd0aClcclxuICAgIHRlbXBEaXZDaGlsZExlbiA9IGNvcHkodGVtcERpdi5jaGlsZE5vZGVzLmxlbmd0aClcclxuICAgIGlmIChjb3VudCAmJiBjb3VudCA+IDApIHtcclxuICAgICAgZm9yIChpID0gc3RhcnQ7IGkgPCBjaGlsZExlbiArIDE7IGkrKykge1xyXG4gICAgICAgIGxlbiA9IHN0YXJ0ICsgY291bnRcclxuICAgICAgICBpZiAoaSA8IGxlbikge1xyXG4gICAgICAgICAgZWxlLnJlbW92ZUNoaWxkKGVsZS5jaGlsZE5vZGVzW3N0YXJ0XSlcclxuICAgICAgICAgIGlmIChpID09PSBsZW4gLSAxICYmIHRlbXBEaXZDaGlsZExlbiA+IDApIHtcclxuICAgICAgICAgICAgYyA9IHN0YXJ0IC0gMVxyXG4gICAgICAgICAgICBmb3IgKGogPSBzdGFydDsgaiA8IHRlbXBEaXZDaGlsZExlbiArIHN0YXJ0OyBqKyspIHtcclxuICAgICAgICAgICAgICBpbnNlcnRBZnRlcih0ZW1wRGl2LmNoaWxkTm9kZXNbMF0sIGVsZS5jaGlsZE5vZGVzW2NdLCBlbGUpXHJcbiAgICAgICAgICAgICAgYysrXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSBpZiAoYXJndi5sZW5ndGgpIHtcclxuICAgICAgYyA9IHN0YXJ0IC0gMVxyXG4gICAgICBmb3IgKGsgPSBzdGFydDsgayA8IHRlbXBEaXZDaGlsZExlbiArIHN0YXJ0OyBrKyspIHtcclxuICAgICAgICBpbnNlcnRBZnRlcih0ZW1wRGl2LmNoaWxkTm9kZXNbMF0sIGVsZS5jaGlsZE5vZGVzW2NdLCBlbGUpXHJcbiAgICAgICAgYysrXHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIHZhciBhcnJQcm90b1VwZGF0ZSA9IGZ1bmN0aW9uKCl7XHJcbiAgICB2YXIgYXJndiA9IFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzKVxyXG4gICAgLCAgIGVsZSA9IGdldElkKGN0eC5lbClcclxuICAgICwgICBpbmRleCA9IFtdLnNoaWZ0LmNhbGwoYXJndilcclxuICAgIHVwZGF0ZUVsZW0oZWxlLmNoaWxkTm9kZXNbaW5kZXhdLCBnZW5UZW1wbGF0ZShhcmd2WzBdKSlcclxuICB9XHJcblxyXG4gIHZhciBnZW5UZW1wbGF0ZSA9IGZ1bmN0aW9uKG9iail7XHJcbiAgICB2YXIgYXJyUHJvcHMgPSBjdHguYmFzZS50ZW1wbGF0ZS5tYXRjaCgve3soW157fV0rKX19L2csICckMScpLCAgdG1wbCwgdGVtcERpdiwgZWxlXHJcbiAgICB0bXBsID0gY3R4LmJhc2UudGVtcGxhdGVcclxuICAgIGFyclByb3BzLmZvckVhY2goZnVuY3Rpb24ocykge1xyXG4gICAgICB2YXIgcmVwID0gcy5yZXBsYWNlKC97eyhbXnt9XSspfX0vZywgJyQxJylcclxuICAgICAgdG1wbCA9IHRtcGwucmVwbGFjZSgve3soW157fV0rKX19Lywgb2JqW3JlcF0pXHJcbiAgICB9KVxyXG4gICAgdGVtcERpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXHJcbiAgICB0ZW1wRGl2LmlubmVySFRNTCA9IHRtcGxcclxuICAgIHJldHVybiB0ZW1wRGl2LmNoaWxkTm9kZXNbMF1cclxuICB9XHJcblxyXG4gIHZhciBsb29wQ2hpbGRzID0gZnVuY3Rpb24oYXJyLCBlbGVtKSB7XHJcbiAgICBmb3IgKHZhciBjaGlsZCA9IGVsZW0uZmlyc3RDaGlsZDsgY2hpbGQgIT09IG51bGw7IGNoaWxkID0gY2hpbGQubmV4dFNpYmxpbmcpIHtcclxuICAgICAgYXJyLnB1c2goY2hpbGQpXHJcbiAgICAgIGlmIChjaGlsZC5oYXNDaGlsZE5vZGVzKCkpIHtcclxuICAgICAgICBsb29wQ2hpbGRzKGFyciwgY2hpbGQpXHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIHZhciBpbnNlcnRBZnRlciA9IGZ1bmN0aW9uKG5ld05vZGUsIHJlZmVyZW5jZU5vZGUsIHBhcmVudE5vZGUpIHtcclxuICAgIHJlZmVyZW5jZU5vZGUucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUobmV3Tm9kZSwgcmVmZXJlbmNlTm9kZS5uZXh0U2libGluZylcclxuICB9XHJcblxyXG4gIHZhciBub2RlVXBkYXRlID0gZnVuY3Rpb24obmV3Tm9kZSwgb2xkTm9kZSkge1xyXG4gICAgaWYoIW5ld05vZGUpIHJldHVybiBmYWxzZVxyXG4gICAgdmFyIG9BdHRyID0gbmV3Tm9kZS5hdHRyaWJ1dGVzXHJcbiAgICB2YXIgb3V0cHV0ID0ge307XHJcbiAgICBpZihvQXR0cil7XHJcbiAgICAgIGZvcih2YXIgaSA9IG9BdHRyLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XHJcbiAgICAgICAgIG91dHB1dFtvQXR0cltpXS5uYW1lXSA9IG9BdHRyW2ldLnZhbHVlXHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIGZvciAodmFyIGlBdHRyIGluIG91dHB1dCkge1xyXG4gICAgICBpZihvbGROb2RlLmF0dHJpYnV0ZXNbaUF0dHJdICYmIG9sZE5vZGUuYXR0cmlidXRlc1tpQXR0cl0ubmFtZSA9PT0gaUF0dHIgJiYgb2xkTm9kZS5hdHRyaWJ1dGVzW2lBdHRyXS52YWx1ZSAhPSBvdXRwdXRbaUF0dHJdKXtcclxuICAgICAgICBvbGROb2RlLnNldEF0dHJpYnV0ZShpQXR0ciwgb3V0cHV0W2lBdHRyXSlcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgaWYob2xkTm9kZS50ZXh0Q29udGVudCAgPT09IFwiXCIgJiYgbmV3Tm9kZS50ZXh0Q29udGVudCApe1xyXG4gICAgICBvbGROb2RlLnRleHRDb250ZW50ID0gbmV3Tm9kZS50ZXh0Q29udGVudFxyXG4gICAgfVxyXG4gICAgb3V0cHV0ID0ge31cclxuICB9XHJcblxyXG4gIHZhciBub2RlVXBkYXRlSFRNTCA9IGZ1bmN0aW9uKG5ld05vZGUsIG9sZE5vZGUpIHtcclxuICAgIGlmKCFuZXdOb2RlKSByZXR1cm4gZmFsc2VcclxuICAgIGlmKG5ld05vZGUubm9kZVZhbHVlICE9PSBvbGROb2RlLm5vZGVWYWx1ZSlcclxuICAgICAgICBvbGROb2RlLm5vZGVWYWx1ZSA9IG5ld05vZGUubm9kZVZhbHVlXHJcbiAgfVxyXG5cclxuICB2YXIgdXBkYXRlRWxlbSA9IGZ1bmN0aW9uKG9sZEVsZW0sIG5ld0VsZW0pe1xyXG4gICAgdmFyIG9sZEFyciA9IFtdLCBuZXdBcnIgPSBbXVxyXG4gICAgb2xkQXJyLnB1c2gob2xkRWxlbSlcclxuICAgIG5ld0Fyci5wdXNoKG5ld0VsZW0pXHJcbiAgICBsb29wQ2hpbGRzKG9sZEFyciwgb2xkRWxlbSlcclxuICAgIGxvb3BDaGlsZHMobmV3QXJyLCBuZXdFbGVtKVxyXG4gICAgb2xkQXJyLmZvckVhY2goZnVuY3Rpb24oZWxlLCBpZHgsIGFycikge1xyXG4gICAgICBpZiAoZWxlLm5vZGVUeXBlID09PSAxICYmIGVsZS5oYXNBdHRyaWJ1dGVzKCkpIHtcclxuICAgICAgICBub2RlVXBkYXRlKG5ld0FycltpZHhdLCBlbGUpXHJcbiAgICAgIH0gZWxzZSBpZiAoZWxlLm5vZGVUeXBlID09PSAzKSB7XHJcbiAgICAgICAgbm9kZVVwZGF0ZUhUTUwobmV3QXJyW2lkeF0sIGVsZSlcclxuICAgICAgfVxyXG4gICAgICBpZihpZHggPT09IGFyci5sZW5ndGggLSAxKXtcclxuICAgICAgICBvbGRBcnIuc3BsaWNlKDApXHJcbiAgICAgICAgbmV3QXJyLnNwbGljZSgwKVxyXG4gICAgICB9XHJcbiAgICB9KVxyXG4gIH1cclxuICBcclxuICBpZiAoIU9iamVjdC5wcm90b3R5cGUud2F0Y2gpIHtcclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShPYmplY3QucHJvdG90eXBlLCAnd2F0Y2gnLCB7XHJcbiAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxyXG4gICAgICBjb25maWd1cmFibGU6IHRydWUsXHJcbiAgICAgIHdyaXRhYmxlOiBmYWxzZSxcclxuICAgICAgdmFsdWU6IGZ1bmN0aW9uKHByb3AsIGhhbmRsZXIpIHtcclxuICAgICAgICB2YXIgb2xkdmFsID0gdGhpc1twcm9wXSxcclxuICAgICAgICAgIG5ld3ZhbCA9IG9sZHZhbCxcclxuICAgICAgICAgIGdldHRlciA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3dmFsXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgc2V0dGVyID0gZnVuY3Rpb24odmFsKSB7XHJcbiAgICAgICAgICAgIG9sZHZhbCA9IG5ld3ZhbFxyXG4gICAgICAgICAgICByZXR1cm4gbmV3dmFsID0gaGFuZGxlci5jYWxsKHRoaXMsIHByb3AsIG9sZHZhbCwgdmFsKVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIGlmIChkZWxldGUgdGhpc1twcm9wXSkge1xyXG4gICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsIHByb3AsIHtcclxuICAgICAgICAgICAgZ2V0OiBnZXR0ZXIsXHJcbiAgICAgICAgICAgIHNldDogc2V0dGVyLFxyXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9KVxyXG4gIH1cclxuXHJcbiAgaWYgKCFPYmplY3QucHJvdG90eXBlLnVud2F0Y2gpIHtcclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShPYmplY3QucHJvdG90eXBlLCAndW53YXRjaCcsIHtcclxuICAgICAgZW51bWVyYWJsZTogZmFsc2UsXHJcbiAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcclxuICAgICAgd3JpdGFibGU6IGZhbHNlLFxyXG4gICAgICB2YWx1ZTogZnVuY3Rpb24ocHJvcCkge1xyXG4gICAgICAgIHZhciB2YWwgPSB0aGlzW3Byb3BdIFxyXG4gICAgICAgIGRlbGV0ZSB0aGlzW3Byb3BdIFxyXG4gICAgICAgIHRoaXNbcHJvcF0gPSB2YWxcclxuICAgICAgfVxyXG4gICAgfSlcclxuICB9XHJcblxyXG4gIGlmKCFBcnJheS5wcm90b3R5cGUudXBkYXRlKXtcclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShBcnJheS5wcm90b3R5cGUsICd1cGRhdGUnLCB7XHJcbiAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXHJcbiAgICAgICAgd3JpdGFibGU6IHRydWUsXHJcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uKGluZGV4LCB2YWx1ZSkgeyBcclxuICAgICAgICAgIHRoaXNbaW5kZXhdID0gdmFsdWVcclxuICAgICAgICB9XHJcbiAgICB9KVxyXG4gIH1cclxufVxyXG5cclxuS2VldC5wcm90b3R5cGUubGluayA9IGZ1bmN0aW9uKGlkLCB2YWx1ZSkge1xyXG4gIHZhciBhcmd2ID0gW10uc2xpY2UuY2FsbChhcmd1bWVudHMpXHJcblxyXG4gIHRoaXMuZWwgPSBhcmd2WzBdXHJcbiAgaWYgKGFyZ3YubGVuZ3RoID09PSAyKXtcclxuICAgIGlmKCFhcmd2WzFdLnRhZyl7XHJcbiAgICAgIGFyZ3ZbMV0udGFnID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpLnRhZ05hbWUudG9Mb3dlckNhc2UoKVxyXG4gICAgfVxyXG4gICAgdGhpcy5iYXNlID0gYXJndlsxXVxyXG4gIH1cclxuICB0aGlzLnJlbmRlcigpXHJcbiAgcmV0dXJuIHRoaXNcclxufVxyXG5cclxuS2VldC5wcm90b3R5cGUuY29tcG9zZSA9IGZ1bmN0aW9uKGluc3RhbmNlKSB7XHJcbiAgdGhpcy51cGRhdGUoaW5zdGFuY2UpXHJcbiAgcmV0dXJuIHRoaXNcclxufVxyXG5cclxuS2VldC5wcm90b3R5cGUubW91bnQgPSBmdW5jdGlvbihpbnN0YW5jZSkge1xyXG4gIHRoaXMuYmFzZSA9IGluc3RhbmNlXHJcbiAgcmV0dXJuIHRoaXNcclxufVxyXG5cclxuS2VldC5wcm90b3R5cGUuY2x1c3RlciA9IGZ1bmN0aW9uKCkge1xyXG4gIHZhciBhcmdzID0gW10uc2xpY2UuY2FsbChhcmd1bWVudHMpXHJcbiAgYXJncy5tYXAoZnVuY3Rpb24oZm4pe1xyXG4gICAgaWYodHlwZW9mIGZuID09PSAnZnVuY3Rpb24nKSBmbigpXHJcbiAgfSlcclxuICByZXR1cm4gdGhpc1xyXG59XHJcblxyXG5LZWV0LnByb3RvdHlwZS5saXN0ID0gZnVuY3Rpb24oKXtcclxuICByZXR1cm4gdGhpcy5iYXNlICYmIHRoaXMuYmFzZS5saXN0IHx8IFtdXHJcbn1cclxuXHJcbktlZXQucHJvdG90eXBlLmdldEJhc2UgPSBmdW5jdGlvbihjaGlsZCwgYXR0cmlidXRlLCBuZXdQcm9wKSB7XHJcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAyICYmIHRoaXMuYmFzZSlcclxuICAgIHRoaXMuYmFzZVtjaGlsZF1bYXR0cmlidXRlXSA9IG5ld1Byb3BcclxuICBlbHNlXHJcbiAgICByZXR1cm4gdGhpcy5iYXNlW2NoaWxkXVthdHRyaWJ1dGVdXHJcbn1cclxuXHJcbktlZXQucHJvdG90eXBlLmFkZENsYXNzID0gZnVuY3Rpb24oY2hpbGQsIG5ld0NsYXNzKSB7XHJcbiAgdmFyIGIgPSB0aGlzLmdldEJhc2UoY2hpbGQsICdjbGFzcycpXHJcblxyXG4gIHZhciBpc0FyciA9IGZ1bmN0aW9uKCkge1xyXG4gICAgYi5wdXNoKG5ld0NsYXNzKVxyXG4gICAgdGhpcy5nZXRCYXNlKGNoaWxkLCAnY2xhc3MnLCBiKVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIEFycmF5LmlzQXJyYXkoYikgJiYgaXNBcnIoKVxyXG59XHJcblxyXG5LZWV0LnByb3RvdHlwZS5yZW1vdmVDbGFzcyA9IGZ1bmN0aW9uKGNoaWxkLCBvbGRDbGFzcykge1xyXG4gIHZhciBiID0gdGhpcy5nZXRCYXNlKGNoaWxkLCAnY2xhc3MnKVxyXG5cclxuICB2YXIgaElkeCA9IGZ1bmN0aW9uKGlkeCkge1xyXG4gICAgYi5zcGxpY2UoaWR4LCAxKVxyXG4gICAgdGhpcy5nZXRCYXNlKGNoaWxkLCAnY2xhc3MnLCBiKVxyXG4gIH1cclxuXHJcbiAgdmFyIGlzQXJyID0gZnVuY3Rpb24oKSB7XHJcbiAgICB2YXIgaWR4ID0gYi5pbmRleE9mKG9sZENsYXNzKVxyXG4gICAgaWYgKH5pZHgpIGhJZHgoaWR4KVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIEFycmF5LmlzQXJyYXkoYikgJiYgaXNBcnIoKVxyXG59XHJcblxyXG5LZWV0LnByb3RvdHlwZS5zd2FwQ2xhc3MgPSBmdW5jdGlvbihjaGlsZCwgY29uZGl0aW9uLCBjbGFzc2VzQXJyYXkpIHtcclxuICB2YXIgYiA9IHRoaXMuZ2V0QmFzZShjaGlsZCwgJ2NsYXNzJylcclxuXHJcbiAgaWYgKGNvbmRpdGlvbikgY2xhc3Nlc0FycmF5LnJldmVyc2UoKVxyXG5cclxuICB2YXIgaElkeCA9IGZ1bmN0aW9uKGlkeCkge1xyXG4gICAgYi5zcGxpY2UoaWR4LCAxLCBjbGFzc2VzQXJyYXlbMV0pXHJcbiAgICB0aGlzLmdldEJhc2UoY2hpbGQsICdjbGFzcycsIGIpXHJcbiAgfVxyXG5cclxuICB2YXIgaXNBcnIgPSBmdW5jdGlvbigpIHtcclxuICAgIHZhciBpZHggPSBiLmluZGV4T2YoY2xhc3Nlc0FycmF5WzBdKVxyXG4gICAgaWYgKH5pZHgpIGhJZHgoaWR4KVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIEFycmF5LmlzQXJyYXkoYikgJiYgaXNBcnIoKVxyXG59XHJcblxyXG5LZWV0LnByb3RvdHlwZS5zd2FwQXR0ciA9IGZ1bmN0aW9uKGNoaWxkLCBjb25kaXRpb24sIHByb3BlcnR5QXJyYXksIGF0dHJpYnV0ZSkge1xyXG4gIGlmIChjb25kaXRpb24pIHByb3BlcnR5QXJyYXkucmV2ZXJzZSgpXHJcbiAgdGhpcy5nZXRCYXNlKGNoaWxkLCBhdHRyaWJ1dGUsIHByb3BlcnR5QXJyYXlbMF0pXHJcbn1cclxuXHJcbktlZXQucHJvdG90eXBlLnNldEF0dHIgPSBmdW5jdGlvbihjaGlsZCwgYXR0cmlidXRlLCBuZXdQcm9wZXJ0eSkge1xyXG4gIHRoaXMuZ2V0QmFzZShjaGlsZCwgYXR0cmlidXRlLCBuZXdQcm9wZXJ0eSlcclxufVxyXG5cclxuS2VldC5wcm90b3R5cGUudG9nZ2xlID0gZnVuY3Rpb24oY2hpbGQsIGRpc3BsYXkpIHtcclxuICB2YXIgc3R5bCA9IHRoaXMuYmFzZVtjaGlsZF0uc3R5bGVcclxuICBPYmplY3QuYXNzaWduKHN0eWwsIHsgZGlzcGxheTogZGlzcGxheSB9KVxyXG4gIHRoaXMuYmFzZVtjaGlsZF0uc3R5bGUgPSBzdHlsXHJcbn1cclxuXHJcbktlZXQucHJvdG90eXBlLmNvbnRlbnRVcGRhdGUgPSBmdW5jdGlvbihjaGlsZCwgY29udGVudCkge1xyXG4gIHRoaXMuYmFzZVtjaGlsZF0udGVtcGxhdGUgPSBjb250ZW50XHJcbn0iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCkge1xyXG4gIGZ1bmN0aW9uIGt0YWcodGFnLCB2YWx1ZSwgYXR0cmlidXRlcywgc3R5bGVzKSB7XHJcbiAgICB2YXIgYXR0ciwgaWR4LCB0ZSwgYSA9IFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzKSxcclxuICAgICAgcmV0ID0gWyc8JywgYVswXSwgJz4nLCBhWzFdLCAnPC8nLCBhWzBdLCAnPiddXHJcbiAgICBpZiAoYS5sZW5ndGggPiAyICYmIHR5cGVvZiBhWzJdID09PSAnb2JqZWN0Jykge1xyXG4gICAgICBmb3IgKGF0dHIgaW4gYVsyXSkge1xyXG4gICAgICAgIGlmKHR5cGVvZiBhWzJdW2F0dHJdID09PSAnYm9vbGVhbicgJiYgYVsyXVthdHRyXSlcclxuICAgICAgICAgIHJldC5zcGxpY2UoMiwgMCwgJyAnLCBhdHRyKVxyXG4gICAgICAgIGVsc2UgaWYoYXR0ciA9PT0gJ2NsYXNzJyAmJiBBcnJheS5pc0FycmF5KGFbMl1bYXR0cl0pKVxyXG4gICAgICAgICAgcmV0LnNwbGljZSgyLCAwLCAnICcsIGF0dHIsICc9XCInLCBhWzJdW2F0dHJdLmpvaW4oJyAnKS50cmltKCksICdcIicpXHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgcmV0LnNwbGljZSgyLCAwLCAnICcsIGF0dHIsICc9XCInLCBhWzJdW2F0dHJdLCAnXCInKVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBpZiAoYS5sZW5ndGggPiAzICYmIHR5cGVvZiBhWzNdID09PSAnb2JqZWN0Jykge1xyXG4gICAgICBpZHggPSByZXQuaW5kZXhPZignPicpXHJcbiAgICAgIHRlID0gW2lkeCwgMCwgJyBzdHlsZT1cIiddXHJcbiAgICAgIGZvciAoYXR0ciBpbiBhWzNdKSB7XHJcbiAgICAgICAgdGUucHVzaChhdHRyKVxyXG4gICAgICAgIHRlLnB1c2goJzonKVxyXG4gICAgICAgIHRlLnB1c2goYVszXVthdHRyXSlcclxuICAgICAgICB0ZS5wdXNoKCc7JylcclxuICAgICAgfVxyXG4gICAgICB0ZS5wdXNoKCdcIicpXHJcbiAgICAgIHJldC5zcGxpY2UuYXBwbHkocmV0LCB0ZSlcclxuICAgIH1cclxuICAgIHJldHVybiByZXRcclxuICB9XHJcbiAgdmFyIGFyZ3MgPSBbXS5zbGljZS5jYWxsKGFyZ3VtZW50cyksXHJcbiAgICBhcnIgPSBrdGFnLmFwcGx5KG51bGwsIGFyZ3MpXHJcbiAgcmV0dXJuIGFyci5qb2luKCcnKVxyXG59Il19
