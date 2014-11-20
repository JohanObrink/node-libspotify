var gulp = require('gulp'),
  jshint = require('gulp-jshint'),
  mocha = require('gulp-mocha'),
  plumber = require('gulp-plumber'),
  runSequence = require('run-sequence');

gulp.task('jshint', function () {
  return gulp.src(['./**/*.js', '!./node_modules/**/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('mocha', function () {
  return gulp.src(['test/**/*.js'])
    .pipe(plumber())
    .pipe(mocha({reporter: 'nyan'}));
});

gulp.task('test', function (cb) {
  runSequence('jshint', 'mocha', cb);
});

gulp.task('watch', function () {
  gulp.watch(['./**/*.js', '!./node_modules/**/*.js'], ['test']);
});

gulp.task('default', ['test', 'watch']);