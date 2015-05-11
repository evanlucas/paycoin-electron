var fs = require("fs"),
  assert = require("assert"),
  bitcoin = require("bitcoin"),
  crypto = require("crypto"),
  util = require("util"),
  http = require("http"),
  https = require("https"),
  os = require("os"),
  csv = require("csv-parse"),
  child_process = require("child_process"),
  gui = require('nw.gui'),
  concat = require('concat-stream'),
  win = gui.Window.get(),
  clipboard = gui.Clipboard.get();

var satoshisInAPaycoin = 100000000;

var HOST = '127.0.0.1';
var PORT = '8999';
var USER = 'bitcoinrpc';
var PASS = 'HJh2Jf4giPyBxd7UwiG5y6AdR7U518xfQcAMi97tqnRT';

var client = new bitcoin.Client({
  host: HOST,
  port: PORT,
  user: USER,
  pass: PASS,
  timeout: 3E4
});

var marketURL = 'http://paycoinprice.net/api/price/USD';

if (localStorage.fiatCurrency == undefined) localStorage.setItem('fiatCurrency', 'USD');
$('#fiat_currency_setting').val(localStorage.fiatCurrency);

var minFee = 0.0001;
var availableBalance;
var stakingBalance;
var incomingPaycoins;
var fiatValue = 0.00;
var fiatCurrency = 'USD';
var tx;
var mainAddress;
var sendingStatus;
var connectedPeers;
var transactionTable;
var transactionInfo;
var txs;

$(function () {
  $('[data-toggle="tooltip"]').tooltip()
})

if (typeof String.prototype.startsWith != 'function') {
  String.prototype.startsWith = function (str) {
    return this.slice(0, str.length) == str;
  };
}

sendCommand('get_info');
loopUpdateBalance();
loopUpdatePeers();
loopUpdateFiatValue();
loopUpdateTransactions();

$('#fiat_currency_setting').change(function () {
  localStorage.setItem('fiatCurrency', $('#fiat_currency_setting').val());
  if (localStorage.fiatCurrency != '') {
    //sendCommand('get_paycoin_value ' + localStorage.fiatCurrency);
  } else {
    guiUpdate();
  }
});

$('#paste_address_button').click(function () {
  $('#send_to_address').val(clipboard.get('text'));
});

$.urlParam = function (name) {
  var results = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(window.location.href);
  if (results == null) {
    return null;
  } else {
    return results[1] || 0;
  }
}

if ($.urlParam('send_to_address') != null && $.urlParam('send_to_address') != '') {
  $('#main_tabs a[href="#send_paycoins_tab"]').tab('show');
  $('#send_to_address').val($.urlParam('send_to_address'));
}

$('#send_paycoins_button').click(function () {
  var satoshiAmount = ($('#amount_to_send').val().toString() * satoshisInAPaycoin).toFixed(0);

  console.log('Amount of send (BTC): ' + $('#amount_to_send').val().toString());
  console.log('Amount to send (Satoshis): ' + satoshiAmount);

  var command = 'send_paycoins ';
  command += $('#send_to_address').val();
  command += ' ';
  command += (satoshiAmount);
  command += ' ';
  command += window.btoa($('#password').val());

  setSendingEnabledState(false);

  sendingStatus = 'Sending paycoins...';
  guiUpdate();

  sendCommand(command);

});

