var h = require('virtual-dom/h')
  , inherits = require('util').inherits
  , BaseElement = require('./base-element')

module.exports = Send

function Send(target) {
  BaseElement.call(this, target)
}

inherits(Send, BaseElement)

Send.prototype.render = function(info) {
  var self = this
  // TODO(evanlucas) show result
  return h('#send', [
    h('.wrapper', [
      h('.payment-panel', [
        h('.tab-text.inline.m-r-sm', [
          h('h3.text-primary.m-none.no-padder.m-b-md', 'Send Paycoins')
        ])
      , h('.available-balance.inline.w-md', [
          h('span.inline.m-r-sm', 'Balance:')
        , h('span.font-bold.inline', String(info.balance))
        ])
      , h('form.send', {
          onsubmit: function(e) {
            this.querySelector('button').setAttribute('disabled', 'disabled')
            var data = $(this).serializeArray()
            data = data.reduce(function(set, item) {
              set[item.name] = item.value
              return set
            }, {})
            self.send('sendfunds', data)
            return false
          }
        }, [
          h('.form-group', [
            h('.input-group.w-full', [
              h('span#payee.input-group-addon.w-xs', {
                for: 'payee'
              }, 'Pay To')
              , h('input#payee.js-payee.form-control', {
                type: 'text'
              , placeholder: 'Enter a Paycoin Address'
              , name: 'payee'
              })
            ])
          ])
        , h('.form-group', [
            h('.input-group.w-full', [
              h('span#amount.input-group-addon.w-xs', {
                for: 'label'
              }, 'Label')
              , h('input#label.js-label.form-control', {
                type: 'text'
              , placeholder: 'Enter a label for this address to save it to your address book'
              , name: 'label'
              })
            ])
          ])
        , h('.form-group', [
            h('.input-group.w-full', [
              h('span#amount.input-group-addon.w-xs', {
                for: 'amount'
              }, 'Amount')
              , h('input#amount.js-amount.form-control', {
                type: 'text'
              , placeholder: 'Enter an Amount to Send'
              , name: 'amount'
              })
            ])
          ])
          , h('.form-group', [
            h('.available-balance.inline.w-md', [
              h('span.inline.m-r-md', 'Total:')
            , h('h4.font-bold.inline')
            ])
            , h('button#submit.js-submit.btn.btn-default.w-md.pull-right.inline', {
                type: 'submit'
              }, 'Submit')
          ])
        ])
      ])
    ])
  ])
}
