var gulp = require('gulp')
var shell = require('gulp-shell')
var livereload = require("gulp-livereload")
var run = require('tape-run')
var browserify = require('browserify')
var tapSpec = require('tap-spec')

var stream = require('stream');

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
  browserify(__dirname + '/test/test.js')
  .bundle()
  .pipe(run())
  .on('results', function(results){
    if(results.ok) x = true
  })
  .pipe(tapSpec())
  .pipe(process.stdout)
})

gulp.task('cov', function() {
  var stream = gulp.src('')
    .pipe(shell('browserify -t coverify test/test.js | tape-run | coverify'))

  stream.on('end', function(){
    gulp.src('')
    .pipe(shell('rm -f .source*'))
  })
})

/*process.on('exit', function() {
  if(!x) process.exit(1)
})*/

gulp.task('default', ['cov'])