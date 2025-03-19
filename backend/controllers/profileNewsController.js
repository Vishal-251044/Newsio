import News from '../models/News.js';

export const getUserNews = async (req, res) => {
  const { username } = req.params; // Get the username from the request parameters
  try {
    const news = await News.find({ username }); // Fetch news by username
    res.status(200).json(news); // Send back the news data
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
