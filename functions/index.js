/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import { onRequest } from "firebase-functions/v2/https";
import { defineString } from "firebase-functions/params";
import nodemailer from "nodemailer";

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

// Define environment variables
const emailUser = defineString("EMAIL_USER");
const emailPass = defineString("EMAIL_PASS");

// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: emailUser.value(),
    pass: emailPass.value(),
  },
});

export const sendContactEmail = onRequest({
  cors: true,
  region: "us-central1"
}, async (req, res) => {
  try {
    const { data } = req.body;
    const { name, email, phone, message } = data;

    // Validate required fields
    if (!name || !email || !message) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }

    // Email content
    const mailOptions = {
      from: emailUser.value(),
      to: "creative@nextgem.agency",
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || "Not provided"}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ error: "Failed to send email" });
  }
});
