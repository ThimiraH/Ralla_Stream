"use client";

import React, { useRef, useState } from 'react';
import Link from 'next/link';

export default function ContinueWatchingRow({ title, data }) {
  const rowRef = useRef(null);
  const [isMoved, setIsMoved] = useState(false);

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
    <div className="px-4 md:px-12 mb-10 space-y-4">

      {/* Title */}
      <h2 className="text-xl md:text-2xl font-bold text-white border-l-4 border-blue-500 pl-3">
        {title}
      </h2>

      <div className="group relative">

        {/* --- LEFT ARROW --- */}
        <div
          className={`absolute top-0 bottom-0 left-2 z-40 m-auto h-12 w-12 cursor-pointer opacity-0 transition hover:scale-110 group-hover:opacity-100 flex items-center justify-center
            ${!isMoved && "hidden"}`}
          onClick={() => handleClick("left")}
        >
          <div className="bg-black/60 rounded-full p-2 border border-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="white" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
          </div>
        </div>

        {/* --- CONTENT CONTAINER --- */}
        <div
          ref={rowRef}
          className="flex items-center space-x-4 overflow-x-scroll scrollbar-hide py-4 scroll-smooth"
        >
          {data.map((item, index) => (

            <Link key={index} href={`/movie/${item.name}`}>

              <div
                // Landscape Size (දිග අතට)
                className="relative min-w-[260px] md:min-w-[300px] h-auto cursor-pointer transition-transform duration-300 ease-in-out hover:scale-105 group/card"
              >
                {/* Thumbnail Container */}
                <div className="relative w-full h-[150px] md:h-[170px] rounded-lg overflow-hidden shadow-md">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />

                  {/* Play Button Overlay (Hover කරාම පේන්න) */}
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-opacity">
                    <div className="bg-white/20 backdrop-blur-sm p-3 rounded-full border border-white/50">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" className="w-8 h-8">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>

                  {/* Progress Bar (පින්තූරේ යටම තීරුව) */}
                  <div className="absolute bottom-0 left-0 w-full h-1.5 bg-gray-700/80">
                    <div
                      className="h-full bg-blue-600 rounded-r-full"
                      style={{ width: `${item.progress}%` }} // මෙතනින් තමයි % එක පාලනය වෙන්නේ
                    ></div>
                  </div>
                </div>

                {/* Text Details (පින්තූරේ යටින්) */}
                <div className="mt-2 px-1">
                  <h3 className="text-white font-bold text-sm md:text-base truncate">{item.name}</h3>
                  <div className="flex items-center justify-between text-xs text-gray-400 mt-1">
                    <span>{item.episode}</span>
                    <span className="text-blue-400">{item.timeLeft} left</span>
                  </div>
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
          <div className="bg-black/60 rounded-full p-2 border border-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="white" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
          </div>
        </div>

      </div>
    </div>
  );
}