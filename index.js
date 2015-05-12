var BrowserWindow = require('browser-window')
  , path = require('path')

var name = 'Paycoin'
var index = 'file://' + path.join(__dirname, 'views', 'index.html')

var app = require('app')
app.on('ready', setup)
app.on('window-all-closed', function() {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

var mainWindow

function setup() {
  mainWindow = new BrowserWindow({
    'width': 960
  , 'height': 650
  , 'min-height': 650
  , 'min-width': 960
  , 'center': true
  , 'title': name
  })

  mainWindow.loadUrl(index)

  mainWindow.on('closed', function() {
    mainWindow = null
  })
}
