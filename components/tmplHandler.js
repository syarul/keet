var strInterpreter = require('./strInterpreter')
var ternaryOps = require('./ternaryOps')

module.exports = function (str, updateStateList) {
  var self = this
  // var modelRegex = /(\{\{model:([^{}]+)\}\})(.*?)(\{\{\/model:([^{}]+)\}\})/g
  // if(modelRegex.test(str)) {
  //   self.__modelList__ = str.match(modelRegex)
  //   str = str.replace(modelRegex, '')
  // }
  var arrProps = str.match(/{{([^{}]+)}}/g)
  if (arrProps && arrProps.length) {
    arrProps.map(function (s) {
      var rep = s.replace(/{{([^{}]+)}}/g, '$1')
      var isObjectNotation = strInterpreter(rep)
      var isTernary = ternaryOps.call(self, rep)
      if (!isObjectNotation) {
        if (self[rep] !== undefined) {
          updateStateList(rep)
          str = str.replace('{{'+rep+'}}', self[rep])
        } else if(isTernary){
          updateStateList(isTernary.state)
          str = str.replace('{{'+rep+'}}', isTernary.value)
        } 
      } else {
        updateStateList(rep)
        str = str.replace('{{'+rep+'}}', self[isObjectNotation[0]][isObjectNotation[1]])
      }
      if (rep.match(/^\?/g)) {
        updateStateList(rep.replace('?', ''))
      }
      if (rep.match(/^model:/g)) {
        self.__modelList__ = self.__modelList__ || []
        self.__modelList__.push(rep.replace('model:', ''))
      }
    })
  }
  return str
}

