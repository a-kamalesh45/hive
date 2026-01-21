const { createTransporter, generateOTP, getOTPEmailHTML, storeOTP, verifyOTP } = require('../config/email');
const Member = require('../models/Member');

// Send OTP to user's email
const sendOTP = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email is required'
            });
        }

        // Only require existing user when caller explicitly requests it
        // e.g. password reset flow should set `requireExistingUser: true`
        if (req.body.requireExistingUser) {
            const userExists = await Member.exists({ email });
            if (!userExists) {
                return res.status(404).json({
                    success: false,
                    message: 'User with this email does not exist'
                });
            }
        }

        // Generate 6-digit OTP
        const otp = generateOTP();

        // Store OTP with expiration
        storeOTP(email, otp);

        // Create email transporter
        const transporter = createTransporter();

        // Email options
        // If user exists we can personalize the template; otherwise use a generic name
        const user = await Member.findOne({ email }).select('name');
        const recipientName = user ? user.name : 'User';

        const mailOptions = {
            from: `"HIVE Query Management" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: '🔐 Your Verification Code - HIVE',
            html: getOTPEmailHTML(otp, recipientName)
        };

        // Send email
        await transporter.sendMail(mailOptions);

        console.log(`OTP sent to ${email}: ${otp}`); // For development - remove in production

        return res.status(200).json({
            success: true,
            message: 'Verification code sent to your email',
            // In development, you might want to return the OTP for testing
            // Remove this in production
            ...(process.env.NODE_ENV === 'development' && { otp })
        });

    } catch (error) {
        console.error('Error sending OTP:', error);

        // Handle specific email errors
        if (error.code === 'EAUTH') {
            return res.status(500).json({
                success: false,
                message: 'Email authentication failed. Please contact administrator.'
            });
        }

        return res.status(500).json({
            success: false,
            message: 'Failed to send verification code',
            error: error.message
        });
    }
};

// Verify OTP
const verifyOTPCode = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({
                success: false,
                message: 'Email and OTP are required'
            });
        }

        // Verify OTP
        const result = verifyOTP(email, otp);

        if (!result.valid) {
            return res.status(400).json({
                success: false,
                message: result.message
            });
        }

        return res.status(200).json({
            success: true,
            message: result.message
        });

    } catch (error) {
        console.error('Error verifying OTP:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to verify OTP',
            error: error.message
        });
    }
};

module.exports = { sendOTP, verifyOTPCode };
