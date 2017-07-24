// var app = new Keet

var keet = function keet(ctx) {
	return new Keet(ctx)
}


keet({
	template: '{{base}}',
	base: {
		tag: 'div',
		id: 'menu',
		template: cat(
		  '<div id="cntnr">',
		    '<ul id="items" style="list-style-type:none;padding:10px;margin:0">',
		      '<li>Height: <input id="widthInput" style="width:100px" type="number"></input></li>',
		      '<li>Width</li>',
		      '<li>Cancel</li>',  
		    '</ul>',
		  '</div>'),
		style: {
		  display: 'none',
		  position: 'fixed',
		  border: '1px solid #B2B2B2',
		  width: '180px',      
		  background: '#F9F9F9',
		  'box-shadow': '2px 3px 2px rgba(0, 0, 0, 0.1)',
		  'border-radius':'4px'
		}
	}
}).link('ctxmenu')


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
			'flex-direction': 'column',
			background: 'yellow'
		}
	}
}


keet(c).link('app')

var el

var app = document.getElementById('app')

app.addEventListener('contextmenu', function(e){
	e.preventDefault()
	el = document.getElementById('menu')
	el.style.display = 'block'

	// console.log(e.pageX)

	el.style.left = e.pageX + 'px'
  	el.style.top = e.pageY + 'px'
}, false)

document.addEventListener('click', function(e){
	// el.style.display = 'none'
}, false)


var i = document.getElementById('widthInput')

i.addEventListener('keydown', function(e){
	if(e.which === 13){
		console.log(e.target.value)
		if(e.target.value.length){
			var val = e.target.value + 'px'
			var chg = Object.assign(c.block.style, { width: val})
			c.block.style = chg
			e.target.value = ''
			el.style.display = 'none'
			document.getElementById('app').innerHTML = ''
			setTimeout(function(){
				keet(c).link('app')
				keet(b1).link('b1')
			}, 0)
		}
	}
}, false)

console.log(i)

var b1 = {
	// template: 'b2awwwwwwwww wddddddddddddddd dddddddd dddd dddddddddd ddddd dddddd ddddddd dddddd',
	template: '{{aw}}{{aw2}}',
	aw: {
		tag: 'div',
		template: 'b2aw wwww wwww wddd ddd ddd ddd ddd dddddddd dddd ddddddd ddd ddddd dddddd ddddddd dddddd ',
		style: {
			flex: 2,
			//'flex-grow': 2,
		}
	},
	aw2: {
		tag: 'div',
		style: {
			'flex-grow': '1',
			// width: '100px',
			background: 'red'
		}
	}

}

keet(b1).link('b1')