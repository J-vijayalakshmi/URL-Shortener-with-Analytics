# 🔗 URL Shortener with Authentication & Advanced Analytics

A production-ready full-stack URL shortener with user authentication, custom aliases, QR code generation, and comprehensive analytics tracking. Built with Node.js, Express, MongoDB, and Redis.

![Project Banner](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)

## ✨ Features

### Core Features
- ✅ **URL Shortening** - Convert long URLs to compact links
- ✅ **Custom Aliases** - Create memorable short links (e.g., `/my-link`)
- ✅ **QR Code Generation** - Automatic QR codes for every shortened URL
- ✅ **User Authentication** - JWT-based secure login/registration
- ✅ **User Dashboard** - Manage all your URLs in one place
- ✅ **Anonymous URLs** - Create URLs without login
- ✅ **Redis Caching** - Lightning-fast redirects with cache-aside pattern
- ✅ **Rate Limiting** - Prevent abuse (100 req/15min global, 20 URLs/hour)

### Advanced Analytics
- 📊 **Click Tracking** - Total clicks per URL
- 🌍 **Geolocation** - City, Region, Country tracking
- 💻 **Device Detection** - Desktop, Mobile, Tablet
- 🌐 **Browser Detection** - Chrome, Firefox, Safari, Edge, etc.
- 🖥️ **OS Detection** - Windows, Mac, Linux, Android, iOS
- 📱 **User Agent Parsing** - Complete browser/OS version info
- 📈 **Real-time Analytics** - View click details as they happen

### UI/UX
- 🎨 **Modern Design** - Professional split-panel layout
- 📱 **Responsive** - Works perfectly on mobile, tablet, desktop
- ⚡ **Fast** - Optimized with Redis caching (sub-10ms redirects)
- 🔐 **Secure** - Password hashing (bcrypt), JWT tokens, rate limiting

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js v14+
- **Framework**: Express.js 4.18
- **Database**: MongoDB 8.0
- **Cache**: Redis 4.7
- **Authentication**: JWT (jsonwebtoken), bcrypt

### Frontend
- **HTML5** - Semantic structure
- **CSS3** - Modern styling with Flexbox/Grid
- **Vanilla JavaScript** - No framework dependencies
- **Inter Font** - Professional typography

### Key Packages
- `mongoose` - MongoDB ODM
- `bcryptjs` - Password hashing
- `jsonwebtoken` - JWT authentication
- `qrcode` - QR code generation
- `express-rate-limit` - Rate limiting middleware
- `ua-parser-js` - User agent parsing
- `geoip-lite` - IP geolocation
- `shortid` - Short code generation
- `valid-url` - URL validation

## 📋 Prerequisites

Before running this project, make sure you have:

