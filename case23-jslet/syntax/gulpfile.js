
var gulp = require('gulp');
var concat = require('gulp-concat');

gulp.task('build', ['build-js', 'build-css', 'copy-images', 'copy-lib-lang']);

gulp.task('build-js-data', function() {
	gulp.src(['src/jslet.global.js', 'src/core/*.js', '!src/core/jslet.messagebus.js', 'src/data/*.js'])
			.pipe(concat('jslet-data.debug.js'))
			.pipe(gulp.dest('build'));
})

gulp.task('build-js-ui', function() {
	gulp.src(['src/ui/**/*.js'])
			.pipe(concat('jslet-ui.debug.js'))
			.pipe(gulp.dest('build'));
})

gulp.task('build-js', ['build-js-data', 'build-js-ui'])

gulp.task('build-css', function() {
	gulp.src(['src/asset/default/*.css'])
			.pipe(concat('jslet-all.css'))
			.pipe(gulp.dest('build/asset/default'));

	gulp.src(['src/asset/gray/*.css'])
			.pipe(concat('jslet-all.css'))
			.pipe(gulp.dest('build/asset/gray'));
})

gulp.task('copy-lib-lang', function() {
	gulp.src('src/lib/**/*.*')
			.pipe(gulp.dest('build/lib'))

	gulp.src('src/locale/**/*.*')
			.pipe(gulp.dest('build/locale'))

})

gulp.task('copy-images', function() {
	gulp.src(['src/asset/default/images/**/*.*'])
			.pipe(gulp.dest('build/asset/default/images'))

	gulp.src(['src/asset/gray/images/**/*.*'])
		.pipe(gulp.dest('build/asset/gray/images'))
})

