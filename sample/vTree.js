const keet = () => new Keet

const log = console.log.bind(console)

const app = keet().link('app', '{{vTree}}')

const vTree = keet().template('div').register('app')
	.set({
		value: cat(
			'<p some="{{vivo}}">123</p>',
			'<div>533<div>{{vv}}</div></div>',
			'<p><span>666</span</p>'
		),
		'k-data': {
			vv: 0,
			vivo: 'what'
		}
	})

setTimeout(() => {
	vTree.set({
		'k-data': {
			vv: 1,
			vivo: 'there'
		}
	})

	var i = 1
	setInterval(() => {
		i++
		vTree.set({
			'k-data': {
				vv: i,
				vivo: Math.random()
			}
		})
	}
	, 1000)
}, 1000)