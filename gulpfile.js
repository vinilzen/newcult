var gulp = require('gulp'),     
	sass = require('gulp-ruby-sass') ,
	notify = require("gulp-notify") ,
	sourcemaps = require('gulp-sourcemaps'),
	browserSync = require('browser-sync').create(),
	reload = browserSync.reload;

var config = {
	sassPath: './scss',
	bowerDir: './bower_components' 
}

gulp.task('sass', function () {

    sass([config.sassPath+'/newcult.scss'], {
			sourcemap: true,
			style: 'expanded',
			loadPath: config.bowerDir+'/bootstrap-sass/assets/stylesheets'
		})
		.on('error', function (err) {
			console.error('Error!', err.message);
		})
		.pipe(sourcemaps.write('./', {
            includeContent: false,
            sourceRoot: './sass'
        }))
        .pipe(gulp.dest('./css'))
        .pipe(browserSync.stream());
});

// gulp.task('watch', function() {
//      gulp.watch(config.sassPath + '/*.scss', ['sass']);
// });

// Static server
gulp.task('browser-sync', ['sass'], function() {
    browserSync.init({
        server: {
            baseDir: "./"
        },
        open: false,
        ghostMode: false,
    });

    gulp.watch("scss/*.scss", ['sass']);
	gulp.watch("*.html").on('change', browserSync.reload);
});

gulp.task('reload', function() {
	browserSync.reload;
});

  gulp.task('default', ['browser-sync']);


