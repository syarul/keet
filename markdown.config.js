/* CLI markdown.config.js file */
var fs = require('fs')
var path = require('path')
var markdownMagic = require('markdown-magic')
var readline = require('readline')

var pkg = fs.readFileSync('package.json', 'utf8')

var ver = JSON.parse(pkg).version

var git_branch = JSON.parse(pkg).git_branch

var c = [
  `[![npm package](https://img.shields.io/badge/npm-${ver}-blue.svg)](https://www.npmjs.com/package/keet)`,
  `[![browser build](https://img.shields.io/badge/rawgit-${ver}-ff69b4.svg)](https://cdn.rawgit.com/syarul/keet/${git_branch}/keet-min.js)`,
  `[![npm module downloads](https://img.shields.io/npm/dt/keet.svg)](https://www.npmjs.com/package/keet)`,
  `[![Build Status](https://travis-ci.org/keetjs/keet.js.svg?branch=${git_branch})](https://travis-ci.org/syarul/keet)`,
  `[![Coverage Status](https://coveralls.io/repos/github/keetjs/keet.js/badge.svg?branch=${git_branch})](https://coveralls.io/github/syarul/keet?branch=${git_branch})`,
  `[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)`
]

var config = {
  transforms: {
    /* Match <!-- AUTO-GENERATED-CONTENT:START (SHEILDS) --> */
    SHEILDS (content, options) {
      return c.join(' ')
    },

    VER () {
      return `# Keetjs v${ver}`
    }

  }
}

var markdownPath = path.join(__dirname, 'README.md')

markdownMagic(markdownPath, config)

String.prototype.replaceAt = function (index, replacement) {
  return this.substr(0, index) + replacement + this.substr(index + replacement.length)
}

function ReadLine2 (file) {
  var rd = readline.createInterface({
    input: fs.createReadStream(file),
    output: process.stdout,
    terminal: false
  })

  var c = 0

  file = file.replace(/([^:]\/)\/+/g, '$1')

  console.log('\nparsing ' + file + '...')

  var info = ''

  rd.on('line', function (line) {
    c++
    if (c > 1 && c < 11) {
      info += line + '\n'
      if (c === 10) {
        fs.appendFile('./keet-min.js', info, function (err) {
          if (err) {
            return console.log(err)
          }
        })
      }
    }
  })
}

function ReadLine (file) {
  var rd = readline.createInterface({
    input: fs.createReadStream(file),
    output: process.stdout,
    terminal: false
  })

  var c = 0

  file = file.replace(/([^:]\/)\/+/g, '$1')

  console.log('\nparsing ' + file + '...')

  rd.on('line', function (line) {
    c++
    if (c === 3) {
      var newLine = line.replaceAt(11, ver)
      fs.readFile(file, 'utf8', function (err, data) {
        if (err) {
          return console.log(err)
        }
        line = line.substr(3)
        newLine = newLine.substr(3)
        var re = new RegExp(line, 'g')
        var result = data.replace(re, newLine)
        console.log(re, newLine)
        fs.writeFile(file, result, 'utf8', function (err) {
          if (err) return console.log(err)
          ReadLine2('./keet.js')
        })
      })
    }
  })
}

ReadLine('./keet.js')
