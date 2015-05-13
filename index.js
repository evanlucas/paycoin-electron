var BrowserWindow = require('browser-window')
  , path = require('path')
  , nopt = require('nopt')
  , knownOpts = { config: path }
  , shortHand = { c: ['--config'] }
  , parsed = nopt(knownOpts, shortHand)
  , Menu = require('menu')
  , MenuItem = require('menu-item')

var name = 'Paycoin'
var index = 'file://' + path.join(__dirname, 'views', 'index.html')

if (parsed.config) {
  process.env.XPY_CONFIG = parsed.config
}

var app = require('app')
app.on('ready', setup)
app.on('window-all-closed', function() {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

var mainWindow

function setup() {
  setupMenu()
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

  mainWindow.on('page-title-updated', function(e) {
    e.preventDefault()
  })
}

function setupMenu() {
  var template = [
    {
      label: 'Paycoin'
    , submenu: [
        {
          label: 'About'
        }
      , { type: 'separator' }
      , {
          label: 'Toggle DevTools'
        , accelerator: 'Alt+Command+I'
        , click: function() {
            BrowserWindow.getFocusedWindow().toggleDevTools()
          }
        }
      , {
          label: 'Quit'
        , accelerator: 'Command+Q'
        , click: function() { app.quit() }
        }
      ]
    }
  , {
      label: 'Edit'
    , submenu: [
        { label: 'Undo', accelerator: 'Command+Z', selector: 'undo:' }
      , { label: 'Redo', accelerator: 'Shift+Command+Z', selector: 'redo:' }
      , { type: 'separator' }
      , { label: 'Cut', accelerator: 'Command+X', selector: 'cut:' }
      , { label: 'Copy', accelerator: 'Command+C', selector: 'copy:' }
      , { label: 'Paste', accelerator: 'Command+V', selector: 'paste:' }
      ]
    }
  ]

  var menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}
