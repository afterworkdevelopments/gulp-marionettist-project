# gulp-marionetist-project

## Usage

#### Install

```
  npm install gulp-marionetist-project --save
```

## Example: Gulpfile.coffee

```coffeescript
gulp                   = require("gulp")
gutil                  = require("gulp-util")
gulpMarionetistProject = require('gulp-marionetist-project')

gulp.task 'gulp_marionetist_project', ()->
  gulpMarionetistProject()


gulp.task "default", ["gulp_marionetist_project"]
```

Note: make sure to install `npm install coffee-script --save` so you can use the Gulpfile.coffee



## Project dependencies

```
  npm install coffee-script --save
  npm install gulp --save
  npm install gulp-util --save
  npm install jquery --save
  npm install i18next-client --save
  npm install underscore --save
  npm install backbone --save
  npm install backbone-associations --save
  npm install backbone.marionette --save
  npm install marionetist --save
```

## Options

### sass

`opts.sass.src`

Type: `String` Default: `./src/stylesheets`

Source Directory

`opts.sass.dest`

Type: `String` Default: `./www/stylesheets`

Destination folder

`opts.sass.options`

Type: `Object` Default: {noCache: true, compass: true, bundleExec: false}

Plugin [gulp-ruby-sass](https://github.com/sindresorhus/gulp-ruby-sass) options


### pathmodify

`opts.pathmodify.dir`

Type: `String` Default: `/#{process.cwd()}/src/javascripts/#{pkgName}`

Source Directory

`opts.pathmodify.name`

Type: `String` Default: `#{pkgName}`

Name be used while requiring a file, the default value its from the name property of your package.json

For more info [pathmodify](https://github.com/jmm/pathmodify)


### browserify

`opts.browserify.dest`

Type: `String` Default: `./src/javascripts`

Destination folder

`opts.browserify.outputName`

Type: `String` Default: `application.js`

`opts.browserify.options`

Type: `Object` Default: {entries:  "./src/javascripts/application.coffee", extensions: [".coffee",".css", ".hamlc"], debug: true, paths: ['./node_modules','./src/javscripts']}

Plugin [browserify](http://browserify.org) options


### images

`opts.images.src`

Type: `String` Default: `./src/images`

Source Directory

`opts.images.dest`

Type: `String` Default: `./www/images`

Destination folder

`opts.images.options`

Type: `Object` Default: {}

Just copies the files of src folder to dest folder


### multimedia

`opts.multimedia.src`

Type: `String` Default: `./src/multimedia`

Source Directory

`opts.multimedia.dest`

Type: `String` Default: `./www/multimedia`

Destination folder

`opts.multimedia.options`

Type: `Object` Default: {}

Just copies the files of src folder to dest folder


### fonts

`opts.fonts.src`

Type: `String` Default: `./src/fonts`

Source Directory

`opts.fonts.dest`

Type: `String` Default: `./www/fonts`

Destination folder

`opts.fonts.options`

Type: `Object` Default: {}

Just copies the files of src folder to dest folder


### uglify

`opts.uglify.options`

Type: `Object` Default: {}

Plugin [gulp-uglify](https://github.com/terinjokes/gulp-uglify) options


### minifyCss

`opts.minifyCss.options`

Type: `Object` Default: {compatibility: 'ie8'}

Plugin [gulp-minify-css](https://github.com/murphydanger/gulp-minify-css) options

### haml

`opts.haml.src`

Type: `String` Default: `./src/haml/**/*.haml`

Source Directory

`opts.haml.dest`

Type: `String` Default: `./www`

Destination folder

`opts.haml.options`

Type: `Object` Default: {}

Plugin [gulp-haml](https://github.com/stevelacy/gulp-haml) options


### hamlc

`opts.hamlc.src`

Type: `String` Default: `./src/javascripts/**/**/**/**/*.hamlc`

Source Directory

`opts.hamlc.dest`

Type: `String` Default: `./www/javascripts`

Destination folder

`opts.hamlc.outputName`

Type: `String` Default: `templates.js`

`opts.hamlc.options`

Type: `Object` Default: {compile: {includePath: true, pathRelativeTo: "./src/javascripts/#{pkgName}"} }

Plugin [gulp-haml-coffee-compile](https://github.com/emilioforrer/gulp-haml-coffee-compile) options


### browsersync

`opts.browsersync.options`

Type: `Object` Default: {open: false, server: { baseDir: [www] }, port: 8000  }

Plugin [browsersync](http://www.browsersync.io/) options


## **Copyright**

Copyright (c) 2015 Emilio Forrer. See LICENSE.txt for further details.
