import News from "../models/News.js";
import fs from "fs";
import path from "path";

export const removeNews = async (req, res) => {
  try {
    const newsId = req.params.id;

    // Find the news item by ID
    const news = await News.findById(newsId);

    if (!news) {
      return res.status(404).json({ message: "News not found" });
    }

    // Delete the image from the uploads folder
    const imagePath = path.join("uploads", news.image);
    fs.unlink(imagePath, (err) => {
      if (err) {
        console.error("Failed to delete image:", err);
      }
    });

    // Delete the news item from the database
    await News.findByIdAndDelete(newsId);

    // Return the number of likes of the deleted news (used to update the UI)
    res.status(200).json({ message: "News deleted successfully", likes: news.likes });
  } catch (error) {
    console.error("Error deleting news:", error);
    res.status(500).json({ message: "Failed to delete news" });
  }
};
