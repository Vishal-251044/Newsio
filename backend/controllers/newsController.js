import News from '../models/News.js';

// Create news item
export const createNews = async (req, res) => {
  const { title, description, username, domain } = req.body; 
  const image = req.file ? req.file.path : null; 

  if (!image) {
    return res.status(400).json({ message: 'Image is required' });
  }

  try {
    const news = new News({
      image,  
      title,
      description,
      username,
      domain, 
    });

    await news.save();
    res.status(201).json({ message: 'News created successfully', news });
  } catch (error) {
    console.error('Error creating news:', error);
    return res.status(500).json({ message: 'Error creating news', error: error.message });
  }
};
