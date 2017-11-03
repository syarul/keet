(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Keet = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = function(argv) {
  var cop = function(v){
    var o = {}
    if(typeof v !== 'object'){
      o.copy = v
      return o.copy
    }else {
      for(var attr in v){
        o[attr] = v[attr]
      }
    }
    return o
  }
  return Array.isArray(argv) ? argv.map(function(v) {
    return v
  }) : cop(argv)
}
},{}],2:[function(require,module,exports){
/** 
 * Keet.js v2.2.2 Alpha release: https://github.com/syarul/keet
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
        var s = child.tag ? tag(child.tag, child.template ? child.template : '', cloneChild, child.style) : child.template
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
                process_event(tempDiv)
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
                argv = []
                v = handler[1].slice(0, -1).split(',').filter(function(f){
                  return f != ''
                })
                if(v.length) v.forEach(function(v){ argv.push(v) })

                c.addEventListener(evtName, isHandler.bind.apply(isHandler, [c].concat(argv)), false)

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
      // throw new Error('cannot find DOM with id: '+ctx.el+' skip rendering..')
      console.warn('cannot find DOM with id: '+ctx.el+' skip rendering..')
    }
    if(context) ctx.base = context
    var elArr = parseStr(ctx.base, true)
    for (var i = 0; i < elArr.length; i++) {
      ele.appendChild(elArr[i])

      if(i === elArr.length - 1){
        document.addEventListener('_loaded', window._loaded && typeof window._loaded === 'function' ? window._loaded(ctx.el) : null, false)

        /*if(typeof window.MutationObserver == 'function'){
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
        }*/


      }
    }

  }

  this.update = function(appObj){
    var ele = getId(ctx.el)
    var elArr = parseStr(appObj, true)
    ele.innerHTML = ''
    for (var i = 0; i < elArr.length; i++) {
      ele.appendChild(elArr[i])
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
        updateElem(ele, newElem, true)
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
    })
  }

  var arrProtoPush = function(newObj){
    var ele = getId(ctx.el)
    ele.appendChild(genTemplate(newObj))
  }

  var arrProtoPop = function(){
    var ele = getId(ctx.el)
    ele.removeChild(ele.lastChild)
  }

  var arrProtoShift = function(){
    var ele = getId(ctx.el)
    ele.removeChild(ele.firstChild)
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
    ,   count = [].shift.call(argv)
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
    ,   newData = [].shift.call(argv)
    ,   offset = [].shift.call(argv)
    offset = offset || 0
    updateElem(ele.childNodes[index+offset], genTemplate(newData))
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
    process_event(tempDiv)
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

  var nodeUpdate = function(newNode, oldNode, watcher2) {
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
    if(oldNode.textContent  === '' && newNode.textContent){
      oldNode.textContent = newNode.textContent
    }
    if(watcher2 && oldNode.textContent != newNode.textContent){
      oldNode.textContent = newNode.textContent
    }
    output = {}
  }

  var nodeUpdateHTML = function(newNode, oldNode) {
    if(!newNode) return false
    if(newNode.nodeValue !== oldNode.nodeValue)
        oldNode.nodeValue = newNode.nodeValue
  }

  var updateElem = function(oldElem, newElem, watcher2){
    var oldArr = [], newArr = []
    oldArr.push(oldElem)
    newArr.push(newElem)
    loopChilds(oldArr, oldElem)
    loopChilds(newArr, newElem)
    oldArr.forEach(function(ele, idx, arr) {
      if (ele.nodeType === 1 && ele.hasAttributes()) {
        nodeUpdate(newArr[idx], ele, watcher2)
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
  var self = this
  var b = this.getBase(child, 'class')

  var isArr = function() {
    b.push(newClass)
    self.getBase(child, 'class', b)
  }

  return Array.isArray(b) && isArr()
}

Keet.prototype.removeClass = function(child, oldClass) {
  var self = this
  var b = this.getBase(child, 'class')

  var hIdx = function(idx) {
    b.splice(idx, 1)
    self.getBase(child, 'class', b)
  }

  var isArr = function() {
    var idx = b.indexOf(oldClass)
    if (~idx) hIdx(idx)
  }

  return Array.isArray(b) && isArr()
}

Keet.prototype.swapClass = function(child, condition, classesArray) {
  var self = this
  var b = this.getBase(child, 'class')

  if (condition) classesArray.reverse()

  var hIdx = function(idx) {
    b.splice(idx, 1, classesArray[1])
    self.getBase(child, 'class', b)
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

Keet.prototype.getDisplay = function(child){
  return this.base[child].style.display
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJjb3B5LmpzIiwiaW5kZXguanMiLCJ0YWcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaG1CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oYXJndikge1xyXG4gIHZhciBjb3AgPSBmdW5jdGlvbih2KXtcclxuICAgIHZhciBvID0ge31cclxuICAgIGlmKHR5cGVvZiB2ICE9PSAnb2JqZWN0Jyl7XHJcbiAgICAgIG8uY29weSA9IHZcclxuICAgICAgcmV0dXJuIG8uY29weVxyXG4gICAgfWVsc2Uge1xyXG4gICAgICBmb3IodmFyIGF0dHIgaW4gdil7XHJcbiAgICAgICAgb1thdHRyXSA9IHZbYXR0cl1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIG9cclxuICB9XHJcbiAgcmV0dXJuIEFycmF5LmlzQXJyYXkoYXJndikgPyBhcmd2Lm1hcChmdW5jdGlvbih2KSB7XHJcbiAgICByZXR1cm4gdlxyXG4gIH0pIDogY29wKGFyZ3YpXHJcbn0iLCIvKiogXHJcbiAqIEtlZXQuanMgdjIuMi4yIEFscGhhIHJlbGVhc2U6IGh0dHBzOi8vZ2l0aHViLmNvbS9zeWFydWwva2VldFxyXG4gKiBhbiBBUEkgZm9yIHdlYiBhcHBsaWNhdGlvblxyXG4gKlxyXG4gKiA8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDwgS2VldC5qcyA+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj5cclxuICpcclxuICogQ29weXJpZ2h0IDIwMTcsIFNoYWhydWwgTml6YW0gU2VsYW1hdFxyXG4gKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UuXHJcbiAqL1xyXG4ndXNlIHN0cmljdCdcclxudmFyIGNvcHkgPSByZXF1aXJlKCcuL2NvcHknKVxyXG52YXIgdGFnID0gcmVxdWlyZSgnLi90YWcnKVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBLZWV0XHJcblxyXG5mdW5jdGlvbiBLZWV0KHRhZ05hbWUsIGNvbnRleHQpIHtcclxuICB2YXIgY3R4ID0gdGhpc1xyXG4gICwgICBhcmd2ID0gW10uc2xpY2UuY2FsbChhcmd1bWVudHMpXHJcbiAgLCAgIGNvbnRleHQgPSBhcmd2LmZpbHRlcihmdW5jdGlvbihjKSB7ICAgIFxyXG4gICAgICAgIHJldHVybiB0eXBlb2YgYyA9PT0gJ29iamVjdCdcclxuICAgICAgfSlbMF1cclxuICAsICAgZ2V0SWQgPSBmdW5jdGlvbihpZCkge1xyXG4gICAgICAgIHJldHVybiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZClcclxuICAgICAgfVxyXG4gICwgICB0ZXN0RXZhbCA9IGZ1bmN0aW9uKGV2KSB7XHJcbiAgICAgICAgdHJ5IHsgcmV0dXJuIGV2YWwoZXYpIH0gXHJcbiAgICAgICAgY2F0Y2ggKGUpIHsgcmV0dXJuIGZhbHNlIH1cclxuICAgICAgfVxyXG4gICwgICBnZW5FbGVtZW50ID0gZnVuY3Rpb24oY2hpbGQpe1xyXG4gICAgICAgIHZhciB0ZW1wRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcclxuICAgICAgICB2YXIgY2xvbmVDaGlsZCA9IGNvcHkoY2hpbGQpXHJcbiAgICAgICAgZGVsZXRlIGNsb25lQ2hpbGQudGVtcGxhdGVcclxuICAgICAgICBkZWxldGUgY2xvbmVDaGlsZC50YWdcclxuICAgICAgICBkZWxldGUgY2xvbmVDaGlsZC5zdHlsZVxyXG4gICAgICAgIGRlbGV0ZSBjbG9uZUNoaWxkLl9fcmVmX19cclxuICAgICAgICBmb3IodmFyIGF0dHIgaW4gY2xvbmVDaGlsZCl7XHJcbiAgICAgICAgICBpZih0eXBlb2YgY2xvbmVDaGlsZFthdHRyXSA9PT0gJ2Z1bmN0aW9uJyl7XHJcbiAgICAgICAgICAgIGRlbGV0ZSBjbG9uZUNoaWxkW2F0dHJdXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBzID0gY2hpbGQudGFnID8gdGFnKGNoaWxkLnRhZywgY2hpbGQudGVtcGxhdGUgPyBjaGlsZC50ZW1wbGF0ZSA6ICcnLCBjbG9uZUNoaWxkLCBjaGlsZC5zdHlsZSkgOiBjaGlsZC50ZW1wbGF0ZVxyXG4gICAgICAgIHRlbXBEaXYuaW5uZXJIVE1MID0gc1xyXG4gICAgICAgIGlmKGNoaWxkLnRhZyA9PT0gJ2lucHV0Jyl7XHJcbiAgICAgICAgICBpZiAoY2hpbGQuY2hlY2tlZCkgXHJcbiAgICAgICAgICAgIHRlbXBEaXYuY2hpbGROb2Rlc1swXS5jaGVja2VkID0gdHJ1ZVxyXG4gICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICB0ZW1wRGl2LmNoaWxkTm9kZXNbMF0ucmVtb3ZlQXR0cmlidXRlKCdjaGVja2VkJylcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvY2Vzc19ldmVudCh0ZW1wRGl2KVxyXG4gICAgICAgIHJldHVybiB0ZW1wRGl2LmNoaWxkTm9kZXNbMF1cclxuICAgICAgfVxyXG4gICwgICBwYXJzZVN0ciA9IGZ1bmN0aW9uKGFwcE9iaiwgd2F0Y2gpe1xyXG4gICAgICAgIGlmKHR5cGVvZiBhcHBPYmogIT0gJ29iamVjdCcpIHRocm93IG5ldyBFcnJvcignaW5zdGFuY2UgaXMgbm90IGFuIG9iamVjdCcpXHJcbiAgICAgICAgdmFyIHN0ciA9IGFwcE9iai50ZW1wbGF0ZVxyXG4gICAgICAgICwgICBjaGlsZHMgPSBzdHIubWF0Y2goL3t7KFtee31dKyl9fS9nLCAnJDEnKVxyXG4gICAgICAgICwgICByZWdjXHJcbiAgICAgICAgLCAgIGNoaWxkXHJcbiAgICAgICAgLCAgIHRlbXBEaXZcclxuICAgICAgICAsICAgZWxlbUFyciA9IFtdXHJcblxyXG4gICAgICAgIGlmKGNoaWxkcyl7XHJcblxyXG4gICAgICAgICAgaWYoQXJyYXkuaXNBcnJheShhcHBPYmoubGlzdCkpIHtcclxuICAgICAgICAgICAgICB2YXIgYXJyUHJvcHMgPSBzdHIubWF0Y2goL3t7KFtee31dKyl9fS9nLCAnJDEnKSwgdG1wbFN0ciA9ICcnLCB0bXBsXHJcbiAgICAgICAgICAgICAgYXBwT2JqLmxpc3QuZm9yRWFjaChmdW5jdGlvbihyKSB7XHJcbiAgICAgICAgICAgICAgICB0bXBsID0gc3RyXHJcbiAgICAgICAgICAgICAgICBhcnJQcm9wcy5mb3JFYWNoKGZ1bmN0aW9uKHMpIHtcclxuICAgICAgICAgICAgICAgICAgdmFyIHJlcCA9IHMucmVwbGFjZSgve3soW157fV0rKX19L2csICckMScpXHJcbiAgICAgICAgICAgICAgICAgIHRtcGwgPSB0bXBsLnJlcGxhY2UoL3t7KFtee31dKyl9fS8sIHJbcmVwXSlcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICB0ZW1wRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcclxuICAgICAgICAgICAgICAgIHRlbXBEaXYuaW5uZXJIVE1MID0gdG1wbFxyXG4gICAgICAgICAgICAgICAgcHJvY2Vzc19ldmVudCh0ZW1wRGl2KVxyXG4gICAgICAgICAgICAgICAgZWxlbUFyci5wdXNoKHRlbXBEaXYuY2hpbGROb2Rlc1swXSlcclxuICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgIHdhdGNoZXIzKGFwcE9iai5saXN0KVxyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY2hpbGRzLmZvckVhY2goZnVuY3Rpb24oYywgaW5kZXgpe1xyXG4gICAgICAgICAgICAgIHJlZ2MgPSBjLnJlcGxhY2UoL3t7KFtee31dKyl9fS9nLCAnJDEnKVxyXG4gICAgICAgICAgICAgIC8vIHNraXAgdGFncyB3aGljaCBub3QgYmVpbmcgZGVjbGFyZWQgeWV0XHJcbiAgICAgICAgICAgICAgaWYoY29udGV4dCl7XHJcbiAgICAgICAgICAgICAgICAvLyBjaGVjayBjbG9zdXJlIG9iamVjdFxyXG4gICAgICAgICAgICAgICAgY2hpbGQgPSBjb250ZXh0W3JlZ2NdID8gY29udGV4dFtyZWdjXSA6IGZhbHNlXHJcbiAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIC8vIGNoZWNrIGlmIGN1cnJlbnQgIG9iamVjdHIgaGFzIHByb3BcclxuICAgICAgICAgICAgICAgIGNoaWxkID0gYXBwT2JqW3JlZ2NdXHJcbiAgICAgICAgICAgICAgICAvLyBjaGVjayBnbG9iYWwgb2JqZWN0XHJcbiAgICAgICAgICAgICAgICBpZighY2hpbGQpIGNoaWxkID0gdGVzdEV2YWwocmVnYylcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgaWYoY2hpbGQgJiYgdHlwZW9mIGNoaWxkID09PSAnb2JqZWN0Jyl7XHJcbiAgICAgICAgICAgICAgICB2YXIgbmV3RWxlbWVudCA9IGdlbkVsZW1lbnQoY2hpbGQpXHJcbiAgICAgICAgICAgICAgICBlbGVtQXJyLnB1c2gobmV3RWxlbWVudClcclxuICAgICAgICAgICAgICB9IGVsc2UgaWYoIWNoaWxkKXtcclxuICAgICAgICAgICAgICAgIHRlbXBEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxyXG4gICAgICAgICAgICAgICAgdGVtcERpdi5pbm5lckhUTUwgPSBjXHJcbiAgICAgICAgICAgICAgICBwcm9jZXNzX2V2ZW50KHRlbXBEaXYpXHJcbiAgICAgICAgICAgICAgICBlbGVtQXJyLnB1c2godGVtcERpdi5jaGlsZE5vZGVzWzBdKVxyXG4gICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgLy8gd2F0Y2ggb2JqZWN0IHN0YXRlXHJcbiAgICAgICAgICAgICAgaWYod2F0Y2ggJiYgY2hpbGQpIHtcclxuICAgICAgICAgICAgICAgIHdhdGNoZXIoY2hpbGQsIGluZGV4KVxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHRlbXBEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxyXG4gICAgICAgICAgdGVtcERpdi5pbm5lckhUTUwgPSBzdHJcclxuICAgICAgICAgIHByb2Nlc3NfZXZlbnQodGVtcERpdilcclxuICAgICAgICAgIGVsZW1BcnIucHVzaCh0ZW1wRGl2LmNoaWxkTm9kZXNbMF0pXHJcbiAgICAgICAgICB3YXRjaGVyMihhcHBPYmopXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBlbGVtQXJyXHJcbiAgfVxyXG5cclxuICB2YXIgcHJvY2Vzc19ldmVudCA9IGZ1bmN0aW9uKGtOb2RlKSB7XHJcbiAgICB2YXIgbGlzdEtub2RlQ2hpbGQgPSBbXSwgaGFzaywgZXZ0TmFtZSwgZXZ0aGFuZGxlciwgaGFuZGxlciwgaXNIYW5kbGVyLCBhcmd2LCBpLCBhdHRzLCB2LCByZW0gPSBbXVxyXG4gICAgbG9vcENoaWxkcyhsaXN0S25vZGVDaGlsZCwga05vZGUpXHJcbiAgICBsaXN0S25vZGVDaGlsZC5mb3JFYWNoKGZ1bmN0aW9uKGMpIHtcclxuICAgICAgaWYgKGMubm9kZVR5cGUgPT09IDEgJiYgYy5oYXNBdHRyaWJ1dGVzKCkpIHtcclxuICAgICAgICBpID0gMFxyXG4gICAgICAgIGZ1bmN0aW9uIG5leHQoKXtcclxuICAgICAgICAgIGF0dHMgPSBjLmF0dHJpYnV0ZXNcclxuICAgICAgICAgIGlmKGkgPCBhdHRzLmxlbmd0aCkge1xyXG4gICAgICAgICAgICBoYXNrID0gL15rLS8udGVzdChhdHRzW2ldLm5vZGVOYW1lKVxyXG4gICAgICAgICAgICBpZihoYXNrKXtcclxuICAgICAgICAgICAgICBldnROYW1lID0gYXR0c1tpXS5ub2RlTmFtZS5zcGxpdCgnLScpWzFdXHJcbiAgICAgICAgICAgICAgZXZ0aGFuZGxlciA9IGF0dHNbaV0ubm9kZVZhbHVlXHJcbiAgICAgICAgICAgICAgaGFuZGxlciA9IGV2dGhhbmRsZXIuc3BsaXQoJygnKVxyXG4gICAgICAgICAgICAgIGlzSGFuZGxlciA9IHRlc3RFdmFsKGN0eC5iYXNlW2hhbmRsZXJbMF1dKVxyXG4gICAgICAgICAgICAgIGlmKHR5cGVvZiBpc0hhbmRsZXIgPT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICAgICAgICAgIHJlbS5wdXNoKGF0dHNbaV0ubm9kZU5hbWUpXHJcbiAgICAgICAgICAgICAgICBhcmd2ID0gW11cclxuICAgICAgICAgICAgICAgIHYgPSBoYW5kbGVyWzFdLnNsaWNlKDAsIC0xKS5zcGxpdCgnLCcpLmZpbHRlcihmdW5jdGlvbihmKXtcclxuICAgICAgICAgICAgICAgICAgcmV0dXJuIGYgIT0gJydcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICBpZih2Lmxlbmd0aCkgdi5mb3JFYWNoKGZ1bmN0aW9uKHYpeyBhcmd2LnB1c2godikgfSlcclxuXHJcbiAgICAgICAgICAgICAgICBjLmFkZEV2ZW50TGlzdGVuZXIoZXZ0TmFtZSwgaXNIYW5kbGVyLmJpbmQuYXBwbHkoaXNIYW5kbGVyLCBbY10uY29uY2F0KGFyZ3YpKSwgZmFsc2UpXHJcblxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpKytcclxuICAgICAgICAgICAgbmV4dCgpXHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZW0ubWFwKGZ1bmN0aW9uKGYpeyBjLnJlbW92ZUF0dHJpYnV0ZShmKSB9KVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBuZXh0KClcclxuICAgICAgfVxyXG4gICAgfSlcclxuICAgIGxpc3RLbm9kZUNoaWxkID0gW11cclxuICB9XHJcblxyXG4gIHRoaXMudmRvbSA9IGZ1bmN0aW9uKCl7XHJcbiAgICB2YXIgZWxlID0gZ2V0SWQoY3R4LmVsKVxyXG4gICAgaWYoZWxlKSByZXR1cm4gZWxlXHJcbiAgfVxyXG5cclxuICB0aGlzLmZsdXNoID0gZnVuY3Rpb24oY29tcG9uZW50KXtcclxuICAgIHZhciBlbGUgPSBnZXRJZChjb21wb25lbnQpIHx8IGdldElkKGN0eC5lbClcclxuICAgIGlmKGVsZSkgZWxlLmlubmVySFRNTCA9ICcnXHJcbiAgICByZXR1cm4gdGhpc1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgKiByZW5kZXIgY29tcG9uZW50IHRvIERPTVxyXG4gICovXHJcblxyXG4gIHRoaXMucmVuZGVyID0gZnVuY3Rpb24oKXtcclxuICAgIHZhciBlbGUgPSBnZXRJZChjdHguZWwpXHJcbiAgICBpZighZWxlKXtcclxuICAgICAgLy8gdGhyb3cgbmV3IEVycm9yKCdjYW5ub3QgZmluZCBET00gd2l0aCBpZDogJytjdHguZWwrJyBza2lwIHJlbmRlcmluZy4uJylcclxuICAgICAgY29uc29sZS53YXJuKCdjYW5ub3QgZmluZCBET00gd2l0aCBpZDogJytjdHguZWwrJyBza2lwIHJlbmRlcmluZy4uJylcclxuICAgIH1cclxuICAgIGlmKGNvbnRleHQpIGN0eC5iYXNlID0gY29udGV4dFxyXG4gICAgdmFyIGVsQXJyID0gcGFyc2VTdHIoY3R4LmJhc2UsIHRydWUpXHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGVsQXJyLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIGVsZS5hcHBlbmRDaGlsZChlbEFycltpXSlcclxuXHJcbiAgICAgIGlmKGkgPT09IGVsQXJyLmxlbmd0aCAtIDEpe1xyXG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ19sb2FkZWQnLCB3aW5kb3cuX2xvYWRlZCAmJiB0eXBlb2Ygd2luZG93Ll9sb2FkZWQgPT09ICdmdW5jdGlvbicgPyB3aW5kb3cuX2xvYWRlZChjdHguZWwpIDogbnVsbCwgZmFsc2UpXHJcblxyXG4gICAgICAgIC8qaWYodHlwZW9mIHdpbmRvdy5NdXRhdGlvbk9ic2VydmVyID09ICdmdW5jdGlvbicpe1xyXG4gICAgICAgICAgdmFyIG9ic2VydmVyID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIoZnVuY3Rpb24obXV0YXRpb25zKXtcclxuICAgICAgICAgICAgaWYodHlwZW9mIGN0eC5jb21wb25lbnRPblVwZGF0ZSA9PSAnZnVuY3Rpb24nKSBjdHguY29tcG9uZW50T25VcGRhdGUuYXBwbHkoY3R4LCBtdXRhdGlvbnMpXHJcbiAgICAgICAgICB9KVxyXG5cclxuICAgICAgICAgIHZhciBjb25maWcgPSB7XHJcbiAgICAgICAgICAgIGF0dHJpYnV0ZXM6IHRydWUsXHJcbiAgICAgICAgICAgIGNoaWxkTGlzdDogdHJ1ZSxcclxuICAgICAgICAgICAgY2hhcmFjdGVyRGF0YTogdHJ1ZSxcclxuICAgICAgICAgICAgc3VidHJlZTogdHJ1ZVxyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIG9ic2VydmVyLm9ic2VydmUoZWxlLCBjb25maWcpXHJcbiAgICAgICAgfSovXHJcblxyXG5cclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICB9XHJcblxyXG4gIHRoaXMudXBkYXRlID0gZnVuY3Rpb24oYXBwT2JqKXtcclxuICAgIHZhciBlbGUgPSBnZXRJZChjdHguZWwpXHJcbiAgICB2YXIgZWxBcnIgPSBwYXJzZVN0cihhcHBPYmosIHRydWUpXHJcbiAgICBlbGUuaW5uZXJIVE1MID0gJydcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZWxBcnIubGVuZ3RoOyBpKyspIHtcclxuICAgICAgZWxlLmFwcGVuZENoaWxkKGVsQXJyW2ldKVxyXG4gICAgICBpZihpID09PSBlbEFyci5sZW5ndGggLSAxKXtcclxuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdfdXBkYXRlJywgd2luZG93Ll91cGRhdGUgJiYgdHlwZW9mIHdpbmRvdy5fdXBkYXRlID09PSAnZnVuY3Rpb24nID8gd2luZG93Ll91cGRhdGUoY3R4LmVsKSA6IG51bGwsIGZhbHNlKVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICB2YXIgd2F0Y2hlciA9IGZ1bmN0aW9uKGluc3RhbmNlLCBpbmRleCl7XHJcbiAgICB2YXIgb2JqLCBhdHRyLCBhdHRyMiwgZWxlLCBjb3B5SW5zdGFuY2UsIG5ld0VsZW1cclxuICAgIGZvciAoYXR0ciBpbiBpbnN0YW5jZSl7XHJcbiAgICAgIGluc3RhbmNlLndhdGNoKGF0dHIsIGZ1bmN0aW9uKGlkeCwgbywgbikge1xyXG4gICAgICAgIGZvciAoYXR0cjIgaW4gaW5zdGFuY2Upe1xyXG4gICAgICAgICAgaW5zdGFuY2UudW53YXRjaChhdHRyMilcclxuICAgICAgICB9XHJcbiAgICAgICAgb2JqID0ge31cclxuICAgICAgICBvYmpbaWR4XSA9IG5cclxuICAgICAgICBlbGUgPSBnZXRJZChjdHguZWwpXHJcbiAgICAgICAgT2JqZWN0LmFzc2lnbihpbnN0YW5jZSwgb2JqKVxyXG4gICAgICAgIG5ld0VsZW0gPSBnZW5FbGVtZW50KGluc3RhbmNlKVxyXG4gICAgICAgIHVwZGF0ZUVsZW0oZWxlLmNoaWxkTm9kZXNbaW5kZXhdLCBuZXdFbGVtKVxyXG4gICAgICAgIHdhdGNoZXIoaW5zdGFuY2UsIGluZGV4KVxyXG4gICAgICB9KVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgdmFyIHdhdGNoZXIyID0gZnVuY3Rpb24oaW5zdGFuY2Upe1xyXG4gICAgdmFyIG9iaiwgYXR0ciwgYXR0cjIsIGVsZSwgY29weUluc3RhbmNlLCBuZXdFbGVtXHJcbiAgICBmb3IgKGF0dHIgaW4gaW5zdGFuY2Upe1xyXG4gICAgICBpbnN0YW5jZS53YXRjaChhdHRyLCBmdW5jdGlvbihpZHgsIG8sIG4pIHtcclxuICAgICAgICBmb3IgKGF0dHIyIGluIGluc3RhbmNlKXtcclxuICAgICAgICAgIGluc3RhbmNlLnVud2F0Y2goYXR0cjIpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIG9iaiA9IHt9XHJcbiAgICAgICAgb2JqW2lkeF0gPSBuXHJcbiAgICAgICAgZWxlID0gZ2V0SWQoY3R4LmVsKVxyXG4gICAgICAgIE9iamVjdC5hc3NpZ24oaW5zdGFuY2UsIG9iailcclxuICAgICAgICBuZXdFbGVtID0gZ2VuRWxlbWVudChpbnN0YW5jZSlcclxuICAgICAgICB1cGRhdGVFbGVtKGVsZSwgbmV3RWxlbSwgdHJ1ZSlcclxuICAgICAgICB3YXRjaGVyMihpbnN0YW5jZSlcclxuICAgICAgfSlcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHZhciB3YXRjaGVyMyA9IGZ1bmN0aW9uKGluc3RhbmNlKXtcclxuICAgIHZhciBwcmlzdGluZUxlbiA9IGNvcHkoaW5zdGFuY2UpLCBvcHNMaXN0LCBvcCwgcXVlcnlcclxuICAgIFxyXG4gICAgb3BzTGlzdCA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gWydwdXNoJywgJ3BvcCcsICdzaGlmdCcsICd1bnNoaWZ0JywgJ3NwbGljZScsICd1cGRhdGUnXSB9XHJcblxyXG4gICAgb3AgPSBvcHNMaXN0KClcclxuXHJcbiAgICBxdWVyeSA9IGZ1bmN0aW9uKG9wcywgYXJndnMpIHtcclxuICAgICAgb3AgPSBbXVxyXG4gICAgICBpZihvcHMgPT09ICdwdXNoJylcclxuICAgICAgICBhcnJQcm90b1B1c2goYXJndnNbMF0pXHJcbiAgICAgIGVsc2UgaWYob3BzID09PSAncG9wJylcclxuICAgICAgICBhcnJQcm90b1BvcCgpXHJcbiAgICAgIGVsc2UgaWYob3BzID09PSAnc2hpZnQnKVxyXG4gICAgICAgIGFyclByb3RvU2hpZnQoKVxyXG4gICAgICBlbHNlIGlmKG9wcyA9PT0gJ3Vuc2hpZnQnKVxyXG4gICAgICAgIGFyclByb3RvVW5TaGlmdC5hcHBseShudWxsLCBhcmd2cylcclxuICAgICAgZWxzZSBpZihvcHMgPT09ICdzcGxpY2UnKVxyXG4gICAgICAgIGFyclByb3RvU3BsaWNlLmFwcGx5KG51bGwsIGFyZ3ZzKVxyXG4gICAgICBlbHNlXHJcbiAgICAgICAgYXJyUHJvdG9VcGRhdGUuYXBwbHkobnVsbCwgYXJndnMpXHJcbiAgICAgIG9wID0gb3BzTGlzdCgpXHJcbiAgICAgIHByaXN0aW5lTGVuID0gY29weShpbnN0YW5jZSlcclxuICAgIH1cclxuXHJcbiAgICBvcC5mb3JFYWNoKGZ1bmN0aW9uKGYsIGksIHIpe1xyXG4gICAgICBpbnN0YW5jZVtmXSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciBmYXJndiA9IFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzKVxyXG4gICAgICAgIC8vIGlmKCFwcmlzdGluZUxlbltmYXJndlswXV0pIHJldHVybiBmYWxzZVxyXG4gICAgICAgIGlmKGYgPT09ICd1cGRhdGUnKVxyXG4gICAgICAgICAgZmFyZ3ZbMV0gPSBPYmplY3QuYXNzaWduKHByaXN0aW5lTGVuW2Zhcmd2WzBdXSwgZmFyZ3ZbMV0pXHJcbiAgICAgICAgQXJyYXkucHJvdG90eXBlW2ZdLmFwcGx5KHRoaXMsIGZhcmd2KVxyXG4gICAgICAgIC8vcHJvcGFnYXRlIHNwbGljZSB3aXRoIHNpbmdsZSBhcmd1bWVudHNcclxuICAgICAgICBpZihmYXJndi5sZW5ndGggPT09IDEgJiYgZiA9PT0gJ3NwbGljZScpXHJcbiAgICAgICAgICBmYXJndi5wdXNoKHByaXN0aW5lTGVuLmxlbmd0aCAtIGZhcmd2WzBdKVxyXG4gICAgICAgIHF1ZXJ5KGYsIGZhcmd2KVxyXG4gICAgICB9XHJcbiAgICB9KVxyXG4gIH1cclxuXHJcbiAgdmFyIGFyclByb3RvUHVzaCA9IGZ1bmN0aW9uKG5ld09iail7XHJcbiAgICB2YXIgZWxlID0gZ2V0SWQoY3R4LmVsKVxyXG4gICAgZWxlLmFwcGVuZENoaWxkKGdlblRlbXBsYXRlKG5ld09iaikpXHJcbiAgfVxyXG5cclxuICB2YXIgYXJyUHJvdG9Qb3AgPSBmdW5jdGlvbigpe1xyXG4gICAgdmFyIGVsZSA9IGdldElkKGN0eC5lbClcclxuICAgIGVsZS5yZW1vdmVDaGlsZChlbGUubGFzdENoaWxkKVxyXG4gIH1cclxuXHJcbiAgdmFyIGFyclByb3RvU2hpZnQgPSBmdW5jdGlvbigpe1xyXG4gICAgdmFyIGVsZSA9IGdldElkKGN0eC5lbClcclxuICAgIGVsZS5yZW1vdmVDaGlsZChlbGUuZmlyc3RDaGlsZClcclxuICB9XHJcblxyXG4gIHZhciBhcnJQcm90b1VuU2hpZnQgPSBmdW5jdGlvbigpe1xyXG4gICAgdmFyIGFyZ3YgPSBbXS5zbGljZS5jYWxsKGFyZ3VtZW50cylcclxuICAgIHZhciBlbGUgPSBnZXRJZChjdHguZWwpXHJcbiAgICB2YXIgaSA9IGFyZ3YubGVuZ3RoIC0gMVxyXG4gICAgd2hpbGUoaSA+IC0xKSB7XHJcbiAgICAgIGVsZS5pbnNlcnRCZWZvcmUoZ2VuVGVtcGxhdGUoYXJndltpXSksIGVsZS5maXJzdENoaWxkKVxyXG4gICAgICBpLS1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIHZhciBhcnJQcm90b1NwbGljZSA9IGZ1bmN0aW9uKCl7XHJcbiAgICB2YXIgZWxlID0gZ2V0SWQoY3R4LmVsKVxyXG4gICAgLCAgIGNoaWxkTGVuXHJcbiAgICAsICAgbGVuXHJcbiAgICAsICAgaVxyXG4gICAgLCAgIGpcclxuICAgICwgICBrXHJcbiAgICAsICAgY1xyXG4gICAgLCAgIHRlbXBEaXZDaGlsZExlblxyXG4gICAgLCAgIHRlbXBEaXZcclxuICAgICwgICBhcmd2ID0gW10uc2xpY2UuY2FsbChhcmd1bWVudHMpXHJcbiAgICAsICAgc3RhcnQgPSBbXS5zaGlmdC5jYWxsKGFyZ3YpXHJcbiAgICAsICAgY291bnQgPSBbXS5zaGlmdC5jYWxsKGFyZ3YpXHJcbiAgICB0ZW1wRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcclxuICAgIGlmKGFyZ3YubGVuZ3RoKXtcclxuICAgICAgaSA9IDBcclxuICAgICAgd2hpbGUoaSA8IGFyZ3YubGVuZ3RoKXtcclxuICAgICAgICB0ZW1wRGl2LmFwcGVuZENoaWxkKGdlblRlbXBsYXRlKGFyZ3ZbaV0pKVxyXG4gICAgICAgIGkrK1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBjaGlsZExlbiA9IGNvcHkoZWxlLmNoaWxkTm9kZXMubGVuZ3RoKVxyXG4gICAgdGVtcERpdkNoaWxkTGVuID0gY29weSh0ZW1wRGl2LmNoaWxkTm9kZXMubGVuZ3RoKVxyXG4gICAgaWYgKGNvdW50ICYmIGNvdW50ID4gMCkge1xyXG4gICAgICBmb3IgKGkgPSBzdGFydDsgaSA8IGNoaWxkTGVuICsgMTsgaSsrKSB7XHJcbiAgICAgICAgbGVuID0gc3RhcnQgKyBjb3VudFxyXG4gICAgICAgIGlmIChpIDwgbGVuKSB7XHJcbiAgICAgICAgICBlbGUucmVtb3ZlQ2hpbGQoZWxlLmNoaWxkTm9kZXNbc3RhcnRdKVxyXG4gICAgICAgICAgaWYgKGkgPT09IGxlbiAtIDEgJiYgdGVtcERpdkNoaWxkTGVuID4gMCkge1xyXG4gICAgICAgICAgICBjID0gc3RhcnQgLSAxXHJcbiAgICAgICAgICAgIGZvciAoaiA9IHN0YXJ0OyBqIDwgdGVtcERpdkNoaWxkTGVuICsgc3RhcnQ7IGorKykge1xyXG4gICAgICAgICAgICAgIGluc2VydEFmdGVyKHRlbXBEaXYuY2hpbGROb2Rlc1swXSwgZWxlLmNoaWxkTm9kZXNbY10sIGVsZSlcclxuICAgICAgICAgICAgICBjKytcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSBlbHNlIGlmIChhcmd2Lmxlbmd0aCkge1xyXG4gICAgICBjID0gc3RhcnQgLSAxXHJcbiAgICAgIGZvciAoayA9IHN0YXJ0OyBrIDwgdGVtcERpdkNoaWxkTGVuICsgc3RhcnQ7IGsrKykge1xyXG4gICAgICAgIGluc2VydEFmdGVyKHRlbXBEaXYuY2hpbGROb2Rlc1swXSwgZWxlLmNoaWxkTm9kZXNbY10sIGVsZSlcclxuICAgICAgICBjKytcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgdmFyIGFyclByb3RvVXBkYXRlID0gZnVuY3Rpb24oKXtcclxuICAgIHZhciBhcmd2ID0gW10uc2xpY2UuY2FsbChhcmd1bWVudHMpXHJcbiAgICAsICAgZWxlID0gZ2V0SWQoY3R4LmVsKVxyXG4gICAgLCAgIGluZGV4ID0gW10uc2hpZnQuY2FsbChhcmd2KVxyXG4gICAgLCAgIG5ld0RhdGEgPSBbXS5zaGlmdC5jYWxsKGFyZ3YpXHJcbiAgICAsICAgb2Zmc2V0ID0gW10uc2hpZnQuY2FsbChhcmd2KVxyXG4gICAgb2Zmc2V0ID0gb2Zmc2V0IHx8IDBcclxuICAgIHVwZGF0ZUVsZW0oZWxlLmNoaWxkTm9kZXNbaW5kZXgrb2Zmc2V0XSwgZ2VuVGVtcGxhdGUobmV3RGF0YSkpXHJcbiAgfVxyXG5cclxuICB2YXIgZ2VuVGVtcGxhdGUgPSBmdW5jdGlvbihvYmope1xyXG4gICAgdmFyIGFyclByb3BzID0gY3R4LmJhc2UudGVtcGxhdGUubWF0Y2goL3t7KFtee31dKyl9fS9nLCAnJDEnKSwgIHRtcGwsIHRlbXBEaXYsIGVsZVxyXG4gICAgdG1wbCA9IGN0eC5iYXNlLnRlbXBsYXRlXHJcbiAgICBhcnJQcm9wcy5mb3JFYWNoKGZ1bmN0aW9uKHMpIHtcclxuICAgICAgdmFyIHJlcCA9IHMucmVwbGFjZSgve3soW157fV0rKX19L2csICckMScpXHJcbiAgICAgIHRtcGwgPSB0bXBsLnJlcGxhY2UoL3t7KFtee31dKyl9fS8sIG9ialtyZXBdKVxyXG4gICAgfSlcclxuICAgIHRlbXBEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxyXG4gICAgdGVtcERpdi5pbm5lckhUTUwgPSB0bXBsXHJcbiAgICBwcm9jZXNzX2V2ZW50KHRlbXBEaXYpXHJcbiAgICByZXR1cm4gdGVtcERpdi5jaGlsZE5vZGVzWzBdXHJcbiAgfVxyXG5cclxuICB2YXIgbG9vcENoaWxkcyA9IGZ1bmN0aW9uKGFyciwgZWxlbSkge1xyXG4gICAgZm9yICh2YXIgY2hpbGQgPSBlbGVtLmZpcnN0Q2hpbGQ7IGNoaWxkICE9PSBudWxsOyBjaGlsZCA9IGNoaWxkLm5leHRTaWJsaW5nKSB7XHJcbiAgICAgIGFyci5wdXNoKGNoaWxkKVxyXG4gICAgICBpZiAoY2hpbGQuaGFzQ2hpbGROb2RlcygpKSB7XHJcbiAgICAgICAgbG9vcENoaWxkcyhhcnIsIGNoaWxkKVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICB2YXIgaW5zZXJ0QWZ0ZXIgPSBmdW5jdGlvbihuZXdOb2RlLCByZWZlcmVuY2VOb2RlLCBwYXJlbnROb2RlKSB7XHJcbiAgICByZWZlcmVuY2VOb2RlLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKG5ld05vZGUsIHJlZmVyZW5jZU5vZGUubmV4dFNpYmxpbmcpXHJcbiAgfVxyXG5cclxuICB2YXIgbm9kZVVwZGF0ZSA9IGZ1bmN0aW9uKG5ld05vZGUsIG9sZE5vZGUsIHdhdGNoZXIyKSB7XHJcbiAgICBpZighbmV3Tm9kZSkgcmV0dXJuIGZhbHNlXHJcbiAgICB2YXIgb0F0dHIgPSBuZXdOb2RlLmF0dHJpYnV0ZXNcclxuICAgIHZhciBvdXRwdXQgPSB7fTtcclxuICAgIGlmKG9BdHRyKXtcclxuICAgICAgZm9yKHZhciBpID0gb0F0dHIubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcclxuICAgICAgICAgb3V0cHV0W29BdHRyW2ldLm5hbWVdID0gb0F0dHJbaV0udmFsdWVcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgZm9yICh2YXIgaUF0dHIgaW4gb3V0cHV0KSB7XHJcbiAgICAgIGlmKG9sZE5vZGUuYXR0cmlidXRlc1tpQXR0cl0gJiYgb2xkTm9kZS5hdHRyaWJ1dGVzW2lBdHRyXS5uYW1lID09PSBpQXR0ciAmJiBvbGROb2RlLmF0dHJpYnV0ZXNbaUF0dHJdLnZhbHVlICE9IG91dHB1dFtpQXR0cl0pe1xyXG4gICAgICAgIG9sZE5vZGUuc2V0QXR0cmlidXRlKGlBdHRyLCBvdXRwdXRbaUF0dHJdKVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBpZihvbGROb2RlLnRleHRDb250ZW50ICA9PT0gJycgJiYgbmV3Tm9kZS50ZXh0Q29udGVudCl7XHJcbiAgICAgIG9sZE5vZGUudGV4dENvbnRlbnQgPSBuZXdOb2RlLnRleHRDb250ZW50XHJcbiAgICB9XHJcbiAgICBpZih3YXRjaGVyMiAmJiBvbGROb2RlLnRleHRDb250ZW50ICE9IG5ld05vZGUudGV4dENvbnRlbnQpe1xyXG4gICAgICBvbGROb2RlLnRleHRDb250ZW50ID0gbmV3Tm9kZS50ZXh0Q29udGVudFxyXG4gICAgfVxyXG4gICAgb3V0cHV0ID0ge31cclxuICB9XHJcblxyXG4gIHZhciBub2RlVXBkYXRlSFRNTCA9IGZ1bmN0aW9uKG5ld05vZGUsIG9sZE5vZGUpIHtcclxuICAgIGlmKCFuZXdOb2RlKSByZXR1cm4gZmFsc2VcclxuICAgIGlmKG5ld05vZGUubm9kZVZhbHVlICE9PSBvbGROb2RlLm5vZGVWYWx1ZSlcclxuICAgICAgICBvbGROb2RlLm5vZGVWYWx1ZSA9IG5ld05vZGUubm9kZVZhbHVlXHJcbiAgfVxyXG5cclxuICB2YXIgdXBkYXRlRWxlbSA9IGZ1bmN0aW9uKG9sZEVsZW0sIG5ld0VsZW0sIHdhdGNoZXIyKXtcclxuICAgIHZhciBvbGRBcnIgPSBbXSwgbmV3QXJyID0gW11cclxuICAgIG9sZEFyci5wdXNoKG9sZEVsZW0pXHJcbiAgICBuZXdBcnIucHVzaChuZXdFbGVtKVxyXG4gICAgbG9vcENoaWxkcyhvbGRBcnIsIG9sZEVsZW0pXHJcbiAgICBsb29wQ2hpbGRzKG5ld0FyciwgbmV3RWxlbSlcclxuICAgIG9sZEFyci5mb3JFYWNoKGZ1bmN0aW9uKGVsZSwgaWR4LCBhcnIpIHtcclxuICAgICAgaWYgKGVsZS5ub2RlVHlwZSA9PT0gMSAmJiBlbGUuaGFzQXR0cmlidXRlcygpKSB7XHJcbiAgICAgICAgbm9kZVVwZGF0ZShuZXdBcnJbaWR4XSwgZWxlLCB3YXRjaGVyMilcclxuICAgICAgfSBlbHNlIGlmIChlbGUubm9kZVR5cGUgPT09IDMpIHtcclxuICAgICAgICBub2RlVXBkYXRlSFRNTChuZXdBcnJbaWR4XSwgZWxlKVxyXG4gICAgICB9XHJcbiAgICAgIGlmKGlkeCA9PT0gYXJyLmxlbmd0aCAtIDEpe1xyXG4gICAgICAgIG9sZEFyci5zcGxpY2UoMClcclxuICAgICAgICBuZXdBcnIuc3BsaWNlKDApXHJcbiAgICAgIH1cclxuICAgIH0pXHJcbiAgfVxyXG4gIFxyXG4gIGlmICghT2JqZWN0LnByb3RvdHlwZS53YXRjaCkge1xyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KE9iamVjdC5wcm90b3R5cGUsICd3YXRjaCcsIHtcclxuICAgICAgZW51bWVyYWJsZTogZmFsc2UsXHJcbiAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcclxuICAgICAgd3JpdGFibGU6IGZhbHNlLFxyXG4gICAgICB2YWx1ZTogZnVuY3Rpb24ocHJvcCwgaGFuZGxlcikge1xyXG4gICAgICAgIHZhciBvbGR2YWwgPSB0aGlzW3Byb3BdLFxyXG4gICAgICAgICAgbmV3dmFsID0gb2xkdmFsLFxyXG4gICAgICAgICAgZ2V0dGVyID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBuZXd2YWxcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBzZXR0ZXIgPSBmdW5jdGlvbih2YWwpIHtcclxuICAgICAgICAgICAgb2xkdmFsID0gbmV3dmFsXHJcbiAgICAgICAgICAgIHJldHVybiBuZXd2YWwgPSBoYW5kbGVyLmNhbGwodGhpcywgcHJvcCwgb2xkdmFsLCB2YWwpXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgaWYgKGRlbGV0ZSB0aGlzW3Byb3BdKSB7XHJcbiAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgcHJvcCwge1xyXG4gICAgICAgICAgICBnZXQ6IGdldHRlcixcclxuICAgICAgICAgICAgc2V0OiBzZXR0ZXIsXHJcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgICAgICAgfSlcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0pXHJcbiAgfVxyXG5cclxuICBpZiAoIU9iamVjdC5wcm90b3R5cGUudW53YXRjaCkge1xyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KE9iamVjdC5wcm90b3R5cGUsICd1bndhdGNoJywge1xyXG4gICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcclxuICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxyXG4gICAgICB3cml0YWJsZTogZmFsc2UsXHJcbiAgICAgIHZhbHVlOiBmdW5jdGlvbihwcm9wKSB7XHJcbiAgICAgICAgdmFyIHZhbCA9IHRoaXNbcHJvcF0gXHJcbiAgICAgICAgZGVsZXRlIHRoaXNbcHJvcF0gXHJcbiAgICAgICAgdGhpc1twcm9wXSA9IHZhbFxyXG4gICAgICB9XHJcbiAgICB9KVxyXG4gIH1cclxuXHJcbiAgaWYoIUFycmF5LnByb3RvdHlwZS51cGRhdGUpe1xyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KEFycmF5LnByb3RvdHlwZSwgJ3VwZGF0ZScsIHtcclxuICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcclxuICAgICAgICB3cml0YWJsZTogdHJ1ZSxcclxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24oaW5kZXgsIHZhbHVlKSB7IFxyXG4gICAgICAgICAgdGhpc1tpbmRleF0gPSB2YWx1ZVxyXG4gICAgICAgIH1cclxuICAgIH0pXHJcbiAgfVxyXG59XHJcblxyXG5LZWV0LnByb3RvdHlwZS5saW5rID0gZnVuY3Rpb24oaWQsIHZhbHVlKSB7XHJcbiAgdmFyIGFyZ3YgPSBbXS5zbGljZS5jYWxsKGFyZ3VtZW50cylcclxuXHJcbiAgdGhpcy5lbCA9IGFyZ3ZbMF1cclxuICBpZiAoYXJndi5sZW5ndGggPT09IDIpe1xyXG4gICAgdGhpcy5iYXNlID0gYXJndlsxXVxyXG4gIH1cclxuICB0aGlzLnJlbmRlcigpXHJcbiAgcmV0dXJuIHRoaXNcclxufVxyXG5cclxuS2VldC5wcm90b3R5cGUuY29tcG9zZSA9IGZ1bmN0aW9uKGluc3RhbmNlKSB7XHJcbiAgdGhpcy51cGRhdGUoaW5zdGFuY2UpXHJcbiAgcmV0dXJuIHRoaXNcclxufVxyXG5cclxuS2VldC5wcm90b3R5cGUubW91bnQgPSBmdW5jdGlvbihpbnN0YW5jZSkge1xyXG4gIHRoaXMuYmFzZSA9IGluc3RhbmNlXHJcbiAgcmV0dXJuIHRoaXNcclxufVxyXG5cclxuS2VldC5wcm90b3R5cGUuY2x1c3RlciA9IGZ1bmN0aW9uKCkge1xyXG4gIHZhciBhcmdzID0gW10uc2xpY2UuY2FsbChhcmd1bWVudHMpXHJcbiAgYXJncy5tYXAoZnVuY3Rpb24oZm4pe1xyXG4gICAgaWYodHlwZW9mIGZuID09PSAnZnVuY3Rpb24nKSBmbigpXHJcbiAgfSlcclxuICByZXR1cm4gdGhpc1xyXG59XHJcblxyXG5LZWV0LnByb3RvdHlwZS5saXN0ID0gZnVuY3Rpb24oKXtcclxuICByZXR1cm4gdGhpcy5iYXNlICYmIHRoaXMuYmFzZS5saXN0IHx8IFtdXHJcbn1cclxuXHJcbktlZXQucHJvdG90eXBlLmdldEJhc2UgPSBmdW5jdGlvbihjaGlsZCwgYXR0cmlidXRlLCBuZXdQcm9wKSB7XHJcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAyICYmIHRoaXMuYmFzZSlcclxuICAgIHRoaXMuYmFzZVtjaGlsZF1bYXR0cmlidXRlXSA9IG5ld1Byb3BcclxuICBlbHNlXHJcbiAgICByZXR1cm4gdGhpcy5iYXNlW2NoaWxkXVthdHRyaWJ1dGVdXHJcbn1cclxuXHJcbktlZXQucHJvdG90eXBlLmFkZENsYXNzID0gZnVuY3Rpb24oY2hpbGQsIG5ld0NsYXNzKSB7XHJcbiAgdmFyIHNlbGYgPSB0aGlzXHJcbiAgdmFyIGIgPSB0aGlzLmdldEJhc2UoY2hpbGQsICdjbGFzcycpXHJcblxyXG4gIHZhciBpc0FyciA9IGZ1bmN0aW9uKCkge1xyXG4gICAgYi5wdXNoKG5ld0NsYXNzKVxyXG4gICAgc2VsZi5nZXRCYXNlKGNoaWxkLCAnY2xhc3MnLCBiKVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIEFycmF5LmlzQXJyYXkoYikgJiYgaXNBcnIoKVxyXG59XHJcblxyXG5LZWV0LnByb3RvdHlwZS5yZW1vdmVDbGFzcyA9IGZ1bmN0aW9uKGNoaWxkLCBvbGRDbGFzcykge1xyXG4gIHZhciBzZWxmID0gdGhpc1xyXG4gIHZhciBiID0gdGhpcy5nZXRCYXNlKGNoaWxkLCAnY2xhc3MnKVxyXG5cclxuICB2YXIgaElkeCA9IGZ1bmN0aW9uKGlkeCkge1xyXG4gICAgYi5zcGxpY2UoaWR4LCAxKVxyXG4gICAgc2VsZi5nZXRCYXNlKGNoaWxkLCAnY2xhc3MnLCBiKVxyXG4gIH1cclxuXHJcbiAgdmFyIGlzQXJyID0gZnVuY3Rpb24oKSB7XHJcbiAgICB2YXIgaWR4ID0gYi5pbmRleE9mKG9sZENsYXNzKVxyXG4gICAgaWYgKH5pZHgpIGhJZHgoaWR4KVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIEFycmF5LmlzQXJyYXkoYikgJiYgaXNBcnIoKVxyXG59XHJcblxyXG5LZWV0LnByb3RvdHlwZS5zd2FwQ2xhc3MgPSBmdW5jdGlvbihjaGlsZCwgY29uZGl0aW9uLCBjbGFzc2VzQXJyYXkpIHtcclxuICB2YXIgc2VsZiA9IHRoaXNcclxuICB2YXIgYiA9IHRoaXMuZ2V0QmFzZShjaGlsZCwgJ2NsYXNzJylcclxuXHJcbiAgaWYgKGNvbmRpdGlvbikgY2xhc3Nlc0FycmF5LnJldmVyc2UoKVxyXG5cclxuICB2YXIgaElkeCA9IGZ1bmN0aW9uKGlkeCkge1xyXG4gICAgYi5zcGxpY2UoaWR4LCAxLCBjbGFzc2VzQXJyYXlbMV0pXHJcbiAgICBzZWxmLmdldEJhc2UoY2hpbGQsICdjbGFzcycsIGIpXHJcbiAgfVxyXG5cclxuICB2YXIgaXNBcnIgPSBmdW5jdGlvbigpIHtcclxuICAgIHZhciBpZHggPSBiLmluZGV4T2YoY2xhc3Nlc0FycmF5WzBdKVxyXG4gICAgaWYgKH5pZHgpIGhJZHgoaWR4KVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIEFycmF5LmlzQXJyYXkoYikgJiYgaXNBcnIoKVxyXG59XHJcblxyXG5LZWV0LnByb3RvdHlwZS5zd2FwQXR0ciA9IGZ1bmN0aW9uKGNoaWxkLCBjb25kaXRpb24sIHByb3BlcnR5QXJyYXksIGF0dHJpYnV0ZSkge1xyXG4gIGlmIChjb25kaXRpb24pIHByb3BlcnR5QXJyYXkucmV2ZXJzZSgpXHJcbiAgdGhpcy5nZXRCYXNlKGNoaWxkLCBhdHRyaWJ1dGUsIHByb3BlcnR5QXJyYXlbMF0pXHJcbn1cclxuXHJcbktlZXQucHJvdG90eXBlLnNldEF0dHIgPSBmdW5jdGlvbihjaGlsZCwgYXR0cmlidXRlLCBuZXdQcm9wZXJ0eSkge1xyXG4gIHRoaXMuZ2V0QmFzZShjaGlsZCwgYXR0cmlidXRlLCBuZXdQcm9wZXJ0eSlcclxufVxyXG5cclxuS2VldC5wcm90b3R5cGUudG9nZ2xlID0gZnVuY3Rpb24oY2hpbGQsIGRpc3BsYXkpIHtcclxuICB2YXIgc3R5bCA9IHRoaXMuYmFzZVtjaGlsZF0uc3R5bGVcclxuICBPYmplY3QuYXNzaWduKHN0eWwsIHsgZGlzcGxheTogZGlzcGxheSB9KVxyXG4gIHRoaXMuYmFzZVtjaGlsZF0uc3R5bGUgPSBzdHlsXHJcbn1cclxuXHJcbktlZXQucHJvdG90eXBlLmdldERpc3BsYXkgPSBmdW5jdGlvbihjaGlsZCl7XHJcbiAgcmV0dXJuIHRoaXMuYmFzZVtjaGlsZF0uc3R5bGUuZGlzcGxheVxyXG59XHJcblxyXG5LZWV0LnByb3RvdHlwZS5jb250ZW50VXBkYXRlID0gZnVuY3Rpb24oY2hpbGQsIGNvbnRlbnQpIHtcclxuICB0aGlzLmJhc2VbY2hpbGRdLnRlbXBsYXRlID0gY29udGVudFxyXG59IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpIHtcclxuICBmdW5jdGlvbiBrdGFnKHRhZywgdmFsdWUsIGF0dHJpYnV0ZXMsIHN0eWxlcykge1xyXG4gICAgdmFyIGF0dHIsIGlkeCwgdGUsIGEgPSBbXS5zbGljZS5jYWxsKGFyZ3VtZW50cyksXHJcbiAgICAgIHJldCA9IFsnPCcsIGFbMF0sICc+JywgYVsxXSwgJzwvJywgYVswXSwgJz4nXVxyXG4gICAgaWYgKGEubGVuZ3RoID4gMiAmJiB0eXBlb2YgYVsyXSA9PT0gJ29iamVjdCcpIHtcclxuICAgICAgZm9yIChhdHRyIGluIGFbMl0pIHtcclxuICAgICAgICBpZih0eXBlb2YgYVsyXVthdHRyXSA9PT0gJ2Jvb2xlYW4nICYmIGFbMl1bYXR0cl0pXHJcbiAgICAgICAgICByZXQuc3BsaWNlKDIsIDAsICcgJywgYXR0cilcclxuICAgICAgICBlbHNlIGlmKGF0dHIgPT09ICdjbGFzcycgJiYgQXJyYXkuaXNBcnJheShhWzJdW2F0dHJdKSlcclxuICAgICAgICAgIHJldC5zcGxpY2UoMiwgMCwgJyAnLCBhdHRyLCAnPVwiJywgYVsyXVthdHRyXS5qb2luKCcgJykudHJpbSgpLCAnXCInKVxyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgIHJldC5zcGxpY2UoMiwgMCwgJyAnLCBhdHRyLCAnPVwiJywgYVsyXVthdHRyXSwgJ1wiJylcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgaWYgKGEubGVuZ3RoID4gMyAmJiB0eXBlb2YgYVszXSA9PT0gJ29iamVjdCcpIHtcclxuICAgICAgaWR4ID0gcmV0LmluZGV4T2YoJz4nKVxyXG4gICAgICB0ZSA9IFtpZHgsIDAsICcgc3R5bGU9XCInXVxyXG4gICAgICBmb3IgKGF0dHIgaW4gYVszXSkge1xyXG4gICAgICAgIHRlLnB1c2goYXR0cilcclxuICAgICAgICB0ZS5wdXNoKCc6JylcclxuICAgICAgICB0ZS5wdXNoKGFbM11bYXR0cl0pXHJcbiAgICAgICAgdGUucHVzaCgnOycpXHJcbiAgICAgIH1cclxuICAgICAgdGUucHVzaCgnXCInKVxyXG4gICAgICByZXQuc3BsaWNlLmFwcGx5KHJldCwgdGUpXHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmV0XHJcbiAgfVxyXG4gIHZhciBhcmdzID0gW10uc2xpY2UuY2FsbChhcmd1bWVudHMpLFxyXG4gICAgYXJyID0ga3RhZy5hcHBseShudWxsLCBhcmdzKVxyXG4gIHJldHVybiBhcnIuam9pbignJylcclxufSJdfQ==
