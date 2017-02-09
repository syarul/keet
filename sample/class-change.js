// remove event listener
const app = new Keet('debug')
app.link('app')
  .set({
  	value:'{{container}}',
    'attr-class': 'woo',
  	'k-data': '',
  	'css-display': 'inline-flex'
  })

const container = new Keet
container.register('app').template('span', 'con').set({
    value: '{{inner}}',
    'attr-class': 'aw'
  })

let count = 0

const doMe = function() {
  count++
  if(count % 2 === 0)
    container.set('attr-class', 'modulo')
  else
    container.set('attr-class', 'not modulo')
}

const inner = new Keet('div')
inner.register('container').set({
  value:'<button id="clickMe">CLICK ME!</button>',
  'css-color': 'blue'
}).bindListener('clickMe', doMe, 'click')

setTimeout(() => inner.removeListener('clickMe', 'click'), 3000)