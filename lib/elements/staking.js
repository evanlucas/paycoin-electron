var h = require('virtual-dom/h')
  , inherits = require('util').inherits
  , BaseElement = require('./base-element')

module.exports = Staking

function Staking(target) {
  BaseElement.call(this, target)
}

inherits(Staking, BaseElement)

Staking.prototype.render = function(txs) {
  var self = this
  txs = txs.map(tx)
  return [
    h('#staking.bg-light', [
      h('.tab-text.bg-light.lter.b-b.padder.flex.h', [
        h('h3.text-primary.no-padder.inline.m-t-b-a', 'Staking Probability')
      ])
    , h('.wrapper', [
        h('table.table#transaction_table', [
          h('thead', [
            h('tr', [
              h('th')
            , h('th', 'Date')
            , h('th', 'TxID')
            , h('th', 'Address')
            , h('th', 'Age')
            , h('th.text-right', 'Balance')
            , h('th', 'Coin Day')
            , h('th', 'Probability')
            ])
          ])
        , h('tbody', [
            txs
          ])
        ])
      ])
    ])
  ]
}

function tx(item) {
  var color = '#79C597'
    , cl = 'fa fa-check-circle'

  if (item.status === 'mature') {
    color = '#B50A13'
    cl = 'fa fa-times-circle'
  }

  var date = new Date(item.time * 1000)

  return h('tr', [
    h('td', [
      h('i', {
        style: {
          fontSize: '18px'
        , color: color
        }
      , className: cl
      })
    ])
  , h('td', date.toLocaleString())
  , h('td', txid_link(item['input-txid']))
  , h('td', item.address)
  , h('td', item['age-in-day'])
  , h('td', {
      style: {
        textAlign: 'right'
      }
    }, (item.amount / 1000000).toFixed(6))
  , h('td', item['coin-day-weight'])
  , h('td', item['minting-probability-10min'].toFixed(2) + '%')
  ])
}

function txid_link(id) {
  var trimmed = `${id.substr(0, 10)}...`
  return h('td', [
    h('a', {
      target: '_blank'
    , href: `https://chainz.cryptoid.info/xpy/tx.dws?${id}.htm`
    }, trimmed)
  ])
}
