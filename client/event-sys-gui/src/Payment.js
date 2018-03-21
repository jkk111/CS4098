let instance = null;

const API_KEY = 'pk_test_DOFBGq7mbSgPKcgR9ZdahUY1';
const locale = 'auto';
const CHARITY_NAME = "charity name";

class Payment {
  constructor() {
    this.checkout = window.StripeCheckout.configure({
      key: API_KEY,
      locale,
      token: async(tok) => {
        let body = {
          tok,
          transaction_id: this.transaction_id
        }

        let resp = await fetch('/payments/complete', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(body)
        })

        console.log(resp);
      }
    })
  }

  static GetInstance() {
    if(!instance) {
      instance = window.instance = new Payment();
      window.inst = instance
    }
    return instance
  }

  static async CreateDonation(donation_amount) {
    let body = {
      amount: donation_amount
    }
    let resp = await fetch('/payments/create_donation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })

    let { id, amount } = await resp.json();
    console.log(this, this.GetInstance());
    let inst = this.GetInstance()
    console.log(inst)
    inst.open(id, "Donation", amount)
  }

  static async CreateTicket(event_id, ticket_id) {
    let body = {
      event_id,
      ticket_id
    }

    let resp = await fetch('/payments/create_ticket', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })

    let { id, amount } = await resp.json();
    let inst = this.GetInstance();
    inst.open(id, 'Ticket', amount)
  }

  open(transaction_id, description, amount) {
    this.transaction_id = transaction_id;
    if(this.opened) {
      this.checkout.close()
    }
    this.checkout.open({
      name: CHARITY_NAME,
      description,
      amount,
      currency: 'EUR',
      opened: (...args) => {
        this.opened = true;
      },
      closed: () => {
        this.opened = false;
      }
    });
  }
}

window.Payment = Payment;

export default Payment