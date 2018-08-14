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
  `[![Build Status](https://travis-ci.org/syarul/keet.svg?branch=${git_branch})](https://travis-ci.org/syarul/keet)`,
  `[![Coverage Status](https://coveralls.io/repos/github/syarul/keet/badge.svg?branch=${git_branch})](https://coveralls.io/github/syarul/keet?branch=${git_branch})`,
  `[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)`
]

var files = ['hello', 'counter', 'conditional-nodes','model', 'sub-component']

var parse = {}

var config = {
  transforms: {
    /* Match <!-- AUTO-GENERATED-CONTENT:START (SHEILDS) --> */
    SHEILDS (content, options) {
      return c.join(' ')
    },

    VER () {
      return `# Keet v${ver}`
    },

    EXAMPLES () {
      return `For more usage cases visit the [examples](https://github.com/syarul/keet/tree/${git_branch}/examples) directory`
    },

    HELLO () {
      return `\`\`\`js\n${parse['hello']}\`\`\``
    },

    COUNTER () {
      return `\`\`\`js\n${parse['counter']}\`\`\``
    },

    CONDITIONAL_NODES () {
      return `\`\`\`js\n${parse['conditional-nodes']}\`\`\``
    },

    MODEL () {
      return `\`\`\`js\n${parse['model']}\`\`\``
    },

    SUB_COMPONENT () {
      return `\`\`\`js\n${parse['sub-component']}\`\`\``
    }

  }
}

var markdownPath = path.join(__dirname, 'README.md')

function next(i, files){
  if(i < files.length){
    var file = files[i]
    var rd = readline.createInterface({
      input: fs.createReadStream(`examples/${file}.js`),
      output: process.stdout,
      terminal: false
    })

    parse[file] = ''

    rd.on('line', function (line) {
      if(!line.match('//rem')){
        if(line.match(/\.\.\/\'/g)){
          line = line.replace(/\.\.\/\'/, 'keet\'')
        } else if(line.match(/\.\.\/utils/g)){
          line = line.replace(/\.\.\/utils/, 'keet\/utils')
          if(line.match(', getId '))
            line = line.replace(', getId ', ' ')
        }
        parse[file] += line + '\n'
      } 
    })
    rd.on('close', function(){
      i++
      next(i, files)
    }) 
  } else {
    markdownMagic(markdownPath, config)
  }
}

next(0, files)

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
    if (c > 0 && c < 11) {
      info += line + '\n'
      if (c === 10) {
        var data = fs.readFileSync('./keet-min.js'); //read existing contents into data
        var fd = fs.openSync('./keet-min.js', 'w+');
        var buffer = new Buffer(info);

        fs.writeSync(fd, buffer, 0, buffer.length, 0); //write new data
        fs.writeSync(fd, data, 0, data.length, buffer.length); //append old data
        fs.close(fd);
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
