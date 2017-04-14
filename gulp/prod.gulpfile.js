const TARGET_ENV = 'production';

const gulp = require('gulp');
const CONFIG = require('./gulp/config')(TARGET_ENV);
var recipe = (name, config) => require('./gulp/recipes/' + name)(config);

const build = require('../dist/build.json');

if(build.target != TARGET_ENV) {
    throw `Cannot serve build ${build.target} to environment ${TARGET_ENV}`;
}

gulp.task('server', recipe('server', {
    source: './dist',
    port: CONFIG.PORT
}));

gulp.task('default', ['server']);