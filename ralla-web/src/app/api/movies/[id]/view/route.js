import { NextResponse } from 'next/server';
import connectToDatabase from "@/lib/db";
import Movie from '@/models/Movie';

export async function POST(req, { params }) {
  const { id } = await params;

  // Frontend එකෙන් එවන Data ගන්නවා (Season & Episode Numbers)
  const body = await req.json().catch(() => ({}));
  const { seasonNumber, episodeNumber, type } = body;

  await connectToDatabase();

  try {
    const movie = await Movie.findById(id);
    if (!movie) return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });

    if (type === 'series' && seasonNumber !== undefined && episodeNumber !== undefined) {
      // --- SERIES LOGIC ---
      // අදාළ Season එක සහ Episode එක හොයාගන්නවා
      const season = movie.seasons.find(s => s.seasonNumber === parseInt(seasonNumber));
      if (season) {
        const episode = season.episodes.find(e => e.episodeNumber === parseInt(episodeNumber));
        if (episode) {
          // Episode Views වැඩි කරනවා
          episode.views = (episode.views || 0) + 1;

          // කැමති නම් Series එකේ Total Views එකත් වැඩි කරන්න පුළුවන් (Optional)
          movie.views = (movie.views || 0) + 1;
        }
      }
    } else {
      // --- MOVIE LOGIC ---
      movie.views = (movie.views || 0) + 1;
    }

    await movie.save(); // Save changes
    return NextResponse.json({ success: true });

  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
