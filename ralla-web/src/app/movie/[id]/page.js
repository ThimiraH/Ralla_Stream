"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import VideoPlayer from '@/components/VideoPlayer';
import MovieRow from '@/components/MovieRow';
import Spinner from '@/components/Spinner'; 
import DiscussionSection from '@/components/DiscussionSection';
import MovieHeader from '@/components/MovieHeader';
import EpisodeList from '@/components/EpisodeList';
import InfoTabs from '@/components/InfoTabs'; // New
import TrendingSidebar from '@/components/TrendingSidebar'; // New
import RecentlyWatched from '@/components/RecentlyWatched'; // New
import { HandThumbUpIcon, ShareIcon, ArrowDownTrayIcon } from "@heroicons/react/24/outline";

export default function MoviePage() {
  const params = useParams();
  const movieId = params.id; 
  const [movie, setMovie] = useState(null); 
  const [loading, setLoading] = useState(true); 
  
  const [currentSeason, setCurrentSeason] = useState(0); 
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0); 

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const res = await fetch(`/api/movies/${movieId}`);
        const data = await res.json();
        if (data.success) setMovie(data.data);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };
    if (movieId) fetchMovie();
  }, [movieId]);

  // --- DUMMY RECOMMENDATION DATA (20 Items) ---
  const recommendations = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    name: `Recommended Show ${i + 1}`,
    image: "https://wallpaperaccess.com/full/2063931.jpg", // Placeholder Image
    year: "2024"
  }));

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center"><Spinner /></div>;
  if (!movie) return <div className="min-h-screen bg-black text-white flex items-center justify-center">Movie not found!</div>;

  const isSeries = movie.type === "series";
  const activeVideoUrl = isSeries 
      ? movie.seasons?.[currentSeason]?.episodes?.[currentEpisodeIndex]?.videoUrl 
      : movie.videoUrl;

  const activeEpisode = isSeries ? movie.seasons?.[currentSeason]?.episodes?.[currentEpisodeIndex] : null;
  const displayTitle = isSeries 
      ? `${movie.title} - S${movie.seasons[currentSeason].seasonNumber} | ${activeEpisode?.title}`
      : movie.title;
  const displayDate = new Date(movie.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pb-20">
      
      {/* Header */}
      <div className="pt-20"> 
          <MovieHeader movie={movie} />
      </div>

      <div className="max-w-[1700px] mx-auto px-4 md:px-8 mt-6">
        
        {/* --- GRID LAYOUT (75% - 25%) --- */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            
            {/* --- LEFT SIDE (75%) --- */}
            <div className="lg:col-span-3 space-y-8">
                
                {/* 1. Video Player Area */}
                <div>
                    <div className="w-full aspect-video bg-black rounded-xl overflow-hidden shadow-2xl border border-gray-800 relative z-0">
                        <VideoPlayer key={activeVideoUrl} src={activeVideoUrl || ""} poster={movie.thumbnailUrl} />
                    </div>

                    {/* Title & Meta */}
                    <div className="mt-4 border-b border-gray-800 pb-4">
                        <h2 className="text-xl md:text-2xl font-bold text-white mb-2">{displayTitle}</h2>
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <span className="text-gray-400 text-sm">Uploaded on {displayDate}</span>
                            <div className="flex items-center gap-2">
                                <ActionButton icon={<HandThumbUpIcon className="w-5 h-5" />} text="Like" />
                                <ActionButton icon={<ShareIcon className="w-5 h-5" />} text="Share" />
                                <ActionButton icon={<ArrowDownTrayIcon className="w-5 h-5" />} text="Download" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. Discussion Section */}
                <DiscussionSection movieId={movie._id} />

                {/* 3. Recommendations (20 Items) */}
                <div className="pt-6 border-t border-gray-800">
                     <h3 className="text-xl font-bold mb-4 text-white">You may also like</h3>
                     {/* Using MovieRow but ensuring it shows enough items */}
                     <MovieRow title="" movies={recommendations} />
                </div>
            </div>


            {/* --- RIGHT SIDE (25%) --- */}
            <div className="lg:col-span-1 space-y-6">
                
                {/* 1. Episode List (Only for Series) */}
                {isSeries && (
                    <EpisodeList 
                        episodes={movie.seasons[currentSeason].episodes} 
                        currentEpisodeIndex={currentEpisodeIndex}
                        onEpisodeSelect={(index) => setCurrentEpisodeIndex(index)}
                    />
                )}

                {/* 2. Recently Watched */}
                <RecentlyWatched />

                {/* 3. Description & Cast (For Both) */}
                <InfoTabs description={movie.description} cast={[]} />

                {/* 4. Weekly Trending (For Both) */}
                <TrendingSidebar />
            </div>

        </div>
      </div>
    </div>
  );
}

function ActionButton({ icon, text }) {
    return (
        <button className="flex items-center gap-2 bg-[#1a1a1a] hover:bg-[#252525] border border-gray-700 px-4 py-2 rounded-full text-sm font-bold transition-all text-white">
            {icon}
            <span>{text}</span>
        </button>
    );
}