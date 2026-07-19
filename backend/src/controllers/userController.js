import User from '../models/User.js';

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch profile', error: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.user._id, req.body, { new: true }).select('-password');
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update profile', error: error.message });
  }
};

export const getRelationships = async (req, res) => {
  try {
    const current = await User.findById(req.user._id)
      .populate('followers', 'username fullName profilePicture')
      .populate('following', 'username fullName profilePicture');

    const mutuals = (current.followers || []).filter((follower) =>
      (current.following || []).some((followedUser) => followedUser._id.toString() === follower._id.toString())
    );

    res.status(200).json({
      followers: current.followers || [],
      following: current.following || [],
      mutuals
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch relationships', error: error.message });
  }
};

export const getSuggestedUsers = async (req, res) => {
  try {
    const current = await User.findById(req.user._id);
    const users = await User.find({
      _id: { $ne: current._id, $nin: current.following }
    }).select('-password').limit(5);

    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch suggestions', error: error.message });
  }
};

export const searchUsers = async (req, res) => {
  try {
    const query = req.query.q || '';
    const current = await User.findById(req.user._id);

    if (!query.trim()) {
      return res.status(200).json({ users: [] });
    }

    const users = await User.find({
      _id: { $ne: current._id },
      $or: [
        { username: { $regex: query, $options: 'i' } },
        { fullName: { $regex: query, $options: 'i' } }
      ]
    }).select('-password').limit(10);

    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ message: 'Failed to search users', error: error.message });
  }
};

export const followUser = async (req, res) => {
  try {
    const target = await User.findById(req.params.id);
    const current = await User.findById(req.user._id);
    if (!target || !current) return res.status(404).json({ message: 'User not found' });

    const alreadyFollowing = current.following.some((id) => id.toString() === target._id.toString());

    if (alreadyFollowing) {
      current.following = current.following.filter((id) => id.toString() !== target._id.toString());
      target.followers = target.followers.filter((id) => id.toString() !== current._id.toString());
      await current.save();
      await target.save();
      return res.status(200).json({ message: 'Unfollowed', following: false, followsBack: false });
    }

    current.following.push(target._id);
    target.followers.push(current._id);
    await current.save();
    await target.save();

    const followsBack = target.followers.some((id) => id.toString() === current._id.toString());
    res.status(200).json({ message: 'Followed', following: true, followsBack });
  } catch (error) {
    res.status(500).json({ message: 'Failed to follow user', error: error.message });
  }
};
