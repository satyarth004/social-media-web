import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  password: { type: String, required: true, minlength: 6 },
  fullName: { type: String, default: '' },
  bio: { type: String, default: '' },
  location: { type: String, default: '' },
  website: { type: String, default: '' },
  profilePicture: { type: String, default: '' },
  coverPhoto: { type: String, default: '' },
  isVerified: { type: Boolean, default: false },
  verificationOtp: { type: String, default: '' },
  forgotPasswordOtp: { type: String, default: '' },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  isPrivate: { type: Boolean, default: false },
  online: { type: Boolean, default: false },
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  savedPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
  blockedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model('User', userSchema);
