import express from 'express';
import { protect } from '../middleware/auth.js';
import { 
  createPost, 
  getPosts, 
  deletePost, 
  getPostById, 
  updatePost,
  getPostsByUser 
} from '../controllers/postController.js';

// 1. Wrap the routes in a function that accepts 'io'
const postRoutes = (io) => {
  const router = express.Router();

  // Middleware to attach socket.io to the request object
  router.use((req, res, next) => {
    req.io = io;
    next();
  });

  // All Post Routes
  router.post('/', protect, createPost);
  router.get('/', protect, getPosts);
  router.get('/user/:userId', protect, getPostsByUser);
  router.get('/:id', protect, getPostById);
  router.put('/:id', protect, updatePost);
  router.delete('/:id', protect, deletePost);

  return router;
};

// ✅ THE FIX: You must have this exact line at the bottom!
export default postRoutes;