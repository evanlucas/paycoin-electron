var bitcoin = require('bitcoin')

module.exports = window.bitcoin = Bitcoin

function Bitcoin(opts) {
  if (!(this instanceof Bitcoin))
    return new Bitcoin(opts)

  this.opts = opts
  console.log('opts ' + JSON.stringify(opts))
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

Bitcoin.prototype.sendFunds = function(data, cb) {
  this.client.sendToAddress(data.payee, +data.amount, data.label, cb)
}

Bitcoin.prototype.getAccounts = function getAccounts(cb) {
  this.client.listAddressGroupings(function(err, out) {
    if (err) return cb(err)
    return cb(null, parseAccounts(out))
  })
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
