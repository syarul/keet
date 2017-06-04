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
    .array(this.arr, '<li>{{text}}</li>')
    .watch(null, function(el){
    	console.log(ctx.arr)
  	})

  this.app.compose(true, function() {
    ctx.arr.assign(0, {view: 11, text:'this view 11'})
    setTimeout(function(){
    	ctx.arr.shift()
    }, 1000)
  })
}

new init

