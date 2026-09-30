const crypto = require("crypto")
const bcrypt = require("bcryptjs")
const userModel = require("../models/user.model")
const otpModel = require("../models/otp.model")
const { sendOtpEmail } = require("../services/email.service")


/**
 * @name sendOtpController
 * @description Send a 6-digit OTP to the user's email for password reset
 * @access Public
 */
async function sendOtpController(req, res) {
    try {
        const { email } = req.body

        if (!email) {
            return res.status(400).json({
                message: "Please provide an email address"
            })
        }

        // Check if user exists
        const user = await userModel.findOne({ email })
        if (!user) {
            return res.status(404).json({
                message: "No account found with this email address"
            })
        }

        // Delete any existing OTPs for this email
        await otpModel.deleteMany({ email })

        // Generate 6-digit OTP
        const otp = crypto.randomInt(100000, 999999).toString()

        // Save OTP to database (auto-expires in 5 min via TTL)
        await otpModel.create({ email, otp })

        // Send OTP email
        await sendOtpEmail({ email, otp })

        res.status(200).json({
            message: "Verification code sent to your email"
        })

    } catch (error) {
        console.log("Send OTP Error:", error)
        res.status(500).json({
            message: "Failed to send verification code. Please try again."
        })
    }
}


/**
 * @name verifyOtpAndResetPasswordController
 * @description Verify OTP and reset user's password
 * @access Public
 */
async function verifyOtpAndResetPasswordController(req, res) {
    try {
        const { email, otp, newPassword } = req.body

        if (!email || !otp || !newPassword) {
            return res.status(400).json({
                message: "Please provide email, OTP and new password"
            })
        }

        if (newPassword.length < 8) {
            return res.status(400).json({ message: "Password must be at least 8 characters" })
        }
        if (!/[A-Z]/.test(newPassword)) {
            return res.status(400).json({ message: "Password must include an uppercase letter" })
        }
        if (!/[a-z]/.test(newPassword)) {
            return res.status(400).json({ message: "Password must include a lowercase letter" })
        }
        if (!/[0-9]/.test(newPassword)) {
            return res.status(400).json({ message: "Password must include a number" })
        }
        if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(newPassword)) {
            return res.status(400).json({ message: "Password must include a special character" })
        }

        // Find the OTP record
        const otpRecord = await otpModel.findOne({ email, otp })

        if (!otpRecord) {
            return res.status(400).json({
                message: "Invalid or expired verification code"
            })
        }

        // Hash new password and update user
        const hash = await bcrypt.hash(newPassword, 10)
        await userModel.findOneAndUpdate({ email }, { password: hash })

        // Delete all OTPs for this email
        await otpModel.deleteMany({ email })

        res.status(200).json({
            message: "Password reset successfully"
        })

    } catch (error) {
        console.log("Reset Password Error:", error)
        res.status(500).json({
            message: "Failed to reset password. Please try again."
        })
    }
}


module.exports = {
    sendOtpController,
    verifyOtpAndResetPasswordController
}
