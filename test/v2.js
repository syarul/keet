var test = require('tape')

var origin = require('./origin')

test('simpe test', function(t){
	t.plan(2)

	origin.next(function(res){
		t.ok(res, 'just a test')

		// origin.next
		// var res = origin.other()

		t.ok(false)
	})
})