// FOUNDATION FOR APPS TEMPLATE GULPFILE
// -------------------------------------
// This file processes all of the assets in the "client" folder, combines them with the Foundation for Apps assets, and outputs the finished files in the "build" folder as a finished app.

// 1. LIBRARIES
// - - - - - - - - - - - - - - -

var $        = require('gulp-load-plugins')();
var argv     = require('yargs').argv;
var gulp     = require('gulp');
var rimraf   = require('rimraf');
var sequence = require('run-sequence');


var ngConstant = require('gulp-ng-constant');
var gutil = require('gulp-util');
// var jshint = require('gulp-jshint');
var protractor = require("gulp-protractor").protractor;
var crisper = require('gulp-crisper');
// Check for --production flag
var isProduction = !!(argv.production);

// Lint Task
// gulp.task('lint', function() {
//     return gulp.src([,
//               'app/assets/js/**/*.js'
//             ])
//         .pipe(jshint())
//         .pipe(jshint.reporter('default'));
// });

var myConfig = require('./config/app.conf.json');
var myEnv = undefined;

var get_env = function() {
  if (!(myEnv === undefined)) {
    return myEnv;
  }
  if (process.env.BUGSY_ENV == undefined) {
    myEnv = 'dev';
  } else {
    myEnv = process.env.BUGSY_ENV;
  }
  gutil.log("Using environment " + myEnv);
  return myEnv;
};

var get_config = function() {
  // Toggle environments
  return myConfig[get_env()];
};

gulp.task('constants', function () {
  var envConfig = get_config();

  return ngConstant({
      name: 'application.appConfig',
      constants: envConfig,
      stream: true
    })
    .pipe(gulp.dest('./build/assets/js'));
});


// 2. FILE PATHS
// - - - - - - - - - - - - - - -

var paths = {
  assets: [
    './app/**/*.*',
    '!./app/components/**/*.*',
    '!./app/assets/{scss,js}/**/*.*'
  ],
  // Sass will check these folders for files when you use @import.
  sass: [
    'app/assets/scss',
    'bower_components/foundation-apps/scss'
  ],
  // These files include Foundation for Apps and its dependencies
  foundationJS: [
    'bower_components/fastclick/lib/fastclick.js',
    'bower_components/viewport-units-buggyfill/viewport-units-buggyfill.js',
    'bower_components/tether/tether.js',
    'bower_components/hammerjs/hammer.js',
    'bower_components/angular/angular.js',
    'bower_components/angular-animate/angular-animate.js',
    'bower_components/angular-ui-router/release/angular-ui-router.js',
    'bower_components/foundation-apps/js/vendor/**/*.js',
    'bower_components/foundation-apps/js/angular/**/*.js',
    'bower_components',
    '!bower_components/foundation-apps/js/angular/app.js',

    // needed for angular material
    // 'bower_components/angular-aria/angular-aria.min.js',
    // 'bower_components/angular-messages/angular-messages.min.js',

    // file upload
    // 'bower_components/ng-file-upload/ng-file-upload.min.js',
    'bower_components/angular-ui-router/release/angular-ui-router.min.js',
    'bower_components/angular-toastr/dist/angular-toastr.tpls.js',
  ],
  // These files are for your app's JavaScript
  appJS: [
    'app/app.module.js',
    'app/app.routes.js',
    'app/components/**/*.js',
    'app/assets/**/*.js'
  ]
}

// 3. TASKS
// - - - - - - - - - - - - - - -

// Cleans the build directory
gulp.task('clean', function(cb) {
  rimraf('./build', cb);
});

// Copies everything in the client folder except templates, Sass, and JS
gulp.task('copy', function() {
  return gulp.src(paths.assets, {
    base: './app/'
  })
    .pipe(gulp.dest('./build'))
  ;
});

// Copies your app's page templates and generates URLs for them
gulp.task('copy:templates', function() {
  return gulp.src('./app/components/**/*.html')
    .pipe(gulp.dest('./build/components/'))
  ;
});

