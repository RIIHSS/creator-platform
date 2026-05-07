import mongoose from 'mongoose';

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a title'], // ✅ Back to required
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters']
    },
    content: {
      type: String,
      required: [true, 'Please provide content'], // ✅ Back to required
      minlength: [10, 'Content must be at least 10 characters'],
      trim: true
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Author is required'], // ✅ Required for Dashboard filtering
      index: true 
    },
    coverImage: {
      type: String,
      default: null // Optional: posts can exist without images
    },
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
    timestamps: true // Automatically manages createdAt and updatedAt
  }
);

// ==========================================
// 🚀 PERFORMANCE INDEXES
// ==========================================

// Compound index: Optimized for user dashboards (filter by author + sort by newest)
postSchema.index({ author: 1, createdAt: -1 });

// Global index: Optimized for public feeds (sort everything by newest)
postSchema.index({ createdAt: -1 });

const Post = mongoose.model('Post', postSchema);

export default Post;