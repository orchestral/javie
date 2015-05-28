var gulp = require('gulp'),
  coffee = require('gulp-coffee'),
  concat = require('gulp-concat'),
  csso = require('gulp-csso'),
  less = require('gulp-less'),
  rename = require('gulp-rename'),
  uglify = require('gulp-uglify');

var dir = {
  src: 'src',
  dist: 'dist',
  includes: 'src/includes',
  modules: 'src/modules'
}

var compression = {
  outSourceMaps: false,
  output: {
    max_line_len: 150
  }
};

var files = [
  dir.includes+'/header.js',
  dir.src+'/application.js',
  dir.modules+'/events/events.js',
  dir.modules+'/logger/logger.js',
  dir.modules+'/profiler/profiler.js',
  dir.modules+'/request/request.js',
  dir.src+'/bootstrap.js'
];

gulp.task('coffee', ['modules.coffee'], function () {
  return gulp.src(dir.src+'/*.coffee')
    .pipe(coffee())
    .pipe(gulp.dest(dir.src));
});

gulp.task('modules.coffee', function () {
  return gulp.src(dir.src+'/modules/**/*.coffee')
    .pipe(coffee())
    .pipe(gulp.dest(dir.src+'/modules/'));
});

gulp.task('js', ['coffee'], function () {
  return gulp.src(files)
    .pipe(concat('javie.js'))
    .pipe(gulp.dest(dir.dist));
});

gulp.task('js.min', ['js'], function () {
  return gulp.src(dir.dist+'/javie.js')
    .pipe(rename('javie.min.js'))
    .pipe(uglify(compression))
    .pipe(gulp.dest(dir.dist));
});

gulp.task('watch', function () {
  gulp.watch(dir.src+'/*.coffee', ['coffee']);
  gulp.watch(dir.src+'/modules/**/*.coffee', ['modules.coffee']);
  gulp.watch(files, ['js', 'js.min']);
});

gulp.task('default', ['modules.coffee', 'coffee', 'js', 'js.min']);
