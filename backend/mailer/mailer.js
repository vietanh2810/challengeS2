const nodeMailer = require("nodemailer");

const mailer = async (toEmail, content) => {
  console.log(toEmail);
  try {
    const transporter = nodeMailer.createTransport({
      host: "smtp.seznam.cz",
      port: 465,
      secure: true,
      auth: {
        user: "vutony@seznam.cz",
        pass: "Test1234test",
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const message = {
      from: "Trio Challange <vutony@seznam.cz>",
      to: toEmail,
      subject: "Test Message",
      html: content,
    };

    transporter.sendMail(message, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Sent message: ", info.response + " & ", info.messageId);
      }
    });
  } catch (error) {
    console.error(error);
  }
};

module.exports = { mailer };
