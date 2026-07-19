import express from 'express';
import { getAdminDashboard, manageUsers } from '../controllers/adminController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/dashboard', protect, getAdminDashboard);
router.get('/users', protect, manageUsers);

export default router;
