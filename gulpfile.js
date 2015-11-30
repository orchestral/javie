var dir
    , gulp = require('gulp')
    , rename = require('gulp-rename')
    , uglify = require('gulp-uglify')
    , elixir = require('laravel-elixir');

dir = {
  src: 'src',
  dist: 'dist',
  includes: 'src/includes',
  modules: 'src/modules'
}

var files = [
  dir.includes+'/header.js',
  dir.src+'/application.js',
  dir.modules+'/events/events.js',
  dir.modules+'/logger/logger.js',
  dir.modules+'/profiler/profiler.js',
  dir.modules+'/request/request.js',
  dir.src+'/bootstrap.js'
];

gulp.task('js.min', function () {
  var compression = {
    outSourceMaps: false,
    output: {
      max_line_len: 150
    }
  };

  return gulp.src(dir.dist+'/javie.js')
    .pipe(rename('javie.min.js'))
    .pipe(uglify(compression))
    .pipe(gulp.dest(dir.dist));
});

elixir.config.js.browserify.plugins.push({name: 'bundle-collapser/plugin'});

elixir(function (mix) {
  mix.browserify('app.js', dir.src+'/bundle.js', dir.src);

  mix.scripts([
    'includes/header.js',
    'bundle.js'
  ], dir.dist+'/javie.js', dir.src);

  mix.task('js.min', dir.src+'/**/*.js');
});
