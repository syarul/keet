var cat = require('../cat')
var tag = require('../tag')

// cat(tag('img', null, {src: './res/k.jpg'}), tag('h1', 'Keet.js'), '{{model.menu}}{{model.view}}'))

console.log(cat('a', 'bc'))

console.log(cat(tag('img', null, {src: './res/k.jpg'}), tag('h1', 'Keet.js'), tag('div', 'container test')))