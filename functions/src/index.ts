import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import * as dotenv from "dotenv";
import * as cors from "cors";
import * as AWS from "aws-sdk";

admin.initializeApp();
dotenv.config();
const corsHandler = cors({origin: true});

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION, // Make sure the region is also set
});

const ses = new AWS.SES({apiVersion: "2010-12-01"});

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

      const params = {
        Source: "no-reply@renterease.com",
        Destination: {
          ToAddresses: [emailRequest.email],
        },
        Message: {
          Body: {
            Text: {Data: emailRequest.message},
            Html: {Data: `<p>${emailRequest.message}</p>`},
          },
          Subject: {Data: emailRequest.subject},
        },
      };

      await ses.sendEmail(params).promise();
      return res.status(200).send("Email sent successfully");
    } catch (error) {
      return res.status(500).send("Error sending email: " + error);
    }
  });
});
