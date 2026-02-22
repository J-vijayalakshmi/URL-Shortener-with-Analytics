const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
  originalUrl: {
    type: String,
    required: true
  },
  shortCode: {
    type: String,
    required: true,
    unique: true
  },
  customAlias: {
    type: String,
    unique: true,
    sparse: true // Allows multiple null values
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null // Allow anonymous URLs
  },
  qrCode: {
    type: String // Data URL for QR code image
  },
  clicks: {
    type: Number,
    default: 0
  },
  clickDetails: [{
    timestamp: {
      type: Date,
      default: Date.now
    },
    ip: String,
    userAgent: String,
    referer: String,
    // Advanced analytics
    device: {
      type: { type: String }, // Explicitly define 'type' field
      model: String,
      vendor: String
    },
    browser: {
      name: String,
      version: String
    },
    os: {
      name: String,
      version: String
    },
    location: {
      country: String,
      region: String,
      city: String,
      timezone: String
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Url', urlSchema);
