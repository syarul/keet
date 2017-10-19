var through = require('through2')

module.exports = function(app) {

  return through(function(buf, _, next) {
    var tmpl = JSON.parse(buf.toString())

    var funcLookUp = function(obj) {
      for (var attr in obj) {
        var isFn = /^k-/.test(attr)
        if (isFn) {
          var fn = obj[attr].split('(')[0]
          var handler = '_' + fn
          if(typeof app[handler] === 'function'){
            tmpl[fn] = app[handler].bind(app)
          }
        }
      }
    }

    for (var attr in tmpl) {
      if (typeof tmpl[attr] === 'object') {
        funcLookUp(tmpl[attr])
      }
    }

    if(tmpl.mountPoint){
      app.mount(tmpl).link(tmpl.mountPoint)
    } else {
      throw new Error('template has no mount point')
    }

    if(typeof app.componentDidMount === 'function'){
      app.componentDidMount()
    }

    next()
  })

}