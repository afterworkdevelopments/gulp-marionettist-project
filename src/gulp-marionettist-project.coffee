gulp        = require("gulp")
changed     = require("gulp-changed")
uglify      = require('gulp-uglify')
gulpIf      = require('gulp-if')
plumber     = require("gulp-plumber")
sass        = require("gulp-sass")
gutil       = require("gulp-util")
haml        = require("gulp-haml")
hamlc       = require("gulp-haml-coffee-compile")
concat      = require('gulp-concat')
watch       = require('gulp-watch')

browserSync = require("browser-sync")

browserify  = require("browserify")
watchify    = require("watchify")
coffeeify   = require("coffeeify")
debowerify  = require("debowerify")
source      = require("vinyl-source-stream")
pathmodify  = require("pathmodify")
buffer      = require('vinyl-buffer')


merge       = require("merge")
fs          = require("fs-extra")
path        = require("path")

config      = require("../config")

module.exports = (options = {}, autostart = true)->
  env = process.env.NODE_ENV || "development"
  console.log "ENVIRONMENT: #{env}"
  root = path.resolve(__dirname, "../")
  settings = merge.recursive(config, options)
  pkgName = "demo"
  try
    pkg = require("/#{process.cwd()}/package.json")
    if pkg.name? and pkg.name != ""
      pkgName = pkg.name
  catch error
    console.log "No package.json"
  @replaceGlobPatterns = (str)->
    str.toString().split("/**").join("").split("/*").join("").split("*").join("").replace( /\.[^/.]+$/, '')
  sassPath   = @replaceGlobPatterns(settings.sass.src)
  imagePath  = @replaceGlobPatterns(settings.images.src)
  audiosPath = @replaceGlobPatterns(settings.multimedia.src)
  fontsPath  = @replaceGlobPatterns(settings.fonts.src)
  hamlPath   = @replaceGlobPatterns(settings.haml.src)
  coffeePath = @replaceGlobPatterns(settings.coffee.src)
  pkgNamePath = "./src/javascripts/#{pkgName}"
  @tasks =
    setup: ()->
      console.log "Running setup task"

      fs.mkdirpSync(imagePath)
      fs.mkdirpSync(sassPath)
      fs.mkdirpSync(audiosPath)
      fs.mkdirpSync(fontsPath)
      fs.mkdirpSync(hamlPath)
      fs.mkdirpSync(coffeePath)
      fs.mkdirpSync(pkgNamePath)
      fs.mkdirpSync("#{pkgNamePath}/locales")

      unless fs.existsSync(settings.browserify.options.entries)
        data = fs.readFileSync("#{root}/lib/templates/javascripts/application.coffee", "utf8")
        data = data.toString().replace("demo/", "#{pkgName}/") if pkgName != "demo"
        fs.writeFileSync settings.browserify.options.entries, data, { flags: 'wx' },  (err) ->

        unless fs.existsSync("#{sassPath}/application.sass")
          data = fs.readFileSync("#{root}/lib/templates/stylesheets/application.sass")
          fs.writeFileSync "#{sassPath}/application.sass", data, { flags: 'wx' },  (err) ->
        unless fs.existsSync("#{hamlPath}/index.haml")
          data = fs.readFileSync("#{root}/lib/templates/haml/index.haml")
          fs.writeFileSync "#{hamlPath}/index.haml", data, { flags: 'wx' },  (err) ->

        unless fs.existsSync("#{pkgNamePath}/locales/config.coffee")
          data = fs.readFileSync("#{root}/lib/templates/javascripts/demo/locales/config.coffee", "utf8")
          fs.writeFileSync "#{pkgNamePath}/locales/config.coffee", data, { flags: 'wx' },  (err) ->
        unless fs.existsSync("#{pkgNamePath}/locales/en.coffee", "utf8")
          data = fs.readFileSync("#{root}/lib/templates/javascripts/demo/locales/en.coffee", "utf8")
          fs.writeFileSync "#{pkgNamePath}/locales/en.coffee", data, { flags: 'wx' },  (err) ->
        unless fs.existsSync("#{pkgNamePath}/locales/es.coffee")
          data = fs.readFileSync("#{root}/lib/templates/javascripts/demo/locales/es.coffee", "utf8")
          fs.writeFileSync "#{pkgNamePath}/locales/es.coffee", data, { flags: 'wx' },  (err) ->


        unless fs.existsSync("#{pkgNamePath}/application.coffee")
          data = fs.readFileSync("#{root}/lib/templates/javascripts/demo/application.coffee", "utf8")
          data = data.toString().replace("demo/", "#{pkgName}/") if pkgName != "demo"
          fs.writeFileSync "#{pkgNamePath}/application.coffee", data, { flags: 'wx' },  (err) ->




    fonts: ()->
      console.log "Running fonts task"
      if settings.fonts.options.fontAwesome is true
        gulp.src('node_modules/font-awesome/fonts/fontawesome-webfont.*')
          .pipe(gulp.dest(settings.paths.fonts.dest))
      for format in settings.fonts.options.formats.split(",")
        gulp.src(settings.paths.fonts.src+".#{format.trim()}").pipe(gulp.dest(settings.paths.fonts.dest))


    multimedia: ()->
      console.log "Running multimedia Task"
      gulp.src(settings.multimedia.src)
        #.pipe(changed(settings.images.dest))
        .pipe(gulp.dest(settings.multimedia.dest))


    images: ()->
      console.log "Running images task"
      gulp.src(settings.images.src)
        #.pipe(changed(settings.images.dest))
        .pipe(gulp.dest(settings.images.dest))


    sass: ()->
      console.log "Running sass task"
      settings.sass.options.outputStyle = 'compressed' if env == "production"
      gulp.src(settings.sass.src)
        .pipe(sass(settings.sass.options).on('error', sass.logError))
        .pipe(gulp.dest(settings.sass.dest))
        .pipe(browserSync.reload({stream: true}))

    browserify: ()->
      console.log "Running browserify task"
      b = watchify(browserify(settings.browserify.options)).on("error", gutil.log)
      b.plugin(pathmodify, {mods: [
        pathmodify.mod.dir(settings.pathmodify.name, settings.pathmodify.dir)
      ]})
      b.transform(coffeeify)
      b.transform(debowerify)
      bundle = ()->
        b.bundle()
        .on("error", gutil.log)
        .pipe(source(settings.browserify.outputName))
        .pipe(buffer())
        .pipe(gulpIf((env == "production"),uglify(settings.uglify.options)))
        .pipe(gulp.dest(settings.browserify.dest))
        .pipe(browserSync.reload({stream: true}))

      b.on("update", bundle)
      b.on("log", gutil.log)
      bundle()




    webserver: ()->
      gulp.src(settings.paths.www).pipe(server(settings.server.options))

    browsersync: ()->
      console.log "Running browsersync Task"
      browserSync(settings.browsersync.options)

    hamlc: ()->
      gulp.src(settings.hamlc.src)
        .pipe(hamlc(settings.hamlc.options).on("error", gutil.log))
        .pipe(concat(settings.hamlc.outputName))
        .pipe(gulpIf((env == "production"),uglify(settings.uglify.options)))
        .pipe(browserSync.reload({stream: true}))
        .pipe(gulp.dest(settings.hamlc.dest))
        console.log "Running hamlc task"



    haml: ()->
      console.log "Running haml task"
      gulp.src(settings.paths.haml.src)
        .pipe(haml(settings.haml.options).on("error", gutil.log))
        .pipe(browserSync.reload({stream: true}))
        .pipe(gulp.dest(settings.paths.haml.dest))


    watchfiles: ()->
      console.log "Running watchfiles task"
      gulp.watch(settings.sass.src+"/**/**/**/**/*.sass", @sass)
      gulp.watch(settings.hamlc.src, @hamlc )
      gulp.watch(settings.paths.haml.src, @haml)

  if autostart
    @tasks.setup()
    @tasks.multimedia()
    @tasks.images()
    @tasks.fonts()
    @tasks.sass()
    @tasks.browserify()
    @tasks.browsersync()
    @tasks.hamlc()
    @tasks.haml()
    @tasks.watchfiles()

  return @
# npm install browser-sync browserify coffee-script coffeeify debowerify fs-extra gulp gulp-changed gulp-coffee gulp-concat gulp-haml gulp-haml-coffee-compile gulp-if gulp-plumber gulp-sass gulp-uglify gulp-util gulp-watch marionettist merge pathmodify source-map vinyl-buffer vinyl-source-stream watchify --save
