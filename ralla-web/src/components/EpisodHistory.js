"use client";
import { useState, useEffect } from "react";
import { PlayCircleIcon, CheckCircleIcon } from "@heroicons/react/24/solid"; // Check Icon එකත් ගත්තා

export default function RecentlyWatched({ currentMovieId, onPlayEpisode }) {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    // හැම තත්පරේම වගේ update වෙනවද බලන්න ඕන නම් interval එකක් දාන්න පුළුවන්, 
    // නැත්නම් page load එකේදි විතරක් update වෙයි.
    // Real-time පෙනෙන්න පොඩි Interval එකක් දාමු.
    const loadHistory = () => {
        const saved = localStorage.getItem("ralla_history");
        if (saved) {
            const allHistory = JSON.parse(saved);
            
            // 👇 FILTER LOGIC: දැනට ඉන්න Movie/Series එකට අදාළ ඒවා විතරක් ගන්න
            const relevantHistory = allHistory.filter(item => item.id === currentMovieId);
            setHistory(relevantHistory);
        }
    };

    loadHistory();
    // Video එක බලන ගමන් Progress එක update වෙන නිසා පොඩි interval එකක් දාමු
    const interval = setInterval(loadHistory, 2000); 

    return () => clearInterval(interval);
  }, [currentMovieId]);

  if (history.length === 0) {
      return null; // අදාල history නැත්නම් මුකුත් පෙන්වන්නේ නෑ (හෝ "Not watched yet" දාන්න පුළුවන්)
  }

  return (
    <div className="bg-[#111] rounded-xl border border-gray-800 p-4 mb-6">
      <h3 className="text-white font-bold mb-4 flex items-center gap-2">
          <span className="w-1 h-4 bg-blue-500 rounded-full"></span>
          Your Episode Watch History
      </h3>
      
      <div className="space-y-3">
        {history.map((item, index) => (
          <div 
            key={index} 
            // Click කළාම Play වෙන වැඩේ (Series එකක් නම් විතරක් අපි Episode එක මාරු කරනවා)
            onClick={() => {
                if(item.type === 'series' && onPlayEpisode && item.seasonIndex !== null) {
                    onPlayEpisode(item.seasonIndex, item.episodeIndex);
                } else if (item.type === 'movie') {
                    // Movie නම් නිකන්ම උඩට scroll වෙන්න හදන්න පුළුවන්
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
            }}
            className="flex gap-3 hover:bg-gray-800 p-2 rounded-lg transition group cursor-pointer border border-transparent hover:border-gray-700"
          >
            
            {/* Thumbnail */}
            <div className="w-20 h-12 bg-black rounded overflow-hidden shrink-0 relative">
                <img src={item.image} alt="" className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition" />
                
                {/* Finished නම් Green Tick, නැත්නම් Play Button */}
                <div className="absolute inset-0 flex items-center justify-center">
                    {item.lastWatched?.isFinished ? (
                         <CheckCircleIcon className="w-6 h-6 text-green-500" />
                    ) : (
                         <PlayCircleIcon className="w-8 h-8 text-white/90 opacity-0 group-hover:opacity-100 transition" />
                    )}
                </div>

                {/* Progress Bar (Only if not finished) */}
                {!item.lastWatched?.isFinished && item.lastWatched?.progressPercent > 0 && (
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-700">
                        <div 
                            className="h-full bg-blue-500" 
                            style={{ width: `${item.lastWatched.progressPercent}%` }}
                        ></div>
                    </div>
                )}
            </div>

            {/* Details */}
            <div className="min-w-0 flex flex-col justify-center flex-1">
                {/* Series නම් Episode Number එක ලොකුවට */}
                {item.type === "series" ? (
                    <p className="text-sm text-gray-200 font-bold truncate">
                        {item.lastWatched?.episodeText}
                    </p>
                ) : (
                    <p className="text-sm text-gray-200 font-bold truncate">Movie</p>
                )}

                {/* Status & Date */}
                <div className="flex items-center justify-between mt-1">
                    <p className={`text-[10px] font-medium ${item.lastWatched?.isFinished ? 'text-green-500' : 'text-blue-400'}`}>
                        {item.lastWatched?.isFinished ? (
                            "Already Watched"
                        ) : (
                            `${item.lastWatched?.timeLeft}m left`
                        )}
                    </p>
                    <p className="text-[10px] text-gray-500">
                        {item.lastWatched?.date}
                    </p>
                </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}