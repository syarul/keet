var log = console.log.bind(console)
var arr = []

for(var i = 0; i < 5000; i++){
	arr.push(Math.round(Math.random()*1e12).toString(32))
}

console.time('for loop')
for(var i = 0; i < arr.length; i++){
	arr[i] = arr[i] + '_test'
	if(i === arr.length - 1){
		console.timeEnd('for loop')
	}
}

console.time('for loop assign len')
for(var i = 0, len = arr.length; i < len; i++){
	arr[i] = arr[i] + '_test2'
	if(i === arr.length - 1){
		console.timeEnd('for loop assign len')
	}
}

function next(i, arr){
	if(i < arr.length){
		arr[i] = arr[i] + '_test3'
		// log(arr[i])
		i++
		next(i, arr)
	} else {
		console.timeEnd('fn')
	}
}

console.time('fn')
next(0, arr)

var i = 0
console.time('while')
while(i < arr.length){
	arr[i] = arr[i] + '_test4'
	if(i === arr.length - 1){
		console.timeEnd('while')
	}
	i++
}

