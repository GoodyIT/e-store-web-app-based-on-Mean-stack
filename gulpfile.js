var gulp = require('gulp'),
    nodemon = require('gulp-nodemon'),
    minifyCss = require('gulp-minify-css'),
    jshint = require('gulp-jshint'),
    stylish = require('jshint-stylish'),
    uglify = require('gulp-uglify'),
    usemin = require('gulp-usemin'),
    sourcemaps = require('gulp-sourcemaps'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    changed = require('gulp-changed'),
    rev = require('gulp-rev'),
    browserSync = require('browser-sync'),
    ngannotate = require('gulp-ng-annotate'),
    del = require('del'),
    browserSync = require('browser-sync').create(),
    babel  = require('gulp-babel');



gulp.task('browser-sync', ['server'], function() {
    return browserSync.init({
        proxy: "localhost:4000"
    });
});

gulp.task('favicon', ['clean'], function() {
    return gulp.src('client/app/favicon.ico').pipe(gulp.dest('server/public'));
});

gulp.task('debug', function(){
	return gulp.src('client/app/scripts/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter(stylish));
});

// Images
gulp.task('imagemin', ['clean', 'favicon'], function () {
    
    return del(['server/public/images']),
    
    gulp.src('client/app/images/**/*')
        .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
        .pipe(gulp.dest('server/public/images'));

});

gulp.task('usemin-vendors', ['debug'], function () {
     
     return del(['server/public/scripts/vendors.js', 'server/public/styles/vendors.css']),

     gulp.src('client/app/**/*.html')
        .pipe(usemin({
            css: [minifyCss(), rev()],
            css_vendors: [minifyCss(), rev()],
            js_vendors: [
                sourcemaps.init({loadMaps: true}),
                ngannotate(), 
                'concat',
                uglify(),
                sourcemaps.write('./')
            ],
            js: [
                babel({presets: ['es2015']}),
                sourcemaps.init({loadMaps: true}),
                ngannotate(), 
                'concat',
                uglify(),
                sourcemaps.write('./')
            ]
        }))
        .pipe(gulp.dest('server/public'));

});

gulp.task('usemin', ['debug'], function () {
    del(['server/public/scripts/main*.js', 'server/public/styles/main*.css']), gulp.src('client/app/**/*.html')
        .pipe(usemin({
            css: [minifyCss(), rev()],
            js: [
                babel({presets: ['es2015']}),
                sourcemaps.init({loadMaps: true}),
                ngannotate(), 
                'concat',
                uglify(), 
                rev(),
                sourcemaps.write('./')
            ]
        }))
        .pipe(gulp.dest('server/public'))
        .pipe(browserSync.stream());
});

gulp.task('clean',function () {
    return del(['server/public']);
});

gulp.task('copyfonts', ['clean'], function () {
    gulp.src('bower_components/font-awesome/fonts/**/*')
        .pipe(gulp.dest('server/public/fonts'));
    gulp.src('bower_components/bootstrap/dist/fonts/**/*')
        .pipe(gulp.dest('server/public/fonts'));
});

gulp.task('watch', ['browser-sync'], function () {
    gulp.watch('client/app/**/*', ['usemin']);
});

gulp.task('default', ['clean', 'copyfonts', 'imagemin', 'usemin-vendors']);

gulp.task('server' , ['default'], function(cb){
    
    nodemon({
        script: 'server/bin/www',
        ignore: [
            'node_modules/',
            'client/',
            'server/public/'
        ],
    }).on('start', function(){
        cb(null);
    });

});

gulp.task('serve', ['watch']);