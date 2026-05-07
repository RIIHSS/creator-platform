import Post from '../models/Post.js';

// @desc    Create new post
// @route   POST /api/posts
// @access  Private
export const createPost = async (req, res) => {
  try {
    const { title, content, category, status, coverImage } = req.body;


    const post = await Post.create({
      title,
      content,
      category,
      status,
      coverImage, 
      author: req.user ? req.user._id : null
    });

    if (req.io) {
      req.io.emit('newPost', {
        message: `New post created by ${req.user.name}`,
        post: { _id: post._id, title: post.title, createdBy: req.user.name }
      });
    }

    res.status(201).json({ success: true, message: 'Post created successfully', data: post });
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ success: false, message: 'Error creating post', error: error.message });
  }
};

// @desc    Get posts with pagination (Dashboard View)
// @route   GET /api/posts?page=1&limit=10
// @access  Private
export const getPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // ==========================================
    // 🧪 STEP 7: Performance Analysis (.explain)
    // ==========================================
    const explanation = await Post.find({ author: req.user._id })
      .sort({ createdAt: -1 })
      .explain('executionStats');
    
    console.log("=== MONGODB QUERY PLAN ANALYSIS ===");
    console.log("Winning Stage:", explanation.queryPlanner.winningPlan.stage); 
    console.log("Docs Examined:", explanation.executionStats.totalDocsExamined);
    console.log("Execution Time (ms):", explanation.executionStats.executionTimeMillis);
    // ==========================================

    // Optimized parallel queries from Step 6
    const [posts, total] = await Promise.all([
      Post.find({ author: req.user._id })
        .select('title content coverImage category status createdAt author')
        .populate('author', 'name email avatar')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Post.countDocuments({ author: req.user._id })
    ]);

    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      success: true,
      data: posts,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    console.error('Get posts error:', error);
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

// @desc    Get single post by ID
export const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'name email avatar')
      .lean(); 

    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });

    if (post.author._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    res.status(200).json({ success: true, data: post });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching post' });
  }
};

// @desc    Update post
export const updatePost = async (req, res) => {
  try {
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

    res.status(200).json({
      success: true,
      message: 'Post updated successfully',
      data: updatedPost
    });
  } catch (error) {
    console.error('Update post error:', error);
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

    res.status(200).json({
      success: true,
      message: 'Post deleted successfully',
      data: { id: req.params.id }
    });
  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({ success: false, message: 'Error deleting post' });
  }
};