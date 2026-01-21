const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const MEMBER = require('../models/Member.js');
const { verifyOTP } = require('../config/email');

async function signup(req, res) {
    const { name, email, password, role, pin, otp } = req.body;

    try {
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Name, email, and password are required.' });
        }

        // REQUIRE EMAIL VERIFICATION via OTP
        if (!otp) {
            return res.status(400).json({
                message: 'Email verification required. Please verify your email first.',
                requiresVerification: true
            });
        }

        // Verify the OTP
        const otpResult = verifyOTP(email, otp);
        if (!otpResult.valid) {
            return res.status(400).json({
                message: otpResult.message,
                requiresVerification: true
            });
        }

        // Validate PIN for Admin and Head roles
        const userRole = role || 'User';
        if (userRole === 'Admin' || userRole === 'Head') {
            if (!pin) {
                return res.status(400).json({ message: `PIN is required for ${userRole} role.` });
            }

            const requiredPin = userRole === 'Admin' ? process.env.ADMIN_PIN : process.env.HEAD_PIN;
            if (pin !== requiredPin) {
                return res.status(403).json({ message: 'Invalid PIN. Access denied.' });
            }
        }

        const existingUser = await MEMBER.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User with this email already exists.' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new MEMBER({
            name,
            email,
            password: hashedPassword,
            role: userRole
        });
        await newUser.save();

        // Create user object without password (same structure as login)
        const { password: _, ...userWithoutPassword } = newUser.toObject();

        const token = jwt.sign(
            { id: newUser._id, email: newUser.email, role: newUser.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        })
            .status(201)
            .json({
                message: 'User registered successfully with verified email',
                user: userWithoutPassword,
                token: token
            });

    } catch (error) {
        console.error('Error adding user:', error);
        res.status(500).json({ message: 'Error adding user', error: error.message });
    }
}

module.exports = { signup };
