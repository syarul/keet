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
    if(oldNode.textContent  === '' && newNode.textContent || oldNode.textContent != newNode.textContent){
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJjb3B5LmpzIiwiaW5kZXguanMiLCJ0YWcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3psQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGFyZ3YpIHtcclxuICB2YXIgY29wID0gZnVuY3Rpb24odil7XHJcbiAgICB2YXIgbyA9IHt9XHJcbiAgICBpZih0eXBlb2YgdiAhPT0gJ29iamVjdCcpe1xyXG4gICAgICBvLmNvcHkgPSB2XHJcbiAgICAgIHJldHVybiBvLmNvcHlcclxuICAgIH1lbHNlIHtcclxuICAgICAgZm9yKHZhciBhdHRyIGluIHYpe1xyXG4gICAgICAgIG9bYXR0cl0gPSB2W2F0dHJdXHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBvXHJcbiAgfVxyXG4gIHJldHVybiBBcnJheS5pc0FycmF5KGFyZ3YpID8gYXJndi5tYXAoZnVuY3Rpb24odikge1xyXG4gICAgcmV0dXJuIHZcclxuICB9KSA6IGNvcChhcmd2KVxyXG59IiwiLyoqIFxyXG4gKiBLZWV0LmpzIHYyLjEuMCBBbHBoYSByZWxlYXNlOiBodHRwczovL2dpdGh1Yi5jb20vc3lhcnVsL2tlZXRcclxuICogYW4gQVBJIGZvciB3ZWIgYXBwbGljYXRpb25cclxuICpcclxuICogPDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8IEtlZXQuanMgPj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+XHJcbiAqXHJcbiAqIENvcHlyaWdodCAyMDE3LCBTaGFocnVsIE5pemFtIFNlbGFtYXRcclxuICogUmVsZWFzZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlLlxyXG4gKi9cclxuJ3VzZSBzdHJpY3QnXHJcbnZhciBjb3B5ID0gcmVxdWlyZSgnLi9jb3B5JylcclxudmFyIHRhZyA9IHJlcXVpcmUoJy4vdGFnJylcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gS2VldFxyXG5cclxuZnVuY3Rpb24gS2VldCh0YWdOYW1lLCBjb250ZXh0KSB7XHJcbiAgdmFyIGN0eCA9IHRoaXNcclxuICAsICAgYXJndiA9IFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzKVxyXG4gICwgICBjb250ZXh0ID0gYXJndi5maWx0ZXIoZnVuY3Rpb24oYykgeyAgICBcclxuICAgICAgICByZXR1cm4gdHlwZW9mIGMgPT09ICdvYmplY3QnXHJcbiAgICAgIH0pWzBdXHJcbiAgLCAgIGdldElkID0gZnVuY3Rpb24oaWQpIHtcclxuICAgICAgICByZXR1cm4gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpXHJcbiAgICAgIH1cclxuICAsICAgdGVzdEV2YWwgPSBmdW5jdGlvbihldikge1xyXG4gICAgICAgIHRyeSB7IHJldHVybiBldmFsKGV2KSB9IFxyXG4gICAgICAgIGNhdGNoIChlKSB7IHJldHVybiBmYWxzZSB9XHJcbiAgICAgIH1cclxuICAsICAgZ2VuRWxlbWVudCA9IGZ1bmN0aW9uKGNoaWxkKXtcclxuICAgICAgICB2YXIgdGVtcERpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXHJcbiAgICAgICAgdmFyIGNsb25lQ2hpbGQgPSBjb3B5KGNoaWxkKVxyXG4gICAgICAgIGRlbGV0ZSBjbG9uZUNoaWxkLnRlbXBsYXRlXHJcbiAgICAgICAgZGVsZXRlIGNsb25lQ2hpbGQudGFnXHJcbiAgICAgICAgZGVsZXRlIGNsb25lQ2hpbGQuc3R5bGVcclxuICAgICAgICBkZWxldGUgY2xvbmVDaGlsZC5fX3JlZl9fXHJcbiAgICAgICAgZm9yKHZhciBhdHRyIGluIGNsb25lQ2hpbGQpe1xyXG4gICAgICAgICAgaWYodHlwZW9mIGNsb25lQ2hpbGRbYXR0cl0gPT09ICdmdW5jdGlvbicpe1xyXG4gICAgICAgICAgICBkZWxldGUgY2xvbmVDaGlsZFthdHRyXVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgcyA9IGNoaWxkLnRhZyA/IHRhZyhjaGlsZC50YWcsIGNoaWxkLnRlbXBsYXRlID8gY2hpbGQudGVtcGxhdGUgOiAnJywgY2xvbmVDaGlsZCwgY2hpbGQuc3R5bGUpIDogY2hpbGQudGVtcGxhdGVcclxuICAgICAgICB0ZW1wRGl2LmlubmVySFRNTCA9IHNcclxuICAgICAgICBpZihjaGlsZC50YWcgPT09ICdpbnB1dCcpe1xyXG4gICAgICAgICAgaWYgKGNoaWxkLmNoZWNrZWQpIFxyXG4gICAgICAgICAgICB0ZW1wRGl2LmNoaWxkTm9kZXNbMF0uY2hlY2tlZCA9IHRydWVcclxuICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgdGVtcERpdi5jaGlsZE5vZGVzWzBdLnJlbW92ZUF0dHJpYnV0ZSgnY2hlY2tlZCcpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb2Nlc3NfZXZlbnQodGVtcERpdilcclxuICAgICAgICByZXR1cm4gdGVtcERpdi5jaGlsZE5vZGVzWzBdXHJcbiAgICAgIH1cclxuICAsICAgcGFyc2VTdHIgPSBmdW5jdGlvbihhcHBPYmosIHdhdGNoKXtcclxuICAgICAgICBpZih0eXBlb2YgYXBwT2JqICE9ICdvYmplY3QnKSB0aHJvdyBuZXcgRXJyb3IoJ2luc3RhbmNlIGlzIG5vdCBhbiBvYmplY3QnKVxyXG4gICAgICAgIHZhciBzdHIgPSBhcHBPYmoudGVtcGxhdGVcclxuICAgICAgICAsICAgY2hpbGRzID0gc3RyLm1hdGNoKC97eyhbXnt9XSspfX0vZywgJyQxJylcclxuICAgICAgICAsICAgcmVnY1xyXG4gICAgICAgICwgICBjaGlsZFxyXG4gICAgICAgICwgICB0ZW1wRGl2XHJcbiAgICAgICAgLCAgIGVsZW1BcnIgPSBbXVxyXG5cclxuICAgICAgICBpZihjaGlsZHMpe1xyXG5cclxuICAgICAgICAgIGlmKEFycmF5LmlzQXJyYXkoYXBwT2JqLmxpc3QpKSB7XHJcbiAgICAgICAgICAgICAgdmFyIGFyclByb3BzID0gc3RyLm1hdGNoKC97eyhbXnt9XSspfX0vZywgJyQxJyksIHRtcGxTdHIgPSAnJywgdG1wbFxyXG4gICAgICAgICAgICAgIGFwcE9iai5saXN0LmZvckVhY2goZnVuY3Rpb24ocikge1xyXG4gICAgICAgICAgICAgICAgdG1wbCA9IHN0clxyXG4gICAgICAgICAgICAgICAgYXJyUHJvcHMuZm9yRWFjaChmdW5jdGlvbihzKSB7XHJcbiAgICAgICAgICAgICAgICAgIHZhciByZXAgPSBzLnJlcGxhY2UoL3t7KFtee31dKyl9fS9nLCAnJDEnKVxyXG4gICAgICAgICAgICAgICAgICB0bXBsID0gdG1wbC5yZXBsYWNlKC97eyhbXnt9XSspfX0vLCByW3JlcF0pXHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgdGVtcERpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXHJcbiAgICAgICAgICAgICAgICB0ZW1wRGl2LmlubmVySFRNTCA9IHRtcGxcclxuICAgICAgICAgICAgICAgIHByb2Nlc3NfZXZlbnQodGVtcERpdilcclxuICAgICAgICAgICAgICAgIGVsZW1BcnIucHVzaCh0ZW1wRGl2LmNoaWxkTm9kZXNbMF0pXHJcbiAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICB3YXRjaGVyMyhhcHBPYmoubGlzdClcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGNoaWxkcy5mb3JFYWNoKGZ1bmN0aW9uKGMsIGluZGV4KXtcclxuICAgICAgICAgICAgICByZWdjID0gYy5yZXBsYWNlKC97eyhbXnt9XSspfX0vZywgJyQxJylcclxuICAgICAgICAgICAgICAvLyBza2lwIHRhZ3Mgd2hpY2ggbm90IGJlaW5nIGRlY2xhcmVkIHlldFxyXG4gICAgICAgICAgICAgIGlmKGNvbnRleHQpe1xyXG4gICAgICAgICAgICAgICAgLy8gY2hlY2sgY2xvc3VyZSBvYmplY3RcclxuICAgICAgICAgICAgICAgIGNoaWxkID0gY29udGV4dFtyZWdjXSA/IGNvbnRleHRbcmVnY10gOiBmYWxzZVxyXG4gICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAvLyBjaGVjayBpZiBjdXJyZW50ICBvYmplY3RyIGhhcyBwcm9wXHJcbiAgICAgICAgICAgICAgICBjaGlsZCA9IGFwcE9ialtyZWdjXVxyXG4gICAgICAgICAgICAgICAgLy8gY2hlY2sgZ2xvYmFsIG9iamVjdFxyXG4gICAgICAgICAgICAgICAgaWYoIWNoaWxkKSBjaGlsZCA9IHRlc3RFdmFsKHJlZ2MpXHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIGlmKGNoaWxkICYmIHR5cGVvZiBjaGlsZCA9PT0gJ29iamVjdCcpe1xyXG4gICAgICAgICAgICAgICAgdmFyIG5ld0VsZW1lbnQgPSBnZW5FbGVtZW50KGNoaWxkKVxyXG4gICAgICAgICAgICAgICAgZWxlbUFyci5wdXNoKG5ld0VsZW1lbnQpXHJcbiAgICAgICAgICAgICAgfSBlbHNlIGlmKCFjaGlsZCl7XHJcbiAgICAgICAgICAgICAgICB0ZW1wRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcclxuICAgICAgICAgICAgICAgIHRlbXBEaXYuaW5uZXJIVE1MID0gY1xyXG4gICAgICAgICAgICAgICAgZWxlbUFyci5wdXNoKHRlbXBEaXYuY2hpbGROb2Rlc1swXSlcclxuICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgIC8vIHdhdGNoIG9iamVjdCBzdGF0ZVxyXG4gICAgICAgICAgICAgIGlmKHdhdGNoICYmIGNoaWxkKSB7XHJcbiAgICAgICAgICAgICAgICB3YXRjaGVyKGNoaWxkLCBpbmRleClcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB0ZW1wRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcclxuICAgICAgICAgIHRlbXBEaXYuaW5uZXJIVE1MID0gc3RyXHJcbiAgICAgICAgICBwcm9jZXNzX2V2ZW50KHRlbXBEaXYpXHJcbiAgICAgICAgICBlbGVtQXJyLnB1c2godGVtcERpdi5jaGlsZE5vZGVzWzBdKVxyXG4gICAgICAgICAgd2F0Y2hlcjIoYXBwT2JqKVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZWxlbUFyclxyXG4gIH1cclxuXHJcbiAgdmFyIHByb2Nlc3NfZXZlbnQgPSBmdW5jdGlvbihrTm9kZSkge1xyXG4gICAgdmFyIGxpc3RLbm9kZUNoaWxkID0gW10sIGhhc2ssIGV2dE5hbWUsIGV2dGhhbmRsZXIsIGhhbmRsZXIsIGlzSGFuZGxlciwgYXJndiwgaSwgYXR0cywgdiwgcmVtID0gW11cclxuICAgIGxvb3BDaGlsZHMobGlzdEtub2RlQ2hpbGQsIGtOb2RlKVxyXG4gICAgbGlzdEtub2RlQ2hpbGQuZm9yRWFjaChmdW5jdGlvbihjKSB7XHJcbiAgICAgIGlmIChjLm5vZGVUeXBlID09PSAxICYmIGMuaGFzQXR0cmlidXRlcygpKSB7XHJcbiAgICAgICAgaSA9IDBcclxuICAgICAgICBmdW5jdGlvbiBuZXh0KCl7XHJcbiAgICAgICAgICBhdHRzID0gYy5hdHRyaWJ1dGVzXHJcbiAgICAgICAgICBpZihpIDwgYXR0cy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgaGFzayA9IC9eay0vLnRlc3QoYXR0c1tpXS5ub2RlTmFtZSlcclxuICAgICAgICAgICAgaWYoaGFzayl7XHJcbiAgICAgICAgICAgICAgZXZ0TmFtZSA9IGF0dHNbaV0ubm9kZU5hbWUuc3BsaXQoJy0nKVsxXVxyXG4gICAgICAgICAgICAgIGV2dGhhbmRsZXIgPSBhdHRzW2ldLm5vZGVWYWx1ZVxyXG4gICAgICAgICAgICAgIGhhbmRsZXIgPSBldnRoYW5kbGVyLnNwbGl0KCcoJylcclxuICAgICAgICAgICAgICBpc0hhbmRsZXIgPSB0ZXN0RXZhbChjdHguYmFzZVtoYW5kbGVyWzBdXSlcclxuICAgICAgICAgICAgICBpZih0eXBlb2YgaXNIYW5kbGVyID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgICAgICAgICByZW0ucHVzaChhdHRzW2ldLm5vZGVOYW1lKVxyXG4gICAgICAgICAgICAgICAgYy5hZGRFdmVudExpc3RlbmVyKGV2dE5hbWUsIGZ1bmN0aW9uKGV2dCl7XHJcbiAgICAgICAgICAgICAgICAgIGFyZ3YgPSBbXVxyXG4gICAgICAgICAgICAgICAgICBhcmd2LnB1c2goZXZ0KVxyXG4gICAgICAgICAgICAgICAgICB2ID0gaGFuZGxlclsxXS5zbGljZSgwLCAtMSkuc3BsaXQoJywnKS5maWx0ZXIoZnVuY3Rpb24oZil7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGYgIT0gJydcclxuICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgaWYodi5sZW5ndGgpIHYuZm9yRWFjaChmdW5jdGlvbih2KXsgYXJndi5wdXNoKHYpIH0pXHJcbiAgICAgICAgICAgICAgICAgIGlzSGFuZGxlci5hcHBseShjLCBhcmd2KVxyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaSsrXHJcbiAgICAgICAgICAgIG5leHQoKVxyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmVtLm1hcChmdW5jdGlvbihmKXsgYy5yZW1vdmVBdHRyaWJ1dGUoZikgfSlcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgbmV4dCgpXHJcbiAgICAgIH1cclxuICAgIH0pXHJcbiAgICBsaXN0S25vZGVDaGlsZCA9IFtdXHJcbiAgfVxyXG5cclxuICB0aGlzLnZkb20gPSBmdW5jdGlvbigpe1xyXG4gICAgdmFyIGVsZSA9IGdldElkKGN0eC5lbClcclxuICAgIGlmKGVsZSkgcmV0dXJuIGVsZVxyXG4gIH1cclxuXHJcbiAgdGhpcy5mbHVzaCA9IGZ1bmN0aW9uKGNvbXBvbmVudCl7XHJcbiAgICB2YXIgZWxlID0gZ2V0SWQoY29tcG9uZW50KSB8fCBnZXRJZChjdHguZWwpXHJcbiAgICBpZihlbGUpIGVsZS5pbm5lckhUTUwgPSAnJ1xyXG4gICAgcmV0dXJuIHRoaXNcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICogcmVuZGVyIGNvbXBvbmVudCB0byBET01cclxuICAqL1xyXG5cclxuICB0aGlzLnJlbmRlciA9IGZ1bmN0aW9uKCl7XHJcbiAgICB2YXIgZWxlID0gZ2V0SWQoY3R4LmVsKVxyXG4gICAgaWYoIWVsZSl7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcignY2Fubm90IGZpbmQgRE9NIHdpdGggaWQ6ICcrY3R4LmVsKycgc2tpcCByZW5kZXJpbmcuLicpXHJcbiAgICB9XHJcbiAgICBpZihjb250ZXh0KSBjdHguYmFzZSA9IGNvbnRleHRcclxuICAgIHZhciBlbEFyciA9IHBhcnNlU3RyKGN0eC5iYXNlLCB0cnVlKVxyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBlbEFyci5sZW5ndGg7IGkrKykge1xyXG4gICAgICBlbGUuYXBwZW5kQ2hpbGQoZWxBcnJbaV0pXHJcblxyXG4gICAgICBpZihpID09PSBlbEFyci5sZW5ndGggLSAxKXtcclxuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdfbG9hZGVkJywgd2luZG93Ll9sb2FkZWQgJiYgdHlwZW9mIHdpbmRvdy5fbG9hZGVkID09PSAnZnVuY3Rpb24nID8gd2luZG93Ll9sb2FkZWQoY3R4LmVsKSA6IG51bGwsIGZhbHNlKVxyXG5cclxuICAgICAgICBpZih0eXBlb2Ygd2luZG93Lk11dGF0aW9uT2JzZXJ2ZXIgPT0gJ2Z1bmN0aW9uJyl7XHJcbiAgICAgICAgICB2YXIgb2JzZXJ2ZXIgPSBuZXcgTXV0YXRpb25PYnNlcnZlcihmdW5jdGlvbihtdXRhdGlvbnMpe1xyXG4gICAgICAgICAgICBpZih0eXBlb2YgY3R4LmNvbXBvbmVudE9uVXBkYXRlID09ICdmdW5jdGlvbicpIGN0eC5jb21wb25lbnRPblVwZGF0ZS5hcHBseShjdHgsIG11dGF0aW9ucylcclxuICAgICAgICAgIH0pXHJcblxyXG4gICAgICAgICAgdmFyIGNvbmZpZyA9IHtcclxuICAgICAgICAgICAgYXR0cmlidXRlczogdHJ1ZSxcclxuICAgICAgICAgICAgY2hpbGRMaXN0OiB0cnVlLFxyXG4gICAgICAgICAgICBjaGFyYWN0ZXJEYXRhOiB0cnVlLFxyXG4gICAgICAgICAgICBzdWJ0cmVlOiB0cnVlXHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgb2JzZXJ2ZXIub2JzZXJ2ZShlbGUsIGNvbmZpZylcclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICB9XHJcblxyXG4gIHRoaXMudXBkYXRlID0gZnVuY3Rpb24oYXBwT2JqKXtcclxuICAgIHZhciBlbGUgPSBnZXRJZChjdHguZWwpXHJcbiAgICB2YXIgZWxBcnIgPSBwYXJzZVN0cihhcHBPYmosIHRydWUpXHJcbiAgICBlbGUuaW5uZXJIVE1MID0gJydcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZWxBcnIubGVuZ3RoOyBpKyspIHtcclxuICAgICAgZWxlLmFwcGVuZENoaWxkKGVsQXJyW2ldKVxyXG4gICAgICBpZihpID09PSBlbEFyci5sZW5ndGggLSAxKXtcclxuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdfdXBkYXRlJywgd2luZG93Ll91cGRhdGUgJiYgdHlwZW9mIHdpbmRvdy5fdXBkYXRlID09PSAnZnVuY3Rpb24nID8gd2luZG93Ll91cGRhdGUoY3R4LmVsKSA6IG51bGwsIGZhbHNlKVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICB2YXIgd2F0Y2hlciA9IGZ1bmN0aW9uKGluc3RhbmNlLCBpbmRleCl7XHJcbiAgICB2YXIgb2JqLCBhdHRyLCBhdHRyMiwgZWxlLCBjb3B5SW5zdGFuY2UsIG5ld0VsZW1cclxuICAgIGZvciAoYXR0ciBpbiBpbnN0YW5jZSl7XHJcbiAgICAgIGluc3RhbmNlLndhdGNoKGF0dHIsIGZ1bmN0aW9uKGlkeCwgbywgbikge1xyXG4gICAgICAgIGZvciAoYXR0cjIgaW4gaW5zdGFuY2Upe1xyXG4gICAgICAgICAgaW5zdGFuY2UudW53YXRjaChhdHRyMilcclxuICAgICAgICB9XHJcbiAgICAgICAgb2JqID0ge31cclxuICAgICAgICBvYmpbaWR4XSA9IG5cclxuICAgICAgICBlbGUgPSBnZXRJZChjdHguZWwpXHJcbiAgICAgICAgT2JqZWN0LmFzc2lnbihpbnN0YW5jZSwgb2JqKVxyXG4gICAgICAgIG5ld0VsZW0gPSBnZW5FbGVtZW50KGluc3RhbmNlKVxyXG4gICAgICAgIHVwZGF0ZUVsZW0oZWxlLmNoaWxkTm9kZXNbaW5kZXhdLCBuZXdFbGVtKVxyXG4gICAgICAgIHdhdGNoZXIoaW5zdGFuY2UsIGluZGV4KVxyXG4gICAgICB9KVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgdmFyIHdhdGNoZXIyID0gZnVuY3Rpb24oaW5zdGFuY2Upe1xyXG4gICAgdmFyIG9iaiwgYXR0ciwgYXR0cjIsIGVsZSwgY29weUluc3RhbmNlLCBuZXdFbGVtXHJcbiAgICBmb3IgKGF0dHIgaW4gaW5zdGFuY2Upe1xyXG4gICAgICBpbnN0YW5jZS53YXRjaChhdHRyLCBmdW5jdGlvbihpZHgsIG8sIG4pIHtcclxuICAgICAgICBmb3IgKGF0dHIyIGluIGluc3RhbmNlKXtcclxuICAgICAgICAgIGluc3RhbmNlLnVud2F0Y2goYXR0cjIpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIG9iaiA9IHt9XHJcbiAgICAgICAgb2JqW2lkeF0gPSBuXHJcbiAgICAgICAgZWxlID0gZ2V0SWQoY3R4LmVsKVxyXG4gICAgICAgIE9iamVjdC5hc3NpZ24oaW5zdGFuY2UsIG9iailcclxuICAgICAgICBuZXdFbGVtID0gZ2VuRWxlbWVudChpbnN0YW5jZSlcclxuICAgICAgICB1cGRhdGVFbGVtKGVsZSwgbmV3RWxlbSlcclxuICAgICAgICB3YXRjaGVyMihpbnN0YW5jZSlcclxuICAgICAgfSlcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHZhciB3YXRjaGVyMyA9IGZ1bmN0aW9uKGluc3RhbmNlKXtcclxuICAgIC8vIGNvbnNvbGUubG9nKGluc3RhbmNlKVxyXG4gICAgdmFyIHByaXN0aW5lTGVuID0gY29weShpbnN0YW5jZSksIG9wc0xpc3QsIG9wLCBxdWVyeVxyXG4gICAgXHJcbiAgICBvcHNMaXN0ID0gZnVuY3Rpb24oKSB7IHJldHVybiBbJ3B1c2gnLCAncG9wJywgJ3NoaWZ0JywgJ3Vuc2hpZnQnLCAnc3BsaWNlJywgJ3VwZGF0ZSddIH1cclxuXHJcbiAgICBvcCA9IG9wc0xpc3QoKVxyXG5cclxuICAgIHF1ZXJ5ID0gZnVuY3Rpb24ob3BzLCBhcmd2cykge1xyXG4gICAgICBvcCA9IFtdXHJcbiAgICAgIGlmKG9wcyA9PT0gJ3B1c2gnKVxyXG4gICAgICAgIGFyclByb3RvUHVzaChhcmd2c1swXSlcclxuICAgICAgZWxzZSBpZihvcHMgPT09ICdwb3AnKVxyXG4gICAgICAgIGFyclByb3RvUG9wKClcclxuICAgICAgZWxzZSBpZihvcHMgPT09ICdzaGlmdCcpXHJcbiAgICAgICAgYXJyUHJvdG9TaGlmdCgpXHJcbiAgICAgIGVsc2UgaWYob3BzID09PSAndW5zaGlmdCcpXHJcbiAgICAgICAgYXJyUHJvdG9VblNoaWZ0LmFwcGx5KG51bGwsIGFyZ3ZzKVxyXG4gICAgICBlbHNlIGlmKG9wcyA9PT0gJ3NwbGljZScpXHJcbiAgICAgICAgYXJyUHJvdG9TcGxpY2UuYXBwbHkobnVsbCwgYXJndnMpXHJcbiAgICAgIGVsc2VcclxuICAgICAgICBhcnJQcm90b1VwZGF0ZS5hcHBseShudWxsLCBhcmd2cylcclxuICAgICAgb3AgPSBvcHNMaXN0KClcclxuICAgICAgcHJpc3RpbmVMZW4gPSBjb3B5KGluc3RhbmNlKVxyXG4gICAgfVxyXG5cclxuICAgIG9wLmZvckVhY2goZnVuY3Rpb24oZiwgaSwgcil7XHJcbiAgICAgIGluc3RhbmNlW2ZdID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIGZhcmd2ID0gW10uc2xpY2UuY2FsbChhcmd1bWVudHMpXHJcbiAgICAgICAgLy8gaWYoIXByaXN0aW5lTGVuW2Zhcmd2WzBdXSkgcmV0dXJuIGZhbHNlXHJcbiAgICAgICAgaWYoZiA9PT0gJ3VwZGF0ZScpXHJcbiAgICAgICAgICBmYXJndlsxXSA9IE9iamVjdC5hc3NpZ24ocHJpc3RpbmVMZW5bZmFyZ3ZbMF1dLCBmYXJndlsxXSlcclxuICAgICAgICBBcnJheS5wcm90b3R5cGVbZl0uYXBwbHkodGhpcywgZmFyZ3YpXHJcbiAgICAgICAgLy9wcm9wYWdhdGUgc3BsaWNlIHdpdGggc2luZ2xlIGFyZ3VtZW50c1xyXG4gICAgICAgIGlmKGZhcmd2Lmxlbmd0aCA9PT0gMSAmJiBmID09PSAnc3BsaWNlJylcclxuICAgICAgICAgIGZhcmd2LnB1c2gocHJpc3RpbmVMZW4ubGVuZ3RoIC0gZmFyZ3ZbMF0pXHJcbiAgICAgICAgcXVlcnkoZiwgZmFyZ3YpXHJcbiAgICAgIH1cclxuICAgIH0pXHJcbiAgfVxyXG5cclxuICB2YXIgYXJyUHJvdG9QdXNoID0gZnVuY3Rpb24obmV3T2JqKXtcclxuICAgIHZhciBlbGUgPSBnZXRJZChjdHguZWwpXHJcbiAgICBlbGUuYXBwZW5kQ2hpbGQoZ2VuVGVtcGxhdGUobmV3T2JqKSlcclxuICB9XHJcblxyXG4gIHZhciBhcnJQcm90b1BvcCA9IGZ1bmN0aW9uKCl7XHJcbiAgICB2YXIgZWxlID0gZ2V0SWQoY3R4LmVsKVxyXG4gICAgaWYoZWxlLmNoaWxkTm9kZXMubGVuZ3RoKSB7XHJcbiAgICAgIGVsZS5yZW1vdmVDaGlsZChlbGUubGFzdENoaWxkKVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgdmFyIGFyclByb3RvU2hpZnQgPSBmdW5jdGlvbigpe1xyXG4gICAgdmFyIGVsZSA9IGdldElkKGN0eC5lbClcclxuICAgIGlmKGVsZS5jaGlsZE5vZGVzLmxlbmd0aCkge1xyXG4gICAgICBlbGUucmVtb3ZlQ2hpbGQoZWxlLmZpcnN0Q2hpbGQpXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICB2YXIgYXJyUHJvdG9VblNoaWZ0ID0gZnVuY3Rpb24oKXtcclxuICAgIHZhciBhcmd2ID0gW10uc2xpY2UuY2FsbChhcmd1bWVudHMpXHJcbiAgICB2YXIgZWxlID0gZ2V0SWQoY3R4LmVsKVxyXG4gICAgdmFyIGkgPSBhcmd2Lmxlbmd0aCAtIDFcclxuICAgIHdoaWxlKGkgPiAtMSkge1xyXG4gICAgICBlbGUuaW5zZXJ0QmVmb3JlKGdlblRlbXBsYXRlKGFyZ3ZbaV0pLCBlbGUuZmlyc3RDaGlsZClcclxuICAgICAgaS0tXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICB2YXIgYXJyUHJvdG9TcGxpY2UgPSBmdW5jdGlvbigpe1xyXG4gICAgdmFyIGVsZSA9IGdldElkKGN0eC5lbClcclxuICAgICwgICBjaGlsZExlblxyXG4gICAgLCAgIGxlblxyXG4gICAgLCAgIGlcclxuICAgICwgICBqXHJcbiAgICAsICAga1xyXG4gICAgLCAgIGNcclxuICAgICwgICB0ZW1wRGl2Q2hpbGRMZW5cclxuICAgICwgICB0ZW1wRGl2XHJcbiAgICAsICAgYXJndiA9IFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzKVxyXG4gICAgLCAgIHN0YXJ0ID0gW10uc2hpZnQuY2FsbChhcmd2KVxyXG4gICAgLCAgIGNvdW50ID0gW10uc2hpZnQuY2FsbChhcmd2KVxyXG4gICAgdGVtcERpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXHJcbiAgICBpZihhcmd2Lmxlbmd0aCl7XHJcbiAgICAgIGkgPSAwXHJcbiAgICAgIHdoaWxlKGkgPCBhcmd2Lmxlbmd0aCl7XHJcbiAgICAgICAgdGVtcERpdi5hcHBlbmRDaGlsZChnZW5UZW1wbGF0ZShhcmd2W2ldKSlcclxuICAgICAgICBpKytcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgY2hpbGRMZW4gPSBjb3B5KGVsZS5jaGlsZE5vZGVzLmxlbmd0aClcclxuICAgIHRlbXBEaXZDaGlsZExlbiA9IGNvcHkodGVtcERpdi5jaGlsZE5vZGVzLmxlbmd0aClcclxuICAgIGlmIChjb3VudCAmJiBjb3VudCA+IDApIHtcclxuICAgICAgZm9yIChpID0gc3RhcnQ7IGkgPCBjaGlsZExlbiArIDE7IGkrKykge1xyXG4gICAgICAgIGxlbiA9IHN0YXJ0ICsgY291bnRcclxuICAgICAgICBpZiAoaSA8IGxlbikge1xyXG4gICAgICAgICAgZWxlLnJlbW92ZUNoaWxkKGVsZS5jaGlsZE5vZGVzW3N0YXJ0XSlcclxuICAgICAgICAgIGlmIChpID09PSBsZW4gLSAxICYmIHRlbXBEaXZDaGlsZExlbiA+IDApIHtcclxuICAgICAgICAgICAgYyA9IHN0YXJ0IC0gMVxyXG4gICAgICAgICAgICBmb3IgKGogPSBzdGFydDsgaiA8IHRlbXBEaXZDaGlsZExlbiArIHN0YXJ0OyBqKyspIHtcclxuICAgICAgICAgICAgICBpbnNlcnRBZnRlcih0ZW1wRGl2LmNoaWxkTm9kZXNbMF0sIGVsZS5jaGlsZE5vZGVzW2NdLCBlbGUpXHJcbiAgICAgICAgICAgICAgYysrXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSBpZiAoYXJndi5sZW5ndGgpIHtcclxuICAgICAgYyA9IHN0YXJ0IC0gMVxyXG4gICAgICBmb3IgKGsgPSBzdGFydDsgayA8IHRlbXBEaXZDaGlsZExlbiArIHN0YXJ0OyBrKyspIHtcclxuICAgICAgICBpbnNlcnRBZnRlcih0ZW1wRGl2LmNoaWxkTm9kZXNbMF0sIGVsZS5jaGlsZE5vZGVzW2NdLCBlbGUpXHJcbiAgICAgICAgYysrXHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIHZhciBhcnJQcm90b1VwZGF0ZSA9IGZ1bmN0aW9uKCl7XHJcbiAgICB2YXIgYXJndiA9IFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzKVxyXG4gICAgLCAgIGVsZSA9IGdldElkKGN0eC5lbClcclxuICAgICwgICBpbmRleCA9IFtdLnNoaWZ0LmNhbGwoYXJndilcclxuICAgIHVwZGF0ZUVsZW0oZWxlLmNoaWxkTm9kZXNbaW5kZXhdLCBnZW5UZW1wbGF0ZShhcmd2WzBdKSlcclxuICB9XHJcblxyXG4gIHZhciBnZW5UZW1wbGF0ZSA9IGZ1bmN0aW9uKG9iail7XHJcbiAgICB2YXIgYXJyUHJvcHMgPSBjdHguYmFzZS50ZW1wbGF0ZS5tYXRjaCgve3soW157fV0rKX19L2csICckMScpLCAgdG1wbCwgdGVtcERpdiwgZWxlXHJcbiAgICB0bXBsID0gY3R4LmJhc2UudGVtcGxhdGVcclxuICAgIGFyclByb3BzLmZvckVhY2goZnVuY3Rpb24ocykge1xyXG4gICAgICB2YXIgcmVwID0gcy5yZXBsYWNlKC97eyhbXnt9XSspfX0vZywgJyQxJylcclxuICAgICAgdG1wbCA9IHRtcGwucmVwbGFjZSgve3soW157fV0rKX19Lywgb2JqW3JlcF0pXHJcbiAgICB9KVxyXG4gICAgdGVtcERpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXHJcbiAgICB0ZW1wRGl2LmlubmVySFRNTCA9IHRtcGxcclxuICAgIHJldHVybiB0ZW1wRGl2LmNoaWxkTm9kZXNbMF1cclxuICB9XHJcblxyXG4gIHZhciBsb29wQ2hpbGRzID0gZnVuY3Rpb24oYXJyLCBlbGVtKSB7XHJcbiAgICBmb3IgKHZhciBjaGlsZCA9IGVsZW0uZmlyc3RDaGlsZDsgY2hpbGQgIT09IG51bGw7IGNoaWxkID0gY2hpbGQubmV4dFNpYmxpbmcpIHtcclxuICAgICAgYXJyLnB1c2goY2hpbGQpXHJcbiAgICAgIGlmIChjaGlsZC5oYXNDaGlsZE5vZGVzKCkpIHtcclxuICAgICAgICBsb29wQ2hpbGRzKGFyciwgY2hpbGQpXHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIHZhciBpbnNlcnRBZnRlciA9IGZ1bmN0aW9uKG5ld05vZGUsIHJlZmVyZW5jZU5vZGUsIHBhcmVudE5vZGUpIHtcclxuICAgIHJlZmVyZW5jZU5vZGUucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUobmV3Tm9kZSwgcmVmZXJlbmNlTm9kZS5uZXh0U2libGluZylcclxuICB9XHJcblxyXG4gIHZhciBub2RlVXBkYXRlID0gZnVuY3Rpb24obmV3Tm9kZSwgb2xkTm9kZSkge1xyXG4gICAgaWYoIW5ld05vZGUpIHJldHVybiBmYWxzZVxyXG4gICAgdmFyIG9BdHRyID0gbmV3Tm9kZS5hdHRyaWJ1dGVzXHJcbiAgICB2YXIgb3V0cHV0ID0ge307XHJcbiAgICBpZihvQXR0cil7XHJcbiAgICAgIGZvcih2YXIgaSA9IG9BdHRyLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XHJcbiAgICAgICAgIG91dHB1dFtvQXR0cltpXS5uYW1lXSA9IG9BdHRyW2ldLnZhbHVlXHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIGZvciAodmFyIGlBdHRyIGluIG91dHB1dCkge1xyXG4gICAgICBpZihvbGROb2RlLmF0dHJpYnV0ZXNbaUF0dHJdICYmIG9sZE5vZGUuYXR0cmlidXRlc1tpQXR0cl0ubmFtZSA9PT0gaUF0dHIgJiYgb2xkTm9kZS5hdHRyaWJ1dGVzW2lBdHRyXS52YWx1ZSAhPSBvdXRwdXRbaUF0dHJdKXtcclxuICAgICAgICBvbGROb2RlLnNldEF0dHJpYnV0ZShpQXR0ciwgb3V0cHV0W2lBdHRyXSlcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgaWYob2xkTm9kZS50ZXh0Q29udGVudCAgPT09ICcnICYmIG5ld05vZGUudGV4dENvbnRlbnQgfHwgb2xkTm9kZS50ZXh0Q29udGVudCAhPSBuZXdOb2RlLnRleHRDb250ZW50KXtcclxuICAgICAgb2xkTm9kZS50ZXh0Q29udGVudCA9IG5ld05vZGUudGV4dENvbnRlbnRcclxuICAgIH1cclxuICAgIG91dHB1dCA9IHt9XHJcbiAgfVxyXG5cclxuICB2YXIgbm9kZVVwZGF0ZUhUTUwgPSBmdW5jdGlvbihuZXdOb2RlLCBvbGROb2RlKSB7XHJcbiAgICBpZighbmV3Tm9kZSkgcmV0dXJuIGZhbHNlXHJcbiAgICBpZihuZXdOb2RlLm5vZGVWYWx1ZSAhPT0gb2xkTm9kZS5ub2RlVmFsdWUpXHJcbiAgICAgICAgb2xkTm9kZS5ub2RlVmFsdWUgPSBuZXdOb2RlLm5vZGVWYWx1ZVxyXG4gIH1cclxuXHJcbiAgdmFyIHVwZGF0ZUVsZW0gPSBmdW5jdGlvbihvbGRFbGVtLCBuZXdFbGVtKXtcclxuICAgIHZhciBvbGRBcnIgPSBbXSwgbmV3QXJyID0gW11cclxuICAgIG9sZEFyci5wdXNoKG9sZEVsZW0pXHJcbiAgICBuZXdBcnIucHVzaChuZXdFbGVtKVxyXG4gICAgbG9vcENoaWxkcyhvbGRBcnIsIG9sZEVsZW0pXHJcbiAgICBsb29wQ2hpbGRzKG5ld0FyciwgbmV3RWxlbSlcclxuICAgIG9sZEFyci5mb3JFYWNoKGZ1bmN0aW9uKGVsZSwgaWR4LCBhcnIpIHtcclxuICAgICAgaWYgKGVsZS5ub2RlVHlwZSA9PT0gMSAmJiBlbGUuaGFzQXR0cmlidXRlcygpKSB7XHJcbiAgICAgICAgbm9kZVVwZGF0ZShuZXdBcnJbaWR4XSwgZWxlKVxyXG4gICAgICB9IGVsc2UgaWYgKGVsZS5ub2RlVHlwZSA9PT0gMykge1xyXG4gICAgICAgIG5vZGVVcGRhdGVIVE1MKG5ld0FycltpZHhdLCBlbGUpXHJcbiAgICAgIH1cclxuICAgICAgaWYoaWR4ID09PSBhcnIubGVuZ3RoIC0gMSl7XHJcbiAgICAgICAgb2xkQXJyLnNwbGljZSgwKVxyXG4gICAgICAgIG5ld0Fyci5zcGxpY2UoMClcclxuICAgICAgfVxyXG4gICAgfSlcclxuICB9XHJcbiAgXHJcbiAgaWYgKCFPYmplY3QucHJvdG90eXBlLndhdGNoKSB7XHJcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoT2JqZWN0LnByb3RvdHlwZSwgJ3dhdGNoJywge1xyXG4gICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcclxuICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxyXG4gICAgICB3cml0YWJsZTogZmFsc2UsXHJcbiAgICAgIHZhbHVlOiBmdW5jdGlvbihwcm9wLCBoYW5kbGVyKSB7XHJcbiAgICAgICAgdmFyIG9sZHZhbCA9IHRoaXNbcHJvcF0sXHJcbiAgICAgICAgICBuZXd2YWwgPSBvbGR2YWwsXHJcbiAgICAgICAgICBnZXR0ZXIgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgcmV0dXJuIG5ld3ZhbFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIHNldHRlciA9IGZ1bmN0aW9uKHZhbCkge1xyXG4gICAgICAgICAgICBvbGR2YWwgPSBuZXd2YWxcclxuICAgICAgICAgICAgcmV0dXJuIG5ld3ZhbCA9IGhhbmRsZXIuY2FsbCh0aGlzLCBwcm9wLCBvbGR2YWwsIHZhbClcclxuICAgICAgICAgIH1cclxuICAgICAgICBpZiAoZGVsZXRlIHRoaXNbcHJvcF0pIHtcclxuICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCBwcm9wLCB7XHJcbiAgICAgICAgICAgIGdldDogZ2V0dGVyLFxyXG4gICAgICAgICAgICBzZXQ6IHNldHRlcixcclxuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSlcclxuICB9XHJcblxyXG4gIGlmICghT2JqZWN0LnByb3RvdHlwZS51bndhdGNoKSB7XHJcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoT2JqZWN0LnByb3RvdHlwZSwgJ3Vud2F0Y2gnLCB7XHJcbiAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxyXG4gICAgICBjb25maWd1cmFibGU6IHRydWUsXHJcbiAgICAgIHdyaXRhYmxlOiBmYWxzZSxcclxuICAgICAgdmFsdWU6IGZ1bmN0aW9uKHByb3ApIHtcclxuICAgICAgICB2YXIgdmFsID0gdGhpc1twcm9wXSBcclxuICAgICAgICBkZWxldGUgdGhpc1twcm9wXSBcclxuICAgICAgICB0aGlzW3Byb3BdID0gdmFsXHJcbiAgICAgIH1cclxuICAgIH0pXHJcbiAgfVxyXG5cclxuICBpZighQXJyYXkucHJvdG90eXBlLnVwZGF0ZSl7XHJcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoQXJyYXkucHJvdG90eXBlLCAndXBkYXRlJywge1xyXG4gICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxyXG4gICAgICAgIHdyaXRhYmxlOiB0cnVlLFxyXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbihpbmRleCwgdmFsdWUpIHsgXHJcbiAgICAgICAgICB0aGlzW2luZGV4XSA9IHZhbHVlXHJcbiAgICAgICAgfVxyXG4gICAgfSlcclxuICB9XHJcbn1cclxuXHJcbktlZXQucHJvdG90eXBlLmxpbmsgPSBmdW5jdGlvbihpZCwgdmFsdWUpIHtcclxuICB2YXIgYXJndiA9IFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzKVxyXG5cclxuICB0aGlzLmVsID0gYXJndlswXVxyXG4gIGlmIChhcmd2Lmxlbmd0aCA9PT0gMil7XHJcbiAgICBpZighYXJndlsxXS50YWcpe1xyXG4gICAgICBhcmd2WzFdLnRhZyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKS50YWdOYW1lLnRvTG93ZXJDYXNlKClcclxuICAgIH1cclxuICAgIHRoaXMuYmFzZSA9IGFyZ3ZbMV1cclxuICB9XHJcbiAgdGhpcy5yZW5kZXIoKVxyXG4gIHJldHVybiB0aGlzXHJcbn1cclxuXHJcbktlZXQucHJvdG90eXBlLmNvbXBvc2UgPSBmdW5jdGlvbihpbnN0YW5jZSkge1xyXG4gIHRoaXMudXBkYXRlKGluc3RhbmNlKVxyXG4gIHJldHVybiB0aGlzXHJcbn1cclxuXHJcbktlZXQucHJvdG90eXBlLm1vdW50ID0gZnVuY3Rpb24oaW5zdGFuY2UpIHtcclxuICB0aGlzLmJhc2UgPSBpbnN0YW5jZVxyXG4gIHJldHVybiB0aGlzXHJcbn1cclxuXHJcbktlZXQucHJvdG90eXBlLmNsdXN0ZXIgPSBmdW5jdGlvbigpIHtcclxuICB2YXIgYXJncyA9IFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzKVxyXG4gIGFyZ3MubWFwKGZ1bmN0aW9uKGZuKXtcclxuICAgIGlmKHR5cGVvZiBmbiA9PT0gJ2Z1bmN0aW9uJykgZm4oKVxyXG4gIH0pXHJcbiAgcmV0dXJuIHRoaXNcclxufVxyXG5cclxuS2VldC5wcm90b3R5cGUubGlzdCA9IGZ1bmN0aW9uKCl7XHJcbiAgcmV0dXJuIHRoaXMuYmFzZSAmJiB0aGlzLmJhc2UubGlzdCB8fCBbXVxyXG59XHJcblxyXG5LZWV0LnByb3RvdHlwZS5nZXRCYXNlID0gZnVuY3Rpb24oY2hpbGQsIGF0dHJpYnV0ZSwgbmV3UHJvcCkge1xyXG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMiAmJiB0aGlzLmJhc2UpXHJcbiAgICB0aGlzLmJhc2VbY2hpbGRdW2F0dHJpYnV0ZV0gPSBuZXdQcm9wXHJcbiAgZWxzZVxyXG4gICAgcmV0dXJuIHRoaXMuYmFzZVtjaGlsZF1bYXR0cmlidXRlXVxyXG59XHJcblxyXG5LZWV0LnByb3RvdHlwZS5hZGRDbGFzcyA9IGZ1bmN0aW9uKGNoaWxkLCBuZXdDbGFzcykge1xyXG4gIHZhciBiID0gdGhpcy5nZXRCYXNlKGNoaWxkLCAnY2xhc3MnKVxyXG5cclxuICB2YXIgaXNBcnIgPSBmdW5jdGlvbigpIHtcclxuICAgIGIucHVzaChuZXdDbGFzcylcclxuICAgIHRoaXMuZ2V0QmFzZShjaGlsZCwgJ2NsYXNzJywgYilcclxuICB9XHJcblxyXG4gIHJldHVybiBBcnJheS5pc0FycmF5KGIpICYmIGlzQXJyKClcclxufVxyXG5cclxuS2VldC5wcm90b3R5cGUucmVtb3ZlQ2xhc3MgPSBmdW5jdGlvbihjaGlsZCwgb2xkQ2xhc3MpIHtcclxuICB2YXIgYiA9IHRoaXMuZ2V0QmFzZShjaGlsZCwgJ2NsYXNzJylcclxuXHJcbiAgdmFyIGhJZHggPSBmdW5jdGlvbihpZHgpIHtcclxuICAgIGIuc3BsaWNlKGlkeCwgMSlcclxuICAgIHRoaXMuZ2V0QmFzZShjaGlsZCwgJ2NsYXNzJywgYilcclxuICB9XHJcblxyXG4gIHZhciBpc0FyciA9IGZ1bmN0aW9uKCkge1xyXG4gICAgdmFyIGlkeCA9IGIuaW5kZXhPZihvbGRDbGFzcylcclxuICAgIGlmICh+aWR4KSBoSWR4KGlkeClcclxuICB9XHJcblxyXG4gIHJldHVybiBBcnJheS5pc0FycmF5KGIpICYmIGlzQXJyKClcclxufVxyXG5cclxuS2VldC5wcm90b3R5cGUuc3dhcENsYXNzID0gZnVuY3Rpb24oY2hpbGQsIGNvbmRpdGlvbiwgY2xhc3Nlc0FycmF5KSB7XHJcbiAgdmFyIGIgPSB0aGlzLmdldEJhc2UoY2hpbGQsICdjbGFzcycpXHJcblxyXG4gIGlmIChjb25kaXRpb24pIGNsYXNzZXNBcnJheS5yZXZlcnNlKClcclxuXHJcbiAgdmFyIGhJZHggPSBmdW5jdGlvbihpZHgpIHtcclxuICAgIGIuc3BsaWNlKGlkeCwgMSwgY2xhc3Nlc0FycmF5WzFdKVxyXG4gICAgdGhpcy5nZXRCYXNlKGNoaWxkLCAnY2xhc3MnLCBiKVxyXG4gIH1cclxuXHJcbiAgdmFyIGlzQXJyID0gZnVuY3Rpb24oKSB7XHJcbiAgICB2YXIgaWR4ID0gYi5pbmRleE9mKGNsYXNzZXNBcnJheVswXSlcclxuICAgIGlmICh+aWR4KSBoSWR4KGlkeClcclxuICB9XHJcblxyXG4gIHJldHVybiBBcnJheS5pc0FycmF5KGIpICYmIGlzQXJyKClcclxufVxyXG5cclxuS2VldC5wcm90b3R5cGUuc3dhcEF0dHIgPSBmdW5jdGlvbihjaGlsZCwgY29uZGl0aW9uLCBwcm9wZXJ0eUFycmF5LCBhdHRyaWJ1dGUpIHtcclxuICBpZiAoY29uZGl0aW9uKSBwcm9wZXJ0eUFycmF5LnJldmVyc2UoKVxyXG4gIHRoaXMuZ2V0QmFzZShjaGlsZCwgYXR0cmlidXRlLCBwcm9wZXJ0eUFycmF5WzBdKVxyXG59XHJcblxyXG5LZWV0LnByb3RvdHlwZS5zZXRBdHRyID0gZnVuY3Rpb24oY2hpbGQsIGF0dHJpYnV0ZSwgbmV3UHJvcGVydHkpIHtcclxuICB0aGlzLmdldEJhc2UoY2hpbGQsIGF0dHJpYnV0ZSwgbmV3UHJvcGVydHkpXHJcbn1cclxuXHJcbktlZXQucHJvdG90eXBlLnRvZ2dsZSA9IGZ1bmN0aW9uKGNoaWxkLCBkaXNwbGF5KSB7XHJcbiAgdmFyIHN0eWwgPSB0aGlzLmJhc2VbY2hpbGRdLnN0eWxlXHJcbiAgT2JqZWN0LmFzc2lnbihzdHlsLCB7IGRpc3BsYXk6IGRpc3BsYXkgfSlcclxuICB0aGlzLmJhc2VbY2hpbGRdLnN0eWxlID0gc3R5bFxyXG59XHJcblxyXG5LZWV0LnByb3RvdHlwZS5jb250ZW50VXBkYXRlID0gZnVuY3Rpb24oY2hpbGQsIGNvbnRlbnQpIHtcclxuICB0aGlzLmJhc2VbY2hpbGRdLnRlbXBsYXRlID0gY29udGVudFxyXG59IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpIHtcclxuICBmdW5jdGlvbiBrdGFnKHRhZywgdmFsdWUsIGF0dHJpYnV0ZXMsIHN0eWxlcykge1xyXG4gICAgdmFyIGF0dHIsIGlkeCwgdGUsIGEgPSBbXS5zbGljZS5jYWxsKGFyZ3VtZW50cyksXHJcbiAgICAgIHJldCA9IFsnPCcsIGFbMF0sICc+JywgYVsxXSwgJzwvJywgYVswXSwgJz4nXVxyXG4gICAgaWYgKGEubGVuZ3RoID4gMiAmJiB0eXBlb2YgYVsyXSA9PT0gJ29iamVjdCcpIHtcclxuICAgICAgZm9yIChhdHRyIGluIGFbMl0pIHtcclxuICAgICAgICBpZih0eXBlb2YgYVsyXVthdHRyXSA9PT0gJ2Jvb2xlYW4nICYmIGFbMl1bYXR0cl0pXHJcbiAgICAgICAgICByZXQuc3BsaWNlKDIsIDAsICcgJywgYXR0cilcclxuICAgICAgICBlbHNlIGlmKGF0dHIgPT09ICdjbGFzcycgJiYgQXJyYXkuaXNBcnJheShhWzJdW2F0dHJdKSlcclxuICAgICAgICAgIHJldC5zcGxpY2UoMiwgMCwgJyAnLCBhdHRyLCAnPVwiJywgYVsyXVthdHRyXS5qb2luKCcgJykudHJpbSgpLCAnXCInKVxyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgIHJldC5zcGxpY2UoMiwgMCwgJyAnLCBhdHRyLCAnPVwiJywgYVsyXVthdHRyXSwgJ1wiJylcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgaWYgKGEubGVuZ3RoID4gMyAmJiB0eXBlb2YgYVszXSA9PT0gJ29iamVjdCcpIHtcclxuICAgICAgaWR4ID0gcmV0LmluZGV4T2YoJz4nKVxyXG4gICAgICB0ZSA9IFtpZHgsIDAsICcgc3R5bGU9XCInXVxyXG4gICAgICBmb3IgKGF0dHIgaW4gYVszXSkge1xyXG4gICAgICAgIHRlLnB1c2goYXR0cilcclxuICAgICAgICB0ZS5wdXNoKCc6JylcclxuICAgICAgICB0ZS5wdXNoKGFbM11bYXR0cl0pXHJcbiAgICAgICAgdGUucHVzaCgnOycpXHJcbiAgICAgIH1cclxuICAgICAgdGUucHVzaCgnXCInKVxyXG4gICAgICByZXQuc3BsaWNlLmFwcGx5KHJldCwgdGUpXHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmV0XHJcbiAgfVxyXG4gIHZhciBhcmdzID0gW10uc2xpY2UuY2FsbChhcmd1bWVudHMpLFxyXG4gICAgYXJyID0ga3RhZy5hcHBseShudWxsLCBhcmdzKVxyXG4gIHJldHVybiBhcnIuam9pbignJylcclxufSJdfQ==
