import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs"; // Password එක Hash කරන්න ඕන

export async function POST(request) {
  try {
    const { token, password } = await request.json();

    await connectToDatabase();

    // 1. Token එක තියෙන සහ Token එක කල් ඉකුත් නොවූ (Expiry > Now) User කෙනෙක් ඉන්නවද බලනවා
    const user = await User.findOne({
      forgotPasswordToken: token,
      forgotPasswordTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return NextResponse.json({ message: "Invalid or expired token" }, { status: 400 });
    }

    // 2. අලුත් Password එක Hash කරනවා
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. User Update කරනවා (Password මාරු කරනවා + Token ටික මකනවා)
    user.password = hashedPassword;
    user.forgotPasswordToken = undefined;
    user.forgotPasswordTokenExpiry = undefined;
    
    await user.save();

    return NextResponse.json({ message: "Password reset successful" });

  } catch (error) {
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}