var h = require('virtual-dom/h')
  , inherits = require('util').inherits
  , BaseElement = require('./base-element')

module.exports = Overview

function Overview(target) {
  BaseElement.call(this, target)
}

inherits(Overview, BaseElement)

Overview.prototype.render = function(info) {
  var self = this
  return [
    h('#overview', [
      h('.wrapper', [
        h('.col-lg-6', [
          h('h3', 'Available Funds')
        , h('dl.dl-horizontal', [
            h('dt', 'Total Balance')
          , h('dd', String(info.balance))
          , h('dt', 'Unconfirmed Balance')
          , h('dd', String(info.unconfirmed))
          , h('dt', 'Staking Balance')
          , h('dd', (+info.stake || 0).toFixed(6))
          ])
        ])
      , h('.col-lg-6', [
          h('h3', 'Info')
          , h('dl.dl-horizontal', [
              h('dt', 'Block Height')
            , h('dd', String(info.blocks))
            , h('dt', 'Protocol Version')
            , h('dd', String(info.protocolversion))
            , h('dt', 'Money Supply')
            , h('dd', String(info.moneysupply))
            , h('dt', 'Connections')
            , h('dd', String(info.connections))
            ])
          ])
      ])
    ])
  ]
}
