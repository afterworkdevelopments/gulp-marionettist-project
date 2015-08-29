src               = "src"
www               = "www"

paths =
  www: www
  sass:
    src: "./#{src}/stylesheets"
    dest: "./#{www}/stylesheets"
  coffee:
    src: "./#{src}/javascripts"
    dest: "./#{www}/javascripts"
  images:
    src: "./#{src}/images/**/*"
    dest: "./#{www}/images"
  multimedia:
    src: "./#{src}/multimedia/**/*"
    dest: "./#{www}/multimedia"
  haml:
    src: "./#{src}/haml/**/*.haml"
    dest: "./#{www}"
  fonts:
    src: "./#{src}/fonts/**/*"
    dest: "./#{www}/fonts"
  hamlc:
    src: "./#{src}/javascripts/**/**/**/**/*.hamlc"
    dest: "./#{www}/javascripts"

pkgName = "demo"
try
  pkg = require("/#{process.cwd()}/package.json")
  if pkg.name? and pkg.name != ""
    pkgName = pkg.name
catch error
  console.log "No package.json"

module.exports =
  paths: paths
  sass:
    src:  paths.sass.src
    dest: paths.sass.dest
    options:
      noCache: true
      compass: true
      bundleExec: false

  pathmodify:
    name: "#{pkgName}"
    dir: "/#{process.cwd()}/src/javascripts/#{pkgName}"

  browserify:
    dest:  paths.coffee.dest
    outputName: "application.js"
    options:
      entries:    "#{paths.coffee.src}/application.coffee"
      extensions: [".coffee",".css", ".hamlc"]
      debug: true
      paths: ['./node_modules','./src/javscripts']

  images:
    src:  paths.images.src
    dest: paths.images.dest
    options: {}

  multimedia:
    src:  paths.multimedia.src
    dest: paths.multimedia.dest
    options: {}

  fonts:
    src:  paths.fonts.src
    dest: paths.fonts.dest

  coffee:
    src:  paths.coffee.src
    dest: paths.coffee.dest

  uglify:
    options: {}

  minifyCss:
    options:
      compatibility: 'ie8'

  haml:
    src:  paths.haml.src
    dest: paths.haml.dest
    options: {}

  hamlc:
    src:  paths.hamlc.src
    dest: paths.hamlc.dest
    outputName: "templates.js"
    options:
      compile:
        includePath: true
        pathRelativeTo: "./src/javascripts/#{pkgName}"

  server:
    options:
      livereload: true,
      directoryListing:
        enable: false,
        path: www
      open: false,
      port: 8000

  connect:
    options:
      root: www
      livereload: true
      port: 8000
      open: false

  browsersync:
    options:
      open: false
      server:
        baseDir: [www]
      port: 8000
      # files: [
      #   "#{paths.sass.dest}/*.css",
      #   "#{paths.coffee.dest}/*.js",
      #   "#{paths.images.dest}**",
      #   "#{paths.fonts.dest}*"
      # ]
