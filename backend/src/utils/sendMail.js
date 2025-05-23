import nodemailer from "nodemailer";

const sendMail = async ({ receivers, subject, body }) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_PORT == 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const response = await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: receivers,
      subject,
      html: body,
    });
  } catch (error) {
    console.error(
      `Error while sending mail "${subject} to ${receivers}": ${error}`
    );
  }
};

export default sendMail;
