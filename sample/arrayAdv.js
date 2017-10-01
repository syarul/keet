var init = function() {
  var ctx = this
  var keet = function() {
    return new Keet(ctx)
  }

  this.arr = [
    {view: 0, text:'this view 0'},
    {view: 1, text:'this view 1'},
    {view: 2, text:'this view 2'}
  ]

  this.app = keet().link('app', '{{state}}')
  this.state = keet().template('ul', 'viewList')
    .array(this.arr, '<span><input type="checkbox" class="toggler"></input>{{text}}</span>')
    .set({
      'css-display': 'table-footer-group'
    })
    .watch(null, function(el){
      console.log(ctx.arr)
    })

  this.app.compose(true, function() {
    setTimeout(function(){
      ctx.state.evented(0, 'class', 'toggler', {click: true})
    }, 1000)
  })
}

new init