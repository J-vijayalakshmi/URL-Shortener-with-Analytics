# Deployment Guide - URL Shortener to Production

## 🎯 Overview

This guide will help you deploy your URL shortener with authentication to production platforms.

**Recommended Stack:**
- **Backend Hosting:** Railway / Render / Heroku
- **Database:** MongoDB Atlas (Free tier: 512MB)
- **Cache:** Upstash Redis (Free tier: 10K requests/day)
- **Domain:** Your custom domain or platform subdomain

---

## 📋 Pre-Deployment Checklist

### 1. Environment Variables to Set in Production

```env
# Server Config
PORT=3000
NODE_ENV=production

# Database (MongoDB Atlas)
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/urlshortener?retryWrites=true&w=majority

# Redis (Upstash)
REDIS_URL=rediss://default:<password>@<host>:6379

# App Config
BASE_URL=https://your-app-name.railway.app
CACHE_EXPIRY=3600

# Security (IMPORTANT: Generate strong secret)
JWT_SECRET=<generate-strong-random-secret-here>
```

### 2. Generate Strong JWT Secret

```powershell
# PowerShell - Generate 64-character random string
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 64 | ForEach-Object {[char]$_})
```

OR use Node.js:
```javascript
require('crypto').randomBytes(64).toString('hex')
```

### 3. Update package.json

Already configured! Your `package.json` has:
```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "engines": {
    "node": ">=14.0.0"
  }
}
```

---

## 🚀 Deployment Option 1: Railway (Recommended)

### Why Railway?
- ✅ Free tier: $5 credit/month
- ✅ Automatic GitHub deployment
- ✅ Built-in PostgreSQL, Redis, MongoDB support
- ✅ Custom domains
- ✅ Zero config SSL certificates

### Steps:

#### 1. Set Up MongoDB Atlas
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create free account
3. Create a new cluster (M0 Free tier)
4. Click "Connect" → "Connect your application"
5. Copy connection string:
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/urlshortener
   ```
6. **Network Access:** Add `0.0.0.0/0` (allow from anywhere)
7. **Database Access:** Create database user with read/write permissions

#### 2. Set Up Upstash Redis
1. Go to [Upstash](https://upstash.com/)
2. Create free account
3. Create new Redis database
4. Copy Redis URL:
   ```
   rediss://default:password@host.upstash.io:6379
   ```

#### 3. Deploy to Railway
1. Go to [Railway.app](https://railway.app/)
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your URL shortener repository
5. Wait for initial deploy (may fail - that's okay)

#### 4. Configure Environment Variables
In Railway dashboard:
1. Click on your project
2. Go to "Variables" tab
3. Add all environment variables:
   ```
   MONGODB_URI=mongodb+srv://...
   REDIS_URL=rediss://...
   BASE_URL=https://your-app.railway.app
   JWT_SECRET=your-generated-secret
   CACHE_EXPIRY=3600
   NODE_ENV=production
   ```
4. Click "Redeploy"

#### 5. Get Your URL
1. Go to "Settings" tab
2. Scroll to "Domains"
3. Click "Generate Domain"
4. Your app: `https://your-app-name.railway.app`

#### 6. Update BASE_URL
1. Copy your Railway URL
2. Update `BASE_URL` variable in Railway
3. Redeploy

✅ **Done! Your app is live!**

---

## 🚀 Deployment Option 2: Render

### Why Render?
- ✅ 750 hours/month free tier
- ✅ Auto-deploy from GitHub
- ✅ Free SSL
- ✅ Custom domains

### Steps:

#### 1. Set Up MongoDB Atlas & Upstash Redis
(Same as Railway steps above)

