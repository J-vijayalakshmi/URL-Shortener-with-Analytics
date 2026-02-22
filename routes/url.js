const express = require('express');
const router = express.Router();
const shortid = require('shortid');
const validUrl = require('valid-url');
const Url = require('../models/Url');
const redisClient = require('../config/redis');

// Create short URL
router.post('/shorten', async (req, res) => {
  try {
    const { originalUrl } = req.body;

    // Validate URL
    if (!validUrl.isUri(originalUrl)) {
      return res.status(400).json({ error: 'Invalid URL' });
    }

    // Check if URL already exists
    let url = await Url.findOne({ originalUrl });
    
    if (url) {
      // Cache existing URL
      try {
        const cacheKey = `url:${url.shortCode}`;
        await redisClient.setEx(
          cacheKey,
          parseInt(process.env.CACHE_EXPIRY) || 3600,
          url.originalUrl
        );
      } catch (redisError) {
        console.error('Redis cache error:', redisError);
      }
      
      return res.json({
        originalUrl: url.originalUrl,
        shortUrl: `${process.env.BASE_URL}/${url.shortCode}`,
        shortCode: url.shortCode
      });
    }

    // Generate unique short code
    const shortCode = shortid.generate();

    // Create new URL entry
    url = new Url({
      originalUrl,
      shortCode
    });

    await url.save();

    // Cache the new URL immediately
    try {
      const cacheKey = `url:${shortCode}`;
      await redisClient.setEx(
        cacheKey,
        parseInt(process.env.CACHE_EXPIRY) || 3600,
        originalUrl
      );
      console.log('💾 Cached new URL:', shortCode);
    } catch (redisError) {
      console.error('Redis cache error:', redisError);
    }

    res.json({
      originalUrl: url.originalUrl,
      shortUrl: `${process.env.BASE_URL}/${url.shortCode}`,
      shortCode: url.shortCode
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get analytics for a short URL
router.get('/analytics/:shortCode', async (req, res) => {
  try {
    const url = await Url.findOne({ shortCode: req.params.shortCode });

    if (!url) {
      return res.status(404).json({ error: 'URL not found' });
    }

    res.json({
      originalUrl: url.originalUrl,
      shortCode: url.shortCode,
      clicks: url.clicks,
      createdAt: url.createdAt,
      clickDetails: url.clickDetails
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
