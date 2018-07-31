var genModelTemplate = require('./genModelTemplate')
module.exports = function (string) {
  var self = this
  this.__modelList__.map(function (model, index) {
    if (self[model]) {
      var regx = '(\\{\\{model:' + model + '\\}\\})(.*?)(\\{\\{\\/model:' + model + '\\}\\})'
      var re = new RegExp(regx)
      var match = string.match(re)
      if (match) {
        var matchPristine = self.base.match(re)
        var modelTemplate = ''
        self[model]['list'].map(function (obj) {
          modelTemplate += genModelTemplate.call(self, matchPristine[2], obj)
        })
        string = string.replace(match[2], modelTemplate)
      }
    }
    string = string.replace('{{model:' + model + '}}', '')
    string = string.replace('{{/model:' + model + '}}', '')
  })
  return string
}
