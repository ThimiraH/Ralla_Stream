import mongoose from "mongoose";

const { Schema } = mongoose;

const notificationSchema = new Schema(
  {
    recipient: { type: Schema.Types.ObjectId, ref: "User", required: true }, // කාටද යන්නේ
    sender: { type: Schema.Types.ObjectId, ref: "User", required: true }, // කවුද දැම්මේ
    movieId: { type: String, required: true }, // මොන ෆිල්ම් එකේද
    text: { type: String }, // පොඩි විස්තරයක්
    isRead: { type: Boolean, default: false }, // කියෙව්වද නැද්ද
  },
  { timestamps: true }
);

export default mongoose.models.Notification || mongoose.model("Notification", notificationSchema);