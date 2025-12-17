import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
  },
  password: {
    type: String,
    required: false, // වෙනස් කළ කොටස: Google අයට password නෑ, ඒ නිසා false කළා
  },
  image: {
    type: String,
    default: "",
  },
  role: {
    type: String,
    default: "user",
    enum: ["user", "admin", "vip"],
  },
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', UserSchema);