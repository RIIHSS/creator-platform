import express from 'express';
import { protect } from '../middleware/auth.js';
import { 
  createPost, 
  getPosts, 
  deletePost, 
  getPostById, 
  updatePost 
} from '../controllers/postController.js';

// Export a function that accepts the 'io' instance
const postRoutes = (io) => {
  const router = express.Router();

  // MIDDLEWARE: Attach 'io' to the 'req' object 
  // Now every controller function can use req.io.emit()
  router.use((req, res, next) => {
    req.io = io;
    next();
  });

  // Routes (All require authentication)
  router.post('/', protect, createPost);
  router.get('/', protect, getPosts);
  router.get('/:id', protect, getPostById);
  router.put('/:id', protect, updatePost);
  router.delete('/:id', protect, deletePost);

  return router;
};

export default postRoutes;