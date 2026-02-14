import connectToDatabase from '@/lib/db';
import Movie from '@/models/Movie';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  try {
    await connectToDatabase();

    // --- වෙනස් කළ කොටස (FIX) ---
    // params කියන්නේ Promise එකක් නිසා, අපි ඒක await කරන්න ඕන.
    const { id } = await params;

    // Database එකෙන් ID එකට අදාල ෆිල්ම් එක හොයනවා
    const movie = await Movie.findById(id);

    if (!movie) {
      return NextResponse.json({ success: false, error: "Movie not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: movie }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function PUT(request, { params }) {
  try {
    await connectToDatabase();
    const { id } = await params; // Next.js 15+ වල params await කරන්න ඕන
    const data = await request.json();

    // ID එකෙන් හොයලා Data ටික Update කරනවා
    const updatedMovie = await Movie.findByIdAndUpdate(id, data, {
      new: true, // අලුත් Data ආපහු එවන්න
      runValidators: true // Validation check කරන්න
    });

    if (!updatedMovie) {
      return NextResponse.json({ success: false, error: "Movie not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedMovie });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}