var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var main_bower_files = require('main-bower-files');

function js(shouldMinify) {
  return gulp.src(main_bower_files().concat(['./js/*.js']))
      .pipe(plugins.filter('*.js'))
      //.pipe(plugins.jshint())
      //.pipe(plugins.jshint.reporter('default'))
      .pipe(plugins.concat('app.js'))
      .pipe(plugins.if(shouldMinify, plugins.uglify()))
      .pipe(gulp.dest('./build'));
}

function less() {
  return gulp.src('./less/*.less')
      .pipe(plugins.less())
      .pipe(plugins.concat('app.css'))
      .pipe(gulp.dest('./build'));
}

function watch() {
  gulp.watch('./js/**', ['js-dev']);
  gulp.watch('./less/*', ['less']);
  gulp.watch('./bower_components/**', ['build']);
}

gulp.task('js-dev', function () {
  return js(false);
});

gulp.task('js-prod', function () {
  return js(true);
});

gulp.task('less', function () {
  return less();
});

gulp.task('build', function () {
  less();
  js(true);
});

gulp.task('watch', function () {
  watch();
});

gulp.task('default', function () {
  watch();
});