// import React from 'react';
// import connectToDatabase from '@/lib/db';
// import Movie from '@/models/Movie';
// import Link from 'next/link';
// import MovieRow from '@/components/MovieRow';
// import CategoryHero from '@/components/CategoryHero';

// async function getMoviesByCategory(slug) {
//     try {
//         await connectToDatabase();
//         const decodedSlug = decodeURIComponent(slug).trim();
//         let query = {};

//         // if (decodedSlug === "TV Series" || decodedSlug === "tv-series") {
//         //     query = { category: { $in: ['drama', 'series', 'tv series', 'tv-series'] } };
//         // } else {
//         //     query = { category: decodedSlug.toLowerCase() };
//         // }

//         if (decodedSlug.toLowerCase() === "anime") {
//             query = {
//                 category: { $regex: /anime|donghua|Other Animations/i }
//             };
//         }
//         else if (decodedSlug === "TV Series" || decodedSlug === "tv-series") {
//             query = {
//                 category: { $in: ['drama', 'series', 'tv series', 'tv-series', 'K-Drama', 'C-Drama', 'J-Drama','Hollywood','Bollywood'] }
//             };
//         }
//         else {
//             query = { category: decodedSlug.toLowerCase() };
//         }

//         const rawMovies = await Movie.find(query).sort({ createdAt: -1 }).lean();

//         return rawMovies.map(movie => ({
//             id: movie._id.toString(),
//             name: movie.title,
//             image: movie.thumbnailUrl,
//             year: movie.year,
//             category: movie.category,
//             genre: movie.genre || ""
//         }));

//     } catch (error) {
//         console.error("Category Error:", error);
//         return [];
//     }
// }

// export default async function CategoryPage({ params }) {
//     const resolvedParams = await params;
//     const { slug } = resolvedParams;
//     const decodedSlug = decodeURIComponent(slug);

//     // --- 1. Title Normalization (Title එක ලස්සන කිරීම) ---
//     // Slug එක "tv-series" නම් "TV Series" ලෙසත්, "movies" නම් "Movies" ලෙසත් හදාගන්නවා.
//     let displayTitle = decodedSlug.charAt(0).toUpperCase() + decodedSlug.slice(1);

//     if (decodedSlug.toLowerCase() === 'tv-series') displayTitle = "TV Series";
//     if (decodedSlug.toLowerCase() === 'movies') displayTitle = "Movies";

//     // --- 2. Hero Category Mapping ---
//     // Admin Panel එකේ තියෙන Category නම් වලට හරියටම මැච් කරගන්නවා.
//     // (මේ නමින් තමයි Slides හොයන්නේ)
//     let heroCategory = displayTitle;
//     const slideCategoryMap = {
//         'anime': 'Anime',
//         'donghua': 'Donghua',
//         'tv-series': 'TV Series',
//         'tv series': 'TV Series', // Space තිබුනොත්

//         // 👇 මේ දෙකම "Movies" වලට හරවන්න
//         'movies': 'Movies',
//         'movie': 'Movies',

//         'k-drama': 'K-Drama',
//         'c-drama': 'C-Drama',
//         'j-drama': 'J-Drama',
//         'hollywood': 'Hollywood'
//     };

//     // Slug එක map එකේ තියෙනවා නම් ඒ නම ගන්නවා (නැත්නම් displayTitle එකම ගන්නවා)
//     if (slideCategoryMap[slug.toLowerCase()]) {
//         heroCategory = slideCategoryMap[slug.toLowerCase()];
//     }

//     // Movies ටික ගන්නවා
//     const allMovies = await getMoviesByCategory(slug);

//     // --- ROWS LOGIC ---
//     const recentlyAdded = allMovies.slice(0, 10);

//     const shuffled = [...allMovies].sort(() => 0.5 - Math.random());
//     const trending = shuffled.slice(0, 10);
//     const popular = shuffled.slice(10, 20);

//     // Others: මෙයාලව තමයි අපි Grid එකක් කරන්න යන්නේ (All Items)
//     const others = allMovies;

