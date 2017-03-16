'use strict';
/**
 * Optimises the following:
 *
 * dist/js/*.min.js -> minified using uglify
 * dist/styles/*.min.css -> minified & optimised using cssnano
 */
var gulp = require('gulp');
var config = require('../config');
var path = require('path');
var sourcemaps = require('gulp-sourcemaps');

gulp.task('minify-js', ['build', 'deferOptimiseTasks'], function() {
    var jsDir = path.join(config.dest, 'js');
    var uglify = require('gulp-uglify');
    return gulp.src([
        path.join(jsDir, '*.min.js'),
    ])
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(uglify())
    .pipe(gulp.dest(jsDir))
    .pipe(sourcemaps.write(jsDir));
});

// @todo adding sourcemaps to cssnano stops it from functioning!
gulp.task('minify-css', ['build', 'deferOptimiseTasks'], function() {
    var cssnano = require('gulp-cssnano');
    var styleDir = path.join(config.dest, 'styles');
    return gulp.src(path.join(styleDir, '*.min.css'))
    .pipe(cssnano())
    .pipe(gulp.dest(styleDir));
});

// Re-write png, jpg, gif and svg in-place (destination directory)
gulp.task('imagemin', ['build', 'deferOptimiseTasks'], function() {
    var imagemin = require('gulp-imagemin');
    var pngquant = require('imagemin-pngquant');
    return gulp.src([
        path.join(config.file_dest, '/*'),
        path.join(config.dest, 'styles/'+config.file_dest+'/*')
    ], {
        base: './'
    })
    .pipe(imagemin({
        progressive: true,
        svgoPlugins: [{
            removeViewBox: false
        }],
        use: [pngquant()]
    }))
    .pipe(gulp.dest('./'));
});

gulp.task('minify', ['minify-js', 'minify-css', 'imagemin']);
