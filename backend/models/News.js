import mongoose from 'mongoose';

const newsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true }, 
  username: { type: String, required: true },
  domain: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  likes: { type: Number, default: 0 }, 
  likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] 
});

const News = mongoose.model('News', newsSchema);

export default News;
