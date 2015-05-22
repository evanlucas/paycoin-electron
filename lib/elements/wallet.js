var h = require('virtual-dom/h')
  , inherits = require('util').inherits
  , BaseElement = require('./base-element')
  , dom = require('../dom')

module.exports = Wallet

function Wallet(target) {
  BaseElement.call(this, target)
}

inherits(Wallet, BaseElement)

Wallet.prototype.hideGenerate = function hideGenerate() {
  document.body.classList.remove('modal-open')
  var modal = document.querySelector('.modal.generate')
  modal.classList.toggle('in')
  modal.style.display = 'none'
}

Wallet.prototype.showGenerate = function showGenerate() {
  var body = document.body
  body.classList.add('modal-open')
  var modal = document.querySelector('.modal.generate')
  modal.classList.toggle('in')
  modal.style.display = 'block'
  modal.style.paddingLeft = '0px'
  modal.style.paddingTop = '50px'
}

Wallet.prototype.hideEdit = function hideEdit() {
  document.body.classList.remove('modal-open')
  var modal = document.querySelector('.modal.edit')
  modal.classList.toggle('in')
  modal.style.display = 'none'
}

Wallet.prototype.showEdit = function showEdit(addr, label) {
  var body = document.body
  body.classList.add('modal-open')
  var modal = document.querySelector('.modal.edit')
  var addrInput = modal.querySelector('input[name=address]')
  var labelInput = modal.querySelector('input[name=label]')
  addrInput.value = addr
  labelInput.value = label === '[no label]'
    ? ''
    : label
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
    var modal = document.querySelector('.modal.generate')
    var add = modal.querySelector('input[name=address]')
    add.value = address
    self.target.alert('Successfully created new address', address)
    self.target.getWallet(function() {
      self.target.emit('render')
      setTimeout(function() {
        self.hideGenerate()
      }, 3000)
    })
  })
}

Wallet.prototype.updateLabel = function(addr, label) {
  var self = this
  var client = this.target.client
  if (!label) {
    return self.target.alert('Error saving account', 'Label is required')
  }

  client.setAccount(addr, label, function(err) {
    if (err) {
      return self.target.alert('Error updating account', err.message)
    }
    self.target.alert('Successfully updated account', label)
    self.target.getWallet(function() {
      self.target.emit('render')
      setTimeout(function() {
        var modal = document.querySelector('.modal.edit')
        dom.clearInputs('.modal.edit input[type=text]')
        self.hideEdit()
      }, 3000)
    })
  })
}

Wallet.prototype.render = function render(info, accounts) {
  var self = this
  accounts = accounts.map(address.bind(this))
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
              self.showGenerate()
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
      , h('.modal.generate', [
          h('.modal-dialog', [
            h('.modal-content', [
              h('.modal-header', [
                h('.button.close', {
                  type: 'button'
                , onclick: function(e) {
                    self.hideGenerate()
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
                        var modal = document.querySelector('.modal.generate')
                        var input = modal.querySelector('input[name=label]')
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
      , h('.modal.edit', [
          h('.modal-dialog', [
            h('.modal-content', [
              h('.modal-header', [
                h('.button.close', {
                  type: 'button'
                , onclick: function(e) {
                    self.hideEdit()
                  }
                }, [
                  h('span', 'x')
                ])
              , h('h4.modal-title', 'Edit Address')
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
                        , placeholder: 'Address'
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
                        var modal = document.querySelector('.modal.edit')
                        var label = modal.querySelector('input[name=label]')
                        var addr = modal.querySelector('input[name=address]')
                        self.updateLabel(addr.value, label.value)
                        return false
                      }
                    }, 'Save Address')
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
  var self = this
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
  , h('td', [
      h('a.edit-address', {
        href: `#${item.address}`
      , attributes: {
          'data-address': item.address
        , 'data-label': name
        }
      , onclick: function(e) {
          e.preventDefault()
          var address = this.getAttribute('data-address')
          var label = this.getAttribute('data-label')
          self.showEdit(address, label)
          return false
        }
      }, [
        h('i.fa.fa-pencil')
      ])
    ])
  ])
}
