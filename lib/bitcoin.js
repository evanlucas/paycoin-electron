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
  this.client.getInfo(cb)
}

Bitcoin.prototype.getBalance = function getBalance(cb) {
  this.client.getBalance('*', 0, cb)
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
