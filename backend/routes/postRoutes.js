
const express = require('express');
const router = express.Router();
const Post = require('../models/post');
const authenticate = require('../authMiddleware');


router.post('/add', authenticate, async (req, res) => {
  try {
    const { title, body, device, no_of_comments } = req.body;

    const newPost = new Post({
      user: req.user.id,
      title,
      body,
      device,
      no_of_comments,
    });

    await newPost.save();

    return res.status(201).json({ message: 'Post created successfully' });
  } catch (error) {
    console.error('Error in post creation:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});


router.get('/', authenticate, async (req, res) => {
  try {
    const { device, minComments, maxComments, page } = req.query;
    const limit = 3;
    const skip = (page - 1) * limit;

    const query = { user: req.user.id };

    if (device) {
      query.device = device;
    }

    if (minComments && maxComments) {
      query.no_of_comments = { $gte: minComments, $lte: maxComments };
    }

    const posts = await Post.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return res.status(200).json(posts);
  } catch (error) {
    console.error('Error in fetching posts:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});


router.put('/update/:postId', authenticate, async (req, res) => {
  try {
    const { title, body, device, no_of_comments } = req.body;

    const updatedPost = await Post.findByIdAndUpdate(
      req.params.postId,
      {
        title,
        body,
        device,
        no_of_comments,
      },
      { new: true }
    );

    if (!updatedPost) {
      return res.status(404).json({ message: 'Post not found' });
    }

    return res.status(200).json({ message: 'Post updated successfully' });
  } catch (error) {
    console.error('Error in post update:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});


router.delete('/delete/:postId', authenticate, async (req, res) => {
  try {
    const deletedPost = await Post.findByIdAndDelete(req.params.postId);

    if (!deletedPost) {
      return res.status(404).json({ message: 'Post not found' });
    }

    return res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error in post deletion:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
