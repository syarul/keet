var gulp = require('gulp')
var shell = require('gulp-shell')
var livereload = require("gulp-livereload")
var run = require('tape-run')
var browserify = require('browserify')
var tapSpec = require('tap-spec')

var log = console.log.bind(console)

gulp.task('main', function () {
  gulp.src('')
    .pipe(shell('npm run dist'))
    .pipe(shell('npm run distcompress'))
    .pipe(shell('npm run jsdoc'))
    .pipe(livereload())
})
gulp.task('watch', function() {
  livereload.listen()
  gulp.watch('./index.js', ['main'])
})

var x = false

gulp.task('test', function() {
  var res = browserify(__dirname + '/test/test.js')
  .bundle()
  .pipe(run())
  .on('results', function(results){
    if(results.ok) x = true
  })
  .pipe(tapSpec())
  .pipe(process.stdout)

  // log(res)

  return x

})

// process.on('exit', x ? function() {} : function() { throw 'failing test' })

gulp.task('default', ['test'])