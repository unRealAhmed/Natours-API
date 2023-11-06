const nodemailer = require('nodemailer');

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = 'Natours Team <ahmed@natours.io>';
  }

  // Create a new email transport based on the environment
  newTransport() {
    if (process.env.NODE_ENV === 'production') {
      return nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.GOOGLE_EMAIL,
          pass: process.env.GOOGLE_PASS_KEY,
        },
      });
    }

    // Development environment
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  }

  // Send an email with specified subject and message
  async send(subject, message) {
    // Define email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      text: message,
    };

    // Create a transport and send the email
    await this.newTransport().sendMail(mailOptions);
  }

  // Send a welcome email
  async sendWelcomeEmail(subject, message) {
    await this.send(subject, message);
  }

  // Send a password reset email
  async sendPasswordResetEmail(subject, message) {
    await this.send(subject, message);
  }
};
