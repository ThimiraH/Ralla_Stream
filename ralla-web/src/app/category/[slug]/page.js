import React from 'react';
import connectToDatabase from '@/lib/db';
import Movie from '@/models/Movie';
import Link from 'next/link';
import MovieRow from '@/components/MovieRow';
import CategoryHero from '@/components/CategoryHero';

async function getMoviesByCategory(slug) {
    try {
        await connectToDatabase();
        const decodedSlug = decodeURIComponent(slug).trim();
        let query = {};

        // if (decodedSlug === "TV Series" || decodedSlug === "tv-series") {
        //     query = { category: { $in: ['drama', 'series', 'tv series', 'tv-series'] } };
        // } else {
        //     query = { category: decodedSlug.toLowerCase() };
        // }

        if (decodedSlug.toLowerCase() === "anime") {
            query = {
                category: { $regex: /anime|donghua/i }
            };
        }
        else if (decodedSlug === "TV Series" || decodedSlug === "tv-series") {
            query = {
                category: { $in: ['drama', 'series', 'tv series', 'tv-series','K-Drama','C-Drama','J-Drama'] }
            };
        }
        else {
            query = { category: decodedSlug.toLowerCase() };
        }

        const rawMovies = await Movie.find(query).sort({ createdAt: -1 }).lean();

        return rawMovies.map(movie => ({
            id: movie._id.toString(),
            name: movie.title,
            image: movie.thumbnailUrl,
            year: movie.year,
            category: movie.category,
            genre: movie.genre || ""
        }));

    } catch (error) {
        console.error("Category Error:", error);
        return [];
    }
}

