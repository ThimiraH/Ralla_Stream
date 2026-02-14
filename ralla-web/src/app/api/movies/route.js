import connectToDatabase from '@/lib/db';
import Movie from '@/models/Movie';
import { NextResponse } from 'next/server';

// 1. දත්ත ඇතුලත් කිරීම (POST Request)
export async function POST(request) {
  try {
    // Database එකට connect වෙන්න
    await connectToDatabase();

    // Frontend එකෙන් එවන Data ටික කියවගන්න
    const data = await request.json();

    // අලුත් Movie එකක් හදන්න
    const newMovie = await Movie.create(data);

    // සාර්ථක නම් පණිවිඩයක් යවන්න
    return NextResponse.json({ success: true, data: newMovie }, { status: 201 });

  } catch (error) {
    // වැරදුනොත් Error එක යවන්න
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

// 2. දත්ත ලබා ගැනීම (GET Request - පසුවට ඕන වෙයි)
export async function GET() {
  try {
    await connectToDatabase();
    const movies = await Movie.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: movies });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}