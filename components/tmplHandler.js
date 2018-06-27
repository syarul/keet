var strInterpreter = require('./strInterpreter')

module.exports = function (str, updateStateList) {
  var self = this
  var arrProps = str.match(/{{([^{}]+)}}/g)
  if (arrProps && arrProps.length) {
    arrProps.map(function (s) {
      var rep = s.replace(/{{([^{}]+)}}/g, '$1')
      var isObjectNotation = strInterpreter(rep)
      if (!isObjectNotation) {
        if (self[rep] !== undefined) {
          updateStateList(rep)
          str = str.replace(/{{([^{}]+)}}/, self[rep])
        }
      } else {
        if (self[isObjectNotation[0]] !== undefined) {
          updateStateList(isObjectNotation[0])
          str = str.replace(/{{([^{}]+)}}/, self[isObjectNotation[0]][isObjectNotation[1]])
        }
      }
    })
  }
  return str
}
