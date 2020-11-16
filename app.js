require("dotenv").config();
var Mailgen = require("mailgen");
const MAILGUN_API_KEY = process.env.MAILGUN_API_KEY;
const MAILGUN_DOMAIN = process.env.MAILGUN_DOMAIN;
var mailgun = require("mailgun-js")({
  apiKey: MAILGUN_API_KEY,
  domain: MAILGUN_DOMAIN,
});

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

exports.aggregated_email = (event, context) => {
  const requestBody = JSON.parse(event.body);
  const txnTbank = requestBody.tbank;
  const txnOcbc = requestBody.ocbc;
  const txnDbs = requestBody.dbs;

  var dataTbank = []
  for (var i = 0; i < txnTbank.length; i++) {
    sign = txnTbank[i].transactionType === "301" ? "-": ""; // 301 is debit, 200 is credit (?) idk lol
    dataTbank.push(
      {
        date: txnTbank[i].transactionDate,
        description: txnTbank[i].narrative,
        amount: `${sign}${txnTbank[i].transactionAmount}`,
      }
    )
  }

  var dataOcbc = []
  for (var i = 0; i < txnOcbc.length; i++) {
    sign = txnOcbc[i].transactionType === "301" ? "-": ""; // 301 is debit, 200 is credit (?) idk lol
    dataOcbc.push(
      {
        date: txnOcbc[i].transactionDate,
        description: txnOcbc[i].narrative,
        amount: `${sign}${txnOcbc[i].transactionAmount}`,
      }
    )
  }

  var dataDbs = []
  for (var i = 0; i < txnDbs.length; i++) {
    sign = txnDbs[i].transactionType === "301" ? "-": ""; // 301 is debit, 200 is credit (?) idk lol
    dataDbs.push(
      {
        date: txnDbs[i].transactionDate,
        description: txnDbs[i].narrative,
        amount: `${sign}${txnDbs[i].transactionAmount}`,
      }
    )
  }

  const email = {
    body: {
      name: "JJ Goi",
      intro:
        "Here's your weekly aggregated transactions from all the different bank accounts you've linked with SmartFIN.",
      table: [
        {
          // Optionally, add a title to each table.
          title: "tBank",
          data: dataTbank,
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
        {
          // Optionally, add a title to each table.
          title: "OCBC",
          data: dataOcbc,
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
        {
          // Optionally, add a title to each table.
          title: "DBS",
          data: dataDbs,
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
    to: requestBody.email,
    subject: "[SmartFIN] Your weekly aggregated account transactions",
    text: emailText,
    html: emailBody,
  };

  mailgun.messages().send(mailOptions, function (error, body) {
    console.log(body);
  });

  console.log(
    `${requestBody.email} sent email for task smartfin.aggregated_email`
  );

  return {
    statusCode: 200,
    body: JSON.stringify(
      `{"status": 200, "message": "Email has been sent out for smartfin.aggregated_email."}`
    ),
  };

  // Optionally, preview the generated HTML e-mail by writing it to a local file
  // require("fs").writeFileSync("preview.html", emailBody, "utf8");
};
