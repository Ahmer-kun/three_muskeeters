import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendLoginCode = async (email, code) => {
  try {
    const mailOptions = {
      from: `"Birthday Site" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Your Admin Login Code - Birthday Site',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
          <div style="text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 10px 10px 0 0; color: white;">
            <h1 style="margin: 0; font-size: 24px;">🎂 Birthday Site Admin</h1>
          </div>
          
          <div style="padding: 30px 20px;">
            <h2 style="color: #333; text-align: center;">Your Login Verification Code</h2>
            <p style="color: #666; text-align: center; font-size: 16px;">Use this code to complete your admin login:</p>
            
            <div style="background: #f8f9fa; border: 2px dashed #4F46E5; padding: 20px; margin: 25px 0; text-align: center; border-radius: 8px;">
              <div style="font-size: 32px; font-weight: bold; color: #4F46E5; letter-spacing: 5px;">
                ${code}
              </div>
            </div>
            
            <p style="color: #888; text-align: center; font-size: 14px;">
              ⏰ This code will expire in <strong>10 minutes</strong>
            </p>
            
            <div style="margin-top: 30px; padding: 15px; background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 5px;">
              <p style="margin: 0; color: #856404; font-size: 12px;">
                <strong>Note:</strong> If you didn't request this code, please ignore this email.
              </p>
            </div>
          </div>
          
          <div style="text-align: center; padding: 20px; background: #f8f9fa; border-radius: 0 0 10px 10px; margin-top: 20px;">
            <p style="margin: 0; color: #666; font-size: 12px;">
              Birthday Site Administration<br>
              This is an automated message, please do not reply.
            </p>
          </div>
        </div>
      `,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log(`✅ Login code sent to ${email}`);
    return true;
  } catch (error) {
    console.error('❌ Email sending failed:', error);
    return false;
  }
};
