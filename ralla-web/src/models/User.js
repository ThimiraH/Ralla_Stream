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
  watchlist: [{
    type: mongoose.Schema.Types.ObjectId, // String වෙනුවට ObjectId දාන්න ඕන
    ref: "Movie", // මෙතනින් තමයි කියන්නේ මේක Movie model එකට සම්බන්ධයි කියලා
  }],
  forgotPasswordToken: String,
  forgotPasswordTokenExpiry: Date,
},

  { timestamps: true });

export default mongoose.models.User || mongoose.model('User', UserSchema);