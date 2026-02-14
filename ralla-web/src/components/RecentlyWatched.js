"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { PlayCircleIcon } from "@heroicons/react/24/solid";

export default function RecentlyWatched() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    // LocalStorage එකෙන් බලපු ඒවා ගන්නවා
    const saved = localStorage.getItem("ralla_history");
    if (saved) {
      setHistory(JSON.parse(saved));
    }
  }, []);

  if (history.length === 0) {
    // බලපු මුකුත් නැත්නම් මේක පෙන්වන්න
    return (
      <div className="bg-[#181818] rounded-xl border border-gray-800 p-4 mb-6">
        <h3 className="text-white font-bold mb-2">Recently Watched</h3>
        <p className="text-gray-500 text-xs">You haven't watched anything yet.</p>
        <Link href="/movies" className="mt-3 block text-center bg-blue-600 text-white text-xs py-2 rounded hover:bg-blue-500 transition">
          Start Watching
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#181818] rounded-xl border border-gray-800 p-4 mb-6">
      <h3 className="text-white font-bold mb-4">Continue Watching</h3>
      <div className="space-y-4">
        {history.slice(0, 3).map((item, index) => (
          <Link key={index} href={`/movie/${item.id}`} className="flex gap-3 hover:bg-gray-800 p-2 rounded-lg transition group">

            {/* Image Container with Progress Bar */}
            <div className="w-24 h-14 bg-black rounded overflow-hidden shrink-0 relative">
              <img src={item.image} alt="" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition" />

              {/* Play Icon Overlay */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                <PlayCircleIcon className="w-8 h-8 text-white/80" />
              </div>

              {/* Progress Bar (Bottom of image) */}
              {item.lastWatched?.progressPercent > 0 && (
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-700">
                  <div
                    className="h-full bg-blue-500"
                    style={{ width: `${item.lastWatched.progressPercent}%` }}
                  ></div>
                </div>
              )}
            </div>

            {/* Details */}
            <div className="min-w-0 flex flex-col justify-center">
              <p className="text-sm text-gray-200 font-bold truncate leading-tight">{item.title}</p>

              {/* Series නම් Episode එක පෙන්වනවා */}
              {item.type === "series" && item.lastWatched?.episodeText && (
                <p className="text-[11px] text-blue-400 font-medium truncate mt-0.5">
                  {item.lastWatched.episodeText.split(" - ")[0]} {/* Shows "S1:E1" */}
                </p>
              )}

              {/* Time Left & Date */}
              <div className="flex items-center gap-2 text-[10px] text-gray-500 mt-1">
                {item.lastWatched?.timeLeft > 0 ? (
                  <span>{item.lastWatched.timeLeft}m left</span>
                ) : (
                  <span>Completed</span>
                )}
                <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                <span>{item.lastWatched?.date}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}