import gulp from 'gulp';
import bower from 'main-bower-files';

export default (config) => {
    return () => {
        return gulp.src(bower())
            .pipe(gulp.dest(config.output));
    }
}
