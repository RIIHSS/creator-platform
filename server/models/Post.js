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
      required: true,
      index: true // ✅ Single-field index for filtering by author
    },
    // Matches your previous Cloudinary setup
    coverImage: {
      type: String,
      default: null
    },
    // Array of User IDs who liked the post
    likes: [
      { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
      }
    ],
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

// ===============================================================
// ✅ ADVANCED INDEXES (From Snippet 1)
// ===============================================================

// 1. Compound index: Optimized for Dashboard (filter by author + sort by newest)
postSchema.index({ author: 1, createdAt: -1 });

// 2. Global Index: Optimized for public feeds (sort everything by newest)
postSchema.index({ createdAt: -1 });

const Post = mongoose.model('Post', postSchema);

export default Post;