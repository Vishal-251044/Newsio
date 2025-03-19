import News from "../models/News.js";
import { v2 as cloudinary } from "cloudinary";

export const removeNews = async (req, res) => {
  try {
    const newsId = req.params.id;

    const news = await News.findById(newsId);

    if (!news) {
      return res.status(404).json({ message: "News not found" });
    }

    if (news.image) {
      const imageUrlParts = news.image.split("/");
      const publicIdWithExtension = imageUrlParts[imageUrlParts.length - 1]; 
      const publicId = `uploads/${publicIdWithExtension.split(".")[0]}`; 

      await cloudinary.uploader.destroy(publicId);
    }

    await News.findByIdAndDelete(newsId);

    res.status(200).json({ message: "News deleted successfully", likes: news.likes });
  } catch (error) {
    console.error("Error deleting news:", error);
    res.status(500).json({ message: "Failed to delete news" });
  }
};
