import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import { v4 as uuidv4 } from "uuid";
import nodemailer from "nodemailer"; // 1. Nodemailer ගත්තා

export async function POST(request) {
  try {
    const { email } = await request.json();

    await connectToDatabase();

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    if (!user.password) {
        return NextResponse.json({ message: "This account uses Google Login. No password to reset." }, { status: 400 });
    }

    const token = uuidv4();
    user.forgotPasswordToken = token;
    user.forgotPasswordTokenExpiry = Date.now() + 3600000; // 1 hour
    await user.save();

    const resetUrl = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/reset-password?token=${token}`;

    // 2. Gmail Transporter එක හැදුවා
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    // 3. Email එක යැවුවා
    await transporter.sendMail({
      from: '"Ralla Stream Support" <' + process.env.GMAIL_USER + '>', // යවන නම
      to: email, // දැන් ඕනම Email එකකට යවන්න පුළුවන්!
      subject: "Reset Your Password - RALLA",
      html: `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h2>Password Reset Request</h2>
          <p>You requested to reset your password for Ralla Stream.</p>
          <p>Click the link below to reset it:</p>
          <a href="${resetUrl}" style="background-color: #2563EB; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
          <p style="margin-top: 20px; font-size: 12px; color: #666;">If you didn't request this, please ignore this email.</p>
        </div>
      `,
    });

    return NextResponse.json({ message: "Email sent successfully" });

  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}