const jwt = require('jsonwebtoken');

// Verify JWT token
const authenticate = (req, res, next) => {
    try {
        // Check for token in cookies or Authorization header
        const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

        if (!token) {
            console.log('No token found in request');
            return res.status(401).json({
                success: false,
                message: 'Authentication required. Please login.'
            });
        }

        // Log token for debugging (first/last 10 chars only for security)
        console.log('Token received:', token ? `${token.substring(0, 10)}...${token.substring(token.length - 10)}` : 'null');

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // { id, email, role }
        next();
    } catch (error) {
        console.error('Authentication error:', error);
        return res.status(401).json({
            success: false,
            message: 'Invalid or expired token. Please login again.'
        });
    }
};

// Check if user has required role
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required.'
            });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `Access denied. This action requires ${roles.join(' or ')} role.`
            });
        }

        next();
    };
};

module.exports = { authenticate, authorize };
