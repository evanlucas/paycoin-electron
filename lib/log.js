const util = require('util')

module.exports = function() {
  console.log(util.format.apply(this, arguments))
}
