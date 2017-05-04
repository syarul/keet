var x = 0

var other = function(){
	var s = 1
	return s
}

var next = function(cb){
	cb(true)
}

module.exports = {
	other: other,
	next: next
}