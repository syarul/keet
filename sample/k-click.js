// accessing closure variable

var _log = console.log.bind(console)

var arr = [
	{name: 'john', age: 2},
	{name: 'sally', age: 6}
]

var handle2Click = function(){
	_log('window')
	_log(arguments)
}

/// test closure
function init() {
	
	this.handleClick = function(){
		_log('closure')
		_log(arguments)
	}

	this.keet = () => new Keet(this)

	this.app = this.keet().link('app', 'click event within closure {{state}}')

	this.state = new Keet('div', this)
	this.state
		// .array(arr, '<button k-click="handleClick({{age}}, {{name}})">click me {{name}}</button>')
		.set({
			value: '<button k-click="handleClick({{val}})">click me</button>',
			'k-data': {
				val: 'just a val'
			}
		})

	this.app.compose()
}

let closed = new init()

/// test global ref
/*var keet = () => new Keet // pass context this as argument to Keet constructor

var app = keet().link('app', 'click event {{state}}')

var state = new Keet('div')
state
	.array(arr, '<button k-click="handle2Click({{age}}, {{name}})">click me {{name}}</button>')
	// .set({
	// 	value: '<button k-click="handle2Click({{val}})">click me</button>',
	// 	'k-data': {
	// 		val: 'just a val'
	// 	}
	// })

app.compose()*/

