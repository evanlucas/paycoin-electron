var EE = require('events').EventEmitter
  , config = require('./config')
  , spawn = require('child_process').spawn
  , path = require('path')
  , argsplit = require('argsplit')
  , inherits = require('util').inherits
  , os = require('os')

var daemons = {
  'darwin_x64': 'paycoind_osx'
, 'linux_x64': 'paycoind_linux_x64'
, 'linux_ia32': 'paycoind_linux_ia32'
}

module.exports = Daemon

function Daemon(app) {
  if (!(this instanceof Daemon))
    return new Daemon(app)

  EE.call(this)
  this.app = app
  this.running = false
}
inherits(Daemon, EE)

Daemon.prototype.start = function() {
  var self = this
  var fp = this.getDaemonPath()
  var cmd = argsplit(`-debug`)
  this.child = spawn(fp, cmd)
  this.child.stderr.pipe(process.stderr)
  this.child.stdout.pipe(process.stdout)
  this.running = true
  this.child.on('error', function(err) {
    console.log(err.message)
  })
  this.child.on('exit', function(code) {
    console.log(`daemon exited with code ${code}`)
    self.running = false
    self.emit('stopped')
  })
}

Daemon.prototype.stop = function() {
  console.log('stopping daemon')
  this.child.kill()
}

Daemon.prototype.getDaemonPath = function(cb) {
  var platform = os.platform()
    , arch = os.arch()

  var id = `${platform}_${arch}`
  return path.join(__dirname, '..', 'resources', daemons[id])
}
