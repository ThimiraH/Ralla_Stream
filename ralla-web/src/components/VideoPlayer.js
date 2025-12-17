"use client";

import React, { useState, useRef, useEffect } from 'react';
import Spinner from './Spinner'; // අපි හදපු Spinner එක ගෙන්වා ගත්තා

export default function VideoPlayer({ src, poster }) {
  const videoRef = useRef(null);
  const playerContainerRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [quality, setQuality] = useState("1080p");
  const [subtitle, setSubtitle] = useState("Off");
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // NEW: වීඩියෝ එක හිර වෙලාද (Buffer වෙනවද) බලන්න State එකක්
  const [isBuffering, setIsBuffering] = useState(false);

  // --- KEYBOARD CONTROLS (අලුත් කොටස) ---
  useEffect(() => {
    const handleKeyDown = (e) => {
      // User මොනවා හරි Type කරනවා නම් (Comment box එකේ), Shortcut වැඩ කරන්න එපා
      if (document.activeElement.tagName === 'TEXTAREA' || document.activeElement.tagName === 'INPUT') {
        return;
      }

      switch (e.code) {
        case 'Space':
          e.preventDefault(); // Space ගැහුවම Page එක පහළට Scroll වෙන එක නවත්තනවා
          togglePlay();
          break;
        case 'ArrowRight':
          skip(10);
          break;
        case 'ArrowLeft':
          skip(-10);
          break;
        case 'KeyF':
          toggleFullscreen();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying]); // isPlaying වෙනස් වෙද්දී මේක update වෙන්න ඕන

  // --- PLAY / PAUSE ---
  const togglePlay = () => {
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleTimeUpdate = () => {
    setCurrentTime(videoRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    setDuration(videoRef.current.duration);
  };

  const skip = (amount) => {
    if (videoRef.current) {
        videoRef.current.currentTime += amount;
    }
  };

  const handleSeek = (e) => {
    const time = parseFloat(e.target.value);
    videoRef.current.currentTime = time;
    setCurrentTime(time);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      playerContainerRef.current.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div 
        ref={playerContainerRef} 
        className="relative w-full h-full bg-black group overflow-hidden rounded-xl border border-gray-800 shadow-2xl flex flex-col justify-center select-none"
        onDoubleClick={toggleFullscreen} // Screen එක Double Click කරාමත් Fullscreen වෙනවා
    >
      
      {/* Main Video Element */}
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        className="w-full h-full object-contain cursor-pointer"
        onClick={togglePlay}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        // NEW: Buffering Events
        onWaiting={() => setIsBuffering(true)} // හිර වුනාම
        onPlaying={() => setIsBuffering(false)} // ආයේ වැඩ කරද්දී
      ></video>

      {/* --- BUFFERING SPINNER (NEW) --- */}
      {isBuffering && (
        <div className="absolute inset-0 flex items-center justify-center z-30 bg-black/40">
           <Spinner />
        </div>
      )}

      {/* Center Play Button (Overlay) */}
      {!isPlaying && !isBuffering && (
        <button 
            onClick={togglePlay}
            className="absolute inset-0 m-auto w-16 h-16 bg-blue-600/80 hover:bg-blue-600 rounded-full flex items-center justify-center transition-transform hover:scale-110 z-10 animate-fade-in-up"
        >
            <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" className="w-8 h-8 ml-1"><path d="M8 5v14l11-7z"/></svg>
        </button>
      )}

      {/* Control Bar */}
      <div className="absolute bottom-0 left-0 w-full bg-linear-to-t from-black/90 via-black/60 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
        
        {/* Progress Bar */}
        <input 
            type="range" 
            min="0" 
            max={duration} 
            value={currentTime} 
            onChange={handleSeek}
            className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer mb-4 accent-blue-500 hover:h-1.5 transition-all"
        />

        <div className="flex items-center justify-between text-white">
            
            {/* Left Controls */}
            <div className="flex items-center gap-4">
                <button onClick={togglePlay} className="hover:text-blue-400" title="Play/Pause (Space)">
                    {isPlaying ? (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="w-6 h-6" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="w-6 h-6" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                    )}
                </button>

                <button onClick={() => skip(-10)} className="hover:text-blue-400 text-xs flex flex-col items-center" title="Rewind 10s (Left Arrow)">
                     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M12.5 8c-2.65 0-5.05.99-6.9 2.6L2 7v9h9l-3.62-3.62c1.39-1.16 3.16-1.88 5.12-1.88 3.54 0 6.55 2.31 7.6 5.5l2.37-.78C21.08 11.03 17.15 8 12.5 8z"/></svg>
                     -10s
                </button>
                <button onClick={() => skip(10)} className="hover:text-blue-400 text-xs flex flex-col items-center" title="Forward 10s (Right Arrow)">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M10 12.7C10 12.7 10 12.7 10 12.7 10 12.7 10 12.7 10 12.7z"/><path d="M18.4 10.6C16.55 9 14.15 8 11.5 8c-4.65 0-8.58 3.03-9.96 7.22L3.9 16c1.05-3.19 4.05-5.5 7.6-5.5 1.95 0 3.73.72 5.12 1.88L13 16h9V7l-3.6 3.6z"/></svg>
                    +10s
                </button>

                <span className="text-sm font-medium ml-2">
                    {formatTime(currentTime)} / {formatTime(duration)}
                </span>
            </div>

            {/* Right Controls */}
            <div className="flex items-center gap-3">
                
                {/* Settings */}
                <div className="relative">
                    <button 
                        onClick={() => setShowSettings(!showSettings)}
                        className="hover:text-blue-400 transition"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 0 1 0 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 0 1 0-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" /></svg>
                    </button>
                    {showSettings && (
                        <div className="absolute bottom-10 right-0 bg-black/90 border border-gray-700 p-4 rounded-lg w-48 shadow-xl">
                            {/* Quality & Subs UI */}
                            <div className="mb-3">
                                <p className="text-xs text-gray-400 mb-1 uppercase">Quality</p>
                                <div className="flex flex-col gap-1">
                                    {["1080p", "720p", "480p"].map((q) => (
                                        <button key={q} onClick={() => {setQuality(q); setShowSettings(false);}} className={`text-sm text-left px-2 py-1 rounded hover:bg-gray-800 ${quality === q ? 'text-blue-500 font-bold' : 'text-gray-300'}`}>{q} {quality === q && "✓"}</button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 mb-1 uppercase">Subtitles</p>
                                <div className="flex flex-col gap-1">
                                    {["Off", "English", "Sinhala"].map((s) => (
                                        <button key={s} onClick={() => {setSubtitle(s); setShowSettings(false);}} className={`text-sm text-left px-2 py-1 rounded hover:bg-gray-800 ${subtitle === s ? 'text-blue-500 font-bold' : 'text-gray-300'}`}>{s} {subtitle === s && "✓"}</button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Fullscreen Button */}
                <button onClick={toggleFullscreen} className="hover:text-blue-400 transition" title="Fullscreen (F)">
                    {isFullscreen ? (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5M15 15l5.25 5.25" /></svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" /></svg>
                    )}
                </button>

            </div>
        </div>
      </div>
    </div>
  );
}