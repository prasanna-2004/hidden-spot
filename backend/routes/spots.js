const express = require('express');
const multer = require('multer');
const router = express.Router();
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');

/*const spotSchema = new mongoose.Schema({
  title: String,
  category: String,
  story: String,
  imageUrl: String,
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
    },
  },
}, { timestamps: true });

spotSchema.index({ location: '2dsphere' });

const Spot = mongoose.model('Spot', spotSchema); // Model
*/

const Spot = require('../models/Spot.js'); 

const storage = multer.memoryStorage();
const upload = multer({ storage });

// ⬇️ Cloudinary config from .env
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ⬇️ Helper: Stream upload to Cloudinary
const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'HiddenSpots' },
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
};

// ✅ POST /api/spots/upload — Upload + Save Spot
router.post('/upload', upload.single('image'), async (req, res) => {
  try {
    const { title, category, story, latitude, longitude } = req.body;
    const imageBuffer = req.file.buffer;

    // Upload to Cloudinary
    const uploadedImage = await uploadToCloudinary(imageBuffer);

    // Save to MongoDB
    const newSpot = new Spot({
      title,
      category,
      story,
      imageUrl: uploadedImage.secure_url,
      location: {
        type: 'Point',
        coordinates: [parseFloat(longitude), parseFloat(latitude)],
      },
    });

    await newSpot.save();

    res.status(201).json({
      success: true,
      message: 'Spot uploaded and saved',
      spot: newSpot,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to upload and save spot' });
  }
});

// ✅ GET /api/spots/nearby?lat=...&lng=...
router.get('/nearby', async (req, res) => {
  const { lat, lng } = req.query;

  if (!lat || !lng) {
    return res.status(400).json({ error: 'Latitude and longitude required' });
  }

  try {
  // This is the code that TRIES to run
  const spots = await Spot.find({ /* ... geospatial query ... */ });
  res.json({ success: true, spots });

} catch (err) {
  // If the 'try' block fails for ANY reason, this code runs instead
  console.error(err); // <--- THIS IS THE KEY
  res.status(500).json({ error: 'Failed to fetch nearby spots' });
}
});

module.exports = router;
