require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const rateLimit = require('express-rate-limit');
const urlRoutes = require('./routes/url');
const authRoutes = require('./routes/auth');
const redisClient = require('./config/redis');
const UAParser = require('ua-parser-js');
const geoip = require('geoip-lite');

const app = express();

// Trust proxy - required for Railway/Render/Heroku deployments
app.set('trust proxy', 1);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Rate limiting middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: { error: 'Too many requests, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limiting to API routes
app.use('/api', limiter);

// Specific rate limit for URL shortening (stricter)
const shortenLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20, // Max 20 short URLs per hour per IP
  message: { error: 'Too many URLs created, please try again later' },
});

// Database connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', urlRoutes);

// Apply stricter rate limit to shorten endpoint
app.use('/api/shorten', shortenLimiter);

// Serve home page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Redirect route (must be after other routes)
app.get('/:shortCode', async (req, res) => {
  try {
    const { shortCode } = req.params;
    const Url = require('./models/Url');
    
    // Step 1: Check Redis cache first
    const cacheKey = `url:${shortCode}`;
    let cachedUrl = null;
    
    try {
      cachedUrl = await redisClient.get(cacheKey);
    } catch (redisError) {
      console.error('Redis cache error:', redisError);
      // Continue without cache if Redis fails
    }
    
    let url;
    
    if (cachedUrl) {
      // Cache hit! Find the URL document
      url = await Url.findOne({
        $or: [
          { shortCode },
          { customAlias: shortCode }
        ]
      });
      console.log('✅ Cache HIT for:', shortCode);
    } else {
      // Cache miss - query database (support both shortCode and customAlias)
      url = await Url.findOne({
        $or: [
          { shortCode },
          { customAlias: shortCode }
        ]
      });
      console.log('❌ Cache MISS for:', shortCode);
      
      if (url) {
        // Store in Redis cache for next time (1 hour expiry)
        try {
          await redisClient.setEx(
            cacheKey,
            parseInt(process.env.CACHE_EXPIRY) || 3600,
            url.originalUrl
          );
          console.log('💾 Cached URL:', shortCode);
        } catch (redisError) {
          console.error('Redis set error:', redisError);
        }
      }
    }

    if (!url) {
      return res.status(404).json({ error: 'URL not found' });
    }

    // Track analytics (always in MongoDB)
    const userAgentString = req.get('user-agent');
    const parser = new UAParser(userAgentString);
    const ua = parser.getResult();
    
    // Get IP address (handle both IPv4 and IPv6)
    let clientIp = req.ip || req.connection.remoteAddress;
    if (clientIp && clientIp.startsWith('::ffff:')) {
      clientIp = clientIp.substring(7);
    }
    
    // Get location from IP
    const geo = geoip.lookup(clientIp) || {};
    
    url.clicks++;
    url.clickDetails.push({
      timestamp: new Date(),
      ip: clientIp,
      userAgent: userAgentString,
      referer: req.get('referer') || 'Direct',
      // Advanced analytics
      device: {
        type: ua.device.type || 'desktop',
        model: ua.device.model || 'Unknown',
        vendor: ua.device.vendor || 'Unknown'
      },
      browser: {
        name: ua.browser.name || 'Unknown',
        version: ua.browser.version || 'Unknown'
      },
      os: {
        name: ua.os.name || 'Unknown',
        version: ua.os.version || 'Unknown'
      },
      location: {
        country: geo.country || 'Unknown',
        region: geo.region || 'Unknown',
        city: geo.city || 'Unknown',
        timezone: geo.timezone || 'Unknown'
      }
    });

    await url.save();

    // Redirect to original URL
    res.redirect(url.originalUrl);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on ${process.env.BASE_URL}`);
});
