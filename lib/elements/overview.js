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
                h('tr', [
                  h('td.col-sm-1.text-3x.text-center', [
                    h('i.fa.fa-chevron-up')
                  ])
                , h('td.col-sm-6.text-white.text-lg', [
                    'Sent Paycoin'
                  , h('br')
                  , h('small', [ 'to paycoin address' ])
                  ])
                , h('td.col-sm-5.text-white.text-lg.text-right', [
                    '-27.29 XPY'
                  , h('br')
                  , h('small', [ '-$3.82 USD' ])
                  ])
                ])
              , h('tr', [
                  h('td.col-sm-1.text-3x.text-center', [
                    h('i.fa.fa-chevron-down')
                  ])
                , h('td.col-sm-6.text-white.text-lg', [
                    'Recieved Paycoin'
                  , h('br')
                  , h('small', [ 'to paycoin address' ])
                  ])
                , h('td.col-sm-5.text-success.text-lg.text-right', [
                    '+12.92 XPY'
                  , h('br')
                  , h('small.text-white', [ '+$1.80 USD' ])
                  ])
                ])
              , h('tr', [
                  h('td.col-sm-1.text-3x.text-center', [ h('i.fa.fa-plus') ])
                , h('td.col-sm-6.text-white.text-lg', [
                    'Staked Paycoin'
                  , h('br')
                  , h('small', [ 'to paycoin address' ])
                  ])
                , h('td.col-sm-5.text-success.text-lg.text-right', [
                    '+0.29 XPY'
                  , h('br')
                  , h('small.text-white', [ '+$0.04 USD' ])
                  ])
                ])
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
