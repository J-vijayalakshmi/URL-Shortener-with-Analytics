const express = require('express');
const router = express.Router();
const shortid = require('shortid');
const validUrl = require('valid-url');
const QRCode = require('qrcode');
const Url = require('../models/Url');
const redisClient = require('../config/redis');
const authMiddleware = require('../middleware/auth');

// Optional auth middleware - allows both authenticated and anonymous users
const optionalAuth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (token) {
    try {
      const jwt = require('jsonwebtoken');
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
    } catch (error) {
      // Invalid token, but continue as anonymous
      req.user = null;
    }
  }
  next();
};

// Create short URL (with optional custom alias and authentication)
router.post('/shorten', optionalAuth, async (req, res) => {
  try {
    const { originalUrl, customAlias } = req.body;

    // Validate URL
    if (!validUrl.isUri(originalUrl)) {
      return res.status(400).json({ error: 'Invalid URL' });
    }

    // Validate custom alias if provided
    if (customAlias) {
      if (!/^[a-zA-Z0-9-_]+$/.test(customAlias)) {
        return res.status(400).json({ error: 'Custom alias can only contain letters, numbers, hyphens, and underscores' });
      }
      if (customAlias.length < 3 || customAlias.length > 20) {
        return res.status(400).json({ error: 'Custom alias must be between 3 and 20 characters' });
      }
      
      // Check if custom alias already exists
      const existingAlias = await Url.findOne({ 
        $or: [{ customAlias }, { shortCode: customAlias }] 
      });
      if (existingAlias) {
        return res.status(400).json({ error: 'Custom alias is already taken' });
      }
    }

    // Check if URL already exists for this user
    const query = { originalUrl };
    if (req.user) {
      query.user = req.user.userId;
    }
    let url = await Url.findOne(query);
    
    if (url) {
      // Return existing URL
      return res.json({
        originalUrl: url.originalUrl,
        shortUrl: `${process.env.BASE_URL}/${url.customAlias || url.shortCode}`,
        shortCode: url.customAlias || url.shortCode,
        qrCode: url.qrCode
      });
    }

    // Generate unique short code
    const shortCode = customAlias || shortid.generate();

    // Generate QR code
    const shortUrl = `${process.env.BASE_URL}/${shortCode}`;
    const qrCodeDataUrl = await QRCode.toDataURL(shortUrl);

    // Create new URL entry
    url = new Url({
      originalUrl,
      shortCode: customAlias || shortCode,
      customAlias: customAlias || null,
      user: req.user ? req.user.userId : null,
      qrCode: qrCodeDataUrl
    });

    await url.save();

    // Cache the new URL
    try {
      const cacheKey = `url:${shortCode}`;
      await redisClient.setEx(
        cacheKey,
        parseInt(process.env.CACHE_EXPIRY) || 3600,
        originalUrl
      );
    } catch (redisError) {
      console.error('Redis cache error:', redisError);
    }

    res.json({
      originalUrl: url.originalUrl,
      shortUrl,
      shortCode,
      qrCode: qrCodeDataUrl
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get analytics for a short URL (supports both shortCode and customAlias)
router.get('/analytics/:shortCode', async (req, res) => {
  try {
    const url = await Url.findOne({ 
      $or: [
        { shortCode: req.params.shortCode },
        { customAlias: req.params.shortCode }
      ]
    });

    if (!url) {
      return res.status(404).json({ error: 'URL not found' });
    }

    res.json({
      originalUrl: url.originalUrl,
      shortCode: url.customAlias || url.shortCode,
      clicks: url.clicks,
      createdAt: url.createdAt,
      clickDetails: url.clickDetails,
      qrCode: url.qrCode
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all URLs for authenticated user
router.get('/my-urls', authMiddleware, async (req, res) => {
  try {
    const urls = await Url.find({ user: req.user.userId })
      .sort({ createdAt: -1 })
      .select('-clickDetails'); // Exclude detailed click data for list view

    res.json({
      count: urls.length,
      urls: urls.map(url => ({
        id: url._id,
        originalUrl: url.originalUrl,
        shortUrl: `${process.env.BASE_URL}/${url.customAlias || url.shortCode}`,
        shortCode: url.customAlias || url.shortCode,
        clicks: url.clicks,
        createdAt: url.createdAt,
        qrCode: url.qrCode
      }))
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete URL (authenticated users only)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const url = await Url.findOne({ 
      _id: req.params.id,
      user: req.user.userId 
    });

    if (!url) {
      return res.status(404).json({ error: 'URL not found or unauthorized' });
    }

    // Remove from cache
    try {
      await redisClient.del(`url:${url.shortCode}`);
    } catch (redisError) {
      console.error('Redis cache error:', redisError);
    }

    await Url.deleteOne({ _id: req.params.id });
    
    res.json({ message: 'URL deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
