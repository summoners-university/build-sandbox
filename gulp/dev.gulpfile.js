const TARGET_ENV = 'local';

const gulp = require('gulp');
const path = require('path');
const sync = require('gulp-sync')(gulp).sync;
const CONFIG = require('./config')(TARGET_ENV);
var ng = require('./utils/angular-module');
var recipe = (name, config) => require('./recipes/' + name)(config);

gulp.task('env', recipe('env', {
    NODE_PATH: 'source/js:node_modules'
}));

gulp.task('clean', recipe('clean', {
    input: './dist'
}));

gulp.task('css', recipe('stylus', {
    input: './source/css/index.styl',
    output: './dist/css',
    name: 'source.css'
}));

gulp.task('js:node_modules', recipe('browserify', {
    input: '',
    require: CONFIG.NODE_MODULES,
    output: './dist/node_modules',
    name: 'node_modules.js'
}));

ng.modules([
    'common',
    'champions',
    'masteries',
    'runes',
    'sandbox',
    'stats'
], {
    input: './source/js/ng-modules',
    output: './dist',
    css: {
        include: __dirname + '/../source/css/shared/index.styl'
    },
    node_modules: CONFIG.NODE_MODULES
});

gulp.task('compile:modules', ng.compile_modules);
gulp.task('watch:modules', ng.watch_modules);

gulp.task('bower', recipe('bower', {
    output: './dist/bower_components'
}));

gulp.task('html', recipe('html', {
    cwd: './dist',
    input: './source/html/**/*.html',
    sources: [[
        'node_modules/**/*',
        'bower_components/**/*'
    ], [
        'css/source.css',
        'css/**/*',
        'js/**/*'
    ]],
    output: './dist',
    replacements: [
        ['@{SENTRY}', CONFIG.SENTRY],
        ['@{GA}', CONFIG.GA],
        ['@{VERSION}', CONFIG.VERSION],
        ['@{ENV}', CONFIG.ENV]
    ]
}));

gulp.task('static', recipe('copy', {
    input: './static/**/*',
    output: './dist'
}));

gulp.task('audio', recipe('copy', {
    input: './source/audio/**/*',
    output: './dist/audio'
}));

gulp.task('server', recipe('server', {
    source: './dist',
    port: CONFIG.PORT
}));

gulp.task('buildfile', recipe('buildfile', {
    input: './package.json',
    output: './dist',
    name: 'build.json',
    modify(pkg) {
        return {
            version: pkg.version,
            target: TARGET_ENV,
            patch: pkg.patch
        };
    }
}));

gulp.task('watch', () => {
    gulp.watch([
        './source/html/**/*.html',
        './dist/**/*.js',
        './dist/**/*.css',
        './dist/bower_components/**/*'
    ], ['html']);
    gulp.watch('./source/css/**/*.styl', ['css']);
    gulp.watch('./static/**/*', ['static']);
    gulp.watch('./bower_components/**/*', ['bower']);
    gulp.watch('./styles/**/*', ['compile:modules']);
    gulp.watch([
        './source/js/**/*.js',
        '!./source/js/ng-modules.**/*.js'
    ], ['compile:modules']);
});

var compileAsync = [/*'bower',*/ 'js:node_modules', 'compile:modules', 'static', 'css', 'buildfile'];
gulp.task('compile', sync(['clean', 'env', compileAsync, 'html']));
gulp.task('watch:all', ['watch:modules', 'watch']);

gulp.task('default', ['compile', 'watch:all', 'server']);