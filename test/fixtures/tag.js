var tag = require('../../tag')
var cat = require('../../cat')

module.exports = function(t) {
	
  var htmlStr = cat(
		tag(
			'div', 'what', 
			{stat: 'isStat'},
			{color: 'red'}
		)
	)
  t.ok(htmlStr === '<div stat="isStat" style="color:red">what</div>', 'tag util')

}