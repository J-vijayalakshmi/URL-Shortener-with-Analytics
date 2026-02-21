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
    referer: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Url', urlSchema);
