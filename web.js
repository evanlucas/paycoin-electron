module.exports = Web

var inherits = require('inherits')
  , App = require('./app')

inherits(Web, App)

function Web() {
  if (!(this instanceof Web))
    return new Web()

  App.call(this, document.body)
  this.on('openUrl', function(url) {
    window.open(url)
  })
}

Web()
