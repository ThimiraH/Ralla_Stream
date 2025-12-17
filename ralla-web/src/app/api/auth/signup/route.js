import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  try {
    const { name, email, password } = await request.json();

    // 1. තොරතුරු ඔක්කොම තියෙනවද බලනවා
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // 2. මේ Email එකෙන් දැනටමත් කෙනෙක් ඉන්නවද බලනවා
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists with this email" },
        { status: 400 }
      );
    }

    // 3. Password එක Encrypt කරනවා (ආරක්ෂිත කරනවා)
    // 10 කියන්නේ salt rounds ගාන (වැඩි වෙන තරමට ආරක්ෂාව වැඩියි, හැබැයි ටිකක් වෙලා යනවා)
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. අලුත් User ව Database එකට දානවා
    await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'user', // ඕනෑම කෙනෙක් මුලින්ම එන්නේ user කෙනෙක් විදිහට
    });

    return NextResponse.json(
      { message: "User registered successfully" },
      { status: 201 }
    );

  } catch (error) {
    console.error("Registration Error:", error);
    return NextResponse.json(
      { message: "An error occurred while registering" },
      { status: 500 }
    );
  }
}