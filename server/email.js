const fs = require('fs')
let nodemailer = require('nodemailer');
let conf = null;

class Email {
  constructor(sender, to, subject, text, html) {
    if(Array.isArray(to)) {
      to = Array.join(', ');
    }
    this.sender = sender;
    this.to = to;
    this.subject = subject;
    this.text = text;
    this.html = html || text;
  }

  toJSON() {
    return {
      from: this.sender,
      to: this.to,
      subject: this.subject,
      text: this.text,
      html: this.html
    }
  }
}

let _send = (conf, options, cb) => {
  let smtpTransport = nodemailer.createTransport({
    host: conf.smtp_host,
    port: conf.smtp_port,
    secure: conf.smtp_port == 465,
    auth: {
      user: conf.smtp_user,
      pass: conf.smtp_pass
    }
  });

  if(options.toJSON) {
    options = options.toJSON();
  }

  // Register User
  smtpTransport.sendMail(options, cb)
};

let sendMail = (mail) => {
  if(conf == null) {
    try {
      conf = require('./config.json')
    } catch(e) {
      console.log(e);
      throw e;
    }
  }
  _send(conf, mail)
};

module.exports = {
  _send,
  sendMail,
  Email
};