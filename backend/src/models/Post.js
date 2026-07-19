import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, default: '' },
  images: [{ type: String }],
  videos: [{ type: String }],
  hashtags: [{ type: String }],
  mentions: [{ type: String }],
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  savedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  pinned: { type: Boolean, default: false },
  isReported: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model('Post', postSchema);
