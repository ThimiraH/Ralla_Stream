import mongoose from "mongoose";

const { Schema } = mongoose;

const commentSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // කමෙන්ට් එක දාපු යූසර්
      required: true,
    },
    movieId: {
      type: String, // මොන ෆිල්ම් එකටද
      required: true,
    },
    text: {
      type: String, // කමෙන්ට් එකේ අකුරු
      required: true,
    },
    // 👇(Reply එකක් නම් Parent Comment එකේ ID එක මෙතනට එනවා)
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
      default: null, // සාමාන්‍ය කමෙන්ට් වලට මේක null වෙනවා
    },
  },
  { timestamps: true } // වෙලාව ඉබේම වැටෙනවා
);

export default mongoose.models.Comment || mongoose.model("Comment", commentSchema);