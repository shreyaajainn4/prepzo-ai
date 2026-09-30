const nodemailer = require("nodemailer")

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
})

/**
 * @description Send OTP email to user
 */
async function sendOtpEmail({ email, otp }) {
    const mailOptions = {
        from: `"Prepzo AI" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Prepzo AI — Password Reset Verification Code",
        html: `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 480px; margin: 0 auto; background: #161b22; border-radius: 12px; overflow: hidden; border: 1px solid #2a3348;">
                <div style="background: linear-gradient(135deg, #ff2d78, #cc1a5e); padding: 28px; text-align: center;">
                    <h1 style="color: white; margin: 0; font-size: 22px;">🔐 Prepzo AI — Password Reset</h1>
                </div>
                <div style="padding: 32px 28px; color: #e6edf3;">
                    <p style="margin: 0 0 8px; font-size: 15px; color: #7d8590;">Hi there,</p>
                    <p style="margin: 0 0 24px; font-size: 15px; color: #e6edf3;">Use the verification code below to reset your password:</p>
                    
                    <div style="background: #0d1117; border: 2px dashed #2a3348; border-radius: 10px; padding: 20px; text-align: center; margin-bottom: 24px;">
                        <span style="font-size: 36px; font-weight: 700; letter-spacing: 10px; color: #ff2d78; font-family: monospace;">${otp}</span>
                    </div>
                    
                    <p style="margin: 0 0 6px; font-size: 13px; color: #7d8590;">⏱️ This code expires in <strong style="color: #e6edf3;">5 minutes</strong></p>
                    <p style="margin: 0; font-size: 13px; color: #7d8590;">If you didn't request this, you can safely ignore this email.</p>
                </div>
                <div style="padding: 16px 28px; background: #0d1117; text-align: center; border-top: 1px solid #2a3348;">
                    <p style="margin: 0; font-size: 12px; color: #7d8590;">Prepzo AI — Ace your next interview</p>
                </div>
            </div>
        `
    }

    await transporter.sendMail(mailOptions)
}

module.exports = { sendOtpEmail }