// Copies angular material files
gulp.task('copy:angular-material', function() {
  return gulp.src(['bower_components/angular-material/**/*.min.{js,css}'])
    .pipe(gulp.dest('./build/assets/js/angular-material'));
});

// Compiles the Foundation for Apps directive partials into a single JavaScript file
gulp.task('copy:foundation', function(cb) {
  gulp.src('bower_components/foundation-apps/js/angular/components/**/*.html')
    .pipe($.ngHtml2js({
      prefix: 'components/',
      moduleName: 'foundation',
      declareModule: false
    }))
    .pipe($.uglify())
    .pipe($.concat('templates.js'))
    .pipe(gulp.dest('./build/assets/js'))
  ;

  // Iconic SVG icons
  gulp.src('./bower_components/foundation-apps/iconic/**/*')
    .pipe(gulp.dest('./build/assets/img/iconic/'))
  ;

  cb();
});

// Compiles Sass
gulp.task('sass', function () {
  var minifyCss = $.if(isProduction, $.minifyCss());

  return gulp.src('app/assets/scss/app.scss')
    .pipe($.sass({
      includePaths: paths.sass,
      outputStyle: (isProduction ? 'compressed' : 'nested'),
      errLogToConsole: true
    }))
    .pipe($.autoprefixer({
      browsers: ['last 2 versions', 'ie 10']
    }))
    .pipe(minifyCss)
    .pipe(gulp.dest('./build/assets/css/'))
  ;
});

// Compiles and copies the Foundation for Apps JavaScript, as well as your app's custom JS
gulp.task('uglify', ['uglify:foundation', 'uglify:app'])

gulp.task('uglify:foundation', function(cb) {
  var uglify = $.if(isProduction, $.uglify()
    .on('error', function (e) {
      gutil.log(e);
    }));

  return gulp.src(paths.foundationJS)
    .pipe(uglify)
    .pipe($.concat('foundation.js'))
    .pipe(gulp.dest('./build/assets/js/'))
  ;
});

gulp.task('uglify:app', function() {
  var uglify = $.if(isProduction, $.uglify()
    .on('error', function (e) {
      gutil.log(e);
    }));

  return gulp.src(paths.appJS)
    // .pipe(uglify)
    .pipe($.concat('app.js'))
    .pipe(gulp.dest('./build/assets/js/'))
  ;
});

// Starts a test server, which you can view at http://localhost:8079
gulp.task('server', ['build'], function() {
  gulp.src('./build')
    .pipe($.webserver({
      port: 8000,
      host: '192.168.1.6', //'localhost',
      fallback: 'index.html',
      livereload: true,
      open: true
    }))
  ;
});

// Builds your entire app once, without starting a server
gulp.task('build', function(cb) {
  sequence('clean', [
    'constants',
    // 'lint',
    'copy',
    'copy:foundation',
    'sass',
    'uglify'],
    'copy:templates', cb);
});

gulp.task('e2e', function() {
  return gulp.src(["test/e2e/*Spec.js"])
    .pipe(protractor({
        configFile: "test/protractor.config.js",
        args: ['--baseUrl', get_config().APP_CONFIG.SPA_URL]
    }))
    .on('error', function(e) { throw e });
});

// Default task: builds your app, starts a server, and recompiles assets when they change
// gulp.task('default', ['server'], function () {
gulp.task('default', ['server'], function () {
  // Watch Sass
  gulp.watch(['./app/assets/scss/**/*', './scss/**/*'], ['sass']);

  // Watch JavaScript
  gulp.watch(['./app/components/**/*.js',
              './app/assets/js/**/*',
              './js/**/*',
              'app/app.module.js',
              'app/app.routes.js'], [
              // 'lint',
               'uglify:app']);

  // Watch static files
  gulp.watch(['./app/**/*.*',
              '!./app/assets/{scss,js}/**/*.*',
              '!./app/components/**/*.*'], ['copy']);

  // Watch app templates
  gulp.watch(['./app/components/**/*.html'], ['copy:templates']);

});
