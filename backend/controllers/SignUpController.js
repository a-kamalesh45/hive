const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const MEMBER = require('../models/Member.js');

async function signup(req, res) {
    const { name, email, password, role, pin } = req.body;

    try {
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Name, email, and password are required.' });
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
                message: 'User added successfully',
                user: {
                    id: newUser._id,
                    name,
                    email,
                    role: newUser.role
                },
                token: token
            });

    } catch (error) {
        console.error('Error adding user:', error);
        res.status(500).json({ message: 'Error adding user', error: error.message });
    }
}

module.exports = { signup };
