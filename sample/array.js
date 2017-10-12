const log = console.log.bind(console)


var c = {
  template: '<li style="background:{{bg}};padding:10px" k-touchstart="handleTouchStart({{first}}, {{last}})" k-touchmove="handleTouchMove({{first}}, {{last}})">{{first}} {{last}}</li>',
  list: [
  	{ first: 'john', last: 'doe', bg: 'blue'}, 
  	{ first: 'rocky', last: 'bulba', bg: 'yellow'}, 
  	{ first: 'james', last: 'king', bg: 'green'},
    { first: 'aro', last: 'dek', bg: 'magenta'},
    { first: 'wot', last: 'duh', bg: 'cyan'},
    { first: 'eh', last: 'oh', bg: 'red'}
  ]
}

c.handleTouchStart = function(name, last, evt){
  log(name, last, evt.type)
}

c.handleTouchMove = function(name, last, evt){
  log(name, last, evt.type)
}

class App extends Keet {
  contructor(){
  }


}

const app = new App

app.mount(c).link('app')

// let el = document.getElementById('app')

// el.addEventListener('touchmove', c.handleTouchMove, false)

// el.addEventListener('touchstart', c.handleTouchStart, false)


// setTimeout(function(){
// 	c['k-list'].push({first: 'awddo', last: 'awdwriw'})
// }, 2000)


// setTimeout(function(){
// 	c['k-list'].push({first: 'xxxx', last: 'hhh'})
// }, 4000)

// setTimeout(function() {
  // c.list.push({first: 'awddo', last: 'awdwriw', bg: 'red'})
  // c.list.shift()
  // c.list.unshift({first: 'em', last: 'woo', bg: 'grey'}, {first: 'foo', last: 'dafoo', bg: 'magenta'})
  // c.list.splice(1)
  // c.list.splice(1, 1, {first: 'awil', last: 'awile', bg: 'cyan'})
  // c.list.splice(1, 0, {first: 'awil', last: 'awile', bg: 'cyan'})
  // c.list.update(2, {
  //   bg: 'red'
  // })
  // c.list.shift()
// }, 1000)