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
var modelRaw = /^\{\{model:([^{}]+)\}\}/g

var toSkipStore = []
var skipNode = []

var tmplhandler = function (ctx, updateStateList, modelInstance, modelObject) {

  var currentNode
  var str
  var val 
  var type
  var ln 
  var props 
  var rep
  var fragment
  var instance
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
  var isModelConstruct = false

  if(modelObject){
    instance = modelInstance
    isModelConstruct = true
  } else {
    fragment = ctx.base
    instance = fragment.firstChild
  }

  var ins = modelObject || ctx

  function updateState(state){
    if(typeof updateStateList === 'function'){
      updateStateList(state)
    }
  }

  function replaceHandleBars(value, node) {
    props = value.match(re)
    ln = props.length
    while (ln) {
      ln--
      rep = props[ln].replace(re, '$1')
      tnr = ternaryOps.call(ins, rep)
      if(tnr){
        updateState(tnr.state)
        value = value.replace('{{'+rep+'}}', tnr.value)
      } else {
        if(rep.match(model)){
          modelRep = rep.replace('model:', '')
          value = value.replace('{{'+rep+'}}', '_ms_')

          // generate list model
          // ensure not to stay inside the loop forever
          if(!isModelConstruct){
            genModelList.call(ctx, node, modelRep, tmplhandler)
          }
        } else if(rep.match(modelEnd)){
          value = value.replace('{{'+rep+'}}', '_me_')
        } else {
          if(ins[rep] !== undefined){
            updateState(rep)
            value = value.replace('{{'+rep+'}}', ins[rep])
          }
        }
      }
    }

    return value
  }

  function inspect(node){
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
        var temp = name
        name = replaceHandleBars(name)
        node.setAttribute(name, ns)
      } else if(re.test(ns)){
        ns = replaceHandleBars(ns)
        if(ns === ''){
          node.removeAttribute(name)
        } else {
          if(name === 'checked'){
            node.setAttribute(name, '')
          } else {
            node.setAttribute(name, ns)
          }
        }
      }
    }
  }
  
  var idx

  function lookUpEvtNode(node){
    if(node.hasAttribute('id')){
      idx = skipNode.indexOf(node.id)
      if(~idx){
        return true
      } else {
        return false
      }
    }
  }

  function addToSkipNode(store, nodeId){
    idx = store.indexOf(nodeId)
    if(!~idx){
      store.push(nodeId)
    }
  }

  function addEvent(node){
    nodeAttributes = node.attributes
    if(node && lookUpEvtNode(node)) {
      // skip addding event for node that already has event
      // to allow skipping adding event the node must include `id`/
      // console.log('has evt')
    } else {
      // only add event when node does not has one
      // console.log(node, 'adding evt')
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
            argv = handlerArgs.split(',').filter(function(f){
              return f !== ''
            })

            fn = function(e){
              if (e.target !== e.currentTarget) {
                c.apply(ctx, argv.concat(e))
              }
              e.stopPropagation()
            }
            // if node is root elemment for model we wrap the eventListenr
            if(node.hasChildNodes() && node.firstChild.nodeType === DOCUMENT_TEXT_TYPE && node.firstChild.nodeValue.match(modelRaw)){
              node.addEventListener(evtName, fn, false)
            } else {
              node.addEventListener(evtName, c.bind.apply(c.bind(ctx), [node].concat(argv)), false)
            }
            if(node.hasAttribute('id')){
              addToSkipNode(toSkipStore, node.id)
            }
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

      toSkipStore.map(function(skip){
        addToSkipNode(skipNode, skip)
        var node = ctx.__pristineFragment__.getElementById(skip)
        nodeAttributes = node.attributes
        for (i = nodeAttributes.length; i--;) {
          a = nodeAttributes[i]
          name = a.localName
          if (/^k-/.test(name)) {
            node.removeAttribute(name)
          }
        }
      })

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

module.exports = tmplhandler
