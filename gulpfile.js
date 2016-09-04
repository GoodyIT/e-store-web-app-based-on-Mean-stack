var gulp = require('gulp'),
    nodemon = require('gulp-nodemon'),
    minifyCss = require('gulp-minify-css'),
    jshint = require('gulp-jshint'),
    stylish = require('jshint-stylish'),
    uglify = require('gulp-uglify'),
    usemin = require('gulp-usemin'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    changed = require('gulp-changed'),
    rev = require('gulp-rev'),
    browserSync = require('browser-sync'),
    ngannotate = require('gulp-ng-annotate'),
    del = require('del');



gulp.task('favicon', function() {
    gulp.src('client/app/favicon.ico').pipe(gulp.dest('server/public'));
});

gulp.task('debug', function(){
	return gulp.src('client/app/scripts/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter(stylish));
});

// Images
gulp.task('imagemin', ['favicon'], function() {
  return del(['server/public/images']), gulp.src('client/app/images/**/*')
    .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
    .pipe(gulp.dest('server/public/images'));
});

gulp.task('usemin', ['debug'], function () {
    return del(['server/public/scripts', 'server/public/styles']), gulp.src('client/app/**/*.html')
        .pipe(usemin({
            css: [minifyCss(), rev()],
            js: [ngannotate(), uglify(), rev()]
        }))
        .pipe(gulp.dest('server/public'));
});

gulp.task('clean',function () {
    return del(['server/public']);
});

gulp.task('copyfonts', ['clean'], function () {
    gulp.src('client/bower_components/font-awesome/fonts/**/*')
        .pipe(gulp.dest('server/public/fonts'));
    gulp.src('client/bower_components/bootstrap/dist/fonts/**/*')
        .pipe(gulp.dest('server/public/fonts'));
});

gulp.task('watch', function () {
    gulp.watch('client/app/**/*', ['usemin']);
});

gulp.task('default', ['clean'], function () {
    gulp.start('imagemin', 'usemin', 'copyfonts');
});

gulp.task('server' , function(){
    nodemon({
        script: 'server/bin/www',
        ignore: [
            'node_modules/',
            'client/',
            'server/public/'
        ]
    });
});

gulp.task('serve', ['server', 'default','watch']);