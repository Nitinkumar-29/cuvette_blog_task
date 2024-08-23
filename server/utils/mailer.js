const nodemailer = require("nodemailer");
require("dotenv").config();

// Create a transporter object using SMTP
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // Read email user from environment variable
    pass: process.env.EMAIL_PASS, // Read email password from environment variable
  },
  secure: false,
});

// Function to send email
async function sendEmail(to, subject, text, html) {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
      html,
    });
    console.log("Email sent!");
  } catch (error) {
    console.error("Error sending email:", error);
  }
}

module.exports = sendEmail;
