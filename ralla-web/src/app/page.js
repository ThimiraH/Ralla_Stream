import Hero from '@/components/Hero';
import MovieRow from '@/components/MovieRow';
import ContinueWatchingRow from '@/components/ContinueWatchingRaw';
import connectToDatabase from '@/lib/db'; // DB Connection එක
import Movie from '@/models/Movie'; // Movie Model එක

// --- 1. Database එකෙන් ෆිල්ම් ගෙන්වා ගන්නා Function එක ---
async function getMovies() {
  try {
    await connectToDatabase();
    
    // අලුත්ම ෆිල්ම් උඩට එන විදිහට ගන්නවා (sort by createdAt -1)
    // lean() පාවිච්චි කරන්නේ Data ඉක්මනට ගන්න (Plain Javascript Objects විදිහට)
    const rawMovies = await Movie.find({}).sort({ createdAt: -1 }).lean();

    // අපේ Frontend එකට ගැලපෙන විදිහට නම් වෙනස් කරගමු
    // (Database එකේ තියෙන්නේ 'title', 'thumbnailUrl'. අපේ Component ඉල්ලන්නේ 'name', 'image')
    const movies = rawMovies.map((movie) => ({
      id: movie._id.toString(), // ID එක String එකක් කරගන්න ඕන
      name: movie.title,
      image: movie.thumbnailUrl,
      year: movie.year,
      category: movie.category
    }));

    return movies;

  } catch (error) {
    console.error("Failed to fetch movies:", error);
    return []; // දෝෂයක් ආවොත් හිස් ලිස්ට් එකක් යවනවා
  }
}

export default async function Home() {
  // --- 2. Data ලබා ගැනීම ---
  const allMovies = await getMovies();

  // Categories වෙන් කරගැනීම (Upload කරද්දී තෝරපු Category අනුව)
  const recentMovies = allMovies; // හැම එකම මෙතනට
  const dramaMovies = allMovies.filter(m => m.category === 'drama');
  const seriesList = allMovies.filter(m => m.category === 'series');


  // --- 3. Static Data (තාම User Account නැති නිසා මේවා බොරුවට තියමු) ---
  const continueWatchingData = [
    { 
        name: "Stranger Things", 
        image: "https://image.tmdb.org/t/p/w500/49WJfeN0moxb9IPfGn8AIqMGskD.jpg", 
        progress: 75, episode: "S4:E2", timeLeft: "12m"
    },
    { 
        name: "Squid Game", 
        image: "https://image.tmdb.org/t/p/w500/dDlE2FcE0WJgE205ChpGzRs7U2G.jpg", 
        progress: 30, episode: "S1:E3", timeLeft: "45m"
    }
  ];

  return (
    <main className="min-h-screen bg-black pb-10">
      <Hero />
      
      <div className="relative z-20 mt-[-30px]"> 
        
        {/* Continue Watching (Static) */}
        <ContinueWatchingRow title="Continue Watching" data={continueWatchingData} />

        {/* --- DYNAMIC ROWS (Database Data) --- */}
        
        {/* 1. අපි Upload කරපු ඔක්කොම ෆිල්ම්ස් */}
        {recentMovies.length > 0 ? (
           <MovieRow title="Recently Added" movies={recentMovies} />
        ) : (
           <p className="text-gray-500 text-center py-10">No movies found. Go to Admin Panel to upload.</p>
        )}

        {/* 2. Drama Category එකේ ඒවා විතරක් */}
        {dramaMovies.length > 0 && (
            <MovieRow title="Popular Dramas" movies={dramaMovies} />
        )}

        {/* 3. Series Category එකේ ඒවා විතරක් */}
        {seriesList.length > 0 && (
            <MovieRow title="TV Series" movies={seriesList} />
        )}

      </div>
    </main>
  );
}