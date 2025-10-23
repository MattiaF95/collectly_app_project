import express from 'express';
import { uploadImages, deleteUploadedImage } from '../controllers/upload.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { upload } from '../config/multer.config.js';

const router = express.Router();

router.use(authenticate);

router.post('/', upload.array('images', 10), uploadImages);
router.delete('/', deleteUploadedImage);

export default router;
