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
    }
    return instance
  }

  static async CreateDonation(amount) {
    let body = {
      amount
    }
    let resp = await fetch('/payments/create_donation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })

    let { id } = await resp.json();
    console.log(this, this.GetInstance());
    let inst = this.GetInstance()
    console.log(inst)
    inst.open(id, "Donation", amount)
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