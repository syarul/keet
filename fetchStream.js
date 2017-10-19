var through = require('through2')

module.exports = function(){
  return through(function(chunk, _, next) {
    var self = this, buf, url, fetchData

    try {
      buf = JSON.parse(chunk.toString())
      url = buf.url || '/'
      fetchData = {
        method: buf.method || 'get',
        mode: 'same-origin',
        credentials: 'same-origin',
        cache: 'no-cache',
        headers: {
          'content-type': buf.contentType || 'application/json'
        }
      }

      if (buf.method == 'post') {
        fetchData.body = buf.body
      } else if (buf.method == 'get' && buf.query){
        fetchData.query = buf.query
      }
    } catch(e){
      url = chunk.toString()
      fetchData = null
    }

    if(typeof fetch !== 'function'){
      throw new Error('Your browser support fetch api?')
    }

    fetch(url, fetchData)
      .then(function(response) {
        return response.json()
      })
      .then(function(json) {
        self.push(JSON.stringify(json))
        next()
      })
  })
} 
