import * as admin from "firebase-admin";
import * as nodemailer from "nodemailer";
import * as dotenv from "dotenv";
import * as functions from "firebase-functions";
import * as cors from "cors";

admin.initializeApp();
dotenv.config();

const {SENDER_EMAIL, SENDER_PASSWORD} = process.env;

const mailTransport = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: SENDER_EMAIL,
    pass: SENDER_PASSWORD,
  },
});
const corsHandler = cors({origin: true});
exports.sendEmailNotification = functions.https.onRequest((req, res) => {
  corsHandler(req, res, () => {
    const data = req.body;
    const mailOptions = {
      from: "info.truly@guestmanagement.com",
      to: data.email,
      subject: data.subject,
      text: data.message,
      html: `<p>${data.message}</p>`,
    };

    mailTransport.sendMail(mailOptions)
      .then(() => res.status(200).send("Email sent successfully"))
      .catch((error) => res.status(500).send("Error sending email: " + error));
  });
});
