import nodemailer from "nodemailer";

export async function SendMail({ to, subject, emailHtml }) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.NODE_MAILER_USER_EMAIL,
      pass: process.env.NODE_MAILER_APP_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.NODE_MAILER_FROM_USER,
    to,
    subject,
    html: emailHtml,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      return Response.json({ message: "Email not sent" });
    } else {
      console.log("Email sent: " + info.response);
      return Response.json({ message: "Email sent" });
    }
  });
}

export async function sendPasswordResetEmail(
  userEmail,
  userName,
  resetPasswordUrl
) {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.NODE_MAILER_USER_EMAIL,
        pass: process.env.NODE_MAILER_APP_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.NODE_MAILER_FROM_USER,
      to: userEmail,
      subject: "Reset Your Password",
      html: `<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Your Password</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }

        .container {
            background-color: #f9f9f9;
            border-radius: 5px;
            padding: 30px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }

        h1 {
            color: #2c3e50;
            margin-bottom: 20px;
        }

        .button {
            display: inline-block;
            background-color: #3498db;
            color: white;
            text-decoration: none;
            padding: 10px 20px;
            border-radius: 5px;
            margin-top: 20px;
        }

        .button:hover {
            background-color: #2980b9;
        }

        .footer {
            margin-top: 30px;
            font-size: 12px;
            color: #7f8c8d;
        }
    </style>
</head>

<body>
    <div class="container">
        <h1>Reset Your Password</h1>
        <p>Hello ${userName},</p>
        <p>We received a request to reset your password. If you didn't make this request, you can ignore this email.</p>
        <p>To reset your password, click the button below:</p>
        <a href="${resetPasswordUrl}" class="button">Reset Password</a>
        <p>If the button doesn't work, you can copy and paste the following link into your browser:</p>
        <p>${resetPasswordUrl}</p>
        <p>This link will expire in 24 hours for security reasons.</p>
        <p>If you need any assistance, please don't hesitate to contact our support team.</p>
    </div>
</body>

</html>`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        return Response.json({ message: "Email not sent" });
      } else {
        console.log("Email sent: " + info.response);
        return Response.json({ message: "Email sent" });
      }
    });
  } catch (error) {
    console.error("Error sending email:", error);
  }
}
