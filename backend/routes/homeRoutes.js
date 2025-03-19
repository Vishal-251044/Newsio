import express from 'express';
import { getNews } from '../controllers/homeController.js';
import upload from '../uploads.js'; 

const router = express.Router();

router.get('/news', getNews);

router.post('/upload', upload.single('image'), (req, res) => {
  if (req.file) {
    res.json({ imageUrl: req.file.path }); 
  } else {
    res.status(400).json({ message: 'No file uploaded' });
  }
});

export default router;
