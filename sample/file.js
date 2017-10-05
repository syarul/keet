const tmpl = {
  template: '{{input}}',
  input: {
    tag: 'input',
    id: 'fileapi',
    'k-change': 'change()',
    type: 'file'
  }
}

const app = new Keet

tmpl.change = evt => console.log(evt)

app.link('app', tmpl)