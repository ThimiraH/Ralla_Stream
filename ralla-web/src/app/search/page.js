import React from 'react';
import connectToDatabase from '@/lib/db';
import Movie from '@/models/Movie';
import Link from 'next/link';

// Database එකෙන් Search කරන Function එක
async function searchMovies(query) {
  if (!query) return [];

  try {
    await connectToDatabase();
    
    // Console log එකක් දාමු Database එකේ හොයන දේ බලන්න
    console.log(`📡 Database Searching for: "${query}"`);

    const rawMovies = await Movie.find({ 
        title: { $regex: query, $options: 'i' } 
    }).lean();

    console.log(`✅ Found ${rawMovies.length} movies`);

    return rawMovies.map(movie => ({
      id: movie._id.toString(),
      name: movie.title,
      image: movie.thumbnailUrl,
      year: movie.year,
      category: movie.category
    }));

  } catch (error) {
    console.error("❌ Search Error:", error);
    return [];
  }
}

export default async function SearchPage({ searchParams }) {
  // --- FIX: searchParams await කිරීම ---
  // Next.js 15 වලදී මේක අනිවාර්යයි
  const resolvedParams = await searchParams;
  const query = resolvedParams?.q || ''; 

  console.log("🔎 User Searched for:", query);

  const movies = await searchMovies(query);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pt-24 px-4 md:px-12">
        
        <h1 className="text-2xl md:text-3xl font-bold mb-8 text-gray-200">
            Search Results for: <span className="text-blue-500 italic">"{query}"</span>
        </h1>

        {movies.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {movies.map((movie) => (
                    <Link key={movie.id} href={`/movie/${movie.id}`} className="group relative transition-transform hover:scale-105 hover:z-10">
                        <div className="relative aspect-2/3 rounded-lg overflow-hidden border border-gray-800 shadow-lg">
                            {/* img tag එක පාවිච්චි කරමු error අඩු වෙන්න */}
                            <img 
                                src={movie.image} 
                                alt={movie.name} 
                                className="w-full h-full object-cover group-hover:opacity-80 transition-opacity"
                            />
                            {/* Play Icon on Hover */}
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/50">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                        <h3 className="mt-2 text-sm font-bold text-gray-300 group-hover:text-white truncate">{movie.name}</h3>
                        <p className="text-xs text-gray-500">{movie.year} • {movie.category}</p>
                    </Link>
                ))}
            </div>
        ) : (
            <div className="text-center py-20">
                <p className="text-xl text-gray-500">No movies found named "{query}"</p>
                <Link href="/" className="text-blue-500 hover:underline mt-4 block">Go back Home</Link>
            </div>
        )}

    </div>
  );
}