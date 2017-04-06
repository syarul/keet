// how to bind value from an input field to an element
const app = new Keet

app.link('app', '<h1>Keet: Input binding sample</h1>{{container}}')


const container = new Keet

container
  .template('div', 'Container')
  .set({
    value: '<input type="text" id="Input"> {{change}}',
    'css-display': 'inline-flex'
  })

const change = new Keet
change
  .template('p', 'Change')
  .set({
    'css-margin': '0 0 0 8px',
    value: ''
  })

// we stage the Container into static mode by calling compose() only one time, ensure mutation does not occur on eventListener
app.compose(true, () => {
  container
    .compose(() => container.bindListener('Input', change))
})