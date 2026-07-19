import express from 'express';
import multer from 'multer';
import path from 'path';
import { createStory, getStories } from '../controllers/storyController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(process.cwd(), 'uploads')),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });

router.post('/', protect, upload.single('media'), createStory);
router.get('/', protect, getStories);

export default router;
