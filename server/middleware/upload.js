const multer = require('multer');

// Configure multer to use memory storage
// This keeps the file in memory as a Buffer, which we can then stream to Cloudinary
const storage = multer.memoryStorage();

// File validation
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Not an image! Please upload an image.'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

module.exports = upload;
