"use client";

import { useState } from "react";
import { MagnifyingGlassIcon, PlayIcon } from "@heroicons/react/24/solid";

export default function EpisodeList({ episodes, currentEpisodeIndex, onEpisodeSelect }) {
  const [search, setSearch] = useState("");

  // Search කළාම ෆිල්ටර් වෙන Logic එක
  const filteredEpisodes = episodes.filter((ep) =>
    ep.title.toLowerCase().includes(search.toLowerCase()) || 
    ep.episodeNumber.toString().includes(search)
  );

  return (
    <div className="bg-[#121212] rounded-xl overflow-hidden border border-gray-800 flex flex-col h-auto max-h-[500px]">
      
      {/* Header with Search */}
      <div className="p-4 bg-[#1a1a1a] border-b border-gray-800 flex items-center justify-between">
        <h3 className="font-bold text-white text-sm">List of episodes:</h3>
        <div className="relative">
          <MagnifyingGlassIcon className="w-4 h-4 absolute left-2 top-2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Number or Title" 
            className="bg-[#0a0a0a] text-xs text-white pl-8 pr-3 py-1.5 rounded border border-gray-700 focus:border-blue-500 outline-none w-32 transition-all focus:w-40"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* List Area */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
        {filteredEpisodes.length === 0 ? (
            <p className="text-gray-500 text-xs text-center py-4">No episodes found</p>
        ) : (
            filteredEpisodes.map((ep, index) => {
              // මේ Episode එක Play වෙනවද බලනවා (Database data අනුව index එක match කරනවා)
              const isActive = index === currentEpisodeIndex;

              return (
                <button
                  key={ep._id || index}
                  onClick={() => onEpisodeSelect(index)} // Click කළාම Main Page එකට කියනවා
                  className={`w-full flex items-center gap-4 px-4 py-4 border-b border-gray-800/50 transition-all group text-left
                    ${isActive 
                        ? "bg-linear-to-r from-purple-900/40 to-blue-900/20 border-l-4 border-l-purple-500" 
                        : "hover:bg-[#1a1a1a] border-l-4 border-l-transparent"
                    }`}
                >
                  {/* Episode Number */}
                  <span className={`text-lg font-bold w-6 ${isActive ? "text-white" : "text-gray-500"}`}>
                    {ep.episodeNumber}
                  </span>

                  {/* Title */}
                  <span className={`flex-1 text-sm font-medium line-clamp-1 ${isActive ? "text-purple-300" : "text-gray-400 group-hover:text-gray-200"}`}>
                    {ep.title}
                  </span>

                  {/* Active Indicator / Play Icon */}
                  {isActive && (
                     <div className="bg-purple-500 rounded-full p-1 shadow-lg shadow-purple-500/40">
                        <PlayIcon className="w-3 h-3 text-white" />
                     </div>
                  )}
                </button>
              );
            })
        )}
      </div>
    </div>
  );
}