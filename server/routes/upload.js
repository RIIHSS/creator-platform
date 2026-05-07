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
    // Sends the binary data to Cloudinary
    stream.end(buffer);
  });
};

// ==========================================
// 🚀 UPLOAD ROUTE
// POST /api/upload
// ==========================================
router.post('/', protect, upload.single('image'), async (req, res) => {
  // 1. Check if a file was actually sent
  if (!req.file) {
    return res.status(400).json({ 
      success: false, 
      message: 'No file uploaded' 
    });
  }

  try {
    // 2. Upload the buffer to Cloudinary
    const result = await uploadToCloudinary(req.file.buffer);

    // 3. Return the secure_url and publicId
    res.status(200).json({
      success: true,
      url: result.secure_url,
      publicId: result.public_id
    });

  } catch (error) {
    console.error('Cloudinary Upload Error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Failed to upload to Cloudinary' 
    });
  }
});

// ==========================================
// ⚠️ MULTER ERROR HANDLER
// ==========================================
router.use((error, req, res, next) => {
  if (error.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      success: false,
      message: 'File is too large. Maximum size is 5MB.'
    });
  }

  return res.status(400).json({
    success: false,
    message: error.message || 'File upload error'
  });
});

// ✅ EXPORT THE ROUTER
export default router;