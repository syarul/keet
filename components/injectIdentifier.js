var loopChilds = require('./elementUtils').loopChilds
var genId = require('./utils').genId


// function to resolve ternary operation
var ternaryOps = function(input) {
  if(input.match(/([^?]*)\?([^:]*):([^;]*)|(\s*=\s*)[^;]*/g)){
    var t = input.split('?')
    var condition = t[0]
    var leftHand = t[1].split(':')[0]
    var rightHand = t[1].split(':')[1]
    // check the condition fulfillment
    if(this[condition])
      return { 
        value:leftHand,
        state: condition
      }
    else
      return { 
        value:rightHand,
        state: condition
      }
  } else return false
}

var insertAfter = function(newNode, referenceNode, parentNode) {
  if(referenceNode)
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling)
  else
    parentNode.insertBefore(newNode, parentNode.firstChild)
}

/**
 * deal with identifier insertion
 *
*/
module.exports = function (child, updateStateList) {
  var self = this

  var arrProps = child.match(/{{([^{}]+)}}/g)

  var tempDiv = document.createElement('div')
  tempDiv.innerHTML = child

  // console.log(tempDiv.innerHTML, tempDiv.childNodes.length)

  var re = /{{\s?([^}]*)\s?}}/

  var vtree = []

  loopChilds(vtree, tempDiv)

  var vtreeStates = []

  // map vtree
  vtree.map(function(v){
    if(v.nodeType === 1 && !v.hasAttribute('keet-v') && v.attributes.length > 0) {
      
      var id = genId()

      for(var attr in v.attributes) {
        if(typeof v.attributes[attr] !== 'function' && typeof v.attributes[attr] !== 'number'){
          if(v.attributes[attr].name.match(re) || v.attributes[attr].value.match(re)){

            var attrData = {}
            attrData.id = id
            attrData.node = v
            // name only attribute
            if(v.attributes[attr].name.match(re) && v.attributes[attr].value === ''){

              var nameAttribute = v.attributes[attr].name.replace(re, '$1')

              // handle conditional ternary operator
              var ternary = ternaryOps.call(self, nameAttribute)

              attrData.type = 'attrOnly'
              attrData.proto = nameAttribute
              if(ternary) {
                v.setAttribute(ternary.value, '')
                attrData.isTernary = true
                attrData.currentValue = ternary.value
                attrData.state = ternary.state
                updateStateList(ternary.state)
              } else {
                v.setAttribute(self[nameAttribute], '')
                attrData.isTernary = false
                attrData.currentValue = self[nameAttribute]
                attrData.state = nameAttribute
                updateStateList(nameAttribute)
              }

              // remove old attr from the node
              v.removeAttribute(v.attributes[attr].name)
              vtreeStates.push(attrData)
            // value only attribute
            } else if(v.attributes[attr].value.match(re)){

              var valueAttribute = v.attributes[attr].value
              // console.log(valueAttribute)
              var rep = valueAttribute.match(/{{([^{}]+)}}/g)

              rep.map(function(r){

                attrData.type = 'propOnly'
                attrData.proto = valueAttribute
                attrData.attr = v.attributes[attr].name
                attrData.props = rep
                attrData.isTernary = false

                // console.log(attrData)

                var repClean = r.replace(re, '$1')
                var ternary = ternaryOps.call(self, repClean)
                // console.log(ternary)
                // handle conditional ternary operator
                if(ternary){
                  attrData.isTernary = true
                  attrData.state = ternary.state
                  valueAttribute = valueAttribute.replace(re, ternary.value)
                  updateStateList(ternary.state)
                } else if(self[repClean] !== undefined){
                  attrData.state = repClean
                  valueAttribute = valueAttribute.replace(/{{([^{}]+)}}/, self[repClean])
                  updateStateList(repClean)
                }

                vtreeStates.push(attrData)
              })
                
              v.setAttribute(v.attributes[attr].name, valueAttribute)
            }

            // set the identity of this node for recuring updates in the future
            v.setAttribute('keet-v', id)
          }
        }
      }
    } else if(v.nodeType === 3 && v.nodeValue.match(re)) {
      var prevSibling = v.previousSibling

      if(!prevSibling || prevSibling && prevSibling.nodeType !== 8 || (prevSibling.nodeType === 8 && !prevSibling.nodeValue.match(/keet-d/))){

        var id = genId()

        var commentStart = document.createComment('keet-d:'+id)
        v.parentNode.insertBefore(commentStart, v)
        var commentEnd = document.createComment('/keet-d')
        insertAfter(commentEnd, v)

        var attrData = {}
        attrData.ref = id
        attrData.type = 'valueOnly'

        var valueAttribute = v.nodeValue

        attrData.proto = valueAttribute
        attrData.isTernary = false

        var rep = valueAttribute.match(/{{([^{}]+)}}/g)

        rep.map(function(r){
          var repClean = r.replace(re, '$1')

          var ternary = ternaryOps.call(self, repClean)
          if(ternary){
            attrData.isTernary = true
            valueAttribute = valueAttribute.replace(re, ternary)
          } else if(self[repClean] !== undefined) {
            valueAttribute = valueAttribute.replace(/{{([^{}]+)}}/, self[repClean])
          }
        })
        v.nodeValue = valueAttribute
        vtreeStates.push(attrData)
      }
    }
  })
  self.__identStores__ = vtreeStates
  return tempDiv
}

exports.ternaryOps = ternaryOps
