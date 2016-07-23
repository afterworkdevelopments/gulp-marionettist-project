var browserSync, browserify, buffer, changed, coffeeify, concat, config, cssImport, debowerify, fs, gulp, gulpIf, gutil, haml, hamlc, merge, path, pathmodify, plumber, sass, source, sourcemaps, uglify, watch, watchify;

gulp = require("gulp");

changed = require("gulp-changed");

uglify = require('gulp-uglify');

gulpIf = require('gulp-if');

plumber = require("gulp-plumber");

sass = require("gulp-sass");

cssImport = require("gulp-cssimport");

sourcemaps = require('gulp-sourcemaps');

gutil = require("gulp-util");

haml = require("gulp-haml");

hamlc = require("gulp-haml-coffee-compile");

concat = require('gulp-concat');

watch = require('gulp-watch');

browserSync = require("browser-sync");

browserify = require("browserify");

watchify = require("watchify");

coffeeify = require("coffeeify");

debowerify = require("debowerify");

source = require("vinyl-source-stream");

pathmodify = require("pathmodify");

buffer = require('vinyl-buffer');

merge = require("merge");

fs = require("fs-extra");

path = require("path");

config = require("../config");

module.exports = function(options, autostart) {
  var audiosPath, coffeePath, env, error, error1, fontsPath, hamlPath, imagePath, pkg, pkgName, pkgNamePath, root, sassPath, settings;
  if (options == null) {
    options = {};
  }
  if (autostart == null) {
    autostart = true;
  }
  env = process.env.NODE_ENV || "development";
  console.log("ENVIRONMENT: " + env);
  root = path.resolve(__dirname, "../");
  settings = merge.recursive(config, options);
  pkgName = "demo";
  try {
    pkg = require("/" + (process.cwd()) + "/package.json");
    if ((pkg.name != null) && pkg.name !== "") {
      pkgName = pkg.name;
    }
  } catch (error1) {
    error = error1;
    console.log("No package.json");
  }
  this.replaceGlobPatterns = function(str) {
    return str.toString().split("/**").join("").split("/*").join("").split("*").join("").replace(/\.[^\/.]+$/, '');
  };
  sassPath = this.replaceGlobPatterns(settings.sass.src);
  imagePath = this.replaceGlobPatterns(settings.images.src);
  audiosPath = this.replaceGlobPatterns(settings.multimedia.src);
  fontsPath = this.replaceGlobPatterns(settings.fonts.src);
  hamlPath = this.replaceGlobPatterns(settings.haml.src);
  coffeePath = this.replaceGlobPatterns(settings.coffee.src);
  pkgNamePath = "./src/javascripts/" + pkgName;
  this.tasks = {
    setup: function() {
      var data;
      console.log("Running setup task");
      fs.mkdirpSync(imagePath);
      fs.mkdirpSync(sassPath);
      fs.mkdirpSync(audiosPath);
      fs.mkdirpSync(fontsPath);
      fs.mkdirpSync(hamlPath);
      fs.mkdirpSync(coffeePath);
      fs.mkdirpSync(pkgNamePath);
      fs.mkdirpSync(pkgNamePath + "/locales");
      if (!fs.existsSync(settings.browserify.options.entries)) {
        data = fs.readFileSync(root + "/lib/templates/javascripts/application.coffee", "utf8");
        if (pkgName !== "demo") {
          data = data.toString().replace("demo/", pkgName + "/");
        }
        fs.writeFileSync(settings.browserify.options.entries, data, {
          flags: 'wx'
        }, function(err) {});
        if (!fs.existsSync(sassPath + "/application.sass")) {
          data = fs.readFileSync(root + "/lib/templates/stylesheets/application.sass");
          fs.writeFileSync(sassPath + "/application.sass", data, {
            flags: 'wx'
          }, function(err) {});
        }
        if (!fs.existsSync(hamlPath + "/index.haml")) {
          data = fs.readFileSync(root + "/lib/templates/haml/index.haml");
          fs.writeFileSync(hamlPath + "/index.haml", data, {
            flags: 'wx'
          }, function(err) {});
        }
        if (!fs.existsSync(pkgNamePath + "/locales/config.coffee")) {
          data = fs.readFileSync(root + "/lib/templates/javascripts/demo/locales/config.coffee", "utf8");
          fs.writeFileSync(pkgNamePath + "/locales/config.coffee", data, {
            flags: 'wx'
          }, function(err) {});
        }
        if (!fs.existsSync(pkgNamePath + "/locales/en.coffee", "utf8")) {
          data = fs.readFileSync(root + "/lib/templates/javascripts/demo/locales/en.coffee", "utf8");
          fs.writeFileSync(pkgNamePath + "/locales/en.coffee", data, {
            flags: 'wx'
          }, function(err) {});
        }
        if (!fs.existsSync(pkgNamePath + "/locales/es.coffee")) {
          data = fs.readFileSync(root + "/lib/templates/javascripts/demo/locales/es.coffee", "utf8");
          fs.writeFileSync(pkgNamePath + "/locales/es.coffee", data, {
            flags: 'wx'
          }, function(err) {});
        }
        if (!fs.existsSync(pkgNamePath + "/application.coffee")) {
          data = fs.readFileSync(root + "/lib/templates/javascripts/demo/application.coffee", "utf8");
          if (pkgName !== "demo") {
            data = data.toString().replace("demo/", pkgName + "/");
          }
          return fs.writeFileSync(pkgNamePath + "/application.coffee", data, {
            flags: 'wx'
          }, function(err) {});
        }
      }
    },
    fonts: function() {
      var format, i, len, ref, results;
      console.log("Running fonts task");
      if (settings.fonts.options.fontAwesome === true) {
        gulp.src('node_modules/font-awesome/fonts/fontawesome-webfont.*').pipe(gulp.dest(settings.paths.fonts.dest));
      }
      ref = settings.fonts.options.formats.split(",");
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        format = ref[i];
        results.push(gulp.src(settings.paths.fonts.src + ("." + (format.trim()))).pipe(gulp.dest(settings.paths.fonts.dest)));
      }
      return results;
    },
    multimedia: function() {
      console.log("Running multimedia Task");
      return gulp.src(settings.multimedia.src).pipe(gulp.dest(settings.multimedia.dest));
    },
    images: function() {
      console.log("Running images task");
      return gulp.src(settings.images.src).pipe(gulp.dest(settings.images.dest));
    },
    sass: function() {
      console.log("Running sass task");
      if (env === "production") {
        settings.sass.options.outputStyle = 'compressed';
      }
      return gulp.src(settings.sass.src).pipe(sourcemaps.init()).pipe(sass(settings.sass.options).on('error', sass.logError)).pipe(cssImport()).pipe(sourcemaps.write()).pipe(gulp.dest(settings.sass.dest)).pipe(browserSync.reload({
        stream: true
      }));
    },
    browserify: function() {
      var b, bundle;
      console.log("Running browserify task");
      b = watchify(browserify(settings.browserify.options)).on("error", gutil.log);
      b.plugin(pathmodify, {
        mods: [pathmodify.mod.dir(settings.pathmodify.name, settings.pathmodify.dir)]
      });
      b.transform(coffeeify);
      b.transform(debowerify);
      bundle = function() {
        return b.bundle().on("error", gutil.log).pipe(source(settings.browserify.outputName)).pipe(buffer()).pipe(gulpIf(env === "production", uglify(settings.uglify.options))).pipe(gulp.dest(settings.browserify.dest)).pipe(browserSync.reload({
          stream: true
        }));
      };
      b.on("update", bundle);
      b.on("log", gutil.log);
      return bundle();
    },
    webserver: function() {
      return gulp.src(settings.paths.www).pipe(server(settings.server.options));
    },
    browsersync: function() {
      console.log("Running browsersync Task");
      return browserSync(settings.browsersync.options);
    },
    hamlc: function() {
      gulp.src(settings.hamlc.src).pipe(hamlc(settings.hamlc.options).on("error", gutil.log)).pipe(concat(settings.hamlc.outputName)).pipe(gulpIf(env === "production", uglify(settings.uglify.options))).pipe(browserSync.reload({
        stream: true
      })).pipe(gulp.dest(settings.hamlc.dest));
      return console.log("Running hamlc task");
    },
    haml: function() {
      console.log("Running haml task");
      return gulp.src(settings.paths.haml.src).pipe(haml(settings.haml.options).on("error", gutil.log)).pipe(browserSync.reload({
        stream: true
      })).pipe(gulp.dest(settings.paths.haml.dest));
    },
    watchfiles: function() {
      console.log("Running watchfiles task");
      gulp.watch(settings.sass.src + "/**/**/**/**/*.sass", this.sass);
      gulp.watch(settings.hamlc.src, this.hamlc);
      return gulp.watch(settings.paths.haml.src, this.haml);
    }
  };
  if (autostart) {
    this.tasks.setup();
    this.tasks.multimedia();
    this.tasks.images();
    this.tasks.fonts();
    this.tasks.sass();
    this.tasks.browserify();
    this.tasks.browsersync();
    this.tasks.hamlc();
    this.tasks.haml();
    this.tasks.watchfiles();
  }
  return this;
};
