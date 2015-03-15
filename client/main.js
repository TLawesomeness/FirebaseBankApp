'use strict';

$(document).ready(function() {
  var balDataRef = new Firebase('https://bankapp.firebaseio.com/balances');
  var depoDataRef = new Firebase('https://bankapp.firebaseio.com/deposits');
  var withDataRef = new Firebase('https://bankapp.firebaseio.com/withdraws');
  var feesDataRef = new Firebase('https://bankapp.firebaseio.com/fees');

  var balance = 0;

  $('#depo').click(function() {
    var amount = $('#input').val();
    var date = new Date().toDateString();
    console.log(amount);
    balance += parseInt(amount);

    depoDataRef.push({amount: amount, date: date});
    balDataRef.update({balance: balance});
  });

  depoDataRef.on('child_added', function(data) {
    var depoData = data.val();
    showDeposit(depoData.amount, depoData.date);

    function showDeposit(amount, date) {
      var $depositLi = $('<li>');
      $depositLi.addClass('depositli');
      $depositLi.text('$' + amount + ' ' + date);
      $('#dep').append($depositLi);
    }
  });

  $('#with').click(function() {
    var amount = $('#input').val();
    var date = new Date().toDateString();
    console.log(amount);
    balance -= parseInt(amount);

    withDataRef.push({amount: amount, date: date});

    var debt = 0;
    if (balance < 0) {
      debt -= 50;
      balance += debt;
      feesDataRef.push({debt:debt, date: date});
    }
    balDataRef.update({balance: balance});
  });

  balDataRef.on('value', function(data) {
    var bal = data.val();
    console.log('current balance: ' + balance);
    $('#balance').text('Balance: $' + bal.balance);
  });

  withDataRef.on('child_added', function(data) {
    var withData = data.val();
    showWithdraw(withData.amount, withData.date);

    function showWithdraw(amount, date) {
      var $withdrawLi = $('<li>');
      $withdrawLi.addClass('withdrawli');
      $withdrawLi.text('$' + amount + ' ' + date);
      $('#wit').append($withdrawLi);
    }
  });

  feesDataRef.on('child_added', function(data) {
    var feesData = data.val();
    showDebt(feesData.debt, feesData.date);

    function showDebt(debt, date) {
      var $debtLi = $('<li>');
      $debtLi.addClass('debtli');
      $debtLi.text('$' + debt + ' ' + date);
      $('#fees').append($debtLi);
    }
  });

});
