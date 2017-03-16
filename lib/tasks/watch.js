'use strict';
/**
 * Watch and respond to file system changes. This task watches files extracted
 * from the dependency chain established in the HTML parser and pushes the 'root' html file down
 * the stream.
 */
var gulp = require('gulp');
var config = require('../config.js');
var removeDirname = require('../util/removeDirname');
var logStream = require('../util/logStream');
var parser = require('../parser.js');
var watch = require('gulp-watch');
var gutil = require('gulp-util');
var handlebars = require('gulp-compile-handlebars');
var chalk = require('chalk');
var path = require('path');

function reparseDependentFiles(filePath) {
    return gulp.src(filePath)
    .pipe(parser.expireCache())
    .pipe(logStream('File reloaded:'))
    .pipe(parser.watchHandler())
    .pipe(parser.parse())
    .pipe(handlebars(config, config.handlebars).on('error', function(err) {
        gutil.log(chalk.red(err));
    }))
    .pipe(removeDirname())
    .pipe(gulp.dest(config.dest))
    .on('end', global.sync.reload);
}

gulp.task('watchDependencies', function() {
    // Get the watchlist of dependency paths minus anything we
    // don't want to watch (temporary files)
    var watchlist = parser.getWatchList(function(filePath) {
        return /\.tmp/.test(filePath) === false;
    });

    // Inspect watchlist length
    gutil.log('Watching dependencies: '+watchlist.length+' file'+(watchlist.length > 1 ? 's' : ''));

    // Watch and rebuild on watchlist dependency changes
    watch(watchlist)
    .on('data', function(file) {
        reparseDependentFiles(file.path);
    });

    // Watch and rebuild on imported Sass
    watch(path.join(config.source, 'styles/imports/*.scss'))
    .on('data', function() {
        var scssList = parser.getWatchList(function(filePath) {
            return /\.scss$/.test(filePath);
        });
        reparseDependentFiles(scssList);
    });
});

gulp.task('watch', ['setWatch', 'build'], function() {
    gulp.start('watchDependencies');
});
