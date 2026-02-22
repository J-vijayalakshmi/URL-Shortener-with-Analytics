# Testing Guide - URL Shortener with Authentication

## ✅ Features Implemented

### Core Features
- ✅ URL shortening with random short codes
- ✅ Custom URL aliases (user-defined)
- ✅ User authentication (JWT)
- ✅ QR code generation for each URL
- ✅ Rate limiting (security)
- ✅ Redis caching
- ✅ Advanced analytics

### Pages Created
1. **index.html** - Main page (anonymous + authenticated users)
2. **login.html** - User login page
3. **signup.html** - User registration page
4. **dashboard.html** - User dashboard (view/manage URLs)

---

## 🧪 Testing Steps

### 1. Test Anonymous URL Creation (No Login)
1. Open browser: `http://localhost:3000`
2. You should see "Login" and "Sign Up" buttons in top-right
3. Enter a URL: `https://example.com/test-page`
4. Click "Shorten URL"
5. ✅ Expected: Short URL created, QR code displayed, analytics shown
6. **Custom alias field should NOT be visible** (anonymous users)

### 2. Test User Registration
1. Click "Sign Up" button
2. Fill in:
   - Name: `Test User`
   - Email: `test@example.com`
   - Password: `password123` (min 6 chars)
3. Click "Sign Up"
4. ✅ Expected: Redirected to `/dashboard.html`
5. ✅ Expected: See "Welcome" message with your name

### 3. Test User Login
1. Go to `http://localhost:3000/login.html`
2. Enter credentials:
   - Email: `test@example.com`
   - Password: `password123`
3. Click "Login"
4. ✅ Expected: Redirected to dashboard
5. ✅ Expected: See all your URLs listed

### 4. Test Dashboard Features
1. On dashboard page:
   - ✅ Create new URL with custom alias: `my-link`
   - ✅ See QR code button for each URL
   - ✅ Click QR button → Modal pops up with QR code
   - ✅ Click "Copy" button → URL copied to clipboard
   - ✅ Click "Delete" → URL removed from list
2. Check URL count updates after each operation

### 5. Test Custom Alias (Authenticated Users)
1. Go to main page: `http://localhost:3000`
2. Should see your name + "Dashboard" + "Logout" buttons
3. ✅ **Custom Alias field should now be VISIBLE**
4. Enter URL: `https://google.com`
5. Enter custom alias: `my-google`
6. Click "Shorten URL"
7. ✅ Expected: `http://localhost:3000/my-google` created
8. Test the custom URL: `http://localhost:3000/my-google`
9. ✅ Expected: Redirects to Google

### 6. Test Custom Alias Validation
Try these invalid aliases (should show errors):
- ❌ `ab` → Too short (min 3 chars)
- ❌ `this-is-a-very-long-alias-name` → Too long (max 20)
- ❌ `my link` → Spaces not allowed
- ❌ `my@link` → Special chars not allowed
- ✅ `my-link-123` → Valid (letters, numbers, hyphens, underscores)

### 7. Test Rate Limiting
**Global Rate Limit:** 100 requests per 15 minutes
1. Open browser console (F12)
2. Run this script 110 times rapidly:
```javascript
for (let i = 0; i < 110; i++) {
  fetch('/api/analytics/test');
}
```
3. ✅ Expected: After ~100 requests, you'll get `429 Too Many Requests`

**URL Shortening Limit:** 20 URLs per hour
1. Try to create 25 URLs rapidly
2. ✅ Expected: After 20 URLs, error message: "Too many requests"

### 8. Test QR Code Download/Scan
1. Create a URL from dashboard or main page
2. QR code appears automatically
3. Use phone camera app to scan QR code
4. ✅ Expected: Phone opens shortened URL

### 9. Test Analytics
1. Create a short URL: `https://github.com`
2. Share the short URL with friends (or open in different browsers)
3. Click the short URL multiple times from:
   - Chrome
   - Edge/Firefox
   - Mobile phone
   - Different locations (use VPN for testing)
4. View analytics on main page
5. ✅ Expected: See details:
   - Total clicks
   - IP addresses
   - Browser types (Chrome, Edge, Safari, etc.)
   - Operating systems (Windows, Mac, Android, iOS)
   - Device types (Desktop, Mobile, Tablet)
   - Locations (City, Region, Country)

