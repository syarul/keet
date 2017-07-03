var app = new Keet

app.link('app', '{{test}}')

var test = new Keet

var obj = {
	'attr-type': 'checkbox',
	'el-checked': false,
	'css-display': 'block'
}

var i = 0

test.template('input', 'test-check')
	.watchDistict(obj)

app.compose(function(){
	setInterval(function(){
		i++	
		obj['el-checked'] = i % 2 === 0 ? false : true
		// obj['css-display'] = i % 2 === 0 ? 'block' : 'none'
	}, 3000)
})