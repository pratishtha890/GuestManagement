import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import * as nodemailer from "nodemailer";
import * as dotenv from "dotenv";
import * as cors from "cors";

admin.initializeApp();
dotenv.config();
const corsHandler = cors({origin: true});

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

exports.sendEmailNotification = functions.https.onRequest((req, res) => {
  corsHandler(req, res, async () => {
    if (req.method !== "POST") {
      return res.status(405).send("Method Not Allowed");
    }

    const data = req.body;
    const emailRequest = {
      email: data.email,
      subject: data.subject,
      message: data.message,
      timestamp: new Date(),
    };

    try {
      await admin.firestore().collection("emailRequests").add(emailRequest);

      const mailOptions = {
        from: "info.truly@guestmanagement.com",
        to: emailRequest.email,
        subject: emailRequest.subject,
        text: emailRequest.message,
        html: `<p>${emailRequest.message}</p>`,
      };

      await mailTransport.sendMail(mailOptions);
      return res.status(200).send("Email sent successfully");
    } catch (error) {
      return res.status(500).send("Error sending email: " + error);
    }
  });
});
