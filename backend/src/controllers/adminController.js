import User from '../models/User.js';
import Post from '../models/Post.js';

export const getAdminDashboard = async (_req, res) => {
  try {
    const users = await User.countDocuments();
    const posts = await Post.countDocuments();
    res.status(200).json({ stats: { users, posts } });
  } catch (error) {
    res.status(500).json({ message: 'Failed to load dashboard', error: error.message });
  }
};

export const manageUsers = async (_req, res) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch users', error: error.message });
  }
};
