var gulp      = require('gulp');
var gutil     = require('gulp-util');
var webserver = require('gulp-webserver');
var sass      = require('gulp-sass');


gulp.task('sass', function () {
  return gulp.src('./app/**/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('./app/'));
});

gulp.task('js', function() {
  gulp.src('./app/**/*.js');
});

gulp.task('html', function() {
  gulp.src('./app/**/*.html');
});

gulp.task('css', function() {
  gulp.src('./app/**/*.css');
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

gulp.task('default', ['watch', 'html', 'js', 'sass', 'webserver']);