export default async function CategoryPage({ params }) {
    const resolvedParams = await params;
    const { slug } = resolvedParams;
    const decodedSlug = decodeURIComponent(slug);
    const displayTitle = decodedSlug.charAt(0).toUpperCase() + decodedSlug.slice(1);

    const allMovies = await getMoviesByCategory(slug);

    // --- ROWS LOGIC ---
    const recentlyAdded = allMovies.slice(0, 10);

    const shuffled = [...allMovies].sort(() => 0.5 - Math.random());
    const trending = shuffled.slice(0, 10);
    const popular = shuffled.slice(10, 20);

    // Others: මෙයාලව තමයි අපි Grid එකක් කරන්න යන්නේ (All Items)
    const others = allMovies;

    // Anime Filters
    const donghuaList = allMovies.filter(m => m.category && m.category.toLowerCase().includes('donghua'));
    const animeList = allMovies.filter(m => m.category && m.category.toLowerCase().includes('anime') && !m.category.toLowerCase().includes('donghua'));
    // Other Animation Grid එකට
    const otherAnimation = allMovies.filter(m => m.category && !m.category.toLowerCase().includes('donghua') && !m.category.toLowerCase().includes('anime'));


    // --- LAYOUT A: TV Series & Movies ---
    if (['TV Series', 'Movies', 'Movie'].includes(displayTitle) || displayTitle.toLowerCase().includes('drama')) {
        return (
            <main className="min-h-screen bg-[#0a0a0a] pb-20 relative">
                <CategoryHero movies={allMovies} />

                <div className="relative z-20 mt-[-50px] pl-4 md:pl-12 mb-6">
                    <h2 className="text-2xl md:text-3xl font-bold text-white drop-shadow-md">{displayTitle} Collection</h2>
                </div>

                <div className="relative z-20 space-y-12">
                    {/* 1. Horizontal Rows (පැත්තට යන ඒවා) */}
                    {recentlyAdded.length > 0 && <MovieRow title="Recently Added" movies={recentlyAdded} />}
                    {trending.length > 0 && <MovieRow title={`Trending ${displayTitle}`} movies={trending} />}
                    {popular.length > 0 && <MovieRow title="Most Popular" movies={popular} />}

                    {/* 2. Vertical Grid (පහළට යන එක - All / Others) */}
                    {others.length > 0 && (
                        <div className="px-4 md:px-12 mt-10">
                            <h3 className="text-xl font-bold text-gray-200 mb-4 border-l-4 border-blue-600 pl-3">
                                All {displayTitle} Library
                            </h3>
                            {/* Grid Layout */}
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                                {others.map((movie) => (
                                    <Link key={movie.id} href={`/movie/${movie.id}`} className="group relative transition-transform hover:scale-105 hover:z-10">
                                        <div className="relative aspect-2/3 rounded-lg overflow-hidden border border-gray-800 shadow-lg">
                                            <img src={movie.image} alt={movie.name} className="w-full h-full object-cover group-hover:opacity-80 transition-opacity" />
                                            {/* Play Icon */}
                                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/50">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" /></svg>
                                                </div>
                                            </div>
                                        </div>
                                        <h3 className="mt-2 text-sm font-bold text-gray-300 group-hover:text-white truncate">{movie.name}</h3>
                                        <p className="text-xs text-gray-500">{movie.year}</p>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Empty State */}
                    {allMovies.length === 0 && (
                        <div className="text-gray-500 text-center py-20 text-lg">No movies found in this collection.</div>
                    )}
                </div>
            </main>
        );
    }

    // --- LAYOUT B: Anime ---
    if (displayTitle === 'Anime') {
        return (
            <main className="min-h-screen bg-[#0a0a0a] pb-20 relative">
                <CategoryHero movies={allMovies} />

                <div className="relative z-20 mt-[-50px] pl-4 md:pl-12 mb-6">
                    <h2 className="text-2xl md:text-3xl font-bold text-white drop-shadow-md">Anime World</h2>
                </div>

                <div className="relative z-20 space-y-12">
                    {/* Horizontal Rows */}
                    {recentlyAdded.length > 0 && <MovieRow title="Recently Added Anime" movies={recentlyAdded} />}
                    {donghuaList.length > 0 && <MovieRow title="Chinese Animation (Donghua)" movies={donghuaList} />}
                    {animeList.length > 0 && <MovieRow title="Japan Animations (Anime)" movies={animeList} />}

                    {/* Vertical Grid for Other Animation */}
                    {otherAnimation.length > 0 && (
                        <div className="px-4 md:px-12 mt-10">
                            <h3 className="text-xl font-bold text-gray-200 mb-4 border-l-4 border-blue-600 pl-3">
                                Other Animations
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                                {otherAnimation.map((movie) => (
                                    <Link key={movie.id} href={`/movie/${movie.id}`} className="group relative transition-transform hover:scale-105 hover:z-10">
                                        <div className="relative aspect-2/3 rounded-lg overflow-hidden border border-gray-800 shadow-lg">
                                            <img src={movie.image} alt={movie.name} className="w-full h-full object-cover group-hover:opacity-80 transition-opacity" />
                                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/50">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" /></svg>
                                                </div>
                                            </div>
                                        </div>
                                        <h3 className="mt-2 text-sm font-bold text-gray-300 group-hover:text-white truncate">{movie.name}</h3>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Empty State */}
                    {allMovies.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-32 text-gray-500">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 mb-4 opacity-50"><path strokeLinecap="round" strokeLinejoin="round" d="M15.182 16.318A4.486 4.486 0 0 0 12.016 15a4.486 4.486 0 0 0-3.198 1.318M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm6.75 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Z" /></svg>
                            <p className="text-xl font-medium">No Animations Found</p>
                            <p className="text-sm mt-2">Check back later for new episodes!</p>
                        </div>
                    )}
                </div>
            </main>
        );
    }

    // --- LAYOUT C: Variety / News (Simple Grid) ---
    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white pt-24 px-4 md:px-12">
            <div className="mb-8 border-b border-gray-800 pb-4">
                <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-purple-500">
                    {displayTitle} Collection
                </h1>
            </div>

            {allMovies.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {allMovies.map((movie) => (
                        <Link key={movie.id} href={`/movie/${movie.id}`} className="group relative transition-transform hover:scale-105 hover:z-10">
                            <div className="relative aspect-2/3 rounded-lg overflow-hidden border border-gray-800 shadow-lg">
                                <img src={movie.image} alt={movie.name} className="w-full h-full object-cover group-hover:opacity-80 transition-opacity" />
                            </div>
                            <h3 className="mt-2 text-sm font-bold text-gray-300 group-hover:text-white truncate">{movie.name}</h3>
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 text-gray-500">No content found.</div>
            )}
        </div>
    );
}