//     // Anime Filters
//     const donghuaList = allMovies.filter(m => m.category && m.category.toLowerCase().includes('donghua'));
//     const animeList = allMovies.filter(m => m.category && m.category.toLowerCase().includes('anime') && !m.category.toLowerCase().includes('donghua'));
//     // Other Animation Grid එකට
//     const otherAnimation = allMovies.filter(m => m.category && m.category.toLowerCase().includes('other animations') && !m.category.toLowerCase().includes('anime') && !m.category.toLowerCase().includes('donghua'));


//     // --- LAYOUT A: TV Series & Movies ---
//     if (['TV Series', 'Movies', 'Movie'].includes(displayTitle) || displayTitle.toLowerCase().includes('drama')) {
//         return (
//             <main className="min-h-screen bg-[#0a0a0a] pb-20 relative">
//                 <CategoryHero category={heroCategory} />

//                 <div className="relative z-20 mt-[-50px] pl-4 md:pl-12 mb-6">
//                     <h2 className="text-2xl md:text-3xl font-bold text-white drop-shadow-md">{displayTitle} Collection</h2>
//                 </div>

//                 <div className="relative z-20 space-y-12">
//                     {/* 1. Horizontal Rows (පැත්තට යන ඒවා) */}
//                     {recentlyAdded.length > 0 && <MovieRow title="Recently Added" movies={recentlyAdded} />}
//                     {trending.length > 0 && <MovieRow title={`Trending ${displayTitle}`} movies={trending} />}
//                     {popular.length > 0 && <MovieRow title="Most Popular" movies={popular} />}

//                     {/* 2. Vertical Grid (පහළට යන එක - All / Others) */}
//                     {others.length > 0 && (
//                         <div className="px-4 md:px-12 mt-10">
//                             <h3 className="text-xl font-bold text-gray-200 mb-4 border-l-4 border-blue-600 pl-3">
//                                 All {displayTitle} Library
//                             </h3>
//                             {/* Grid Layout */}
//                             <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
//                                 {others.map((movie) => (
//                                     <Link key={movie.id} href={`/movie/${movie.id}`} className="group relative transition-transform hover:scale-105 hover:z-10">
//                                         <div className="relative aspect-2/3 rounded-lg overflow-hidden border border-gray-800 shadow-lg">
//                                             <img src={movie.image} alt={movie.name} className="w-full h-full object-cover group-hover:opacity-80 transition-opacity" />
//                                             {/* Play Icon */}
//                                             <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
//                                                 <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/50">
//                                                     <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" /></svg>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                         <h3 className="mt-2 text-sm font-bold text-gray-300 group-hover:text-white truncate">{movie.name}</h3>
//                                         <p className="text-xs text-gray-500">{movie.year}</p>
//                                     </Link>
//                                 ))}
//                             </div>
//                         </div>
//                     )}

//                     {/* Empty State */}
//                     {allMovies.length === 0 && (
//                         <div className="text-gray-500 text-center py-20 text-lg">No movies found in this collection.</div>
//                     )}
//                 </div>
//             </main>
//         );
//     }

//     // --- LAYOUT B: Anime ---
//     if (displayTitle === 'Anime') {
//         return (
//             <main className="min-h-screen bg-[#0a0a0a] pb-20 relative">

//                 <CategoryHero category="Anime" />

//                 <div className="relative z-20 mt-[-50px] pl-4 md:pl-12 mb-6">
//                     <h2 className="text-2xl md:text-3xl font-bold text-white drop-shadow-md">Anime World</h2>
//                 </div>

//                 <div className="relative z-20 space-y-12">
//                     {/* Horizontal Rows */}
//                     {recentlyAdded.length > 0 && <MovieRow title="Recently Added Anime" movies={recentlyAdded} />}
//                     {donghuaList.length > 0 && <MovieRow title="Chinese Animation (Donghua)" movies={donghuaList} />}
//                     {animeList.length > 0 && <MovieRow title="Japan Animations (Anime)" movies={animeList} />}

