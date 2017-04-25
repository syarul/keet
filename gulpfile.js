var gulp = require('gulp')
var shell = require('gulp-shell')
var livereload = require("gulp-livereload")
var run = require('tape-run')
var browserify = require('browserify')
var tapSpec = require('tap-spec')

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

gulp.task('test', function() {
  return browserify(__dirname + '/test/test.js')
  .bundle()
  .pipe(run())
  .pipe(tapSpec())
  .pipe(process.stdout)
})

gulp.task('default', ['test'])