"use client";

import React, { useRef, useState } from 'react';
import Link from 'next/link';

export default function MovieRow({ title, movies }) {
  const rowRef = useRef(null);
  const [isMoved, setIsMoved] = useState(false);

  // Scroll Handler
  const handleClick = (direction) => {
    setIsMoved(true);
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollTo = direction === "left"
        ? scrollLeft - clientWidth / 2
        : scrollLeft + clientWidth / 2;

      rowRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  return (
    <div className="px-4 md:px-12 mb-10 space-y-4"> {/* Spacing හරිගැස්සුවා */}

      {/* Category Title */}
      <h2 className="text-xl md:text-2xl font-bold text-white border-l-4 border-blue-500 pl-3 cursor-pointer hover:text-blue-400 transition">
        {title}
      </h2>

      <div className="group relative">

        {/* --- LEFT ARROW --- */}
        <div
          className={`absolute top-0 bottom-0 left-2 z-40 m-auto h-12 w-12 cursor-pointer opacity-0 transition hover:scale-110 group-hover:opacity-100 flex items-center justify-center
            ${!isMoved && "hidden"}`}
          onClick={() => handleClick("left")}
        >
          <div className="bg-black/60 rounded-full p-2 hover:bg-black/80 shadow-lg border border-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="white" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
          </div>
        </div>

        {/* --- MOVIE CONTAINER (Original Look Restored) --- */}
        <div
          ref={rowRef}
          className="flex items-center space-x-4 overflow-x-scroll scrollbar-hide py-4 scroll-smooth"
        >
          {movies.map((movie, index) => (

            <Link key={index} href={`/movie/${movie.id}`}>

              <div
                // මෙන්න මෙතන තමයි පරණ පෙනුම (Portrait Size) ආපහු දැම්මේ:
                className="relative min-w-40 h-60 md:min-w-[200px] md:h-[300px] cursor-pointer transition-transform duration-300 ease-in-out hover:scale-105"
              >
                <img
                  src={movie.image}
                  alt={movie.name}
                  className="w-full h-full object-cover rounded-lg shadow-md hover:shadow-blue-500/40"
                />

                {movie.latestBadge && (
                  <div className="absolute top-2 right-2 bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow-md z-10 max-w-[85%] truncate">
                    {movie.latestBadge}
                  </div>
                )}

                {/* Hover Overlay with Info */}
                <div className="absolute inset-0 bg-linear-to-t from-black via-black/40 to-transparent opacity-0 hover:opacity-100 transition-opacity flex flex-col justify-end p-4 rounded-lg">
                  <h3 className="text-white font-bold text-sm md:text-base">{movie.name}</h3>
                  <p className="text-blue-400 text-xs font-semibold">{movie.year}</p>
                </div>
              </div>

            </Link>

          ))}
        </div>

        {/* --- RIGHT ARROW --- */}
        <div
          className="absolute top-0 bottom-0 right-2 z-40 m-auto h-12 w-12 cursor-pointer opacity-0 transition hover:scale-110 group-hover:opacity-100 flex items-center justify-center"
          onClick={() => handleClick("right")}
        >
          <div className="bg-black/60 rounded-full p-2 hover:bg-black/80 shadow-lg border border-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="white" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
          </div>
        </div>

      </div>
    </div>
  );
}