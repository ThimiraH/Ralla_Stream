import mongoose from "mongoose";

const SlideSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    
    // --- New Fields ---
    type: { type: String, enum: ['image', 'video'], default: 'image' }, // Image ද Video ද?
    videoUrl: { type: String }, // වීඩියෝ එකක් නම් R2 Link එක මෙතනට
    tag: { type: String, default: "NEW" }, // "TRENDING", "TOP 10" වගේ tags
    // ------------------

    imageUrl: { type: String, required: true }, // Image එකක් නම් Main Image එක, Video නම් Poster එක
    link: { type: String },
    active: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.Slide || mongoose.model("Slide", SlideSchema);