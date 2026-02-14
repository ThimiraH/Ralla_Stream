import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Movie from '@/models/Movie';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req, { params }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  // Frontend එකෙන් එවන විස්තර ගන්නවා
  const body = await req.json().catch(() => ({}));
  const { type, seasonNumber, episodeNumber } = body;

  await connectToDatabase();
  const userId = session.user.id || session.user._id;

  try {
    const movie = await Movie.findById(id);
    if (!movie) return NextResponse.json({ success: false }, { status: 404 });

    let isLiked = false;
    let likesCount = 0;

    if (type === 'series' && seasonNumber !== undefined && episodeNumber !== undefined) {
      // --- SERIES LOGIC (Episode Like) ---
      const season = movie.seasons.find(s => s.seasonNumber === parseInt(seasonNumber));
      if (season) {
        const episode = season.episodes.find(e => e.episodeNumber === parseInt(episodeNumber));
        if (episode) {
          // Episode එකේ likedBy array එක හදනවා (නැත්නම්)
          if (!Array.isArray(episode.likedBy)) episode.likedBy = [];

          const userIndex = episode.likedBy.findIndex(uid => uid && uid.toString() === userId.toString());

          if (userIndex !== -1) {
            // Unlike (Remove user)
            episode.likedBy.splice(userIndex, 1);
            isLiked = false;
          } else {
            // Like (Add user)
            episode.likedBy.push(userId);
            isLiked = true;
          }
          likesCount = episode.likedBy.length;
        }
      }
    } else {
      // --- MOVIE LOGIC (Main Like) ---

      if (!Array.isArray(movie.likedBy)) {
        movie.likedBy = [];
      }

      const userIndex = movie.likedBy.findIndex(uid => uid && uid.toString() === userId.toString());

      if (userIndex !== -1) {
        movie.likedBy.splice(userIndex, 1);
        isLiked = false;
      } else {
        movie.likedBy.push(userId);
        isLiked = true;
      }
      likesCount = movie.likedBy.length;
    }

    await movie.save();

    return NextResponse.json({ success: true, isLiked, likesCount }); // අලුත් Count එකත් යවනවා

  } catch (error) {
    console.error("Like Error Detail:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}