const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Spot = require('./models/Spot'); // We need our Spot model

// Load env vars
dotenv.config();

// Connect to DB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// --- OUR GWALIOR SPOTS DATA ---
const spots = [
  {
    name: 'Gwalior Fort',
    description: 'An imposing hill fort that has dominated the city for centuries. A must-visit for its rich history and stunning architecture.',
    category: 'historical',
    location: {
      type: 'Point',
      coordinates: [78.1700, 26.2300] // [longitude, latitude]
    },
    imageUrls: ['https://res.cloudinary.com/demo/image/upload/v1683806497/gwalior_fort.jpg'] // Placeholder URL
  },
  {
    name: 'Jai Vilas Palace Museum',
    description: 'A symbol of Gwalior\'s royal past, this palace showcases opulent European architecture and houses a vast museum.',
    category: 'historical',
    location: {
      type: 'Point',
      coordinates: [78.1633, 26.2084]
    },
    imageUrls: ['https://res.cloudinary.com/demo/image/upload/v1683806497/jai_vilas.jpg'] // Placeholder URL
  },
  {
    name: 'Tighra Dam',
    description: 'A serene and vast reservoir perfect for a peaceful evening. Popular for boating and watching the sunset.',
    category: 'nature',
    location: {
      type: 'Point',
      coordinates: [78.0167, 26.2167]
    },
    imageUrls: ['https://res.cloudinary.com/demo/image/upload/v1683806497/tighra_dam.jpg'] // Placeholder URL
  },
  {
    name: 'Sank River Spot',
    description: 'A quiet, natural spot along the Sank River, away from the city hustle. Ideal for creative thoughts and solitude.',
    category: 'nature',
    location: {
      type: 'Point',
      coordinates: [78.1100, 26.2500]
    },
    imageUrls: ['https://res.cloudinary.com/demo/image/upload/v1683806497/sank_river.jpg'] // Placeholder URL
  }
];

// Function to import data into DB
const importData = async () => {
  try {
    await Spot.deleteMany(); // Clear existing spots
    await Spot.insertMany(spots);
    console.log('✅ Data Imported Successfully!');
    process.exit();
  } catch (error) {
    console.error('❌ Error importing data:', error);
    process.exit(1);
  }
};

// Function to delete data from DB
const deleteData = async () => {
  try {
    await Spot.deleteMany();
    console.log('✅ Data Destroyed Successfully!');
    process.exit();
  } catch (error) {
    console.error('❌ Error destroying data:', error);
    process.exit(1);
  }
};

// Command line arguments to run the functions
if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  deleteData();
}