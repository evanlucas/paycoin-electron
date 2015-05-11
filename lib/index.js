var ipc = require('ipc')

module.exports = window.Client = Client

function Client() {
  if (!(this instanceof Client))
    return new Client()

  ipc.on('login', function(data) {
    console.log('login', 'data', data)
  })
}
