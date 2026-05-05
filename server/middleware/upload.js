import multer from 'multer';

// 1. Configure Memory Storage
// This keeps the file in RAM (req.file.buffer) instead of saving to a folder.
const storage = multer.memoryStorage();

// 2. Define the Multer configuration
const upload = multer({
  storage: storage,
  limits: {
    // 5MB = 5 * 1024 * 1024 bytes
    fileSize: 5 * 1024 * 1024 
  },
  fileFilter: (req, file, cb) => {
    // Define allowed MIME types
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

    if (allowedTypes.includes(file.mimetype)) {
      // Accept the file
      cb(null, true);
    } else {
      // Reject the file with an error
      cb(new Error('Only image files (JPEG, PNG, WEBP, GIF) are allowed'), false);
    }
  }
});

export default upload;