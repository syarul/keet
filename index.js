/** 
 * Keet.js v2.0.2 Alpha release: https://github.com/syarul/keet
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
        delete cloneChild.bind
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
          if (child.bind){
            ctx.bind(child.bind.type, child.bind.fn)
          }
          if (child.checked) tempDiv.childNodes[0].checked = 'checked'
          else if(child.checked === false)
            tempDiv.childNodes[0].checked = false
        }
        process_event(tempDiv)
        process_on_change(tempDiv)
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
                process_on_change(tempDiv)
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
          process_on_change(tempDiv)
          elemArr.push(tempDiv.childNodes[0])
          watcher2(appObj)
        }
        return elemArr
  }

  var process_event = function(kNode) {
    var listKnodeChild = [], hask, evtName, evthandler, handler, isHandler, argv, i, atts, v
    if (kNode.hasChildNodes()) {
      loopChilds(listKnodeChild, kNode)
      listKnodeChild.forEach(function(c, i) {
        if (c.nodeType === 1 && c.hasAttributes()) {
          for (i = 0, atts = c.attributes; i < atts.length; i++){
            hask = /^k-/.test(atts[i].nodeName)
            if(hask){
              evtName = atts[i].nodeName.split('-')[1]
              evthandler = atts[i].nodeValue
              handler = evthandler.split('(')
              isHandler = testEval(ctx.base[handler[0]]) ? eval(ctx.base[handler[0]]) : false
              if(typeof isHandler === 'function') {
                c.removeAttribute(atts[i].nodeName)
                c.addEventListener(evtName, function(evt){
                  argv = []
                  argv.push(evt)
                  
                  v = handler[1].slice(0, -1).split(',')
                  if(v) v.forEach(function(v){ argv.push(v) })
                  
                  return isHandler.apply(c, argv)
                })
              }
            }
          }
        }
      })
    }
    listKnodeChild = []
  }

  , process_on_change = function(kNode) {    
    var listKnodeChild = []
    if (kNode.hasChildNodes()) {
      loopChilds(listKnodeChild, kNode)
      listKnodeChild.forEach(function(c, i) {
        if (c.nodeType === 1 && c.hasAttributes()) {
          if (c.getAttribute('type') === 'file' && c.tagName === 'INPUT') {
            var change = testEval(ctx.base['change']) ? eval(ctx.base['change']) : false
            if (typeof change === 'function') {
              c.addEventListener('change', function(evt) {
                return change.apply(c, [evt])
              })
            }
          }
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
    if(oldArr.length !== newArr.length){
      // console.warn('old element has different length to the new element')
      // if nodeList length is different, replace the HTMLString
      // oldElem.innerHTML = newElem.innerHTML
      // return false
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