# Email Verification Setup Guide

## ✅ Implementation Complete

### Features Added:
1. **Backend**: Email sending with nodemailer
2. **API Routes**: `/api/send-otp` and `/api/verify-otp`
3. **Frontend**: Email verification modal component
4. **Beautiful Email Template**: Professional 6-digit OTP email design

---

## 📧 Email Configuration (Gmail Setup)

### Step 1: Enable 2-Factor Authentication
1. Go to your Google Account: https://myaccount.google.com
2. Navigate to **Security**
3. Enable **2-Step Verification**

### Step 2: Create App Password
1. Go to https://myaccount.google.com/apppasswords
2. Select app: **Mail**
3. Select device: **Other (Custom name)**
4. Enter name: **HIVE Query Management**
5. Click **Generate**
6. Copy the 16-character password (e.g., `abcd efgh ijkl mnop`)

### Step 3: Update .env File
Open `backend/.env` and update:

```env
# Email Configuration (Gmail)
EMAIL_USER=your-actual-email@gmail.com
EMAIL_PASSWORD=abcdefghijklmnop
```

**Important**: 
- Remove spaces from the app password
- Use your actual Gmail address
- Keep this secure (never commit to git)

---

## 🚀 API Endpoints

### 1. Send OTP
**POST** `/api/send-otp`

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Verification code sent to your email",
  "otp": "123456"  // Only in development mode
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "User with this email does not exist"
}
```

### 2. Verify OTP
**POST** `/api/verify-otp`

**Request Body:**
```json
{
  "email": "user@example.com",
  "otp": "123456"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "OTP verified successfully"
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Invalid OTP"
}
```

---

## 🎨 Email Template Features

The email template includes:
- ✅ Beautiful gradient header with HIVE branding
- ✅ Large, clear 6-digit code display
- ✅ 10-minute expiration notice
- ✅ Security warnings
- ✅ Mobile responsive design
- ✅ Professional styling with bee emoji 🐝

---

## 💻 Frontend Integration

### Usage in Login Page
The email verification modal is already integrated in the login page:

```jsx
import EmailVerification from '../components/EmailVerification';

// In your component:
const [showEmailVerification, setShowEmailVerification] = useState(false);

// Trigger the modal:
<button onClick={() => setShowEmailVerification(true)}>
  Verify Email
</button>

// Render the modal:
{showEmailVerification && (
  <EmailVerification
    onClose={() => setShowEmailVerification(false)}
    onVerified={() => {
      // Handle successful verification
      alert('Email verified!');
    }}
  />
)}
```

### Modal Features:
- Two-step process (Email → OTP)
- Real-time validation
- Error handling
- Resend OTP functionality
- Beautiful gradient design
- Mobile responsive

---

## 🧪 Testing

### 1. Start the backend:
```bash
cd backend
npm start
```

### 2. Configure email in .env
Update EMAIL_USER and EMAIL_PASSWORD

### 3. Test from frontend:
1. Open login page
2. Click "Verify Email / Forgot Password?"
3. Enter an existing user's email
4. Check your email for the 6-digit code
5. Enter the code to verify

### 4. Development Mode:
In development, the OTP is also logged to console and returned in API response for easier testing.

---

## 🔒 Security Features

1. **OTP Expiration**: Codes expire after 10 minutes
2. **One-time Use**: OTPs are deleted after verification
3. **Email Validation**: Only existing users receive codes
4. **Secure Storage**: OTPs stored in memory (use Redis in production)
5. **App Password**: Gmail app passwords for secure SMTP

---

## 📝 Production Recommendations

For production deployment:

1. **Use Redis** for OTP storage instead of in-memory Map
2. **Rate Limiting**: Implement rate limiting on send-otp endpoint
3. **Email Service**: Consider using SendGrid, AWS SES, or similar
4. **Remove Dev OTP**: Don't return OTP in API response
5. **HTTPS Only**: Ensure all traffic is over HTTPS
6. **Environment Variables**: Use proper secret management

Example Redis implementation:
```javascript
// config/redis.js
const redis = require('redis');
const client = redis.createClient({
  url: process.env.REDIS_URL
});

// Store OTP
await client.setEx(`otp:${email}`, 600, otp); // 10 min expiry

// Verify OTP
const storedOTP = await client.get(`otp:${email}`);
```

---

## 🎯 Next Steps

You can extend this functionality for:
- Password reset flow
- Two-factor authentication
- Email change verification
- Account activation
- Security alerts

---

## 📧 Email Preview

The email looks like this:

```
┌─────────────────────────────────┐
│  🐝 HIVE Query Management       │
├─────────────────────────────────┤
│  Hello User,                    │
│                                 │
│  Your Verification Code:        │
│                                 │
│      ┌───────────┐             │
│      │  123456   │             │
│      └───────────┘             │
│                                 │
│  ⏱️ Expires in 10 minutes      │
│  🔒 Never share this code      │
│                                 │
│  © 2026 HIVE. All rights reserved │
└─────────────────────────────────┘
```

---

## ✨ Files Created/Modified

**Backend:**
- ✅ `config/email.js` - Email configuration and utilities
- ✅ `controllers/EmailController.js` - OTP send/verify logic
- ✅ `routes/api.js` - Added email routes
- ✅ `.env` - Email credentials

**Frontend:**
- ✅ `components/EmailVerification.jsx` - Verification modal
- ✅ `pages/LoginPage.jsx` - Integrated email verification

---

## 🐛 Troubleshooting

### Error: "EAUTH - Invalid credentials"
- Check EMAIL_USER is correct
- Verify app password has no spaces
- Ensure 2FA is enabled on Gmail

### Error: "User with this email does not exist"
- Email must exist in database
- Check spelling/case sensitivity

### Email not received:
- Check spam folder
- Verify email configuration
- Check console for errors
- Test with gmail.com address first

---

All set! Your email verification system is ready to use! 🎉
