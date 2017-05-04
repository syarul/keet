var gulp = require('gulp')
var shell = require('gulp-shell')
var livereload = require("gulp-livereload")
var run = require('tape-run')
var browserify = require('browserify')
var tapSpec = require('tap-spec')
var istanbul = require('gulp-istanbul');
var b = require('browserify-istanbul')
var tapeIstanbul = require('tape-istanbul')
var coverify = require('coverify')
var parse = require('coverify/parse')
var concat = require('concat-stream')
var bb = require('gulp-browserify')

var stream = require('stream');

var log = console.log.bind(console)

// log(typeof coverify)

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
  // .add(__dirname +'/test/test.js')
  // .plugin('tape-istanbul/plugin')
  .bundle()
  .pipe(run())
  // .on('results', function(results){
  //   if(results.ok) x = true
  // })
  // .pipe(tapSpec())
  // .pipe(tapeIstanbul())
  .pipe(process.stdout)
})

gulp.task('cov', function() {
  gulp.src(['*.js'])
    .plugin('tape-istanbul/hook')
    .on('finish', function () {
      browserify(__dirname + '/test/test.js')
      .bundle()
      .pipe(run())
      .pipe(tapeIstanbul())
      // .pipe(istanbul.enforceThresholds({ thresholds: { global: 70 } })) // Enforce a coverage of at least 90%
      .on('results', function(results){
        if(results.ok) x = true
      })
      .pipe(tapSpec())
      .pipe(process.stdout)
    })
})

var temp = {}

gulp.task('ex', function() {

  // browserify()
  browserify(__dirname + '/test/v2.js')
  // .add(__dirname + '/test/v2.js')
  // .transform(coverify())
  // .transform(function(res){
  //   var v = __dirname + '/test/v2.js'
  //   // log(coverify(v))
  //   return coverify(res)
  // })
  .transform(coverify)
  .bundle()
  .pipe(run())
  .on('results', function(results){
    if(results.ok) x = true
    // log(results)
  })
  // .pipe(parse)
  .pipe(concat(function(res){
    console.log(res)

  }))
  // .pipe(parse)
  // .pipe(concat(function(res){

  //   log(res)
    
  // }))
  // .pipe(concat(function(res){
  //   console.log(1234567890)
  //   console.log(res)

  // }))
  // .parse()
  // .pipe(istanbul.writeReports())
  // .pipe(parse(function(err, coverage, counts){
  //   log(arguments)
  //   return arguments
  // }))
  // .pipe(istanbul.writeReports())

  // .on('results', function(results){
  //   if(resul ts.ok) x = true
  // })
  // .pipe(tapSpec())
  // .pipe(process.stdin)
  // .pipe(process.stdout)
  // .pipe(coverify('/test/v2.js'))
  // .pipe(process.stdout)
})

gulp.task('t', function() {
  gulp.src('')
    .pipe(shell('node_modules\\.bin\\browserify -t coverify test/test.js | tape-run | coverify'))
})

// process.on('exit', function() {
//   log(arguments)
//   // if(!x) process.exit(1)
// })

gulp.task('default', ['test'])