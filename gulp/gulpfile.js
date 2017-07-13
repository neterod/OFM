(function () {
    'use strict';

    var gulp  = require('gulp'),
        uglify  = require('gulp-uglify'),
        less  = require('gulp-less'),
        csslint = require('gulp-csslint'),
        lessReporter = require('gulp-csslint-less-reporter'),
        browserSync = require('browser-sync').create(),
        htmlmin = require('gulp-htmlmin'),
        jshint = require('gulp-jshint'),
        jscs = require('gulp-jscs'),
        notify = require('gulp-notify'),
        nunjucks = require('gulp-nunjucks'),
        concat = require('gulp-concat'),
        imagemin = require('gulp-imagemin'),
        rename = require('gulp-rename'),
        sourcemaps = require('gulp-sourcemaps'),
        whitespace = require('gulp-whitespace'),

        //new
        cached = require('gulp-cached'),
        remember = require('gulp-remember'),

        distDir = '../dist',
        distJS = distDir + '/js',

        //isWin = /^win/.test(process.platform),
        //proxy = isWin ? 'http://localhost:2929' : 'http://localwindows:2929',

        /* jQuery library */
        jQuerySrc = [
            '../src/js/jquery/jquery-1.11.2.min.js',
            '../src/js/jquery/jquery.flexslider.js',
            //'../src/js/jquery/jquery.matchHeight-min.js',
            '../src/js/jquery/jquery.printElement.js'
        ],
        jQueryDest = distJS,
        jQueryLibFile = 'jquery.min.js',


        /* Bootstrap libraries */
        libBSSrc = [
            '../src/js/bootstrap/affix.js',
            '../src/js/bootstrap/alert.js',
            '../src/js/bootstrap/button.js',
            '../src/js/bootstrap/carousel.js',
            '../src/js/bootstrap/collapse.js',
            '../src/js/bootstrap/dropdown.js',
            '../src/js/bootstrap/modal.js',
            '../src/js/bootstrap/scrollspy.js',
            '../src/js/bootstrap/tab.js',
//            '../src/js/bootstrap/tooltip.js',
//            '../src/js/bootstrap/popover.js',
            '../src/js/bootstrap/transition.js'
        ],
        libBSDest = distJS,
        libBSFile = 'bootstrap.min.js',


        /* IE libraries */
        libIESrc = [
            '../src/js/ie/html5shiv.min.js',
            '../src/js/ie/respond.min.js'
        ],
        libIEDest = distJS,
        libIEFile = 'ie.min.js',


        /* other libraries */
//        libSrc = [
//            '../src/js/file.js'
//        ],
//        libDest = '../js/',
//        libFile = 'lib.min.js',

        /* javascript files */
        jsSrc  = [
            '../src/js/plugins/accessibility-nav.js',
            '../src/js/plugins/mobile-nav-height.js',
            '../src/js/plugins/convert-svg-inline.js',
            '../src/js/plugins/mobile-tables.js',
            '../src/js/main.js'
        ],
        jsDest = distJS,
        jsLintSrc = [
            '../src/js/plugins/mobile-nav-height.js',
            '../src/js/main.js'
        ],

        /* CSS */
        cssBootstrapSrc = '../src/less/bootstrap/bootstrap.less',
        cssSrc = '../src/less/main.less',
        cssDest = distDir + '/css/';


    gulp.task('compresslibraries', function () {

        /* jQuery */
        gulp.src(jQuerySrc)
            .pipe(concat(jQueryLibFile))
            .pipe(uglify())
            .pipe(gulp.dest(jQueryDest));

        /* Boostrap */
        gulp.src(libBSSrc)
            .pipe(concat(libBSFile))
            .pipe(uglify())
            .pipe(gulp.dest(libBSDest));

        /* IE */
        gulp.src(libIESrc)
            .pipe(concat(libIEFile))
            .pipe(uglify())
            .pipe(gulp.dest(libIEDest));

        /* Other libraries */
//        gulp.src(libSrc)
//            .pipe(concat(libFile))
//            .pipe(uglify())
//            .pipe(gulp.dest(libDest));
    });

    gulp.task('compressjs', ['lint', 'jscs'], function () {

        gulp.src(jsSrc)
            .pipe(sourcemaps.init())
            .pipe(remember('compressfiles'))
            .pipe(concat('main.min.js'))
            .pipe(uglify({
                mangle: false
            }))
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest(jsDest));
    });


    gulp.task('compileimages', function () {
        return gulp.src('../src/images/*')
            .pipe(imagemin())
            .pipe(gulp.dest('../dist/images'));
    });


    /*
    ** jscs and lint have to be on different task
    * in order to break the build of one of them fail
    * *** We can't cache jscs because cached checks for content change, not spaces
    */

    gulp.task('jscs', function () {
        return gulp.src(jsLintSrc)
//            .pipe(cached('jscsfiles'))
            .pipe(whitespace({
                removeTrailing: true
            }))
            .pipe(jscs())
            .pipe(jscs.reporter())
            .pipe(jscs.reporter('fail'))
            .on('error', notify.onError({
                message: 'JSCS failed.'
            }));
    });

    gulp.task('lint', function () {
        return gulp.src(jsLintSrc)
//            .pipe(cached('lintfiles'))
            .pipe(jshint('.jshintrc'))
            .pipe(jshint.reporter('jshint-stylish'))
            .pipe(jshint.reporter('fail'))
            .on('error', notify.onError({
                message: 'JSHint failed.'
            }));
    });

    gulp.task('compilecss', function () {
        return gulp.src(cssSrc)
            .pipe(remember('lessfiles'))
            .pipe(sourcemaps.init())
            .pipe(rename('main.min.css'))
            .pipe(less({
                compress: true
            }))
            .pipe(csslint('../src/less/.csslintrc'))
            .pipe(lessReporter())
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest(cssDest));
    });

    gulp.task('compilecssbootstrap', function () {
        return gulp.src(cssBootstrapSrc)
            .pipe(less({
                compress: true
            }))
            .pipe(rename('bootstrap.min.css'))
            .pipe(gulp.dest(cssDest));
    });

    gulp.task('minifyhtml', function () {
        return gulp.src('../src/*.html')
            .pipe(nunjucks.compile())
            .pipe(htmlmin({
                collapseWhitespace: true
            }))
            .pipe(gulp.dest(distDir));
    });

    gulp.task('server', [], function () {
        cached.caches = {};
        browserSync.init({
            server: {
                baseDir: distDir
            },
            open: false
        });

        browserSync.watch(cssDest + '*.css', function (event, file) {
            if (event === 'change') {
                browserSync.reload(cssDest + '*.css');
            }
        });

        gulp.watch('../src/less/*.less', ['compilecss']);
//        gulp.watch('../src/less/bootstrap/*.less', ['compilecssbootstrap']);
        gulp.watch(jsSrc, ['jscs', 'lint', 'compressjs']);
        gulp.watch('../src/**/*.html', ['minifyhtml']);

        gulp.watch([distDir + '/*.html', jsDest + '/*.js']).on('change', browserSync.reload);

    });


    gulp.task('default', [
        'server'
        ,'jscs'
        ,'compileimages'
        ,'compressjs'
        ,'compilecss'
//        ,'minifyhtml'
        ,'compilecssbootstrap'
        ,'compresslibraries'
    ]);
}());