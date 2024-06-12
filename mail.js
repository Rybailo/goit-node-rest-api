import "dotenv/config";
import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const msg = {
  to: "rybailo.orest@gmail.com",
  from: "rybailo.orest@gmail.com",
  subject: "Sending with Twilio SendGrid is Fun",
  text: "and easy to do anywhere, even with Node.js",
  html: "<strong>and easy to do anywhere, even with Node.js</strong>",
};

/* sgMail.send(msg).then(console.log).catch(console.error); */
function sendMail(msg) {
  return sgMail.send(msg);
}

export default {
  sendMail,
};
