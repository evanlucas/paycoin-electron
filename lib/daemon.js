var config = require('./config')
  , spawn = require('child_process').spawn
  , path = require('path')
  , argsplit = require('argsplit')
  , daemon = exports

daemon.start = function() {
  var fp = path.join(__dirname, '..', 'resources', 'paycoind_osx')
  var cmd = argsplit(`-printtoconsole -debug`)
  daemon.child = spawn(fp, cmd)
  daemon.child.stderr.pipe(process.stderr)
  daemon.child.on('error', function(err) {
    console.log(err.message)
  })
  daemon.child.on('exit', function(code) {
    console.log(`daemon exited with code ${code}`)
  })
}

daemon.stop = function() {
  daemon.child.kill()
}
