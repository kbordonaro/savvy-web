var gulp = require('gulp');
var less = require('gulp-less');
var browserSync = require('browser-sync').create();
var header = require('gulp-header');
var cleanCSS = require('gulp-clean-css');
var rename = require("gulp-rename");
var uglify = require('gulp-uglify');
var print = require('gulp-print');
var clean = require('gulp-clean');
var zip = require('gulp-zip');
var webpack = require('webpack');
var webpackStream = require('webpack-stream');
var webpackDevMiddleware = require('webpack-dev-middleware');
var webpackHotMiddleware = require('webpack-hot-middleware');

var webpackDevConfig = require('./config/webpack.config.development.js');
var webpackPublishConfig = require('./config/webpack.config.production.js');
var bundler = webpack(webpackDevConfig);

// Compile LESS files from /less into /css
gulp.task('less', function() {
    return gulp.src('less/styles.less')
        .pipe(less())
        .pipe(gulp.dest('assets/css/'))
        .pipe(browserSync.reload({
            stream: true
        }))
});

// Minify compiled CSS
gulp.task('minify-css', ['less'], function() {
    return gulp.src('assets/css/styles.css')
        .pipe(cleanCSS({ compatibility: 'ie8' }))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('assets/css'))
        .pipe(browserSync.reload({
            stream: true
        }))
});

var minify = function(files) {
    return gulp.src(files)
        .pipe(uglify())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('assets/js'))
        .pipe(browserSync.reload({
            stream: true
        }));
}

// Minify JS
gulp.task('minify-js', function() {
    return minify(['assets/js/*.js','!assets/js/*.min.js']);
});

// Run everything
gulp.task('default', ['less', 'minify-css', 'minify-js']);

// Configure the browserSync task
gulp.task('browserSync', function() {
    browserSync.init({
        server: {
            baseDir: ''
        },
        middleware: [
            // Add webpack middleware
            webpackDevMiddleware(bundler, {
              // IMPORTANT: dev middleware can't access config, so we should
              // provide publicPath by ourselves
              publicPath: webpackDevConfig.output.publicPath,

              // pretty colored output
              stats: { colors: true }
            }),

            webpackHotMiddleware(bundler)
        ]
    })
})

// Dev task with browserSync
gulp.task('dev', ['browserSync', 'less', 'minify-css', 'minify-js'], function() {
    gulp.watch('less/*.less', ['less']);
    gulp.watch('assets/css/*.css', ['minify-css']);
    gulp.watch('assets/js/*.js').on('change', function(event) {
        // Only minify the file that changed as long as that file
        // is not already minified.
        if(event.path.indexOf('.min.js') < 0) {
            minify(event.path);
        }
    });
    // Reloads the browser whenever HTML or JS files change
    gulp.watch('*.html', browserSync.reload);
    gulp.watch('assets/js/**/*.js', browserSync.reload);
});

// Publish the website.
gulp.task('publish', ['clean-publish', 'less', 'minify-css', 'minify-js', 'publish-sitemap', 'publish-apps', 'publish-html', 'publish-assets', 'publish-scripts']);

gulp.task('publish-html', function() {
    return gulp.src(['*.html', '!_template.html']).pipe(gulp.dest('published'));
});

gulp.task('publish-sitemap', function() {
    return gulp.src(['sitemap.xml']).pipe(gulp.dest('published'));
});

gulp.task('publish-assets', function() {
    return gulp.src(['assets/**/*']).pipe(gulp.dest('published/assets'));
});

gulp.task('publish-apps', function() {
    return gulp.src(['apps/calendar.js'])
        .pipe(webpackStream(webpackPublishConfig))
        .pipe(gulp.dest('published/assets/apps'));
});

gulp.task('publish-scripts', function() {
    return gulp.src(['scripts/**/*.php']).pipe(gulp.dest('published/scripts'));
});

gulp.task('clean-publish', function() {
    return gulp.src(['published'], {read: false})
        .pipe(clean({force: true}));
});

// Backup the application
gulp.task('backup', function() {
    var timestamp = Date.now();
    var filename = 'savvy-web-' + timestamp + '.zip';

    return gulp.src(['*', '!node_modules', '!published', '!backups']).pipe(zip(filename)).pipe(gulp.dest('../backups'));
});