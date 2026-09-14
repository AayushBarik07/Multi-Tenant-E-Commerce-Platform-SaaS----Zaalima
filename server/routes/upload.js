const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const cloudinary = require('../utils/cloudinary');
const { requireVendor } = require('../middleware/roleMiddleware');

// @route   POST /api/upload
// @desc    Upload an image to Cloudinary and return the URL
// @access  Private (Vendor/Admin only)
router.post('/', requireVendor, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image file provided' });
  }

  // Use upload_stream to upload the buffer from memory to Cloudinary
  const uploadStream = cloudinary.uploader.upload_stream(
    { folder: 'zaalima' },
    (error, result) => {
      if (error) {
        console.error('Cloudinary upload error:', error);
        return res.status(500).json({ error: 'Failed to upload image' });
      }
      res.json({ success: true, url: result.secure_url });
    }
  );

  // Pipe the buffer to the upload stream
  const streamifier = require('streamifier'); // We need streamifier to convert buffer to stream
  streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
});

module.exports = router;
