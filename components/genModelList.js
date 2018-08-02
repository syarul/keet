var ternaryOps = require('./ternaryOps')
var createModel = require('../utils').createModel

module.exports = function (node, model) {
  var modelList
  var mLength
  var i
  var list = node.nextSibling.cloneNode(true)

  // remove the first prototype node 
  node.nextSibling.remove()

  if(this[model] !== undefined && this[model].hasOwnProperty('list')){
    modelList = this[model].list
    mLength = modelList.length
    i = 0
    while(i < mLength){
      console.log(modelList[i])
      i++
    } 
    // console.log(modelList)
  }

  node.parentNode.insertBefore(list, null)


  // var arrProps = string.match(/{{([^{}]+)}}/g)
  // var rep
  // var isTernary
  // tmpl = string
  // for (var i = 0, len = arrProps.length; i < len; i++) {
  //   rep = arrProps[i].replace(/{{([^{}]+)}}/g, '$1')
  //   isTernary = ternaryOps.call(obj, rep)
  //   if (isTernary) {
  //     tmpl = tmpl.replace('{{' + rep + '}}', isTernary.value)
  //   } else {
  //     tmpl = tmpl.replace('{{' + rep + '}}', obj[rep])
  //   }
  // }
  // return tmpl
}
