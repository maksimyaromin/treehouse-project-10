const package = require("./package.json");

const      gulp = require("gulp"),
            del = require("del"),
            iff = require("gulp-if"),
        plumber = require("gulp-plumber"),
          newer = require("gulp-newer"),
         cached = require("gulp-cached"),
       fancyLog = require("fancy-log"),
          print = require("gulp-print").default,
         moment = require("moment"),
         header = require("gulp-header"),
     sourcemaps = require("gulp-sourcemaps"),
        cssnano = require("gulp-cssnano"),
         uglify = require("gulp-uglify"),
         concat = require("gulp-concat"),
           size = require("gulp-size")
           //sass = require("gulp-compass"),
       imagemin = require("gulp-imagemin"),
           svgo = require("gulp-svgmin"),
          babel = require("gulp-babel"),
    runSequence = require("run-sequence").use(gulp);

const onError = err => {
    console.log(err);
};

const banner = 
`/**
 * @project     ${package.name}
 * @author      ${package.author}
 * @build       ${moment().format("LLLL")}
 * @release     
 * @copyright   Copyright (c) ${moment().format("YYYY")}, ${package.author}
*/

`;

gulp.task("clean", () => {
    fancyLog("-> Clean dist assets folder");
    del("./public/**/*");
});

gulp.task("scripts", () => {
    fancyLog("-> Building scripts");
    return gulp.src(package.globs.distJs)
        .pipe(plumber({ errorHandler: onError }))
        .pipe(newer({ dest: package.paths.dist.js + "scripts.js" }))
        .pipe(sourcemaps.init({ loadMaps: true }))
        .pipe(babel({
            presets: [ "@babel/env" ],
            ignore: [
                "node_modules"
            ]
        }))
        .pipe(concat("scripts.js"))
        .pipe(uglify())
        .pipe(header(banner))
        .pipe(sourcemaps.write("./"))
        .pipe(size({ gzip: true, showFiles: true }))
        .pipe(gulp.dest(package.paths.dist.js));
});

gulp.task("compile:scss", () => {
    fancyLog("-> Compiling scss");
    return gulp.src(package.paths.src.scss + package.vars.scssName)
        .pipe(plumber({ errorHandler: onError }))
        .pipe(sourcemaps.init({ loadMaps: true }))
        .pipe(sass({
            config_file: package.paths.compass,
            sass: package.paths.src.scss,
            css: package.paths.build.css
        }))
        .pipe(cached("sass"))
        .pipe(sourcemaps.write("./"))
        .pipe(size({ gzip: true, showFiles: true }))
        .pipe(gulp.dest(package.paths.build.css));     
});

gulp.task("styles", [ "compile:scss" ], () => {
    fancyLog("-> Building css");
    return gulp.src(package.globs.distCss)
        .pipe(plumber({ errorHandler: onError }))
        .pipe(newer({ dest: package.paths.dist.css + "styles.css" }))
        .pipe(print())
        .pipe(sourcemaps.init({ loadMaps: true }))
        .pipe(concat("styles.css"))
        .pipe(cssnano({
            discardComments: {
                removeAll: true
            },
            discardDuplicates: true,
            discardEmpty: true,
            minifyFontValues: true,
            minifySelectors: true
        }))
        .pipe(header(banner))
        .pipe(sourcemaps.write("./"))
        .pipe(size({ gzip: true, showFiles: true }))
        .pipe(gulp.dest(package.paths.dist.css));
});

gulp.task("images", () => {
    fancyLog("-> Images optimizing");
    return gulp.src(package.paths.src.images + "**/*.{png,jpg,ico,svg}")
        .pipe(plumber({ errorHandler: onError }))
        .pipe(iff([ "*.{png,jpg}" ], imagemin({
            progressive: true,
            interlaced: true,
            optimizationLevel: 7,
            svgoPlugins: [ { removeViewBox: false } ],
            verbose: true,
            use: []
        })))
        .pipe(iff([ "*.svg" ], svgo({
            plugins: [{
                cleanupIDs: { remove: false }
            }]
        })))
        .pipe(gulp.dest(package.paths.dist.images));
});

gulp.task("build:assets", (done) => {
    //runSequence("clean", "styles", "images", "scripts", done);
});

gulp.task("watch:scss", () => {
    // gulp.watch([ 
    //     package.paths.src.scss + "**/*.scss"
    // ], [ "styles" ]);
});

gulp.task("watch:js", () => {
    // gulp.watch([ 
    //     package.paths.src.js + "**/*.js"
    // ], [ "scripts" ]);
});