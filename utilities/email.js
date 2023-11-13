const nodemailer = require('nodemailer');
const EventEmitter = require('events');

const emailEventEmitter = new EventEmitter();

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = 'Natours Team <ahmed@natours.io>';
  }

  // Send an email with specified subject and message
  async send(subject, message, html) {
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      text: message,
      html
    };

    // Emit the 'sendEmail' event with mailOptions
    emailEventEmitter.emit('sendEmail', mailOptions);
  }

  async sendWelcomeEmail() {
    const subject = 'Welcome To Natours Family🚀';
    const message = `Welcome to the Natours community, ${this.firstName}! 🌍 We're thrilled to have you join us on this exciting adventure. Get ready to explore breathtaking destinations, make new friends, and create unforgettable memories. Start your journey now and let's make every trip extraordinary together! 🎉✈️`

    await this.send(subject, message);
  }

  async sendPasswordResetEmail(html) {
    const subject = "Password Reset Request for Your Natours Account 🛡️"
    await this.send(subject, undefined, html);
  }
};

emailEventEmitter.on('sendEmail', async (mailOptions) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GOOGLE_EMAIL,
      pass: process.env.GOOGLE_PASS_KEY,
    },
  });

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
  }
});