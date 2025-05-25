const nodemailer = require("nodemailer");
const config = require("../config");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: config.email.user,
    pass: config.email.pass,
  },
});

const sendFeedbackEmail = (feedback) => {
  const mailOptions = {
    from: config.email.user,
    to: config.email.admin,
    subject: `New Feedback: ${feedback.subject}`,
    html: `
            <h2>New Feedback Received</h2>
            <p><strong>Name:</strong> ${feedback.name}</p>
            <p><strong>Email:</strong> ${feedback.email}</p>
            <p><strong>Subject:</strong> ${feedback.subject}</p>
            <p><strong>Rating:</strong> ${feedback.rating}/5</p>
            <p><strong>Message:</strong></p>
            <p>${feedback.message}</p>
        `,
  };

  return transporter.sendMail(mailOptions);
};

module.exports = {
  sendFeedbackEmail,
};
