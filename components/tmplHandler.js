var strInterpreter = require('./strInterpreter')
var ternaryOps = require('./ternaryOps')
var getId = require('../utils').getId
var genModelList = require('./genModelList')
var conditionalNodes = require('./conditionalNodes')

var DOCUMENT_FRAGMENT_TYPE = 11
var DOCUMENT_TEXT_TYPE = 3
var DOCUMENT_ELEMENT_TYPE = 1
var DOCUMENT_COMMENT_TYPE = 8
var DOCUMENT_ATTRIBUTE_TYPE = 2

var re = /{{([^{}]+)}}/g

var model = /^model:/g
var modelRaw = /^\{\{model:([^{}]+)\}\}/g

var conditionalRe = /^\?/g

var toSkipStore = []
var skipNode = []


var sStore = []

var tmplhandler = function (ctx, updateStateList, modelInstance, modelObject, conditional, conditionalState) {

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
  var conditionalRep
  var fn 
  var el
  var idx
  var rem = []
  var isObjectNotation

  if(modelObject){
    instance = modelInstance
  } else if(conditional){
    instance = conditional.firstChild
    // clean up cache nodes for events
    // console.log(conditionalState)
    if(!conditionalState){
      // toSkipStore = []
      // skipNode = []
    }
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
    var repStore = []
    while (ln) {
      ln--
      rep = props[ln].replace(re, '$1')
      tnr = ternaryOps.call(ins, rep)
      isObjectNotation = strInterpreter(rep)
      if(isObjectNotation){
        updateState(rep)
        repStore = repStore.concat(rep)
        value = value.replace('{{' + rep + '}}', ins[isObjectNotation[0]][isObjectNotation[1]])
      } else {
        if(tnr){
          updateState(tnr.state)
          repStore = repStore.concat(tnr.state)
          value = value.replace('{{'+rep+'}}', tnr.value)
        } else {
          if(rep.match(model)){
            modelRep = rep.replace('model:', '')
            // generate list model
            genModelList.call(ctx, node, modelRep, tmplhandler)
          } else if(rep.match(conditionalRe)){
            conditionalRep = rep.replace('?', '')
            if(ins[conditionalRep] !== undefined){
              updateState(conditionalRep)
              repStore = repStore.concat(conditionalRep)
              // process conditional nodes
              conditionalNodes.call(ctx, node, conditionalRep, tmplhandler)
            }
          } else {
            if(ins[rep] !== undefined){
              updateState(rep)
              repStore = repStore.concat(rep)
              value = value.replace('{{'+rep+'}}', ins[rep])
            }
          }
        }
      }
    }

    return {
      value: value,
      store: repStore
    }
  }

  function storeReferences(data){
    var idx = sStore.map(function(s){
      return s.id
    }).indexOf(data.id)
    if(~idx){
      Object.assign(sStore[idx], data)
    } else {
      sStore = sStore.concat(data)
    }
  }

  function inspect(node, id){
    type = node.nodeType
    val = node.nodeValue
    var pristineNode = node.cloneNode(true)
    if(val.match(re)){
      val = replaceHandleBars(val, node)
      node.nodeValue = val.value
      storeReferences({
        id: id || node.parentNode.nodeType === DOCUMENT_FRAGMENT_TYPE ? ctx.el : node.parentNode.id,
        type: 'nodeValue',
        rep: val.store,
        prevSibling: node.previousSibling,
        node: pristineNode
      })
    }
    return node
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
        node.setAttribute(name.value, ns)
      } else if(re.test(ns)){
        ns = replaceHandleBars(ns)
        if(ns.value === ''){
          node.removeAttribute(name)
        } else {
          if(name === 'checked'){
            node.setAttribute(name, '')
          } else {
            node.setAttribute(name, ns.value)
          }
        }
      }
    }
  }

  function lookUpEvtNode(node){
    var realNode
    if(node.id){
      realNode = getId(node.id)
    }
    if(realNode && realNode.hasAttribute('evt-node')){
      return true
    } else {
      return false
    }
    // if(node.hasAttribute('id')){
    //   idx = skipNode.indexOf(node.id)
    //   if(~idx){
    //     return true
    //   } else {
    //     return false
    //   }
    // }
  }

  function addToSkipNode(store, nodeId){
    idx = store.indexOf(nodeId)
    if(!~idx){
      store.push(nodeId)
    }
  }

  function lookupParentNode(rootNode, node, argv){
    while(node){
      if(node.className){
        argv.push(node.className)
      }
      if(node.id){
        argv.push(node.id)
      }
      node = node.parentNode
      if(node.isEqualNode(rootNode)){
        node = null
      }
    }
    return argv
  }

  function addEvent(node){
    nodeAttributes = node.attributes
    if(node && lookUpEvtNode(node)) {
      // skip addding event for node that already has event
      // to allow skipping adding event the node must include `id`/
      // console.trace(1)
      // console.log(node, 'has evt')
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
          if(c !== undefined && typeof c === 'function'){
            h = ns.match(/\(([^{}]+)\)/)
            handlerArgs = h ? h[1] : ''
            argv = handlerArgs.split(',').filter(function(f){
              return f !== ''
            })
            rem.push(name)
            fn = function(e){
              if (e.target !== e.currentTarget) {
                argv = lookupParentNode(node, e.target, [])
                c.apply(ctx, argv.concat(e))
              }
              e.stopPropagation()
            }
            // if node is the rootNode for model, we wrap the eventListener and
            // rebuild the arguments by appending id/className util rootNode.
            if(node.hasChildNodes() && node.firstChild.nodeType === DOCUMENT_TEXT_TYPE && node.firstChild.nodeValue.match(modelRaw)){
              node.addEventListener(evtName, fn, false)
            } else {
              node.addEventListener(evtName, c.bind.apply(c.bind(ctx), [node].concat(argv)), false)
            }
            node.setAttribute('evt-node', '')
            var pristineNode = ctx.__pristineFragment__.getElementById(node.id)
            if(pristineNode){
              pristineNode.setAttribute('evt-node', '')
            }
            // if(node.hasAttribute('id')){
            //   addToSkipNode(toSkipStore, node.id)
            console.log(node.id)
              // console.log(node, 'adding evt')
            // }
          }
        }
        // if(i === 0){
        //   rem.map(function (f) { node.removeAttribute(f) })
        // }
      }
    } 
  }

  var t
  var start = Date.now()

  function end(time){

    if(t) clearTimeout(t)

    t = setTimeout(function(){

      // toSkipStore.map(function(skip){
      //   addToSkipNode(skipNode, skip)
      //   var node = ctx.__pristineFragment__.getElementById(skip)
      //   if(!node) return
      //   nodeAttributes = node.attributes
      //   for (i = nodeAttributes.length; i--;) {
      //     a = nodeAttributes[i]
      //     name = a.localName
      //     if (/^k-/.test(name)) {
      //       node.removeAttribute(name)
      //     }
      //   }
      // })

      // console.log('end', time)

    })
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

  function isEqualNode (a, b) {
    return a.isEqualNode(b)
  }

  function gen(){
    return (Math.random() * 1 * 1e17).toString(32)
  }

  function findNodes(){

  }

  function insertAfter(newNode, referenceNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
  }

  if(ctx.INTERIM) {
    var ii = 0
    var len = sStore.length
    while(ii < len) {
      var current = sStore[ii]
      var idx = current.rep.indexOf(ctx.INTERIM.state)
      if(~idx){
        var prevSibling = current.prevSibling
        var newNode = inspect(current.node, current.id)
        
        var pNode = getId(current.id)
        console.log(current)
        if(!prevSibling){
          console.log('ere')
          // pNode.removeChild(pNode.firstChild)
          // pNode.insertBefore(newNode, pNode.firstChild)
          pNode.firstChild.nodeValue = newNode.nodeValue
        } else {
          var sib = pNode.firstChild
          console.log(sib)
          while(sib){
            console.log(sib)
            if(sib && isEqualNode(sib, prevSibling)){
              console.log(newNode.nodeValue, sib.nextSibling.nodeValue)
              // pNode.removeChild(sib.nextSibling)
              // insertAfter(newNode, sib)
              sib.nextSibling.nodeValue = newNode.nodeValue
            }
            sib = sib.nextSibling
          }
        }
      }
      ii++
    }
  } else {
    check(instance)
  }


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
