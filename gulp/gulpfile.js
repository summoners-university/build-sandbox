import gulp from 'gulp';
import babelify from 'babelify';
import gulpsync from 'gulp-sync';
let sync = gulpsync(gulp).sync;

function task(name, args) {
    return require('./recipes/'+name)(args);
}

let vendor_modules = ['react', 'react-dom', 'material-ui', 'react-router', 'history', 'classnames'];

gulp.task('css', task('stylus', {
    input: './source/**/*.styl',
    output: './dist/css',
    name: 'source.css',
    include: [ process.cwd() + '/source/includes/include' ]
}));

gulp.task('js:node_modules', task('browserify', {
    input: '',
    require: vendor_modules,
    output: './dist/node_modules',
    name: 'vendor.js'
}));

gulp.task('js:source', task('browserify', {
    input: './source/index.js',
    external: vendor_modules,
    output: './dist/js',
    name: 'source.js',
    transform: babelify.configure({stage: 1})
}));

gulp.task('bower', task('bower', {
    output: './dist/bower_components'
}));

gulp.task('inject', task('inject', {
    cwd: './dist',
    file: './static/**/*.html',
    sources: [[
        'node_modules/**/*',
        'bower_components/**/*'
    ], [
        'css/**/*',
        'js/**/*'
    ]],
    output: './dist'
}));

gulp.task('server', task('server', {
    source: './dist',
    port: 3000
}));

gulp.task('watch', () => {
    gulp.watch('./source/**/*.styl', ['css']);
    gulp.watch('./source/**/*.js', ['js:source']);
    gulp.watch('./static/**/*.html', ['inject']);
});

gulp.task('compile-vendor', ['bower', 'js:node_modules']);
gulp.task('compile-source', ['js:source', 'css']);
gulp.task('compile', sync(['compile-source', 'compile-vendor', 'inject']) );
gulp.task('compile-watch', ['compile', 'watch']);
gulp.task('default', ['compile-watch', 'server']);