const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.zoho.eu',
  port: 465,
  secure: true,
  auth: {
    user: 'no-reply@aafcareconnect.com',
    pass: 'allaboutfostering@css26',
  },
});

async function run() {
  try {
    const info = await transporter.sendMail({
      from: '"AAF CareConnect" <no-reply@aafcareconnect.com>',
      to: 'sachinraj9876543@gmail.com',
      subject: 'Test Email from SMTP',
      html: '<b>This is a test email to verify SMTP delivery.</b>',
    });
    console.log('Email sent successfully!', info.messageId);
    console.log(info);
    process.exit(0);
  } catch (error) {
    console.error('Failed to send email:', error);
    process.exit(1);
  }
}

run();
