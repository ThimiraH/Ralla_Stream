"use client"; // Interactive නිසා මේක අනිවාර්යයි

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slides, setSlides] = useState([]); // Database එකෙන් එන Data
  const [loading, setLoading] = useState(true);

  // 1. අපේ Hero Section එකේ පෙන්වන ෆිල්ම් ටික from Database (Data Array)
  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const res = await fetch("/api/slides"); // Active Slides විතරක් එනවා
        const data = await res.json();
        if (data.success && data.data.length > 0) {
          setSlides(data.data);
        }
      } catch (error) {
        console.error("Error loading slides", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSlides();
  }, []);

  // 2. Auto Slide Timer
  useEffect(() => {
    if (slides.length === 0) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [slides.length]);

  // Loading State
  if (loading) return <div className="h-[85vh] bg-black flex items-center justify-center text-white">Loading Highlights...</div>;
  if (slides.length === 0) return null; // Slide මුකුත් නැත්නම් පෙන්නන්නේ නෑ

  // Current Slide Data
  const slide = slides[currentSlide];
  // අතින් මාරු කරන්න ඕන වුනොත් (Next/Prev Buttons වලට)
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  return (
    <div className="relative w-full h-[85vh] mt-0 bg-black text-white overflow-hidden">

      {/* --- BACKGROUND SLIDES LAYER --- */}
      {slides.map((item, index) => (
        <div
          key={item._id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out
            ${index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"}
          `}
        >
          {/* වීඩියෝ එකක් නම් */}
          {item.type === "video" ? (
            <video
              className="w-full h-full object-cover"
              src={item.videoUrl}
              poster={item.imageUrl}
              autoPlay
              loop
              muted // Browser එකෙන් Auto play වෙන්න නම් mute වෙන්නම ඕන
              playsInline
            />
          ) : (
            /* පින්තූරයක් නම් */
            <div
              className="w-full h-full bg-cover bg-center"
              style={{ backgroundImage: `url('${item.imageUrl}')` }}
            ></div>
          )}

          {/* Dark Overlay (අකුරු පේන්න කළු පාට Gradient එක) */}
          <div className="absolute inset-0 bg-linear-to-r from-black via-black/10 to-transparent"></div>
          <div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-transparent"></div>
        </div>
      ))}


      {/* --- CONTENT LAYER --- */}
      <div className="absolute inset-0 z-20 flex flex-col justify-center px-8 md:px-16 max-w-4xl pt-20">

        {/* Animated Text Section */}
        {/* key එක වෙනස් වෙනකොට React විසින් මේ කොටස ආපහු animation කරනවා */}
        <div key={currentSlide} className="animate-fade-in-up">

          {/* Tag */}
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded">
              {slide.tag}
            </span>
            <h3 className="text-blue-400 font-bold tracking-[0.2em] text-sm uppercase animate-pulse">
              Stream the New Wave
            </h3>
          </div>

          {/* Title */}
          <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight mb-4 drop-shadow-lg">
            {slide.title}
          </h1>

          {/* Description */}
          <p className="text-gray-300 text-lg mb-8 line-clamp-3 max-w-2xl drop-shadow-md">
            {slide.description}
          </p>

          {/* Buttons */}
          <div className="flex gap-4">
            <Link href={slide.link || `/movie/${slide.title}`}>
              <button className="bg-white text-black px-8 py-3 rounded-full font-bold text-lg hover:bg-gray-200 transition flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                  <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
                </svg>
                Play Now
              </button>
            </Link>

            <Link href={slide.link || `/movie/${slide.title}`}>
              <button className="bg-gray-800/60 backdrop-blur-sm text-white px-8 py-3 rounded-full font-bold text-lg border border-gray-500 hover:bg-gray-700 transition">
                More Info
              </button>
            </Link>

          </div>
        </div>
      </div>

      {/* --- SLIDER CONTROLS (Dots) --- */}
      <div className="absolute right-10 bottom-1/2 transform translate-y-1/2 z-30 flex flex-col gap-4">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 
                    ${index === currentSlide ? "bg-blue-500 scale-125" : "bg-gray-500 hover:bg-gray-300"}
                `}
          />
        ))}
      </div>

    </div>
  );
}