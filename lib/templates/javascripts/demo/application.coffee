window.$ = window.jQuery = require('jquery')
Marionettist = require("marionettist")

App = new Marionettist.Application()

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
