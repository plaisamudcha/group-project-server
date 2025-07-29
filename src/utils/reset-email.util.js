import { fileURLToPath } from "url";
import nodemailer from "nodemailer";
import path from "path";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendResetEmail = async (user, token) => {
  const filePath = path.join(__dirname, "../templates/reset.html");
  let html = fs.readFileSync(filePath, "utf-8");
  const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`;
  html = html.replace("{{RESET_LINK}}", resetLink);

  await transporter.sendMail({
    from: `Group project ${process.env.EMAIL_USER}`,
    to: user.email,
    subject: "Reset Password",
    html,
  });
};

export default sendResetEmail;
