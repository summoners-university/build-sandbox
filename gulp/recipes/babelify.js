import gulp from 'gulp';
import gutil from 'gulp-util';
import chalk from 'chalk';
import browserify from 'browserify';
import babelify from 'babelify';
import source from 'vinyl-source-stream';

function logError(err) {
    if (err.fileName) {
        // regular error
        gutil.log(chalk.red(err.name)
            + ': '
            + chalk.yellow(err.fileName.replace(__dirname + '/src/js/', ''))
            + ': '
            + 'Line '
            + chalk.magenta(err.lineNumber)
            + ' & '
            + 'Column '
            + chalk.magenta(err.columnNumber || err.column)
            + ': '
            + chalk.blue(err.description))
    } else {
        // browserify error..
        gutil.log(`${chalk.red(err.name)}: ${chalk.yellow(err.message)}`);
    }
}

module.exports = function(config) {
    return () => {
        var b = browserify(config.input);

        if(config.transform) {
            b.transform(babelify.configure(config.transform));
        }

        if(config.require) {
            b.require(config.require);
        }

        if(config.external) {
            b.external(config.external);
        }

        return b
            .bundle()
            .on('error', logError)
            .pipe(source(config.name))
            .pipe(gulp.dest(config.output));
    };
};