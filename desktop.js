var inherits = require('util').inherits
  , App = require('./app')
  , path = require('path')
  , remote = require('remote')
  , app = remote.require('app')
  , shell = require('shell')
  , BrowserWindow = remote.require('browser-window')
  , currentWindow = remote.getCurrentWindow()
  , bitcoin = require('bitcoin')
  , fs = require('fs')

module.exports = Desktop

inherits(Desktop, App)

function Desktop() {
  if (!(this instanceof Desktop))
    return new Desktop()

  App.call(this, document.body, currentWindow)
  var self = this

  this.on('openUrl', function(url) {
    shell.openExternal(url)
  })
}
