import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET || 'supersecret', { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

export const register = async (req, res) => {
  try {
    const { username, email, password, fullName } = req.body;
    const existing = await User.findOne({ $or: [{ email }, { username }] });
    if (existing) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const user = await User.create({ username, email, password: hashedPassword, fullName, verificationOtp: otp });

    res.status(201).json({ message: 'Registered successfully', user: { id: user._id, email: user.email, username: user.username }, otp });
  } catch (error) {
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = generateToken(user._id);
    res.status(200).json({ token, user: { id: user._id, username: user.username, email: user.email, fullName: user.fullName, role: user.role, isVerified: user.isVerified } });
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.verificationOtp !== otp) return res.status(400).json({ message: 'Invalid OTP' });

    user.isVerified = true;
    user.verificationOtp = '';
    await user.save();
    res.status(200).json({ message: 'Email verified successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Verification failed', error: error.message });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.forgotPasswordOtp = otp;
    await user.save();
    res.status(200).json({ message: 'OTP sent', otp });
  } catch (error) {
    res.status(500).json({ message: 'Forgot password failed', error: error.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, otp, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.forgotPasswordOtp !== otp) return res.status(400).json({ message: 'Invalid OTP' });

    user.password = await bcrypt.hash(password, 10);
    user.forgotPasswordOtp = '';
    await user.save();
    res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Reset password failed', error: error.message });
  }
};

export const getMe = async (req, res) => {
  res.status(200).json({ user: req.user });
};