### 10. Test Logout
1. Click "Logout" button
2. ✅ Expected: Redirected to login page
3. ✅ Expected: Custom alias field hidden on main page
4. ✅ Expected: Can still create anonymous URLs

---

## 🔐 Security Features to Test

### JWT Token Expiration
1. Login to dashboard
2. Open browser DevTools → Application → Local Storage
3. Note your token expiration (7 days)
4. Try accessing `/dashboard.html` after token expires
5. ✅ Expected: Redirected to login page

### Unauthorized Access Prevention
1. Logout completely
2. Try to access: `http://localhost:3000/dashboard.html`
3. ✅ Expected: Redirected to login page immediately

### SQL Injection Protection
Try these in URL or custom alias fields:
- `'; DROP TABLE urls; --`
- `<script>alert('XSS')</script>`
- ✅ Expected: Rejected or sanitized

---

## 📊 Database Verification

### Check MongoDB
```powershell
# Connect to MongoDB shell
mongosh

# Use database
use urlshortener

# View all users
db.users.find().pretty()

# View all URLs
db.urls.find().pretty()

# Check for custom aliases
db.urls.find({ customAlias: { $exists: true } })
```

### Check Redis Cache
```powershell
# Open Redis CLI
redis-cli

# List all keys
KEYS *

# Get a specific shortened URL
GET <shortCode>

# Check TTL (time to live)
TTL <shortCode>
```

---

## 🐛 Common Issues & Fixes

### Issue 1: "Cannot read token"
**Fix:** Clear localStorage and login again
```javascript
localStorage.clear();
location.reload();
```

### Issue 2: "Custom alias already exists"
**Fix:** Each alias must be unique. Try a different name.

### Issue 3: QR code not showing
**Fix:** Check browser console for errors. QR codes are auto-generated on backend.

### Issue 4: Rate limit triggered
**Fix:** Wait 15 minutes or restart server (clears rate limit memory)

### Issue 5: Redis not connected
**Fix:** Check Redis service:
```powershell
Get-Service -Name Redis
Start-Service -Name Redis
```

### Issue 6: MongoDB connection failed
**Fix:** Start MongoDB:
```powershell
net start MongoDB
```

---

## 🎯 API Endpoints Reference

### Public Endpoints (No Auth Required)
- `POST /api/shorten` - Create short URL (anonymous or authenticated)
- `GET /api/analytics/:shortCode` - View URL analytics
- `GET /:shortCode` - Redirect to original URL

### Authentication Endpoints
- `POST /api/auth/register` - Create new user account
- `POST /api/auth/login` - Login and get JWT token

### Protected Endpoints (Auth Required)
- `GET /api/my-urls` - Get all URLs for logged-in user
- `DELETE /api/:id` - Delete user's own URL

---

## 📱 Testing on Mobile Device

1. Find your computer's local IP:
```powershell
ipconfig
# Look for IPv4 Address (e.g., 192.168.1.5)
```

2. Update `.env` file:
```
BASE_URL=http://192.168.1.5:3000
```

3. Restart server
4. On phone browser: `http://192.168.1.5:3000`
5. Test QR scanning and mobile analytics

---

## ✅ Final Checklist

Before deploying, verify:
- [ ] User registration works
- [ ] User login works
- [ ] JWT tokens are generated
- [ ] Custom aliases work
- [ ] QR codes display correctly
- [ ] Dashboard shows all user URLs
- [ ] Delete functionality works
- [ ] Rate limiting prevents abuse
- [ ] Analytics track clicks properly
- [ ] Anonymous users can still create URLs
- [ ] Logout clears session
- [ ] Redis caching is active
- [ ] MongoDB stores data correctly

---

## 📸 Screenshots to Take (for Portfolio)

1. Main page (authenticated view with custom alias)
2. Signup page
3. Dashboard with multiple URLs
4. QR code modal popup
5. Analytics panel with real click data
6. Mobile responsive view
7. Dashboard URL management

---

## 🚀 Next Steps

Once all tests pass, proceed to:
1. Push code to GitHub
2. Follow `DEPLOYMENT_GUIDE.md` for production deployment
3. Update environment variables for production
4. Set up MongoDB Atlas (cloud database)
5. Set up Upstash Redis (cloud cache)
6. Deploy to Railway/Render/Heroku
