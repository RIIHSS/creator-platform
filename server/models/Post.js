import mongoose from 'mongoose';

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      default: 'Untitled Post', // ✅ Fallback if empty
      trim: true
      // ❌ Removed maxlength to prevent "Title too long" errors
    },
    content: {
      type: String,
      default: 'No content given.', // ✅ Fallback if empty
      trim: true
      // ❌ Removed minlength to prevent "Content too short" errors
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      index: true 
    },
    coverImage: {
      type: String,
      default: null
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
    timestamps: true 
  }
);

// Indexes for performance
postSchema.index({ author: 1, createdAt: -1 });
postSchema.index({ createdAt: -1 });

const Post = mongoose.model('Post', postSchema);

export default Post;