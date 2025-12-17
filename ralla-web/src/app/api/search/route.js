import connectToDatabase from '@/lib/db';
import Movie from '@/models/Movie';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query) {
      return NextResponse.json({ success: true, data: [] });
    }

    await connectToDatabase();

    // අකුරු භාගයක් ගැහුවත් එන විදිහට (Regex) හොයමු. Limit 5ක් දාමු ලිස්ට් එක දිග වැඩි නොවෙන්න.
    const movies = await Movie.find({ 
      title: { $regex: query, $options: 'i' } 
    }).limit(5).select('title _id year category thumbnailUrl');

    return NextResponse.json({ success: true, data: movies });

  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}