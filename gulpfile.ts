const gulp = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const htmlMin = require("gulp-htmlmin");
const cleanCSS = require("gulp-clean-css");
const browserSync = require("browser-sync").create();
const babel = require("gulp-babel");
const uglify = require("gulp-uglify");
const typeScript = require("gulp-typescript");
const tsProject = typeScript.createProject("tsconfig.json");

function minifyHTML() {
    return gulp
        .src("./src/*.html")
        .pipe(
            htmlMin({
                collapseWhitespace: true,
                removeComments: true,
            })
        )
        .pipe(gulp.dest("./dist/"));
}

function style() {
    return gulp
        .src("./src/sass/**/*.scss")
        .pipe(sass().on("error", sass.logError))
        .pipe(cleanCSS())
        .pipe(gulp.dest("./dist/css"))
        .pipe(browserSync.stream());
}

function compileTS() {
    return (
        gulp
            .src("./src/ts/app.ts")
            .pipe(tsProject())
            // .pipe(
            //     tsProject({
            //         outDir: "dist/js",
            //         target: "es6",
            //         noImplicitAny: true,
            //         module: "es2015",
            //         // moduleResolution: "nodenext",
            //         moduleResolution: "node",
            //     })
            // )

            // TESTING: trying a ting
            // .pipe(
            //     babel({
            //         presets: ["@babel/preset-env"],
            //     })
            // )
            .pipe(uglify())
            .pipe(gulp.dest("./dist/js"))
    );
}

function configureJS() {
    return gulp
        .src("./src/js/*")
        .pipe(
            babel({
                presets: ["@babel/preset-env"],
            })
        )
        .pipe(uglify())
        .pipe(gulp.dest("./dist/js"));
}

function copyAssets() {
    return gulp.src("./src/assets/**/*").pipe(gulp.dest("./dist/assets"));
}

function watch() {
    browserSync.init({
        server: {
            baseDir: "./dist",
        },
        browser: "firefox",
    });

    gulp.watch(["./src/*.html", "./src/sass/**/*.scss", "./src/ts/app.ts"], gulp.parallel(minifyHTML, style, compileTS, configureJS));

    gulp.watch("./src/*.html").on("change", browserSync.reload);
    gulp.watch("./src/js/app.js").on("change", browserSync.reload);
}

exports.default = gulp.series(gulp.parallel(minifyHTML, style, compileTS, configureJS), watch);

exports.minifyHTML = minifyHTML;
exports.style = style;
exports.compileTS = compileTS;
exports.configureJS = configureJS;
exports.copyAssets = copyAssets;
exports.watch = watch;
