const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  authorName: { type: String, required: true },
  isAnonymous: { type: Boolean, default: false },
  comment: { type: String, required: true },
  spotId: { type: mongoose.Schema.Types.ObjectId, ref: 'Spot', required: true },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Comment', commentSchema);
