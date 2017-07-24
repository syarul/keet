// var app = new Keet

var keet = function keet(ctx) {
	return new Keet(ctx);
};


var c = { 
	tag: 'div',
	template: '{{block}}',
	block: {
		tag: 'div',
		id: 'b1',
		style: {
			height: '300px',
			width: '600px',
			border: '1px solid blue',
			display: 'flex',
			'flex-flow': 'row wrap',
			background: 'yellow'
		}
	}
}

setTimeout(function(){
	// var chg = Object.assign(c.block.style, { width: '60px'})
	// c.block.style = chg
}, 2000)

keet(c).link('app')

keet({
	template: '{{aw1}}{{aw2}}',
	aw1: {
		tag: 'div',
		id: 'b22',
		style: {
			// height: '20px',
			width: '200px',
			background: 'yellow',
			border: '1px solid green',
			display: 'flex',
			'flex-direction': 'column',
			// 'flex-grow': '1'
		}
	},
	aw2: {
		tag: 'div',
		id: 'b2',
		style: {
			// height: '20px',
			// width: '20px',
			background: 'yellow',
			border: '1px solid green',
			display: 'flex',
			'flex-direction': 'column',
			'flex-grow': '1',
			'flex-wrap': 'wrap',
			'word-wrap': 'break-word'
		}
	}
}).link('b1')

/*keet({
	template: '{{ww}}',
	ww: {
		tag: 'div',
		id: 'b44',
		style: {
			// height: '20px',
			// width: '20px',
			background: 'green',
			border: '1px solid blue',
			display: 'flex',
			'flex-direction': 'column',
			'flex-grow': '1'
		}
	},
}).link('b22')*/


keet({
	template: '{{aw22}}{{aw2}}{{aw2}}',
	aw2: {
		tag: 'div',
		id: 'b3',
		style: {
			// height: '20px',
			// width: '20px',
			background: 'red',
			border: '1px solid blue',
			display: 'flex',
			'flex-direction': 'column',
			'flex-grow': '1'
		}
	},
	aw22: {
		tag: 'div',
		id: 'b33',
		//template: '<p>awwwwwwwwww wwwaddddddddd ddwwwaaaaaf eeeeeeddddddddddd</p>',
		style: {
			height: '200px',
			// width: '20px',
			background: 'aqua',
			border: '1px solid blue',
			// 'flex-basis': '0',
			//'max-width': '300px',
			// 'flex-shrink': '1'
			// display: 'flex',
			// 'flex-direction': 'column',
			// 'flex-grow': '1',
			// 'word-wrap': 'break-word',
			// whitespace: 'wrap'
		}
	}
}).link('b2')


// keet({
// 	template: ''
// }).link('b33')

// var app2 = new Keet

// app2.link('b1', {
// 	template: '',
// 	style: {
// 			height: '40px',
// 			width: '80px',
// 			background: 'yellow',
// 			border: '1px solid blue',
// 			display: 'inline-flex'
// 		}
// })