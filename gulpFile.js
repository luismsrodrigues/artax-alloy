const NODEMON = require('gulp-nodemon');
const DEL = require('del');
const GULP = require('gulp');
const RENAME = require('gulp-rename');
const CONCAT = require('gulp-concat');


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

GULP.task('postpublish:bundle', GULP.parallel("publish:bundle-env", "publish:bundle-www"));