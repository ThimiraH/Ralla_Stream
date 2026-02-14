import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import User from "@/models/User"; // ඔයාගේ User Model එක import කරගන්න

// 1. Get All Users (GET)
export async function GET(request) {
  try {
    await connectToDatabase();
    
    // password එක අතෑරලා අනිත් විස්තර ටික ගන්නවා (.select("-password"))
    // අලුත් අය උඩින් එන්න sort කරනවා
    const users = await User.find({}).select("-password").sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: users });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

// 2. Make Admin / Update Role (PUT)
export async function PUT(request) {
  try {
    await connectToDatabase();
    const { id, isAdmin } = await request.json();

    const updatedUser = await User.findByIdAndUpdate(
      id, 
      { isAdmin: isAdmin }, // Admin ද නැද්ද කියන එක update කරනවා
      { new: true }
    ).select("-password");

    return NextResponse.json({ success: true, data: updatedUser });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

// 3. Delete User (DELETE)
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    await connectToDatabase();
    await User.findByIdAndDelete(id);

    return NextResponse.json({ success: true, message: "User deleted" });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}