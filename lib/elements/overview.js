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
        h('h3', 'Available Funds:')
      , h('h1.selectable.js-balance', String(info.balance))
      , h('.non-spendable', [
          h('h4', 'Unconfirmed:')
        , h('span.selectable.js-unconfirmed-balance',[
            h('i.fa.fa-spinner.fa-spin')
          ])
        , h('h4', 'Staking:')
        , h('span.selectable.js-stake-amount', (+info.stake || 0).toFixed(8))
        ])
      , h('h4', 'Info')
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
  ]
}
