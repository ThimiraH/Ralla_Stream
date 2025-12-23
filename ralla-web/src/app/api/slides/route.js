import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Slide from "@/models/Slide";

// 1. Slides ලබා ගැනීම (GET) - Active ඒවා විතරක් හෝ ඔක්කොම
export async function GET(request) {
  await connectToDatabase();
  
  const { searchParams } = new URL(request.url);
  const isAdmin = searchParams.get("admin") === "true"; // Admin ද කියලා බලනවා

  try {
    let query = {};
    if (!isAdmin) {
        query = { active: true }; // User ට පෙන්වන්නේ Active ඒවා විතරයි
    }

    // Order එක අනුව පිළිවෙලට ගන්නවා
    const slides = await Slide.find(query).sort({ order: 1, createdAt: -1 });
    return NextResponse.json({ success: true, data: slides });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

// 2. අලුත් Slide එකක් දැමීම (POST)
export async function POST(request) {
  try {
    await connectToDatabase();
    const data = await request.json();
    const newSlide = await Slide.create(data);
    return NextResponse.json({ success: true, data: newSlide }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

// 3. Slide එකක් මැකීම (DELETE)
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    await connectToDatabase();
    await Slide.findByIdAndDelete(id);

    return NextResponse.json({ success: true, message: "Deleted" });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function PUT(request) {
  try {
    await connectToDatabase();
    const data = await request.json();
    const { _id, ...updateData } = data; // ID එක සහ අනිත් Data වෙන් කරගන්නවා

    if (!_id) {
        return NextResponse.json({ success: false, error: "Slide ID is required" }, { status: 400 });
    }

    // Database එකේ Update කරනවා
    const updatedSlide = await Slide.findByIdAndUpdate(_id, updateData, { new: true });

    return NextResponse.json({ success: true, data: updatedSlide });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}