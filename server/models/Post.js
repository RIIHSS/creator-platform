import mongoose from 'mongoose';

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters']
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
      minlength: [10, 'Content must be at least 10 characters']
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    // ==========================================
    // ✅ ADDED: coverImage field from Step 1
    // ==========================================
    coverImage: {
      type: String,
      default: null
    },
    // Category specific to your theme
    category: {
      type: String,
      enum: ['Technology', 'Lifestyle', 'Travel', 'Food'],
      default: 'Technology'
    },
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'draft'
    }
  },
  { 
    timestamps: true // Automatically adds createdAt and updatedAt
  }
);

const Post = mongoose.model('Post', postSchema);

export default Post;