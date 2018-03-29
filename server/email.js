const fs = require('fs')
let nodemailer = require('nodemailer');
let conf = null;
let pug = require('pug')
let { parse } = require('emailify')

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
  if(conf.noEmail || !options.to)
    return
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
  try {
    smtpTransport.sendMail(options, cb)
  } catch(e) {}
};

let sendMail = (mail) => {
  if(conf == null) {
    try {
      conf = require('./config.json')
    } catch(e) {
      console.log(e); // Log to console, but don't care about the error, happens
    }
  }
  _send(conf, mail)
};

let render_template = (template, data) => {
  let mail = pug.renderFile(`email_templates/${template}.pug`, data);
  return mail;
}

let sendTemplate = (template, data = {}) => {
  if(!data.to) {
    return console.warn("No Recipient Specified")
  }

  console.log('[EMAIL]'.blue, template, data)
  try {
    let mail = render_template(template, data)
    parse(mail, (_, mail) => {
      if(_) { console.log(_) }
      let m = new Email(data.from, data.to, data.subject, data.text, mail);
      sendMail(m);
    })
  } catch(e) {
    console.log(e);
  }
}

module.exports = {
  _send,
  sendMail,
  Email,
  sendTemplate,
  render_template
};
