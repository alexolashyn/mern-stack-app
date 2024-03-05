const express = require('express');
const postRouter = express.Router();

const auth = require('../../middleware/auth');
const Post = require('../../models/posts');
const postValidatiionSchema = require('../../middleware/validation/posts');

postRouter.post('/add', auth, async (req, res) => {
  try {
    const { id, username } = req.user;
    const postData = req.body;
    await postValidatiionSchema.validateAsync(postData);
    const post = await Post.create({
      user: id,
      text: postData.text,
      name: username,
    });
    return res.status(200).json({ post });
  } catch (error) {
    if (error.details) {
      return res.status(400).json({ message: error.details[0].message });
    }
    return res.status(500).json({ message: error });
  }
});

postRouter.get('/my-posts', auth, async (req, res) => {
  try {
    const { id } = req.user;
    const posts = await Post.find({ user: id });
    if (!posts) {
      return res
        .status(404)
        .json({ message: 'You have not created any posts yet!' });
    }
    return res.status(200).json({ posts });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
});

postRouter.get('/', auth, async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 });
    return res.status(200).json({ posts });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
});

postRouter.get('/post/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post is not found!' });
    }
    return res.status(200).json({ post });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Post is not found!' });
    }
    return res.status(500).json({ message: error });
  }
});

postRouter.delete('/delete/:id', auth, async (req, res) => {
  try {
    const deleteCriteria = {
      _id: req.params.id,
      user: req.user.id,
    };

    const post = await Post.findByIdAndDelete(deleteCriteria);

    if (!post) {
      return res.status(400).json({ message: 'Post is not deleted!' });
    }
    return res.status(200).json({ post });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Post is not deleted!' });
    }
    return res.status(500).json({ message: error });
  }
});

postRouter.post('/like/:id', auth, async (req, res) => {
  try {
    const { id } = req.user;
    const postId = req.params.id;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: 'Post is not found!' });
    }

    const isLiked = post.likes.some((like) => like.user.toString() === id);

    if (isLiked) {
      post.likes = post.likes.filter((el) => el.user.toString() !== id);
    } else {
      post.likes.push({ user: id });
    }

    const updatedPost = await post.save();
    return res.status(200).json({ updatedPost });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Post is not found!' });
    }
    return res.status(500).json({ message: error });
  }
});

postRouter.post('/comment/:id', auth, async (req, res) => {
  try {
    const { id, username } = req.user;
    const commentData = req.body;

    await postValidatiionSchema.validateAsync(commentData);

    const postId = req.params.id;

    const newComment = {
      user: id,
      text: commentData.text,
      name: username,
    };
    const post = await Post.findByIdAndUpdate(
      postId,
      { $push: { comments: newComment } },
      { new: true }
    );
    if (!post) {
      return res.status(404).json({ message: 'Post is not found!' });
    }
    return res.status(200).json({ post });
  } catch (error) {
    if (error.details) {
      return res.status(400).json({ message: error.details[0].message });
    }
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Post is not found!' });
    }
    return res.status(500).json({ message: error });
  }
});

module.exports = postRouter;
