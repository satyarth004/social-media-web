import Story from '../models/Story.js';

export const createStory = async (req, res) => {
  try {
    const file = req.file;
    const mediaUrl = file ? `/uploads/${file.filename}` : req.body.mediaUrl;
    const story = await Story.create({
      user: req.user._id,
      mediaUrl,
      mediaType: req.body.mediaType || 'image',
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
    });
    res.status(201).json({ story });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create story', error: error.message });
  }
};

export const getStories = async (_req, res) => {
  try {
    const stories = await Story.find({ expiresAt: { $gt: new Date() } }).populate('user', 'username fullName profilePicture').sort({ createdAt: -1 });
    res.status(200).json({ stories });
  } catch (error) {
    res.status(500).json({ message: 'Failed to load stories', error: error.message });
  }
};
