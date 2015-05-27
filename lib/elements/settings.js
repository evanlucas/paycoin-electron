var h = require('virtual-dom/h')
  , inherits = require('util').inherits
  , BaseElement = require('./base-element')

module.exports = Settings

function Settings(target) {
  BaseElement.call(this, target)
}

inherits(Settings, BaseElement)

Settings.prototype.render = function() {
  return [
    h('#settings', [
      h('.wrapper', [
        h('h3.m-none.no-padder.m-b-md', 'Settings')
      ])
    ])
  ]
}
