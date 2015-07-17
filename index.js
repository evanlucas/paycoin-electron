var BrowserWindow = require('browser-window')
  , path = require('path')
  , nopt = require('nopt')
  , knownOpts = { conf: path
                , 'no-daemon': Boolean
                , debug: Boolean
                , printtoconsole: Boolean
                , datadir: path
                }
  , shortHand = { c: ['--conf']
                , n: ['--no-daemon']
                , p: ['--printtoconsole']
                , d: ['--datadir']
                , D: ['--debug']
                }
  , app = require('app')
  , Menu = require('menu')
  , MenuItem = require('menu-item')
  , config = require('./lib/config')

var name = 'Paycoin'
var index = 'file://' + path.join(__dirname, 'views', 'index.html')
var splashUrl = 'file://' +
  path.join(__dirname, 'lib', 'windows', 'loading.html')

app.on('ready', setup)

app.on('window-all-closed', function() {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

var daemon

var mainWindow, splash

function setup() {
  var parsed = nopt(knownOpts, shortHand)
  var opts = {
    debug: parsed.debug
  , printtoconsole: parsed.printtoconsole
  , conf: parsed.conf
  , datadir: parsed.datadir
  }

  if (opts.conf) {
    console.log('using', opts.conf)
    process.env.XPY_CONFIG = parsed.conf
    config.filepath = opts.conf
  }

  if (opts.datadir) {
    console.log('setting dir', opts.datadir)
    config.dir = opts.datadir
  }

  daemon = require('./lib/daemon')(opts)
  if (!parsed.daemon && process.platform === 'darwin') {
    daemon.start()
  }

  daemon.on('stopped', function() {
    app.quit()
  })

  app.on('before-quit', function() {
    if (daemon.running) {
      daemon.stop()
    }
  })
  // TODO(evanlucas) Add custom protocol handler
  // that will direct to the send page and pre-populate the fields

  // setup the menu
  setupMenu()

  // load the splash screen
  splash = new BrowserWindow({
    width: 400
  , height: 200
  , resizable: false
  , center: true
  , type: 'splash'
  , frame: false
  })
  splash.loadUrl(splashUrl)

  setTimeout(function() {
    splash.close()
  }, 5000)

  splash.on('close', function() {
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

    mainWindow.webContents.on('did-finish-load', function() {
      mainWindow.webContents.send('daemon-opts', opts)
    })
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
