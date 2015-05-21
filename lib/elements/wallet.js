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
  accounts = accounts.map(address)
  return [
    h('#receive.bg-light', [
      h('.wrapper', [
        h('.tab-text', [
          h('h3.text-primary.col-sm-6.m-none.no-padder.m-b-md'
           , 'Receive Paycoins'
           )
        , h('a.btn.btn-dark.pull-right.col-sm-3.col-sm-offset-3', {
            'href': '#generateAddress'
          }, [
            h('font-thin.m-t-b-a]', [
              'Generate Address'
            ])
          ])
        ])
      , h('table.table.table-condensed', [
          h('tbody', [accounts])
        ])
      ])
    ])
  ]
}

function address(item) {
  var name = item.account || '[no label]'
  return h('tr', {
    onclick: function() {
      var sibs = dom.siblings(this)
      for (var i=0, len=sibs.length; i<len; i++) {
        sibs[i].classList.remove('active')
      }
      this.classList.add('active')
    }
  }, [
    h('td', { "style": "height:40px;" }, name)
  , h('td', { "style": "height:40px;" }, item.address)
  ])
}
