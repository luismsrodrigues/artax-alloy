const NODEMON = require('gulp-nodemon');
const DEL = require('del');
const GULP = require('gulp');
const RENAME = require('gulp-rename');

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

GULP.task('clean:http-client', function(){
    return DEL('dist/http-client', {force:true});
});

GULP.task('dev:http-client', function() {
    NODEMON({
        script: 'src/http-client/index.js',
        ext: '*',
        watch: 'src/client',
        ignore: ['']
    })
    .on('restart', function() {
        console.log('CLIENT RESTART');
    })
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