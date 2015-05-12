var h = require('virtual-dom/h')
  , inherits = require('util').inherits
  , BaseElement = require('./base-element')

module.exports = Send

function Send(target) {
  BaseElement.call(this, target)
}

inherits(Send, BaseElement)

Send.prototype.render = function(info) {
  return h('#send', [
    h('.wrapper', [
      h('.payment-panel', [
        h('.tab-text', [
          h('h3.text-primary', 'Send Paycoins')
        ])
      , h('.available-balance', [
          h('span', 'Balance:')
        , h('h4', String(info.balance))
        ])
      , h('form.large.form-horizontal', [
          h('.form-group', [
            h('.label.col-lg-2', [
              h('label', {
                for: 'payee'
              }, 'Pay To')
            ])
          , h('.col-lg-10', [
              h('input#payee.js-payee.form-control', {
                type: 'text'
              , name: 'payee'
              })
            ])
          ])
        , h('.form-group', [
            h('.label.col-lg-2', [
              h('label', {
                for: 'label'
              }, 'Label')
            ])
          , h('.col-lg-10', [
              h('input#label.form-control', {
                type: 'text'
              , name: 'label'
              })
            ])
          ])
        ])
      ])
    ])
  ])
}
