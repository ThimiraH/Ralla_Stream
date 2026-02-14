"use client";

import React, { useState, useRef, useEffect } from 'react';
import Spinner from './Spinner';
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

export default function VideoPlayer({ sources = [], subtitles = [], poster, onProgress, onPlayStart }) {
  const videoRef = useRef(null);
  const playerContainerRef = useRef(null);
  const controlsTimeoutRef = useRef(null);
  const savedTimeRef = useRef(0);
  const wasPlayingRef = useRef(false);

  // --- States ---
  // Default Quality එක විදිහට පළමු Source එක ගන්නවා
  const [currentSrc, setCurrentSrc] = useState(sources[0]?.url || "");
  const [quality, setQuality] = useState(sources[0]?.quality || "Auto");

  const [isError, setIsError] = useState(false);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [activeSubtitle, setActiveSubtitle] = useState("Off");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [showControls, setShowControls] = useState(true);

  // Volume States
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  // --- HELPER FUNCTIONS ---

  // Time Format (00:00)
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // User Activity Handle (Controls Hide/Show)
  const handleUserActivity = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
        setShowSettings(false);
      }, 3000);
    }
  };

  // --- VIDEO LOGIC ---

  // Play / Pause
  const togglePlay = () => {
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
      handleUserActivity();
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
      setShowControls(true);
    }
  };

  // Skip Forward/Backward
  const skip = (amount) => {
    if (videoRef.current) {
      videoRef.current.currentTime += amount;
      handleUserActivity();
    }
  };

  // Seek (Progress Bar)
  const handleSeek = (e) => {
    const time = parseFloat(e.target.value);
    videoRef.current.currentTime = time;
    setCurrentTime(time);
    handleUserActivity();
  };

  // Volume Control
  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
    setIsMuted(newVolume === 0);
  };

  // Mute / Unmute
  const toggleMute = () => {
    if (isMuted) {
      const newVol = volume || 1;
      videoRef.current.volume = newVol;
      setIsMuted(false);
    } else {
      videoRef.current.volume = 0;
      setIsMuted(true);
    }
  };

  // Quality Change Logic
  const changeQuality = (newQuality, newUrl) => {
    if (newQuality === quality) return;

    // 1. Save current state
    const wasPlaying = !videoRef.current.paused;
    const savedTime = videoRef.current.currentTime;

    if (videoRef.current) {
      savedTimeRef.current = videoRef.current.currentTime;
      wasPlayingRef.current = !videoRef.current.paused;
    }

    // 2. Set new source
    setQuality(newQuality);
    setCurrentSrc(newUrl);
    setShowSettings(false);

    // Note: useEffect [currentSrc] will handle the reloading
  };

  // Subtitle Change Logic
  const changeSubtitle = (lang) => {
    setActiveSubtitle(lang);
    setShowSettings(false);

    const video = videoRef.current;
    if (!video) return;

    for (let i = 0; i < video.textTracks.length; i++) {
      const track = video.textTracks[i];
      if (lang === "Off") {
        track.mode = 'hidden';
      } else if (track.label === lang) {
        track.mode = 'showing';
      } else {
        track.mode = 'hidden';
      }
    }
  };

  // --- FULLSCREEN LOGIC (FIXED FOR MOBILE) ---
  const toggleFullscreen = async () => {
    const container = playerContainerRef.current;
    const video = videoRef.current;

    try {
      if (!document.fullscreenElement && !document.webkitFullscreenElement) {
        // Try Container Fullscreen First (Desktop/Android)
        if (container.requestFullscreen) {
          await container.requestFullscreen();
        } else if (container.webkitRequestFullscreen) {
          await container.webkitRequestFullscreen();
        } else if (container.msRequestFullscreen) {
          await container.msRequestFullscreen();
        } else {
          // Fallback: Direct Video Fullscreen (iOS/Telegram)
          if (video.webkitEnterFullscreen) {
            video.webkitEnterFullscreen();
          } else if (video.requestFullscreen) {
            await video.requestFullscreen();
          }
        }
        setIsFullscreen(true);
      } else {
        // Exit Fullscreen
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
          await document.webkitExitFullscreen();
        }
        setIsFullscreen(false);
      }
    } catch (err) {
      console.log("Custom fullscreen failed, switching to native...", err);
      // Fallback for errors
      if (video.webkitEnterFullscreen) {
        video.webkitEnterFullscreen();
      } else if (video.requestFullscreen) {
        video.requestFullscreen();
      }
    }
  };

  // --- EFFECTS ---

  // Handle Source Change (Quality Switch)
  // useEffect(() => {
  //   if (videoRef.current) {
  //     videoRef.current.load();
  //     // Note: In a real HLS setup, you'd restore time here. 
  //     // For MP4, it resets to start.
  //   }
  // }, [currentSrc]);

  useEffect(() => {
    const video = videoRef.current;

    if (video) {
      setIsError(false); // 👈 2. අලුත් Video එකක් දානකොට Error එක අයින් කරනවා
      setIsBuffering(true); // Load වෙන්න පටන් ගන්නවා
      // අලුත් Video එක Load කරනවා
      video.load();

      // 👇 අලුත් Video එකේ විස්තර (Metadata) Load වුන ගමන් මේක වැඩ කරනවා
      const handleLoadedMetadata = () => {
        setIsBuffering(false);
        if (savedTimeRef.current > 0) {
          video.currentTime = savedTimeRef.current; // පරණ වෙලාවට යවනවා
        }
        if (wasPlayingRef.current) {
          video.play(); // කලින් Play වෙවී තිබුනා නම්, දිගටම Play කරනවා
        }
        // වැඩේ ඉවර වුනාම Reset කරනවා
        savedTimeRef.current = 0;
        wasPlayingRef.current = false;
      };

      // 👇 3. Error Event Listener
      const handleError = () => {
        setIsError(true);       // Error එකක් ආවා කියලා කියනවා
        setIsBuffering(false);  // Spinner එක නවත්තනවා
        setIsPlaying(false);    // Playing නවත්තනවා
      };

      // Event Listener එක දානවා (එක් වරක් පමණක් වැඩ කිරීමට 'once: true' දානවා)
      video.addEventListener('loadedmetadata', handleLoadedMetadata, { once: true });
      video.addEventListener('error', handleError); // Error Listener

      // Clean up
      return () => {
        video.removeEventListener('loadedmetadata', handleLoadedMetadata);
        video.removeEventListener('error', handleError);
      };
    }
  }, [currentSrc]);

  // Keyboard Controls
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (document.activeElement.tagName === 'TEXTAREA' || document.activeElement.tagName === 'INPUT') return;

      handleUserActivity();

      switch (e.code) {
        case 'Space':
          e.preventDefault();
          togglePlay();
          break;
        case 'ArrowRight':
          skip(10);
          break;
        case 'ArrowLeft':
          skip(-10);
          break;
        case 'ArrowUp':
          e.preventDefault();
          handleVolumeChange({ target: { value: Math.min(volume + 0.1, 1) } });
          break;
        case 'ArrowDown':
          e.preventDefault();
          handleVolumeChange({ target: { value: Math.max(volume - 0.1, 0) } });
          break;
        case 'KeyF':
          toggleFullscreen();
          break;
        case 'KeyM':
          toggleMute();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, volume, isMuted]);


  // --- RENDER ---
  return (
    <div
      ref={playerContainerRef}
      className="relative w-full h-full bg-black group overflow-hidden rounded-xl border border-gray-800 shadow-2xl flex flex-col justify-center select-none"
      onMouseMove={handleUserActivity}
      onTouchStart={handleUserActivity}
      onDoubleClick={toggleFullscreen}
    >

      {/* 👇 4. ERROR OVERLAY (Popup Message) */}
      {isError && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-gray-900/95 text-center px-4">
          <ExclamationTriangleIcon className="w-16 h-16 text-red-500 mb-4" />
          <h3 className="text-xl md:text-2xl font-bold text-white mb-2">Video Unavailable</h3>
          <p className="text-gray-400 text-sm md:text-base max-w-md">
            We couldn't load the video. It might have been deleted or not yet uploaded. The video will be uploaded soon
          </p>
          {/* Optional: Add a button if you want */}
          <div className="mt-6 px-4 py-2 bg-gray-800 rounded-lg text-xs text-gray-500 font-mono">
            Error Code: SOURCE_NOT_FOUND
          </div>
        </div>
      )}

      {/* Main Video Element */}
      <video
        ref={videoRef}
        src={currentSrc}
        poster={poster}
        className="w-full h-full object-contain bg-black"
        playsInline // Important for Mobile
        onClick={togglePlay}
        // onTimeUpdate={() => setCurrentTime(videoRef.current.currentTime)}
        onTimeUpdate={() => {
          const v = videoRef.current;
          setCurrentTime(v.currentTime);
          // Parent Component එකට වෙලාව යවනවා (තත්පර 5කට සැරයක් විතරක් save වෙන විදිහට logic එක හදන්න පුළුවන්, දැනට කෙලින්ම යවමු)
          if (!v.paused && onProgress) {
            onProgress({ currentTime: v.currentTime, duration: v.duration || 0 });
          
        }
        }}

      onPlay={() => {
        setIsBuffering(false);
        setIsPlaying(true);
        if (onPlayStart) onPlayStart(); // 👈 මෙන්න මෙතනින් තමයි View Count එක Trigger වෙන්නේ
      }}

      onLoadedMetadata={() => setDuration(videoRef.current.duration)}
      onWaiting={() => setIsBuffering(true)}
      onPlaying={() => { setIsBuffering(false); setIsPlaying(true); }}
      onPause={() => setIsPlaying(false)}
        // onError={() => setIsError(true)} // React Event එකෙනුත් අල්ලන්න පුළුවන් (useEffect එකේ Listener නැත්නම්)
      crossOrigin="anonymous"
      >
      {subtitles.map((sub, index) => (
        <track
          key={index}
          kind="subtitles"
          src={sub.url}
          srcLang={sub.langCode}
          label={sub.label}
          default={index === 0}
        />
      ))}
    </video>

      {/* Buffering Spinner */ }
  { isBuffering && <div className="absolute inset-0 flex items-center justify-center z-30 bg-black/40"><Spinner /></div> }

  {/* Center Play Button */ }
  {
    !isPlaying && !isBuffering && (
      <button onClick={togglePlay} className="absolute inset-0 m-auto w-16 h-16 bg-blue-600/80 hover:bg-blue-600 rounded-full flex items-center justify-center transition-transform hover:scale-110 z-10">
        <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" className="w-8 h-8 ml-1"><path d="M8 5v14l11-7z" /></svg>
      </button>
    )
  }

  {/* Control Bar */ }
  <div className={`absolute bottom-0 left-0 w-full bg-linear-to-t from-black/90 via-black/60 to-transparent p-4 transition-opacity duration-300 z-20 ${showControls ? 'opacity-100' : 'opacity-0'}`}>

    {/* Progress Bar */}
    <input
      type="range"
      min="0"
      max={duration || 0}
      value={currentTime}
      onChange={handleSeek}
      className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer mb-4 accent-blue-500 hover:h-1.5 transition-all"
    />

    <div className="flex items-center justify-between text-white">

      {/* Left Controls */}
      <div className="flex items-center gap-4">

        {/* Play/Pause */}
        <button onClick={togglePlay} className="hover:text-blue-400">
          {isPlaying ? (
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="w-6 h-6" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="w-6 h-6" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
          )}
        </button>

        {/* Skip Buttons */}
        <button onClick={() => skip(-10)} className="hover:text-blue-400 text-xs flex flex-col items-center" title="Rewind 10s (Left Arrow)">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M12.5 8c-2.65 0-5.05.99-6.9 2.6L2 7v9h9l-3.62-3.62c1.39-1.16 3.16-1.88 5.12-1.88 3.54 0 6.55 2.31 7.6 5.5l2.37-.78C21.08 11.03 17.15 8 12.5 8z" /></svg>
          -10s
        </button>
        <button onClick={() => skip(10)} className="hover:text-blue-400 text-xs flex flex-col items-center" title="Forward 10s (Right Arrow)">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M10 12.7C10 12.7 10 12.7 10 12.7 10 12.7 10 12.7 10 12.7z" /><path d="M18.4 10.6C16.55 9 14.15 8 11.5 8c-4.65 0-8.58 3.03-9.96 7.22L3.9 16c1.05-3.19 4.05-5.5 7.6-5.5 1.95 0 3.73.72 5.12 1.88L13 16h9V7l-3.6 3.6z" /></svg>
          +10s
        </button>

        {/* Volume Controls */}
        <div className="flex items-center gap-2 group/volume">
          <button onClick={toggleMute} className="hover:text-blue-400">
            {isMuted || volume === 0 ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M17.25 9.75 19.5 12m0 0 2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6 4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" /></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" /></svg>
            )}
          </button>
          <input
            type="range" min="0" max="1" step="0.05"
            value={isMuted ? 0 : volume} onChange={handleVolumeChange}
            className="w-16 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-blue-500 hidden sm:block"
          />
        </div>

        <span className="text-sm font-medium ml-2">
          {formatTime(currentTime)} / {formatTime(duration)}
        </span>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">

        {/* Settings Button */}
        <div className="relative">
          <button onClick={() => setShowSettings(!showSettings)} className="hover:text-blue-400 transition">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 0 1 0 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 0 1 0-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" /></svg>
          </button>
          {showSettings && (
            <div className="absolute bottom-10 right-0 bg-black/90 border border-gray-700 p-4 rounded-lg w-56 shadow-xl z-50">
              {/* Quality Menu */}
              <div className="mb-4">
                <p className="text-[10px] text-gray-500 font-bold mb-2 uppercase tracking-wider">Quality</p>
                <div className="flex flex-col gap-1">
                  {sources.map((src, idx) => (
                    <button key={idx} onClick={() => changeQuality(src.quality, src.url)} className={`text-sm text-left px-3 py-1.5 rounded transition ${quality === src.quality ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800'}`}>
                      {src.quality}
                    </button>
                  ))}
                </div>
              </div>
              {/* Subtitles Menu */}
              <div>
                <p className="text-[10px] text-gray-500 font-bold mb-2 uppercase tracking-wider">Subtitles</p>
                <div className="flex flex-col gap-1 max-h-32 overflow-y-auto">
                  <button onClick={() => changeSubtitle("Off")} className={`text-sm text-left px-3 py-1.5 rounded transition ${activeSubtitle === "Off" ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800'}`}>Off</button>
                  {subtitles.map((sub, idx) => (
                    <button key={idx} onClick={() => changeSubtitle(sub.label)} className={`text-sm text-left px-3 py-1.5 rounded transition ${activeSubtitle === sub.label ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800'}`}>
                      {sub.label}
                    </button>
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
    </div >
  );
}