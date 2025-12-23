import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Notification from "@/models/Notification";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json([]);

  await connectToDatabase();
  const user = await User.findOne({ email: session.user.email });

  // තමන්ට ආපු Notifications ගන්නවා (අලුත් ඒවා උඩින්)
  const notifications = await Notification.find({ recipient: user._id })
    .populate("sender", "name image")
    .sort({ createdAt: -1 })
    .limit(10); // අන්තිම 10 විතරක් ගමු

  return NextResponse.json(notifications);
}

// Mark as Read Logic (PUT)
export async function PUT(request) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    await connectToDatabase();
    const user = await User.findOne({ email: session.user.email });

    // ඔක්කොම කියෙව්වා කියලා මාර්ක් කරනවා (සරලව)
    await Notification.updateMany({ recipient: user._id, isRead: false }, { isRead: true });
    
    return NextResponse.json({ success: true });
}