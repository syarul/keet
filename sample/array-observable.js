// observing array changes, support operation of assigment, push, pop, shift, unshift, slice, splice
var app = new Keet

app.link('app', '{{operation}}{{container}}')
  .set({
    'css-font-family': 'Verdana, Geneva, sans-serif'
  })

let arr = [], count = 0
for (var i = 0; i < 20; i++) {
  count++
  arr.push(ps(i))
}

let copyArr = arr.map(x => x)

function ps(i) {
  var obj = {}
  obj.index = i
  obj.random = Math.round(Math.random() * 100000)
  return obj
}

var operation = new Keet
operation.template('div', 'operation').set({
  value:'{{info}}',
  'css-margin-left': '6px'
})

var container = new Keet
container.template('div', 'container')
.set({
  value: '{{list}}',
  'css-position': 'absolute',
  'css-top': '20px'
})

app.compose(ele => {
  ele.style.width = 'auto'
  ele.style.margin = '0 0 0 0'
})

var list = new Keet

list
  .register('container')
  .template('ul', 'ramdomList')
  .array(arr, '<li style="width: auto">index:{{index}} - random: {{random}}</li>')
  .set('css-list-style-type', 'none')
  .preserveAttributes() // preserve attributes on changes applied
  .watch() // set to observable mode

var info = new Keet
info
  .register('operation')
  .set('Test type: Array.prototype.assign, index1 -> index99')

setTimeout(() => {
  arr.assign(1, ps(99))
},2000)

setTimeout(() => {
  info.set('Test type: Array.prototype.push -> index44')
},4000)

setTimeout(() => {
  arr.push(ps(44))
},6000)

setTimeout(() => {
  info.set('Test type: Array.prototype.pop')
},8000)

setTimeout(() => {
  arr.pop()
},10000)

setTimeout(() => {
  info.set('Test type: Array.prototype.shift')
},12000)

setTimeout(() => {
  arr.shift()
},14000)

setTimeout(() => {
  info.set('Test type: Array.prototype.unshift -> index95, index96, index97, index98')
},16000)

setTimeout(() => {
  arr.unshift(ps(95), ps(96), ps(97), ps(98))
},18000)

setTimeout(() => {
  info.set('Test type: Array.prototype.slice -> index0, index5')
},20000)

setTimeout(() => {
  arr.slice(0, 5)
},22000)

setTimeout(() => {
  info.set('Test type: Array.prototype.splice -> index1, 2, index997, index998, index999')
},24000)

setTimeout(() => {
  arr.splice(1, 2, ps(997), ps(998), ps(999))
},26000)

setTimeout(() => {
  info.set('Test type: Assignment, change whole array')
},28000)

setTimeout(() => {
  // we set the list with a new array, call watch again to change into observable mode 
  list.array(copyArr, '<li style="width: auto">index:{{index}} - random: {{random}}</li>').watch()
},30000)

setTimeout(() => {
  info.set('Test type: Clear this nodeList')
},32000)

setTimeout(() => {
  copyArr.splice(0)
},34000)