var gulp = require("gulp");
var jshint = require("gulp-jshint");

gulp.task("lint", function () {
    gulp.src("src/*.js")
        .pipe(jshint())
        .pipe(jshint.reporter("default"));
});

gulp.task('watch', function () {
    gulp.watch("src/*.js", ["lint"]);
});