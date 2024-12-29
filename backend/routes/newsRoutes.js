import express from 'express';
import { createNews } from '../controllers/newsController.js';
import upload from '../uploads.js'; 

const router = express.Router();

router.post('/create', upload.single('image'), createNews);

export default router;
