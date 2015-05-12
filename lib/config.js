var fs = require('fs')
  , dir = require('crypto-dir')
  , mkdirp = require('mkdirp')
  , path = require('path')
  , crypto = require('crypto')
  , config = exports

config.dir = dir('Paycoin')
config.filepath = path.join(config.dir, 'paycoin.conf')

config.write = function write(data, cb) {
  var d = 'rpcuser=' + data.rpcuser + '\n' +
    'rpcpassword=' + data.rpcpassword + '\n'
  fs.writeFile(config.filepath, d, 'utf8', function(err) {
    if (err) return cb(err)
    cb(null, config.config)
  })
}

config.read = function read(cb) {
  console.log('read config: ' + config.filepath)
  fs.readFile(config.filepath, 'utf8', function(err, data) {
    if (err) {
      if (err.code === 'ENOENT') {
        // generate
        config.config = config.generate()
        config.write(config.config, cb)
      }
    } else {
      // already exists
      // TODO(evanlucas) check that rpcuser and rpcpassword
      // already exist
      // if not, generate them
      config.config = parse(data)
      cb(null, config.config)
    }
  })
}

config.generate = function generate() {
  var d = (new Date()).valueOf().toString()
  var ran = Math.random().toString()
  config.config = {
    rpcuser: 'rpcuser'
  , rpcpassword: crypto.createHmac('sha1').update(d + ran).digest('hex')
  }

  return config.config
}

function parse(data) {
  var out = data.split('\n').filter(function(item) {
    return item[0] !== '#'
  }).map(function(item) {
    var splits = item.split('=')
    return [splits[0], splits[1]]
  })

  if (!out.length) return {}
  return out.reduce(function(set, item) {
    set[item[0]] = item[1]
    return set
  }, {})
}
