const cloudinary = require('cloudinary').v2;
require('dotenv').config();

// The CLOUDINARY_URL environment variable is automatically picked up if set correctly
// Format: cloudinary://my_key:my_secret@my_cloud_name
if (!process.env.CLOUDINARY_URL) {
  console.warn('Warning: CLOUDINARY_URL is not set in environment variables.');
}

module.exports = cloudinary;