function guiUpdate() {
  if (typeof availableBalance != 'undefined') {
    $('.js-balance').html(availableBalance);
  }

  if (incomingPaycoins > 0) {
    $('.js-unconfirmed-balance').html(incomingPaycoins);
  } else {
    $('#incoming').html('');
  }

  if (stakingBalance > 0 ) {
    $('.js-stake-amount').html(stakingBalance);
  } else {

  }

  /*if (typeof fiatValue != 'undefined') {
    if (fiatValue > 0 && localStorage.fiatCurrency != '') {
      $('#fiat_value').html((availableBalance * fiatValue).toFixed(2));
      $('#fiat_currency').html(localStorage.fiatCurrency);
    } else {
      $('#fiat_value').html('');
      $('#fiat_currency').html('');
    }
  }

  if (typeof mainAddress != 'undefined') {
    $('#main_address').html(mainAddress);
    qrcode.makeCode(mainAddress);
    $('#main_address_qrcode').attr('title', '');
  }

  if (typeof minFee != 'undefined') {
    $('#min_fee').html(minFee);
  }
  */

  if (typeof transactionTable != 'undefined') {
    $('.js-transactions').html(transactionTable);
  }
  /*
  if (typeof sendingStatus != 'undefined' && sendingStatus != '') {
    if (sendingStatus.startsWith('SUCCESS:::')) {
      var sendingStatusParts = sendingStatus.split(':::');
      $('#sending_status').html(sendingStatusParts[1]);
      $('#sending_status').css('display', 'block');
      $('#sending_status').attr('class', 'alert alert-success');

      setSendingEnabledState(true);
      blankSendingFields();
    } else if (sendingStatus.startsWith('ERROR:::')) {
      var sendingStatusParts = sendingStatus.split(':::');
      $('#sending_status').html(sendingStatusParts[1]);
      $('#sending_status').css('display', 'block');
      $('#sending_status').attr('class', 'alert alert-danger');

      setSendingEnabledState(true);
    } else {
      $('#sending_status').html(sendingStatus.split(':::'));
      $('#sending_status').css('display', 'block');
      $('#sending_status').attr('class', 'alert alert-info');
    }

    sendingStatus = '';
  }
  */
}

function blankSendingFields() {
  $('#send_to_address').val("");
  $('#amount_to_send').val("");
  $('#password').val("");
}

$('#amount_to_send').keyup(function () {
  var totalAmountToSend = parseFloat($('#amount_to_send').val()) + minFee;

  if ($('#amount_to_send').val() === "") {
    $('#amount_to_send').css('border-color', '');
    $('#amount_alert').html('');
  } else if ($('#amount_to_send').val() === 0) {
    $('#amount_to_send').css('border-color', '#ff0000');
    $('#amount_alert').html('You can\'t send zero paycoins!');
  } else if ($('#amount_to_send').val() < 0) {
    $('#amount_to_send').css('border-color', '#ff0000');
    $('#amount_alert').html('You can\'t send negative amounts!');
  } else if (totalAmountToSend > availableBalance) {
    $('#amount_to_send').css('border-color', '#ff0000');
    $('#amount_alert').html('You don\'t have enough paycoin!');
  } else {
    $('#amount_to_send').css('border-color', '');
    $('#amount_alert').html('');
  }
});

function setSendingEnabledState(setSendingEnabled) {
  if (setSendingEnabled == true) {
    $('#send_to_address').removeAttr("disabled");
    $('#amount_to_send').removeAttr("disabled");
    $('#password').removeAttr("disabled");
    $('#qr_code_reader_button').removeAttr("disabled");
    $('#send_paycoins_button').removeAttr("disabled");
  } else {
    $('#send_to_address').attr("disabled", "disabled");
    $('#amount_to_send').attr("disabled", "disabled");
    $('#password').attr("disabled", "disabled");
    $('#qr_code_reader_button').attr("disabled", "disabled");
    $('#send_paycoins_button').attr("disabled", "disabled");
  }
}

function loopUpdateBalance() {
  sendCommand('get_confirmed_balance');
  sendCommand('get_balance');
  sendCommand('get_staking');

  $('.js-balance').html(availableBalance);
  $('.js-unconfirmed-balance').html(incomingPaycoins);
  $('.js-stake-amount').html(stakingBalance);

  setTimeout(function () {
    loopUpdateBalance();
  }, 2500);
}

function loopUpdatePeers() {
  sendCommand('get_peer_count');

  $('.js-connected-peers').attr('data-original-title', connectedPeers + ' Peers Connected');

  setTimeout(function () {
    loopUpdatePeers();
  }, 2500);
}

function loopUpdateTransactions() {
  sendCommand('get_transactions');


  setTimeout(function () {
    loopUpdateTransactions();
  }, 2500);

}

