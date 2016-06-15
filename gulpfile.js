var gulp        = require('gulp');
var webserver   = require('gulp-webserver');
var sass        = require('gulp-sass');
var rename      = require('gulp-rename');
var concat      = require('gulp-concat');
var uglify      = require('gulp-uglify');
var runSequence = require('run-sequence');


gulp.task('depsjs', function() {
  return gulp.src([
    'node_modules/jquery/dist/jquery.min.js',
    'node_modules/bootstrap/dist/js/bootstrap.min.js',
    'node_modules/angular/angular.min.js',
    'bower_components/firebase/firebase.js',
    'node_modules/angular-ui-router/release/angular-ui-router.min.js',
    'node_modules/angularfire/dist/angularfire.min.js',
    'node_modules/angular-ui-bootstrap/dist/ui-bootstrap.js',
    'node_modules/angular-ui-bootstrap/dist/ui-bootstrap-tpls.js',
    'node_modules/underscore/underscore-min.js',
    'bower_components/chartist/dist/chartist.min.js'
  ])
    .pipe(concat('deps.js'))
    .pipe(gulp.dest('./app/'));
});

gulp.task('depscss', function() {
  return gulp.src([
    'node_modules/bootstrap/dist/css/bootstrap.min.css',
    'bower_components/chartist/dist/chartist.min.css'
  ])
    .pipe(concat('deps.css'))
    .pipe(gulp.dest('./app/'));
});


gulp.task('depsDist', function() {
  return gulp.src(['app/deps.js', 'app/deps.css'])
    .pipe(gulp.dest('./public/'));
});

gulp.task('assets', function () {
  return gulp.src('./app/**/*.png')
    .pipe(gulp.dest('./public/'));
});

gulp.task('sass', function () {
  return gulp.src('./app/**/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('./public/'));
});

gulp.task('js', function() {
  return gulp.src('./app/**/*.js')
    .pipe(gulp.dest('./public/'));
});

gulp.task('html', function() {
  return gulp.src('./app/**/*.html')
    .pipe(gulp.dest('./public/'));
});

gulp.task('css', function() {
  return gulp.src('./app/**/*.css')
  .pipe(gulp.dest('./public/'));
});

gulp.task('watch', function() {
  gulp.watch('./app/**/*.js', ['js']);
  gulp.watch('./app/**/*.scss', ['sass']);
  gulp.watch(['./app/**/*.html', '**/*.html'], ['html']);
});

gulp.task('webserver', function() {
  gulp.src('./')
    .pipe(webserver({
      livereload: true,
      open: 'http://localhost:8000/app/'
    }));
});

gulp.task('default', function(callback) {
  runSequence(
    'depsjs',
    'depscss',
    'depsDist',
    'assets',
    'watch',
    'sass',
    'css',
    'html',
    'js',
    'webserver',
    callback);
});
