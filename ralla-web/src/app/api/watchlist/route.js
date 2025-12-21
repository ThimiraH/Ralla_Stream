import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // Auth Settings

export async function POST(request) {
  // 1. User Log වෙලාද බලනවා
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  // 2. එවන Movie ID එක ගන්නවා
  const { movieId } = await request.json();

  await connectToDatabase();

  try {
    // 3. User ව හොයාගන්නවා
    const user = await User.findOne({ email: session.user.email });

    if (!user) {
        return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // 4. කලින් ලිස්ට් එකේ තියෙනවද බලනවා
    const isAdded = user.watchlist.includes(movieId);

    if (isAdded) {
      // තියෙනවා නම් අයින් කරනවා (Remove)
      user.watchlist = user.watchlist.filter((id) => id !== movieId);
      await user.save();
      return NextResponse.json({ message: "Removed from List", added: false });
    } else {
      // නැත්නම් ඇඩ් කරනවා (Add)
      user.watchlist.push(movieId);
      await user.save();
      return NextResponse.json({ message: "Added to List", added: true });
    }

  } catch (error) {
    return NextResponse.json({ message: "Error", error }, { status: 500 });
  }
}

// මේක අර POST එකට පහළින් දාන්න
export async function GET(request) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ watchlist: [] });
  }

  await connectToDatabase();

  try {
    const user = await User.findOne({ email: session.user.email });
    // User ගේ දැනට තියෙන list එක එවන්න
    return NextResponse.json({ watchlist: user?.watchlist || [] });
  } catch (error) {
    return NextResponse.json({ watchlist: [] }, { status: 500 });
  }
}