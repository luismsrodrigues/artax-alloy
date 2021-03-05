const NODEMON = require('gulp-nodemon');
const DEL = require('del');
const GULP = require('gulp');
const RENAME = require('gulp-rename');

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

GULP.task('clean', function(){
    return DEL('dist', {force:true});
});

GULP.task('copy-staticFiles', function(){
    return GULP.src(['src/client/static/**'])
        .pipe(GULP.dest('dist/static/'));
});

GULP.task('copy-env', function(){
    return GULP.src(['.production.env'])
        .pipe(RENAME('.env'))
        .pipe(GULP.dest('dist/'));
});

GULP.task('postbuild', GULP.parallel("copy-env", "copy-staticFiles"));