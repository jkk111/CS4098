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
  console.log(SET_PAYMENT_METHOD, country, currency, method)
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

let create_event = async (name, description, start, end, timezone, currency, checkout_id, tickets) => {
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
        currency: 'EUR'
      }
    }
  })

  let event_id = event.id;
  let url = CREATE_TICKET(event_id)
  for(var ticket of tickets) {
    console.log(await request({
      url,
      method: 'POST',
      body: {
        ticket_class: ticket
      }
    }))
  }

  url = PUBLISH_EVENT(event_id);


  console.log(await set_event_payment_method(event_id, checkout_id))
  console.log(await request({
    url,
    method: 'POST'
  }))
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

let test = async() => {
  // console.log(await payment_methods('EUR', 'IE'));
  // return;
  let pm = await get_payment_method();

  let checkout_id = null;

  if(pm.checkout_settings.length === 0) {
    console.log(await set_payment_method('IE', 'EUR', 'eventbrite'));
  } else {
    checkout_id = pm.checkout_settings[0].id
  }

  console.log(await set_pricing_model('package2'));
  console.log(await create_venue('test_venue', '12a Macken St', '', 'Dublin', 'IE'))
  console.log(await get_venues())

  let start = new Date();
  let end = new Date();
  start.setDate(start.getDate() + 30);
  end.setDate(end.getDate() + 31);

  let single = create_ticket("single", "A lonely person ticket", 100, 'EUR', 'EUR:100000', [ 'online' ])
  let table_8 = create_ticket("table of 8", "A lonely person with some friends", 10, 'EUR', 'EUR:800000', [ 'online' ])
  let table_10 = create_ticket("table of 10", "A group", 5, 'EUR', 'EUR:1000000', [ 'online' ])

  let tickets = [
    single,
    table_8,
    table_10
  ]

  console.log(tickets)

  await create_event("Test Event", "Just a test event", start.getTime(), end.getTime(), 'Europe/Dublin', 'EUR', checkout_id, tickets)
}

let cleanup = async() => {

}

test().then(cleanup);