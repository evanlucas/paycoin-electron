module.exports = window.App = App

var EE = require('events').EventEmitter
  , inherits = require('inherits')
  , fs = require('fs')
  , bitcoin = require('./lib/bitcoin')
  , remote = require('remote')
  , Menu = remote.require('menu')
  , MenuItem = remote.require('menu-item')
  , BrowserWindow = remote.require('browser-window')
  , config = require('./lib/config')
  , createElement = require('virtual-dom/create-element')
  , diff = require('virtual-dom/diff')
  , h = require('virtual-dom/h')
  , patch = require('virtual-dom/patch')
  , delegate = require('delegate-dom')
  , dom = require('./lib/dom')

// Views

var Wallet = require('./lib/elements/wallet')
  , Overview = require('./lib/elements/overview')
  , History = require('./lib/elements/history')
  , Send = require('./lib/elements/send')
  , Staking = require('./lib/elements/staking')
  , Settings = require('./lib/elements/settings')

inherits(App, EE)

function App(el, currentWindow) {
  if (!(this instanceof App))
    return new App(el)

  this.el = el
  var self = this
  self._notifications = 0
  self.currentWindow = currentWindow

  if (localStorage.paycoin) {
    delete localStorage.paycoin
  }


  var sels = '#navigation a, #navigation a span, #navigation a i'
  delegate.on(el, sels, 'click', function(e) {
    var tag = e.target.tagName
    var href
    if (tag === 'A') {
      href = e.target.getAttribute('href')
    } else {
      href = e.target.parentNode.getAttribute('href')
    }
    self.emit('nav-' + href.replace(/#/, ''), href)
  })

  self.data = {
    info: {
      connections: 0
    , blocks: 0
    , version: 0
    , protocolversion: 0
    , walletversion: 0
    , balance: 0
    , balanceUnconfirmed: 0
    , newmint: 0
    , stake: 0
    , moneysupply: 0
    , difficulty: 0
    , testnet: false
    , paytxfee: 0
    }
  , transactions: []
  , accounts: []
  , staking: []
  , settings: {}
  , sendResults: ''
  , bestPeerHeight: 0
  }

  self.connect()

  this.infoTimeout = null

  this.setupMenu()

  self.views = {
    wallet: new Wallet(self)
  , overview: new Overview(self)
  , history: new History(self)
  , send: new Send(self)
  , staking: new Staking(self)
  , settings: new Settings(self)
  }

  self.activeNav = '#overview'

  var tree, rootNode

  self.on('connect', function() {
    tree = self.render()
    rootNode = createElement(tree)
    el.querySelector('.app').appendChild(rootNode)
  })

  function render() {
    var newTree = self.render()
    var patches = diff(tree, newTree)
    rootNode = patch(rootNode, patches)
    tree = newTree
  }

  self.on('render', render)

  self.on('nav-overview', function(href) {
    self.activeNav = href
    self.getInfo(function(err) {
      render()
    })
  })

  self.on('nav-receive', function(href) {
    self.activeNav = href
    // fetch wallet
    self.getWallet(function(err) {
      render()
    })
  })

  self.on('nav-history', function(href) {
    self.activeNav = href
    self.client.getTransactions(function(err, txs) {
      txs = txs.sort(function(a, b) {
        return a.time < b.time
          ? 1
          : a.time > b.time
          ? -1
          : 0
      })
      self.data.transactions = txs
      render()
    })
  })

  self.on('nav-send', function(href) {
    self.activeNav = href
    render()
  })

  self.on('nav-staking', function(href) {
    self.activeNav = href
    self.client.getMinting(function(err, txs) {
      if (err) throw err
      self.data.staking = txs
      render()
    })
  })

  self.on('nav-settings', function(href) {
    self.activeNav = href
    render()
  })

  self.on('getinfo', function() {
    self.checkBlockHeight()
    render()
  })

  self.on('sendfunds', function(data) {
    self.client.sendFunds(data, function(err, out) {
      if (err) {
        // show error notification
        self.alert('Error sending funds', err.message)
        self.data.sendResults = err && err.message ? err : err
      } else {
        self.alert( 'Send Successful'
                  , `Sent ${data.amount} to ${data.payee} (${out})`
                  )
        self.data.sendResults = 'success'
      }
      dom.clearInputs('form.send input[type=text]')
      document.querySelector('form.send button').disabled = false
      render()
    })
  })
}

App.prototype.render = function render() {
  var self = this
  var views = self.views
  var data = self.data
  var n = self.activeNav
  if (n === '#overview') {
    return wrap(views.overview.render(data.info))
  } else if (n === '#receive') {
    return wrap(views.wallet.render(data.info, data.accounts))
  } else if (n === '#history') {
    return wrap(views.history.render(data.transactions))
  } else if (n === '#send') {
    return wrap(views.send.render(data.info))
  } else if (n === '#staking') {
    return wrap(views.staking.render(data.staking))
  } else if (n === '#settings') {
    return wrap(views.settings.render(data.settings))
  }
}

function wrap(d) {
  return h('.content', [d])
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

  this.menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(this.menu)
}

App.prototype.isFocused = function isFocused() {
  if (this.currentWindow) {
    return this.currentWindow.isFocused()
  }

  return true
}

App.prototype.connect = function connect() {
  var self = this
  if (localStorage.paycoin) {
    self.client = new bitcoin(localStorage.paycoin)
    self.getInfo(function(err) {
      if (err) throw err
      self.emit('connect')
      self.loopInfo()
    })
  } else {
    config.read(function(err, conf) {
      if (err) throw err
      self.client = new bitcoin(conf)
      self.getInfo(function(err) {
        if (err) return self.error('getinfo', err)
        self.emit('connect')
        self.loopInfo()
      })
    })
  }
}

App.prototype.error = function error(cmd, err) {
  var self = this
  if (err.code === 'ECONNREFUSED') {
    // ask if daemon is running
    console.log('Connection Refused. Is the daemon running?')
    self.alert('Error connecting to paycoind', 'Is the daemon running?')
  }
}

App.prototype.getInfo = function getInfo(cb) {
  var self = this
  this.client.getInfo(function(err, info) {
    if (err) return cb(err)
    self.data.info = info
    cb && cb(null, info)
  })
}

App.prototype.getWallet = function getWallet(cb) {
  var self = this
  this.client.getAccounts(function(err, wallets) {
    if (err) return cb(err)
    self.data.accounts = wallets
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
      self.emit('getinfo')
      self.loopInfo()
    })
  }, 1000 * 5)
}

App.prototype.populateInfo = function populateInfo(info) {
  var self = this
  self.data.info = info
}

App.prototype.alert = function(title, msg) {
  new Notification(title, {
    body: msg
  })
}

App.prototype.checkBlockHeight = function checkBlockHeight() {
  var self = this
  self.client.getBlockInfo(function(err, bestHeight) {
    if (err) {
      console.log('error checking sync state: ' + err.message)
      return self.alert('Error checking sync state')
    }

    var ele = document.querySelector('.sync-status')
    self.data.bestPeerHeight = bestHeight
    var blocks = self.data.info.blocks
    var bar = ele.querySelector('.progress-bar')
    if (blocks < bestHeight) {
      var percentage = blocks / bestHeight
      bar.style.width = percentage + '%'
    } else {
      bar.style.width = '100%'
    }
    bestHeight = bestHeight < blocks
      ? blocks
      : bestHeight
    var e = document.querySelector('.block-height')
    e.textContent = `${blocks} / ${bestHeight} Blocks`
  })
}
