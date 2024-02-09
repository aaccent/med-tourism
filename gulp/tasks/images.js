import webp from "gulp-webp"
import imagemin from "gulp-imagemin"

const images = () => {
    return app.gulp.src(app.path.src.images)
        // .pipe(app.plugins.newer(app.path.build.images))
        .pipe(webp())
        .pipe(app.gulp.dest(app.path.build.images))
        .pipe(app.gulp.src(app.path.src.images))
        .pipe(app.plugins.newer(app.path.build.images))
        .pipe(imagemin({
            concurrency: 4,
            progressive: true,
            svgoPlugins: [{ removeViewBox: false }],
            interlaced: true,
            optimizationLevel: 3,
            verbose: true
        }))
        .pipe(app.gulp.dest(app.path.build.images))
        .pipe(app.gulp.src(app.path.src.svg))
        .pipe(app.gulp.dest(app.path.build.images))
        .pipe(app.plugins.browserSync.stream())
}

export { images } 