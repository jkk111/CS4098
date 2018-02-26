let config = require('./config.json');
let { token } = config;
process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at: Promise', p, 'reason:', reason, Error.stack);
  // application specific logging, throwing an error, or other logic here
});


global.Promise = require('bluebird')
let Promise = require('bluebird')
Promise.config({
    // Enable warnings
    warnings: true,
    // Enable long stack traces
    longStackTraces: true,
    // Enable cancellation
    cancellation: true,
    // Enable monitoring
    monitoring: true
});


let request = require('request-promise').defaults({ headers: { Authorization: 'Bearer ' + token }, json: true});

const BASE_URL = 'https://www.eventbriteapi.com/v3'
const GET_VENUES = `${BASE_URL}/users/me/venues`;
const CREATE_VENUE = `${BASE_URL}/venues/`;
const CREATE_EVENT = `${BASE_URL}/events/`
const SET_PRICING = `${BASE_URL}/users/me/assortment/`
const GET_PAYMENT_METHODS = `${BASE_URL}/checkout_settings/methods/`
const SET_PAYMENT_METHOD = `${BASE_URL}/checkout_settings/`
const SET_EVENT_PAYMENT_METHOD = (id) => `${BASE_URL}/events/${id}/checkout_settings/`
const CREATE_TICKET = (id) => `${BASE_URL}/events/${id}/ticket_classes/`;
const PUBLISH_EVENT = (id) => `${BASE_URL}/events/${id}/publish/`;

let get_venues = async() => {
  return await request(GET_VENUES);
}

let create_venue = (name, address_1, address_2, city, country) => {
  return request({
    url: CREATE_VENUE,
    method: 'POST',
    body: {
      venue: {
        name,
        address: {
          address_1,
          address_2,
          city,
          country
        }
      }
    }
  })
}

let pad = (str) => {
  return (str + '').padStart(2, '0');
}

let format_date = (ts) => {
  let d = new Date(ts);
  return d.getUTCFullYear() +
  '-' + pad(d.getUTCMonth() + 1) +
  '-' + pad(d.getUTCDate()) +
  'T' + pad(d.getUTCHours()) +
  ':' + pad(d.getUTCMinutes()) +
  ':' + pad(d.getUTCSeconds()) +
  'Z';
}

let set_pricing_model = (plan = 'package1') => {
  return request({
    url: SET_PRICING,
    method: 'POST',
    body: { plan }
  })
}

let set_payment_method = (country, currency, method) => {
  return request({
    url: SET_PAYMENT_METHOD,
    method: 'POST',
    body: {
      checkout_settings: {
        country_code: country,
        currency_code: currency,
        checkout_method: method
      }
    }
  })
}

let set_event_payment_method = (event_id, payment_id) => {
  return request({
    url: SET_EVENT_PAYMENT_METHOD(event_id),
    method: 'POST',
    body: {
      checkout_settings_ids: [ payment_id ]
    }
  })
}

let get_payment_method = () => {
  return request({
    url: SET_PAYMENT_METHOD
  })
}

let payment_methods = (currency, country) => {
  return request({
    url: GET_PAYMENT_METHODS,
    body: {
      currency,
      country
    }
  })
}

let create_event = async (name, description, venue_id, start, end, timezone, currency, checkout_id, tickets) => {
  name = { html: name }
  description = { html: description }
  start = { utc: format_date(start), timezone }
  end = { utc: format_date(end), timezone }

  let event = await request({
    url: CREATE_EVENT,
    method: 'POST',
    body: {
      event: {
        name,
        description,
        start,
        end,
        currency: 'EUR',
        venue_id
      }
    }
  })

  let event_id = event.id;
  let url = CREATE_TICKET(event_id)
  console.log("Creating Tickets");
  for(var ticket of tickets) {
    await request({
      url,
      method: 'POST',
      body: {
        ticket_class: ticket
      }
    })
  }

  url = PUBLISH_EVENT(event_id);


  await set_event_payment_method(event_id, checkout_id)
  console.log("Publishing event");
  await request({
    url,
    method: 'POST'
  })

  return event;
}

let create_ticket = (name, description, quantity_total, currency, cost, sales_channels) => {
  return {
    name,
    description,
    quantity_total,
    cost,
    sales_channels
  }
}

let Create_Event = async(event, tickets, venue) => {
  if(!token) {
    console.warn("Eventbrite Not Enabled")
    return;
  }

  let pm = await get_payment_method();

  let checkout_id = null;

  if(pm.checkout_settings.length === 0) {
    console.log(await set_payment_method('IE', 'EUR', 'eventbrite'));
  } else {
    checkout_id = pm.checkout_settings[0].id
  }

  await set_pricing_model('package2');

  let event_tickets = [];
  let venue_object = await create_venue(venue.name, venue.address_1, venue.address_2, venue.city, venue.country);
  let venue_id = venue_object.id;
  for(var ticket of tickets) {
    let tick = await create_ticket(
      ticket.name,
      ticket.description,
      ticket.quantity_total,
      ticket.currency,
      ticket.cost,
      [ 'online' ]
    );

    event_tickets.push(tick);
  }

  let { id, url } = await create_event(event.name, event.description, venue_id, event.start_time, event.end_time, event.timezone, event.currency, checkout_id, event_tickets);
  return { id, url }
}

let test = async() => {

  let start_time = new Date();
  let end_time = new Date();
  start_time.setDate(start_time.getDate() + 30);
  end_time.setDate(end_time.getDate() + 31);
  let event = {
    name: "Test Event",
    description: "This is a test event",
    start_time,
    end_time,
    timezone: 'Europe/Dublin',
    currency: 'EUR',
  }

  let tickets = [
    {
      name: "single",
      description: "Single",
      quantity_total: 100,
      currency: "EUR",
      cost: 'EUR:100000'
    },
    {
      name: "table 8",
      description: "table 8",
      quantity_total: 10,
      currency: "EUR",
      cost: 'EUR:800000'
    },
    {
      name: "table 10",
      description: "table 10",
      quantity_total: 5,
      currency: "EUR",
      cost: 'EUR:1000000'
    }
  ]

  let venue = {
    name: "Test Venue",
    address_1: "42a pearse st",
    address_2: "",
    city: "Dublin",
    country: "IE"
  }

  return await Create_Event(event, tickets, venue);
}



let cleanup = async(r) => {
  console.log(r);
}

if(!module.parent) {
  test().then(cleanup);
}

module.exports = Create_Event;