const TARGET_ENV = process.env.NODE_ENV || 'local';
console.log(`Starting gulp in ${TARGET_ENV} mode`);

if(TARGET_ENV == 'local') {
    require('./gulp/dev.gulpfile');
} else {
    require('./gulp/prod.gulpfile');
}