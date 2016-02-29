var $ = require('gulp-load-plugins')();
var browser = require('browser-sync');
var docs = require('./index');
var gulp = require('gulp');
var panini = require('panini');
var supercollider = require('supercollider');

// Supercollider configuration
supercollider
  .config({
    template: 'templates/component.html',
    marked: docs.marked,
    handlebars: docs.handlebars
  })
  .adapter('sass')
  .adapter('js')

// Generates a documentation page
gulp.task('page', function() {
  panini.refresh();

  return gulp.src('test/fixtures/*.md')
    .pipe(supercollider.init())
    .pipe(panini({
      root: 'test/fixtures',
      layouts: 'test/visual',
      partials: 'test/visual/partials'
    }))
    .pipe(gulp.dest('test/visual/_build'))
    .on('finish', browser.reload);
});

// Compiles documentation CSS
gulp.task('sass', function() {
  return gulp.src('test/visual/docs.scss')
    .pipe($.sass({
      includePaths: [
        'scss',
        'node_modules/foundation-sites/scss',
        'node_modules/motion-ui/src'
      ]
    }).on('error', $.sass.logError))
    .pipe($.autoprefixer({
      browsers: ['last 2 versions', 'ie >= 9']
    }))
    .pipe(gulp.dest('test/visual/_build'))
    .pipe(browser.reload({ stream: true }));
});

// Creates a server and watches for file changes
gulp.task('default', ['page', 'sass'], function() {
  browser.init({
    server: 'test/visual/_build'
  });

  gulp.watch(['test/visual/**/*.html'], ['page']);
  gulp.watch(['scss', 'test/visual/docs.scss'], ['sass']);
});
