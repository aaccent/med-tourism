import webpack from "webpack-stream"

const js = () => {
    return app.gulp.src(app.path.src.js, { sourcemaps: true })
        .pipe(webpack({
            mode: "development",
            optimization: {
                minimize: false
            },
            entry: {
                app: "./src/js/app.js",
            },
            output: {
                filename: "[name].min.js"
            }
        }))
        .pipe(app.gulp.dest(app.path.build.js))
        .pipe(app.plugins.browserSync.stream())
}

const js_libs = () => {
    return app.gulp.src(app.path.src.js_libs)
        .pipe(app.gulp.dest(app.path.build.js_libs))
}

export { js, js_libs }

// const concat        = require('gulp-concat');

// function scripts() {
//     return src([
//       'node_modules/jquery/dist/jquery.js',
//       'app/js/main.js'
//     ])
//       .pipe(concat('main.min.js'))
//       .pipe(uglify())
//       .pipe(dest('app/js'))
//       .pipe(browserSync.stream())
// }