1. **Node.js** (v14 or higher) - [Download here](https://nodejs.org/)
2. **MongoDB** (v6 or higher) - [Download here](https://www.mongodb.com/try/download/community)
3. **Redis** (v6 or higher) - [Download for Windows](https://github.com/tporadowski/redis/releases) or [Redis official](https://redis.io/download)

Optional but recommended:
- **Git** - For version control
- **Postman** - For API testing
- **MongoDB Compass** - GUI for MongoDB

## 🚀 Installation & Setup

### Step 1: Clone Repository

```bash
git clone https://github.com/J-vijayalakshmi/URL-Shortener-with-Analytics.git
cd url-shortener
```

### Step 2: Install Dependencies

```bash
npm install
```

This installs 42 packages including:
- express, mongoose, bcryptjs, jsonwebtoken
- qrcode, express-rate-limit
- ua-parser-js, geoip-lite
- shortid, valid-url

### Step 3: Configure Environment Variables

Create/update `.env` file in root directory:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# MongoDB (Local)
MONGODB_URI=mongodb://127.0.0.1:27017/urlshortener

# Redis (Local)
REDIS_URL=redis://127.0.0.1:6379

# Application
BASE_URL=http://localhost:3000
CACHE_EXPIRY=3600

# Security (Generate strong secret for production)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

**For Production:**
- Use MongoDB Atlas: `MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/urlshortener`
- Use Upstash Redis: `REDIS_URL=rediss://default:pass@host.upstash.io:6379`
- Generate strong JWT secret (64+ characters)
- Update BASE_URL to your production domain

### Step 4: Start MongoDB

**Windows:**
```powershell
# MongoDB should start automatically as a service
# Check status:
Get-Service -Name MongoDB

# If not running:
net start MongoDB
```

**Mac/Linux:**
```bash
sudo systemctl start mongod
# or
brew services start mongodb-community
```

### Step 5: Start Redis

**Windows:**
```powershell
# Check if Redis is running:
Get-Service -Name Redis

# Start Redis:
Start-Service -Name Redis

# Or start manually:
redis-server
```

**Mac/Linux:**
```bash
sudo systemctl start redis
# or
brew services start redis
```

### Step 6: Run the Application

```bash
npm start
```

**For development with auto-restart:**
```bash
npm run dev
```

**Expected output:**
```
✅ Connected to MongoDB
✅ Connected to Redis - caching enabled
🚀 Server running on http://localhost:3000
```

### Step 7: Open in Browser

Navigate to: **http://localhost:3000**

## 📖 How to Use

### For Anonymous Users (No Login Required)

1. **Shorten URL**
   - Go to `http://localhost:3000`
   - Enter any long URL
   - Click "Shorten URL"
   - Copy and share your short link
   - QR code generated automatically

2. **View Analytics**
   - Analytics appear on the right panel
   - Shows total clicks, creation date
   - View detailed click information

### For Registered Users

1. **Sign Up**
   - Click "Sign Up" button
   - Enter name, email, password (min 6 chars)
   - Auto-redirects to dashboard

2. **Login**
   - Click "Login" button
   - Enter email and password
   - Redirected to dashboard

3. **Create Custom URLs**
   - From main page or dashboard
   - Enter original URL
   - Enter custom alias (e.g., `my-link`)
   - ✅ Valid: `my-link`, `my_link_123`, `github-profile`
   - ❌ Invalid: `ab` (too short), `my link` (spaces), `my@link` (special chars)

4. **Manage URLs in Dashboard**
   - View all your shortened URLs
   - See QR codes (click QR button)
   - Copy URLs to clipboard
   - Delete URLs you no longer need
   - View click statistics

5. **Logout**
   - Click "Logout" button
   - JWT token cleared from localStorage

## 🔌 API Documentation

### Public Endpoints

#### 1. Create Short URL
```http
POST /api/shorten
Content-Type: application/json
Authorization: Bearer <token>  (optional)

{
  "originalUrl": "https://example.com/very-long-url",
  "customAlias": "my-link"  (optional, only for authenticated users)
}
```

**Response:**
```json
{
  "originalUrl": "https://example.com/very-long-url",
  "shortUrl": "http://localhost:3000/my-link",
  "shortCode": "aBc123",
  "customAlias": "my-link",
  "qrCode": "data:image/png;base64,..."
}
```

#### 2. Get Analytics
```http
GET /api/analytics/:shortCode
```

**Response:**
```json
{
  "originalUrl": "https://example.com",
  "shortCode": "aBc123",
  "customAlias": "my-link",
  "clicks": 25,
  "createdAt": "2026-02-21T10:00:00.000Z",
  "qrCode": "data:image/png;base64,...",
  "clickDetails": [
    {
      "timestamp": "2026-02-21T15:30:00.000Z",
      "ip": "203.0.113.42",
      "referer": "https://google.com",
      "device": {
        "type": "mobile",
        "vendor": "Apple",
        "model": "iPhone"
      },
      "browser": {
        "name": "Chrome Mobile",
        "version": "119.0"
      },
      "os": {
        "name": "iOS",
        "version": "17.2"
      },
      "location": {
        "country": "United States",
        "region": "California",
        "city": "San Francisco",
        "timezone": "America/Los_Angeles"
      }
    }
  ]
}
```

#### 3. Redirect to Original URL
```http
GET /:shortCode
```

Performs 302 redirect and tracks analytics.

### Authentication Endpoints

#### 4. Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

#### 5. Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response:** Same as register

### Protected Endpoints (Require Authentication)

#### 6. Get My URLs
```http
GET /api/my-urls
Authorization: Bearer <token>
```

**Response:**
```json
{
  "count": 3,
  "urls": [
    {
      "id": "507f1f77bcf86cd799439011",
      "originalUrl": "https://example.com",
      "shortUrl": "http://localhost:3000/my-link",
      "shortCode": "aBc123",
      "customAlias": "my-link",
      "clicks": 25,
      "qrCode": "data:image/png;base64,...",
      "createdAt": "2026-02-21T10:00:00.000Z"
    }
  ]
}
```

#### 7. Delete URL
```http
DELETE /api/:id
Authorization: Bearer <token>
```

**Response:**
```json
{
  "message": "URL deleted successfully"
}
```

## 📁 Project Structure

```
url-shortener/
├── config/
│   └── redis.js              # Redis client configuration
├── middleware/
│   └── auth.js               # JWT authentication middleware
├── models/
│   ├── Url.js                # URL schema with analytics
│   └── User.js               # User schema with bcrypt
├── routes/
│   ├── auth.js               # Auth routes (login/register)
│   └── url.js                # URL routes (CRUD, analytics)
├── public/
│   ├── index.html            # Main page (URL shortener)
│   ├── login.html            # Login page
│   ├── signup.html           # Registration page
│   └── dashboard.html        # User dashboard
├── server.js                 # Main Express app
├── package.json              # Dependencies & scripts
├── .env                      # Environment variables
├── .gitignore                # Git ignore rules
├── README.md                 # This file
├── TESTING_GUIDE.md          # Complete testing instructions
└── DEPLOYMENT_GUIDE.md       # Production deployment guide
```

## 🧪 Testing

See [TESTING_GUIDE.md](TESTING_GUIDE.md) for comprehensive testing instructions including:
- Anonymous URL creation
- User registration/login
- Custom alias validation
- QR code generation
- Rate limiting
- Analytics tracking
- Dashboard features

## 🚀 Deployment

See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for production deployment to:
- Railway (Recommended)
- Render
- Heroku

Includes setup for:
- MongoDB Atlas (cloud database)
- Upstash Redis (cloud cache)
- Environment variables
- Security best practices
- Custom domains

## 🔐 Security Features

### Implemented Security Measures
- ✅ **Password Hashing** - bcrypt with salt rounds (10)
- ✅ **JWT Authentication** - Secure token-based auth, 7-day expiry
- ✅ **Rate Limiting** - Prevent brute force and DDoS attacks
- ✅ **Input Validation** - Sanitize and validate all user inputs
- ✅ **MongoDB Injection Protection** - Mongoose schema validation
- ✅ **XSS Protection** - HTML encoding on frontend
- ✅ **Custom Alias Validation** - Regex pattern matching (alphanumeric + hyphens/underscores)
- ✅ **Graceful Redis Failure** - App continues working if Redis is down

### Rate Limits
- **Global**: 100 requests per 15 minutes per IP
- **URL Shortening**: 20 URLs per hour per IP
- **Returns**: HTTP 429 (Too Many Requests) when exceeded

## 🐛 Troubleshooting

### MongoDB Connection Error
```
Error: MongoServerError: connect ECONNREFUSED
```
**Fix:**
- Check if MongoDB is running: `Get-Service -Name MongoDB`
- Start MongoDB: `net start MongoDB`
- Verify connection string in `.env`

### Redis Connection Error
```
Error: Redis connection failed
```
**Fix:**
- Check if Redis is running: `Get-Service -Name Redis`
- Start Redis: `Start-Service -Name Redis`
- App will continue working without cache (check console warning)

### Port Already in Use
```
Error: listen EADDRINUSE :::3000
```
**Fix:**
```powershell
# Find process using port 3000
Get-NetTCPConnection -LocalPort 3000

# Kill the process
Stop-Process -Id <PID>

# Or change PORT in .env
```

### JWT Token Invalid
```
Error: 401 Unauthorized - Invalid token
```
**Fix:**
- Clear browser localStorage: `localStorage.clear()`
- Login again to get new token
- Verify JWT_SECRET matches in `.env`

### Custom Alias Already Exists
```
Error: Custom alias "my-link" is already taken
```
**Fix:**
- Try a different alias name
- Check existing aliases in database:
  ```javascript
  db.urls.find({ customAlias: { $exists: true } })
  ```

## 📊 Performance Metrics

### Redis Caching Impact
- **Without Redis**: 50-100ms average redirect time
- **With Redis**: 5-10ms average redirect time
- **Cache Hit Rate**: 80-95% (typical)
- **Cache Expiry**: 1 hour (configurable via `CACHE_EXPIRY`)

### Rate Limiting Protection
- Prevents abuse: 20 URLs/hour per IP
- Global limit: 100 requests/15min
- Memory-based (resets on server restart)
- For production: Use Redis-based rate limiting

## 📸 Screenshots

### Main Page (Anonymous User)
![Main Page](docs/screenshots/main-page.png)

### Dashboard (Authenticated User)
![Dashboard](docs/screenshots/dashboard.png)

### Login Page
![Login](docs/screenshots/login.png)

### Analytics Panel
![Analytics](docs/screenshots/analytics.png)

### QR Code Generation
![QR Code](docs/screenshots/qr-code.png)

## 🎯 Future Enhancements

- [ ] Link expiration (time-based auto-delete)
- [ ] Analytics graphs (Chart.js integration)
- [ ] Export analytics to CSV/JSON
- [ ] Email notifications for new links
- [ ] Bulk URL shortening
- [ ] Link preview before redirect
- [ ] Admin dashboard for all users
- [ ] API key authentication
- [ ] Webhook support for click events
- [ ] A/B testing for short links
- [ ] Custom branded domains

## 📝 API Rate Limits Summary

| Endpoint | Anonymous | Authenticated | Rate Limit |
|----------|-----------|---------------|------------|
| POST /api/shorten | ✅ Yes | ✅ Yes | 20/hour |
| GET /api/analytics/:code | ✅ Yes | ✅ Yes | 100/15min |
| GET /:shortCode | ✅ Yes | ✅ Yes | 100/15min |
| GET /api/my-urls | ❌ No | ✅ Yes | 100/15min |
| DELETE /api/:id | ❌ No | ✅ Yes | 100/15min |
| POST /api/auth/register | ✅ Yes | - | 100/15min |
| POST /api/auth/login | ✅ Yes | - | 100/15min |

## 🤝 Contributing

Contributions are welcome! Here's how:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/AmazingFeature`
3. Commit changes: `git commit -m 'Add AmazingFeature'`
4. Push to branch: `git push origin feature/AmazingFeature`
5. Open a Pull Request

### Development Guidelines
- Follow existing code style
- Add comments for complex logic
- Test thoroughly before submitting
- Update documentation if needed

## 📄 License

ISC License - Free for personal and commercial use.

## 👨‍💻 Author

**J Vijayalakshmi**
- GitHub: [@J-vijayalakshmi](https://github.com/J-vijayalakshmi)
- Project: [URL Shortener with Analytics](https://github.com/J-vijayalakshmi/URL-Shortener-with-Analytics)

## 🙏 Acknowledgments

- [Node.js](https://nodejs.org/) - JavaScript runtime
- [Express.js](https://expressjs.com/) - Web framework
- [MongoDB](https://www.mongodb.com/) - Database
- [Redis](https://redis.io/) - Cache
- [JWT](https://jwt.io/) - Authentication standard
- [QRCode.js](https://github.com/soldair/node-qrcode) - QR code generation
- [ShortID](https://github.com/dylang/shortid) - Short code generation
- [UA-Parser-JS](https://github.com/faisalman/ua-parser-js) - User agent parsing
- [geoip-lite](https://github.com/geoip-lite/node-geoip) - IP geolocation

## 📞 Support

If you find this project helpful, please give it a ⭐ on GitHub!

For issues or questions:
- Open an issue on GitHub
- Check [TESTING_GUIDE.md](TESTING_GUIDE.md) for common problems
- See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for production help

---

**Built with ❤️ for learning and portfolio purposes**

