# CORS Error Fix - Quick Checklist ✅

## Your Issue
- ❌ CORS error when trying to login after deployment
- ❌ `TypeError: Failed to fetch` in console

## Root Cause
The backend CORS configuration doesn't allow requests from your deployed frontend URL.

---

## 🚨 IMMEDIATE FIX REQUIRED

### Step 1: Update Backend Environment Variable
In your **backend hosting platform** (Render/Railway/Heroku/etc.):

1. Go to Environment Variables settings
2. Set `FRONTEND_URL` to your deployed frontend URL:
   ```
   FRONTEND_URL=https://your-actual-frontend-url.vercel.app
   ```
   ⚠️ **IMPORTANT**: 
   - Use the EXACT URL (including `https://`)
   - NO trailing slash at the end
   - Copy from your browser address bar when visiting your frontend

3. **Restart/Redeploy** your backend server

### Step 2: Update Frontend Environment Variable
In your **frontend hosting platform** (Vercel/Netlify/etc.):

1. Go to Environment Variables settings
2. Set `VITE_API_URL` to your deployed backend URL:
   ```
   VITE_API_URL=https://your-actual-backend-url.onrender.com
   ```
   ⚠️ **IMPORTANT**:
   - Use the EXACT URL (including `https://`)
   - NO trailing slash at the end
   - Should be the API endpoint URL

3. **Rebuild and Redeploy** your frontend

---

## ✅ Verification Steps

### 1. Test Backend Health
Open in browser: `https://your-backend-url.com/health`

Should see:
```json
{
  "status": "OK",
  "message": "Server is running",
  "environment": "production"
}
```

### 2. Check Backend Logs
After restarting backend, check logs for:
```
Frontend URL: https://your-frontend-url.vercel.app
```

If it shows `undefined` or `localhost`, the environment variable isn't set correctly.

### 3. Test Login
1. Clear browser cache (Ctrl + Shift + Delete)
2. Go to your frontend URL
3. Open DevTools (F12) → Console tab
4. Try to login
5. Check for:
   - ✅ No CORS errors
   - ✅ No "Failed to fetch" errors
   - ✅ Successful login

### 4. Check Network Tab
In DevTools → Network tab:
1. Try login
2. Look at the login request
3. Check Response Headers for:
   ```
   access-control-allow-origin: https://your-frontend-url
   access-control-allow-credentials: true
   ```

---

## 🔧 What I Changed in Your Code

### Backend (server.js)
- ✅ Updated CORS to handle multiple origins
- ✅ Added better error logging for blocked origins
- ✅ Made it more production-ready

The new CORS configuration will:
- Allow your deployed frontend URL (from `FRONTEND_URL` env var)
- Still allow localhost for development
- Log blocked origins to help debug issues

---

## 📋 Example Configuration

### Backend Environment Variables
```env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/dbname
JWT_SECRET=your-secret-key-min-32-chars
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=your-email@gmail.com
FRONTEND_URL=https://query-management.vercel.app
PORT=5000
NODE_ENV=production
```

### Frontend Environment Variables
```env
VITE_API_URL=https://query-api.onrender.com
```

---

## 🐛 Still Having Issues?

### Issue: Still getting CORS error

**Check:**
1. Did you restart/redeploy backend? (Required!)
2. Did you rebuild frontend? (Required!)
3. Are both URLs using `https://`? (Must match!)
4. Did you clear browser cache?

**Debug:**
```javascript
// In browser console, check:
console.log(import.meta.env.VITE_API_URL)
// Should show your backend URL
```

### Issue: "Failed to fetch" persists

**Check:**
1. Is backend actually running? (Test `/health` endpoint)
2. Can you access backend URL from browser?
3. Are you getting SSL/certificate errors?
4. Check if backend crashed (view logs)

### Issue: Environment variables not working

**Frontend (Vite):**
- Must start with `VITE_` prefix
- Must rebuild after changing
- Use `import.meta.env.VITE_API_URL`

**Backend:**
- Check hosting platform docs for how to set env vars
- Some platforms need restart after setting vars
- Verify with `console.log(process.env.FRONTEND_URL)` in code

---

## 📞 Quick Commands

### Check Backend Logs (Example for Render)
```bash
# In Render dashboard → Your service → Logs
# Look for: "Frontend URL: ..."
```

### Test Backend Locally with Production Settings
```bash
cd backend
# Create .env with production values
FRONTEND_URL=https://your-frontend.vercel.app npm start
# Try login from deployed frontend
```

### Rebuild Frontend Locally
```bash
cd frontend
npm run build
npm run preview
# Test against production backend
```

---

## 🎯 Success Criteria

You'll know it's fixed when:
- ✅ No CORS errors in console
- ✅ Login works successfully
- ✅ Cookies are set (check Application tab)
- ✅ Dashboard loads after login
- ✅ All API calls work

---

## 📝 Remember

**Every time you change environment variables:**
1. Backend: Restart/Redeploy
2. Frontend: Rebuild and Redeploy
3. Clear browser cache
4. Test again

**Common Mistakes:**
- ❌ Forgetting to redeploy after changing env vars
- ❌ Adding trailing slash to URLs
- ❌ Using `http://` instead of `https://` in production
- ❌ Typos in environment variable names
- ❌ Not waiting for deployment to complete before testing

---

Good luck! The fix is simple - just set those two environment variables correctly and redeploy. 🚀
