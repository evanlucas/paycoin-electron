var EE = require('events').EventEmitter
  , spawn = require('child_process').spawn
  , path = require('path')
  , argsplit = require('argsplit')
  , inherits = require('util').inherits
  , os = require('os')
  , log = require('./log')
  , convert = require('object-to-argv')
  , config = require('./config')

var daemons = {
  'darwin_x64': 'paycoind_osx'
, 'linux_x64': 'paycoind_linux_x64'
, 'linux_ia32': 'paycoind_linux_ia32'
}

module.exports = Daemon

function Daemon(opts) {
  if (!(this instanceof Daemon))
    return new Daemon(opts)

  EE.call(this)
  this.opts = opts || {}
  this.running = false
}
inherits(Daemon, EE)

Daemon.prototype.start = function() {
  var self = this
  var fp = this.getDaemonPath()
  var cmd = convert(this.opts, {
    alwaysSingle: true
  , equalSign: true
  })

  this.child = spawn(fp, cmd, {
    env: process.env
  })
  this.child.stderr.pipe(process.stderr)
  this.child.stdout.pipe(process.stdout)
  this.running = true
  this.child.on('error', function(err) {
    log(err.message)
  })
  this.child.on('exit', function(code) {
    log(`daemon exited with code ${code}`)
    self.running = false
    self.emit('stopped')
  })
}

Daemon.prototype.stop = function() {
  log('stopping daemon')
  this.child.kill()
}

Daemon.prototype.getDaemonPath = function(cb) {
  var platform = os.platform()
    , arch = os.arch()

  var id = `${platform}_${arch}`
  return path.join(__dirname, '..', 'resources', daemons[id])
}
