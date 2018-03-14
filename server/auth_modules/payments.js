let stripe = require('stripe')('sk_test_jBpQwfBbA1f5k3B6tNEDMe7P')
let crypto = require('crypto');
let express = require('express');
let app = new express.Router();
let bodyParser = require('body-parser')
let Database = require('../database');
let Payments = Database.Get('payment')

let create_transaction = async(user_id, data_id, description, amount, type) => {
  let id = crypto.randomBytes(8).toString('base64')
  data_id = data_id || crypto.randomBytes(4).toString('base64')
  let insert = {
    id,
    data_id,
    user_id,
    description,
    amount,
    type
  }

  Payments.add('transactions', insert);

  return id;
}

app.post('/create_donation', bodyParser.json(), async(req, res) => {
  let amount = req.body.amount;
  let id = await create_transaction(req.user_id, null, "Donation", amount, 'donation');
  res.send({ id });
})

app.post('/complete', bodyParser.json(), async(req, res) => {
  let customer_body = {
    email: req.body.tok.email,
    source: req.body.tok.id
  }

  let customer = await stripe.customers.create(customer_body);
  let transaction = await Payments.get('transactions', { id: req.body.transaction_id })
  transaction = transaction[0];

  if(!transaction) {
    return res.status(400).send({ success: false })
  }

  let charge_body = {
    amount: transaction.amount,
    currency: 'EUR',
    customer: customer.id
  }

  let charge = await stripe.charges.create(charge_body)

  res.send({ success: charge.status === 'succeeded' })
})

module.exports = {
  router: app,
  create_transaction: create_transaction
}