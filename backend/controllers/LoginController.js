const MEMBER = require('../models/Member.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


async function login(req, res) {
    const { email, password, role, pin } = req.body;

    try {
        const existingUser = await MEMBER.findOne({ email });
        if (!existingUser) {
            return res.status(400).json({ message: 'User with this email does not exist.' });
        }

        // Verify role if provided
        if (role && existingUser.role !== role) {
            return res.status(403).json({ message: 'Access denied. Invalid role for this account.' });
        }

        // Validate PIN for Admin and Head roles
        if (existingUser.role === 'Admin' || existingUser.role === 'Head') {
            if (!pin) {
                return res.status(400).json({ message: `PIN is required for ${existingUser.role} role.` });
            }

            const requiredPin = existingUser.role === 'Admin' ? process.env.ADMIN_PIN : process.env.HEAD_PIN;
            if (pin !== requiredPin) {
                return res.status(403).json({ message: 'Invalid PIN. Access denied.' });
            }
        }

        const isPasswordValid = await bcrypt.compare(password, existingUser.password);

        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid password.' });
        }

        const { password: _, ...userWithoutPassword } = existingUser.toObject();
        const token = jwt.sign(
            { id: existingUser._id, email: existingUser.email, role: existingUser.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
        }).status(200).json({
            message: 'User logged in successfully',
            user: userWithoutPassword,
            token: token
        });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error: error.message });
    }
}

module.exports = { login };
