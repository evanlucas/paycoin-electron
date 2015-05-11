var bitcoin = require('bitcoin')

module.exports = window.bitcoin = Bitcoin

function Bitcoin(opts) {
  if (!(this instanceof Bitcoin))
    return new Bitcoin(opts)

  this.opts = opts
  console.log('opts ' + JSON.stringify(opts))
  this.client = new bitcoin.Client({
    host: opts.host || '127.0.0.1'
  , port: opts.port || 8999
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
  this.client.listTransactions('*', 1000, cb)
}
