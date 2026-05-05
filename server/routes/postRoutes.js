import express from 'express';
import { protect } from '../middleware/auth.js';
import { 
  createPost, 
  getPosts, 
  deletePost, 
  getPostById, 
  updatePost,
  getPostsByUser // ✅ Added this new controller function
} from '../controllers/postController.js';

const postRoutes = (io) => {
  const router = express.Router();

  // Attach 'io' to the 'req' object 
  router.use((req, res, next) => {
    req.io = io;
    next();
  });

  // GET all posts (Now with populate in the controller)
  router.get('/', protect, getPosts);

  // GET posts for a specific user (New from Snippet 1)
  router.get('/user/:userId', protect, getPostsByUser);

  // GET single post
  router.get('/:id', protect, getPostById);

  // Create, Update, Delete
  router.post('/', protect, createPost);
  router.put('/:id', protect, updatePost);
  router.delete('/:id', protect, deletePost);

  return router;
};

export default postRoutes;