#### 2. Deploy to Render
1. Go to [Render.com](https://render.com/)
2. Sign up with GitHub
3. Click "New +" → "Web Service"
4. Connect your GitHub repository
5. Configure:
   - **Name:** url-shortener
   - **Environment:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Instance Type:** Free

#### 3. Add Environment Variables
In Render dashboard → "Environment":
```
MONGODB_URI=mongodb+srv://...
REDIS_URL=rediss://...
BASE_URL=https://url-shortener.onrender.com
JWT_SECRET=your-secret
CACHE_EXPIRY=3600
NODE_ENV=production
```

#### 4. Deploy
Click "Create Web Service"

⚠️ **Note:** Free Render apps sleep after 15 min of inactivity. First request takes ~30s to wake up.

---

## 🚀 Deployment Option 3: Heroku

### Why Heroku?
- ✅ Popular and well-documented
- ✅ Easy add-ons for MongoDB/Redis
- ❌ No longer has free tier (starts at $5/month)

### Steps:

#### 1. Install Heroku CLI
```powershell
# Download from: https://devcenter.heroku.com/articles/heroku-cli
# Or use npm:
npm install -g heroku
```

#### 2. Login and Create App
```powershell
heroku login
heroku create your-app-name
```

#### 3. Add MongoDB Atlas & Upstash Redis
(Set up same as above, or use Heroku add-ons)

```powershell
# Option 1: Use external services (free)
heroku config:set MONGODB_URI="mongodb+srv://..."
heroku config:set REDIS_URL="rediss://..."

# Option 2: Use Heroku add-ons (paid)
heroku addons:create mongolab:sandbox
heroku addons:create heroku-redis:mini
```

#### 4. Set Environment Variables
```powershell
heroku config:set JWT_SECRET="your-secret"
heroku config:set BASE_URL="https://your-app-name.herokuapp.com"
heroku config:set CACHE_EXPIRY=3600
heroku config:set NODE_ENV=production
```

#### 5. Deploy
```powershell
git add .
git commit -m "Prepare for production deployment"
git push heroku main
```

#### 6. Open App
```powershell
heroku open
```

---

## 🔒 Security Best Practices for Production

### 1. Update server.js (Add Security Headers)

Install helmet package:
```powershell
npm install helmet cors
```

Update `server.js`:
```javascript
const helmet = require('helmet');
const cors = require('cors');

// Add after Express initialization
app.use(helmet());
app.use(cors({
  origin: process.env.BASE_URL,
  credentials: true
}));
```

### 2. Use HTTPS Only
```javascript
// Add to server.js
if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    if (req.header('x-forwarded-proto') !== 'https') {
      res.redirect(`https://${req.header('host')}${req.url}`);
    } else {
      next();
    }
  });
}
```

### 3. Update CORS for Production
```javascript
const allowedOrigins = [
  process.env.BASE_URL,
  'https://yourdomain.com'
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));
```

### 4. Secure JWT Secret
- **NEVER** commit `.env` to GitHub
- Generate new secret for production
- Use 64+ character random string
- Rotate secret every 90 days

### 5. MongoDB Security
- ✅ Enable IP whitelist (even with 0.0.0.0/0)
- ✅ Use strong passwords (16+ chars)
- ✅ Enable MongoDB authentication
- ✅ Regular backups (MongoDB Atlas auto-backups)

---

## 📊 Monitoring & Maintenance

### 1. Add Logging (Winston)
```powershell
npm install winston
```

Create `config/logger.js`:
```javascript
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

