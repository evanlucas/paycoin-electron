var ipc = require('ipc')

module.exports = window.RPC = RPC

function RPC(el) {
  if (!(this instanceof RPC))
    return new RPC(el)

  this.form = el.querySelector('form')
  this.form.addEventListener('submit', this.onsubmit())
  console.log(window)
}

RPC.prototype.onsubmit = function() {
  var self = this
  return function(e) {
    var data = {
      host: self.form.querySelector('.rpchost').value
    , port: self.form.querySelector('.rpcport').value
    , user: self.form.querySelector('.rpcuser').value
    , pass: self.form.querySelector('.rpcpass').value
    }

    ipc.emit('login', data)

    return window.close()
  }
}
