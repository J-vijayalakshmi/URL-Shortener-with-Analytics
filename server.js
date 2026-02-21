require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const urlRoutes = require('./routes/url');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Database connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Routes
app.use('/api', urlRoutes);

// Serve home page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Redirect route (must be after other routes)
app.get('/:shortCode', async (req, res) => {
  try {
    const Url = require('./models/Url');
    const url = await Url.findOne({ shortCode: req.params.shortCode });

    if (!url) {
      return res.status(404).json({ error: 'URL not found' });
    }

    // Track analytics
    url.clicks++;
    url.clickDetails.push({
      timestamp: new Date(),
      ip: req.ip || req.connection.remoteAddress,
      userAgent: req.get('user-agent'),
      referer: req.get('referer') || 'Direct'
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
