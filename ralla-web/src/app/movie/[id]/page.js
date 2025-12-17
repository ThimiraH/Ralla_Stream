"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import VideoPlayer from '@/components/VideoPlayer';
import MovieRow from '@/components/MovieRow';
import Spinner from '@/components/Spinner'; // Loading Spinner එක

export default function MoviePage() {
  const params = useParams();
  const movieId = params.id; // URL එකෙන් එන ID එක
  const [movie, setMovie] = useState(null); // ෆිල්ම් එකේ දත්ත තියාගන්න
  const [loading, setLoading] = useState(true); // Load වෙනවද බලන්න
  const [activeTab, setActiveTab] = useState('description');

  // --- 1. Database එකෙන් ෆිල්ම් එක ගෙන්වා ගැනීම ---
  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const res = await fetch(`/api/movies/${movieId}`);
        const data = await res.json();
        
        if (data.success) {
          setMovie(data.data);
        } else {
          console.error("Movie not found");
        }
      } catch (error) {
        console.error("Error fetching movie:", error);
      } finally {
        setLoading(false);
      }
    };

    if (movieId) {
      fetchMovie();
    }
  }, [movieId]);

  // --- Static/Dummy Data (Database එකේ මේවා නැති නිසා) ---
  const episodes = Array.from({ length: 12 }, (_, i) => i + 1);
  const castMembers = [
    { name: "Actor 1", image: "https://image.tmdb.org/t/p/w200/blKKsHlJIL9pmcfHtgbVxBJttIX.jpg" },
    { name: "Actor 2", image: "https://image.tmdb.org/t/p/w200/iOVbUH20il632nj2v01NCtCXjdR.jpg" },
  ];
  const relatedMovies = [
    { name: "Example 1", year: "2023", image: "https://wallpaperaccess.com/full/2063931.jpg" },
  ];

  // Load වෙමින් පවතී නම් Spinner එක පෙන්වන්න
  if (loading) {
    return (
        <div className="min-h-screen bg-black flex items-center justify-center">
            <Spinner />
        </div>
    );
  }

  // ෆිල්ම් එක නැත්නම් (Error)
  if (!movie) {
    return <div className="min-h-screen bg-black text-white flex items-center justify-center">Movie not found!</div>;
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pb-20 pt-24 px-4 md:px-12">
      
      <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* --- LEFT COLUMN --- */}
        <div className="lg:col-span-2 space-y-8">
           
           {/* 1. Video Player (REAL DATA) */}
           <div className="w-full aspect-video rounded-xl overflow-hidden shadow-2xl border border-gray-800">
                <VideoPlayer src={movie.videoUrl} poster={movie.thumbnailUrl} />
           </div>

           {/* 2. Movie Info (REAL DATA) */}
           <div>
               <h1 className="text-3xl md:text-4xl font-bold mb-4">{movie.title}</h1>
               
               <div className="flex flex-wrap items-center gap-3 text-sm font-medium text-gray-400 mb-6">
                    <span className="text-green-500 font-bold text-lg border border-green-500/30 px-2 py-0.5 rounded">
                        {movie.rating || "N/A"} Ratings
                    </span>
                    <span className="border border-gray-600 px-3 py-1 rounded-full">{movie.year}</span>
                    <span className="bg-gray-800 px-3 py-1 rounded-full">{movie.genre}</span>
                    <span className="text-blue-400 uppercase tracking-wider font-bold text-xs border border-blue-900 bg-blue-900/20 px-2 py-1 rounded">
                        {movie.category}
                    </span>
               </div>

               <div className="flex flex-wrap gap-4">
                    <ActionButton icon={<PlusIcon />} text="My List" />
                    <ActionButton icon={<ShareIcon />} text="Share" />
                    <ActionButton icon={<DownloadIcon />} text="Download" />
               </div>
           </div>

           {/* 3. Discussion (Static for now) */}
           <div className="bg-[#111] p-6 rounded-xl border border-gray-800 mt-8">
                <h3 className="text-xl font-bold mb-6">Discussion Area</h3>
                <div className="flex gap-4 mb-8">
                    <div className="w-10 h-10 rounded-full bg-blue-600 shrink-0 flex items-center justify-center font-bold">U</div>
                    <div className="flex-1">
                        <textarea placeholder="Add a comment..." className="w-full bg-black/50 border border-gray-700 rounded-lg p-3 text-sm focus:outline-none focus:border-blue-500 transition" rows="3"></textarea>
                        <div className="flex justify-end mt-3">
                            <button className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-full text-sm font-bold transition">Post</button>
                        </div>
                    </div>
                </div>
           </div>
        </div>

        {/* --- RIGHT COLUMN --- */}
        <div className="space-y-8">
            <div className="bg-[#111] p-5 rounded-xl border border-gray-800">
                <h2 className="text-lg font-bold mb-4">Episodes</h2>
                <div className="grid grid-cols-4 gap-3 max-h-[300px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-700">
                    {episodes.map((ep) => (
                        <button key={ep} className="aspect-square bg-gray-800 hover:bg-blue-600 border border-gray-700 rounded-lg font-bold transition-colors">{ep}</button>
                    ))}
                </div>
            </div>

            <div className="bg-[#111] p-5 rounded-xl border border-gray-800 min-h-[400px]">
                <div className="flex border-b border-gray-800 mb-4">
                    <TabButton active={activeTab === 'description'} onClick={() => setActiveTab('description')}>Description</TabButton>
                    <TabButton active={activeTab === 'cast'} onClick={() => setActiveTab('cast')}>Cast</TabButton>
                </div>

                <div className="max-h-80 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-700">
                    {activeTab === 'description' && (
                        // REAL DESCRIPTION FROM DB
                        <p className="text-gray-300 leading-relaxed">{movie.description}</p>
                    )}
                    {activeTab === 'cast' && (
                        <div className="grid grid-cols-2 gap-6">
                            {castMembers.map((actor, index) => (
                                <div key={index} className="flex flex-col items-center text-center space-y-2">
                                    <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-gray-700">
                                        <Image src={actor.image} alt={actor.name} fill className="object-cover" />
                                    </div>
                                    <span className="text-sm font-medium text-gray-200">{actor.name}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
      </div>

      <div className="mt-16 border-t border-gray-800 pt-10">
           <MovieRow title="Recommendations" movies={relatedMovies} />
      </div>
    </div>
  );
}

// --- Helper Components ---
function ActionButton({ icon, text }) {
    return <button className="flex items-center gap-2 bg-gray-800/80 hover:bg-gray-700 border border-gray-700 px-6 py-3 rounded-full font-bold transition-all min-w-[140px] justify-center">{icon}<span>{text}</span></button>;
}
function TabButton({ children, active, onClick }) {
    return <button onClick={onClick} className={`flex-1 pb-3 font-bold transition-colors relative ${active ? "text-blue-500" : "text-gray-400 hover:text-gray-200"}`}>{children}{active && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500"></div>}</button>;
}
const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>;
const ShareIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" /></svg>;
const DownloadIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>;