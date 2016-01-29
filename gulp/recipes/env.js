import gulp from 'gulp';
import env from 'gulp-env';

export default (config) => {
    return () => {
        env({
            vars: config
        })
    }
}
