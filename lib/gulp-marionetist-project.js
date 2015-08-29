var browserSync, browserify, buffer, changed, coffeeify, concat, config, cssImport, debowerify, fs, gulp, gulpIf, gutil, haml, hamlc, merge, minifyCss, path, pathmodify, plumber, sass, server, source, uglify, watch, watchify;

gulp = require("gulp");

changed = require("gulp-changed");

config = require("../config");

server = require("gulp-server-livereload");

browserSync = require("browser-sync");

plumber = require("gulp-plumber");

sass = require("gulp-ruby-sass");

browserify = require("browserify");

watchify = require("watchify");

coffeeify = require("coffeeify");

debowerify = require("debowerify");

source = require("vinyl-source-stream");

gutil = require("gulp-util");

haml = require("gulp-haml");

cssImport = require("gulp-cssimport");

hamlc = require("gulp-haml-coffee-compile");

concat = require('gulp-concat');

pathmodify = require("pathmodify");

watch = require('gulp-watch');

merge = require("merge");

fs = require("fs-extra");

path = require("path");

minifyCss = require('gulp-minify-css');

uglify = require('gulp-uglify');

gulpIf = require('gulp-if');

buffer = require('vinyl-buffer');

module.exports = function(options) {
  var audiosPath, coffeePath, env, error, fontsPath, hamlPath, imagePath, pkg, pkgName, pkgNamePath, replaceGlobPatterns, root, sassPath, settings;
  if (options == null) {
    options = {};
  }
  env = process.env.NODE_ENV || "development";
  console.log("ENVIRONMENT: " + env);
  root = path.resolve(__dirname, "../");
  settings = merge(config, options);
  pkgName = "demo";
  try {
    pkg = require("/" + (process.cwd()) + "/package.json");
    if ((pkg.name != null) && pkg.name !== "") {
      pkgName = pkg.name;
    }
  } catch (_error) {
    error = _error;
    console.log("No package.json");
  }
  replaceGlobPatterns = function(str) {
    return str.toString().replace("/**", "").replace("/*", "").replace(/\.[^\/.]+$/, '');
  };
  sassPath = replaceGlobPatterns(settings.sass.src);
  imagePath = replaceGlobPatterns(settings.images.src);
  audiosPath = replaceGlobPatterns(settings.multimedia.src);
  fontsPath = replaceGlobPatterns(settings.fonts.src);
  hamlPath = replaceGlobPatterns(settings.haml.src);
  coffeePath = replaceGlobPatterns(settings.coffee.src);
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
      console.log("Running fonts task");
      gulp.src('node_modules/font-awesome/fonts/fontawesome-webfont.*').pipe(gulp.dest(settings.paths.fonts.src));
      return gulp.src(settings.paths.fonts.src).pipe(gulp.dest(settings.paths.fonts.dest));
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
      return sass(settings.sass.src, settings.sass.options).on("error", gutil.log).pipe(plumber()).pipe(cssImport()).pipe(gulpIf(env === "production", minifyCss(settings.minifyCss.options))).pipe(gulp.dest(settings.sass.dest)).pipe(browserSync.reload({
        stream: true
      }));
    },
    browserify: function() {
      var b, bundle;
      console.log("Running browserify task");
      b = watchify(browserify(settings.browserify.options)).on("error", gutil.log);
      b.plugin(pathmodify(), {
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
  this.tasks.setup();
  this.tasks.multimedia();
  this.tasks.images();
  this.tasks.fonts();
  this.tasks.sass();
  this.tasks.browserify();
  this.tasks.browsersync();
  this.tasks.hamlc();
  this.tasks.haml();
  return this.tasks.watchfiles();
};
