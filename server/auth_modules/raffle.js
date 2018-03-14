let express = require('express');
let Database = require('../database')
let Raffle = Database.Get('raffle');
let { create_transaction } = require('./payments');

let app = express.Router();

const second = (count) => count * 1000;

app.get('/info/:id', async(req, res) => {
  let { id } = req.params.id;
  let raffle = await Raffle.get('raffles', { id }, '*');
  raffle = raffle[0];
  if(raffle) {
    let prizes = await Raffle.get('prizes', { raffle_id: id }, '*')
    raffle.prizes = prizes;
    raffle.winners = await Raffle.get('winners', { raffle_id: id })
  } else {
    res.status(400).send({ success: false, error: 'ENOENT' })
  }
});

app.get('/create_ticket/:id/', async(req, res) => {
  let raffle_id = req.params.id;
  let raffle = await Raffle.get('raffles', { id: raffle_id }, '*')
  raffle = raffle[0];
  let { user_id } = req;
  let amount = raffle.ticket_price;
  let transaction_id =  await create_transaction(user_id, raffle_id, "Raffle Ticket", amount, "RaffleTicket");
  res.send({ id: transaction_id });
})

app.get('/active', async(req, res) => {
  let raffles = await Raffle.get('raffles', { ended: false }, '*')
  res.send(raffles)
})

let check_raffles = async() => {
  let start = Date.now();
  let raffles = await Raffle.get('raffles', { ended: false, end_date: { comparator: '<=', value: start }})

  for(var raffle of raffles) {
    let raffle_id = raffle.id
    let tickets = await Raffle.get('tickets', { raffle_id }, '*', 'ORDER BY ID ASC');
    let prizes = await Raffle.get('prizes', { raffle_id }, '*');
    for(var prize of prizes) {
      let prize_id = prize.id
      let winner = prize.winning_value % tickets.length;
      let winning_ticket = tickets[winner];
      if(!winning_ticket) {
        break;
      }
      let user_id = winning_ticket.user_id;
      await Raffle.add('winners', { raffle_id, user_id, prize_id })
    }
    await Raffle.update('raffles', { ended: true }, { raffle_id })
  }
}

setInterval(check_raffles, second(30));
check_raffles();
module.exports = app;