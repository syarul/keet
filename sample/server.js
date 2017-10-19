var path = require('path')
var express = require('express')
var bodyParser = require('body-parser')
var app = express()
var http = require('http')
var https = require('https')

var log = console.log.bind(console)

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

app.use(express.static(path.join(__dirname, '/')))

const util = require('util')

const fav = (req, res) => {
  // Ignore favicon requests
  if (req.url === '/favicon.ico') {
    res.writeHead(200, {'Content-Type': 'image/x-icon'})
    res.end()
    return
  }
}

app.use(fav)

app.get('*', function(req, res) {
    log(util.inspect(req.url, false, 1))
    res.render('./index.html')
})

app.listen(8080)
