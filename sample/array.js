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
  // c['k-list'].push({first: 'awddo', last: 'awdwriw'})
  // c['k-list'].shift()
  // c.list.unshift({first: 'john', last: 'doe'}, {first: 'rocky', last: 'bulba'})
  // c.list.splice(0, 2)
  c.list.splice(1, 1, {first: 'awil', last: 'awile'})
  // c.list.update(2, {
  //   bg: 'red'
  // })
  // c.list.shift()
}, 2000)