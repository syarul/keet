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
  ,   getId = function(id, uid) {
        var ret        
        if (isDoc) {
            ret = document.getElementById(id)
            if (!ret && uid) ret = document.querySelector(cat('[k-link="', uid, '"]'))
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
        delete cloneChild['k-bind']
        var s = tag(child.tag, child.template ? child.template : '', cloneChild, child.style)
        tempDiv.innerHTML = s
        if(child.tag === 'input'){
          if (child.click) tempDiv.childNodes[0].click()
          if (child['k-bind']){ 
            ctx.bind('input', child['k-bind'])
          }
          if (child.checked) tempDiv.childNodes[0].checked = 'checked'
          else if(child.checked === false)
            tempDiv.childNodes[0].checked = false
        }
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
        } else {
          tempDiv = document.createElement('div')
          tempDiv.innerHTML = str
          elemArr.push(tempDiv.childNodes[0])
        }
        return elemArr
  }

  this.uid = guid()

  /**
  * render component to DOM
  */

  this.render = function(){
    var ele = getId(ctx.el, ctx.uid)
    var elArr = parseStr(ctx.base, true)
    for (var i = 0; i < elArr.length; i++) {
      ele.appendChild(elArr[i])
    }

  }

  this.update = function(appObj){
    var ele = getId(ctx.el, ctx.uid)
    var elArr = parseStr(appObj, true)
    for (var i = 0; i < elArr.length; i++) {
      ele.replaceChild(elArr[i], ele.childNodes[i])
    }
  }

  this.bind = function(type, fn){
    var ele = getId(ctx.el, ctx.uid)
    ele.addEventListener(type, ctx.base ? fn.bind(ctx.base) : fn, false)
  }

  var watcher = function(instance, index){
    var obj, attr, ele, copyInstance, newElem
    for (attr in instance){
      instance.watch(attr, function(idx, o, n) {
        instance.unwatch(attr)
        obj = {}
        obj[idx] = n
        ele = getId(ctx.el, ctx.uid)
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
        if(iAttr === 'checked'){
          if(output[iAttr] === 'true'){
            oldNode.checked = true
            oldNode.setAttribute(iAttr, 'checked')
          } else{
            oldNode.checked = false
            oldNode.setAttribute(iAttr, false)
          }
        } else if(iAttr === 'click'){
            oldNode.click()
        }
        else
          oldNode.setAttribute(iAttr, output[iAttr])
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

Keet.prototype.link = function(id, value) {
  var argv = [].slice.call(arguments), kLink
  if (argv.length === 1) this.el = argv[0]
  else if (argv.length === 2 && !this.tmpl) {
    this.el = argv[0]
    this.base = argv[1]
    this.render()
  } else if (argv.length === 2 && this.tmpl) {
    kLink = this.tmpl.indexOf(' k-link="')
    if(~kLink) {
      this.tmpl.splice(kLink, 2, ' id="', argv[0])
    }
    this.el = argv[0]
    this.render()
  } else {
    throw('component already declared')
  }
  return this
}

Keet.prototype.compose = function(instance) {
  this.update(instance)
  return this
}