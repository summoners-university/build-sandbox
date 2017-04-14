const CURRENT_ENV = process.env.NODE_ENV || 'local';
console.log(`Starting gulp in ${CURRENT_ENV} mode.`);

if(CURRENT_ENV == 'local') {
    require('./gulp/dev.gulpfile');
} else {
    require('./gulp/prod.gulpfile');
}