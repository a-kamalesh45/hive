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

// HTML template for resolution notifications (Minimalistic)
const getResolutionEmailHTML = (query, resolverName = 'Team') => {
    const queryId = query._id ? query._id.toString().slice(-6).toUpperCase() : 'N/A';
    const reply = query.reply || 'Your query has been resolved by our team.';
    const askedBy = (query.askedBy && (query.askedBy.name || query.askedBy.email)) || 'there';

    return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <title>Query Resolved</title>
            <style>
                body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background:#f9fafb; margin:0; padding:20px; }
                .container { max-width:600px; margin:0 auto; background:white; border-radius:8px; overflow:hidden; box-shadow:0 1px 3px rgba(0,0,0,0.1); }
                .header { padding:24px; background:#10b981; color:white; }
                .content { padding:32px 24px; color:#111827; line-height:1.6; }
                .query-box { background:#f3f4f6; padding:16px; border-radius:6px; margin:16px 0; border-left:3px solid #10b981; }
                .footer { padding:16px 24px; font-size:12px; color:#6b7280; background:#f9fafb; text-align:center; }
                .button { display:inline-block; padding:12px 24px; background:#10b981; color:white; text-decoration:none; border-radius:6px; margin-top:16px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h2 style="margin:0; font-size:20px; font-weight:600;">Query Resolved</h2>
                    <p style="margin:8px 0 0; opacity:0.95; font-size:14px;">Query #${queryId}</p>
                </div>
                <div class="content">
                    <p style="margin:0 0 16px;">Hi ${askedBy},</p>
                    <p style="margin:0 0 16px;">Your query has been successfully resolved by <strong>${resolverName}</strong>.</p>
                    <div class="query-box">
                        <p style="margin:0; font-size:14px;">${reply}</p>
                    </div>
                    <p style="margin:16px 0 0;">Thank you for using HIVE Query Management.</p>
                </div>
                <div class="footer">This is an automated message. Please do not reply to this email.</div>
            </div>
        </body>
        </html>
        `;
};

// HTML template for assignment notification to head (Minimalistic)
const getAssignmentEmailHTML = (query, headName = 'there') => {
    const queryId = query._id ? query._id.toString().slice(-6).toUpperCase() : 'N/A';
    const issue = query.issue || 'No description provided';
    const askedByName = (query.askedBy && query.askedBy.name) || 'A participant';

    return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <title>New Query Assigned</title>
            <style>
                body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background:#f9fafb; margin:0; padding:20px; }
                .container { max-width:600px; margin:0 auto; background:white; border-radius:8px; overflow:hidden; box-shadow:0 1px 3px rgba(0,0,0,0.1); }
                .header { padding:24px; background:#f59e0b; color:white; }
                .content { padding:32px 24px; color:#111827; line-height:1.6; }
                .query-box { background:#fffbeb; padding:16px; border-radius:6px; margin:16px 0; border-left:3px solid #f59e0b; }
                .footer { padding:16px 24px; font-size:12px; color:#6b7280; background:#f9fafb; text-align:center; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h2 style="margin:0; font-size:20px; font-weight:600;">New Query Assigned</h2>
                    <p style="margin:8px 0 0; opacity:0.95; font-size:14px;">Query #${queryId}</p>
                </div>
                <div class="content">
                    <p style="margin:0 0 16px;">Hi ${headName},</p>
                    <p style="margin:0 0 16px;">A new query has been assigned to you by the admin.</p>
                    <div class="query-box">
                        <p style="margin:0 0 8px; font-size:12px; color:#92400e; font-weight:600; text-transform:uppercase;">Query Details</p>
                        <p style="margin:0; font-size:14px;"><strong>From:</strong> ${askedByName}</p>
                        <p style="margin:8px 0 0; font-size:14px;"><strong>Issue:</strong> ${issue}</p>
                    </div>
                    <p style="margin:16px 0 0;">Please check your HIVE dashboard to view and resolve this query.</p>
                </div>
                <div class="footer">This is an automated message. Please do not reply to this email.</div>
            </div>
        </body>
        </html>
        `;
};

// HTML template for head assignment notification to user (Minimalistic)
const getHeadAssignedEmailHTML = (query, headName = 'a team member', userName = 'there') => {
    const queryId = query._id ? query._id.toString().slice(-6).toUpperCase() : 'N/A';

    return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <title>Head Assigned to Your Query</title>
            <style>
                body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background:#f9fafb; margin:0; padding:20px; }
                .container { max-width:600px; margin:0 auto; background:white; border-radius:8px; overflow:hidden; box-shadow:0 1px 3px rgba(0,0,0,0.1); }
                .header { padding:24px; background:#3b82f6; color:white; }
                .content { padding:32px 24px; color:#111827; line-height:1.6; }
                .info-box { background:#eff6ff; padding:16px; border-radius:6px; margin:16px 0; border-left:3px solid #3b82f6; }
                .footer { padding:16px 24px; font-size:12px; color:#6b7280; background:#f9fafb; text-align:center; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h2 style="margin:0; font-size:20px; font-weight:600;">Head Assigned</h2>
                    <p style="margin:8px 0 0; opacity:0.95; font-size:14px;">Query #${queryId}</p>
                </div>
                <div class="content">
                    <p style="margin:0 0 16px;">Hi ${userName},</p>
                    <p style="margin:0 0 16px;">Good news! Your query has been assigned to a team head for resolution.</p>
                    <div class="info-box">
                        <p style="margin:0; font-size:14px;"><strong>Assigned to:</strong> ${headName}</p>
                    </div>
                    <p style="margin:16px 0 0;">They will review and resolve your query soon. You'll be notified once it's resolved.</p>
                </div>
                <div class="footer">This is an automated message. Please do not reply to this email.</div>
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
    getResolutionEmailHTML,
    getAssignmentEmailHTML,
    getHeadAssignedEmailHTML
};


