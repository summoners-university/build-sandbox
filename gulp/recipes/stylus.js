import gulp from 'gulp';
import stylus from 'gulp-stylus';

export default (config) => {
    return () => {
        return gulp.src(config.input)
            .pipe(stylus({ 'import': config.include || [] }))
            .pipe(gulp.dest(config.output));
    };
};