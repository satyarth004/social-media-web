import express from 'express';
import multer from 'multer';
import path from 'path';
import { createPost, getFeed, updatePost, deletePost, likePost, addComment, sharePost } from '../controllers/postController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(process.cwd(), 'uploads')),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });

router.post('/', protect, upload.array('media', 5), createPost);
router.get('/feed', protect, getFeed);
router.put('/:id', protect, updatePost);
router.delete('/:id', protect, deletePost);
router.post('/:id/like', protect, likePost);
router.post('/:id/comment', protect, addComment);
router.post('/:id/share', protect, sharePost);

export default router;