function loopUpdateFiatValue() {


  http.get(marketURL, function(response) {
      response.pipe(concat(function(body) {
          var data = JSON.parse(body);

          if (data.error == '0') {
            fiatValue = (data.response.price.USD.avg.price).toFixed(2);
          } else {
            fiatValue = 'DOWN';
          }
      }))
  });

  if (fiatValue == 0) {
    $('.js-price').html('Price Loading');
  } else if (fiatValue == 'DOWN') {
    $('.js-price').html('Loading Error');
  } else {
    $('.js-price').html('1 XPY ≈ $' + fiatValue + ' ' + fiatCurrency);
  }



  setTimeout(function () {
    loopUpdateFiatValue();
  }, 1000 * 10 * 1);
}

function sendCommand(command) {

  if (command == 'get_info') {
    client.getInfo(function(err, info) {
      if (err) {
        return console.error(err);
      }
      console.log(info);

      return info;
    });
  } else if (command == 'get_confirmed_balance') {
    client.getBalance('*', 6, function(err, balance) {
      if (err) {
        return console.error(err);
      }
      availableBalance = balance;
      return balance;
    });
  } else if (command == 'get_balance') {
    client.getBalance('*', 0, function(err, newBalance) {
      if (err) {
        return console.error(err);
      }
      incomingPaycoins = (newBalance - availableBalance).toFixed(8);
      return newBalance;
    });
  } else if (command == 'get_staking') {
    client.getInfo(function(err, info) {
      if (err) {
        return console.error(err);
      }

      stakingBalance = info.stake.toFixed(8);
      return info.stake;
    });
  } else if (command == 'get_main_address') {
    client.getAccountAddress("", function(err, address) {
      if (err) {
        return console.error(err);
      }
      console.log(address);
      return address;
    });
  } else if (command.startsWith('send_paycoins')) {
    // Handle this later
    return
  } else if (command == 'get_transactions') {
    client.listTransactions('*', 1000, function(err, tx) {
      if (err) {
        return console.error(err);
      }

      transactionTable = createTransactionTable(tx);

      return tx
    });


    // Populate the table with some data

  } else if (command == 'get_peer_count') {
    client.getConnectionCount(function(err, count) {
      if (err) {
        return console.error(err);
      }
      connectedPeers = count;
      return count;
    });
  } else if (command == 'get_version') {
    client.getInfo(function(err, info) {
      if (err) {
        return console.error(err);
      }
      walletVersion = info.version;
      return info.version;
    });
  } else if (command == 'get_difficulty') {
    client.getDifficulty(function(err, difficulty) {
      if (err) {
        return console.error(err);
      }
      return difficulty;
    });
  }

  //guiUpdate();

}

function createTransactionTable(transactionData) {
  var transactionTable = '';

  var transactionInfo = transactionData.reverse();

  transactionTable += '<tr>';
  transactionTable += '<th></th>'; // Confirmations
  transactionTable += '<th>Date</th>';
  transactionTable += '<th>Type</th>';
  transactionTable += '<th>Address</th>';
  transactionTable += '<th>Amount</th>';
  transactionTable += '<th>Value</th>';
  transactionTable += '<th></th>'; // Links
  transactionTable += '</tr>';

  for (var i = 0; i < transactionInfo.length; i++) {
    transactionTable += '<tr>';

    txDetails = transactionInfo[i];

    if(txDetails.confirmations > 6) {
      txConfirms = '<i style="font-size:18px;color:#79C597;" class="fa fa-check-circle"></i>'
    } else {
      txConfirms = '<i style="font-size:18px;color:#B50A13;" class="fa fa-times-circle"></i>'
    };

    txDate = new Date(txDetails.time * 1000);

    transactionTable += '<td>' + txConfirms + '</td>';
    transactionTable += '<td>' + txDate.toLocaleString() + '</td>';
    transactionTable += '<td>' + txDetails.category + '</td>';
    transactionTable += '<td>' + txDetails.address + '</td>';
    transactionTable += '<td>' + txDetails.amount + '</td>';
    if (fiatValue == 'DOWN') {
      transactionTable += '<td>' + 'Error Loading Price' + '</td>';
    } else {
      transactionTable += '<td>' + (txDetails.amount * fiatValue).toFixed(2) + '</td>';
    }
    transactionTable += '<td>' + '<a target="_blank" href="https://chainz.cryptoid.info/xpy/tx.dws?' + txDetails.txid + '.htm"><i class="fa fa-external-link"></i></a>' + '</td>';

    transactionTable += '</tr>';
  }

  return transactionTable;
}
