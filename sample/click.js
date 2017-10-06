const tmpl = {
  template: '{{click}}',
  click: {
    tag: 'button',
    id: 'clicker',
    'k-click': 'clicker()',
    'k-mouseout': 'mouseout()',
    template: 'click me!'
  }
}

const app = new Keet

tmpl.clicker = evt => console.log(evt.type)

tmpl.mouseout = evt => console.log(evt.type)

app.link('app', tmpl)