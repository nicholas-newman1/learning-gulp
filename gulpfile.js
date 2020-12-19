const gulp = require('gulp');
const imagemin = require('gulp-imagemin');
const resizer = require('gulp-images-resizer');
const ts = require('gulp-typescript');
const uglify = require('gulp-uglify');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const sourcemaps = require('gulp-sourcemaps');
const rename = require('gulp-rename');
const autoprefixer = require('gulp-autoprefixer');

/*
  -- TOP LEVEL FUNCTIONS --
  gulp.task - define tasks
  gulp.src - point to files to use
  gulp.dest - point to folder to output
  gulp.watch - watch files and folders for changes
*/

// COPIES HTML FILES
gulp.task('copyHtml', function () {
  return gulp.src('src/*.html').pipe(gulp.dest('dist'));
});

// OPTIMIZE IMAGES
gulp.task('imageMin', () => {
  return gulp
    .src('src/images/*')
    .pipe(imagemin())
    .pipe(gulp.dest('dist/images'));
});

// RESIZE IMAGES
gulp.task('resize', function () {
  return gulp
    .src('src/images/*')
    .pipe(
      resizer({
        width: 1920,
        height: 1080,
        quality: 50,
      })
    )
    .pipe(gulp.dest('dist/images'));
});

// COMPILE TYPESCRIPT
gulp.task('ts', function () {
  return gulp
    .src('src/ts/*.ts')
    .pipe(sourcemaps.init())
    .pipe(
      ts({
        noImplicitAny: true,
        outFile: 'main.js',
      })
    )
    .pipe(uglify())
    .pipe(rename({ suffix: '.min' }))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('dist/js'));
});

//MINIFY JS
gulp.task('minify', function () {
  return gulp
    .src('src/**/*.js')
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('dist/js'));
});

// COMPILE SASS
/* Note: .browserslistrc required for autoprefixer. 
https://github.com/browserslist/browserslist#readme */
gulp.task('sass', function () {
  return gulp
    .src('src/scss/*.scss')
    .pipe(sourcemaps.init())
    .pipe(
      sass({
        errLogToConsole: true,
        outputStyle: 'compressed',
      })
    )
    .on('error', console.error.bind(console))
    .pipe(autoprefixer({ cascade: false }))
    .pipe(rename({ suffix: '.min' }))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('dist/css'));
});

// CONCAT JS FILES THEN MINIFY
gulp.task('concat', function () {
  return gulp
    .src('src/**/*.js')
    .pipe(sourcemaps.init())
    .pipe(concat('main.js'))
    .pipe(uglify())
    .pipe(rename({ suffix: '.min' }))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('dist/js'));
});

gulp.task('default', gulp.parallel(['copyHtml', 'resize', 'ts', 'sass']));

/* watch for change, then run function (maybe define functions instead of tasks 
and then put them in as second param instead of using gulp.paralell) */
gulp.task('watch', () => {
  gulp.watch('src/ts/*.ts', gulp.parallel['ts']);
  gulp.watch('src/scss/*.scss', gulp.parallel(['sass']));
  gulp.watch('src/images', gulp.parallel(['resize']));
  gulp.watch('src/*.html', gulp.parallel(['copyHtml']));
});
