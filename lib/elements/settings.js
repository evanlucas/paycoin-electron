var h = require('virtual-dom/h')
  , inherits = require('util').inherits
  , BaseElement = require('./base-element')

module.exports = Settings

function Settings(target) {
  BaseElement.call(this, target)
}

inherits(Settings, BaseElement)

Settings.prototype.render = function() {
  return [
    h('#settings.bg-light', [
      h('.h.bg-light.lter.b-b.padder.navbar.navbar-default.w-full', [
        h('.navbar-header.flex.h', [
          h('.navbar-brand.no-padder.h.flex', [
            h('h3.text-primary.no-padder.inline.m-t-b-a', "Settings")
          ])
        ])
      , h('ul.nav.navbar-nav.pull-right.text-u-c.no-select#settingsNav', [
          h('li.no-radius', [
            h('a', {
              href: '#general'
            }, "General")
          ])
        , h('li.no-radius', [
            h('a', {
              href: '#management'
            }, "Management")
          ])
        , h('li.no-radius', [
            h('a', {
              href: '#network'
            }, "Network")
          ])
        , h('li.no-radius', [
            h('a', {
              href: '#advanced'
            }, "Advanced")
          ])
        ])
      ])
    , h(".wrapper", [
        h("#backup", [
          h(".panel.panel-default", [
            h(".panel-heading", [
              h("h3.panel-title", [ "Backup Wallet" ])
            ]),
            h(".panel-body", [
              h("p.m-b-xs", [ "Click 'Save Backup' below to save an encrypted file of your private keys. You should backup this file in a safe place." ]),
              h("button.btn.btn-primary.btn-block.no-radius",
                { "name": "backupButton"}
              , [ "Save Backup" ])
            ])
          ]),
          h(".panel.panel-default", [
            h(".panel-heading", [
              h("h3.panel-title", [ "Export Keys" ])
            ]),
            h(".panel-body", [
              h("p.m-b-xs", [ "Click 'Export Keys' to manually save a list of private keys, or copy a single private key to your clipboard." ]),
              h("button.btn.btn-primary.btn-block.no-radius",
                { "name": "exportButton"}
              , [ "Export Keys" ])
            ])
          ]),
          h(".panel.panel-default", [
            h(".panel-heading", [
              h("h3.panel-title", [ "Import Keys" ])
            ]),
            h(".panel-body", [
              h("p.m-b-xs", [ "Click 'Import Keys' below to open a dialog to either load a wallet file, or enter a private key." ]),
              h("button.btn.btn-primary.btn-block.no-radius",
                { "name": "importButton"}
              , [ "Import Keys" ])
            ])
          ])
        ]),
        h("#encryption", [
          h(".panel.panel-default", [
            h(".panel-heading", [
              h("h3.panel-title", [ "Change Wallet Password" ])
            ]),
            h(".panel-body", [
              h("form", [
                h(".col-sm-3.no-padder", [
                  h("input#oldPassword.form-control.no-radius", {
                    "type": "password",
                    "placeholder": "old password"
                  })
                ]),
                h(".col-sm-3.no-padder", [
                  h("input#newPassword1.form-control.no-radius", {
                    "type": "password",
                    "placeholder": "new password"
                  })
                ]),
                h(".col-sm-3.no-padder", [
                  h("input#newPassword2.form-control.no-radius", {
                    "type": "password",
                    "placeholder": "repeat new password"
                  })
                ]),
                h(".col-sm-3.no-padder", [
                  h("button.btn.btn-primary.btn-block.no-radius", {
                    "type": "submit"
                  }, [ "Change Password" ])
                ])
              ])
            ])
          ])
        ])
      ])
    ])
  ]
}
