module.exports = function (string) {
  var self = this
  this.__componentList__.map(function (component) {
    if (self[component]) {
      var c = self[component]
      // register this component as a sub-component
      c.IS_STUB = true
      // life-cycle method before rendering sub-component
      var regx = '(\\{\\{component:' + component + '\\}\\})'
      var re = new RegExp(regx, 'g')
      var tpl = c.render('asString')
      self.__componentStub__[component] = tpl
      string = string.replace(re, tpl)
    }
  })
  return string
}
