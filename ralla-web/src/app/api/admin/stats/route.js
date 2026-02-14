import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Movie from "@/models/Movie";
import User from "@/models/User";
import Slide from "@/models/Slide";

export async function GET(request) {
  try {
    await connectToDatabase();

    const [totalUsers, totalMovies, totalSeries, totalSlides] = await Promise.all([
      User.countDocuments({}),
      Movie.countDocuments({ type: "movie" }),
      Movie.countDocuments({ type: "series" }),
      Slide.countDocuments({}),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        users: totalUsers,
        movies: totalMovies,
        series: totalSeries,
        slides: totalSlides,
      },
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}