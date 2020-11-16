require("dotenv").config();
var Mailgen = require("mailgen");

// Configure mailgen by setting a theme and your product info
const mailGenerator = new Mailgen({
  theme: "default",
  product: {
    // Appears in header & footer of e-mails
    name: "SmartFIN",
    link: "https://ourfin.tech/",
    // Optional product logo
    // logo: 'https://mailgen.js/img/logo.png'
  },
});


const MAILGUN_API_KEY = process.env.MAILGUN_API_KEY;
const MAILGUN_DOMAIN = process.env.MAILGUN_DOMAIN;
var mailgun = require("mailgun-js")({
  apiKey: MAILGUN_API_KEY,
  domain: MAILGUN_DOMAIN,
});

const email = {
  body: {
    name: "JJ Goi",
    intro:
      "Here's your weekly aggregated transactions from all the different bank accounts you've linked with SmartFIN.",
    table: [
      {
        // Optionally, add a title to each table.
        title: "tBank",
        data: [
          {
            date: "16 Nov 20 | 22:38",
            description: "Automated task by SmartFIN (salary, SGD 500.0)",
            amount: "$1.99",
          },
          {
            date: "16 Nov 20 | 22:38",
            description: "Automated task by SmartFIN (salary, SGD 500.0)",
            amount: "$1.99",
          },
        ],
        columns: {
          // Optionally, customize the column widths
          customWidth: {
            date: "20%",
            amount: "15%",
          },
          // Optionally, change column text alignment
          customAlignment: {
            amount: "right",
          },
        },
      },
    ],
    action: {
      instructions:
        "To update your notification settings, you can click on the button below.",
      button: {
        color: "#22BC66", // Optional action button color
        text: "Update",
        link: "https://ourfin.tech/recipes/add/aggregated_email",
      },
    },
    outro:
      "Need help, or have questions? Just reply to this email, we'd love to help.",
  },
};

// Generate an HTML email with the provided contents
var emailBody = mailGenerator.generate(email);

// Generate the plaintext version of the e-mail (for clients that do not support HTML)
var emailText = mailGenerator.generatePlaintext(email);

// Send
var mailOptions = {
  from: "SmartFIN <hello@ourfin.tech>",
  to: "jiajian.goi.2018@sis.smu.edu.sg",
  subject: "[SmartFIN] Your weekly aggregated account transactions",
  text: emailText,
  html: emailBody,
};

mailgun.messages().send(mailOptions, function (error, body) {
  console.log(body);
});
