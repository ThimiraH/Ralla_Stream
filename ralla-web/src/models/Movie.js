import mongoose from 'mongoose';

const MovieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a movie title'],
  },
  description: {
    type: String,
    required: true,
  },
  videoUrl: {
    type: String,
    required: true, // වීඩියෝ ලින්ක් එක
  },
  thumbnailUrl: {
    type: String,
    required: true, // පෝස්ටර් එක
  },
  year: {
    type: String,
  },
  genre: {
    type: String, // උදා: Action, Sci-Fi
  },
  rating: {
    type: Number,
    default: 0,
  },
  category: {
    type: String,
    default: 'movie', // movie, series, or drama
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Model එක කලින් හැදිලා නම් ඒක ගන්න, නැත්නම් අලුතින් හදන්න
export default mongoose.models.Movie || mongoose.model('Movie', MovieSchema);