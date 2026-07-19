import express from 'express';
import { getProfile, updateProfile, getRelationships, getSuggestedUsers, searchUsers, followUser } from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/me/relationships', protect, getRelationships);
router.get('/suggested', protect, getSuggestedUsers);
router.get('/search', protect, searchUsers);
router.put('/profile', protect, updateProfile);
router.get('/:id', protect, getProfile);
router.post('/:id/follow', protect, followUser);

export default router;
