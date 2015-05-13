module.exports = Nav

function Nav(app) {
  if (!(this instanceof Nav))
    return new Nav(app)

  this.app = app
}

Nav.prototype.setup = function setup() {
  var self = this
  this.app.on('nav', function(href) {
    self.app.activeNav = href
    var e = href.replace(/#/, '')
    if (self[e]) {
      self[e]()
    }
  })
}

Nav.prototype.overview = function overview() {
  var self = this
  this.app.getInfo(function(err) {
    self.app.emit('render')
  })
}

Nav.prototype.receive = function receive() {
  var self = this
  this.app.getWallet(function(err) {
    self.app.emit('render')
  })
}

Nav.prototype.history = function history() {
  var self = this
  this.app.client.getTransactions(function(err, txs) {
    txs = txs.sort(function(a, b) {
      return a.time < b.time
        ? 1
        : a.time > b.time
        ? -1
        : 0
    })
    self.app.data.transactions = txs
    self.app.emit('render')
  })
}

Nav.prototype.send = function send() {
  this.app.emit('render')
}

Nav.prototype.staking = function staking() {
  var self = this
  this.app.client.getMinting(function(err, txs) {
    if (err) return self.app.alert('Error loading staking', err.message)
    self.app.data.staking = txs
    self.app.emit('render')
  })
}

Nav.prototype.settings = function settings() {
  this.app.emit('render')
}
