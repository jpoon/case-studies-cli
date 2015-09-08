var gulp = require('gulp'),
    git = require('gulp-git'),
    bump = require('gulp-bump'),
    jshint = require("gulp-jshint"),
    tag_version = require('gulp-tag-version');

function inc(importance) {
    return gulp.src(['./package.json'])
        .pipe(bump({type: importance}))
        .pipe(gulp.dest('./'))
        .pipe(git.commit('bump package version'))
        .pipe(tag_version());
}

gulp.task('patch', function() { return inc('patch'); })
gulp.task('feature', function() { return inc('minor'); })
gulp.task('release', function() { return inc('major'); })

gulp.task("lint", function () {
    gulp.src("src/*.js")
        .pipe(jshint())
        .pipe(jshint.reporter("default"));
});

gulp.task('watch', function () {
    gulp.watch("src/*.js", ["lint"]);
});