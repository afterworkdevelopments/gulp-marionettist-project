window.$ = window.jQuery = require('jquery')
window._ = require("underscore")
Backbone = require("backbone")
BackboneAssociations = require("backbone-associations")
Backbone.$ = window.$
Marionetist = require("marionetist")

App = new Marionetist.Application()

window.App = App

App.I18n.init(require("./locales/config.coffee"))

App.addRegions
  wrapperRegion: '#wrapper-region'
  modalRegion: "#modal-region"

App.on "start", ->
  @startHistory
    pushState: false
    root: '/'


module.exports = App
