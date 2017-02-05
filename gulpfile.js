var gulp = require('gulp');
var shell = require('gulp-shell');
var livereload = require("gulp-livereload");

gulp.task('main', function () {
  gulp.src('')
    .pipe(shell('npm run dist'))
    .pipe(shell('npm run distcompress'))
    .pipe(shell('npm run jsdoc'))
    .pipe(livereload());
});
gulp.task('watch', function() {
  livereload.listen();
  gulp.watch('./index.js', ['main']);
});

gulp.task('default', ['watch']);