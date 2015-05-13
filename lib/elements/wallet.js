var h = require('virtual-dom/h')
  , inherits = require('util').inherits
  , BaseElement = require('./base-element')
  , dom = require('../dom')

module.exports = Wallet

function Wallet(target) {
  BaseElement.call(this, target)
}

inherits(Wallet, BaseElement)

Wallet.prototype.render = function(info, accounts) {
  var self = this
  accounts = accounts.sort(function(a, b) {
    return a.balance < b.balance
      ? 1
      : a.balance > b.balance
      ? -1
      : 0
  }).map(address)
  return [
    h('#receive.js-tab-address-book-content', [
      h('.wrapper', [
        h('.tab-text', [
          h('h3.text-primary', 'Receive Paycoins')
        ])
      , h('.js-my-addresses', [
          h('table.table.addresses.table-striped', [accounts])
        ])
      ])
    ])
  ]
}

function address(item) {
  var name = item.label || '[no label]'
  var balance = (+item.balance || 0).toFixed(6)
  return h('tr', {
    onclick: function() {
      var sibs = dom.siblings(this)
      for (var i=0, len=sibs.length; i<len; i++) {
        sibs[i].classList.remove('active')
      }
      this.classList.add('active')
    }
  }, [
    h('td', name)
  , h('td', item.address)
  , h('td', balance)
  ])
}
