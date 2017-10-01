// watching changes in an object, apply back to element
const obj = {
  background: 'red',
  value: 'this is red background'
}

const keet = () => new Keet('div')

const app = new Keet

app.link('app', '{{state}}')

const updateState = (index, oldVal, newVal) => {
  if (index === 'background')
    state.set(`css-${index}`, newVal)
  else if (index === 'value')
    state.set(newVal)
}

const state = keet()
  .register('app')
  .set({
    value: obj.value,
    'css-background': obj.background,
    'attr-tat': 'aw'
  })//.preserveAttributes()
  .watch(obj, updateState)

app.compose()

let idx = 0
const bgList = ['orange', 'blue', 'cyan', 'grey', 'red']
setInterval(() => {
  idx++
  if (idx > bgList.length - 1) idx = 0
  obj.background = bgList[idx]
  obj.value = `this is ${bgList[idx]} background`
}, 2000)
