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
container.template('span', 'con').set({
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
inner.set('<button id="clickMe">CLICK ME!</button>')

app.compose()

container.compose(function(el){
  container.bindListener('clickMe', doMe, 'click')
  setTimeout(() => container.removeListener('clickMe', 'click'), 3000)
})
