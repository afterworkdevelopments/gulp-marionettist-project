# gulp-marionettist-project

It's a gulp plugin that generates a project folder structure for [marionettist](https://github.com/afterworkdevelopments/marionettist) projects, mainly focused in hybrid mobile apps with cordova, but  it can be used for normal static SPA.

### Install

```
  npm install gulp-marionettist-project --save
```

## Example: Gulpfile.coffee

```coffeescript
gulp                   = require("gulp")
gutil                  = require("gulp-util")
gulpMarionettistProject = require('gulp-marionettist-project')

gulp.task 'gulp_marionettist_project', ()->
  gulpMarionettistProject()


gulp.task "default", ["gulp_marionettist_project"]
```

**Note:** make sure to install `npm install coffee-script --save` so you can use the Gulpfile.coffee

## Usage

Once you run `gulp` command it will create a folder structure, a template for your app, run a server (port: 8000), watch and compile SASS, HAML, Coffeescript, HAML-coffee and outputs the result in the `www` folder, ready to use with cordova.

**Note:**  if you want to minify the output, just pass the production environment to the gulp task `NODE_ENV=production gulp`

### Folder structure

```
src/
  fonts/ # files in here it will be copied to www/fonts
  haml/ # files (.haml) in here it will be compiled to HTML and copied to www/
    index.haml # template for cordova application
  images/ # files in here it will be copied to www/images
  multimedia/ # files in here it will be copied to www/multimedia
  javascript
    {packageName}/
      locales/ # a folder to store your i18next locales
        config.coffee # module to include the translations
        en.coffee # English translations
        es.coffee # Spanish translations
      application.coffe # browserify entry point for your application
    application.coffee # application main file to initialize your app
  stylesheets/
    application.sass # entry point for sass file import, etc
www/ # output directory for compiled files

```


## Project dependencies

```
npm install coffee-script --save
npm install gulp --save
npm install gulp-util --save
npm install jquery --save
npm install marionettist --save
```

## Options

### sass

`opts.sass.src`

Type: `String` Default: `./src/stylesheets/application.sass`

Source Directory

`opts.sass.dest`

Type: `String` Default: `./www/stylesheets`

Destination folder

`opts.sass.options`

Type: `Object` Default: {}

Plugin [gulp-sass](https://github.com/dlmanning/gulp-sass) options


### pathmodify

`opts.pathmodify.dir`

Type: `String` Default: `/#{process.cwd()}/src/javascripts/#{packageName}`

Source Directory

`opts.pathmodify.name`

Type: `String` Default: `#{packageName}`

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

Type: `String` Default: `./src/fonts/**/*`

Source Directory

`opts.fonts.dest`

Type: `String` Default: `./www/fonts`

Destination folder

`opts.fonts.options`

Type: `Object` Default: {fontAwesome: true,formats: "eot,svg,ttf,woff,woff2"}

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

Type: `Object` Default: {compile: {includePath: true, pathRelativeTo: "./src/javascripts/#{packageName}"} }

Plugin [gulp-haml-coffee-compile](https://github.com/emilioforrer/gulp-haml-coffee-compile) options


### browsersync

`opts.browsersync.options`

Type: `Object` Default: {open: false, server: { baseDir: [www] }, port: 8000  }

Plugin [browsersync](http://www.browsersync.io/) options


## **Copyright**

Copyright (c) 2015 Emilio Forrer. See LICENSE.txt for further details.
