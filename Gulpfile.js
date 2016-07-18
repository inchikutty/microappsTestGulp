const gulp = require('gulp'),
    sass = require('gulp-ruby-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    rename = require('gulp-rename')
    babel = require('gulp-babel');

gulp.task('styles', function() {
  return sass('sass', { style: 'expanded' })
    .pipe(gulp.dest('css'))
    .pipe(rename({suffix: '.min'}))
    .pipe(minifycss())
    .pipe(gulp.dest('css'));
});
gulp.task('express', function() {
  var express = require('express');
  var app = express();
  app.use(express.static(__dirname+'/app/'));
  app.listen(4000);
});
gulp.task('babelcompile', function() {
return gulp.src('js/**/*.js')
.pipe(babel({
  presets: ["es2015"]
}))
.pipe(gulp.dest('js'));
});

gulp.task('default', ['express'], function() {

});
