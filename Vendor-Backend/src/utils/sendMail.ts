import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // Use `true` for port 465, `false` for all other ports
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD
    },
  });

  // async..await is not allowed in global scope, must use a wrapper
export async function sendMail(to: string, html: string) {
    // send mail with defined transport object
    const info = await transporter.sendMail({
      from: '"Kaw 👻" <healthcarellm@gmail.com>', // sender address
      to: to, // list of receivers
      subject: "Verify Email ✔", // Subject line
      html: html, // html body
    });
  
    console.log("Message sent: %s", info.messageId);
    // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
  }