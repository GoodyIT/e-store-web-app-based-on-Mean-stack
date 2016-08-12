var gulp = require('gulp'),
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




gulp.task('jshint', function(){
	return gulp.src('client/app/scripts/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter(stylish));
});

gulp.task('usemin', ['jshint'], function () {
    return gulp.src('client/app/**/*.html')
        .pipe(usemin({
            css: [minifyCss(), rev()],
            js: [ngannotate(), uglify(), rev()]
        }))
        .pipe(gulp.dest('dist/'));
});

gulp.task('imagemin', function(){
    return del(['dist/images']), gulp.src('client/app/images/**/*')
        .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
        .pipe(gulp.dest('dist/images'));
});

gulp.task('clean',function () {
    return del(['dist']);
});

gulp.task('copyfonts', ['clean'], function () {
    gulp.src('./client/bower_components/font-awesome/fonts/**/*.{ttf, woff, eof, svg}*')
        .pipe(gulp.dest('./dist/fonts'));
    gulp.src('./client/bower_components/bootstrap/dist/fonts/**/*.{ttf, woff, eof, svg}*')
        .pipe(gulp.dest('./dist/fonts'));
});

gulp.task('watch', ['browser-sync'], function () {
    gulp.watch('{client/app/scripts/**/*.js, client/app/styles/**/*.css, client/app/**/*.html}', ['usemin']);
    gulp.watch('client/app/images/**/*', ['imagemin']);
});

gulp.task('browser-sync', ['default'], function () {
    var files = [
        'client/app/**/*.html',
        'client/app/styles/**/*.css',
        'client/app/images/**/*.png',
        'client/app/scripts/**/*.js',
        'dist/**/*'
    ];

    browserSync.init(files, {
        server: {
            baseDir: "dist",
            index: "index.html"
        }
    });
    gulp.watch(['dist/**']).on('change', browserSync.reload);
});

gulp.task('default', ['clean'], function () {
    gulp.start('usemin', 'imagemin', 'copyfonts');
});