//                     {/* Vertical Grid for Other Animation */}
//                     {otherAnimation.length > 0 && (
//                         <div className="px-4 md:px-12 mt-10">
//                             <h3 className="text-xl font-bold text-gray-200 mb-4 border-l-4 border-blue-600 pl-3">
//                                 Other Animations
//                             </h3>
//                             <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
//                                 {otherAnimation.map((movie) => (
//                                     <Link key={movie.id} href={`/movie/${movie.id}`} className="group relative transition-transform hover:scale-105 hover:z-10">
//                                         <div className="relative aspect-2/3 rounded-lg overflow-hidden border border-gray-800 shadow-lg">
//                                             <img src={movie.image} alt={movie.name} className="w-full h-full object-cover group-hover:opacity-80 transition-opacity" />
//                                             <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
//                                                 <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/50">
//                                                     <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" /></svg>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                         <h3 className="mt-2 text-sm font-bold text-gray-300 group-hover:text-white truncate">{movie.name}</h3>
//                                     </Link>
//                                 ))}
//                             </div>
//                         </div>
//                     )}

//                     {/* Empty State */}
//                     {allMovies.length === 0 && (
//                         <div className="flex flex-col items-center justify-center py-32 text-gray-500">
//                             <p className="text-xl font-medium">No Animations Found</p>
//                         </div>
//                     )}
//                 </div>
//             </main>
//         );
//     }

//     // --- LAYOUT C: Variety / News (Simple Grid) ---
//     return (
//         <div className="min-h-screen bg-[#0a0a0a] text-white pt-24 px-4 md:px-12">
//             <div className="mb-8 border-b border-gray-800 pb-4">
//                 <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-purple-500">
//                     {displayTitle} Collection
//                 </h1>
//             </div>

//             {allMovies.length > 0 ? (
//                 <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
//                     {allMovies.map((movie) => (
//                         <Link key={movie.id} href={`/movie/${movie.id}`} className="group relative transition-transform hover:scale-105 hover:z-10">
//                             <div className="relative aspect-2/3 rounded-lg overflow-hidden border border-gray-800 shadow-lg">
//                                 <img src={movie.image} alt={movie.name} className="w-full h-full object-cover group-hover:opacity-80 transition-opacity" />
//                             </div>
//                             <h3 className="mt-2 text-sm font-bold text-gray-300 group-hover:text-white truncate">{movie.name}</h3>
//                         </Link>
//                     ))}
//                 </div>
//             ) : (
//                 <div className="text-center py-20 text-gray-500">No content found.</div>
//             )}
//         </div>
//     );
// }

import React from 'react';
import connectToDatabase from '@/lib/db';
import Movie from '@/models/Movie';
import Link from 'next/link';
import MovieRow from '@/components/MovieRow';
import CategoryHero from '@/components/CategoryHero';

// 👇 1. Data Fetching Logic (Updated)
async function getMoviesByCategory(slug) {
    try {
        await connectToDatabase();
        const decodedSlug = decodeURIComponent(slug).trim();
        let query = {};

        // Anime Logic
        if (decodedSlug.toLowerCase() === "anime") {
            query = {
                category: { $regex: /anime|donghua|Other Animations/i }
            };
        }
        // TV Series Logic (Type එක 'series' නම් ගන්නවා)
        else if (decodedSlug === "TV Series" || decodedSlug === "tv-series") {
            query = { type: 'series' };
        }
        // Movie Logic (Type එක 'movie' නම් ගන්නවා)
        // 👇 slug එක 'movies' හෝ 'movie' දෙකම check කරනවා
        else if (decodedSlug.toLowerCase() === "movies" || decodedSlug.toLowerCase() === "movie") {
            query = { type: 'movie' };
        }
        // Fallback
        else {
            query = { category: decodedSlug.toLowerCase() };
        }

        const rawMovies = await Movie.find(query).sort({ createdAt: -1 }).lean();

        // Data map (Views & Likes included)
        return rawMovies.map(movie => ({
            id: movie._id.toString(),
            name: movie.title,
            image: movie.thumbnailUrl,
            year: movie.year,
            category: movie.category,
            genre: movie.genre || "",
            views: movie.views || 0, 
            likes: movie.likedBy ? movie.likedBy.length : 0 
        }));

    } catch (error) {
        console.error("Category Error:", error);
        return [];
    }
}

