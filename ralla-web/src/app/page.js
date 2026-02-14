// import Hero from '@/components/Hero';
// import MovieRow from '@/components/MovieRow';
// import ContinueWatchingRow from '@/components/ContinueWatchingRaw';
// import connectToDatabase from '@/lib/db'; // DB Connection එක
// import Movie from '@/models/Movie'; // Movie Model එක
// import ContinueWatchingRowHome from '@/components/ContinueWatchingRowHome';

// // --- 1. Database එකෙන් ෆිල්ම් ගෙන්වා ගන්නා Function එක ---
// async function getMovies() {
//   try {
//     await connectToDatabase();

//     // අලුත්ම ෆිල්ම් උඩට එන විදිහට ගන්නවා (sort by createdAt -1)
//     // lean() පාවිච්චි කරන්නේ Data ඉක්මනට ගන්න (Plain Javascript Objects විදිහට)
//     const rawMovies = await Movie.find({}).sort({ createdAt: -1 }).lean();

//     // අපේ Frontend එකට ගැලපෙන විදිහට නම් වෙනස් කරගමු
//     // (Database එකේ තියෙන්නේ 'title', 'thumbnailUrl'. අපේ Component ඉල්ලන්නේ 'name', 'image')
//     const movies = rawMovies.map((movie) => ({
//       id: movie._id.toString(), // ID එක String එකක් කරගන්න ඕන
//       name: movie.title,
//       image: movie.thumbnailUrl,
//       year: movie.year,
//       category: movie.category
//     }));

//     return movies;

//   } catch (error) {
//     console.error("Failed to fetch movies:", error);
//     return []; // දෝෂයක් ආවොත් හිස් ලිස්ට් එකක් යවනවා
//   }
// }

// export default async function Home() {
//   // --- 2. Data ලබා ගැනීම ---
//   const allMovies = await getMovies();

//   // Categories වෙන් කරගැනීම (Upload කරද්දී තෝරපු Category අනුව)
//   const recentMovies = allMovies; // හැම එකම මෙතනට
//   const dramaMovies = allMovies.filter(m => m.category === 'drama');
//   const seriesList = allMovies.filter(m => m.category === 'series');

//   return (
//     <main className="min-h-screen bg-black pb-10">
//       <Hero />

//       <div className="relative z-20 mt-[-30px]">

//         {/* Continue Watching (Static) */}
//         {/* 2. Continue Watching Section (Hero එකට පස්සේ කෙලින්ම) */}
//         {/* <div className="relative z-10 mt-[-50px] md:-mt-20"> */}
//           <ContinueWatchingRowHome />
//         {/* </div> */}

//         {/* --- DYNAMIC ROWS (Database Data) --- */}

//         {/* 1. අපි Upload කරපු ඔක්කොම ෆිල්ම්ස් */}
//         {recentMovies.length > 0 ? (
//           <MovieRow title="Recently Added" movies={recentMovies} />
//         ) : (
//           <p className="text-gray-500 text-center py-10">No movies found. Go to Admin Panel to upload.</p>
//         )}

//         {/* 2. Drama Category එකේ ඒවා විතරක් */}
//         {dramaMovies.length > 0 && (
//           <MovieRow title="Popular Dramas" movies={dramaMovies} />
//         )}

//         {/* 3. Series Category එකේ ඒවා විතරක් */}
//         {seriesList.length > 0 && (
//           <MovieRow title="TV Series" movies={seriesList} />
//         )}

//         <div className="px-4 md:px-12 text-gray-500 text-center py-20">
//           Other sections coming soon...
//         </div>

//       </div>
//     </main>
//   );
// }


import connectToDatabase from "@/lib/db";
import Movie from "@/models/Movie";
import Hero from "@/components/Hero";
import ContinueWatchingRowHome from "@/components/ContinueWatchingRowHome";
import MovieRow from "@/components/MovieRow";

