var strInterpreter = require('./strInterpreter')
var ternaryOps = require('./ternaryOps')
var getId = require('../utils').getId
var genModelList = require('./genModelList')

var DOCUMENT_FRAGMENT_TYPE = 11
var DOCUMENT_TEXT_TYPE = 3
var DOCUMENT_ELEMENT_TYPE = 1
var DOCUMENT_COMMENT_TYPE = 8
var DOCUMENT_ATTRIBUTE_TYPE = 2

var re = /{{([^{}]+)}}/g

var model = /^model:/g
var modelEnd = /\/model:/g

module.exports = function (ctx, updateStateList) {
  
  var currentNode
  var str
  var val 
  var type
  var ln 
  var props 
  var rep
  var fragment = ctx.base
  var instance = fragment.firstChild
  var nodeAttributes
  var i = 0
  var a
  var ns
  var evtName
  var c
  var h
  var handlerArgs
  var argv
  var handler
  var tnr 
  var modelRep
  var fn 
  var el

  function replaceHandleBars(value, node) {
    props = value.match(re)
    ln = props.length

    while (ln) {
      ln--
      rep = props[ln].replace(re, '$1')
      tnr = ternaryOps.call(ctx, rep)
      if(tnr){
        updateStateList(tnr.state)
        value = tnr.value
      } else {
        if(rep.match(model)){
          modelRep = rep.replace('model:', '')
          value = value.replace('{{'+rep+'}}', '')

          // list generate model
          genModelList.call(ctx, node, modelRep)
        } else if(rep.match(modelEnd)){
          value = value.replace('{{'+rep+'}}', '')
        } else {
          updateStateList(rep)
          if(ctx[rep] !== undefined){
            value = value.replace('{{'+rep+'}}', ctx[rep])
          }
        }
      }
    }

    return value
  }

  function inspect(node){
    // console.log(node)
    type = node.nodeType
    val = node.nodeValue
    if(val.match(re)){
      val = replaceHandleBars(val, node)
      node.nodeValue = val
    } 
  }

  function inspectAttributes(node){
    nodeAttributes = node.attributes
    for (i = nodeAttributes.length; i--;) {
      a = nodeAttributes[i]
      name = a.localName
      ns = a.nodeValue
      if (re.test(name)) {
        node.removeAttribute(name)
        name = replaceHandleBars(name)
        node.setAttribute(name, ns)
      } else if(re.test(ns)){
        ns = replaceHandleBars(ns)
        node.setAttribute(name, ns)
      }
    }
  }

  function addEvent(node){
    nodeAttributes = node.attributes
    if(node.parentNode.nodeType === DOCUMENT_FRAGMENT_TYPE){
      el = getId(ctx.el)
    } else {
      el = node.parentNode.id && getId(node.parentNode.id)
    }

    if(el && el.hasAttribute('evt-node')) {
      // console.log('has evt')
      for (i = nodeAttributes.length; i--;) {
        a = nodeAttributes[i]
        name = a.localName
        if (/^k-/.test(name)) {
          node.removeAttribute(name)
        }
      }
    } else if(el && !el.hasAttribute('evt-node')) {
      // console.log('adding evt')
      for (i = nodeAttributes.length; i--;) {
        a = nodeAttributes[i]
        name = a.localName
        ns = a.nodeValue
        if (/^k-/.test(name)) {
          evtName = name.replace(/^k-/, '')
          handler = ns.match(/[a-zA-Z]+(?![^(]*\))/)[0]
          c = ctx[handler]
          if(c){
            h = ns.match(/\(([^{}]+)\)/)
            handlerArgs = h ? h[1] : ''
            argv = handlerArgs.split(',')
            fn = function(e){
              if (e.target !== e.currentTarget) {
                c.apply(ctx, argv.concat(e))
              }
              e.stopPropagation()
            }
            el.addEventListener(evtName, fn, false)
            el.setAttribute('evt-node', '')
            node.removeAttribute(name)
          }
        }
      }
    } 
  }

  var t
  var start = Date.now()

  function end(time){
    if(t) clearTimeout(t)
    t = setTimeout(function(){
      console.log('end', time)
    }, 100)
  }

  function check(node){
    while(node){
      currentNode = node
      if(currentNode.nodeType === DOCUMENT_ELEMENT_TYPE){
        if(currentNode.hasAttributes()){
          addEvent(currentNode)
          inspectAttributes(currentNode)
        }
        check(currentNode.firstChild)
      } else {
        inspect(currentNode)
      }
      node = node.nextSibling || end(Date.now() - start)
    } 
  }

  check(instance)

  // return
  // var arrProps = str.match(/{{([^{}]+)}}/g)
  // if (arrProps && arrProps.length) {
  //   arrProps.map(function (s) {
  //     var rep = s.replace(/{{([^{}]+)}}/g, '$1')
  //     var isObjectNotation = strInterpreter(rep)
  //     var isTernary = ternaryOps.call(self, rep)
  //     if (!isObjectNotation) {
  //       if (self[rep] !== undefined) {
  //         updateStateList(rep)
  //         str = str.replace('{{' + rep + '}}', self[rep])
  //       } else if (isTernary) {
  //         updateStateList(isTernary.state)
  //         str = str.replace('{{' + rep + '}}', isTernary.value)
  //       }
  //     } else {
  //       updateStateList(rep)
  //       str = str.replace('{{' + rep + '}}', self[isObjectNotation[0]][isObjectNotation[1]])
  //     }
  //     // resolve nodeVisibility
  //     if (rep.match(/^\?/g)) {
  //       updateStateList(rep.replace('?', ''))
  //     }
  //     // resolve model
  //     if (rep.match(/^model:/g)) {
  //       var modelRep = rep.replace('model:', '')
  //       if (!~self.__modelList__.indexOf(modelRep)) { self.__modelList__.push(modelRep) }
  //     }
  //     // resolve component
  //     if (rep.match(/^component:/g)) {
  //       var componentRep = rep.replace('component:', '')
  //       if (!~self.__componentList__.indexOf(componentRep)) { self.__componentList__.push(componentRep) }
  //     }
  //   })
  // }
  // return str
}
