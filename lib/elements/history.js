var h = require('virtual-dom/h')
  , inherits = require('util').inherits
  , BaseElement = require('./base-element')

module.exports = History

function History(target) {
  BaseElement.call(this, target)
}

inherits(History, BaseElement)

History.prototype.render = function(txs) {
  var self = this
  txs = txs.map(tx)
  return [
    h('#history.bg-light', [
      h('.tab-text.bg-light.lter.b-b.padder.flex.h', [
        h('h3.text-primary.no-padder.inline.m-t-b-a', 'Transaction History')
      ])
    , h('.wrapper', [
        h('table.table#transaction_table', [
          h('thead', [
            h('tr', [
              h('th')
            , h('th', 'Date')
            , h('th', 'Type')
            , h('th', 'Address')
            , h('th', 'Amount')
            , h('th')
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

  if (item.confirmations < 6) {
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
  , h('td', item.category)
  , h('td', item.address)
  , h('td', {
      style: {
        textAlign: 'right'
      }
    }, String(item.amount))
  , txid_link(item.txid)
  ])
}

function txid_link(id) {
  return h('td', [
    h('a', {
      target: '_blank'
    , href: `https://ledger.paycoin.com/transaction/${id}`
    }, [
      h('i.fa.fa-external-link')
    ])
  ])
}
