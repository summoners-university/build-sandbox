import gulp from 'gulp';
import inject from 'gulp-inject';
import series from 'stream-series';

export default (config) => {
    return () => {

        let streams = config.sources
            .map(sources => {
                return gulp.src(sources, {
                    read: false,
                    cwd: config.cwd
                });
            });

        return gulp.src(config.file)
            .pipe(inject(series.apply(series, streams), {
                addRootSlash: false
            }))
            .pipe(gulp.dest(config.output));
    }
}
