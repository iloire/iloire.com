var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var mainBowerFiles = require('main-bower-files');
var del = require('del');
var awspublish = require('gulp-awspublish');
var cloudfront = require("gulp-cloudfront");
var runSequence = require('run-sequence');
var rev = require('gulp-rev');
var revCollector = require('gulp-rev-collector');
var path = require('path');
var TEMP_DIR = './tmp';
var BUILD_DIR = './build';

function js(shouldMinify) {
  return gulp.src(mainBowerFiles().concat(['./js/*.js']))
      .pipe(plugins.filter('*.js'))
      .pipe(plugins.concat('app.js'))
      .pipe(plugins.if(shouldMinify, plugins.uglify()))
      .pipe(rev())
      .pipe(gulp.dest(BUILD_DIR))
      .pipe(rev.manifest('manifest.json', {merge: true}))
      .pipe(gulp.dest(TEMP_DIR));
}

function css() {
  return gulp.src(mainBowerFiles().concat(['./less/*.less']))
      .pipe(plugins.filter(['*.css', '*.less']))
      .pipe(plugins.less())
      .pipe(plugins.concat('app.css'))
      .pipe(rev())
      .pipe(gulp.dest(BUILD_DIR))
      .pipe(rev.manifest('manifest.json', {merge: true}))
      .pipe(gulp.dest(TEMP_DIR));
}

function watch() {
  gulp.watch('./images/*', ['images']);
  gulp.watch('./js/**', ['lint','js-dev']);
  gulp.watch('./less/*', ['css']);
  gulp.watch('./bower_components/**', ['build']);
  gulp.watch('./index.html', ['html']);
}

function html() {
  return gulp.src([path.join(TEMP_DIR, '*.json'),'./index.html'])
      .pipe(revCollector({
        replaceReved: true
      }))
      .pipe(gulp.dest(BUILD_DIR));
}

function images() {
  return gulp.src('./images/*')
      .pipe(gulp.dest('./build/images/'), {prefix: 1});
}

function clean() {
  return del([BUILD_DIR, TEMP_DIR]);
}

function cleanTmp() {
  return del([TEMP_DIR]);
}

function lint() {
  return gulp.src('./js/*.js')
      .pipe(plugins.filter(['*','!marked.js']))
      .pipe(plugins.jshint())
      .pipe(plugins.jshint.reporter('default'))
}

gulp.task('js-dev', function () {
  return js(false);
});

gulp.task('js-prod', function () {
  return js(true);
});

gulp.task('css', function () {
  return css();
});

gulp.task('lint', function () {
  return lint();
});

gulp.task('watch', function () {
  return watch();
});

gulp.task('default', ['watch']);

gulp.task('clean', function () {
  return clean();
});

gulp.task('cleanTmp', function () {
  return cleanTmp();
});

gulp.task('images', function () {
  return images();
});

gulp.task('html', function () {
  return html();
});

gulp.task('build', function (callback) {
  runSequence('clean', ['images', 'css', 'js-prod'], 'html', 'cleanTmp', callback);
});

gulp.task('deploy', function () {
  var aws = {
    "accessKeyId": process.env.AWS_ILOIRE_COM_AWS_KEY,
    "secretAccessKey": process.env.AWS_ILOIRE_COM_AWS_SECRET,
    "params": {
      "Bucket": process.env.AWS_ILOIRE_COM_BUCKET
    },
    "region": process.env.AWS_ILOIRE_COM_REGION,
    "distributionId": process.env.AWS_ILOIRE_COM_DISTRIBUTION_ID
  };
  var publisher = awspublish.create(aws);
  var headers = {
    'Cache-Control': 'max-age=315360000, no-transform, public'
  };
  return gulp.src('build/**')
      .pipe(awspublish.gzip())
      .pipe(publisher.publish(headers, {simulate: false}))
      .pipe(publisher.cache())
      .pipe(awspublish.reporter())
      .pipe(cloudfront(aws));
});