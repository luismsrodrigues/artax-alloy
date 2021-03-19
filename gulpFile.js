const NODEMON = require('gulp-nodemon');
const DEL = require('del');
const GULP = require('gulp');
const RENAME = require('gulp-rename');
const CONCAT = require('gulp-concat');
const UNZIP = require('gulp-unzip');
const { spawnSync } = require('child_process');
const PATH = require('path');

GULP.task('clean:lib', function(){
    return DEL('dist/service', {force:true});
});

GULP.task('dev:lib', function() {
    NODEMON({
        script: 'src/lib/index.js',
        ext: '*',
        watch: 'src/lib',
        ignore: ['']
    })
    .on('restart', function() {
        console.log('LIB RESTART');
    })
});

GULP.task('copy-env-lib', function(){
    return GULP.src(['src/lib/.production.env'])
        .pipe(RENAME('.service.env'))
        .pipe(GULP.dest('dist/service/'));
});

GULP.task('postbuild:lib', GULP.parallel("copy-env-lib"));

GULP.task('clean:http-client', function(){
    return DEL('dist/http-client', {force:true});
});

GULP.task('dev:http-client', function() {
    NODEMON({
        script: 'src/clients/http-client/http-client.provider.js',
        ext: '*',
        watch: 'src/clients/http-client',
        ignore: ['']
    })
    .on('start', function() {
    });
});

GULP.task('copy-staticFiles', function(){
    return GULP.src(['src/clients/http-client/www/**'])
        .pipe(GULP.dest('dist/http-client/www/'));
});

GULP.task('copy-env-http-client', function(){
    return GULP.src(['src/clients/http-client/.production.env'])
        .pipe(RENAME('.http-client.env'))
        .pipe(GULP.dest('dist/http-client/'));
});

GULP.task('postbuild:http-client', GULP.parallel("copy-env-http-client", "copy-staticFiles"));

GULP.task('postbuild:bundle-env', function() {
    return GULP.src(['src/clients/http-client/.production.env', 'src/lib/.production.env'])
      .pipe(CONCAT('.env'))
      .pipe(GULP.dest('./dist/'));
});

GULP.task('postbuild:bundle-www', function() {
    return GULP.src(['src/clients/http-client/www/**'])
      .pipe(GULP.dest('./dist/www'));
});

GULP.task('postbuild:bundle', GULP.parallel("postbuild:bundle-env", "postbuild:bundle-www"));

GULP.task('publish:bundle-env', function() {
    return GULP.src(['dist/.env'])
    .pipe(GULP.dest('dist/publish/'));
});

GULP.task('publish:bundle-www', function() {
    return GULP.src(['dist/www/**'])
    .pipe(GULP.dest('dist/publish/www'));
});

GULP.task('publish:bundle-resources', function() {
    return GULP.src("./resource/resource_hacker.zip")
    .pipe(UNZIP())
    .pipe(GULP.dest('./tmp/resource/resource_hacker'))
});

GULP.task('publish:bundle-resources-clean', function() {
    return DEL('tmp', {force:true});
});

GULP.task('publish:bundle-resources-icon', async function() {
    const RESOURCE_HACK_EXE = PATH.resolve(__dirname, 'tmp', 'resource', 'resource_hacker', 'ResourceHacker.exe');
    const BUNDLE_EXE = PATH.resolve(__dirname, 'dist', 'publish', 'main.exe');
    const ICON = PATH.resolve(__dirname, 'resource', 'icon.ico');

    let response = await spawnSync("powershell.exe", [`
        ${RESOURCE_HACK_EXE} -open ${BUNDLE_EXE} -save ${BUNDLE_EXE} -action addoverwrite -res ${ICON} -mask ICONGROUP,1
    `], {
        encoding: 'utf-8'
    });

    console.log("RESOURCE_HACK", response);

    return response;
});

GULP.task('postpublish:bundle', GULP.parallel("publish:bundle-env", "publish:bundle-www", GULP.series("publish:bundle-resources", "publish:bundle-resources-icon","publish:bundle-resources-clean")));