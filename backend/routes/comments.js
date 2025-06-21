const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');

// 🟢 POST /api/comments — Add a comment to a spot
router.post('/', async (req, res) => {
  try {
    const { authorName, isAnonymous, comment, spotId } = req.body;

    const newComment = new Comment({
      authorName,
      isAnonymous,
      comment,
      spotId,
    });

    await newComment.save();
    res.status(201).json({ success: true, comment: newComment });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 🟡 GET /api/comments/:spotId — Get all comments for a spot
router.get('/:spotId', async (req, res) => {
  try {
    const { spotId } = req.params;
    const comments = await Comment.find({ spotId }).sort({ timestamp: -1 });

    res.json({ success: true, comments });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
