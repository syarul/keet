function init() {
	
	var keet = () => new Keet(this)

	this.completeAll = function(){
		console.log(arguments)
	}

	b = {
		'css-color': 'red',
		'attr-type': 'checkbox',
		'attr-k-click': 'completeAll()',
		'el-click': false
	}

	this.app = keet().link('app', '{{test}}')

	this.test = keet().template('input', 'test-check')
	.watchDistict(b, 'click me!')
	
	this.app.compose()

	setInterval(function(){
		b['el-click'] = true
	}, 1000)

}

let closed = new init()