const nodemailer = require('nodemailer');
const { google } = require('googleapis');

const CLIENT_ID =
  "902053089590-mnb2rpcl2r2ijiq2dkof51ndko56n51q.apps.googleusercontent.com";
const CLIENT_SECRET = "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";
const REDIRECT_URL = "https://developers.google.com/oauthplayground";
const REFRESH_TOKEN =
  "1//049-1R_luDgX1CgYIARAAGAQSNwF-L9IrZ8i5EgVx9zW7OHUQM7lYytWdjTIi3W8zcspBpOH8YufFLb1DZ7gfGjoEXLIL3AevnDI";
const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

// Function to send email
const sendEmail = async (toEmail, subject, message) => {
  const accessToken = await oAuth2Client.getAccessToken();
  oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: 'swethapugal05@gmail.com', // Your Gmail address
      clientId: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
      refreshToken: REFRESH_TOKEN,
      accessToken: accessToken,
    },
  });

  const mailOptions = {
    from: 'swethapugal05@gmail.com',
    to: toEmail,
    subject: subject,
    text: message
  };

  await transporter.sendMail(mailOptions);
};

exports.mailService = async (req, res) => {
    const { to, subject, message } = req.body;

  try {
    await sendEmail(to, subject, message);
    console.log('Request received for /send-email');
    res.status(200).json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ success: false, error: 'Failed to send email' });
  }
};
// Endpoint to send email
// app.post('/send-email', async (req, res) => {
//   const { to, subject, message } = req.body;

//   try {
//     await sendEmail(to, subject, message);
//     console.log('Request received for /send-email');
//     res.status(200).json({ success: true, message: 'Email sent successfully' });
//   } catch (error) {
//     console.error('Error sending email:', error);
//     res.status(500).json({ success: false, error: 'Failed to send email' });
//   }
// });