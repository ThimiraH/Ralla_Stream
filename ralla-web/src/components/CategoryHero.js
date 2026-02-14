"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { PlayIcon, InformationCircleIcon } from "@heroicons/react/24/solid";


export default function CategoryHero({ category }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        // අදාළ Category එකේ slides විතරක් ඉල්ලනවා
        const res = await fetch(`/api/slides?category=${encodeURIComponent(category)}`);
        const data = await res.json();
        if (data.success && data.data.length > 0) {
          setSlides(data.data);
        }
      } catch (error) {
        console.error("Error loading category slides", error);
      } finally {
        setLoading(false);
      }
    };

    if (category) {
      fetchSlides();
    }
  }, [category]);

  // 2. Auto Slide Logic
  useEffect(() => {
    if (slides.length < 2) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  if (loading) return <div className="h-[60vh] md:h-[80vh] bg-[#0a0a0a] animate-pulse"></div>;

  // Slide මුකුත් නැත්නම් මුකුත් පෙන්නන්නේ නෑ (හෝ Default Image එකක් දාන්න පුළුවන්)
  if (slides.length === 0) return null;

  const slide = slides[currentSlide];

  return (
    <div className="relative h-[65vh] md:h-[85vh] w-full overflow-hidden">
      {/* Background Image */}
      {slides.map((item, index) => (
        <div
          key={item._id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"}`}
        >
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-linear-to-r from-black/90 via-black/40 to-transparent z-20"></div>
          <div className="absolute inset-0 bg-linear-to-t from-[#0a0a0a] via-transparent to-transparent z-20"></div>

          {/* Media (Video or Image) */}
          {item.type === "video" ? (
            <video
              className="w-full h-full object-cover"
              src={item.videoUrl}
              poster={item.imageUrl}
              autoPlay loop muted playsInline
            />
          ) : (
            <img
              src={item.imageUrl}
              alt={item.title}
              className="w-full h-full object-cover"
            />
          )}
        </div>
      ))}

      {/* Content Layer */}
      <div className="absolute top-[30%] left-4 md:left-12 z-30 max-w-2xl pt-5">
        <div className="flex items-center gap-3 mb-3 animate-fade-in-up">
          <span className="bg-blue-600/80 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            {slide.tag || category}
          </span>
        </div>

        <h1 className="text-4xl md:text-7xl font-extrabold text-white mb-4 drop-shadow-2xl leading-tight animate-fade-in-up delay-100">
          {slide.title}
        </h1>

        {/* <p className="text-gray-200 text-sm md:text-lg line-clamp-3 mb-8 max-w-xl drop-shadow-lg font-medium animate-fade-in-up delay-200">
          {slide.description}
        </p> */}

        <div className="flex gap-4 animate-fade-in-up delay-300">
          <Link href={slide.link || `/movie/${slide.title}`} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-full font-bold transition-all shadow-lg hover:scale-105">
            <PlayIcon className="w-5 h-5" />
            Play Now
          </Link>
          <button className="flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white px-8 py-3.5 rounded-full font-bold transition-all border border-white/20">
            <InformationCircleIcon className="w-5 h-5" />
            More Info
          </button>
        </div>
      </div>

      {/* Dots Indicator */}
      <div className="absolute bottom-10 right-8 z-30 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-2.5 rounded-full transition-all duration-300 ${index === currentSlide ? 'bg-blue-500 w-8' : 'bg-gray-500/50 w-2.5 hover:bg-gray-400'}`}
          />
        ))}
      </div>
    </div>
  );
}