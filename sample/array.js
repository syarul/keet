// observing array changes, support operation of assigment, push, pop, shift, unshift, slice, splice
var app = new Keet

app.link('app', '{{operation}}{{container}}')
  .set({
    'css-font-family': 'Verdana, Geneva, sans-serif'
  })

let arr = [], count = 0
for (var i = 0; i < 4; i++) {
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
  .watch(null, function(res){
    console.log(res)
  }) // set to observable mode

var info = new Keet
info
  .register('operation')
  .set('Test type: Splice')

setTimeout(() => {
  arr.splice(1)
  // arr.splice(4, 0, ps(22), ps(23))
},500)