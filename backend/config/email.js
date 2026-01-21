const nodemailer = require('nodemailer');

// Create reusable transporter
const createTransporter = () => {
    return nodemailer.createTransport({
        service: 'gmail', // or use host/port for other services
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD // Use app password for Gmail
        }
    });
};

// Generate 6-digit OTP
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// HTML Email Template for OTP
const getOTPEmailHTML = (otp, userName = 'User') => {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verification Code</title>
        <style>
            body {
                margin: 0;
                padding: 0;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background-color: #f5f5f5;
            }
            .container {
                max-width: 600px;
                margin: 40px auto;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                border-radius: 20px;
                overflow: hidden;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            }
            .header {
                background: rgba(255, 255, 255, 0.1);
                padding: 40px 30px;
                text-align: center;
                border-bottom: 1px solid rgba(255, 255, 255, 0.2);
            }
            .logo {
                width: 60px;
                height: 60px;
                background: white;
                border-radius: 15px;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                font-size: 32px;
                margin-bottom: 20px;
            }
            .header h1 {
                color: white;
                margin: 0;
                font-size: 28px;
                font-weight: 700;
            }
            .content {
                background: white;
                padding: 50px 40px;
                text-align: center;
            }
            .greeting {
                color: #333;
                font-size: 18px;
                margin-bottom: 20px;
            }
            .message {
                color: #666;
                font-size: 16px;
                line-height: 1.6;
                margin-bottom: 40px;
            }
            .otp-container {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                border-radius: 15px;
                padding: 30px;
                margin: 30px auto;
                display: inline-block;
                box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
            }
            .otp-label {
                color: rgba(255, 255, 255, 0.9);
                font-size: 14px;
                font-weight: 600;
                letter-spacing: 1px;
                text-transform: uppercase;
                margin-bottom: 15px;
            }
            .otp-code {
                font-size: 48px;
                font-weight: 700;
                color: white;
                letter-spacing: 8px;
                font-family: 'Courier New', monospace;
                text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
            }
            .validity {
                background: #fff3cd;
                border-left: 4px solid #ffc107;
                padding: 15px 20px;
                margin: 30px 0;
                border-radius: 8px;
                text-align: left;
            }
            .validity-text {
                color: #856404;
                font-size: 14px;
                margin: 0;
            }
            .footer {
                background: #f8f9fa;
                padding: 30px 40px;
                text-align: center;
                border-top: 1px solid #dee2e6;
            }
            .footer-text {
                color: #6c757d;
                font-size: 13px;
                line-height: 1.6;
                margin: 0;
            }
            .security-note {
                background: #d1ecf1;
                border-left: 4px solid #0c5460;
                padding: 15px 20px;
                margin: 20px 0;
                border-radius: 8px;
                text-align: left;
            }
            .security-note p {
                color: #0c5460;
                font-size: 13px;
                margin: 0;
            }
            @media only screen and (max-width: 600px) {
                .container {
                    margin: 20px;
                }
                .content {
                    padding: 30px 20px;
                }
                .otp-code {
                    font-size: 36px;
                    letter-spacing: 4px;
                }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">🐝</div>
                <h1>HIVE Query Management</h1>
            </div>
            
            <div class="content">
                <p class="greeting">Hello ${userName},</p>
                <p class="message">
                    You've requested a verification code. Use the code below to verify your identity and proceed with your request.
                </p>
                
                <div class="otp-container">
                    <div class="otp-label">Your Verification Code</div>
                    <div class="otp-code">${otp}</div>
                </div>
                
                <div class="validity">
                    <p class="validity-text">
                        ⏱️ <strong>This code will expire in 10 minutes</strong>. Please use it promptly.
                    </p>
                </div>
                
                <div class="security-note">
                    <p>
                        🔒 <strong>Security Notice:</strong> Never share this code with anyone. Our team will never ask for your verification code.
                    </p>
                </div>
                
                <p class="message" style="margin-top: 30px;">
                    If you didn't request this code, please ignore this email or contact our support team immediately.
                </p>
            </div>
            
            <div class="footer">
                <p class="footer-text">
                    This is an automated message from HIVE Query Management System.<br>
                    Please do not reply to this email.
                </p>
                <p class="footer-text" style="margin-top: 15px;">
                    © ${new Date().getFullYear()} HIVE. All rights reserved.
                </p>
            </div>
        </div>
    </body>
    </html>
    `;
};

// HTML template for resolution notifications
const getResolutionEmailHTML = (query, resolverName = 'Team') => {
        const title = `Your query has been resolved: ${query.title || 'Query update'}`;
        const reply = query.reply || 'Your query has been resolved by our team.';
        const askedBy = (query.askedBy && (query.askedBy.name || query.askedBy.email)) || 'Participant';

        return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <title>${title}</title>
            <style>
                body { font-family: system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial; background:#f6f8fb; margin:0; }
                .card { max-width:640px; margin:36px auto; background:white; border-radius:12px; overflow:hidden; box-shadow:0 10px 30px rgba(2,6,23,0.08); }
                .header { padding:28px; background:linear-gradient(90deg,#6d28d9,#4f46e5); color:white }
                .content { padding:28px; color:#0f172a }
                .reply { background:#f3f4f6; padding:16px; border-radius:8px; margin-top:12px; color:#111827 }
                .footer { padding:20px; font-size:13px; color:#6b7280; background:#fafafa }
            </style>
        </head>
        <body>
            <div class="card">
                <div class="header">
                    <h2 style="margin:0;font-size:20px">${title}</h2>
                    <p style="margin:6px 0 0;opacity:0.9;font-size:13px">Resolved by ${resolverName}</p>
                </div>
                <div class="content">
                    <p>Hi ${askedBy},</p>
                    <p>${reply}</p>
                    <div class="reply">
                        <strong>Resolution details:</strong>
                        <p style="margin:8px 0 0">${reply}</p>
                    </div>
                    <p style="margin-top:18px">You can view the full details in your HIVE dashboard.</p>
                </div>
                <div class="footer">This is an automated message from HIVE. Do not reply to this email.</div>
            </div>
        </body>
        </html>
        `;
};

// Store OTPs temporarily (in production, use Redis or database)
const otpStore = new Map();

// Store OTP with expiration
const storeOTP = (email, otp) => {
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes
    otpStore.set(email, { otp, expiresAt });

    // Clean up expired OTPs
    setTimeout(() => {
        otpStore.delete(email);
    }, 10 * 60 * 1000);
};

// Verify OTP
const verifyOTP = (email, otp) => {
    const stored = otpStore.get(email);

    if (!stored) {
        return { valid: false, message: 'OTP not found or expired' };
    }

    if (Date.now() > stored.expiresAt) {
        otpStore.delete(email);
        return { valid: false, message: 'OTP has expired' };
    }

    if (stored.otp !== otp) {
        return { valid: false, message: 'Invalid OTP' };
    }

    otpStore.delete(email);
    return { valid: true, message: 'OTP verified successfully' };
};

module.exports = {
    createTransporter,
    generateOTP,
    getOTPEmailHTML,
    storeOTP,
    verifyOTP,
    getResolutionEmailHTML
};


