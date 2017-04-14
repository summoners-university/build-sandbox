const gulp = require('gulp');

var all_modules = [];
var compile_modules = [];
var watch_modules = [];

var recipe = (name, config) => require('../recipes/'+name)(config);

function moduletasks(name, config) {
    all_modules.push(name);
    compile_modules.push(name + ':compile');
    watch_modules.push(name + ':watch');

    gulp.task(`${name}:templates`, recipe('jade-ng-templates', {
        input: `${config.input}/${name}/**/*.jade`,
        output: `${config.output}/js`,
        name: name
    }));

    gulp.task(`${name}:js`, recipe('babelify-sourcemaps', {
        input: `${config.input}/${name}/index.js`,
        output: `${config.output}/js`,
        external: config.node_modules,
        name: `${name}.js`,
        presets: ['es2015', 'stage-1']
    }));

    gulp.task(`${name}:css`, recipe('stylus', {
        input: `${config.input}/${name}/**/*.styl`,
        output: `${config.output}/css`,
        name: `${name}.css`,
        include: config.css.include
    }));

    gulp.task(`${name}:watch`, function() {
        gulp.watch(`${config.input}/${name}/**/*.js`, [`${name}:js`]);
        gulp.watch(`${config.input}/${name}/**/*.jade`, [`${name}:templates`]);
        gulp.watch(`${config.input}/${name}/**/*.styl`, [`${name}:css`]);
    });

    gulp.task(`${name}:compile`, [
        `${name}:templates`,
        `${name}:js`,
        `${name}:css`
    ]);
    gulp.task(name, [`${name}:compile`, `${name}:watch`]);
}

function modulestasks(names, config) {
    names.forEach(name => {
        moduletasks(name, config);
    })
}

module.exports = { recipe, module: moduletasks, modules: modulestasks, all_modules, compile_modules, watch_modules };