module.exports = window.App = App

var EE = require('events').EventEmitter
  , inherits = require('inherits')
  , fs = require('fs')
  , bitcoin = require('./lib/bitcoin')
  , remote = require('remote')
  , BrowserWindow = remote.require('browser-window')
  , config = require('./lib/config')
  , createElement = require('virtual-dom/create-element')
  , diff = require('virtual-dom/diff')
  , h = require('virtual-dom/h')
  , patch = require('virtual-dom/patch')
  , delegate = require('delegate-dom')
  , dom = require('./lib/dom')
  , debug = require('bows')('paycoin:app')

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

  var nav = require('./lib/nav')(this)
  nav.setup()

  var sels = '#navigation a, #navigation a span, #navigation a i, ' +
    '#nav a, #nav a .inner, #nav a .inner i'
  delegate.on(el, sels, 'click', function(e) {
    e.preventDefault()
    var a = getParentA(e.target)
    var href = a.getAttribute('href')
    debug('nav change: href=%s', href)
    if (self.activeNav === href) return false
    if (self.activeNavNode)
      self.activeNavNode.classList.remove('active')
    if (a.parentNode) {
      self.activeNavNode = a.parentNode
      self.activeNavNode.classList.add('active')
    }

    self.emit('nav', href)
    return false
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
    self.activeNavNode = document.querySelector('#navigation .active')
    self.checkBlockHeight()
  })

  function render() {
    var newTree = self.render()
    var patches = diff(tree, newTree)
    rootNode = patch(rootNode, patches)
    tree = newTree
  }

  self.on('render', render)

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

function getParentA(target, idx) {
  idx = idx || 0
  if (idx > 5) return null
  var tag = target.tagName
  var a
  if (tag === 'A')
    return target

  return getParentA(target.parentNode, idx + 1)
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
  return h('.content.h-full', [d])
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
    setTimeout(function() {
      self.connect()
    }, 5000)
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
  this.client.listAccounts(function(err, wallets) {
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
  debug('checking block height')
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
    debug('blocks: %d', blocks)
    debug('best height: %d', bestHeight)
    if (blocks < bestHeight) {
      var percentage = Math.round((blocks / bestHeight) * 100)
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
