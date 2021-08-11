const nodemailer = require("nodemailer");

const { 
  SMTP_HOST, 
  SMTP_PORT, 
  EMAIL_ACCOUNT, 
  EMAIL_PASSWORD 
} = process.env;

const sendTo = async (to, title, content) => {
 
  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT || 587,
    secure: SMTP_PORT == 465 ? true : false,
    auth: {
      user: EMAIL_ACCOUNT,
      pass: EMAIL_PASSWORD
    }
  });

  const info = await transporter.sendMail({
    from: `"Easydeal Emailer" <${EMAIL_ACCOUNT}>`,
    to: `${to}`,
    subject: title,
    text: content
  });

  return info;
}

exports.handler = async (req) => {
  const { email, code } = req.queryStringParameters;
  const title = `Your register verify code`;
  const content = `Your register verify code is: ${code}`;

  let body;
  try {
    const res = await sendTo(email, title, content);
    body = {
      success: true,
      messageInfo: res.messageId
    }
  } catch(err) {
    body = {
      success: false,
      message: err.toString()
    }
  }
  return { 
    statusCode: 200,
    body: JSON.stringify(body)
  }
}