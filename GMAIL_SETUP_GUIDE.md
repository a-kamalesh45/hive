# Gmail SMTP Setup Guide

## Problem
You're getting "Email authentication failed" because Gmail requires an **App Password** for SMTP authentication, not your regular Gmail password.

## Solution: Generate a Gmail App Password

### Step 1: Enable 2-Step Verification
1. Go to https://myaccount.google.com/security
2. Under "How you sign in to Google", click on **2-Step Verification**
3. Follow the prompts to enable it (you'll need your phone)

### Step 2: Generate App Password
1. After enabling 2-Step Verification, go back to https://myaccount.google.com/security
2. Under "How you sign in to Google", click on **2-Step Verification**
3. Scroll down to the bottom and click on **App passwords**
4. You may need to sign in again
5. In the "Select app" dropdown, choose **Mail**
6. In the "Select device" dropdown, choose **Other (Custom name)**
7. Enter a name like "HIVE Query System"
8. Click **Generate**
9. Google will show you a 16-character password (e.g., `abcd efgh ijkl mnop`)

### Step 3: Update Your .env File
1. Open `backend/.env`
2. Replace the `EMAIL_PASSWORD` with the 16-character app password (remove spaces):
   ```env
   EMAIL_USER=services.hive.noreply@gmail.com
   EMAIL_PASSWORD=abcdefghijklmnop
   ```
3. Save the file
4. Restart your backend server

## Alternative: Use a Different Email Service

If you don't want to set up 2-Step Verification, you can:
- Use a different email provider (Outlook, Yahoo, etc.)
- Use a dedicated email service like SendGrid, Mailgun, or AWS SES

## Test the Setup

After updating the password:
1. Restart your backend server
2. Try signing up with a new account
3. Check if you receive the OTP email

## Common Issues

### Still Getting "Email authentication failed"?
- Make sure you copied the app password correctly (no spaces)
- Make sure 2-Step Verification is enabled
- Try generating a new app password

### Not receiving emails?
- Check your spam folder
- Verify the EMAIL_USER is correct in .env
- Check the backend console for error messages
