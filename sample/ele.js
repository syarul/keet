var app = new Keet

app.link('app', '{{test}}')

var test = new Keet

var v = {
	'checked': true
}

test.template('input', 'test-check')
	.set({
		'attr-type': 'checkbox',
		'el-checked': true
	})
	.watch(v, function(prop, oldStatus, newStatus){
		console.log(prop, newStatus)
		this.set({'el-checked': newStatus })
	})

var i = 0

var vv = setInterval(function(){
	i++	
	v['checked'] = i % 2 === 0 ? true : false
}, 3000)


app.compose()
