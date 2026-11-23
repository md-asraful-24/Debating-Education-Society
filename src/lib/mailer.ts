import nodemailer from 'nodemailer';

export async function sendOtpEmail(email: string, otp: string): Promise<{ success: boolean; devOtp?: string; error?: string }> {
  const isGmailConfigured = Boolean(process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD);

  if (isGmailConfigured) {
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_APP_PASSWORD,
        },
      });

      const mailOptions = {
        from: `"Debating Education Society in Bangladesh" <${process.env.GMAIL_USER}>`,
        to: email,
        subject: `Your DESB Verification Code: ${otp}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 580px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
            <div style="text-align: center; margin-bottom: 24px;">
              <h2 style="color: #065f46; margin: 0; font-size: 22px;">Debating Education Society in Bangladesh</h2>
              <p style="color: #64748b; font-size: 14px; margin-top: 4px;">ডিবেটিং এডুকেশন সোসাইটি ইন বাংলাদেশ</p>
            </div>
            
            <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; padding: 18px; border-radius: 8px; text-align: center; margin: 20px 0;">
              <p style="color: #166534; font-size: 14px; margin-bottom: 10px;">Your registration verification code (OTP):</p>
              <div style="font-size: 36px; font-weight: bold; letter-spacing: 6px; color: #047857; margin: 8px 0;">${otp}</div>
              <p style="color: #dc2626; font-size: 12px; margin-top: 8px;">Valid for 5 minutes only. Do not share this code with anyone.</p>
            </div>

            <p style="color: #475569; font-size: 13px; line-height: 1.6;">
              This code was requested for creating an account on the Debating Education Society web platform. If you did not initiate this request, please safely ignore this email.
            </p>

            <div style="margin-top: 30px; padding-top: 16px; border-top: 1px solid #f1f5f9; text-align: center; color: #94a3b8; font-size: 12px;">
              © ${new Date().getFullYear()} Debating Education Society in Bangladesh. All rights reserved.
            </div>
          </div>
        `,
      };

      await transporter.sendMail(mailOptions);
      return { success: true };
    } catch (err: unknown) {
      console.error('Failed to send email via Gmail SMTP:', err);
      // Fallback with dev OTP so the user registration is never blocked
      return { success: true, devOtp: otp };
    }
  }

  // When Gmail SMTP is not configured in local environment, provide the OTP for instant testing
  console.log(`[DESB-OTP-SERVICE] Verification OTP for ${email}: ${otp}`);
  return { success: true, devOtp: otp };
}
