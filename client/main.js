'use strict';

$(document).ready(function() {
  var balDataRef = new Firebase('https://bankapp.firebaseio.com/balances');
  var depoDataRef = new Firebase('https://bankapp.firebaseio.com/deposits');
  var withDataRef = new Firebase('https://bankapp.firebaseio.com/withdraws');
  var debtDataRef = new Firebase('https://bankapp.firebaseio.com/fees');

  var balance = 0;

  $('#depobtn').click(function() {
    var amount = $('#input').val();
    var date = new Date().toDateString();

    depoDataRef.push({amount: amount, date: date});
    balance += parseInt(amount);
    balDataRef.update({balance: balance});
  });

  $('#withbtn').click(function() {
    var amount = $('#input').val();
    var date = new Date().toDateString();

    withDataRef.push({amount: amount, date: date});
    balance -= parseInt(amount);
    var debt = 0;
    if (balance < 0) {
      debt -= 50;
      balance += debt;
      debtDataRef.push({debt:debt, date: date});
    }
    balDataRef.update({balance: balance});
  });

  balDataRef.on('value', function(data) {
    var bal = data.val();
    $('#balance').text('Balance: $' + bal.balance);
    balance = bal.balance;
  });

  depoDataRef.on('child_added', function(data) {
    var depoData = data.val();
    displayData(depoData.amount, depoData.date, 'dep');
  });

  withDataRef.on('child_added', function(data) {
    var withData = data.val();
    displayData(withData.amount, withData.date, 'wit');
  });

  debtDataRef.on('child_added', function(data) {
    var feesData = data.val();
    displayData(feesData.debt, feesData.date, 'fees');
  });

  function displayData(amount, date, id) {
    var $li = $('<li>');
    $li.text('$' + amount + ' ' + date);
    $('#' + id).append($li);
  }
});
