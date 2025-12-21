import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import Movie from "@/models/Movie"; // Movie මොඩල් එක import කරන්න ඕන (ඔයාගේ Movie Model එකේ නම බලන්න)
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";

// මේක Server Component එකක් නිසා කෙලින්ම Data ගන්න පුළුවන්
export default async function MyListPage() {
  const session = await getServerSession(authOptions);

  // 1. Login වෙලා නැත්නම් Login එකට යවනවා
  if (!session) {
    redirect("/login");
  }

  await connectToDatabase();

  // 2. User ගේ විස්තර අරගෙන, එයාගේ watchlist එකේ තියෙන ෆිල්ම් වල විස්තර (populate) ගන්නවා
  // 'watchlist' කියන එකේ තියෙන්නේ IDs විතරනේ, populate දැම්මම සම්පූර්ණ විස්තර එනවා.
  // වැදගත්: ඔයාගේ Movie Model එකේ නම හරියටම බලන්න. මම හිතන්නේ "Movie" ඇති.
  
  const user = await User.findOne({ email: session.user.email }).populate({
    path: 'watchlist',
    model: Movie // මෙතන ඔයාගේ Movie Model එක import කරපු නම දෙන්න
  });

  const watchlistMovies = user?.watchlist || [];

  return (
    <>
      <div className="min-h-screen bg-[#0a0a0a] pt-24 px-4 md:px-12 pb-10">
        <h1 className="text-3xl font-bold text-white mb-8">My Watch List</h1>

        {watchlistMovies.length === 0 ? (
          <div className="text-center text-gray-500 mt-20">
            <h2 className="text-xl">Your list is empty 😢</h2>
            <p className="mt-2">Go add some movies to watch later!</p>
            <Link href="/" className="inline-block mt-4 bg-blue-600 px-6 py-2 rounded-full text-white font-bold hover:bg-blue-700 transition">
              Browse Movies
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {watchlistMovies.map((movie) => (
              <Link href={`/movie/${movie._id}`} key={movie._id} className="group relative aspect-2/3 overflow-hidden rounded-xl bg-gray-800 transition hover:scale-105 hover:shadow-xl hover:shadow-blue-900/20">
                 {/* Thumbnail Image */}
                 <Image
                    src={movie.thumbnailUrl || "/placeholder.jpg"} 
                    alt={movie.title}
                    fill
                    className="object-cover transition group-hover:opacity-80"
                 />
                 
                 {/* Hover Overlay */}
                 <div className="absolute inset-0 flex flex-col justify-end p-4 bg-linear-to-t from-black via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <h3 className="text-white font-bold truncate">{movie.title}</h3>
                    <p className="text-green-400 text-xs font-bold">{movie.year}</p>
                 </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}