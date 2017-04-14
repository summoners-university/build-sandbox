mkdir _logs
NODE_ENV=production PORT=3030 forever start node_modules/gulp/bin/gulp.js -o _logs/out.log -e _logs/err.log --sourceDir ../summonersuniversity.com