// 👇 Helper Component: Movie Grid
const MovieGrid = ({ movies }) => {
    if (movies.length === 0) return <div className="text-gray-500 text-center py-20 text-lg">No content found.</div>;
    
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {movies.map((movie) => (
                <Link key={movie.id} href={`/movie/${movie.id}`} className="group relative transition-transform hover:scale-105 hover:z-10">
                    <div className="relative aspect-2/3 rounded-lg overflow-hidden border border-gray-800 shadow-lg">
                        <img src={movie.image} alt={movie.name} className="w-full h-full object-cover group-hover:opacity-80 transition-opacity" />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/50">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                    <h3 className="mt-2 text-sm font-bold text-gray-300 group-hover:text-white truncate">{movie.name}</h3>
                    <p className="text-xs text-gray-500">{movie.year}</p>
                </Link>
            ))}
        </div>
    );
};

export default async function CategoryPage({ params }) {
    const resolvedParams = await params;
    const { slug } = resolvedParams;
    const decodedSlug = decodeURIComponent(slug);

    // 👇 2. Title Normalization FIXED
    let displayTitle = decodedSlug.charAt(0).toUpperCase() + decodedSlug.slice(1);
    
    // "movie" ආවත් "movies" ආවත් දෙකම "Movies" විදිහට සලකන්න හදපු තැන
    if (decodedSlug.toLowerCase() === 'movies' || decodedSlug.toLowerCase() === 'movie') {
        displayTitle = "Movies";
    }
    if (decodedSlug.toLowerCase() === 'tv-series') {
        displayTitle = "TV Series";
    }

    // --- FETCH DATA ---
    const allMovies = await getMoviesByCategory(slug);

    // --- COMMON LISTS ---
    const mostPopular = [...allMovies].sort((a, b) => b.views - a.views).slice(0, 10);
    const mostLiked = [...allMovies].sort((a, b) => b.likes - a.likes).slice(0, 10);
    

    // =========================================================
    // LAYOUT 1: MOVIES COLLECTION (දැන් හරියටම වැඩ කරයි)
    // =========================================================
    if (displayTitle === "Movies") {
        return (
            <main className="min-h-screen bg-[#0a0a0a] pb-20 relative">
                <CategoryHero category="Movies" />
                
                <div className="relative z-20 mt-[-50px] pl-4 md:pl-12 mb-6">
                    <h2 className="text-2xl md:text-3xl font-bold text-white drop-shadow-md">Movies Collection</h2>
                </div>

                <div className="relative z-20 space-y-12">
                    {/* 1. Most Popular */}
                    {mostPopular.length > 0 && <MovieRow title="Most Popular Movies" movies={mostPopular} />}
                    
                    {/* 2. Most Liked */}
                    {mostLiked.length > 0 && <MovieRow title="Most Liked Movies" movies={mostLiked} />}

                    {/* 3. All Movies Library (Grid) */}
                    <div className="px-4 md:px-12 mt-10">
                        <h3 className="text-xl font-bold text-gray-200 mb-4 border-l-4 border-blue-600 pl-3">
                            All Movies Library
                        </h3>
                        <MovieGrid movies={allMovies} />
                    </div>
                </div>
            </main>
        );
    }


    // =========================================================
    // LAYOUT 2: TV SERIES COLLECTION
    // =========================================================
    if (displayTitle === "TV Series") {
        
        // 👇 1. Anime සහ Donghua අයින් කරපු ලිස්ට් එක හදාගන්නවා
        const nonAnimeSeries = allMovies.filter(m => {
            const cat = m.category?.toLowerCase() || "";
            return !cat.includes('anime') && !cat.includes('donghua') && !cat.includes('other animations') ;
        });

        // 👇 2. දැන් අපි Popular සහ Liked ලිස්ට් හදන්නේ මේ ෆිල්ටර් කරපු එකෙන්
        // (එතකොට Anime ඒවා Popular ලිස්ට් එකට එන්නෙත් නෑ)
        const tvPopular = [...nonAnimeSeries].sort((a, b) => b.views - a.views).slice(0, 10);
        const tvLiked = [...nonAnimeSeries].sort((a, b) => b.likes - a.likes).slice(0, 10);
        
        // Categories
        const kDrama = nonAnimeSeries.filter(m => m.category && m.category.toLowerCase().includes('k-drama'));
        const cDrama = nonAnimeSeries.filter(m => m.category && m.category.toLowerCase().includes('c-drama'));
        const hollywood = nonAnimeSeries.filter(m => m.category && m.category.toLowerCase().includes('hollywood'));

        return (
            <main className="min-h-screen bg-[#0a0a0a] pb-20 relative">
                <CategoryHero category="TV Series" />
                
                <div className="relative z-20 mt-[-50px] pl-4 md:pl-12 mb-6">
                    <h2 className="text-2xl md:text-3xl font-bold text-white drop-shadow-md">TV Series Collection</h2>
                </div>

                <div className="relative z-20 space-y-12">
                    {/* 1. Most Popular (Anime නැති) */}
                    {tvPopular.length > 0 && <MovieRow title="Most Popular Series" movies={tvPopular} />}
                    
                    {/* 2. Most Liked (Anime නැති) */}
                    {tvLiked.length > 0 && <MovieRow title="Most Liked Series" movies={tvLiked} />}
                    
                    {/* 3. Categories */}
                    {kDrama.length > 0 && <MovieRow title="K-Drama" movies={kDrama} />}
                    {cDrama.length > 0 && <MovieRow title="C-Drama" movies={cDrama} />}
                    {hollywood.length > 0 && <MovieRow title="Hollywood Series" movies={hollywood} />}

                    {/* 6. All TV-Series Library (Grid - Anime නැති) */}
                    <div className="px-4 md:px-12 mt-10">
                        <h3 className="text-xl font-bold text-gray-200 mb-4 border-l-4 border-blue-600 pl-3">
                            All TV-Series Library
                        </h3>
                        {/* මෙතනට අපි යවන්නේ filter කරපු ලිස්ට් එක */}
                        <MovieGrid movies={nonAnimeSeries} />
                    </div>
                </div>
            </main>
        );
    }


    // =========================================================
    // LAYOUT 3: ANIME
    // =========================================================
    if (displayTitle === 'Anime') {
        const recentlyAdded = allMovies.slice(0, 10);
        const donghuaList = allMovies.filter(m => m.category && m.category.toLowerCase().includes('donghua'));
        const animeList = allMovies.filter(m => m.category && m.category.toLowerCase().includes('anime') && !m.category.toLowerCase().includes('donghua'));
        const otherAnimation = allMovies.filter(m => m.category && m.category.toLowerCase().includes('other animations') && !m.category.toLowerCase().includes('anime') && !m.category.toLowerCase().includes('donghua'));

        return (
            <main className="min-h-screen bg-[#0a0a0a] pb-20 relative">
                <CategoryHero category="Anime" />
                <div className="relative z-20 mt-[-50px] pl-4 md:pl-12 mb-6">
                    <h2 className="text-2xl md:text-3xl font-bold text-white drop-shadow-md">Anime World</h2>
                </div>
                <div className="relative z-20 space-y-12">
                    {recentlyAdded.length > 0 && <MovieRow title="Recently Added Anime" movies={recentlyAdded} />}
                    {donghuaList.length > 0 && <MovieRow title="Chinese Animation (Donghua)" movies={donghuaList} />}
                    {animeList.length > 0 && <MovieRow title="Japan Animations (Anime)" movies={animeList} />}
                    
                    {otherAnimation.length > 0 && (
                        <div className="px-4 md:px-12 mt-10">
                            <h3 className="text-xl font-bold text-gray-200 mb-4 border-l-4 border-blue-600 pl-3">Other Animations</h3>
                            <MovieGrid movies={otherAnimation} />
                        </div>
                    )}
                    {allMovies.length === 0 && <div className="text-gray-500 text-center py-20 text-lg">No Animations Found</div>}
                </div>
            </main>
        );
    }

    // =========================================================
    // LAYOUT 4: DEFAULT (Grid Only - Fallback)
    // =========================================================
    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white pt-24 px-4 md:px-12">
            <div className="mb-8 border-b border-gray-800 pb-4">
                <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-purple-500">
                    {displayTitle} Collection
                </h1>
            </div>
            <MovieGrid movies={allMovies} />
        </div>
    );
}