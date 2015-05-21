var h = require('virtual-dom/h')
  , inherits = require('util').inherits
  , BaseElement = require('./base-element')
  , dom = require('../dom')

module.exports = Wallet

function Wallet(target) {
  BaseElement.call(this, target)
}

inherits(Wallet, BaseElement)

Wallet.prototype.hideModal = function() {
  document.body.classList.remove('modal-open')
  var modal = document.querySelector('.modal')
  modal.classList.toggle('in')
  modal.style.display = 'none'
}

Wallet.prototype.showModal = function() {
  var body = document.body
  body.classList.add('modal-open')
  var modal = document.querySelector('.modal')
  modal.classList.toggle('in')
  modal.style.display = 'block'
  modal.style.paddingLeft = '0px'
  modal.style.paddingTop = '50px'
}

Wallet.prototype.generateAddress = function generateAddress(label) {
  var self = this
  if (!label) {
    return self.target.alert('Error creating address', 'Label is required')
  }

  self.target.client.createAccount(label, function(err, address) {
    if (err) {
      return self.target.alert('Error creating address', err.message)
    }
    var add = document.querySelector('input[name=address]')
    add.value = address
    self.target.alert('Successfully created new address', address)
    self.target.getWallet(function() {
      self.target.emit('render')
      setTimeout(function() {
        self.hideModal()
      }, 3000)
    })
  })
}

Wallet.prototype.render = function render(info, accounts) {
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
            href: '#generateAddress'
          , onclick: function(e) {
              e.preventDefault()
              self.showModal()
            }
          }, [
            h('font-thin.m-t-b-a]', [
              'Generate Address'
            ])
          ])
        ])
      , h('table.table.table-condensed', [
          h('tbody', [accounts])
        ])
      , h('.modal', [
          h('.modal-dialog', [
            h('.modal-content', [
              h('.modal-header', [
                h('.button.close', {
                  type: 'button'
                , onclick: function(e) {
                    self.hideModal()
                  }
                }, [
                  h('span', 'x')
                ])
              , h('h4.modal-title', 'Generate Address')
              , h('.modal-body', [
                  h('form.send', [
                    h('.form-group', [
                      h('.input-group.w-full', [
                        h('span.input-group-addon.w-xs', 'Label')
                      , h('input.js-payee.form-control', {
                          type: 'text'
                        , placeholder: 'Enter Address Label'
                        , name: 'label'
                        })
                      ])
                    ])
                  , h('.form-group', [
                      h('.input-group.w-full', [
                        h('span.input-group-addon.w-xs', 'Address')
                      , h('input.js-payee.form-control.disabled', {
                          type: 'text'
                        , placeholder: 'Generated Address'
                        , name: 'address'
                        , disabled: 'disabled'
                        })
                      ])
                    ])
                  , h('button#submit.js-submit.btn.btn-default.w-md.' +
                      'pull-right.inline', {
                      type: 'submit'
                    , onclick: function(e) {
                        e.preventDefault()
                        var input = document.querySelector('input[name=label]')
                        self.generateAddress(input.value)
                        return false
                      }
                    }, 'Generate Address')
                  ])
                ])
              , h('.modal-footer')
              ])
            ])
          ])
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
