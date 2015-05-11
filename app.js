module.exports = window.App = App

var EE = require('events').EventEmitter
  , inherits = require('inherits')
  , fs = require('fs')
  , bitcoin = require('./lib/bitcoin')
  , remote = require('remote')
  , Menu = remote.require('menu')
  , MenuItem = remote.require('menu-item')
  , BrowserWindow = remote.require('browser-window')


inherits(App, EE)

function App(el, currentWindow) {
  if (!(this instanceof App))
    return new App(el)

  var self = this

  self.currentWindow = currentWindow
  if (localStorage.paycoin) {
    delete localStorage.paycoin
  }
  if (!localStorage.paycoin) {
    this.getconfig()
  } else {
    self.connect(localStorage.paycoin)
  }

  this.infoTimeout = null

  this.setupMenu()
}

App.prototype.setupMenu = function setupMenu() {
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
      ]
    }
  ]

  this.menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(this.menu)
}

App.prototype.isFocused = function isFocused() {
  if (this.currentWindow) {
    return this.currentWindow.isFocused()
  }

  return true
}

App.prototype.getconfig = function getconfig() {
  var data = fs.readFileSync('/Users/i0rn/Library/Application Support/Paycoin/paycoin.conf', 'utf8')
  var config = parseConfig(data)
  localStorage.paycoin = config
  this.connect(config)
}

App.prototype.connect = function connect(opts) {
  var self = this
  this.client = new bitcoin(opts)
  this.getInfo(function(err) {
    if (err) throw err
    self.loopInfo()
  })
}

App.prototype.getInfo = function(cb) {
  var self = this
  this.client.getInfo(function(err, info) {
    if (err) return cb(err)
    self.populateInfo(info)
    cb && cb()
  })
}

App.prototype.loopInfo = function loopInfo() {
  var self = this
  if (this.infoTimeout) {
    clearTimeout(this.infoTimeout)
    this.infoTimeout = null
  }

  this.infoTimeout = setTimeout(function() {
    self.getInfo(function(err) {
      if (err) throw err
      self.loopInfo()
    })
  }, 1000 * 5)
}

App.prototype.populateInfo = function populateInfo(info) {
  console.log(JSON.stringify(info))
  this.info = info
  var peers = info.connections
  var bal = info.balance
  var stake = +(info.stake || 0).toFixed(8)
  $('.js-connected-peers').attr('data-original-title', peers + ' peers')
  $('.js-balance').html(bal)
  $('.js-stake-amount').html(stake)
}

function parseConfig(data) {
  var out = data.split('\n').filter(function(item) {
    return item[0] !== '#'
  }).map(function(item) {
    var splits = item.split('=')
    return [splits[0], splits[1]]
  })

  if (!out.length) return {}
  return out.reduce(function(set, item) {
    set[item[0]] = item[1]
    return set
  }, {})
}
