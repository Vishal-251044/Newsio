import express from 'express';
import { likeNews } from '../controllers/likeController.js';

const router = express.Router();

router.post('/like', likeNews);

export default router;
