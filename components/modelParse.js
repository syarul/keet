var genModelTemplate = require('./genModelTemplate')
// var cache = {}
module.exports = function (string) {
  var self = this
  this.__modelList__.map(function (model, index) {
    if (self[model]) {
      // if(cache[model] && self.ops === 'add'){
      //   cache[model].tmpl += genModelTemplate.call(self, cache[model].matchPristine[2], self[model]['list'].slice(-1)[0])
      //   string = string.replace(cache[model].match[2], cache[model].tmpl)
      // } else {
      var regx = '(\\{\\{model:' + model + '\\}\\})(.*?)(\\{\\{\\/model:' + model + '\\}\\})'
      var re = new RegExp(regx)
      var match = string.match(re)
      if (match) {
        var matchPristine = self.base.match(re)
        var modelTemplate = ''
        self[model]['list'].map(function (obj) {
          modelTemplate += genModelTemplate.call(self, matchPristine[2], obj)
        })
        // cache[model] = cache[model] || {}
        // cache[model].tmpl = modelTemplate
        // cache[model].match = match
        // cache[model].matchPristine = matchPristine
        string = string.replace(match[2], modelTemplate)
      }
      // }
    }
    string = string.replace('{{model:' + model + '}}', '')
    string = string.replace('{{/model:' + model + '}}', '')
  })
  return string
}
