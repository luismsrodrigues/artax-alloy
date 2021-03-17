const NODEMON = require('gulp-nodemon');
const DEL = require('del');
const GULP = require('gulp');
const RENAME = require('gulp-rename');

var server = require('gulp-express');
var lr = require('tiny-lr')();


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
    return GULP.src(['.production.env'])
        .pipe(RENAME('.env'))
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
    return GULP.src(['src/http-client/static/**'])
        .pipe(GULP.dest('dist/http-client/static/'));
});

GULP.task('copy-env-http-client', function(){
    return GULP.src(['.production.env'])
        .pipe(RENAME('.env'))
        .pipe(GULP.dest('dist/http-client/'));
});

GULP.task('postbuild:http-client', GULP.parallel("copy-env-http-client", "copy-staticFiles"));