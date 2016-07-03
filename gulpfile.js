var gulp        = require('gulp');
var browserSync = require('browser-sync');
var sass        = require('gulp-sass');
var concat      = require('gulp-concat');
var uglify      = require('gulp-uglify');
var runSequence = require('run-sequence');
var gulpIf      = require('gulp-if');
var useref      = require('gulp-useref');
var cssnano     = require('gulp-cssnano');
var imagemin    = require('gulp-imagemin');
var cache       = require('gulp-cache');
var del         = require('del');


/////////////////////////// Development Tasks ////////////////////////////

///////// Start browserSync server ///////////
// ---------------
gulp.task('browserSync', function() {
  browserSync({
    server: {
      baseDir: 'app',
      routes: {
        "/node_modules": "node_modules",
        "/bower_components": "bower_components"
      }
    }
  })
});


gulp.task('sass', function () {
  return gulp.src('./app/**/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('./app/'))
    .pipe(browserSync.reload({
      stream: true
    }));
});


gulp.task('html', function() {
	return gulp.src('./app/**/*.html')
		.pipe(gulp.dest('./public/'));
});

gulp.task('js', function() {
	return gulp.src('./app/**/*.js')
		.pipe(gulp.dest('./public/'));
});



///////// Watchers ///////////
// ---------------
gulp.task('watch', ['browserSync', 'sass'], function (){
  gulp.watch('./app/**/*.scss', ['sass']);
  gulp.watch(['./app/**/*.html', '**/*.html'], ['html'], browserSync.reload);
  gulp.watch('./app/**/*.js', ['js'], browserSync.reload);
});



/////////////////////////////// Optimization Tasks ////////////////////////


///////// Optimizing CSS and JavaScript ///////////
// ---------------
gulp.task('useref', function(){
  return gulp.src('app/*.html')
    .pipe(useref())
    .pipe(gulpIf('*.js', uglify()))
    // Minifies only if it's a CSS file
    .pipe(gulpIf('*.css', cssnano()))
    .pipe(gulp.dest('public'))
});



///////// Optimizing Assets/Images ///////////
// ---------------
gulp.task('assets', function(){
  return gulp.src('app/assets/**/*.+(png|jpg|gif|svg)')
    .pipe(imagemin())
    // Caching images that ran through imagemin
    .pipe(cache(imagemin({
      interlaced: true
    })))
    .pipe(gulp.dest('public/assets'))
});



///////// Cleaning ///////////
// ---------------
gulp.task('clean', function() {
  return del.sync('public').then(function(cb) {
    return cache.clearAll(cb);
  });
})

gulp.task('clean:public', function() {
  return del.sync('public');
});



//////////////////////////// Build Sequences /////////////////////////////


gulp.task('default', function(callback) {
  runSequence(
    'sass',
    'html',
    'browserSync',
    'watch',
    callback);
});

gulp.task('build', function (callback) {
  runSequence('clean:public',
    ['sass', 'useref', 'assets'],
    callback
  )
});