module.exports = logger;
```

### 2. Health Check Endpoint
Add to `server.js`:
```javascript
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    timestamp: new Date(),
    mongodb: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    redis: redisClient.isOpen ? 'Connected' : 'Disconnected'
  });
});
```

### 3. Set Up Uptime Monitoring
Use free services:
- [UptimeRobot](https://uptimerobot.com/) - Free (50 monitors)
- [Better Uptime](https://betteruptime.com/) - Free tier
- [Cronitor](https://cronitor.io/) - Free tier

Set to ping your `/health` endpoint every 5 minutes.

---

## 🌐 Custom Domain Setup

### 1. Buy Domain (Optional)
- [Namecheap](https://www.namecheap.com/) - $8-12/year
- [Google Domains](https://domains.google/) - $12/year
- [Cloudflare](https://www.cloudflare.com/products/registrar/) - At cost

### 2. Configure DNS

**For Railway:**
1. Railway dashboard → "Settings" → "Custom Domain"
2. Add your domain: `short.yourdomain.com`
3. Add CNAME record in your DNS:
   ```
   short.yourdomain.com → CNAME → your-app.railway.app
   ```

**For Render:**
1. Render dashboard → "Settings" → "Custom Domain"
2. Add your domain
3. Add CNAME:
   ```
   short.yourdomain.com → CNAME → your-app.onrender.com
   ```

### 3. Update BASE_URL
```
BASE_URL=https://short.yourdomain.com
```

---

## 🐛 Troubleshooting Production Issues

### Issue: "Cannot connect to MongoDB"
**Fix:**
1. Check MongoDB Atlas network access
2. Verify connection string format
3. Test connection:
   ```javascript
   mongosh "mongodb+srv://..."
   ```

### Issue: "Redis connection timeout"
**Fix:**
1. Verify Upstash Redis URL format
2. Check TLS enabled (`rediss://` not `redis://`)
3. Test with redis-cli:
   ```powershell
   redis-cli -u rediss://default:password@host:6379
   ```

### Issue: "JWT token invalid"
**Fix:**
1. Ensure JWT_SECRET is set in production
2. Clear browser localStorage
3. Check token expiration (7 days)

### Issue: "Rate limit too strict"
**Fix:** Update rate limits in `server.js`:
```javascript
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500 // Increase from 100
});
```

### Issue: "CORS errors"
**Fix:** Add your domain to CORS whitelist in `server.js`

---

## 📈 Scaling Tips

### When Traffic Grows:

1. **Upgrade Database**
   - MongoDB Atlas: Upgrade to M10 ($0.08/hour)
   - Enable clustering for high availability

2. **Upgrade Redis**
   - Upstash: Pay-as-you-go ($0.20/100K requests)
   - Or migrate to Redis Cloud

3. **Add CDN**
   - Cloudflare (Free tier)
   - Speeds up static assets worldwide

4. **Enable Compression**
   ```javascript
   const compression = require('compression');
   app.use(compression());
   ```

5. **Database Indexing**
   ```javascript
   // Already created in models, but verify:
   db.urls.createIndex({ shortCode: 1 });
   db.urls.createIndex({ customAlias: 1 });
   db.users.createIndex({ email: 1 });
   ```

---

## ✅ Final Production Checklist

- [ ] MongoDB Atlas set up and configured
- [ ] Upstash Redis set up and configured
- [ ] Strong JWT secret generated (64+ chars)
- [ ] All environment variables added to hosting platform
- [ ] Security headers enabled (helmet)
- [ ] CORS configured properly
- [ ] HTTPS enforced
- [ ] Health check endpoint working
- [ ] Uptime monitoring configured
- [ ] Logs are being captured
- [ ] Custom domain configured (optional)
- [ ] BASE_URL updated to production URL
- [ ] Rate limiting tested
- [ ] Error handling tested
- [ ] Database backups enabled
- [ ] Test deployment with real users

---

## 🎉 Post-Deployment

### Test Your Live App

1. Visit your production URL
2. Create account
3. Generate URLs with custom aliases
4. Test QR codes on mobile
5. View analytics
6. Test rate limiting
7. Share with friends!

### Monitor First 24 Hours

- Check error logs
- Monitor response times
- Watch database connections
- Verify Redis cache hit rate
- Check uptime

---

## 📚 Additional Resources

- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Upstash Redis Documentation](https://docs.upstash.com/redis)
- [Railway Documentation](https://docs.railway.app/)
- [Render Documentation](https://render.com/docs)
- [Express Production Best Practices](https://expressjs.com/en/advanced/best-practice-performance.html)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)

---

## 🆘 Need Help?

If you encounter issues during deployment:

1. Check hosting platform logs
2. Verify environment variables
3. Test database connections
4. Review error logs
5. Check GitHub Issues for similar problems

**Good luck with your deployment! 🚀**
