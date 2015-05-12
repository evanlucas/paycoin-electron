var BrowserWindow = require('browser-window')
  , path = require('path')

var name = 'Paycoin'
var index = 'file://' + path.join(__dirname, 'views', 'index.html')

var app = require('app')
app.on('ready', setup)

var mainWindow

function setup() {
  mainWindow = new BrowserWindow({
    width: 900
  , height: 600
  , title: name
  })

  mainWindow.loadUrl(index)

  mainWindow.on('closed', function() {
    mainWindow = null
  })
}
