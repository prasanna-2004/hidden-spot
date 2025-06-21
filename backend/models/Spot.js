// models/Spot.js
const mongoose = require('mongoose');

const spotSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['nature', 'food', 'historical', 'adventure', 'others'] // You can modify categories
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true
    }
  },
  imageUrls: {
    type: [String], // array of image URLs
    required: true
  },
  communityRatings: {
    vibe: { type: Number, min: 0, max: 5, default: 0 },
    safety: { type: Number, min: 0, max: 5, default: 0 },
    uniqueness: { type: Number, min: 0, max: 5, default: 0 },
    crowd: { type: Number, min: 0, max: 5, default: 0 }
  }
});

// Add 2dsphere index for geospatial queries
spotSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Spot', spotSchema);
