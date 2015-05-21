var h = require('virtual-dom/h')
  , inherits = require('util').inherits
  , BaseElement = require('./base-element')

module.exports = Overview

function Overview(target) {
  BaseElement.call(this, target)
  var self = this
  this.lefts = [
    h('i.fa.fa-chevron-up', {
      onclick: function(e) {
        self.previousRecent()
      }
    })
  , h('i.fa.fa-chevron-down', {
      onclick: function(e) {
        self.nextRecent()
      }
    })
  , ''
  ]
}

inherits(Overview, BaseElement)

var titles = {
  send: 'Sent Paycoin'
, receive: 'Received Paycoin'
, stake: 'Staked Paycoin'
}

Overview.prototype.previousRecent = function previousRecent() {
  var self = this
  var idx = self.target.data.recentTxIndex
  if (!idx) return false
  self.target.updateRecent(idx - 1, function(err) {
    self.target.emit('render')
  })
}

Overview.prototype.nextRecent = function nextRecent() {
  var self = this
  var idx = self.target.data.recentTxIndex
  if (idx === self.target.data.transactions.length - 1) return false
  self.target.updateRecent(idx + 1, function(err) {
    self.target.emit('render')
  })
}

Overview.prototype.txRow = function txRow(tx, idx) {
  var self = this
  if (!tx) {
    return h('tr', [
      h('td.col-sm-1.text-3x.text-center', [
        self.lefts[idx]
      ])
    , h('td.col-sm-7')
    , h('td.col-sm-4')
    ])
  }
  var left = self.lefts[idx]
  var title = titles[tx.category]
  var text = tx.category === 'stake'
    ? ''
    : `to ${tx.address}`
  return h('tr', [
    h('td.col-sm-1.text-3x.text-center', [
      left
    ])
  , h('td.col-sm-7.text-white.text-lg', [
      title
    , h('br')
    , h('small', {
        style: {
          fontSize: '11px'
        }
      }, [ text ])
    ])
  , txAmount(tx)
  ])
}

function txAmount(tx) {
  var amount = +tx.amount
  var cl = amount < 0
    ? '.text-white'
    : '.text-success'
  amount = amount.toFixed(2)
  return h('td.col-sm-4.text-lg.text-right${cl}', [
    `${amount} XPY`
  , h('br')
  ])
}

Overview.prototype.render = function(info, recentTxs) {
  var self = this
  var stake = (+info.stake || 0).toFixed(6)
  return [
    h('#overview.h-full.flex-col', [
      h('.col-sm-12.bg-primary.dk.flex-fill.flex-col', [
        h('.row.flex-fill.flex-row', [
          h('.col-sm-6.m-t-b-a',  [
            h('h2.m-none.text-white.font-thin', 'BALANCE')
          , h('h1.m-none.text-6x.font-thin.text-white', String(info.balance))
          , h('p', String(info.unconfirmed) + ' unconfirmed')
          ])
        , h('.col-sm-6.text-right.m-t-b-a', [
            h('h3.m-none.text-white.font-thin', 'STAKING')
          , h('h1.m-none.text-3x.font-thin.text-white', stake)
          , h('h2.m-none.text-white.font-thin', ' currently staking')
          ])
        ])
      ])
    , h('.col-sm-12.bg-dark.lter.flex-fill.flex-row.m-none.no-padder', [
        h('.col-sm-6.flex-fill', [
          h('h3.m-t-xl.m-b-none.text-white.font-thin', 'RECENT TRANSACTIONS')
        , h('.row', [
            h('table.col-sm-12', [
              h('tbody', [
                self.txRow(recentTxs[0], 0)
              , self.txRow(recentTxs[1], 1)
              , self.txRow(recentTxs[2], 2)
              ])
            ])
          ])
        ])
      , h('.col-sm-6.text-right.bg-light.flex-fill.no-padder.flex-col#nav', [
          h('a.btn.btn-default.w-full.no-radius.flex-fill.flex-col', {
            'href': '#send'
          }, [
            h('.inner.text-3x.font-thin.m-t-b-a', [
              h('i.fa.fa-arrow-right.m-r-md')
            , 'SEND'
            ])
          ])
        , h('a.btn.btn-success.w-full.no-radius.flex-fill.flex-col', {
            'href': '#receive'
          }, [
            h('.inner.text-3x.font-thin.m-t-b-a', [
              h('i.fa.fa-arrow-left.m-r-md')
            , 'RECEIVE'
            ])
          ])
        ])
      ])
    ])
  ]
}
