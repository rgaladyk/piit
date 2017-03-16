'use strict';
/**
 * Meta optimise task that triggers JS, CSS and image minification
 */
var gulp = require('gulp');
var defer = require('../util/defer');

gulp.task('deferOptimiseTasks', function(done) {
    defer([
        'gulp-uglify', 'gulp-imagemin', 'imagemin-pngquant', 'gulp-cssnano', // minify
        'gulp-prettify' // beautify
    ], done);
});

gulp.task('optimise', ['minify', 'beautify']);
