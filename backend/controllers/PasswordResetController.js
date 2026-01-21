const bcrypt = require('bcryptjs');
const MEMBER = require('../models/Member.js');
const { verifyOTP } = require('../config/email');

async function resetPassword(req, res) {
    const { email, otp, newPassword } = req.body;

    try {
        if (!email || !otp || !newPassword) {
            return res.status(400).json({
                message: 'Email, OTP, and new password are required.'
            });
        }

        // Verify the OTP
        const otpResult = verifyOTP(email, otp);
        if (!otpResult.valid) {
            return res.status(400).json({ message: otpResult.message });
        }

        // Find user by email
        const user = await MEMBER.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update password
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({
            message: 'Password reset successfully. You can now login with your new password.'
        });

    } catch (error) {
        console.error('Error resetting password:', error);
        res.status(500).json({
            message: 'Error resetting password',
            error: error.message
        });
    }
}

module.exports = { resetPassword };
