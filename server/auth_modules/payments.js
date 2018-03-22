let stripe = require('stripe')('sk_test_jBpQwfBbA1f5k3B6tNEDMe7P')
let crypto = require('crypto');
let express = require('express');
let app = new express.Router();
let bodyParser = require('body-parser')
let Database = require('../database');
let Payments = Database.Get('payment')
let Events = Database.Get('event')

const TICKET = 'ticket';

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
  res.send({ id, amount });
})



app.post('/create_ticket', bodyParser.json(), async(req, res) => {
  let { event_id, ticket_id } = req.body;
  let { user_id } = req;

  let user_ticket = await Events.add('user_tickets', { event_id, ticket_id, user_id });
  user_ticket = user_ticket.lastID;

  let ticket = await Events.get('tickets', { id: ticket_id }, '*');
  let ticket_price = ticket[0].price;

  let event_tickets = await Events.get('event_tickets', { event_id, ticket_id });

  if(event_tickets[0].available <= 0) {
    return res.send({ success: false, error: 'UNAVAIL' })
  }

  let id = await create_transaction(user_id, user_ticket, "Event Ticket", ticket_price, TICKET);

  res.send({ id, amount: ticket_price });
});

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

  if(transaction.type === TICKET) {
    let user_ticket = await Events.get('user_tickets', { id: transaction.data_id });
    let ticket = await Events.get('event_tickets', { event_id: user_ticket[0].event_id, ticket_id: user_ticket[0].ticket_id });
    ticket = ticket[0];

    if(ticket.available <= 0) {
      return res.send({ success: false, error: 'UNAVAIL' })
    }

    await Events.update('event_tickets', { available: ticket.available - 1 }, { id: ticket.id })
  }

  let charge_body = {
    amount: transaction.amount,
    currency: 'EUR',
    customer: customer.id
  }

  let charge = await stripe.charges.create(charge_body)

  if(charge.status === 'succeeded') {
    await Payments.update('transactions', { finished: 1 }, { id: transaction.id })
  }
  res.send({ success: charge.status === 'succeeded' })
})

module.exports = {
  router: app,
  create_transaction: create_transaction,
  TICKET
}