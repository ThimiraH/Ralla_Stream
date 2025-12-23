import mongoose from 'mongoose';

const { Schema } = mongoose;

// --- 1. Episode Schema (TV Series වල අලුත් කොටස) ---
// මේකෙන් තමයි එක එපිසෝඩ් එකක විස්තර තියාගන්නේ
const EpisodeSchema = new Schema({
  episodeNumber: { type: Number, required: true }, // Episode 01, 02...
  title: { type: String, required: true }, // Episode Name
  videoUrl: { type: String, required: true }, // Episode එකේ වීඩියෝ ලින්ක් එක
  thumbnailUrl: { type: String }, // (Optional) Episode එකට වෙනම ෆොටෝ එකක්
  runtime: { type: String }, // උදා: "45 min"
});

// --- 2. Season Schema (Season එකක් ඇතුලේ Episodes ගොඩක් තියෙනවා) ---
const SeasonSchema = new Schema({
  seasonNumber: { type: Number, required: true }, // Season 01, 02...
  episodes: [EpisodeSchema], // උඩ හදපු EpisodeSchema එක මෙතනට දානවා
});

// --- 3. Main Movie Schema (ඔයාගේ පරණ code එක + අලුත් updates) ---
const MovieSchema = new Schema({
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
    required: false, // වෙනස් කළා: TV Series වලට මේක හිස්ව තියෙන්න පුළුවන් නිසා false කළා
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

  // --- අලුත් කොටස් (TV Series Support) ---
  type: {
    type: String,
    default: "movie" // මේක "series" වුනොත් අපි seasons පෙන්නනවා
  },
  seasons: [SeasonSchema], // Series එකක් නම් Seasons ඔක්කොම මෙතන Save වෙනවා

  createdAt: {
    type: Date,
    default: Date.now,
  },
  cast: [
    {
      name: { type: String }, // නළුවාගේ නම
      image: { type: String } // නළුවාගේ පින්තූරය
    }
  ],
});

// Model එක කලින් හැදිලා නම් ඒක ගන්න, නැත්නම් අලුතින් හදන්න
export default mongoose.models.Movie || mongoose.model('Movie', MovieSchema);