import path from 'path';
import fs from 'fs';
import Post from '../models/Post.js';
import Comment from '../models/Comment.js';

export const createPost = async (req, res) => {
  try {
    const files = req.files || [];
    const mediaFiles = files.map((file) => `/uploads/${file.filename}`);
    const mediaUrl = req.body.mediaUrl?.trim();
    
    // Determine media arrays based on type and source (files or URL)
    let images = [];
    let videos = [];
    
    if (req.body.mediaType === 'image') {
      images = mediaFiles.length > 0 ? mediaFiles : (mediaUrl ? [mediaUrl] : []);
    } else if (req.body.mediaType === 'video') {
      videos = mediaFiles.length > 0 ? mediaFiles : (mediaUrl ? [mediaUrl] : []);
    }

    const post = await Post.create({
      content: req.body.content,
      user: req.user._id,
      images,
      videos
    });
    res.status(201).json({ post });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create post', error: error.message });
  }
};

export const getFeed = async (_req, res) => {
  try {
    const posts = await Post.find().populate('user', 'username fullName profilePicture').sort({ createdAt: -1 });
    res.status(200).json({ posts });
  } catch (error) {
    res.status(500).json({ message: 'Failed to load feed', error: error.message });
  }
};

export const updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (post.user.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Not authorized' });

    post.content = req.body.content || post.content;
    await post.save();
    res.status(200).json({ post });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update post', error: error.message });
  }
};

export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (post.user.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Not authorized' });

    await Comment.deleteMany({ post: post._id });
    await Post.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Post deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete post', error: error.message });
  }
};

export const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (!post.likes.includes(req.user._id)) post.likes.push(req.user._id);
    await post.save();
    res.status(200).json({ message: 'Liked', post });
  } catch (error) {
    res.status(500).json({ message: 'Failed to like post', error: error.message });
  }
};

export const addComment = async (req, res) => {
  try {
    const comment = await Comment.create({ post: req.params.id, user: req.user._id, text: req.body.text });
    const post = await Post.findById(req.params.id);
    post.comments.push(comment._id);
    await post.save();
    res.status(201).json({ comment, post });
  } catch (error) {
    res.status(500).json({ message: 'Failed to add comment', error: error.message });
  }
};

export const sharePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.status(200).json({ message: 'Post shared', post });
  } catch (error) {
    res.status(500).json({ message: 'Failed to share post', error: error.message });
  }
};
