const gulp = require('gulp');
const path = require('path');
const json = require('gulp-json-editor');
const rename = require('gulp-rename');

module.exports = (config) => {
    return () => {
        return gulp.src(config.input)
          .pipe(rename(config.name))
          .pipe(json(config.modify))
          .pipe(gulp.dest(config.output));
    }
};
