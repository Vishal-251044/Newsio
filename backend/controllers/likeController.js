import News from '../models/News.js'; 

export const likeNews = async (req, res) => {
  const { user, newsId } = req.body;

  try {
    // Find the news item
    const news = await News.findById(newsId);
    if (!news) {
      return res.status(404).json({ message: "News not found." });
    }

    // Check if the user has already liked the news
    if (news.likedBy.includes(user)) {
      return res.status(400).json({ message: "You already liked this news." });
    }

    // Add the user to the likedBy array and increment the likes count
    news.likedBy.push(user);
    news.likes += 1;
    await news.save();

    return res.status(200).json({ success: true, message: "News liked!" });
  } catch (error) {
    console.error("Error liking the news:", error);
    return res.status(500).json({ message: "Error liking the news", error });
  }
};
