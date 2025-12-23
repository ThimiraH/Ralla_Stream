"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function CategoryHero({ movies }) {
  const [currentMovieIndex, setCurrentMovieIndex] = useState(0);
  const heroMovies = movies.slice(0, 5); 

  useEffect(() => {
    if (heroMovies.length < 2) return;
    const interval = setInterval(() => {
      setCurrentMovieIndex((prevIndex) => (prevIndex + 1) % heroMovies.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroMovies.length]);

  if (heroMovies.length === 0) return null;

  const movie = heroMovies[currentMovieIndex];

  return (
    <div className="relative h-[65vh] md:h-[85vh] w-full overflow-hidden">
      {/* Background Image */}
      <div key={movie.id} className="absolute inset-0 transition-opacity duration-1000 ease-in-out">
          <div className="absolute inset-0 bg-linear-to-r from-black via-black/2 to-transparent z-10"></div>
          <div className="absolute inset-0 bg-linear-to-t from-[#0a0a0a] via-[#0a0a0a]/2 to-transparent z-10"></div>
          <img 
            src={movie.image} 
            alt={movie.name} 
            className="w-full h-full object-cover opacity-100"
          />
      </div>

      {/* Content - Text එක ටිකක් උඩින් තියමු Overlap නොවෙන්න */}
      <div className="absolute top-[35%] md:top-[28%] left-4 md:left-12 z-20 max-w-2xl pt-5">
        <span className="text-blue-400 font-bold tracking-wider uppercase text-sm md:text-base mb-2 block">
            Featured in {movie.category}
        </span>
        <h1 className="text-4xl md:text-7xl font-extrabold text-white mb-4 drop-shadow-2xl leading-tight">
          {movie.name}
        </h1>
        <p className="text-gray-200 text-sm md:text-lg line-clamp-3 mb-8 max-w-xl drop-shadow-lg font-medium">
           {movie.year} • {movie.genre || movie.category} • Watch the latest episode now on Ralla.
        </p>
        
        <div className="flex gap-4">
          <Link href={`/movie/${movie.id}`} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-full font-bold transition-all shadow-lg hover:scale-105">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
              <path fillRule="evenodd" d="M4.5 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" clipRule="evenodd" />
            </svg>
            Play Now
          </Link>
          <button className="flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-8 py-3.5 rounded-full font-bold transition-all border border-white/30">
             More Info
          </button>
        </div>
      </div>
      
      {/* Dots */}
      <div className="absolute bottom-10 right-8 z-30 flex gap-2">
        {heroMovies.map((_, index) => (
            <div key={index} className={`h-2.5 rounded-full transition-all duration-300 ${index === currentMovieIndex ? 'bg-blue-500 w-8' : 'bg-gray-500/50 w-2.5'}`}></div>
        ))}
      </div>
    </div>
  );
}