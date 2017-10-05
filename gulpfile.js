const gulp = require('gulp')
const shell = require('gulp-shell')
const livereload = require("gulp-livereload")
const browserify = require('browserify')
const stream = require('stream');

const log = console.log.bind(console)

gulp.task('main', function () {
  gulp.src('')
    .pipe(shell('npm run debug'))
    .pipe(livereload())
})
gulp.task('watch', function() {
  livereload.listen()
  gulp.watch('./index.js', ['main'])
})

gulp.task('default', ['watch'])