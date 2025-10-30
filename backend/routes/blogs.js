import express from 'express';
import { body, validationResult } from 'express-validator';
import Blog from '../models/Blog.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @desc    Get all blogs for current user
// @route   GET /api/blogs/user
// @access  Private
router.get('/user', protect, async (req, res, next) => {
  try {
    const blogs = await Blog.find({ author: req.user._id })
      .sort({ createdAt: -1 });

    res.json(blogs);
  } catch (error) {
    next(error);
  }
});

// @desc    Get all published blogs
// @route   GET /api/blogs
// @access  Public
router.get('/', async (req, res, next) => {
  try {
    const blogs = await Blog.find()
      .populate('author', 'name')
      .sort({ createdAt: -1 });

    res.json(blogs);
  } catch (error) {
    next(error);
  }
});

// @desc    Get single blog
// @route   GET /api/blogs/:id
// @access  Public
router.get('/:id', async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id).populate('author', 'name');

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }

    // Increment views
    blog.views += 1;
    await blog.save();

    res.json(blog);
  } catch (error) {
    next(error);
  }
});

// @desc    Create new blog
// @route   POST /api/blogs
// @access  Private
router.post('/', protect, [
  body('title').trim().isLength({ min: 5, max: 200 }).withMessage('Title must be between 5 and 200 characters'),
  body('content').trim().isLength({ min: 50, max: 10000 }).withMessage('Content must be between 50 and 10000 characters')
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: errors.array()[0].msg
      });
    }

    const { title, content, tags } = req.body;

    const blog = await Blog.create({
      title,
      content,
      tags: tags || [],
      author: req.user._id
    });

    res.status(201).json(blog);
  } catch (error) {
    next(error);
  }
});

// @desc    Update blog
// @route   PUT /api/blogs/:id
// @access  Private
router.put('/:id', protect, [
  body('title').trim().isLength({ min: 5, max: 200 }).withMessage('Title must be between 5 and 200 characters'),
  body('content').trim().isLength({ min: 50, max: 10000 }).withMessage('Content must be between 50 and 10000 characters')
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: errors.array()[0].msg
      });
    }

    let blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }

    // Make sure user owns blog
    if (blog.author._id.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this blog'
      });
    }

    const { title, content, tags } = req.body;

    blog = await Blog.findByIdAndUpdate(
      req.params.id,
      { title, content, tags: tags || [] },
      { new: true, runValidators: true }
    );

    res.json(blog);
  } catch (error) {
    next(error);
  }
});

// @desc    Delete blog
// @route   DELETE /api/blogs/:id
// @access  Private
router.delete('/:id', protect, async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }

    // Make sure user owns blog
    if (blog.author._id.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to delete this blog'
      });
    }

    await Blog.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Blog deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

export default router;