async function getHomeData() {
  try {
    await connectToDatabase();

    // A. Recently Updated (අලුත්ම Episode එකක් දාපු ඒවා උඩට)
    // createdAt වෙනුවට updatedAt පාවිච්චි කරනවා
    const recent = await Movie.find({})
      .sort({ updatedAt: -1, createdAt: -1, _id: -1 })
      .limit(50)
      .lean();

    const trending = await Movie.find({}).sort({ views: -1 }).limit(50).lean();
    const kDrama = await Movie.find({ category: { $regex: /k-drama/i } }).sort({ createdAt: -1 }).limit(50).lean();
    const cDrama = await Movie.find({ category: { $regex: /c-drama/i } }).sort({ createdAt: -1 }).limit(50).lean();
    const hollywood = await Movie.find({ category: { $regex: /hollywood/i } }).sort({ createdAt: -1 }).limit(50).lean();

    // Animations (Anime, Donghua, Other Animations තුනම එකට)
    const animations = await Movie.find({ category: { $regex: /anime|donghua|animation/i } }).sort({ createdAt: -1 }).limit(50).lean();

    // Upcoming
    const upcoming = await Movie.find({ category: { $regex: /upcoming/i } }).sort({ createdAt: -1 }).limit(50).lean();

    // 4. Genre Based Rows (Action & Romance)
    // Genre හෝ Category දෙකෙන් ඕනෑම එකක තිබුනොත් ගන්නවා ($or දාලා තියෙන්නේ ඒකයි)
    const action = await Movie.find({
      $or: [{ genre: { $regex: /action/i } }, { category: { $regex: /action/i } }]
    }).sort({ createdAt: -1 }).limit(50).lean();

    const romance = await Movie.find({
      $or: [{ genre: { $regex: /romance/i } }, { category: { $regex: /romance/i } }]
    }).sort({ createdAt: -1 }).limit(50).lean();

    const comedy = await Movie.find({
      $or: [{ genre: { $regex: /comedy/i } }, { category: { $regex: /comedy/i } }]
    }).sort({ createdAt: -1 }).limit(50).lean();

    const fantasy = await Movie.find({
      $or: [{ genre: { $regex: /fantasy/i } }, { category: { $regex: /fantasy/i } }]
    }).sort({ createdAt: -1 }).limit(50).lean();


    // Data Format කරන තැනදී අලුත්ම Episode එක හොයමු
    const formatData = (movies) => movies.map(m => {
      let latestBadge = null;

      if (m.type === 'series' && m.seasons?.length > 0) {
        const lastSeason = m.seasons[m.seasons.length - 1];
        if (lastSeason.episodes?.length > 0) {
          const lastEp = lastSeason.episodes[lastSeason.episodes.length - 1];

          // "S1 E5" වෙනුවට Episode Title එක ගන්නවා
          // Title එකක් දාලා නැත්නම් විතරක් "Episode X" කියලා වැටෙන්න හදමු
          latestBadge = lastEp.title && lastEp.title.trim() !== ""
            ? lastEp.title
            : `Episode ${lastEp.episodeNumber}`;
        }
      }

      return {
        id: m._id.toString(),
        name: m.title,
        image: m.thumbnailUrl,
        year: m.year,
        category: m.category,
        views: m.views,
        latestBadge // 👇 අලුත් Badge එක යවනවා
      };
    });

    return {
      recent: formatData(recent),
      trending: formatData(trending),
      kDrama: formatData(kDrama),
      cDrama: formatData(cDrama),
      hollywood: formatData(hollywood),
      animations: formatData(animations),
      upcoming: formatData(upcoming),
      action: formatData(action),
      romance: formatData(romance),
      comedy: formatData(comedy),
      fantasy: formatData(fantasy)
    };

  } catch (error) {
    console.error("Home Data Error:", error);
    return { recent: [], trending: [], action: [], romance: [] };
  }
}

export default async function Home() {
  const { recent, trending, kDrama, cDrama, hollywood, animations, upcoming, action, romance, comedy, fantasy } = await getHomeData();

  return (
    <main className="min-h-screen bg-[#0a0a0a] pb-20 overflow-x-hidden">
      <Hero />
      <div className="relative z-10 mt-[-50px] md:-mt-20 space-y-8 md:space-y-12">
        <ContinueWatchingRowHome />

        {/* Recently Added (Updated) */}
        {recent.length > 0 && (
          <MovieRow title="Recently Added" movies={recent} />
        )}

        {trending.length > 0 && <MovieRow title="Trending Now" movies={trending} />}
        {upcoming.length > 0 && <MovieRow title="Upcoming Movies & Series" movies={upcoming} />}

        {/* 5. Specific Categories */}
        {kDrama.length > 0 && <MovieRow title="K-Drama" movies={kDrama} />}
        {cDrama.length > 0 && <MovieRow title="C-Drama" movies={cDrama} />}
        {hollywood.length > 0 && <MovieRow title="Hollywood Movies & Series" movies={hollywood} />}

        {/* 6. Animations (Anime, Donghua, etc.) */}
        {animations.length > 0 && <MovieRow title="Animations" movies={animations} />}

        {/* 7. Genres */}
        {action.length > 0 && <MovieRow title="Action" movies={action} />}
        {romance.length > 0 && <MovieRow title="Romance" movies={romance} />}
        {comedy.length > 0 && <MovieRow title="Comedy" movies={comedy} />}
        {fantasy.length > 0 && <MovieRow title="Fantasy" movies={fantasy} />}

      </div>
    </main>
  );
}