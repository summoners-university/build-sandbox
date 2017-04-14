const gulp = require('gulp');
const env = require('gulp-env');

module.exports = function(config) {
    return () => {
        return env({
            vars: {
                NODE_PATH: config.NODE_PATH
            }
        })
    };
};
