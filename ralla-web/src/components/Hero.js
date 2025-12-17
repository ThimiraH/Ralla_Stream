"use client"; // Interactive නිසා මේක අනිවාර්යයි

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // 1. අපේ Hero Section එකේ පෙන්වන ෆිල්ම් ටික (Data Array)
  const slides = [
    {
      id: 1,
      type: "video", // මේක වීඩියෝ එකක්
      src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4", // තාවකාලික වීඩියෝ ලින්ක් එකක්
      poster: "https://wallpaperaccess.com/full/2063931.jpg", // වීඩියෝ එක load වෙනකන් පෙන්වන පින්තූරය
      title: "Avatar: The Way of Water",
      desc: "Jake Sully lives with his newfound family formed on the extrasolar moon Pandora. Once a familiar threat returns to finish what was previously started, Jake must work with Neytiri and the army of the Na'vi race to protect their home.",
      tag: "NEW"
    },
    {
      id: 2,
      type: "image", // මේක පින්තූරයක්
      src: "https://www.momtastic.com/wp-content/uploads/sites/5/2022/12/wednesday-show.jpg",
      title: "Wednesday",
      desc: "Wednesday Addams is sent to Nevermore Academy, a bizarre boarding school where she attempts to master her psychic powers, stop a monstrous killing spree, and solve the supernatural mystery that affected her family 25 years ago.",
      tag: "TRENDING"
    },
    {
      id: 3,
      type: "image",
      src: "https://upload.wikimedia.org/wikipedia/en/9/99/Vikings_Title.png",
      title: "Vikings",
      desc: "Vikings transports us to the brutal and mysterious world of Ragnar Lothbrok, a Viking warrior and farmer who yearns to explore - and raid - the distant shores across the ocean.",
      tag: "TOP 10"
    },
    {
      id: 4,
      type: "image",
      src: "/uploads/DMPoster.jpg",
      title: "Divine Manifestation",
      desc: "15 years ago, an eerie catastrophe struck Luofeng City, reducing it to a lifeless ruin overnight.Ding Xiao—once hailed as a prodigy for forming his spirit embryo at the age of seven—joined the Spirit Suppression Sect, only to fall from grace after shattering his own embryo. Cast out, he was forced to serve as a coffin bearer in the Guibu Division, enduring five long years of hardship and scorn. Against all odds, he awakened his power anew, stunning everyone during the Sect's advancement trials and rising as a force to be reckoned with—a growing threat to the Lingbu Division. Nowadays, as sinister omens spread and supernatural threats loomed, Ding Xiao embarked on a perilous quest to save his ailing sister. But the path ahead drew him into a web of power struggles and hidden truths. As the tragedy of Luofeng City gradually came to light, he discovered that his fate was bound inseparably to the destiny of the spirits themselves...",
      tag: "Trending"
    }

  ];

  // 2. Auto Slide වෙන්න Timer එක (තත්පර 5න් 5ට)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 7000); // 7000ms = තත්පර 7ක්

    return () => clearInterval(timer);
  }, [slides.length]);

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
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out
            ${index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"}
          `}
        >
          {/* වීඩියෝ එකක් නම් */}
          {slide.type === "video" ? (
            <video
              className="w-full h-full object-cover"
              src={slide.src}
              poster={slide.poster}
              autoPlay
              loop
              muted // Browser එකෙන් Auto play වෙන්න නම් mute වෙන්නම ඕන
              playsInline
            />
          ) : (
            /* පින්තූරයක් නම් */
            <div
              className="w-full h-full bg-cover bg-center"
              style={{ backgroundImage: `url('${slide.src}')` }}
            ></div>
          )}

          {/* Dark Overlay (අකුරු පේන්න කළු පාට Gradient එක) */}
          <div className="absolute inset-0 bg-linear-to-r from-black via-black/20 to-transparent"></div>
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
              {slides[currentSlide].tag}
            </span>
            <h3 className="text-blue-400 font-bold tracking-[0.2em] text-sm uppercase animate-pulse">
              Stream the New Wave
            </h3>
          </div>

          {/* Title */}
          <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight mb-4 drop-shadow-lg">
            {slides[currentSlide].title}
          </h1>

          {/* Description */}
          <p className="text-gray-300 text-lg mb-8 line-clamp-3 max-w-2xl drop-shadow-md">
            {slides[currentSlide].desc}
          </p>

          {/* Buttons */}
          <div className="flex gap-4">
            <Link href={`/movie/${slides[currentSlide].title}`}>
              <button className="bg-white text-black px-8 py-3 rounded-full font-bold text-lg hover:bg-gray-200 transition flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                  <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
                </svg>
                Play Now
              </button>
            </Link>

            <Link href={`/movie/${slides[currentSlide].title}`}>
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