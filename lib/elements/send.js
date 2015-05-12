var h = require('virtual-dom/h')
  , inherits = require('util').inherits
  , BaseElement = require('./base-element')

module.exports = Send

function Send(target) {
  BaseElement.call(this, target)
}

inherits(Send, BaseElement)

Send.prototype.render = function() {
  
}
