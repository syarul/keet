/* CLI markdown.config.js file example */
var fs = require('fs')
var path = require('path')
var markdownMagic = require('markdown-magic')

var pkg = fs.readFileSync('package.json', 'utf8')

var ver = JSON.parse(pkg).version

var c = [
	`[![npm package](https://img.shields.io/badge/npm-${ver}-blue.svg)](https://www.npmjs.com/package/keet)`,
	`[![browser build](https://img.shields.io/badge/wzrd.in-${ver}-ff69b4.svg)](https://wzrd.in/standalone/keet@latest)`,
	`[![npm module downloads](https://img.shields.io/npm/dt/keet.svg)](https://www.npmjs.com/package/keet)`,
	`[![Build Status](https://travis-ci.org/syarul/keet.svg?branch=master)](https://travis-ci.org/syarul/keet)`,
	`[![Coverage Status](https://coveralls.io/repos/github/syarul/keet/badge.svg?branch=master)](https://coveralls.io/github/syarul/keet?branch=master)`
]

var config = {
  transforms: {
    /* Match <!-- AUTO-GENERATED-CONTENT:START (SHEILDS) --> */
    SHEILDS(content, options) {
      return c.join(' ')
    }
  }
}

var markdownPath = path.join(__dirname, 'README.md')
markdownMagic(markdownPath, config)