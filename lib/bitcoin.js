var bitcoin = require('bitcoin')
  , log = require('./log')

module.exports = window.bitcoin = Bitcoin

function Bitcoin(opts) {
  if (!(this instanceof Bitcoin))
    return new Bitcoin(opts)

  this.opts = opts
  log('opts ', opts)
  this.client = new bitcoin.Client({
    host: opts.rpchost || '127.0.0.1'
  , port: opts.rpcport || 8999
  , user: opts.rpcuser
  , pass: opts.rpcpassword
  , timeout: 1000 * 60
  })
}

Bitcoin.prototype.getInfo = function getInfo(cb) {
  var self = this
  this.client.getInfo(function(err, out) {
    if (err) return cb(err)
    self.getBalance(function(err, balances) {
      if (err) return cb(err)
      out.balance = balances.balance
      out.unconfirmed = balances.unconfirmed
      cb(null, out)
    })
  })
}

Bitcoin.prototype.setAccount = function setAccount(addr, label, cb) {
  this.client.setAccount(addr, label, cb)
}

Bitcoin.prototype.getMinting = function getMinting(cb) {
  this.client.cmd('listminting', function(err, out) {
    if (err) return cb(err)
    out = out.sort(function(a, b) {
      return a.time < b.time
        ? -1
        : a.time > b.time
        ? 1
        : 0
    })

    cb(null, out)
  })
}

Bitcoin.prototype.getBalance = function getBalance(cb) {
  var self = this
  self.client.getBalance('*', 0, function(err, unconf) {
    if (err) return cb(err)
    self.client.getBalance('*', 6, function(err, conf) {
      if (err) return cb(err)
      unconf = (unconf - conf).toFixed(6)
      cb(null, {
        balance: conf
      , unconfirmed: unconf
      })
    })
  })
}

Bitcoin.prototype.getTransactions = function getTransactions(cb) {
  this.client.listTransactions('*', 1000, function(err, out) {
    if (err) return cb(err)
    out = out.map(function(item) {
      item.amount = item.amount.toFixed(6)
      return item
    })
    cb(null, out)
  })
}

Bitcoin.prototype.sendFunds = function sendFunds(data, cb) {
  this.client.sendToAddress(data.payee, +data.amount, data.label, cb)
}

Bitcoin.prototype.getAccounts = function getAccounts(cb) {
  this.client.listAddressGroupings(function(err, out) {
    if (err) return cb(err)
    return cb(null, parseAccounts(out).sort(sortAccounts))
  })
}

Bitcoin.prototype.listAccounts = function listAccounts(cb) {
  var self = this
  this.client.cmd('listaddressbook', function(err, results) {
    if (err) return cb(err)
    cb(null, results.sort(sortAccountList))
  })
}

Bitcoin.prototype.getAccountAddress = function getAccountAddress(acc, cb) {
  this.client.getAccountAddress(acc, cb)
}

Bitcoin.prototype.getBlockInfo = function getBlockInfo(cb) {
  var self = this
  self.client.getPeerInfo(function(err, pi) {
    if (err) return cb(err)
    if (!pi || !pi.length) return cb(null, 0)
    return cb(null, pi.reduce(function(set, item) {
      if (set < item.height) set = item.height
      return set
    }, 0))
  })
}

Bitcoin.prototype.createAccount = function createAccount(label, cb) {
  this.client.getNewAddress(label, cb)
}

function parseAccounts(data) {
  var len = data.length
  var out = []
  for (var i=0; i<len; i++) [
    out = out.concat(parseAccount(data[i]))
  ]

  return out
}

function parseAccount(data) {
  return data.map(function(item) {
    return {
      address: item[0]
    , balance: item[1]
    , label: item[2] || ''
    }
  })
}

function sortAccounts(a, b) {
  if (a.balance === b.balance) {
    return a.address < b.address
      ? -1
      : a.address > b.address
      ? 1
      : 0
  }
  return a.balance < b.balance
    ? 1
    : a.balance > b.balance
    ? -1
    : 0
}

function sortAccountList(a, b) {
  return a.account < b.account
    ? -1
    : a.account > b.account
    ? 1
    : 0
}
