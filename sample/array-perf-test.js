// test of remove and insert operation in interval 1ms, not a real case
var app = new Keet

app.link('app', '{{list}}')

let arr = []

for (var i = 0; i < 40; i++) {
  var obj = {}
  obj.index = i
  obj.random = Math.round(Math.random() * 100000)
  arr.push(obj)
}

var list = new Keet

list.template('ul', 'ramdomList')
  .array(arr, '<li style="width: auto">index:{{index}} - random: {{random}}</li>')
  .set('css-list-style-type', 'none')

app.compose(ele => {
  ele.style.width = 'auto'
  ele.style.margin = '0 0 0 0'
})

var idx = 0
setInterval(() => {
  list.remove(0)
  idx++
  list.insert({
    index: arr.length - 1 + idx,
    random: Math.round(Math.random() * 100000)
  })
}, 1)