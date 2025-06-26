import nodemailer from 'nodemailer';

// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER, // your email
    pass: process.env.SMTP_PASSWORD, // your password or app-specific password
  },
});

// Email templates
const emailTemplates = {
  signup: (userName) => ({
    subject: 'Welcome to Novi - Get Started!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Welcome to Novi! 🎉</h2>
        <p>Hello ${userName},</p>
        <p>Thank you for joining Novi. We're excited to have you on board!</p>
        <p>You can now start using your account and explore all our features.</p>
        <p>If you have any questions or need assistance, feel free to reach out to our support team.</p>
        <p>Best regards,<br>The Novi Team</p>
      </div>
    `,
  }),

  welcomeAfterVerification: (userName) => ({
    subject: 'Welcome to Novi - Your Account is Verified!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Email Verified Successfully! 🎉</h2>
        <p>Hello ${userName},</p>
        <p>Your email has been successfully verified. Welcome to the Novi community!</p>
        <p>You can now access all features of your account.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/login" 
             style="background-color: #7c3aed; color: white; padding: 12px 24px; 
                    text-decoration: none; border-radius: 5px; display: inline-block;">
            Go to Login
          </a>
        </div>
        <p>If you have any questions, feel free to reach out to our support team.</p>
        <p>Best regards,<br>The Novi Team</p>
      </div>
    `,
  }),

  passwordReset: (userName) => ({
    subject: 'Novi - Password Reset Request',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Password Reset Request</h2>
        <p>Hello ${userName},</p>
        <p>We received a request to reset your password. Click the button below to create a new password:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="[Reset_Link]" 
             style="background-color: #7c3aed; color: white; padding: 12px 24px; 
                    text-decoration: none; border-radius: 5px; display: inline-block;">
            Reset Password
          </a>
        </div>
        <p>If you didn't request a password reset, please ignore this email.</p>
        <p>Best regards,<br>The Novi Team</p>
      </div>
    `,
  }),
};

// Send email function
export const sendEmail = async (to, templateName, data) => {
  try {
    const template = emailTemplates[templateName](data.userName);
    
    const mailOptions = {
      from: process.env.SMTP_FROM || '"Novi Team" <noreply@novi.com>',
      to,
      subject: template.subject,
      html: template.html.replace('[Verification_Link]', data.verificationLink || '')
                        .replace('[Reset_Link]', data.resetLink || ''),
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: error.message };
  }
}; 