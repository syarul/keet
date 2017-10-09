var app = new Keet

var c = {
  template: '<li style="background:{{bg}}">{{first}} {{last}}</li>',
  list: [
  	{ first: 'john', last: 'doe', bg: 'blue'}, 
  	{ first: 'rocky', last: 'bulba', bg: 'yellow'}, 
  	{ first: 'james', last: 'king', bg: 'green'}
  ]
}

app.link('app', c)


// setTimeout(function(){
// 	c['k-list'].push({first: 'awddo', last: 'awdwriw'})
// }, 2000)


// setTimeout(function(){
// 	c['k-list'].push({first: 'xxxx', last: 'hhh'})
// }, 4000)

setTimeout(function() {
  // c.list.push({first: 'awddo', last: 'awdwriw', bg: 'red'})
  // c.list.shift()
  // c.list.unshift({first: 'em', last: 'woo', bg: 'grey'}, {first: 'foo', last: 'dafoo', bg: 'magenta'})
  // c.list.splice(1)
  // c.list.splice(1, 1, {first: 'awil', last: 'awile', bg: 'cyan'})
  c.list.splice(1, 0, {first: 'awil', last: 'awile', bg: 'cyan'})
  // c.list.update(2, {
  //   bg: 'red'
  // })
  // c.list.shift()
}, 1000)