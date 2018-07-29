var strInterpreter = require('./strInterpreter')
var ternaryOps = require('./ternaryOps')
module.exports = function (str, updateStateList) {
  var self = this
  var arrProps = str.match(/{{([^{}]+)}}/g)
  if (arrProps && arrProps.length) {
    arrProps.map(function (s) {
      var rep = s.replace(/{{([^{}]+)}}/g, '$1')
      var isObjectNotation = strInterpreter(rep)
      var isTernary = ternaryOps.call(self, rep)
      if (!isObjectNotation) {
        if (self[rep] !== undefined) {
          updateStateList(rep)
          str = str.replace('{{' + rep + '}}', self[rep])
        } else if (isTernary) {
          updateStateList(isTernary.state)
          str = str.replace('{{' + rep + '}}', isTernary.value)
        }
      } else {
        updateStateList(rep)
        str = str.replace('{{' + rep + '}}', self[isObjectNotation[0]][isObjectNotation[1]])
      }
      // resolve nodeVisibility
      if (rep.match(/^\?/g)) {
        updateStateList(rep.replace('?', ''))
      }
      // resolve model
      self.__modelList__ = self.__modelList__ || []
      if (rep.match(/^model:/g)) {
        var modelRep = rep.replace('model:', '')
        if (!~self.__modelList__.indexOf(modelRep)) { self.__modelList__.push(modelRep) }
      }
      // resolve component
      self.__componentList__ = self.__componentList__ || []
      if (rep.match(/^component:/g)) {
        var componentRep = rep.replace('component:', '')
        if (!~self.__componentList__.indexOf(componentRep)) { self.__componentList__.push(componentRep) }
      }
    })
  }
  return str
}
