"use client";

import { useState } from "react";
import { ShareIcon, HandThumbUpIcon } from "@heroicons/react/24/outline"; // Outline Icons
import { StarIcon, HandThumbUpIcon as HandThumbUpSolid } from "@heroicons/react/24/solid"; // Solid Icons
import WatchlistButton from "@/components/WatchlistButton";
import { toast } from "react-hot-toast";

export default function MovieHeader({ movie }) {
  const [liked, setLiked] = useState(false); // Like Button එකේ State එක (තාවකාලිකයි)

  // Share Button Logic
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard! 🔗");
  };

  // Like Button Logic (දැනට Frontend විතරයි)
  const handleLike = () => {
    setLiked(!liked);
    if (!liked) {
        toast.success("You liked this! ❤️");
    }
  };

  return (
    <div className="w-full bg-linear-to-b from-transparent via-[#0a0a0a]/90 to-[#0a0a0a] pt-12 pb-8 px-4 md:px-12 relative z-10">
      <div className="max-w-[1600px] mx-auto">
        
        {/* 1. Title & Meta Info */}
        <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-end mb-6">
            
            {/* Title & Badges */}
            <div className="space-y-4">
                <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-wide drop-shadow-2xl">
                    {movie.title}
                </h1>

                {/* Meta Labels Row */}
                <div className="flex flex-wrap items-center gap-3 text-sm font-medium text-gray-300">
                    
                    {/* ⭐ Rating Box (කැපී පෙනෙන විදිහට) */}
                    <div className="flex items-center gap-1.5 bg-[#E5B54D] text-black px-3 py-1 rounded font-bold shadow-lg shadow-yellow-500/20">
                        <StarIcon className="w-4 h-4" />
                        <span>{movie.rating || "0.0"}</span>
                        <span className="text-[10px] font-normal opacity-80">/10</span>
                    </div>

                    {/* Year */}
                    <span className="px-3 py-1 bg-gray-800 border border-gray-700 rounded text-gray-200">
                        {movie.year}
                    </span>

                    {/* Category Label */}
                    <span className={`px-3 py-1 border rounded text-xs tracking-wider font-bold uppercase ${
                        movie.type === "series" 
                        ? "border-purple-500 text-purple-400 bg-purple-500/10" 
                        : "border-blue-500 text-blue-400 bg-blue-500/10"
                    }`}>
                        {movie.type === "series" ? "TV Series" : "Movie"}
                    </span>

                    {/* Genre */}
                    <span className="text-gray-400">
                        • {movie.genre}
                    </span>

                    {/* Seasons Count (Series Only) */}
                    {movie.type === "series" && movie.seasons?.length > 0 && (
                        <span className="text-gray-400">
                            • {movie.seasons.length} Season{movie.seasons.length > 1 ? "s" : ""}
                        </span>
                    )}
                </div>
            </div>

            {/* 2. Action Buttons (Right Side) */}
            <div className="flex items-center gap-3">
                
                {/* Like Button (New) */}
                <button 
                    onClick={handleLike}
                    className={`flex items-center gap-2 px-5 py-3 rounded-full font-bold transition-all border ${
                        liked 
                        ? "bg-white text-black border-white hover:bg-gray-200" 
                        : "bg-gray-800/60 text-white border-gray-600 hover:bg-gray-700 hover:border-gray-500"
                    }`}
                >
                    {liked ? <HandThumbUpSolid className="w-5 h-5" /> : <HandThumbUpIcon className="w-5 h-5" />}
                    <span>Like</span>
                </button>

                {/* My List Button */}
                <div className="scale-100">
                    <WatchlistButton movieId={movie._id} />
                </div>

                {/* Share Button */}
                <button 
                    onClick={handleShare}
                    className="p-3 bg-gray-800/60 hover:bg-gray-700 border border-gray-600 text-white rounded-full transition-all group"
                    title="Share"
                >
                    <ShareIcon className="w-5 h-5 group-hover:text-blue-400 transition-colors" />
                </button>
            </div>
        </div>

        {/* Description Preview (Optional - ඕන නම් විතරක් මේ කෑල්ල තියන්න) */}
        {/* <p className="text-gray-400 text-sm md:text-base max-w-2xl line-clamp-2">
            {movie.description}
        </p> */}

      </div>
    </div>
  );
}