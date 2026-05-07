import Post from '../models/Post.js';
import mongoose from 'mongoose'; // Added to validate ID format

// @desc    Create new post
export const createPost = async (req, res) => {
  try {
    const { title, content, category, status, coverImage } = req.body;

    if (!title || !content) {
      return res.status(400).json({ success: false, message: 'Please provide both a title and content' });
    }

    const post = await Post.create({
      title,
      content,
      category,
      status,
      coverImage, 
      author: req.user._id 
    });

    if (req.io && req.user) {
      req.io.emit('newPost', {
        message: `New post created by ${req.user.name}`,
        post: { _id: post._id, title: post.title, createdBy: req.user.name }
      });
    }

    res.status(201).json({ success: true, data: post });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get all posts (Global Feed)
export const getPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [posts, total] = await Promise.all([
      Post.find() 
        .select('title content coverImage category status createdAt author')
        .populate('author', 'name email avatar')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Post.countDocuments()
    ]);

    res.status(200).json({
      success: true,
      count: posts.length,
      data: posts,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching posts' });
  }
};

// @desc    Get posts by a specific user
export const getPostsByUser = async (req, res) => {
  try {
    const posts = await Post.find({ author: req.params.userId })
      .select('title content coverImage createdAt author')
      .populate('author', 'name email avatar')
      .sort({ createdAt: -1 })
      .lean();
    res.json({ success: true, data: posts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// ✅ FIXED & DEBUGGED: Get single post by ID
// ==========================================
export const getPostById = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Validate if the ID is a valid MongoDB ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ 
        success: false, 
        message: `Invalid ID format: "${id}". Ensure there are no extra spaces or characters.` 
      });
    }

    // 2. Log attempt to terminal (Check Docker logs for this!)
    console.log(`🔍 Searching for Post ID: [${id}]`);

    const post = await Post.findById(id)
      .populate('author', 'name email avatar')
      .lean(); 

    if (!post) {
      console.log(`❌ No post found for ID: ${id}`);
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    console.log(`✅ Post found: ${post.title}`);
    res.status(200).json({ success: true, data: post });

  } catch (error) {
    console.error('getPostById Error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching post' });
  }
};

// @desc    Update post
export const updatePost = async (req, res) => {
  try {
    console.log("--- UPDATE DEBUG ---");
    console.log("Full Params Object:", req.params); 
    console.log("Target ID:", req.params.id);
    
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });

    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const { title, content, category, status, coverImage } = req.body;
    if (title) post.title = title;
    if (content) post.content = content;
    if (category) post.category = category;
    if (status) post.status = status;
    if (coverImage) post.coverImage = coverImage; 

    const updatedPost = await post.save();
    res.status(200).json({ success: true, data: updatedPost });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating post' });
  }
};

// @desc    Delete post
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });

    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    await post.deleteOne();
    res.status(200).json({ success: true, message: 'Post deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting post' });
  }
};