import express from 'express';
import { getUserNews } from '../controllers/profileNewsController.js';

const router = express.Router();

router.get('/user/:username', getUserNews);

export default router;
