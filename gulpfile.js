var gulp = require('gulp');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var autoprefixer = require('gulp-autoprefixer');
var del = require('del');
var server = require('gulp-connect');
var plumber = require('gulp-plumber');
var rename = require('gulp-rename');



gulp.task('html', function() {
	return gulp.src('app/**/*.html')
		.pipe(server.reload());
});

gulp.task('sass', function() {
	return gulp.src('app/**/*.scss')
		.pipe(plumber())
		.pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
		.pipe(autoprefixer('last 2 versions'))
		.pipe(gulp.dest('app'))
		.pipe(server.reload());
});

gulp.task('js', function() {
	return gulp.src(['app/**/*.js', '!app/**/*.min.js', '!app/node_modules/**/*.js'])
		.pipe(plumber())
		// .pipe(rename({suffix:'.min'}))
		// .pipe(uglify())
		// .pipe(gulp.dest('public'))
		.pipe(server.reload());
});


gulp.task('watch', function() {
	gulp.watch('app/**/*.html', ['html']);
	gulp.watch(['app/**/*.js', '!app/node_modules/**/*.js'], ['js']);
	gulp.watch(['app/**/*.scss', '!app/node_modules/**/*.scss'], ['sass']);
});


gulp.task('server', function() {
	server.server({
		root: '',
		livereload: true,
		port: 3000
	});
});

gulp.task('default', ['html', 'sass', 'js', 'watch', 'server']);












/////////////////
// Build Tasks
/////////////////

// clear all the files and folders from build folder
gulp.task('build:cleanfolder', function() {
	del([
		'public/**'
	]);
});


// task to create build directory for all files
gulp.task('build:copy',  ['build:cleanfolder'], function() {
	return gulp.src('app/**/*')
		.pipe(gulp.dest('public'))
});

// task to remove unwanted build files
// list all files and directories here that you don't want to include
gulp.task('build:remove',  ['build:copy'], function(callback) {
	del([
		'public/**/*.scss'
		// 'public/**/!(*.min.js)'
	], callback);
});

//task to run build for testing final app
gulp.task('build:server', function() {
	server.server({
		root: 'public',
		livereload: true,
		port: 3001
	});
});

// run this whenever you want to deploy your site
gulp.task('build', ['build:copy', 'build:remove']);


