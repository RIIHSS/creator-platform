import express from 'express';
import { v2 as cloudinary } from 'cloudinary';
import { protect } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// ==========================================
// 💡 CLOUDINARY HELPER FUNCTION
// ==========================================
const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'creator-platform' },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    stream.end(buffer);
  });
};

// ==========================================
// 🚀 UPLOAD ROUTE
// ==========================================
router.post('/', protect, upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ 
      success: false, 
      message: 'No file uploaded' 
    });
  }

  try {
    const result = await uploadToCloudinary(req.file.buffer);

    res.status(200).json({
      success: true,
      url: result.secure_url,
      publicId: result.public_id
    });

  } catch (error) {
    console.error('Cloudinary Upload Error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// ==========================================
// ⚠️ MULTER ERROR HANDLER (Added here)
// ==========================================
// This must have 4 parameters (error, req, res, next) 
// to be recognized as error middleware.
router.use((error, req, res, next) => {
  if (error.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      success: false,
      message: 'File is too large. Maximum size is 5MB.'
    });
  }

  // Handle errors from our fileFilter (wrong file type) 
  // or any other upload errors.
  return res.status(400).json({
    success: false,
    message: error.message || 'File upload error'
  });
});

export default router;