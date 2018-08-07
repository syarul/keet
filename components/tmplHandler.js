var strInterpreter = require('./strInterpreter')
var ternaryOps = require('./ternaryOps')
var getId = require('../utils').getId
var genModelList = require('./genModelList')
var conditionalNodes = require('./conditionalNodes')

var l = console.log.bind(console)

var DOCUMENT_FRAGMENT_TYPE = 11
var DOCUMENT_TEXT_TYPE = 3
var DOCUMENT_ELEMENT_TYPE = 1
var DOCUMENT_COMMENT_TYPE = 8
var DOCUMENT_ATTRIBUTE_TYPE = 2

var re = /{{([^{}]+)}}/g

var model = /^model:/g
var modelRaw = /^\{\{model:([^{}]+)\}\}/g

var conditionalRe = /^condt:/g
var conditionalReEnd = /^\/condt:/g

var toSkipStore = []
var skipNode = []

var tmplhandler = function (ctx, oldParent, updateStateList, modelInstance, modelObject, conditional) {

  var currentNode
  var str
  var val 
  var type
  var ln 
  var props 
  var rep
  var newParent
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
  var isModelConstruct = false
  var idx
  var rem = []
  var isObjectNotation

  if(modelObject){
    newParent = modelInstance
    isModelConstruct = true
  } else if(conditional){
    newParent = conditional
  } else {
    newParent = ctx.base
  }

  var ins = modelObject || ctx

  function updateState(state){
    if(typeof updateStateList === 'function'){
      updateStateList(state)
    }
  }

  var currentConditionalNode

  function replaceHandleBars(value, node, protoBuild) {
    props = value.match(re)
    ln = props.length

    while (ln) {
      ln--
      rep = props[ln].replace(re, '$1')
      tnr = ternaryOps.call(ins, rep)
      isObjectNotation = strInterpreter(rep)
      if(isObjectNotation){
        updateState(rep)
        if(!protoBuild) value = value.replace('{{' + rep + '}}', ins[isObjectNotation[0]][isObjectNotation[1]])
      } else {
        if(tnr){
          updateState(tnr.state)
          if(!protoBuild) value = value.replace('{{'+rep+'}}', tnr.value)
        } else {
          if(rep.match(model)){
            modelRep = rep.replace('model:', '')
            
            // generate list model
            // ensure not to stay inside the loop forever
            if(!isModelConstruct){
              genModelList.call(ctx, node, modelRep, tmplhandler)
            }
          } else if(rep.match(conditionalRe)){
            conditionalRep = rep.replace('condt:', '')
            var nc = document.createComment('condt:'+conditionalRep)
            node.parentNode.replaceChild(nc, node)
            if(ins[conditionalRep] !== undefined){
              updateState(conditionalRep)
              currentConditionalNode = nc
            }
          } else if(rep.match(conditionalReEnd)){
            conditionalRep = rep.replace('/condt:', '')
            node.parentNode.replaceChild(document.createComment('/condt:'+conditionalRep), node)
            // begin parsing conditional nodes range
            conditionalNodes.call(ctx, currentConditionalNode, conditionalRep, tmplhandler, protoBuild)
          } else {
            if(ins[rep] !== undefined){
              updateState(rep)
              if(!protoBuild) value = value.replace('{{'+rep+'}}', ins[rep])
            }
          }
        }
      }
    }

    return value
  }

  function inspect(node, protoBuild){
    if(node.nodeType === DOCUMENT_TEXT_TYPE){
      var val = node.nodeValue
      if(val.match(re)){
        val = replaceHandleBars(val, node, protoBuild)
        node.nodeValue = val
      }
    }
    return node
  }

  function inspectElement(node){
    // inspectAttributes(node)
    // addEvent(node)
    var child = node.firstChild
    while(child){
      var currentChild = child 
      child = child.nextSibling
      if(currentChild.nodeType === DOCUMENT_ELEMENT_TYPE){
        inspectElement(currentChild)
      } else {
        inspect(currentChild)
      }
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

  function addEvent(node){
    nodeAttributes = node.attributes
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
        }
      }
      if(i === 0){
        rem.map(function (f) { node.removeAttribute(f) })
      }
    }
  }

  ///////////////

  function getCheckSum (node) {
    return node.getAttribute('keet-data-id') || NaN
  }

  function isEqualNode (a, b) {
    return (
      // Check if both nodes have the same checksum.
      (getCheckSum(a) === getCheckSum(b)) ||
      // Fall back to native isEqualNode check.
      a.isEqualNode(b)
    )
  }

  function setAttributes (oldAttributes, newAttributes) {
    var i, a, b, ns, name

    // Remove old attributes.
    for (i = oldAttributes.length; i--;) {
      a = oldAttributes[i]
      ns = a.namespaceURI
      name = a.localName
      b = newAttributes.getNamedItemNS(ns, name)
      if (!b) oldAttributes.removeNamedItemNS(ns, name)
    }

    // Set new attributes.
    for (i = newAttributes.length; i--;) {
      a = newAttributes[i]
      ns = a.namespaceURI
      name = a.localName
      b = oldAttributes.getNamedItemNS(ns, name)
      if (!b) {
        // Add a new attribute.
        newAttributes.removeNamedItemNS(ns, name)
        oldAttributes.setNamedItemNS(a)
      } else if (b.value !== a.value) {
        // Update existing attribute.
        b.value = a.value
      }
    }
  }

  function resolve(oldNode, newNode){

    inspect(newNode)

    if (oldNode.nodeType === newNode.nodeType) {
      // Handle regular element node updates.
      if (oldNode.nodeType === DOCUMENT_ELEMENT_TYPE) {
        // Checks if nodes are equal before diffing.
        if (isEqualNode(oldNode, newNode)) return

        // inspectElement(newNode)

        // Update all children (and subchildren).
        check(oldNode, newNode)

        // Update the elements attributes / tagName.
        if (oldNode.nodeName === newNode.nodeName) {
          inspectAttributes(newNode)
          addEvent(newNode)
          // If we have the same nodename then we can directly update the attributes.
          setAttributes(oldNode.attributes, newNode.attributes)
        } else {
          // Otherwise clone the new node to use as the existing node.
          var newPrev = newNode.cloneNode()
          // Copy over all existing children from the original node.
          while (oldNode.firstChild) newPrev.appendChild(oldNode.firstChild)
          // Replace the original node with the new one with the right tag.
          oldNode.parentNode.replaceChild(newPrev, oldNode)
        }
      } else {

        // inspect(newNode)

        // Handle other types of node updates (text/comments/etc).
        // If both are the same type of node we can update directly.
        if (oldNode.nodeValue !== newNode.nodeValue) {
          oldNode.nodeValue = newNode.nodeValue
        }
      }
    } else {
      // we have to replace the node.
      oldNode.parentNode.replaceChild(newNode, oldNode)
    }
  }

  var currentOld
  // @setChildren
  function check(oldParent, newParent){

    var oldNode = oldParent.firstChild
    var newNode = newParent.firstChild

    // if oldNode is empty we parse the whole newParent.childNodes
    if(!oldNode){
      parse(newNode)
    }

    while(newNode){
      currentNode = newNode
      newNode = newNode.nextSibling
      // if oldNode exist we resolve newNode to the oldNode
      if(oldNode){
        currentOld = oldNode
        oldNode = oldNode.nextSibling
        resolve(currentOld, currentNode)
      } else {
        // we resolve currentNode if oldNode does not exist
        oldParent.appendChild(currentNode)
      }
    } 
  }

  function parse(node){
    while(node){
      currentNode = node
      node = node.nextSibling
      if(currentNode.nodeType === DOCUMENT_ELEMENT_TYPE){
        parse(currentNode.firstChild)
      } else {
        inspect(currentNode, 'protoBuild')
      }
    }
  }


  function which(node){
    if(node.nodeType === DOCUMENT_ELEMENT_TYPE){
        return inspectElement(node)
      } else {
        return inspect(node)
      }
  }

  oldParent ? check(oldParent, newParent) : which(newParent)

}

module.exports = tmplhandler
