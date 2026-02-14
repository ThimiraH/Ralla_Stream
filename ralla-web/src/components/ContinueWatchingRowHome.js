// "use client";

// import { useState, useEffect } from "react";
// import Link from "next/link";
// import { PlayIcon } from "@heroicons/react/24/solid";

// export default function ContinueWatchingRowHome() {
//   const [history, setHistory] = useState([]);

//   useEffect(() => {
//     // Local Storage එකෙන් History එක ගන්නවා
//     const savedHistory = localStorage.getItem("ralla_history");
//     if (savedHistory) {
//       // JSON parse කරලා State එකට දානවා
//       setHistory(JSON.parse(savedHistory));
//     }
//   }, []);

//   // History එකේ මුකුත් නැත්නම් මේ Section එක පෙන්වන්නේ නෑ
//   if (history.length === 0) return null;

//   return (
//     <div className="px-4 md:px-12 mt-8 mb-12">
//       {/* Title Section */}
//       <div className="flex items-center gap-2 mb-4 border-l-4 border-blue-600 pl-3">
//         <h2 className="text-xl md:text-2xl font-bold text-white">Continue Watching</h2>
//       </div>

//       {/* Scrolling Container */}
//       <div className="relative group">
//         <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 scroll-smooth">
//           {history.map((item, index) => (
//             <Link 
//                 key={item.uniqueKey || index} // uniqueKey පාවිච්චි කරන්න
//                 href={`/movie/${item.id}`} // Movie Page එකට යවනවා
//                 className="relative min-w-[200px] md:min-w-[260px] cursor-pointer group/card hover:scale-105 transition-transform duration-300"
//             >
//               {/* Thumbnail Image Container */}
//               <div className="relative aspect-video rounded-lg overflow-hidden border border-gray-800 shadow-lg">
//                 <img
//                   src={item.image}
//                   alt={item.title}
//                   className="w-full h-full object-cover group-hover/card:opacity-80 transition-opacity"
//                 />
                
//                 {/* Play Icon Overlay */}
//                 <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-opacity">
//                     <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/50">
//                         <PlayIcon className="w-5 h-5 text-white" />
//                     </div>
//                 </div>

//                 {/* Progress Bar (Image එකේ යටින්) */}
//                 <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-700/50">
//                   <div
//                     className="h-full bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.5)]"
//                     style={{ width: `${item.lastWatched?.progressPercent || 0}%` }}
//                   ></div>
//                 </div>
//               </div>

//               {/* Text Info */}
//               <div className="mt-2 px-1">
//                 <h3 className="text-sm font-bold text-gray-200 truncate group-hover/card:text-blue-400 transition-colors">
//                   {item.title}
//                 </h3>
//                 <div className="flex justify-between items-center mt-1">
//                     <p className="text-xs text-gray-400 truncate max-w-[70%]">
//                     {/* Series නම් S1:E2 වගේ පෙන්නනවා, Movie නම් නමම පෙන්නනවා */}
//                     {item.type === 'series' ? item.lastWatched?.episodeText : "Movie"}
//                     </p>
//                     <p className="text-[10px] text-blue-500 font-medium">
//                         {item.lastWatched?.isFinished ? "Completed" : `${item.lastWatched?.timeLeft}m left`}
//                     </p>
//                 </div>
//               </div>
//             </Link>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { PlayIcon, ClockIcon, ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";

export default function ContinueWatchingRow() {
  const [history, setHistory] = useState([]);
  const [mounted, setMounted] = useState(false);
  
  // 👇 1. Scroll කරන්න මේ ref එක හදාගන්න ඕන
  const rowRef = useRef(null);

  useEffect(() => {
    setMounted(true);
    const savedHistory = localStorage.getItem("ralla_history");
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  // 👇 2. Scroll Function එක (වමට සහ දකුණට යවන්න)
  const handleClick = (direction) => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      
      const scrollTo = 
        direction === "left" 
          ? scrollLeft - clientWidth / 2 
          : scrollLeft + clientWidth / 2;

      rowRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  if (!mounted) return null;

  return (
    <div className="px-4 md:px-12 mt-8 mb-12">
      <div className="flex items-center gap-2 mb-6 border-l-4 border-blue-600 pl-3">
        <h2 className="text-xl md:text-2xl font-bold text-white">Continue Watching</h2>
      </div>

      {history.length > 0 ? (
        // --- Parent Container (Group) ---
        <div className="relative group">
          
          {/* 👇 3. Left Arrow (Hover කළාම පේන්න හදමු) */}
          <button 
            onClick={() => handleClick("left")}
            className="absolute top-0 bottom-0 left-2 z-40 m-auto h-10 w-10 cursor-pointer opacity-0 group-hover:opacity-100 transition duration-200 hover:scale-125 bg-black/50 hover:bg-black/80 rounded-full flex items-center justify-center border border-gray-600"
          >
            <ChevronLeftIcon className="h-6 w-6 text-white" />
          </button>

          {/* Scroll Container (Ref එක මෙතනට දාන්න) */}
          <div 
            ref={rowRef} 
            className="flex gap-4 overflow-x-auto pb-4 scroll-smooth scrollbar-hide w-full px-1"
          >
            {history.map((item, index) => (
              <Link 
                  key={item.uniqueKey || index} 
                  href={`/movie/${item.id}`} 
                  className="flex-none w-[200px] md:w-[260px] relative cursor-pointer group/card transition-transform duration-300 hover:scale-105"
              >
                <div className="relative aspect-video rounded-lg overflow-hidden border border-gray-800 shadow-lg bg-gray-900">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover/card:opacity-80 transition-opacity"
                  />
                  
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-opacity">
                      <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/50">
                          <PlayIcon className="w-5 h-5 text-white" />
                      </div>
                  </div>

                  <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-700/50">
                    <div
                      className="h-full bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.5)]"
                      style={{ width: `${item.lastWatched?.progressPercent || 0}%` }}
                    ></div>
                  </div>
                </div>

                <div className="mt-2 px-1">
                  <h3 className="text-sm font-bold text-gray-200 truncate group-hover/card:text-blue-400 transition-colors">
                    {item.title}
                  </h3>
                  <div className="flex justify-between items-center mt-1">
                      <p className="text-xs text-gray-400 truncate max-w-[60%]">
                      {item.type === 'series' ? item.lastWatched?.episodeText : "Movie"}
                      </p>
                      <p className="text-[10px] text-blue-500 font-medium whitespace-nowrap">
                          {item.lastWatched?.isFinished ? "Completed" : `${item.lastWatched?.timeLeft}m left`}
                      </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* 👇 4. Right Arrow (Hover කළාම පේන්න හදමු) */}
          <button 
            onClick={() => handleClick("right")}
            className="absolute top-0 bottom-0 right-2 z-40 m-auto h-10 w-10 cursor-pointer opacity-0 group-hover:opacity-100 transition duration-200 hover:scale-125 bg-black/50 hover:bg-black/80 rounded-full flex items-center justify-center border border-gray-600"
          >
            <ChevronRightIcon className="h-6 w-6 text-white" />
          </button>

        </div>
      ) : (
        <div className="w-full h-[150px] border border-dashed border-gray-800 rounded-xl flex flex-col items-center justify-center text-gray-500 bg-gray-900/30">
            <ClockIcon className="w-8 h-8 mb-2 opacity-50" />
            <p className="text-sm font-medium">You haven't watched anything yet.</p>
            <p className="text-xs mt-1">Start watching movies to see them here!</p>
        </div>
      )}
    </div>
  );
}