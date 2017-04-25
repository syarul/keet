var test = require('tape')
var run = require('tape-run')
var browserify = require('browserify')
var tapSpec = require('tap-spec')

test('keet.js tests', function(t) {

  t.plan(1)

  browserify(__dirname + '/fixture/fail.js')
    .bundle()
    .pipe(run())
    .on('results', function(results){
      t.ok(results.ok, 'should equal "Hello World" as node value')
    })
    .pipe(tapSpec())
    .pipe(process.stdout)
})