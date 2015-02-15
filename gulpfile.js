'use strict';

var browserify = require('browserify');
var reactify = require('reactify');
var gulp = require('gulp');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var runSequence = require('run-sequence');
var CleanCSS = require('clean-css');
var map = require('vinyl-map');
var concat = require('gulp-concat');

var getBundleName = function () {
  var version = require('./package.json').version;
  var name = require('./package.json').name;
  return version + '.' + name + '.' + 'min';
};

gulp.task('javascript', function() {

  var bundler = browserify({
    entries: ['./main.js'],
    debug: true
  });

  var bundle = function() {
    return bundler
      .transform(reactify)
      .bundle()
      .pipe(source(getBundleName() + '.js'))
      .pipe(buffer())
      .pipe(sourcemaps.init({loadMaps: true}))
      // Add transformation tasks to the pipeline here.
      .pipe(uglify())
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest('./app/scripts/'));
  };

  return bundle();
});

gulp.task('css' , function minifyCSSTask() {
  // this snippet basically replaces `gulp-minify-css`
  var minify = map(function (buff, filename) {
    return new CleanCSS({
      // specify your clean-css options here
    }).minify(buff.toString()).styles;
  });

  return gulp.src('css/**/*.css')
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(concat(getBundleName() + '.css'))
    .pipe(minify)
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./app/css/'));
});

gulp.task('default', function() {
  runSequence(['javascript', 'css']);
});