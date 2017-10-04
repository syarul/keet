/* CLI markdown.config.js file example */
var fs = require('fs')
var path = require('path')
var markdownMagic = require('markdown-magic')

var pkg = fs.readFileSync('package.json', 'utf8')

var ver = JSON.parse(pkg).version

var config = {
  transforms: {
    /* Match <!-- AUTO-GENERATED-CONTENT:START (SHEILDS) --> */
    SHEILDS(content, options) {
      return `[![npm package](https://img.shields.io/badge/npm-${ver}-blue.svg)](https://www.npmjs.com/package/keet) [![browser build](https://img.shields.io/badge/wzrd.in-${ver}-ff69b4.svg)](https://wzrd.in/standalone/keet@latest) [![npm module downloads](https://img.shields.io/npm/dt/keet.svg)](https://www.npmjs.com/package/keet)`
    }
  }
}

var markdownPath = path.join(__dirname, 'README.md')
markdownMagic(markdownPath, config)