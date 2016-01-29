import gulp from 'gulp';
import gulpsync from 'gulp-sync';
let sync = gulpsync(gulp).sync;

function recipe(name, args) {
    return require('./recipes/'+name)(args);
}

const VENDOR_MODULES = [
    'lodash',
    'react',
    'react-dom',
    'material-ui',
    'react-router',
    'history',
    'classnames'
];

gulp.task('env', recipe('env', {
    NODE_PATH: 'source/js'
}));

gulp.task('css', recipe('stylus', {
    input: [
        './source/css/index.styl'
    ],
    output: './dist/css',
    name: 'source.css'
}));

gulp.task('js:node_modules', recipe('browserify', {
    input: '',
    require: VENDOR_MODULES,
    output: './dist/node_modules',
    name: 'vendor.js'
}));

gulp.task('js:source', recipe('babelify', {
    input: './source/js/index.js',
    external: VENDOR_MODULES,
    output: './dist/js',
    name: 'source.js',
    transform: {
        stage: 1
    }
}));

gulp.task('bower', recipe('bower', {
    output: './dist/bower_components'
}));

gulp.task('inject', recipe('inject', {
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

gulp.task('server', recipe('server', {
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
gulp.task('compile', sync(['env', 'compile-source', 'compile-vendor', 'inject']) );
gulp.task('compile-watch', ['compile', 'watch']);
gulp.task('default', ['compile-watch', 'server']);