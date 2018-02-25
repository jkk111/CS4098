const express = require('express');
const app = express.Router();
const Database = require('../database')
const Events = Database.Get('event')

app.get('/events', async(req, res) => {
  let events = await Events.get('event', {}, [ 'id','name' ]);
  let venue_cache = {};
  let ticket_cache = {};

  events.forEach(async(event) => {
    let { id, venue_id } = event;
    let tickets = await Events.get('event_tickets', { event_id: id }, 'ticket_id');
    tickets = tickets.map(async({ ticket_id }) => {
      if(ticket_cache[ticket_id]) {
        return ticket_cache[ticket_id];
      } else {
        let ticket = await Events.get('tickets', { id: ticket_id }, '*')
        ticket_cache[ticket_id] = ticket;
        return ticket
      }
    })

    if(venue_cache[venue_id]) {
      event.venue = venue_cache[venue_id];
    } else {
      let venue = await Events.get('venues', { id: venue_id }, '*')
      venue_cache[venue_id] = venue;
      event.venue = venue;
    }
  })

  res.json(events);
});

module.exports = app;
