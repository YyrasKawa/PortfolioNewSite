const gulp = require('gulp');
const autoprefixer = require('gulp-autoprefixer');
const sass = require('gulp-sass')(require('sass'));
const rename = require('gulp-rename');
const htmlmin = require('gulp-htmlmin');
const cleanCSS = require('gulp-clean-css');
const browserSync = require('browser-sync').create();



gulp.task('server', function() {

    browserSync({
        server: {
            baseDir: "dist"
        }
    });

    gulp.watch("src/*.html").on('change', browserSync.reload);
});

gulp.task('watch', function() {
    gulp.watch("src/sass/**/*.+(scss|sass|css)", gulp.parallel('styles'));
    gulp.watch("src/*.html").on('change', gulp.parallel('html'));
    gulp.watch("src/js/**/*.js").on('change', gulp.series('scripts'));
    gulp.watch("src/fonts/**/*").on('all', gulp.series('fonts'));
    gulp.watch("src/icons/**/*").on('all', gulp.series('icons'));
});

gulp.task('sass', function() {
  return gulp.src('src/sass/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(cleanCSS())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('dist/css'))
    .pipe(browserSync.stream());
});

gulp.task('styles', function() {
    return gulp.src("src/sass/**/*.+(scss|sass)")
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(rename({suffix: '.min', prefix: ''}))
        .pipe(autoprefixer())
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(gulp.dest("dist/css"))
        .pipe(browserSync.stream());
});

gulp.task('html', function() {
  return gulp.src('src/*.html')
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('dist'))
    .pipe(browserSync.stream());
});


gulp.task('serve', function() {
  browserSync.init({
    server: {
      baseDir: 'dist'
    }
  });



  gulp.watch('src/scss/**/*.scss', gulp.series('sass'));
  gulp.watch('src/*.html', gulp.series('html'));
  gulp.watch("src/sass/**/*.+(scss|sass|css)", gulp.series('styles'));
});

gulp.task('default', gulp.series('sass', 'html', 'serve', 'styles'));
